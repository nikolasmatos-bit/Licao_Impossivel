'use strict';
const express = require('express');
const Database = require('better-sqlite3');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json({ limit: '64kb' }));

const databasePath = process.env.DATABASE_PATH ? path.resolve(process.env.DATABASE_PATH) : path.join(__dirname, 'os_system.sqlite');
const db = new Database(databasePath);
db.pragma('foreign_keys = ON');
db.exec(fs.readFileSync(path.join(__dirname, 'mega-brain.sql'), 'utf8'));
// Protege notas antigas gravadas antes de existir a regra de visibilidade.
db.prepare("UPDATE interacoes_cliente SET visibilidade = 'interna' WHERE canal = 'Nota' AND visibilidade = 'publica'").run();

const AUTH_COOKIE = 'os_session';
const SESSION_DURATION_SECONDS = 8 * 60 * 60;
const PAPEIS = ['admin', 'funcionario', 'cliente'];
const STATUS = ['Aberta', 'Em execução', 'Concluída', 'Cancelada'];
const PRIORIDADES = ['Baixa', 'Média', 'Alta'];
const CANAIS = ['Nota', 'WhatsApp', 'Atualização'];
const finalizada = status => status === 'Concluída' || status === 'Cancelada';
const corpo = req => req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
const texto = valor => typeof valor === 'string' ? valor.trim() : '';
const emailNormalizado = valor => texto(valor).toLowerCase();
const idValido = valor => /^\d+$/.test(String(valor)) && Number.isSafeInteger(Number(valor)) && Number(valor) > 0 ? Number(valor) : null;
const emailValido = valor => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

class ErroEntrada extends Error {
    constructor(mensagem, status = 400) {
        super(mensagem);
        this.status = status;
    }
}

function falha(res, status, mensagem) { return res.status(status).json({ erro: mensagem }); }
function falhaBanco(res, erro, mensagem = 'Não foi possível concluir a operação.') {
    if (erro.code?.startsWith('SQLITE_CONSTRAINT_UNIQUE')) return falha(res, 409, 'E-mail já cadastrado.');
    if (erro.code?.startsWith('SQLITE_CONSTRAINT_FOREIGNKEY')) return falha(res, 409, 'Registro vinculado a outros dados.');
    if (erro.code?.startsWith('SQLITE_CONSTRAINT')) return falha(res, 400, 'Dados inválidos ou incompatíveis.');
    console.error('Erro no banco:', erro);
    return falha(res, 500, mensagem);
}
function validarCredenciais(dados) {
    const nome = texto(dados.nome);
    const email = emailNormalizado(dados.email);
    const senha = dados.senha;
    if (!nome || nome.length > 200 || !emailValido(email) || email.length > 254 || typeof senha !== 'string' || senha.length < 12) {
        return null;
    }
    return { nome, email, senha };
}
function hashSenha(senha) {
    const sal = crypto.randomBytes(16);
    const hash = crypto.scryptSync(senha, sal, 64);
    return `${sal.toString('hex')}:${hash.toString('hex')}`;
}
function validarSenha(senha, senhaHash) {
    if (typeof senha !== 'string') return false;
    try {
        const [salHex, hashHex] = String(senhaHash || '').split(':');
        if (!salHex || !hashHex) return false;
        const hashSalvo = Buffer.from(hashHex, 'hex');
        if (!hashSalvo.length) return false;
        const informado = crypto.scryptSync(senha, Buffer.from(salHex, 'hex'), hashSalvo.length);
        return crypto.timingSafeEqual(informado, hashSalvo);
    } catch { return false; }
}
function tokenDaRequisicao(req) {
    const entrada = (req.headers.cookie || '').split(';').map(p => p.trim()).find(p => p.startsWith(`${AUTH_COOKIE}=`));
    if (!entrada) return null;
    try { return decodeURIComponent(entrada.slice(AUTH_COOKIE.length + 1)); } catch { return null; }
}
function hashToken(token) { return crypto.createHash('sha256').update(token).digest('hex'); }
function buscarUsuarioDaRequisicao(req) {
    const token = tokenDaRequisicao(req);
    if (!token) return null;
    return db.prepare(`SELECT u.id, u.nome, u.email, u.papel, u.cliente_id, u.tecnico_id
        FROM sessoes s JOIN usuarios u ON u.id = s.usuario_id
        WHERE s.token_hash = ? AND s.expira_em > ? AND u.ativo = 1`).get(hashToken(token), Math.floor(Date.now() / 1000)) || null;
}
app.use((req, res, next) => { req.user = buscarUsuarioDaRequisicao(req); next(); });
function exigirPapeis(...papeis) {
    return (req, res, next) => {
        if (!req.user) return falha(res, 401, 'Entre para continuar.');
        if (!papeis.includes(req.user.papel)) return falha(res, 403, 'Sem permissão.');
        next();
    };
}
function emitirSessao(res, usuario) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiraEm = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
    db.prepare('INSERT INTO sessoes (token_hash, usuario_id, expira_em) VALUES (?, ?, ?)').run(hashToken(token), usuario.id, expiraEm);
    res.setHeader('Set-Cookie', `${AUTH_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_DURATION_SECONDS}`);
}
function encontrarCliente(id) { return db.prepare('SELECT * FROM clientes WHERE id = ?').get(id); }
function encontrarTecnico(id) { return db.prepare('SELECT * FROM tecnicos WHERE id = ?').get(id); }
function usuarioPorId(id) { return db.prepare('SELECT id, nome, email, papel, cliente_id, tecnico_id, ativo FROM usuarios WHERE id = ?').get(id); }

