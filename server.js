// ============================================================================
// IMPORTAÇÕES E CONFIGURAÇÃO INICIAL
// ============================================================================

// Framework web usado para criar o servidor HTTP e as rotas.
const express = require('express');
// Driver SQLite síncrono (ideal para aplicações locais simples e rápidas).
const Database = require('better-sqlite3');
// Módulo nativo do Node para criptografia (hash de senha, tokens, etc.).
const crypto = require('crypto');
// Módulo nativo para manipulação de arquivos (ler o .sql, servir HTMLs).
const fs = require('fs');
// Módulo nativo para caminhos de arquivo/diretório.
const path = require('path');

// Cria a instância do Express (o "app" que recebe as requisições HTTP).
const app = express();

// Middleware que faz o parse do corpo das requisições como JSON.
// O limite de '64kb' evita que alguém envie corpos gigantes (proteção básica).
app.use(express.json({ limit: '64kb' }));

// ============================================================================
// INICIALIZAÇÃO DO BANCO DE DADOS E MIGRAÇÕES
// ============================================================================

// Define o caminho do banco. Pode ser passado via variável de ambiente
// (útil para testes ou para guardar o banco em outro diretório).
// Caso não seja passado, usa 'os_system.sqlite' na mesma pasta do server.js.
const databasePath = process.env.DATABASE_PATH
    ? path.resolve(process.env.DATABASE_PATH)
    : path.join(__dirname, 'os_system.sqlite');

// Abre (ou cria) o banco SQLite.
const db = new Database(databasePath);

// Liga as chaves estrangeiras (o SQLite por padrão deixa desligado).
// Isso garante que REFERENCEs no schema sejam realmente respeitadas.
db.pragma('foreign_keys = ON');

// Executa o arquivo .sql de schema. O 'CREATE TABLE IF NOT EXISTS'
// garante que rodar isso várias vezes não quebra nada.
db.exec(fs.readFileSync(path.join(__dirname, 'mega-brain.sql'), 'utf8'));

// ----------------------------------------------------------------------------
// MIGRAÇÕES MANUAIS
// Como o sistema pode rodar em bancos antigos que não tinham essas colunas,
// o código abaixo adiciona colunas faltantes sem recriar a tabela.
// ----------------------------------------------------------------------------

// Lê as colunas atuais da tabela 'clientes'.
const clientColumns = new Set(db.pragma('table_info(clientes)').map(column => column.name));
// Se não existir 'telefone', adiciona.
if (!clientColumns.has('telefone')) db.exec('ALTER TABLE clientes ADD COLUMN telefone TEXT');
// Se não existir 'email', adiciona.
if (!clientColumns.has('email')) db.exec('ALTER TABLE clientes ADD COLUMN email TEXT');

// Lê as colunas atuais da tabela 'interacoes_cliente'.
const interactionColumns = new Set(db.pragma('table_info(interacoes_cliente)').map(column => column.name));
// Se a tabela não tiver 'autor_id', adiciona com FK para usuarios.
if (!interactionColumns.has('autor_id')) db.exec('ALTER TABLE interacoes_cliente ADD COLUMN autor_id INTEGER REFERENCES usuarios(id)');
// Se a tabela não tiver 'visibilidade', adiciona e marca notas antigas como internas.
if (!interactionColumns.has('visibilidade')) {
    db.exec("ALTER TABLE interacoes_cliente ADD COLUMN visibilidade TEXT NOT NULL DEFAULT 'publica' CHECK (visibilidade IN ('interna', 'publica'))");
    // Corrige dados antigos: notas internas continuam internas.
    db.exec("UPDATE interacoes_cliente SET visibilidade = 'interna' WHERE canal = 'Nota'");
}

// Cria um índice em 'sessoes.expira_em' para acelerar a limpeza de sessões antigas.
db.exec('CREATE INDEX IF NOT EXISTS idx_sessoes_expira ON sessoes(expira_em)');

// Loga o caminho do banco para o usuário saber onde os dados estão.
console.log(`Banco SQLite pronto: ${databasePath}`);

// ============================================================================
// CONSTANTES DE AUTENTICAÇÃO
// ============================================================================

// Nome do cookie HTTP usado para identificar a sessão do usuário.
const AUTH_COOKIE = 'os_session';

// Duração da sessão: 8 horas em segundos.
const SESSION_DURATION_SECONDS = 8 * 60 * 60;

// ============================================================================
// FUNÇÕES DE HASH E AUTENTICAÇÃO
// ============================================================================

/**
 * Gera o hash de uma senha usando scrypt.
 * Formato armazenado: "<sal_hex>:<hash_hex>"
 * Isso permite validar depois sem guardar a senha em texto puro.
 */
function hashSenha(senha) {
    const sal = crypto.randomBytes(16);           // sal aleatório de 16 bytes
    const hash = crypto.scryptSync(senha, sal, 64); // derivação com scrypt (64 bytes)
    return `${sal.toString('hex')}:${hash.toString('hex')}`;
}

