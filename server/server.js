/*
 * GUIA DE LEITURA — JAVASCRIPT
 * const cria uma referência que não pode receber outra atribuição; let cria uma variável reatribuível.
 * = atribui um valor; === compara valor e tipo; !== compara a diferença; && significa “e”; || significa “ou”.
 * ?? escolhe o valor à direita somente se o da esquerda for null/undefined; ?. acessa com segurança.
 * if testa uma condição; else define o caso contrário; return encerra a função e devolve um resultado.
 * function define uma função; => é uma função de seta; async/await permitem esperar tarefas assíncronas.
 * { } delimitam blocos/objetos; [ ] delimitam listas; ( ) delimitam parâmetros e expressões.
 * Os comentários abaixo são explicativos e não mudam o comportamento da aplicação.
 */
// Ativa o modo estrito do JavaScript, que evita diversos comportamentos ambíguos.
'use strict';
// Declara express com const (referência que não pode ser reatribuída) e atribui require('express');.
const express = require('express');
// Declara Database com const (referência que não pode ser reatribuída) e atribui require('better-sqlite3');.
const Database = require('better-sqlite3');
// Declara crypto com const (referência que não pode ser reatribuída) e atribui require('crypto');.
const crypto = require('crypto');
// Declara fs com const (referência que não pode ser reatribuída) e atribui require('fs');.
const fs = require('fs');
// Declara path com const (referência que não pode ser reatribuída) e atribui require('path');.
const path = require('path');

// Declara app com const (referência que não pode ser reatribuída) e atribui express();.
const app = express();
// Registra no Express a operação USE para registra um middleware, usando express.json({ limit: '64kb' }));.
app.use(express.json({ limit: '64kb' }));

// Lê um valor configurável do ambiente e o salva em databasePath; usa const (referência que não pode ser reatribuída).
const databasePath = process.env.DATABASE_PATH ? path.resolve(process.env.DATABASE_PATH) : path.join(__dirname, 'os_system.sqlite');
// Cria uma nova instância e a armazena em db; usa const (referência que não pode ser reatribuída).
const db = new Database(databasePath);
// Habilita as restrições de chave estrangeira do SQLite para impedir vínculos com registros inexistentes.
db.pragma('foreign_keys = ON');
// Lê o arquivo do esquema SQL e executa a criação das tabelas que ainda não existem.
db.exec(fs.readFileSync(path.join(__dirname, 'mega-brain.sql'), 'utf8'));
// Protege notas antigas gravadas antes de existir a regra de visibilidade.
// Executa uma instrução SQL com parâmetros, alterando dados do banco quando aplicável.
db.prepare("UPDATE interacoes_cliente SET visibilidade = 'interna' WHERE canal = 'Nota' AND visibilidade = 'publica'").run();

// Declara AUTH_COOKIE com const (referência que não pode ser reatribuída) e atribui 'os_session';.
const AUTH_COOKIE = 'os_session';
// Declara SESSION_DURATION_SECONDS com const (referência que não pode ser reatribuída) e atribui 8 * 60 * 60;.
const SESSION_DURATION_SECONDS = 8 * 60 * 60;
// Declara PAPEIS com const (referência que não pode ser reatribuída) e atribui ['admin', 'funcionario', 'cliente'];.
const PAPEIS = ['admin', 'funcionario', 'cliente'];
// Declara STATUS com const (referência que não pode ser reatribuída) e atribui ['Aberta', 'Em execução', 'Concluída', 'Cancelada'];.
const STATUS = ['Aberta', 'Em execução', 'Concluída', 'Cancelada'];
// Declara PRIORIDADES com const (referência que não pode ser reatribuída) e atribui ['Baixa', 'Média', 'Alta'];.
const PRIORIDADES = ['Baixa', 'Média', 'Alta'];
// Declara CANAIS com const (referência que não pode ser reatribuída) e atribui ['Nota', 'WhatsApp', 'Atualização'];.
const CANAIS = ['Nota', 'WhatsApp', 'Atualização'];
// Define finalizada com uma função de seta ou com uma expressão; usa const (referência que não pode ser reatribuída).
const finalizada = status => status === 'Concluída' || status === 'Cancelada';
// Declara a função corpo; os parâmetros (req) recebem dados quando ela é chamada.
function corpo(req) {
    // Verifica a condição (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return {};; só executa o trecho correspondente quando ela for verdadeira.
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return {};
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return req.body;
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}
// Define texto com uma função de seta ou com uma expressão; usa const (referência que não pode ser reatribuída).
const texto = valor => typeof valor === 'string' ? valor.trim() : '';
// Define emailNormalizado com uma função de seta ou com uma expressão; usa const (referência que não pode ser reatribuída).
const emailNormalizado = valor => texto(valor).toLowerCase();
// Declara a função idValido; os parâmetros (valor) recebem dados quando ela é chamada.
function idValido(valor) {
    // Declara numero com const (referência que não pode ser reatribuída) e atribui Number(valor);.
    const numero = Number(valor);
    // Verifica a condição (!/^\d+$/.test(String(valor))) return null;; só executa o trecho correspondente quando ela for verdadeira.
    if (!/^\d+$/.test(String(valor))) return null;
    // Verifica a condição (!Number.isSafeInteger(numero) || numero <= 0) return null;; só executa o trecho correspondente quando ela for verdadeira.
    if (!Number.isSafeInteger(numero) || numero <= 0) return null;
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return numero;
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}
// Define emailValido com uma função de seta ou com uma expressão; usa const (referência que não pode ser reatribuída).
const emailValido = valor => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