// Primeira instalação: somente o primeiro usuário pode configurar a conta administradora.
app.get('/api/auth/status', (req, res) => {
    res.json({ configurado: db.prepare('SELECT COUNT(*) AS total FROM usuarios').get().total > 0 });
});
app.post('/api/auth/setup', (req, res) => {
    const dados = validarCredenciais(corpo(req));
    if (!dados) return falha(res, 400, 'Informe nome, e-mail válido e senha com pelo menos 12 caracteres.');
    try {
        const usuario = db.transaction(() => {
            if (db.prepare('SELECT COUNT(*) AS total FROM usuarios').get().total) return null;
            const r = db.prepare('INSERT INTO usuarios (nome, email, senha_hash, papel) VALUES (?, ?, ?, ?)')
                .run(dados.nome, dados.email, hashSenha(dados.senha), 'admin');
            return usuarioPorId(Number(r.lastInsertRowid));
        })();
        if (!usuario) return falha(res, 409, 'A configuração inicial já foi concluída.');
        emitirSessao(res, usuario);
        res.status(201).json({ usuario });
    } catch (erro) { falhaBanco(res, erro); }
});
app.post('/api/auth/register', (req, res) => {
    const entrada = corpo(req);
    if (entrada.papel !== 'cliente') return falha(res, 400, 'Escolha um perfil válido: apenas cliente pode se cadastrar publicamente.');
    if (!db.prepare('SELECT COUNT(*) AS total FROM usuarios').get().total) return falha(res, 409, 'Configure a conta administradora primeiro.');
    const dados = validarCredenciais(entrada);
    if (!dados) return falha(res, 400, 'Informe nome, e-mail válido e senha com pelo menos 12 caracteres.');
    const telefone = texto(entrada.telefone) || null;
    try {
        const usuario = db.transaction(() => {
            if (db.prepare('SELECT id FROM usuarios WHERE email = ?').get(dados.email)) return null;
            // O e-mail informado no cadastro público não comprova a identidade do cliente.
            // A equipe deve criar o acesso vinculado quando já existe um cadastro.
            if (db.prepare('SELECT id FROM clientes WHERE email = ? COLLATE NOCASE LIMIT 1').get(dados.email)) {
                throw new ErroEntrada('Já existe um cadastro para este e-mail. Solicite à equipe a criação do acesso ao portal.', 409);
            }
            const c = db.prepare('INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)').run(dados.nome, telefone, dados.email);
            const u = db.prepare('INSERT INTO usuarios (nome, email, senha_hash, papel, cliente_id) VALUES (?, ?, ?, ?, ?)')
                .run(dados.nome, dados.email, hashSenha(dados.senha), 'cliente', Number(c.lastInsertRowid));
            return usuarioPorId(Number(u.lastInsertRowid));
        })();
        if (!usuario) return falha(res, 409, 'Este e-mail já está em uso.');
        emitirSessao(res, usuario);
        res.status(201).json({ usuario });
    } catch (erro) {
        if (erro instanceof ErroEntrada) return falha(res, erro.status, erro.message);
        falhaBanco(res, erro);
    }
});
app.post('/api/auth/login', (req, res) => {
    const dados = corpo(req);
    const email = emailNormalizado(dados.email);
    if (!email || typeof dados.senha !== 'string') return falha(res, 400, 'Informe e-mail e senha.');
    const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ? AND ativo = 1').get(email);
    if (!usuario || !validarSenha(dados.senha, usuario.senha_hash)) return falha(res, 401, 'E-mail ou senha inválidos.');
    emitirSessao(res, usuario);
    res.json({ usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel } });
});
app.post('/api/auth/logout', (req, res) => {
    const token = tokenDaRequisicao(req);
    if (token) db.prepare('DELETE FROM sessoes WHERE token_hash = ?').run(hashToken(token));
    res.setHeader('Set-Cookie', `${AUTH_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);
    res.json({ ok: true });
});
app.get('/api/auth/me', (req, res) => req.user ? res.json({ usuario: req.user }) : falha(res, 401, 'Sessão encerrada.'));

const paginas = {
    'dashboard': ['admin', 'funcionario'], 'cadastros': ['admin', 'funcionario'],
    'lista': ['admin', 'funcionario'], 'tecnicos': ['admin'],
    'clientes': ['admin', 'funcionario'], 'detalhes': ['admin', 'funcionario', 'cliente'],
    'usuarios': ['admin'], 'portal-cliente': ['cliente']
};
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
for (const [pagina, papeis] of Object.entries(paginas)) {
    app.get(`/${pagina}.html`, (req, res) => {
        if (!req.user) return res.redirect('/index.html');
        if (!papeis.includes(req.user.papel)) return res.redirect(req.user.papel === 'cliente' ? '/portal-cliente.html' : '/dashboard.html');
        res.sendFile(path.join(__dirname, `${pagina}.html`));
    });
}
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.get('/', (req, res) => res.redirect(req.user ? (req.user.papel === 'cliente' ? '/portal-cliente.html' : '/dashboard.html') : '/index.html'));
app.use('/api', exigirPapeis(...PAPEIS));

function ordemPorId(id) { return db.prepare('SELECT * FROM ordens_servico WHERE id = ?').get(id); }
function podeAcessarOrdem(usuario, ordem) {
    if (!ordem) return false;
    if (usuario.papel === 'admin') return true;
    if (usuario.papel === 'cliente') return ordem.cliente_id === usuario.cliente_id;
    // A fila inclui ordens sem responsável: elas também devem poder ser abertas.
    return usuario.papel === 'funcionario' && (ordem.tecnico_id === null || ordem.tecnico_id === usuario.tecnico_id);
}
function ordemAcessivel(req, res) {
    const id = idValido(req.params.id);
    if (!id) { falha(res, 400, 'Identificador inválido.'); return null; }
    const ordem = ordemPorId(id);
    if (!ordem) { falha(res, 404, 'Ordem não encontrada.'); return null; }
    if (!podeAcessarOrdem(req.user, ordem)) { falha(res, 403, 'Acesso negado.'); return null; }
    return ordem;
}

// Técnicos: a lista resumida é usada nos formulários; a lista completa, na administração.
app.get('/api/tecnicos', exigirPapeis('admin', 'funcionario'), (req, res) => {
    res.json(db.prepare('SELECT id, nome FROM tecnicos ORDER BY nome').all());
});
app.get('/api/tecnicos/lista', exigirPapeis('admin'), (req, res) => {
    res.json(db.prepare('SELECT * FROM tecnicos ORDER BY nome').all());
});
app.get('/api/tecnicos/:id', exigirPapeis('admin'), (req, res) => {
    const t = encontrarTecnico(idValido(req.params.id));
    return t ? res.json(t) : falha(res, 404, 'Técnico não encontrado.');
});
function dadosTecnico(req) {
    const d = corpo(req);
    const nome = texto(d.nome), email = emailNormalizado(d.email), telefone = texto(d.telefone), especialidade = texto(d.especialidade);
    return nome && emailValido(email) && telefone && especialidade && nome.length <= 200 && email.length <= 254 ? { nome, email, telefone, especialidade } : null;
}
app.post('/api/tecnicos', exigirPapeis('admin'), (req, res) => {
    const d = dadosTecnico(req);
    if (!d) return falha(res, 400, 'Preencha os dados do técnico corretamente.');
    try {
        const r = db.prepare('INSERT INTO tecnicos (nome, email, telefone, especialidade) VALUES (?, ?, ?, ?)').run(d.nome, d.email, d.telefone, d.especialidade);
        res.status(201).json({ id: Number(r.lastInsertRowid) });
    } catch (e) { falhaBanco(res, e); }
});
app.put('/api/tecnicos/:id', exigirPapeis('admin'), (req, res) => {
    const id = idValido(req.params.id), d = dadosTecnico(req);
    if (!id || !d) return falha(res, 400, 'Dados inválidos.');
    try {
        const r = db.prepare('UPDATE tecnicos SET nome=?, email=?, telefone=?, especialidade=? WHERE id=?')
            .run(d.nome, d.email, d.telefone, d.especialidade, id);
        return r.changes ? res.json({ ok: true }) : falha(res, 404, 'Técnico não encontrado.');
    } catch (e) { falhaBanco(res, e); }
});
app.delete('/api/tecnicos/:id', exigirPapeis('admin'), (req, res) => {
    const id = idValido(req.params.id);
    if (!id) return falha(res, 400, 'Identificador inválido.');
    try {
        const r = db.prepare('DELETE FROM tecnicos WHERE id=?').run(id);
        return r.changes ? res.json({ ok: true }) : falha(res, 404, 'Técnico não encontrado.');
    } catch (e) { falhaBanco(res, e, 'Não foi possível excluir o técnico.'); }
});

const consultaClientes = `SELECT c.id, c.nome, c.telefone, c.email, COUNT(o.id) AS total_os,
    COALESCE(SUM(o.status IN ('Aberta', 'Em execução')), 0) AS os_ativas,
    MAX(o.aberta_em) AS ultima_os FROM clientes c LEFT JOIN ordens_servico o ON o.cliente_id = c.id`;
app.get('/api/clientes', exigirPapeis('admin', 'funcionario'), (req, res) => {
    res.json(db.prepare(`${consultaClientes} GROUP BY c.id ORDER BY c.nome`).all());
});
app.get('/api/clientes/:id', exigirPapeis('admin', 'funcionario'), (req, res) => {
    const id = idValido(req.params.id);
    if (!id) return falha(res, 400, 'Identificador inválido.');
    const c = db.prepare(`${consultaClientes} WHERE c.id=? GROUP BY c.id`).get(id);
    return c ? res.json(c) : falha(res, 404, 'Cliente não encontrado.');
});
function dadosCliente(req) {
    const d = corpo(req), nome = texto(d.nome), email = emailNormalizado(d.email);
    return nome && nome.length <= 200 && (!email || emailValido(email)) ? { nome, telefone: texto(d.telefone) || null, email: email || null } : null;
}
app.post('/api/clientes', exigirPapeis('admin', 'funcionario'), (req, res) => {
    const d = dadosCliente(req);
    if (!d) return falha(res, 400, 'Informe nome e e-mail válido, se preenchido.');
    try {
        const r = db.prepare('INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)').run(d.nome, d.telefone, d.email);
        res.status(201).json({ id: Number(r.lastInsertRowid) });
    } catch (e) { falhaBanco(res, e); }
});
app.put('/api/clientes/:id', exigirPapeis('admin', 'funcionario'), (req, res) => {
    const id = idValido(req.params.id), d = dadosCliente(req);
    if (!id || !d) return falha(res, 400, 'Dados inválidos.');
    try {
        const r = db.prepare('UPDATE clientes SET nome=?, telefone=?, email=? WHERE id=?').run(d.nome, d.telefone, d.email, id);
        return r.changes ? res.json({ ok: true }) : falha(res, 404, 'Cliente não encontrado.');
    } catch (e) { falhaBanco(res, e); }
});
app.delete('/api/clientes/:id', exigirPapeis('admin'), (req, res) => {
    const id = idValido(req.params.id);
    if (!id) return falha(res, 400, 'Identificador inválido.');
    try {
        const r = db.prepare('DELETE FROM clientes WHERE id=?').run(id);
        return r.changes ? res.json({ ok: true }) : falha(res, 404, 'Cliente não encontrado.');
    } catch (e) { falhaBanco(res, e, 'Não foi possível excluir o cliente.'); }
});

// Contas criadas pelo administrador (funcionários e outros administradores não têm cadastro público).
app.get('/api/usuarios', exigirPapeis('admin'), (req, res) => {
    res.json(db.prepare(`SELECT u.id, u.nome, u.email, u.papel, u.ativo,
        c.nome AS cliente, t.nome AS tecnico, u.cliente_id, u.tecnico_id
        FROM usuarios u LEFT JOIN clientes c ON u.cliente_id=c.id
        LEFT JOIN tecnicos t ON u.tecnico_id=t.id ORDER BY u.id DESC`).all());
});
app.post('/api/usuarios', exigirPapeis('admin'), (req, res) => {
    const d = corpo(req), credenciais = validarCredenciais(d);
    if (!credenciais || !PAPEIS.includes(d.papel)) return falha(res, 400, 'Dados inválidos. Senha mínima: 12 caracteres.');
    let clienteId = null, tecnicoId = null;
    if (d.papel === 'cliente') {
        clienteId = idValido(d.cliente_id);
        if (!clienteId || !encontrarCliente(clienteId)) return falha(res, 400, 'Selecione um cliente cadastrado.');
    }
    if (d.papel === 'funcionario' && d.tecnico_id != null && d.tecnico_id !== '') {
        tecnicoId = idValido(d.tecnico_id);
        if (!tecnicoId || !encontrarTecnico(tecnicoId)) return falha(res, 400, 'Técnico não encontrado.');
    }
    try {
        if (db.prepare('SELECT id FROM usuarios WHERE email = ?').get(credenciais.email)) return falha(res, 409, 'Este e-mail já está em uso.');
        const r = db.prepare('INSERT INTO usuarios (nome, email, senha_hash, papel, cliente_id, tecnico_id) VALUES (?, ?, ?, ?, ?, ?)')
            .run(credenciais.nome, credenciais.email, hashSenha(credenciais.senha), d.papel, clienteId, tecnicoId);
        res.status(201).json({ mensagem: 'Conta criada.', id: Number(r.lastInsertRowid) });
    } catch (e) { falhaBanco(res, e); }
});
app.patch('/api/usuarios/:id/status', exigirPapeis('admin'), (req, res) => {
    const id = idValido(req.params.id), ativo = corpo(req).ativo;
    if (!id || typeof ativo !== 'boolean') return falha(res, 400, 'Informe um status válido.');
    const usuario = usuarioPorId(id);
    if (!usuario) return falha(res, 404, 'Usuário não encontrado.');
    if (!ativo && id === req.user.id) return falha(res, 409, 'Não é permitido suspender a própria conta.');
    if (!ativo && usuario.papel === 'admin' && usuario.ativo && db.prepare("SELECT COUNT(*) AS total FROM usuarios WHERE papel='admin' AND ativo=1").get().total <= 1)
        return falha(res, 409, 'Não é permitido suspender o último administrador ativo.');
    db.prepare('UPDATE usuarios SET ativo=? WHERE id=?').run(ativo ? 1 : 0, id);
    if (!ativo) db.prepare('DELETE FROM sessoes WHERE usuario_id=?').run(id);
    res.json({ ok: true });
});

app.post('/api/ordens', exigirPapeis('admin', 'funcionario'), (req, res) => {
    const d = corpo(req);
    const nome = texto(d.cliente_nome), equipamento = texto(d.equipamento), descricao = texto(d.descricao);
    const email = emailNormalizado(d.cliente_email), telefone = texto(d.cliente_telefone);
    const prioridade = d.prioridade || 'Média';
    const clienteId = d.cliente_id == null || d.cliente_id === '' ? null : idValido(d.cliente_id);
    const tecnicoId = d.tecnico_id == null || d.tecnico_id === '' ? null : idValido(d.tecnico_id);
    const nomeTecnico = texto(d.tecnico_nome);
    if ((!nome && !clienteId) || !equipamento || descricao.length < 10 || !PRIORIDADES.includes(prioridade) ||
        (email && !emailValido(email)) || (d.cliente_id != null && d.cliente_id !== '' && !clienteId) ||
        (d.tecnico_id != null && d.tecnico_id !== '' && !tecnicoId)) return falha(res, 400, 'Confira cliente, equipamento, prioridade e descrição (mínimo de 10 caracteres).');
    try {
        const id = db.transaction(() => {
            let cId = clienteId;
            if (cId && !encontrarCliente(cId)) throw new ErroEntrada('Cliente não encontrado.');
            if (!cId) {
                const candidatos = email
                    ? db.prepare('SELECT id FROM clientes WHERE email = ? COLLATE NOCASE ORDER BY id LIMIT 2').all(email)
                    : [];
                if (candidatos.length > 1) throw new ErroEntrada('Há mais de um cliente com este e-mail. Selecione o cliente cadastrado.', 409);
                if (!email && db.prepare('SELECT id FROM clientes WHERE nome = ? COLLATE NOCASE LIMIT 1').get(nome)) {
                    throw new ErroEntrada('Já existe um cliente com este nome. Selecione o cliente cadastrado ou informe o e-mail do novo cliente.', 409);
                }
                let c = candidatos[0];
                if (!c) c = { id: Number(db.prepare('INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)').run(nome, telefone || null, email || null).lastInsertRowid) };
                else db.prepare('UPDATE clientes SET telefone=COALESCE(NULLIF(telefone, \'\'), ?), email=COALESCE(NULLIF(email, \'\'), ?) WHERE id=?')
                    .run(telefone || null, email || null, c.id);
                cId = c.id;
            }
            let tId = null;
            if (req.user.papel === 'funcionario') tId = req.user.tecnico_id;
            else if (tecnicoId) {
                if (!encontrarTecnico(tecnicoId)) throw new ErroEntrada('Técnico não encontrado.');
                tId = tecnicoId;
            } else if (nomeTecnico) {
                const tecnicos = db.prepare('SELECT id FROM tecnicos WHERE nome = ? COLLATE NOCASE ORDER BY id LIMIT 2').all(nomeTecnico);
                if (!tecnicos.length) throw new ErroEntrada('Técnico não cadastrado. Cadastre-o antes de criar a ordem.');
                if (tecnicos.length > 1) throw new ErroEntrada('Há mais de um técnico com este nome. Selecione o técnico pelo identificador.', 409);
                tId = tecnicos[0].id;
            }
            return Number(db.prepare(`INSERT INTO ordens_servico (cliente_id, tecnico_id, equipamento, prioridade, descricao) VALUES (?, ?, ?, ?, ?)`)
                .run(cId, tId, equipamento, prioridade, descricao).lastInsertRowid);
        })();
        res.status(201).json({ id });
    } catch (e) {
        if (e instanceof ErroEntrada) return falha(res, e.status, e.message);
        falhaBanco(res, e);
    }
});
function condicaoOrdens(usuario) {
    if (usuario.papel === 'cliente') return { sql: 'WHERE o.cliente_id = ?', params: [usuario.cliente_id || -1] };
    if (usuario.papel === 'funcionario') return { sql: 'WHERE o.tecnico_id = ? OR o.tecnico_id IS NULL', params: [usuario.tecnico_id || -1] };
    return { sql: '', params: [] };
}
app.get('/api/ordens', (req, res) => {
    const f = condicaoOrdens(req.user);
    res.json(db.prepare(`SELECT o.id, c.nome AS cliente, c.telefone AS cliente_telefone,
        c.email AS cliente_email, t.nome AS tecnico, o.equipamento, o.prioridade, o.status,
        o.descricao, o.aberta_em FROM ordens_servico o JOIN clientes c ON c.id = o.cliente_id
        LEFT JOIN tecnicos t ON t.id = o.tecnico_id ${f.sql} ORDER BY o.id DESC`).all(...f.params));
});
app.get('/api/ordens/:id', (req, res) => {
    const ordem = ordemAcessivel(req, res);
    if (!ordem) return;
    res.json(db.prepare(`SELECT o.*, c.nome AS cliente, c.telefone AS cliente_telefone,
        c.email AS cliente_email, t.nome AS tecnico FROM ordens_servico o
        JOIN clientes c ON c.id=o.cliente_id LEFT JOIN tecnicos t ON t.id=o.tecnico_id WHERE o.id=?`).get(ordem.id));
});
app.put('/api/ordens/:id/status', exigirPapeis('admin', 'funcionario'), (req, res) => {
    const ordem = ordemAcessivel(req, res);
    if (!ordem) return;
    if (finalizada(ordem.status)) return falha(res, 409, 'A ordem já está encerrada.');
    const d = corpo(req), status = d.status, diagnostico = texto(d.diagnostico);
    if (!STATUS.includes(status)) return falha(res, 400, 'Status inválido.');
    try {
        db.transaction(() => {
            db.prepare(`UPDATE ordens_servico SET status=?, diagnostico=?,
                fechada_em=CASE WHEN ? IN ('Concluída', 'Cancelada') THEN CURRENT_TIMESTAMP ELSE NULL END WHERE id=?`)
                .run(status, diagnostico || null, status, ordem.id);
            if (diagnostico) db.prepare(`INSERT INTO interacoes_cliente (ordem_id, autor_id, canal, visibilidade, mensagem)
                VALUES (?, ?, 'Atualização', 'publica', ?)`).run(ordem.id, req.user.id, diagnostico);
        })();
        res.json({ ok: true });
    } catch (e) { falhaBanco(res, e); }
});
app.delete('/api/ordens/:id', exigirPapeis('admin'), (req, res) => {
    const id = idValido(req.params.id);
    if (!id) return falha(res, 400, 'Identificador inválido.');
    const ordem = ordemPorId(id);
    if (!ordem) return falha(res, 404, 'Ordem não encontrada.');
    if (!finalizada(ordem.status)) return falha(res, 409, 'Só é possível excluir uma ordem concluída ou cancelada.');
    try { db.prepare('DELETE FROM ordens_servico WHERE id=?').run(id); res.json({ ok: true }); }
    catch (e) { falhaBanco(res, e); }
});
app.get('/api/ordens/:id/interacoes', (req, res) => {
    const ordem = ordemAcessivel(req, res);
    if (!ordem) return;
    const somentePublica = req.user.papel === 'cliente' ? " AND visibilidade='publica'" : '';
    res.json(db.prepare(`SELECT id, canal, mensagem, criado_em FROM interacoes_cliente
        WHERE ordem_id=?${somentePublica} ORDER BY id DESC`).all(ordem.id));
});
app.post('/api/ordens/:id/interacoes', (req, res) => {
    const ordem = ordemAcessivel(req, res);
    if (!ordem) return;
    if (finalizada(ordem.status)) return falha(res, 409, 'A ordem já está encerrada.');
    const d = corpo(req), mensagem = texto(d.mensagem);
    if (!mensagem || mensagem.length > 2000) return falha(res, 400, 'A mensagem deve conter entre 1 e 2.000 caracteres.');
    const canal = req.user.papel === 'cliente' ? 'Atualização' : (d.canal || 'Nota');
    if (!CANAIS.includes(canal)) return falha(res, 400, 'Canal inválido.');
    const visibilidade = canal === 'Nota' ? 'interna' : 'publica';
    try {
        const r = db.prepare('INSERT INTO interacoes_cliente (ordem_id, autor_id, canal, visibilidade, mensagem) VALUES (?, ?, ?, ?, ?)')
            .run(ordem.id, req.user.id, canal, visibilidade, mensagem);
        res.status(201).json({ id: Number(r.lastInsertRowid) });
    } catch (e) { falhaBanco(res, e); }
});
app.get('/api/dashboard', exigirPapeis('admin', 'funcionario'), (req, res) => {
    const f = condicaoOrdens(req.user);
    const base = `FROM ordens_servico o ${f.sql}`;
    const resumo = db.prepare(`SELECT COUNT(*) AS total_os,
        COALESCE(SUM(o.status='Aberta'), 0) AS os_abertas,
        COALESCE(SUM(o.status='Em execução'), 0) AS em_execucao,
        COALESCE(SUM(o.status='Concluída'), 0) AS concluidas,
        COALESCE(SUM(o.prioridade='Alta' AND o.status IN ('Aberta','Em execução')), 0) AS alta_prioridade,
        COALESCE(SUM(o.status IN ('Aberta','Em execução') AND (julianday('now')-julianday(o.aberta_em))*24 >= 48), 0) AS aguardando_48h,
        COALESCE(SUM(o.tecnico_id IS NULL AND o.status IN ('Aberta','Em execução')), 0) AS sem_responsavel
        ${base}`).get(...f.params);
    const distribuicao = db.prepare(`SELECT o.status, COUNT(*) AS total ${base} GROUP BY o.status`).all(...f.params);
    res.json({ ...resumo, distribuicao, atualizado_em: new Date().toISOString() });
});

app.use((erro, req, res, next) => {
    if (res.headersSent) return next(erro);
    if (erro instanceof SyntaxError && 'body' in erro) return falha(res, 400, 'JSON inválido.');
    if (erro.type === 'entity.too.large') return falha(res, 413, 'Requisição muito grande.');
    console.error(erro);
    falha(res, 500, 'Erro interno.');
});
const port = Number(process.env.PORT || 3001);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT deve ser uma porta TCP válida.');
app.listen(port, '127.0.0.1', () => console.log(`Megabrain Services: http://127.0.0.1:${port}`));