/**
 * Compara a senha digitada com o hash armazenado.
 * Usa timingSafeEqual para evitar ataques de timing (comparação em tempo constante).
 */
function validarSenha(senha, senhaHash) {
    const [salHex, hashHex] = senhaHash.split(':');
    const hashSalvo = Buffer.from(hashHex, 'hex');
    const hashInformado = crypto.scryptSync(senha, Buffer.from(salHex, 'hex'), hashSalvo.length);
    return crypto.timingSafeEqual(hashInformado, hashSalvo);
}

/**
 * Extrai o token de sessão do header "Cookie" da requisição.
 * O cookie é enviado no formato: "outros=...; os_session=<token>; ..."
 * Retorna null se não existir.
 */
function tokenDaRequisicao(req) {
    const cookie = req.headers.cookie || '';
    const entrada = cookie.split(';').map(parte => parte.trim()).find(parte => parte.startsWith(`${AUTH_COOKIE}=`));
    return entrada ? decodeURIComponent(entrada.slice(AUTH_COOKIE.length + 1)) : null;
}

/**
 * Gera o hash SHA-256 de um token.
 * Nunca guardamos o token em texto puro no banco, apenas seu hash.
 * Se o banco vazar, os tokens não podem ser usados diretamente.
 */
function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Busca o usuário dono da sessão enviada na requisição.
 * Retorna null se: não há cookie, token inválido, sessão expirada ou usuário inativo.
 */
function buscarUsuarioDaRequisicao(req) {
    const token = tokenDaRequisicao(req);
    if (!token) return null;
    return db.prepare(`
        SELECT u.id, u.nome, u.email, u.papel, u.cliente_id, u.tecnico_id
        FROM sessoes s JOIN usuarios u ON u.id = s.usuario_id
        WHERE s.token_hash = ? AND s.expira_em > ? AND u.ativo = 1
    `).get(hashToken(token), Math.floor(Date.now() / 1000)) || null;
}

// ============================================================================
// MIDDLEWARE GLOBAL: CARREGA O USUÁRIO EM TODA REQUISIÇÃO
// ============================================================================

// Anexa req.user (ou null) a toda requisição. Assim qualquer rota sabe
// quem está logado sem precisar repetir essa lógica.
app.use((req, res, next) => {
    req.user = buscarUsuarioDaRequisicao(req);
    next();
});

// ============================================================================
// LIMPEZA PERIÓDICA DE SESSÕES EXPIRADAS
// ============================================================================

// A cada 1 hora, apaga sessões vencidas do banco para não crescer infinitamente.
// .unref() garante que esse timer não impede o processo de encerrar.
setInterval(() => {
    try {
        db.prepare('DELETE FROM sessoes WHERE expira_em <= ?').run(Math.floor(Date.now() / 1000));
    } catch (erro) {
        console.error('Falha ao limpar sessões expiradas:', erro.message);
    }
}, 60 * 60 * 1000).unref();

// ============================================================================
// MIDDLEWARE DE AUTORIZAÇÃO POR PAPEL
// ============================================================================

/**
 * Cria um middleware que exige que o usuário tenha um dos papéis informados.
 * Uso: app.get('/rota', exigirPapeis('admin', 'funcionario'), handler)
 */
function exigirPapeis(...papeis) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ erro: 'Entre para continuar.' });
        if (!papeis.includes(req.user.papel)) return res.status(403).json({ erro: 'Seu perfil não pode executar esta ação.' });
        next();
    };
}

// ============================================================================
// HELPERS AUXILIARES
// ============================================================================

/**
 * Garante que o body da requisição é um objeto.
 * Express 5 deixa req.body como undefined se não for JSON.
 * Isso evita erros ao desestruturar.
 */
function corpoSeguro(req) {
    return req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
}

/**
 * Cria uma nova sessão para o usuário e envia o cookie Set-Cookie.
 * O token em texto puro só vai para o navegador; o banco guarda apenas o hash.
 */
function emitirSessao(req, res, usuario) {
    const token = crypto.randomBytes(32).toString('hex'); // token aleatório de 32 bytes
    const expiraEm = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
    db.prepare('INSERT INTO sessoes (token_hash, usuario_id, expira_em) VALUES (?, ?, ?)')
        .run(hashToken(token), usuario.id, expiraEm);
    // 'Secure' só é adicionado se a requisição veio por HTTPS (req.secure).
    const seguranca = req.secure ? '; Secure' : '';
    res.setHeader('Set-Cookie', `${AUTH_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_DURATION_SECONDS}${seguranca}`);
}

/**
 * Filtra dados do usuário que podem ser expostos ao frontend.
 * Nunca retornamos 'senha_hash' nem 'cliente_id'/'tecnico_id' diretamente
 * (evita vazamento de dados internos).
 */
function dadosPublicosUsuario(usuario) {
    return { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel };
}