// Declara uma classe: estrutura que agrupa dados e comportamentos usados no tratamento de erros.
class ErroEntrada extends Error {
    // Construtor: recebe os dados iniciais e prepara esta instância da classe.
    constructor(mensagem, status = 400) {
        // Chama o construtor da classe Error, informando a mensagem da exceção.
        super(mensagem);
        // Grava a propriedade status deste objeto para guardar o estado da instância.
        this.status = status;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função falha; os parâmetros (res, status, mensagem) recebem dados quando ela é chamada.
function falha(res, status, mensagem) { return res.status(status).json({ erro: mensagem }); }
// Declara a função falhaBanco; os parâmetros (res, erro, mensagem = 'Não foi possível concluir a operação.') recebem dados quando ela é chamada.
function falhaBanco(res, erro, mensagem = 'Não foi possível concluir a operação.') {
    // Verifica a condição (erro.code?.startsWith('SQLITE_CONSTRAINT_UNIQUE')) return falha(res, 409, 'E-mail já cadastrad…; só executa o trecho correspondente quando ela for verdadeira.
    if (erro.code?.startsWith('SQLITE_CONSTRAINT_UNIQUE')) return falha(res, 409, 'E-mail já cadastrado.');
    // Verifica a condição (erro.code?.startsWith('SQLITE_CONSTRAINT_FOREIGNKEY')) return falha(res, 409, 'Registro vincul…; só executa o trecho correspondente quando ela for verdadeira.
    if (erro.code?.startsWith('SQLITE_CONSTRAINT_FOREIGNKEY')) return falha(res, 409, 'Registro vinculado a outros dados.');
    // Verifica a condição (erro.code?.startsWith('SQLITE_CONSTRAINT')) return falha(res, 400, 'Dados inválidos ou incompa…; só executa o trecho correspondente quando ela for verdadeira.
    if (erro.code?.startsWith('SQLITE_CONSTRAINT')) return falha(res, 400, 'Dados inválidos ou incompatíveis.');
    // Registra informação ou erro no terminal para facilitar a identificação de problemas.
    console.error('Erro no banco:', erro);
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return falha(res, 500, mensagem);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}
// Declara a função validarCredenciais; os parâmetros (dados) recebem dados quando ela é chamada.
function validarCredenciais(dados) {
    // Declara nome com const (referência que não pode ser reatribuída) e atribui texto(dados.nome);.
    const nome = texto(dados.nome);
    // Declara email com const (referência que não pode ser reatribuída) e atribui emailNormalizado(dados.email);.
    const email = emailNormalizado(dados.email);
    // Declara senha com const (referência que não pode ser reatribuída) e atribui dados.senha;.
    const senha = dados.senha;
    // Verifica a condição (!nome || nome.length > 200 || !emailValido(email) || email.length > 254 || typeof senha !== 's…; só executa o trecho correspondente quando ela for verdadeira.
    if (!nome || nome.length > 200 || !emailValido(email) || email.length > 254 || typeof senha !== 'string' || senha.length < 12) {
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return null;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return { nome, email, senha };
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}
// Declara a função hashSenha; os parâmetros (senha) recebem dados quando ela é chamada.
function hashSenha(senha) {
    // Declara sal com const (referência que não pode ser reatribuída) e atribui crypto.randomBytes(16);.
    const sal = crypto.randomBytes(16);
    // Declara hash com const (referência que não pode ser reatribuída) e atribui crypto.scryptSync(senha, sal, 64);.
    const hash = crypto.scryptSync(senha, sal, 64);
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return `${sal.toString('hex')}:${hash.toString('hex')}`;
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}
// Declara a função validarSenha; os parâmetros (senha, senhaHash) recebem dados quando ela é chamada.
function validarSenha(senha, senhaHash) {
    // Verifica a condição (typeof senha !== 'string') return false;; só executa o trecho correspondente quando ela for verdadeira.
    if (typeof senha !== 'string') return false;
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Extrai os elementos do array em variáveis separadas; Promise.all permite aguardar requisições simultâneas quando usado.
        const [salHex, hashHex] = String(senhaHash || '').split(':');
        // Verifica a condição (!salHex || !hashHex) return false;; só executa o trecho correspondente quando ela for verdadeira.
        if (!salHex || !hashHex) return false;
        // Declara hashSalvo com const (referência que não pode ser reatribuída) e atribui Buffer.from(hashHex, 'hex');.
        const hashSalvo = Buffer.from(hashHex, 'hex');
        // Verifica a condição (!hashSalvo.length) return false;; só executa o trecho correspondente quando ela for verdadeira.
        if (!hashSalvo.length) return false;
        // Declara informado com const (referência que não pode ser reatribuída) e atribui crypto.scryptSync(senha, Buffer.from(salHex, 'hex'), hashSalvo.length);.
        const informado = crypto.scryptSync(senha, Buffer.from(salHex, 'hex'), hashSalvo.length);
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return crypto.timingSafeEqual(informado, hashSalvo);
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch { return false; }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}
// Declara a função tokenDaRequisicao; os parâmetros (req) recebem dados quando ela é chamada.
function tokenDaRequisicao(req) {
    // Define entrada com uma função de seta ou com uma expressão; usa const (referência que não pode ser reatribuída).
    const entrada = (req.headers.cookie || '').split(';').map(p => p.trim()).find(p => p.startsWith(`${AUTH_COOKIE}=`));
    // Verifica a condição (!entrada) return null;; só executa o trecho correspondente quando ela for verdadeira.
    if (!entrada) return null;
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try { return decodeURIComponent(entrada.slice(AUTH_COOKIE.length + 1)); } catch { return null; }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}
// Declara a função hashToken; os parâmetros (token) recebem dados quando ela é chamada.
function hashToken(token) { return crypto.createHash('sha256').update(token).digest('hex'); }
// Declara a função buscarUsuarioDaRequisicao; os parâmetros (req) recebem dados quando ela é chamada.
function buscarUsuarioDaRequisicao(req) {
    // Declara token com const (referência que não pode ser reatribuída) e atribui tokenDaRequisicao(req);.
    const token = tokenDaRequisicao(req);
    // Verifica a condição (!token) return null;; só executa o trecho correspondente quando ela for verdadeira.
    if (!token) return null;
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return db.prepare(`SELECT u.id, u.nome, u.email, u.papel, u.cliente_id, u.tecnico_id
        FROM sessoes s JOIN usuarios u ON u.id = s.usuario_id
        WHERE s.token_hash = ? AND s.expira_em > ? AND u.ativo = 1`).get(hashToken(token), Math.floor(Date.now() / 1000)) || null;
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}
// Registra no Express a operação USE para registra um middleware, usando (req.
app.use((req, res, next) => { req.user = buscarUsuarioDaRequisicao(req); next(); });
// Declara a função exigirPapeis; os parâmetros (...papeis) recebem dados quando ela é chamada.
function exigirPapeis(...papeis) {
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return (req, res, next) => {
        // Verifica a condição (!req.user) return falha(res, 401, 'Entre para continuar.');; só executa o trecho correspondente quando ela for verdadeira.
        if (!req.user) return falha(res, 401, 'Entre para continuar.');
        // Verifica a condição (!papeis.includes(req.user.papel)) return falha(res, 403, 'Sem permissão.');; só executa o trecho correspondente quando ela for verdadeira.
        if (!papeis.includes(req.user.papel)) return falha(res, 403, 'Sem permissão.');
        // Passa a requisição para o próximo middleware ou manipulador do Express.
        next();
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    };
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}
// Declara a função emitirSessao; os parâmetros (res, usuario) recebem dados quando ela é chamada.
function emitirSessao(res, usuario) {
    // Declara token com const (referência que não pode ser reatribuída) e atribui crypto.randomBytes(32).toString('hex');.
    const token = crypto.randomBytes(32).toString('hex');
    // Declara expiraEm com const (referência que não pode ser reatribuída) e atribui Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;.
    const expiraEm = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
    // Executa uma instrução SQL com parâmetros, alterando dados do banco quando aplicável.
    db.prepare('INSERT INTO sessoes (token_hash, usuario_id, expira_em) VALUES (?, ?, ?)').run(hashToken(token), usuario.id, expiraEm);
    // Define um cabeçalho da resposta HTTP; neste contexto, configura o cookie de sessão.
    res.setHeader('Set-Cookie', `${AUTH_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_DURATION_SECONDS}`);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}
// Declara a função encontrarCliente; os parâmetros (id) recebem dados quando ela é chamada.
function encontrarCliente(id) { return db.prepare('SELECT * FROM clientes WHERE id = ?').get(id); }
// Declara a função encontrarTecnico; os parâmetros (id) recebem dados quando ela é chamada.
function encontrarTecnico(id) { return db.prepare('SELECT * FROM tecnicos WHERE id = ?').get(id); }
// Declara a função usuarioPorId; os parâmetros (id) recebem dados quando ela é chamada.
function usuarioPorId(id) { return db.prepare('SELECT id, nome, email, papel, cliente_id, tecnico_id, ativo FROM usuarios WHERE id = ?').get(id); }

// Primeira instalação: somente o primeiro usuário pode configurar a conta administradora.
// Registra no Express a operação GET para consulta/retorna dados, usando '/api/auth/status'.
app.get('/api/auth/status', (req, res) => {
    // Consulta o banco de dados e retorna apenas o primeiro registro.
    res.json({ configurado: db.prepare('SELECT COUNT(*) AS total FROM usuarios').get().total > 0 });
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação POST para recebe e cria dados, usando '/api/auth/setup'.
app.post('/api/auth/setup', (req, res) => {
    // Declara dados com const (referência que não pode ser reatribuída) e atribui validarCredenciais(corpo(req));.
    const dados = validarCredenciais(corpo(req));
    // Verifica a condição (!dados) return falha(res, 400, 'Informe nome, e-mail válido e senha com pelo menos 12 caracter…; só executa o trecho correspondente quando ela for verdadeira.
    if (!dados) return falha(res, 400, 'Informe nome, e-mail válido e senha com pelo menos 12 caracteres.');
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Define usuario com uma função de seta ou com uma expressão; usa const (referência que não pode ser reatribuída).
        const usuario = db.transaction(() => {
            // Verifica a condição (db.prepare('SELECT COUNT(*) AS total FROM usuarios').get().total) return null;; só executa o trecho correspondente quando ela for verdadeira.
            if (db.prepare('SELECT COUNT(*) AS total FROM usuarios').get().total) return null;
            // Prepara a consulta SQL para acesso ao banco e guarda a instrução/resultado em resultado; usa const (referência que não pode ser reatribuída).
            const resultado = db.prepare('INSERT INTO usuarios (nome, email, senha_hash, papel) VALUES (?, ?, ?, ?)')
                // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
                .run(dados.nome, dados.email, hashSenha(dados.senha), 'admin');
            // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
            return usuarioPorId(Number(resultado.lastInsertRowid));
        // Finaliza a função de retorno e a chamada que a recebeu.
        })();
        // Verifica a condição (!usuario) return falha(res, 409, 'A configuração inicial já foi concluída.');; só executa o trecho correspondente quando ela for verdadeira.
        if (!usuario) return falha(res, 409, 'A configuração inicial já foi concluída.');
        // Cria um novo token de sessão autenticada e envia o cookie seguro ao navegador após o login.
        emitirSessao(res, usuario);
        // Envia uma resposta HTTP ao navegador/API, normalmente no formato JSON.
        res.status(201).json({ usuario });
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch (erro) { falhaBanco(res, erro); }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação POST para recebe e cria dados, usando '/api/auth/register'.
app.post('/api/auth/register', (req, res) => {
    // Declara entrada com const (referência que não pode ser reatribuída) e atribui corpo(req);.
    const entrada = corpo(req);
    // Verifica a condição (entrada.papel !== 'cliente') return falha(res, 400, 'Escolha um perfil válido: apenas cliente…; só executa o trecho correspondente quando ela for verdadeira.
    if (entrada.papel !== 'cliente') return falha(res, 400, 'Escolha um perfil válido: apenas cliente pode se cadastrar publicamente.');
    // Verifica a condição (!db.prepare('SELECT COUNT(*) AS total FROM usuarios').get().total) return falha(res, 409, 'Con…; só executa o trecho correspondente quando ela for verdadeira.
    if (!db.prepare('SELECT COUNT(*) AS total FROM usuarios').get().total) return falha(res, 409, 'Configure a conta administradora primeiro.');
    // Declara dados com const (referência que não pode ser reatribuída) e atribui validarCredenciais(entrada);.
    const dados = validarCredenciais(entrada);
    // Verifica a condição (!dados) return falha(res, 400, 'Informe nome, e-mail válido e senha com pelo menos 12 caracter…; só executa o trecho correspondente quando ela for verdadeira.
    if (!dados) return falha(res, 400, 'Informe nome, e-mail válido e senha com pelo menos 12 caracteres.');
    // Declara telefone com const (referência que não pode ser reatribuída) e atribui texto(entrada.telefone) || null;.
    const telefone = texto(entrada.telefone) || null;
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Define usuario com uma função de seta ou com uma expressão; usa const (referência que não pode ser reatribuída).
        const usuario = db.transaction(() => {
            // Verifica a condição (db.prepare('SELECT id FROM usuarios WHERE email = ?').get(dados.email)) return null;; só executa o trecho correspondente quando ela for verdadeira.
            if (db.prepare('SELECT id FROM usuarios WHERE email = ?').get(dados.email)) return null;
            // O e-mail informado no cadastro público não comprova a identidade do cliente.
            // A equipe deve criar o acesso vinculado quando já existe um cadastro.
            // Verifica a condição (db.prepare('SELECT id FROM clientes WHERE email = ? COLLATE NOCASE LIMIT 1').get(dados.email))…; só executa o trecho correspondente quando ela for verdadeira.
            if (db.prepare('SELECT id FROM clientes WHERE email = ? COLLATE NOCASE LIMIT 1').get(dados.email)) {
                // Lança uma exceção para que o erro seja tratado por um bloco catch ou pelo chamador.
                throw new ErroEntrada('Já existe um cadastro para este e-mail. Solicite à equipe a criação do acesso ao portal.', 409);
            // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
            }
            // Prepara a consulta SQL para acesso ao banco e guarda a instrução/resultado em cliente; usa const (referência que não pode ser reatribuída).
            const cliente = db.prepare('INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)').run(dados.nome, telefone, dados.email);
            // Prepara a consulta SQL para acesso ao banco e guarda a instrução/resultado em usuario; usa const (referência que não pode ser reatribuída).
            const usuario = db.prepare('INSERT INTO usuarios (nome, email, senha_hash, papel, cliente_id) VALUES (?, ?, ?, ?, ?)')
                // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
                .run(dados.nome, dados.email, hashSenha(dados.senha), 'cliente', Number(cliente.lastInsertRowid));
            // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
            return usuarioPorId(Number(usuario.lastInsertRowid));
        // Finaliza a função de retorno e a chamada que a recebeu.
        })();
        // Verifica a condição (!usuario) return falha(res, 409, 'Este e-mail já está em uso.');; só executa o trecho correspondente quando ela for verdadeira.
        if (!usuario) return falha(res, 409, 'Este e-mail já está em uso.');
        // Cria um novo token de sessão autenticada e envia o cookie seguro ao navegador após o login.
        emitirSessao(res, usuario);
        // Envia uma resposta HTTP ao navegador/API, normalmente no formato JSON.
        res.status(201).json({ usuario });
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch (erro) {
        // Verifica a condição (erro instanceof ErroEntrada) return falha(res, erro.status, erro.message);; só executa o trecho correspondente quando ela for verdadeira.
        if (erro instanceof ErroEntrada) return falha(res, erro.status, erro.message);
        // Converte a falha do banco em uma resposta HTTP apropriada e segura para o usuário.
        falhaBanco(res, erro);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação POST para recebe e cria dados, usando '/api/auth/login'.
app.post('/api/auth/login', (req, res) => {
    // Declara dados com const (referência que não pode ser reatribuída) e atribui corpo(req);.
    const dados = corpo(req);
    // Declara email com const (referência que não pode ser reatribuída) e atribui emailNormalizado(dados.email);.
    const email = emailNormalizado(dados.email);
    // Verifica a condição (!email || typeof dados.senha !== 'string') return falha(res, 400, 'Informe e-mail e senha.');; só executa o trecho correspondente quando ela for verdadeira.
    if (!email || typeof dados.senha !== 'string') return falha(res, 400, 'Informe e-mail e senha.');
    // Prepara a consulta SQL para acesso ao banco e guarda a instrução/resultado em usuario; usa const (referência que não pode ser reatribuída).
    const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ? AND ativo = 1').get(email);
    // Verifica a condição (!usuario || !validarSenha(dados.senha, usuario.senha_hash)) return falha(res, 401, 'E-mail ou…; só executa o trecho correspondente quando ela for verdadeira.
    if (!usuario || !validarSenha(dados.senha, usuario.senha_hash)) return falha(res, 401, 'E-mail ou senha inválidos.');
    // Cria um novo token de sessão autenticada e envia o cookie seguro ao navegador após o login.
    emitirSessao(res, usuario);
    // Envia uma resposta HTTP ao navegador/API, normalmente no formato JSON.
    res.json({ usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel } });
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação POST para recebe e cria dados, usando '/api/auth/logout'.
app.post('/api/auth/logout', (req, res) => {
    // Declara token com const (referência que não pode ser reatribuída) e atribui tokenDaRequisicao(req);.
    const token = tokenDaRequisicao(req);
    // Verifica a condição (token) db.prepare('DELETE FROM sessoes WHERE token_hash = ?').run(hashToken(token));; só executa o trecho correspondente quando ela for verdadeira.
    if (token) db.prepare('DELETE FROM sessoes WHERE token_hash = ?').run(hashToken(token));
    // Define um cabeçalho da resposta HTTP; neste contexto, configura o cookie de sessão.
    res.setHeader('Set-Cookie', `${AUTH_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);
    // Envia uma resposta HTTP ao navegador/API, normalmente no formato JSON.
    res.json({ ok: true });
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação GET para consulta/retorna dados, usando '/api/auth/me'.
app.get('/api/auth/me', (req, res) => req.user ? res.json({ usuario: req.user }) : falha(res, 401, 'Sessão encerrada.'));

// Declara paginas com const (referência que não pode ser reatribuída) e atribui {.
const paginas = {
    // Define a propriedade dashboard do objeto; o valor utilizado é ['admin', 'funcionario'], 'cadastros': ['admin', 'funcionario'],.
    'dashboard': ['admin', 'funcionario'], 'cadastros': ['admin', 'funcionario'],
    // Define a propriedade lista do objeto; o valor utilizado é ['admin', 'funcionario'], 'tecnicos': ['admin'],.
    'lista': ['admin', 'funcionario'], 'tecnicos': ['admin'],
    // Define a propriedade clientes do objeto; o valor utilizado é ['admin', 'funcionario'], 'detalhes': ['admin', 'funcionario', 'cliente'],.
    'clientes': ['admin', 'funcionario'], 'detalhes': ['admin', 'funcionario', 'cliente'],
    // Define a propriedade usuarios do objeto; o valor utilizado é ['admin'], 'portal-cliente': ['cliente'].
    'usuarios': ['admin'], 'portal-cliente': ['cliente']
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
};
// Registra no Express a operação GET para consulta/retorna dados, usando '/index.html'.
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'html', 'index.html')));
// Repete as instruções seguintes seguindo a condição de controle do laço for.
for (const [pagina, papeis] of Object.entries(paginas)) {
    // Registra no Express a operação GET para consulta/retorna dados, usando `/${pagina}.html`.
    app.get(`/${pagina}.html`, (req, res) => {
        // Verifica a condição (!req.user) return res.redirect('/index.html');; só executa o trecho correspondente quando ela for verdadeira.
        if (!req.user) return res.redirect('/index.html');
        // Verifica a condição (!papeis.includes(req.user.papel)) return res.redirect(req.user.papel === 'cliente' ? '/portal-…; só executa o trecho correspondente quando ela for verdadeira.
        if (!papeis.includes(req.user.papel)) return res.redirect(req.user.papel === 'cliente' ? '/portal-cliente.html' : '/dashboard.html');
        // Entrega ao navegador o arquivo HTML indicado, usando caminho controlado pelo servidor.
        res.sendFile(path.join(__dirname, '..', 'html', `${pagina}.html`));
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}
// Registra no Express a operação USE para registra um middleware, usando '/css'.
app.use('/css', express.static(path.join(__dirname, '..', 'css')));
// Registra no Express a operação USE para registra um middleware, usando '/js'.
app.use('/js', express.static(path.join(__dirname, '..', 'js')));
// Registra no Express a operação GET para consulta/retorna dados, usando '/'.
app.get('/', (req, res) => res.redirect(req.user ? (req.user.papel === 'cliente' ? '/portal-cliente.html' : '/dashboard.html') : '/index.html'));
// Registra no Express a operação USE para registra um middleware, usando '/api'.
app.use('/api', exigirPapeis(...PAPEIS));

// Declara a função ordemPorId; os parâmetros (id) recebem dados quando ela é chamada.
function ordemPorId(id) { return db.prepare('SELECT * FROM ordens_servico WHERE id = ?').get(id); }
// Declara a função podeAcessarOrdem; os parâmetros (usuario, ordem) recebem dados quando ela é chamada.
function podeAcessarOrdem(usuario, ordem) {
    // Verifica a condição (!ordem) return false;; só executa o trecho correspondente quando ela for verdadeira.
    if (!ordem) return false;
    // Verifica a condição (usuario.papel === 'admin') return true;; só executa o trecho correspondente quando ela for verdadeira.
    if (usuario.papel === 'admin') return true;
    // Verifica a condição (usuario.papel === 'cliente') return ordem.cliente_id === usuario.cliente_id;; só executa o trecho correspondente quando ela for verdadeira.
    if (usuario.papel === 'cliente') return ordem.cliente_id === usuario.cliente_id;
    // A fila inclui ordens sem responsável: elas também devem poder ser abertas.
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return usuario.papel === 'funcionario' && (ordem.tecnico_id === null || ordem.tecnico_id === usuario.tecnico_id);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}
// Declara a função ordemAcessivel; os parâmetros (req, res) recebem dados quando ela é chamada.
function ordemAcessivel(req, res) {
    // Declara id com const (referência que não pode ser reatribuída) e atribui idValido(req.params.id);.
    const id = idValido(req.params.id);
    // Verifica a condição (!id) { falha(res, 400, 'Identificador inválido.'); return null; }; só executa o trecho correspondente quando ela for verdadeira.
    if (!id) { falha(res, 400, 'Identificador inválido.'); return null; }
    // Declara ordem com const (referência que não pode ser reatribuída) e atribui ordemPorId(id);.
    const ordem = ordemPorId(id);
    // Verifica a condição (!ordem) { falha(res, 404, 'Ordem não encontrada.'); return null; }; só executa o trecho correspondente quando ela for verdadeira.
    if (!ordem) { falha(res, 404, 'Ordem não encontrada.'); return null; }
    // Verifica a condição (!podeAcessarOrdem(req.user, ordem)) { falha(res, 403, 'Acesso negado.'); return null; }; só executa o trecho correspondente quando ela for verdadeira.
    if (!podeAcessarOrdem(req.user, ordem)) { falha(res, 403, 'Acesso negado.'); return null; }
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return ordem;
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Técnicos: a lista resumida é usada nos formulários; a lista completa, na administração.
// Registra no Express a operação GET para consulta/retorna dados, usando '/api/tecnicos'.
app.get('/api/tecnicos', exigirPapeis('admin', 'funcionario'), (req, res) => {
    // Consulta o banco de dados e retorna uma lista de registros.
    res.json(db.prepare('SELECT id, nome FROM tecnicos ORDER BY nome').all());
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação GET para consulta/retorna dados, usando '/api/tecnicos/lista'.
app.get('/api/tecnicos/lista', exigirPapeis('admin'), (req, res) => {
    // Consulta o banco de dados e retorna uma lista de registros.
    res.json(db.prepare('SELECT * FROM tecnicos ORDER BY nome').all());
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação GET para consulta/retorna dados, usando '/api/tecnicos/:id'.
app.get('/api/tecnicos/:id', exigirPapeis('admin'), (req, res) => {
    // Declara tecnico com const (referência que não pode ser reatribuída) e atribui encontrarTecnico(idValido(req.params.id));.
    const tecnico = encontrarTecnico(idValido(req.params.id));
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return tecnico ? res.json(tecnico) : falha(res, 404, 'Técnico não encontrado.');
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Declara a função dadosTecnico; os parâmetros (req) recebem dados quando ela é chamada.
function dadosTecnico(req) {
    // Declara dados com const (referência que não pode ser reatribuída) e atribui corpo(req);.
    const dados = corpo(req);
    // Declara nome com const (referência que não pode ser reatribuída) e atribui texto(dados.nome);.
    const nome = texto(dados.nome);
    // Declara email com const (referência que não pode ser reatribuída) e atribui emailNormalizado(dados.email);.
    const email = emailNormalizado(dados.email);
    // Declara telefone com const (referência que não pode ser reatribuída) e atribui texto(dados.telefone);.
    const telefone = texto(dados.telefone);
    // Declara especialidade com const (referência que não pode ser reatribuída) e atribui texto(dados.especialidade);.
    const especialidade = texto(dados.especialidade);
    // Verifica a condição (!nome || nome.length > 200 || !emailValido(email) || email.length > 254 || !telefone || !espec…; só executa o trecho correspondente quando ela for verdadeira.
    if (!nome || nome.length > 200 || !emailValido(email) || email.length > 254 || !telefone || !especialidade) return null;
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return { nome, email, telefone, especialidade };
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}
// Registra no Express a operação POST para recebe e cria dados, usando '/api/tecnicos'.
app.post('/api/tecnicos', exigirPapeis('admin'), (req, res) => {
    // Declara dados com const (referência que não pode ser reatribuída) e atribui dadosTecnico(req);.
    const dados = dadosTecnico(req);
    // Verifica a condição (!dados) return falha(res, 400, 'Preencha os dados do técnico corretamente.');; só executa o trecho correspondente quando ela for verdadeira.
    if (!dados) return falha(res, 400, 'Preencha os dados do técnico corretamente.');
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Prepara a consulta SQL para acesso ao banco e guarda a instrução/resultado em resultado; usa const (referência que não pode ser reatribuída).
        const resultado = db.prepare('INSERT INTO tecnicos (nome, email, telefone, especialidade) VALUES (?, ?, ?, ?)').run(dados.nome, dados.email, dados.telefone, dados.especialidade);
        // Envia uma resposta HTTP ao navegador/API, normalmente no formato JSON.
        res.status(201).json({ id: Number(resultado.lastInsertRowid) });
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch (erro) { falhaBanco(res, erro); }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação PUT para substitui dados, usando '/api/tecnicos/:id'.
app.put('/api/tecnicos/:id', exigirPapeis('admin'), (req, res) => {
    // Declara id com const (referência que não pode ser reatribuída) e atribui idValido(req.params.id);.
    const id = idValido(req.params.id);
    // Declara dados com const (referência que não pode ser reatribuída) e atribui dadosTecnico(req);.
    const dados = dadosTecnico(req);
    // Verifica a condição (!id || !dados) return falha(res, 400, 'Dados inválidos.');; só executa o trecho correspondente quando ela for verdadeira.
    if (!id || !dados) return falha(res, 400, 'Dados inválidos.');
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Prepara a consulta SQL para acesso ao banco e guarda a instrução/resultado em resultado; usa const (referência que não pode ser reatribuída).
        const resultado = db.prepare('UPDATE tecnicos SET nome=?, email=?, telefone=?, especialidade=? WHERE id=?')
            // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
            .run(dados.nome, dados.email, dados.telefone, dados.especialidade, id);
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return resultado.changes ? res.json({ ok: true }) : falha(res, 404, 'Técnico não encontrado.');
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch (erro) { falhaBanco(res, erro); }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação DELETE para exclui dados, usando '/api/tecnicos/:id'.
app.delete('/api/tecnicos/:id', exigirPapeis('admin'), (req, res) => {
    // Declara id com const (referência que não pode ser reatribuída) e atribui idValido(req.params.id);.
    const id = idValido(req.params.id);
    // Verifica a condição (!id) return falha(res, 400, 'Identificador inválido.');; só executa o trecho correspondente quando ela for verdadeira.
    if (!id) return falha(res, 400, 'Identificador inválido.');
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Prepara a consulta SQL para acesso ao banco e guarda a instrução/resultado em resultado; usa const (referência que não pode ser reatribuída).
        const resultado = db.prepare('DELETE FROM tecnicos WHERE id=?').run(id);
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return resultado.changes ? res.json({ ok: true }) : falha(res, 404, 'Técnico não encontrado.');
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch (erro) { falhaBanco(res, erro, 'Não foi possível excluir o técnico.'); }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Declara consultaClientes com const (referência que não pode ser reatribuída) e atribui `SELECT c.id, c.nome, c.telefone, c.email, COUNT(o.id) AS total_os,.
const consultaClientes = `SELECT c.id, c.nome, c.telefone, c.email, COUNT(o.id) AS total_os,
    COALESCE(SUM(o.status IN ('Aberta', 'Em execução')), 0) AS os_ativas,
    MAX(o.aberta_em) AS ultima_os FROM clientes c LEFT JOIN ordens_servico o ON o.cliente_id = c.id`;
// Registra no Express a operação GET para consulta/retorna dados, usando '/api/clientes'.
app.get('/api/clientes', exigirPapeis('admin', 'funcionario'), (req, res) => {
    // Consulta o banco de dados e retorna uma lista de registros.
    res.json(db.prepare(`${consultaClientes} GROUP BY c.id ORDER BY c.nome`).all());
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação GET para consulta/retorna dados, usando '/api/clientes/:id'.
app.get('/api/clientes/:id', exigirPapeis('admin', 'funcionario'), (req, res) => {
    // Declara id com const (referência que não pode ser reatribuída) e atribui idValido(req.params.id);.
    const id = idValido(req.params.id);
    // Verifica a condição (!id) return falha(res, 400, 'Identificador inválido.');; só executa o trecho correspondente quando ela for verdadeira.
    if (!id) return falha(res, 400, 'Identificador inválido.');
    // Prepara a consulta SQL para acesso ao banco e guarda a instrução/resultado em cliente; usa const (referência que não pode ser reatribuída).
    const cliente = db.prepare(`${consultaClientes} WHERE c.id=? GROUP BY c.id`).get(id);
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return cliente ? res.json(cliente) : falha(res, 404, 'Cliente não encontrado.');
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Declara a função dadosCliente; os parâmetros (req) recebem dados quando ela é chamada.
function dadosCliente(req) {
    // Declara dados com const (referência que não pode ser reatribuída) e atribui corpo(req);.
    const dados = corpo(req);
    // Declara nome com const (referência que não pode ser reatribuída) e atribui texto(dados.nome);.
    const nome = texto(dados.nome);
    // Declara email com const (referência que não pode ser reatribuída) e atribui emailNormalizado(dados.email);.
    const email = emailNormalizado(dados.email);
    // Verifica a condição (!nome || nome.length > 200 || (email && !emailValido(email))) return null;; só executa o trecho correspondente quando ela for verdadeira.
    if (!nome || nome.length > 200 || (email && !emailValido(email))) return null;
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return { nome, telefone: texto(dados.telefone) || null, email: email || null };
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}
// Registra no Express a operação POST para recebe e cria dados, usando '/api/clientes'.
app.post('/api/clientes', exigirPapeis('admin', 'funcionario'), (req, res) => {
    // Declara dados com const (referência que não pode ser reatribuída) e atribui dadosCliente(req);.
    const dados = dadosCliente(req);
    // Verifica a condição (!dados) return falha(res, 400, 'Informe nome e e-mail válido, se preenchido.');; só executa o trecho correspondente quando ela for verdadeira.
    if (!dados) return falha(res, 400, 'Informe nome e e-mail válido, se preenchido.');
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Prepara a consulta SQL para acesso ao banco e guarda a instrução/resultado em resultado; usa const (referência que não pode ser reatribuída).
        const resultado = db.prepare('INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)').run(dados.nome, dados.telefone, dados.email);
        // Envia uma resposta HTTP ao navegador/API, normalmente no formato JSON.
        res.status(201).json({ id: Number(resultado.lastInsertRowid) });
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch (erro) { falhaBanco(res, erro); }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação PUT para substitui dados, usando '/api/clientes/:id'.
app.put('/api/clientes/:id', exigirPapeis('admin', 'funcionario'), (req, res) => {
    // Declara id com const (referência que não pode ser reatribuída) e atribui idValido(req.params.id);.
    const id = idValido(req.params.id);
    // Declara dados com const (referência que não pode ser reatribuída) e atribui dadosCliente(req);.
    const dados = dadosCliente(req);
    // Verifica a condição (!id || !dados) return falha(res, 400, 'Dados inválidos.');; só executa o trecho correspondente quando ela for verdadeira.
    if (!id || !dados) return falha(res, 400, 'Dados inválidos.');
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Prepara a consulta SQL para acesso ao banco e guarda a instrução/resultado em resultado; usa const (referência que não pode ser reatribuída).
        const resultado = db.prepare('UPDATE clientes SET nome=?, telefone=?, email=? WHERE id=?').run(dados.nome, dados.telefone, dados.email, id);
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return resultado.changes ? res.json({ ok: true }) : falha(res, 404, 'Cliente não encontrado.');
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch (erro) { falhaBanco(res, erro); }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação DELETE para exclui dados, usando '/api/clientes/:id'.
app.delete('/api/clientes/:id', exigirPapeis('admin'), (req, res) => {
    // Declara id com const (referência que não pode ser reatribuída) e atribui idValido(req.params.id);.
    const id = idValido(req.params.id);
    // Verifica a condição (!id) return falha(res, 400, 'Identificador inválido.');; só executa o trecho correspondente quando ela for verdadeira.
    if (!id) return falha(res, 400, 'Identificador inválido.');
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Prepara a consulta SQL para acesso ao banco e guarda a instrução/resultado em resultado; usa const (referência que não pode ser reatribuída).
        const resultado = db.prepare('DELETE FROM clientes WHERE id=?').run(id);
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return resultado.changes ? res.json({ ok: true }) : falha(res, 404, 'Cliente não encontrado.');
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch (erro) { falhaBanco(res, erro, 'Não foi possível excluir o cliente.'); }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Contas criadas pelo administrador (funcionários e outros administradores não têm cadastro público).
// Registra no Express a operação GET para consulta/retorna dados, usando '/api/usuarios'.
app.get('/api/usuarios', exigirPapeis('admin'), (req, res) => {
    // Prepara uma instrução SQL parametrizada; os ? serão preenchidos com os argumentos da operação.
    res.json(db.prepare(`SELECT u.id, u.nome, u.email, u.papel, u.ativo,
        c.nome AS cliente, t.nome AS tecnico, u.cliente_id, u.tecnico_id
        FROM usuarios u LEFT JOIN clientes c ON u.cliente_id=c.id
        LEFT JOIN tecnicos t ON u.tecnico_id=t.id ORDER BY u.id DESC`).all());
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação POST para recebe e cria dados, usando '/api/usuarios'.
app.post('/api/usuarios', exigirPapeis('admin'), (req, res) => {
    // Declara dados com const (referência que não pode ser reatribuída) e atribui corpo(req);.
    const dados = corpo(req);
    // Declara credenciais com const (referência que não pode ser reatribuída) e atribui validarCredenciais(dados);.
    const credenciais = validarCredenciais(dados);
    // Verifica a condição (!credenciais || !PAPEIS.includes(dados.papel)) return falha(res, 400, 'Dados inválidos. Senha…; só executa o trecho correspondente quando ela for verdadeira.
    if (!credenciais || !PAPEIS.includes(dados.papel)) return falha(res, 400, 'Dados inválidos. Senha mínima: 12 caracteres.');
    // Declara clienteId com let (variável que pode ser reatribuída) e atribui null;.
    let clienteId = null;
    // Declara tecnicoId com let (variável que pode ser reatribuída) e atribui null;.
    let tecnicoId = null;
    // Verifica a condição (dados.papel === 'cliente') {; só executa o trecho correspondente quando ela for verdadeira.
    if (dados.papel === 'cliente') {
        // Armazena o identificador do cliente associado ao registro, após a validação.
        clienteId = idValido(dados.cliente_id);
        // Verifica a condição (!clienteId || !encontrarCliente(clienteId)) return falha(res, 400, 'Selecione um cliente cadas…; só executa o trecho correspondente quando ela for verdadeira.
        if (!clienteId || !encontrarCliente(clienteId)) return falha(res, 400, 'Selecione um cliente cadastrado.');
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
    // Verifica a condição (dados.papel === 'funcionario' && dados.tecnico_id != null && dados.tecnico_id !== '') {; só executa o trecho correspondente quando ela for verdadeira.
    if (dados.papel === 'funcionario' && dados.tecnico_id != null && dados.tecnico_id !== '') {
        // Armazena o identificador do técnico associado à ordem, respeitando as regras de vínculo.
        tecnicoId = idValido(dados.tecnico_id);
        // Verifica a condição (!tecnicoId || !encontrarTecnico(tecnicoId)) return falha(res, 400, 'Técnico não encontrado.');; só executa o trecho correspondente quando ela for verdadeira.
        if (!tecnicoId || !encontrarTecnico(tecnicoId)) return falha(res, 400, 'Técnico não encontrado.');
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Verifica a condição (db.prepare('SELECT id FROM usuarios WHERE email = ?').get(credenciais.email)) return falha(res…; só executa o trecho correspondente quando ela for verdadeira.
        if (db.prepare('SELECT id FROM usuarios WHERE email = ?').get(credenciais.email)) return falha(res, 409, 'Este e-mail já está em uso.');
        // Prepara a consulta SQL para acesso ao banco e guarda a instrução/resultado em resultado; usa const (referência que não pode ser reatribuída).
        const resultado = db.prepare('INSERT INTO usuarios (nome, email, senha_hash, papel, cliente_id, tecnico_id) VALUES (?, ?, ?, ?, ?, ?)')
            // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
            .run(credenciais.nome, credenciais.email, hashSenha(credenciais.senha), dados.papel, clienteId, tecnicoId);
        // Envia uma resposta HTTP ao navegador/API, normalmente no formato JSON.
        res.status(201).json({ mensagem: 'Conta criada.', id: Number(resultado.lastInsertRowid) });
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch (erro) { falhaBanco(res, erro); }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação PATCH para atualiza parte dos dados, usando '/api/usuarios/:id/status'.
app.patch('/api/usuarios/:id/status', exigirPapeis('admin'), (req, res) => {
    // Declara id com const (referência que não pode ser reatribuída) e atribui idValido(req.params.id);.
    const id = idValido(req.params.id);
    // Declara ativo com const (referência que não pode ser reatribuída) e atribui corpo(req).ativo;.
    const ativo = corpo(req).ativo;
    // Verifica a condição (!id || typeof ativo !== 'boolean') return falha(res, 400, 'Informe um status válido.');; só executa o trecho correspondente quando ela for verdadeira.
    if (!id || typeof ativo !== 'boolean') return falha(res, 400, 'Informe um status válido.');
    // Declara usuario com const (referência que não pode ser reatribuída) e atribui usuarioPorId(id);.
    const usuario = usuarioPorId(id);
    // Verifica a condição (!usuario) return falha(res, 404, 'Usuário não encontrado.');; só executa o trecho correspondente quando ela for verdadeira.
    if (!usuario) return falha(res, 404, 'Usuário não encontrado.');
    // Verifica a condição (!ativo && id === req.user.id) return falha(res, 409, 'Não é permitido suspender a própria cont…; só executa o trecho correspondente quando ela for verdadeira.
    if (!ativo && id === req.user.id) return falha(res, 409, 'Não é permitido suspender a própria conta.');
    // Verifica a condição (!ativo && usuario.papel === 'admin' && usuario.ativo && db.prepare("SELECT COUNT(*) AS total F…; só executa o trecho correspondente quando ela for verdadeira.
    if (!ativo && usuario.papel === 'admin' && usuario.ativo && db.prepare("SELECT COUNT(*) AS total FROM usuarios WHERE papel='admin' AND ativo=1").get().total <= 1)
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return falha(res, 409, 'Não é permitido suspender o último administrador ativo.');
    // Executa uma instrução SQL com parâmetros, alterando dados do banco quando aplicável.
    db.prepare('UPDATE usuarios SET ativo=? WHERE id=?').run(ativo ? 1 : 0, id);
    // Verifica a condição (!ativo) db.prepare('DELETE FROM sessoes WHERE usuario_id=?').run(id);; só executa o trecho correspondente quando ela for verdadeira.
    if (!ativo) db.prepare('DELETE FROM sessoes WHERE usuario_id=?').run(id);
    // Envia uma resposta HTTP ao navegador/API, normalmente no formato JSON.
    res.json({ ok: true });
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Registra no Express a operação POST para recebe e cria dados, usando '/api/ordens'.
app.post('/api/ordens', exigirPapeis('admin', 'funcionario'), (req, res) => {
    // Declara dados com const (referência que não pode ser reatribuída) e atribui corpo(req);.
    const dados = corpo(req);
    // Declara nome com const (referência que não pode ser reatribuída) e atribui texto(dados.cliente_nome);.
    const nome = texto(dados.cliente_nome);
    // Declara equipamento com const (referência que não pode ser reatribuída) e atribui texto(dados.equipamento);.
    const equipamento = texto(dados.equipamento);
    // Declara descricao com const (referência que não pode ser reatribuída) e atribui texto(dados.descricao);.
    const descricao = texto(dados.descricao);
    // Declara email com const (referência que não pode ser reatribuída) e atribui emailNormalizado(dados.cliente_email);.
    const email = emailNormalizado(dados.cliente_email);
    // Declara telefone com const (referência que não pode ser reatribuída) e atribui texto(dados.cliente_telefone);.
    const telefone = texto(dados.cliente_telefone);
    // Declara prioridade com const (referência que não pode ser reatribuída) e atribui dados.prioridade || 'Média';.
    const prioridade = dados.prioridade || 'Média';
    // Declara clienteId com const (referência que não pode ser reatribuída) e atribui dados.cliente_id == null || dados.cliente_id === '' ? null : idValido(dados.cliente_id);.
    const clienteId = dados.cliente_id == null || dados.cliente_id === '' ? null : idValido(dados.cliente_id);
    // Declara tecnicoId com const (referência que não pode ser reatribuída) e atribui dados.tecnico_id == null || dados.tecnico_id === '' ? null : idValido(dados.tecnico_id);.
    const tecnicoId = dados.tecnico_id == null || dados.tecnico_id === '' ? null : idValido(dados.tecnico_id);
    // Declara nomeTecnico com const (referência que não pode ser reatribuída) e atribui texto(dados.tecnico_nome);.
    const nomeTecnico = texto(dados.tecnico_nome);
    // Verifica a condição ((!nome && !clienteId) || !equipamento || descricao.length < 10 || !PRIORIDADES.includes(priori…; só executa o trecho correspondente quando ela for verdadeira.
    if ((!nome && !clienteId) || !equipamento || descricao.length < 10 || !PRIORIDADES.includes(prioridade) ||
        // Continua a expressão lógica ou a lista de alternativas começada na linha anterior; é parte da mesma validação.
        (email && !emailValido(email)) || (dados.cliente_id != null && dados.cliente_id !== '' && !clienteId) ||
        // Continua a expressão lógica ou a lista de alternativas começada na linha anterior; é parte da mesma validação.
        (dados.tecnico_id != null && dados.tecnico_id !== '' && !tecnicoId)) return falha(res, 400, 'Confira cliente, equipamento, prioridade e descrição (mínimo de 10 caracteres).');
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Define id com uma função de seta ou com uma expressão; usa const (referência que não pode ser reatribuída).
        const id = db.transaction(() => {
            // Declara idCliente com let (variável que pode ser reatribuída) e atribui clienteId;.
            let idCliente = clienteId;
            // Verifica a condição (idCliente && !encontrarCliente(idCliente)) throw new ErroEntrada('Cliente não encontrado.');; só executa o trecho correspondente quando ela for verdadeira.
            if (idCliente && !encontrarCliente(idCliente)) throw new ErroEntrada('Cliente não encontrado.');
            // Verifica a condição (!idCliente) {; só executa o trecho correspondente quando ela for verdadeira.
            if (!idCliente) {
                // Declara candidatos com const (referência que não pode ser reatribuída) e atribui email.
                const candidatos = email
                    // Consulta o banco de dados e retorna uma lista de registros.
                    ? db.prepare('SELECT id FROM clientes WHERE email = ? COLLATE NOCASE ORDER BY id LIMIT 2').all(email)
                    // Continua a expressão lógica ou a lista de alternativas começada na linha anterior; é parte da mesma validação.
                    : [];
                // Verifica a condição (candidatos.length > 1) throw new ErroEntrada('Há mais de um cliente com este e-mail. Selecione…; só executa o trecho correspondente quando ela for verdadeira.
                if (candidatos.length > 1) throw new ErroEntrada('Há mais de um cliente com este e-mail. Selecione o cliente cadastrado.', 409);
                // Verifica a condição (!email && db.prepare('SELECT id FROM clientes WHERE nome = ? COLLATE NOCASE LIMIT 1').get(nome…; só executa o trecho correspondente quando ela for verdadeira.
                if (!email && db.prepare('SELECT id FROM clientes WHERE nome = ? COLLATE NOCASE LIMIT 1').get(nome)) {
                    // Lança uma exceção para que o erro seja tratado por um bloco catch ou pelo chamador.
                    throw new ErroEntrada('Já existe um cliente com este nome. Selecione o cliente cadastrado ou informe o e-mail do novo cliente.', 409);
                // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
                }
                // Declara cliente com let (variável que pode ser reatribuída) e atribui candidatos[0];.
                let cliente = candidatos[0];
                // Verifica a condição (!cliente) cliente = { id: Number(db.prepare('INSERT INTO clientes (nome, telefone, email) VALU…; só executa o trecho correspondente quando ela for verdadeira.
                if (!cliente) cliente = { id: Number(db.prepare('INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)').run(nome, telefone || null, email || null).lastInsertRowid) };
                // Prepara uma instrução SQL parametrizada; os ? serão preenchidos com os argumentos da operação.
                else db.prepare('UPDATE clientes SET telefone=COALESCE(NULLIF(telefone, \'\'), ?), email=COALESCE(NULLIF(email, \'\'), ?) WHERE id=?')
                    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
                    .run(telefone || null, email || null, cliente.id);
                // Armazena o identificador do cliente associado ao registro, após a validação.
                idCliente = cliente.id;
            // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
            }
            // Declara idTecnico com let (variável que pode ser reatribuída) e atribui null;.
            let idTecnico = null;
            // Verifica a condição (req.user.papel === 'funcionario') idTecnico = req.user.tecnico_id;; só executa o trecho correspondente quando ela for verdadeira.
            if (req.user.papel === 'funcionario') idTecnico = req.user.tecnico_id;
            // Verifica uma segunda condição somente quando a alternativa anterior não foi atendida.
            else if (tecnicoId) {
                // Verifica a condição (!encontrarTecnico(tecnicoId)) throw new ErroEntrada('Técnico não encontrado.');; só executa o trecho correspondente quando ela for verdadeira.
                if (!encontrarTecnico(tecnicoId)) throw new ErroEntrada('Técnico não encontrado.');
                // Armazena o identificador do técnico associado à ordem, respeitando as regras de vínculo.
                idTecnico = tecnicoId;
            // Quando a condição anterior falha, verifica esta nova alternativa.
            } else if (nomeTecnico) {
                // Prepara a consulta SQL para acesso ao banco e guarda a instrução/resultado em tecnicos; usa const (referência que não pode ser reatribuída).
                const tecnicos = db.prepare('SELECT id FROM tecnicos WHERE nome = ? COLLATE NOCASE ORDER BY id LIMIT 2').all(nomeTecnico);
                // Verifica a condição (!tecnicos.length) throw new ErroEntrada('Técnico não cadastrado. Cadastre-o antes de criar a o…; só executa o trecho correspondente quando ela for verdadeira.
                if (!tecnicos.length) throw new ErroEntrada('Técnico não cadastrado. Cadastre-o antes de criar a ordem.');
                // Verifica a condição (tecnicos.length > 1) throw new ErroEntrada('Há mais de um técnico com este nome. Selecione o t…; só executa o trecho correspondente quando ela for verdadeira.
                if (tecnicos.length > 1) throw new ErroEntrada('Há mais de um técnico com este nome. Selecione o técnico pelo identificador.', 409);
                // Armazena o identificador do técnico associado à ordem, respeitando as regras de vínculo.
                idTecnico = tecnicos[0].id;
            // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
            }
            // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
            return Number(db.prepare(`INSERT INTO ordens_servico (cliente_id, tecnico_id, equipamento, prioridade, descricao) VALUES (?, ?, ?, ?, ?)`)
                // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
                .run(idCliente, idTecnico, equipamento, prioridade, descricao).lastInsertRowid);
        // Finaliza a função de retorno e a chamada que a recebeu.
        })();
        // Envia uma resposta HTTP ao navegador/API, normalmente no formato JSON.
        res.status(201).json({ id });
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch (erro) {
        // Verifica a condição (erro instanceof ErroEntrada) return falha(res, erro.status, erro.message);; só executa o trecho correspondente quando ela for verdadeira.
        if (erro instanceof ErroEntrada) return falha(res, erro.status, erro.message);
        // Converte a falha do banco em uma resposta HTTP apropriada e segura para o usuário.
        falhaBanco(res, erro);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Declara a função condicaoOrdens; os parâmetros (usuario) recebem dados quando ela é chamada.
function condicaoOrdens(usuario) {
    // Verifica a condição (usuario.papel === 'cliente') return { sql: 'WHERE o.cliente_id = ?', params: [usuario.cliente_…; só executa o trecho correspondente quando ela for verdadeira.
    if (usuario.papel === 'cliente') return { sql: 'WHERE o.cliente_id = ?', params: [usuario.cliente_id || -1] };
    // Verifica a condição (usuario.papel === 'funcionario') return { sql: 'WHERE o.tecnico_id = ? OR o.tecnico_id IS NULL…; só executa o trecho correspondente quando ela for verdadeira.
    if (usuario.papel === 'funcionario') return { sql: 'WHERE o.tecnico_id = ? OR o.tecnico_id IS NULL', params: [usuario.tecnico_id || -1] };
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return { sql: '', params: [] };
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}
// Registra no Express a operação GET para consulta/retorna dados, usando '/api/ordens'.
app.get('/api/ordens', (req, res) => {
    // Declara filtro com const (referência que não pode ser reatribuída) e atribui condicaoOrdens(req.user);.
    const filtro = condicaoOrdens(req.user);
    // Prepara uma instrução SQL parametrizada; os ? serão preenchidos com os argumentos da operação.
    res.json(db.prepare(`SELECT o.id, c.nome AS cliente, c.telefone AS cliente_telefone,
        c.email AS cliente_email, t.nome AS tecnico, o.equipamento, o.prioridade, o.status,
        o.descricao, o.aberta_em FROM ordens_servico o JOIN clientes c ON c.id = o.cliente_id
        LEFT JOIN tecnicos t ON t.id = o.tecnico_id ${filtro.sql} ORDER BY o.id DESC`).all(...filtro.params));
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação GET para consulta/retorna dados, usando '/api/ordens/:id'.
app.get('/api/ordens/:id', (req, res) => {
    // Declara ordem com const (referência que não pode ser reatribuída) e atribui ordemAcessivel(req, res);.
    const ordem = ordemAcessivel(req, res);
    // Verifica a condição (!ordem) return;; só executa o trecho correspondente quando ela for verdadeira.
    if (!ordem) return;
    // Prepara uma instrução SQL parametrizada; os ? serão preenchidos com os argumentos da operação.
    res.json(db.prepare(`SELECT o.*, c.nome AS cliente, c.telefone AS cliente_telefone,
        c.email AS cliente_email, t.nome AS tecnico FROM ordens_servico o
        JOIN clientes c ON c.id=o.cliente_id LEFT JOIN tecnicos t ON t.id=o.tecnico_id WHERE o.id=?`).get(ordem.id));
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação PUT para substitui dados, usando '/api/ordens/:id/status'.
app.put('/api/ordens/:id/status', exigirPapeis('admin', 'funcionario'), (req, res) => {
    // Declara ordem com const (referência que não pode ser reatribuída) e atribui ordemAcessivel(req, res);.
    const ordem = ordemAcessivel(req, res);
    // Verifica a condição (!ordem) return;; só executa o trecho correspondente quando ela for verdadeira.
    if (!ordem) return;
    // Verifica a condição (finalizada(ordem.status)) return falha(res, 409, 'A ordem já está encerrada.');; só executa o trecho correspondente quando ela for verdadeira.
    if (finalizada(ordem.status)) return falha(res, 409, 'A ordem já está encerrada.');
    // Declara dados com const (referência que não pode ser reatribuída) e atribui corpo(req);.
    const dados = corpo(req);
    // Declara status com const (referência que não pode ser reatribuída) e atribui dados.status;.
    const status = dados.status;
    // Declara diagnostico com const (referência que não pode ser reatribuída) e atribui texto(dados.diagnostico);.
    const diagnostico = texto(dados.diagnostico);
    // Verifica a condição (!STATUS.includes(status)) return falha(res, 400, 'Status inválido.');; só executa o trecho correspondente quando ela for verdadeira.
    if (!STATUS.includes(status)) return falha(res, 400, 'Status inválido.');
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Executa um conjunto de operações do banco em uma transação; todas confirmam juntas ou são desfeitas em caso de erro.
        db.transaction(() => {
            // Prepara uma instrução SQL parametrizada; os ? serão preenchidos com os argumentos da operação.
            db.prepare(`UPDATE ordens_servico SET status=?, diagnostico=?,
                fechada_em=CASE WHEN ? IN ('Concluída', 'Cancelada') THEN CURRENT_TIMESTAMP ELSE NULL END WHERE id=?`)
                // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
                .run(status, diagnostico || null, status, ordem.id);
            // Verifica a condição (diagnostico) db.prepare(`INSERT INTO interacoes_cliente (ordem_id, autor_id, canal, visibilida…; só executa o trecho correspondente quando ela for verdadeira.
            if (diagnostico) db.prepare(`INSERT INTO interacoes_cliente (ordem_id, autor_id, canal, visibilidade, mensagem)
                VALUES (?, ?, 'Atualização', 'publica', ?)`).run(ordem.id, req.user.id, diagnostico);
        // Finaliza a função de retorno e a chamada que a recebeu.
        })();
        // Envia uma resposta HTTP ao navegador/API, normalmente no formato JSON.
        res.json({ ok: true });
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch (erro) { falhaBanco(res, erro); }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação DELETE para exclui dados, usando '/api/ordens/:id'.
app.delete('/api/ordens/:id', exigirPapeis('admin'), (req, res) => {
    // Declara id com const (referência que não pode ser reatribuída) e atribui idValido(req.params.id);.
    const id = idValido(req.params.id);
    // Verifica a condição (!id) return falha(res, 400, 'Identificador inválido.');; só executa o trecho correspondente quando ela for verdadeira.
    if (!id) return falha(res, 400, 'Identificador inválido.');
    // Declara ordem com const (referência que não pode ser reatribuída) e atribui ordemPorId(id);.
    const ordem = ordemPorId(id);
    // Verifica a condição (!ordem) return falha(res, 404, 'Ordem não encontrada.');; só executa o trecho correspondente quando ela for verdadeira.
    if (!ordem) return falha(res, 404, 'Ordem não encontrada.');
    // Verifica a condição (!finalizada(ordem.status)) return falha(res, 409, 'Só é possível excluir uma ordem concluída o…; só executa o trecho correspondente quando ela for verdadeira.
    if (!finalizada(ordem.status)) return falha(res, 409, 'Só é possível excluir uma ordem concluída ou cancelada.');
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try { db.prepare('DELETE FROM ordens_servico WHERE id=?').run(id); res.json({ ok: true }); }
    // Define como tratar o erro capturado da operação anterior.
    catch (erro) { falhaBanco(res, erro); }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação GET para consulta/retorna dados, usando '/api/ordens/:id/interacoes'.
app.get('/api/ordens/:id/interacoes', (req, res) => {
    // Declara ordem com const (referência que não pode ser reatribuída) e atribui ordemAcessivel(req, res);.
    const ordem = ordemAcessivel(req, res);
    // Verifica a condição (!ordem) return;; só executa o trecho correspondente quando ela for verdadeira.
    if (!ordem) return;
    // Declara somentePublica com const (referência que não pode ser reatribuída) e atribui req.user.papel === 'cliente' ? " AND visibilidade='publica'" : '';.
    const somentePublica = req.user.papel === 'cliente' ? " AND visibilidade='publica'" : '';
    // Prepara uma instrução SQL parametrizada; os ? serão preenchidos com os argumentos da operação.
    res.json(db.prepare(`SELECT id, canal, mensagem, criado_em FROM interacoes_cliente
        WHERE ordem_id=?${somentePublica} ORDER BY id DESC`).all(ordem.id));
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação POST para recebe e cria dados, usando '/api/ordens/:id/interacoes'.
app.post('/api/ordens/:id/interacoes', (req, res) => {
    // Declara ordem com const (referência que não pode ser reatribuída) e atribui ordemAcessivel(req, res);.
    const ordem = ordemAcessivel(req, res);
    // Verifica a condição (!ordem) return;; só executa o trecho correspondente quando ela for verdadeira.
    if (!ordem) return;
    // Verifica a condição (finalizada(ordem.status)) return falha(res, 409, 'A ordem já está encerrada.');; só executa o trecho correspondente quando ela for verdadeira.
    if (finalizada(ordem.status)) return falha(res, 409, 'A ordem já está encerrada.');
    // Declara dados com const (referência que não pode ser reatribuída) e atribui corpo(req);.
    const dados = corpo(req);
    // Declara mensagem com const (referência que não pode ser reatribuída) e atribui texto(dados.mensagem);.
    const mensagem = texto(dados.mensagem);
    // Verifica a condição (!mensagem || mensagem.length > 2000) return falha(res, 400, 'A mensagem deve conter entre 1 e…; só executa o trecho correspondente quando ela for verdadeira.
    if (!mensagem || mensagem.length > 2000) return falha(res, 400, 'A mensagem deve conter entre 1 e 2.000 caracteres.');
    // Declara canal com const (referência que não pode ser reatribuída) e atribui req.user.papel === 'cliente' ? 'Atualização' : (dados.canal || 'Nota');.
    const canal = req.user.papel === 'cliente' ? 'Atualização' : (dados.canal || 'Nota');
    // Verifica a condição (!CANAIS.includes(canal)) return falha(res, 400, 'Canal inválido.');; só executa o trecho correspondente quando ela for verdadeira.
    if (!CANAIS.includes(canal)) return falha(res, 400, 'Canal inválido.');
    // Declara visibilidade com const (referência que não pode ser reatribuída) e atribui canal === 'Nota' ? 'interna' : 'publica';.
    const visibilidade = canal === 'Nota' ? 'interna' : 'publica';
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Prepara a consulta SQL para acesso ao banco e guarda a instrução/resultado em resultado; usa const (referência que não pode ser reatribuída).
        const resultado = db.prepare('INSERT INTO interacoes_cliente (ordem_id, autor_id, canal, visibilidade, mensagem) VALUES (?, ?, ?, ?, ?)')
            // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
            .run(ordem.id, req.user.id, canal, visibilidade, mensagem);
        // Envia uma resposta HTTP ao navegador/API, normalmente no formato JSON.
        res.status(201).json({ id: Number(resultado.lastInsertRowid) });
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch (erro) { falhaBanco(res, erro); }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra no Express a operação GET para consulta/retorna dados, usando '/api/dashboard'.
app.get('/api/dashboard', exigirPapeis('admin', 'funcionario'), (req, res) => {
    // Declara filtro com const (referência que não pode ser reatribuída) e atribui condicaoOrdens(req.user);.
    const filtro = condicaoOrdens(req.user);
    // Declara base com const (referência que não pode ser reatribuída) e atribui `FROM ordens_servico o ${filtro.sql}`;.
    const base = `FROM ordens_servico o ${filtro.sql}`;
    // Prepara a consulta SQL para acesso ao banco e guarda a instrução/resultado em resumo; usa const (referência que não pode ser reatribuída).
    const resumo = db.prepare(`SELECT COUNT(*) AS total_os,
        COALESCE(SUM(o.status='Aberta'), 0) AS os_abertas,
        COALESCE(SUM(o.status='Em execução'), 0) AS em_execucao,
        COALESCE(SUM(o.status='Concluída'), 0) AS concluidas,
        COALESCE(SUM(o.prioridade='Alta' AND o.status IN ('Aberta','Em execução')), 0) AS alta_prioridade,
        COALESCE(SUM(o.status IN ('Aberta','Em execução') AND (julianday('now')-julianday(o.aberta_em))*24 >= 48), 0) AS aguardando_48h,
        COALESCE(SUM(o.tecnico_id IS NULL AND o.status IN ('Aberta','Em execução')), 0) AS sem_responsavel
        ${base}`).get(...filtro.params);
    // Prepara a consulta SQL para acesso ao banco e guarda a instrução/resultado em distribuicao; usa const (referência que não pode ser reatribuída).
    const distribuicao = db.prepare(`SELECT o.status, COUNT(*) AS total ${base} GROUP BY o.status`).all(...filtro.params);
    // Envia uma resposta HTTP ao navegador/API, normalmente no formato JSON.
    res.json({ ...resumo, distribuicao, atualizado_em: new Date().toISOString() });
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Registra no Express a operação USE para registra um middleware, usando (erro.
app.use((erro, req, res, next) => {
    // Verifica a condição (res.headersSent) return next(erro);; só executa o trecho correspondente quando ela for verdadeira.
    if (res.headersSent) return next(erro);
    // Verifica a condição (erro instanceof SyntaxError && 'body' in erro) return falha(res, 400, 'JSON inválido.');; só executa o trecho correspondente quando ela for verdadeira.
    if (erro instanceof SyntaxError && 'body' in erro) return falha(res, 400, 'JSON inválido.');
    // Verifica a condição (erro.type === 'entity.too.large') return falha(res, 413, 'Requisição muito grande.');; só executa o trecho correspondente quando ela for verdadeira.
    if (erro.type === 'entity.too.large') return falha(res, 413, 'Requisição muito grande.');
    // Registra informação ou erro no terminal para facilitar a identificação de problemas.
    console.error(erro);
    // Retorna uma resposta HTTP de erro com o código e a mensagem indicados.
    falha(res, 500, 'Erro interno.');
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Lê um valor configurável do ambiente e o salva em port; usa const (referência que não pode ser reatribuída).
const port = Number(process.env.PORT || 3001);
// Verifica a condição (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT deve ser uma porta…; só executa o trecho correspondente quando ela for verdadeira.
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT deve ser uma porta TCP válida.');
// Registra no Express a operação LISTEN para inicia o servidor HTTP, usando port.
app.listen(port, '127.0.0.1', () => console.log(`Megabrain Services: http://127.0.0.1:${port}`));