// ============================================================================
// ROTAS DE AUTENTICAÇÃO
// ============================================================================

/**
 * GET /api/auth/status
 * Diz se o sistema já tem pelo menos um usuário cadastrado.
 * O frontend usa isso para decidir entre mostrar tela de login ou de setup.
 */
app.get('/api/auth/status', (req, res) => {
    try {
        const usuarios = db.prepare('SELECT COUNT(*) AS total FROM usuarios').get().total;
        res.json({ configurado: usuarios > 0 });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

/**
 * POST /api/auth/setup
 * Cria o primeiro admin. Só funciona se o banco estiver vazio.
 * Autentica o usuário automaticamente após criar.
 */
app.post('/api/auth/setup', (req, res) => {
    const body = corpoSeguro(req);
    const nome = typeof body.nome === 'string' ? body.nome.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const senha = typeof body.senha === 'string' ? body.senha : '';

    // Se já houver qualquer usuário, não permite refazer o setup.
    if (db.prepare('SELECT 1 FROM usuarios LIMIT 1').get()) {
        return res.status(409).json({ erro: 'A configuração inicial já foi concluída.' });
    }
    // Validações básicas: nome, e-mail válido e senha forte (12+ chars).
    if (!nome || !email.includes('@') || senha.length < 12) {
        return res.status(400).json({ erro: 'Informe nome, e-mail válido e senha com pelo menos 12 caracteres.' });
    }

    try {
        // Transação: garante que checagem + insert sejam atômicos,
        // evitando corrida entre duas requisições simultâneas de setup.
        const usuarioId = db.transaction(() => {
            if (db.prepare('SELECT 1 FROM usuarios LIMIT 1').get()) throw new Error('A configuração inicial já foi concluída.');
            const resultado = db.prepare(`
                INSERT INTO usuarios (nome, email, senha_hash, papel)
                VALUES (?, ?, ?, 'admin')
            `).run(nome, email, hashSenha(senha));
            return Number(resultado.lastInsertRowid);
        })();
        const usuario = db.prepare('SELECT id, nome, email, papel FROM usuarios WHERE id = ?').get(usuarioId);
        emitirSessao(req, res, usuario); // já loga o usuário
        res.status(201).json({ usuario: dadosPublicosUsuario(usuario) });
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
    }
});

/**
 * POST /api/auth/login
 * Valida e-mail + senha e cria uma nova sessão.
 */
app.post('/api/auth/login', (req, res) => {
    const body = corpoSeguro(req);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const senha = typeof body.senha === 'string' ? body.senha : '';
    if (!email || !senha) {
        return res.status(400).json({ erro: 'Informe seu e-mail e sua senha.' });
    }
    try {
        // Busca usuário ativo pelo e-mail.
        const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ? AND ativo = 1').get(email);
        // Se não achar OU a senha não bater, retorna erro genérico
        // (evita revelar se o e-mail existe — boa prática de segurança).
        if (!usuario || !validarSenha(senha, usuario.senha_hash)) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
        }
        // Aproveita para limpar sessões expiradas.
        db.prepare('DELETE FROM sessoes WHERE expira_em <= ?').run(Math.floor(Date.now() / 1000));
        emitirSessao(req, res, usuario);
        res.json({ usuario: dadosPublicosUsuario(usuario) });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

/**
 * POST /api/auth/logout
 * Invalida o token no banco e limpa o cookie no navegador.
 */
app.post('/api/auth/logout', (req, res) => {
    try {
        const token = tokenDaRequisicao(req);
        if (token) db.prepare('DELETE FROM sessoes WHERE token_hash = ?').run(hashToken(token));
    } catch (erro) {
        console.error('Falha ao encerrar sessão:', erro.message);
    }
    // Cookie com Max-Age=0 é o jeito padrão de apagar no navegador.
    res.setHeader('Set-Cookie', `${AUTH_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);
    res.json({ ok: true });
});

/**
 * GET /api/auth/me
 * Retorna os dados do usuário logado. Se não houver sessão, 401.
 */
app.get('/api/auth/me', (req, res) => {
    if (!req.user) return res.status(401).json({ erro: 'Sessão encerrada.' });
    res.json({ usuario: dadosPublicosUsuario(req.user) });
});

// ============================================================================
// PROTEÇÃO DAS PÁGINAS HTML
// ============================================================================

// Mapeia cada HTML protegido aos papéis que podem acessá-lo.
// Qualquer tentativa de acessar sem sessão redireciona para /index.html.
const paginasProtegidas = {
    'dashboard': ['admin', 'funcionario'],
    'cadastros': ['admin', 'funcionario'],
    'lista': ['admin', 'funcionario'],
    'tecnicos': ['admin'],
    'clientes': ['admin', 'funcionario'],
    'detalhes': ['admin', 'funcionario', 'cliente'],
    'usuarios': ['admin'],
    'portal-cliente': ['cliente']
};

// Página de login é pública.
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// Registra rotas para cada página protegida.
for (const [pagina, papeis] of Object.entries(paginasProtegidas)) {
    app.get(`/${pagina}.html`, (req, res) => {
        if (!req.user) return res.redirect('/index.html');
        if (!papeis.includes(req.user.papel)) {
            // Redireciona para a home apropriada ao papel do usuário.
            return res.redirect(req.user.papel === 'cliente' ? '/portal-cliente.html' : '/dashboard.html');
        }
        res.sendFile(path.join(__dirname, `${pagina}.html`));
    });
}

// Serve arquivos estáticos das pastas /css e /js.
// index: false evita que acessar /css/ liste arquivos.
app.use('/css', express.static(path.join(__dirname, 'css'), { index: false }));
app.use('/js', express.static(path.join(__dirname, 'js'), { index: false }));

// Rota raiz: manda para a home correta dependendo do papel.
app.get('/', (req, res) => {
    if (!req.user) return res.redirect('/index.html');
    res.redirect(req.user.papel === 'cliente' ? '/portal-cliente.html' : '/dashboard.html');
});

// A partir daqui, TODA requisição /api/* exige algum usuário logado.
app.use('/api', exigirPapeis('admin', 'funcionario', 'cliente'));

// ============================================================================
// CONTROLE DE ACESSO POR ORDEM
// ============================================================================

/**
 * Diz se o usuário pode acessar uma ordem específica.
 * - admin: sempre pode
 * - funcionario: só se for o técnico responsável
 * - cliente: só se for o cliente dono da ordem
 */
function podeAcessarOrdem(usuario, ordemId) {
    if (usuario.papel === 'admin') return true;
    const ordem = db.prepare('SELECT cliente_id, tecnico_id FROM ordens_servico WHERE id = ?').get(ordemId);
    if (!ordem) return false;
    if (usuario.papel === 'cliente') return ordem.cliente_id === usuario.cliente_id;
    return usuario.papel === 'funcionario' && ordem.tecnico_id === usuario.tecnico_id;
}

// ============================================================================
// ROTAS DE USUÁRIOS (apenas admin)
// ============================================================================

/**
 * GET /api/usuarios
 * Lista todos os usuários com nome do cliente/técnico vinculado.
 */
app.get('/api/usuarios', exigirPapeis('admin'), (req, res) => {
    try {
        const usuarios = db.prepare(`
            SELECT u.id, u.nome, u.email, u.papel, u.ativo,
                   c.nome AS cliente, t.nome AS tecnico
            FROM usuarios u
            LEFT JOIN clientes c ON c.id = u.cliente_id
            LEFT JOIN tecnicos t ON t.id = u.tecnico_id
            ORDER BY u.criado_em DESC
        `).all();
        res.json(usuarios);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

/**
 * POST /api/usuarios
 * Cria uma nova conta. O vínculo (cliente_id ou tecnico_id) é obrigatório
 * quando o papel não é 'admin'.
 */
app.post('/api/usuarios', exigirPapeis('admin'), (req, res) => {
    const body = corpoSeguro(req);
    const { nome, email, senha, papel, cliente_id, tecnico_id } = body;

    // Sanitiza strings e valida formato.
    const nomeLimpo = typeof nome === 'string' ? nome.trim() : '';
    const emailLimpo = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!nomeLimpo || !emailLimpo.includes('@') || typeof senha !== 'string' || senha.length < 12) {
        return res.status(400).json({ erro: 'Informe nome, e-mail válido e senha com pelo menos 12 caracteres.' });
    }
    if (!['admin', 'funcionario', 'cliente'].includes(papel)) {
        return res.status(400).json({ erro: 'Selecione um perfil válido.' });
    }

    // Valida vínculo: precisa existir na tabela correspondente.
    let vinculoId = null;
    if (papel !== 'admin') {
        vinculoId = Number(papel === 'cliente' ? cliente_id : tecnico_id);
        const tabelaVinculo = papel === 'cliente' ? 'clientes' : 'tecnicos';
        if (!Number.isInteger(vinculoId) || !db.prepare(`SELECT id FROM ${tabelaVinculo} WHERE id = ?`).get(vinculoId)) {
            return res.status(400).json({ erro: 'Selecione um registro válido para vincular a conta.' });
        }
    }

    try {
        // Insere com colunas diferentes dependendo do papel.
        let resultado;
        if (papel === 'admin') {
            resultado = db.prepare('INSERT INTO usuarios (nome, email, senha_hash, papel) VALUES (?, ?, ?, ?)')
                .run(nomeLimpo, emailLimpo, hashSenha(senha), papel);
        } else if (papel === 'cliente') {
            resultado = db.prepare('INSERT INTO usuarios (nome, email, senha_hash, papel, cliente_id) VALUES (?, ?, ?, ?, ?)')
                .run(nomeLimpo, emailLimpo, hashSenha(senha), papel, vinculoId);
        } else {
            resultado = db.prepare('INSERT INTO usuarios (nome, email, senha_hash, papel, tecnico_id) VALUES (?, ?, ?, ?, ?)')
                .run(nomeLimpo, emailLimpo, hashSenha(senha), papel, vinculoId);
        }
        res.status(201).json({ id: Number(resultado.lastInsertRowid), mensagem: 'Conta criada.' });
    } catch (erro) {
        // Converte o erro de UNIQUE em mensagem amigável.
        res.status(400).json({ erro: erro.message.includes('UNIQUE') ? 'Este e-mail já possui uma conta.' : erro.message });
    }
});

/**
 * PATCH /api/usuarios/:id/status
 * Ativa/suspende uma conta. Ao suspender, apaga as sessões ativas do usuário.
 */
app.patch('/api/usuarios/:id/status', exigirPapeis('admin'), (req, res) => {
    const usuarioId = Number(req.params.id);
    const body = corpoSeguro(req);
    const ativo = body.ativo;

    if (!Number.isInteger(usuarioId) || typeof ativo !== 'boolean') {
        return res.status(400).json({ erro: 'Informe um usuário e um status válido.' });
    }
    // Impede o admin de se autossuspender (evita se trancar fora do sistema).
    if (usuarioId === req.user.id && !ativo) {
        return res.status(400).json({ erro: 'Não é possível suspender a própria conta.' });
    }

    try {
        const resultado = db.prepare('UPDATE usuarios SET ativo = ? WHERE id = ?').run(ativo ? 1 : 0, usuarioId);
        if (!resultado.changes) return res.status(404).json({ erro: 'Usuário não encontrado.' });
        // Ao suspender, derruba todas as sessões ativas do usuário imediatamente.
        if (!ativo) db.prepare('DELETE FROM sessoes WHERE usuario_id = ?').run(usuarioId);
        res.json({ mensagem: ativo ? 'Conta reativada.' : 'Conta suspensa.' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// ============================================================================
// ROTAS DE ORDENS DE SERVIÇO
// ============================================================================

/**
 * GET /api/ordens
 * Lista ordens respeitando o papel do usuário:
 * - admin: todas
 * - funcionario: só as do seu tecnico_id
 * - cliente: só as do seu cliente_id
 */
app.get('/api/ordens', (req, res) => {
    try {
        let sql = `
            SELECT o.id, c.nome AS cliente, c.telefone AS cliente_telefone,
                   c.email AS cliente_email, t.nome AS tecnico,
                   o.equipamento, o.prioridade, o.status, o.descricao,
                   o.aberta_em
            FROM ordens_servico o
            JOIN clientes c ON c.id = o.cliente_id
            LEFT JOIN tecnicos t ON t.id = o.tecnico_id
        `;
        const params = [];
        if (req.user.papel === 'cliente') {
            sql += ' WHERE o.cliente_id = ?';
            params.push(req.user.cliente_id);
        } else if (req.user.papel === 'funcionario') {
            sql += ' WHERE o.tecnico_id = ?';
            params.push(req.user.tecnico_id);
        }
        sql += ' ORDER BY o.id DESC';
        res.json(db.prepare(sql).all(...params));
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

/**
 * GET /api/ordens/:id
 * Retorna todos os dados de uma ordem (incluindo diagnóstico e datas).
 * Antes verifica se o usuário tem permissão para acessá-la.
 */
app.get('/api/ordens/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT o.*, c.nome AS cliente, c.telefone AS cliente_telefone,
               c.email AS cliente_email, t.nome AS tecnico
        FROM ordens_servico o
        JOIN clientes c ON c.id = o.cliente_id
        LEFT JOIN tecnicos t ON t.id = o.tecnico_id
        WHERE o.id = ?
    `;
    try {
        if (!db.prepare('SELECT id FROM ordens_servico WHERE id = ?').get(id)) {
            return res.status(404).json({ erro: 'OS não encontrada' });
        }
        if (!podeAcessarOrdem(req.user, id)) return res.status(403).json({ erro: 'Esta ordem não pertence ao seu perfil.' });
        const ordem = db.prepare(sql).get(id);
        if (!ordem) return res.status(404).json({ erro: 'OS não encontrada' });
        res.json(ordem);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// ============================================================================
// ROTAS DE INTERAÇÕES (histórico/comentários da ordem)
// ============================================================================

/**
 * GET /api/ordens/:id/interacoes
 * Lista o histórico da ordem. Clientes só veem interações públicas
 * (notas internas ficam ocultas).
 */
app.get('/api/ordens/:id/interacoes', (req, res) => {
    try {
        const ordem = db.prepare('SELECT id FROM ordens_servico WHERE id = ?').get(req.params.id);
        if (!ordem) return res.status(404).json({ erro: 'OS não encontrada' });
        if (!podeAcessarOrdem(req.user, ordem.id)) return res.status(403).json({ erro: 'Esta ordem não pertence ao seu perfil.' });

        // Clientes não veem notas internas.
        const sql = `
            SELECT id, canal, mensagem, criado_em
            FROM interacoes_cliente
            WHERE ordem_id = ? ${req.user.papel === 'cliente' ? "AND visibilidade = 'publica'" : ''}
            ORDER BY criado_em DESC, id DESC
        `;
        res.json(db.prepare(sql).all(ordem.id));
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

/**
 * POST /api/ordens/:id/interacoes
 * Cria uma nova interação (nota, atualização ou mensagem via WhatsApp).
 * - admin/funcionario: podem escolher o canal; 'Nota' fica interna.
 * - cliente: sempre vira 'Atualização' pública.
 */
app.post('/api/ordens/:id/interacoes', (req, res) => {
    const body = corpoSeguro(req);
    const mensagem = typeof body.mensagem === 'string' ? body.mensagem.trim() : '';
    const canalInformado = typeof body.canal === 'string' ? body.canal : 'Nota';
    const canaisPermitidos = ['Nota', 'WhatsApp', 'Atualização'];

    // Validações do conteúdo.
    if (!mensagem) return res.status(400).json({ erro: 'Escreva uma mensagem antes de salvar.' });
    if (mensagem.length > 2000) return res.status(400).json({ erro: 'A mensagem deve ter até 2.000 caracteres.' });
    if (!canaisPermitidos.includes(canalInformado)) {
        return res.status(400).json({ erro: 'Canal de interação inválido.' });
    }

    try {
        const ordem = db.prepare('SELECT id FROM ordens_servico WHERE id = ?').get(req.params.id);
        if (!ordem) return res.status(404).json({ erro: 'OS não encontrada' });
        if (!podeAcessarOrdem(req.user, ordem.id)) return res.status(403).json({ erro: 'Esta ordem não pertence ao seu perfil.' });

        // Se for cliente, força canal 'Atualização' independente do que enviou.
        const canalSeguro = req.user.papel === 'cliente' ? 'Atualização' : canalInformado;
        // 'Nota' é sempre interna; os outros canais são públicos.
        const visibilidade = canalSeguro === 'Nota' ? 'interna' : 'publica';

        const resultado = db.prepare(`
            INSERT INTO interacoes_cliente (ordem_id, autor_id, canal, visibilidade, mensagem)
            VALUES (?, ?, ?, ?, ?)
        `).run(ordem.id, req.user.id, canalSeguro, visibilidade, mensagem);
        res.status(201).json({ id: Number(resultado.lastInsertRowid), mensagem: 'Interação registrada.' });
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
    }
});

// ============================================================================
// CRIAÇÃO DE ORDEM
// ============================================================================

/**
 * POST /api/ordens
 * Cria uma nova ordem de serviço (admin ou funcionario).
 *
 * Comportamentos automáticos:
 * - Se o cliente não existir, é criado.
 * - Se o técnico (informado por admin) não existir, é criado com dados temporários.
 * - Funcionário só pode criar ordem para si mesmo (tecnico_id forçado).
 */
app.post('/api/ordens', exigirPapeis('admin', 'funcionario'), (req, res) => {
    const body = corpoSeguro(req);
    const cliente_nome = typeof body.cliente_nome === 'string' ? body.cliente_nome.trim() : '';
    const cliente_telefone = typeof body.cliente_telefone === 'string' ? body.cliente_telefone.trim() : '';
    const cliente_email = typeof body.cliente_email === 'string' ? body.cliente_email.trim() : '';
    const equipamento = typeof body.equipamento === 'string' ? body.equipamento.trim() : '';
    const tecnico_nome = typeof body.tecnico_nome === 'string' ? body.tecnico_nome.trim() : '';
    const prioridade = typeof body.prioridade === 'string' ? body.prioridade : 'Média';
    const descricao = typeof body.descricao === 'string' ? body.descricao.trim() : '';

    // Validações de entrada.
    if (!cliente_nome) return res.status(400).json({ erro: 'Informe o nome do cliente.' });
    if (!equipamento) return res.status(400).json({ erro: 'Informe o equipamento.' });
    if (descricao.length < 10) return res.status(400).json({ erro: 'Descreva o problema com pelo menos 10 caracteres.' });
    if (!['Baixa', 'Média', 'Alta'].includes(prioridade)) {
        return res.status(400).json({ erro: 'Prioridade inválida.' });
    }

    try {
        // Transação: cliente + técnico + ordem tudo junto (atomicamente).
        const ordemId = db.transaction(() => {
            // 1) Cliente: busca ou cria.
            let cliente = db.prepare('SELECT id FROM clientes WHERE nome = ?').get(cliente_nome);
            if (!cliente) {
                const resultado = db.prepare(
                    'INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)'
                ).run(cliente_nome, cliente_telefone || null, cliente_email || null);
                cliente = { id: Number(resultado.lastInsertRowid) };
            } else if (cliente_telefone || cliente_email) {
                // Se já existe, atualiza contato apenas se vier preenchido (COALESCE).
                db.prepare(`
                    UPDATE clientes
                    SET telefone = COALESCE(?, telefone), email = COALESCE(?, email)
                    WHERE id = ?
                `).run(cliente_telefone || null, cliente_email || null, cliente.id);
            }

            // 2) Técnico: funcionário sempre usa o próprio; admin pode informar nome.
            let tecnicoId = req.user.papel === 'funcionario' ? req.user.tecnico_id : null;
            if (req.user.papel === 'admin' && tecnico_nome) {
                let tecnico = db.prepare('SELECT id FROM tecnicos WHERE nome = ?').get(tecnico_nome);
                if (!tecnico) {
                    // Cria um técnico "fantasma" para permitir cadastro rápido via OS.
                    const slug = tecnico_nome
                        .toLowerCase()
                        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
                        .replace(/[^a-z0-9]/g, '');                       // remove símbolos
                    const emailTemp = `${slug || 'tecnico'}-${Date.now()}@temp.local`;
                    const resultado = db.prepare(
                        "INSERT INTO tecnicos (nome, email, telefone, especialidade) VALUES (?, ?, '0000', 'Geral')"
                    ).run(tecnico_nome, emailTemp);
                    tecnico = { id: Number(resultado.lastInsertRowid) };
                }
                tecnicoId = tecnico.id;
            }

            // 3) Cria a OS com status 'Aberta'.
            const resultado = db.prepare(`
                INSERT INTO ordens_servico
                (cliente_id, tecnico_id, equipamento, prioridade, descricao, status)
                VALUES (?, ?, ?, ?, ?, 'Aberta')
            `).run(cliente.id, tecnicoId, equipamento, prioridade, descricao);
            return Number(resultado.lastInsertRowid);
        })();

        res.status(201).json({ mensagem: 'OS criada com sucesso!', id: ordemId });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// ============================================================================
// ATUALIZAÇÃO DE STATUS/DIAGNÓSTICO
// ============================================================================

/**
 * PUT /api/ordens/:id/status
 * Atualiza o status e o diagnóstico da ordem.
 * - Ao concluir/cancelar, preenche 'fechada_em'.
 * - Se houver diagnóstico, cria uma interação pública ('Atualização').
 */
app.put('/api/ordens/:id/status', exigirPapeis('admin', 'funcionario'), (req, res) => {
    const { id } = req.params;
    const body = corpoSeguro(req);
    const status = body.status;
    const diagnostico = typeof body.diagnostico === 'string' ? body.diagnostico.trim() : '';

    try {
        const ordemExiste = db.prepare('SELECT id FROM ordens_servico WHERE id = ?').get(id);
        if (!ordemExiste) return res.status(404).json({ erro: 'OS não encontrada' });
        if (!podeAcessarOrdem(req.user, id)) return res.status(403).json({ erro: 'Esta ordem não está atribuída ao seu perfil.' });
        if (!['Aberta', 'Em execução', 'Concluída', 'Cancelada'].includes(status)) {
            return res.status(400).json({ erro: 'Status inválido.' });
        }

        // Atualização do status + registro do diagnóstico no histórico (transação).
        db.transaction(() => {
            db.prepare(`
                UPDATE ordens_servico
                SET status = ?,
                    diagnostico = ?,
                    fechada_em = CASE WHEN ? IN ('Concluída','Cancelada') THEN CURRENT_TIMESTAMP ELSE NULL END
                WHERE id = ?
            `).run(status, diagnostico || null, status, id);
            if (diagnostico) {
                db.prepare(`
                    INSERT INTO interacoes_cliente (ordem_id, autor_id, canal, visibilidade, mensagem)
                    VALUES (?, ?, 'Atualização', 'publica', ?)
                `).run(id, req.user.id, diagnostico);
            }
        })();
        res.json({ mensagem: 'OS atualizada com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// ============================================================================
// ROTAS DE TÉCNICOS
// ============================================================================

/**
 * GET /api/tecnicos
 * Lista apenas os nomes dos técnicos (para autocomplete, por exemplo).
 */
app.get('/api/tecnicos', exigirPapeis('admin', 'funcionario'), (req, res) => {
    try {
        res.json(db.prepare('SELECT nome FROM tecnicos ORDER BY nome ASC').all());
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

/**
 * POST /api/tecnicos
 * Cadastra um novo técnico. Apenas admin.
 */
app.post('/api/tecnicos', exigirPapeis('admin'), (req, res) => {
    const body = corpoSeguro(req);
    const { nome, email, telefone, especialidade } = body;

    // Valida tipo e conteúdo de todos os campos obrigatórios.
    if (typeof nome !== 'string' || !nome.trim()
        || typeof email !== 'string' || !email.includes('@')
        || typeof telefone !== 'string' || !telefone.trim()
        || typeof especialidade !== 'string' || !especialidade.trim()) {
        return res.status(400).json({ erro: 'Preencha nome, e-mail válido, telefone e especialidade.' });
    }

    try {
        // Verifica duplicidade de e-mail antes de inserir.
        const tecnicoExistente = db.prepare('SELECT id FROM tecnicos WHERE email = ?').get(email.trim().toLowerCase());
        if (tecnicoExistente) {
            return res.status(400).json({ erro: 'Este e-mail já está cadastrado.' });
        }

        const resultado = db.prepare(
            'INSERT INTO tecnicos (nome, email, telefone, especialidade) VALUES (?, ?, ?, ?)'
        ).run(nome.trim(), email.trim().toLowerCase(), telefone.trim(), especialidade.trim());
        res.json({ mensagem: 'Técnico cadastrado!', id: Number(resultado.lastInsertRowid) });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

/**
 * GET /api/tecnicos/lista
 * Lista técnicos com todos os campos (para selects com nome/ID).
 * Apenas admin.
 */
app.get('/api/tecnicos/lista', exigirPapeis('admin'), (req, res) => {
    try {
        res.json(db.prepare(
            'SELECT id, nome, email, telefone, especialidade FROM tecnicos ORDER BY nome ASC'
        ).all());
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// ============================================================================
// ROTA DO DASHBOARD (métricas agregadas)
// ============================================================================

/**
 * GET /api/dashboard
 * Retorna indicadores agregados. Funcionário vê apenas as próprias ordens.
 * Usa SUM(condição) para contar linhas que satisfazem a condição (SQLite
 * trata booleano como 1/0, então a soma funciona como contagem).
 */
app.get('/api/dashboard', exigirPapeis('admin', 'funcionario'), (req, res) => {
    try {
        const filtro = req.user.papel === 'funcionario' ? 'WHERE tecnico_id = ?' : '';
        const parametros = req.user.papel === 'funcionario' ? [req.user.tecnico_id] : [];

        // Resumo geral (uma única query com múltiplos agregados).
        const resumo = db.prepare(`
            SELECT COUNT(*) AS total_os,
                   COALESCE(SUM(status = 'Aberta'), 0) AS os_abertas,
                   COALESCE(SUM(status = 'Em execução'), 0) AS em_execucao,
                   COALESCE(SUM(status = 'Concluída'), 0) AS concluidas,
                   COALESCE(SUM(prioridade = 'Alta' AND status IN ('Aberta', 'Em execução')), 0) AS alta_prioridade,
                   COALESCE(SUM(status IN ('Aberta', 'Em execução') AND datetime(aberta_em) <= datetime('now', '-48 hours')), 0) AS aguardando_48h,
                   COALESCE(SUM(tecnico_id IS NULL AND status IN ('Aberta', 'Em execução')), 0) AS sem_responsavel
            FROM ordens_servico ${filtro}
        `).get(...parametros);

        // Distribuição por status (agrupamento).
        const distribuicao = db.prepare(`
            SELECT status, COUNT(*) AS total
            FROM ordens_servico ${filtro}
            GROUP BY status
        `).all(...parametros);

        res.json({ ...resumo, distribuicao, atualizado_em: new Date().toISOString() });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// ============================================================================
// ROTA DE CLIENTES (com contagem de ordens)
// ============================================================================

/**
 * GET /api/clientes
 * Lista todos os clientes com: total de OS, OS ativas e data da última OS.
 */
app.get('/api/clientes', exigirPapeis('admin', 'funcionario'), (req, res) => {
    try {
        const clientes = db.prepare(`
            SELECT c.id, c.nome, c.telefone, c.email,
                   COUNT(o.id) AS total_os,
                   COALESCE(SUM(o.status IN ('Aberta', 'Em execução')), 0) AS os_ativas,
                   MAX(o.aberta_em) AS ultima_os
            FROM clientes c
            LEFT JOIN ordens_servico o ON o.cliente_id = c.id
            GROUP BY c.id
            ORDER BY c.nome COLLATE NOCASE
        `).all();
        res.json(clientes);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// ============================================================================
// TRATAMENTO GLOBAL DE ERROS
// ============================================================================

// Middleware de erro do Express: garante que toda falha retorne JSON
// (nunca HTML de erro, que quebraria o frontend).
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    // JSON malformado no corpo da requisição.
    if (err && (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && err.status === 400))) {
        return res.status(400).json({ erro: 'Corpo da requisição não é um JSON válido.' });
    }
    // Corpo maior que o limite (64kb).
    if (err && err.type === 'entity.too.large') {
        return res.status(413).json({ erro: 'Requisição muito grande.' });
    }
    console.error('Erro não tratado:', err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
});

// ============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================================

// Porta configurável via env (padrão: 3001).
const PORT = Number(process.env.PORT) || 3001;

// Escuta somente em 127.0.0.1 (localhost) por segurança.
// Para expor na rede, troque por '0.0.0.0' (com cautela).
app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});