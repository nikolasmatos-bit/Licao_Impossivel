const express = require('express');
const Database = require('better-sqlite3');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json({ limit: '64kb' }));

const db = new Database(path.join(__dirname, 'os_system.sqlite'));
db.pragma('foreign_keys = ON');
db.exec(fs.readFileSync(path.join(__dirname, 'mega-brain.sql'), 'utf8'));

const AUTH_COOKIE = 'os_session';
const SESSION_DURATION_SECONDS = 8 * 60 * 60;

function hashSenha(senha) {
    const sal = crypto.randomBytes(16);
    const hash = crypto.scryptSync(senha, sal, 64);
    return `${sal.toString('hex')}:${hash.toString('hex')}`;
}

function validarSenha(senha, senhaHash) {
    try {
        const [salHex, hashHex] = String(senhaHash || '').split(':');
        if (!salHex || !hashHex) return false;
        const hashSalvo = Buffer.from(hashHex, 'hex');
        if (!hashSalvo.length) return false;
        const hashInformado = crypto.scryptSync(senha, Buffer.from(salHex, 'hex'), hashSalvo.length);
        return crypto.timingSafeEqual(hashInformado, hashSalvo);
    } catch { return false; }
}

function tokenDaRequisicao(req) {
    const cookie = req.headers.cookie || '';
    const entrada = cookie.split(';').map(p => p.trim()).find(p => p.startsWith(`${AUTH_COOKIE}=`));
    return entrada ? decodeURIComponent(entrada.slice(AUTH_COOKIE.length + 1)) : null;
}

function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

function buscarUsuarioDaRequisicao(req) {
    const token = tokenDaRequisicao(req);
    if (!token) return null;
    return db.prepare(`
        SELECT u.id, u.nome, u.email, u.papel, u.cliente_id, u.tecnico_id
        FROM sessoes s JOIN usuarios u ON u.id = s.usuario_id
        WHERE s.token_hash = ? AND s.expira_em > ? AND u.ativo = 1
    `).get(hashToken(token), Math.floor(Date.now() / 1000)) || null;
}

app.use((req, res, next) => {
    req.user = buscarUsuarioDaRequisicao(req);
    next();
});

function exigirPapeis(...papeis) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ erro: 'Entre para continuar.' });
        if (!papeis.includes(req.user.papel)) return res.status(403).json({ erro: 'Sem permissão.' });
        next();
    };
}

function emitirSessao(req, res, usuario) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiraEm = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
    db.prepare('INSERT INTO sessoes (token_hash, usuario_id, expira_em) VALUES (?, ?, ?)').run(hashToken(token), usuario.id, expiraEm);
    res.setHeader('Set-Cookie', `${AUTH_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_DURATION_SECONDS}`);
}

app.get('/api/auth/status', (req, res) => {
    res.json({ configurado: db.prepare('SELECT COUNT(*) AS total FROM usuarios').get().total > 0 });
});

app.post('/api/auth/register', (req, res) => {
    const { nome, email, senha, papel, telefone, tecnico_id } = req.body;
    const emailLimpo = String(email).trim().toLowerCase();

    if (!['admin', 'funcionario', 'cliente'].includes(papel)) return res.status(400).json({ erro: 'Perfil inválido.' });
    if (!nome || !emailLimpo.includes('@') || senha.length < 12) return res.status(400).json({ erro: 'Preencha os dados corretamente (Senha min 12).' });

    try {
        const senhaHash = hashSenha(senha);
        const usuario = db.transaction(() => {
            if (db.prepare('SELECT id FROM usuarios WHERE email = ?').get(emailLimpo)) throw new Error('Este e-mail já está em uso.');
            
            let clienteId = null;
            let tecnicoIdFinal = null;

            if (papel === 'cliente') {
                const cliente = db.prepare('INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)').run(nome, telefone || null, emailLimpo);
                clienteId = Number(cliente.lastInsertRowid);
            } else if (papel === 'funcionario' && tecnico_id) {
                tecnicoIdFinal = Number(tecnico_id);
            }

            const r = db.prepare('INSERT INTO usuarios (nome, email, senha_hash, papel, cliente_id, tecnico_id) VALUES (?, ?, ?, ?, ?, ?)').run(nome, emailLimpo, senhaHash, papel, clienteId, tecnicoIdFinal);
            return db.prepare('SELECT id, nome, email, papel FROM usuarios WHERE id = ?').get(Number(r.lastInsertRowid));
        })();
        
        emitirSessao(req, res, usuario);
        res.status(201).json({ usuario });
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
    }
});

app.post('/api/auth/login', (req, res) => {
    const { email, senha } = req.body;
    const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ? AND ativo = 1').get(String(email).toLowerCase());
    if (!usuario || !validarSenha(senha, usuario.senha_hash)) return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    emitirSessao(req, res, usuario);
    res.json({ usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel } });
});

app.post('/api/auth/logout', (req, res) => {
    const token = tokenDaRequisicao(req);
    if (token) db.prepare('DELETE FROM sessoes WHERE token_hash = ?').run(hashToken(token));
    res.setHeader('Set-Cookie', `${AUTH_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);
    res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => {
    if (!req.user) return res.status(401).json({ erro: 'Sessão encerrada.' });
    res.json({ usuario: req.user });
});

const paginas = { 'dashboard': ['admin', 'funcionario'], 'cadastros': ['admin', 'funcionario'], 'lista': ['admin', 'funcionario'], 'tecnicos': ['admin'], 'clientes': ['admin', 'funcionario'], 'detalhes': ['admin', 'funcionario', 'cliente'], 'usuarios': ['admin'], 'portal-cliente': ['cliente'] };
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

app.use('/api', exigirPapeis('admin', 'funcionario', 'cliente'));

function podeAcessarOrdem(usuario, ordemId) {
    if (usuario.papel === 'admin') return true;
    const o = db.prepare('SELECT cliente_id, tecnico_id FROM ordens_servico WHERE id = ?').get(ordemId);
    if (!o) return false;
    return usuario.papel === 'cliente' ? o.cliente_id === usuario.cliente_id : (usuario.papel === 'funcionario' && o.tecnico_id === usuario.tecnico_id);
}

app.get('/api/tecnicos', exigirPapeis('admin', 'funcionario'), (req, res) => res.json(db.prepare('SELECT id, nome FROM tecnicos ORDER BY nome').all()));
app.post('/api/tecnicos', exigirPapeis('admin'), (req, res) => {
    const { nome, email, telefone, especialidade } = req.body;
    try {
        const r = db.prepare('INSERT INTO tecnicos (nome, email, telefone, especialidade) VALUES (?, ?, ?, ?)').run(nome.trim(), email.trim().toLowerCase(), telefone.trim(), especialidade.trim());
        res.status(201).json({ id: Number(r.lastInsertRowid) });
    } catch (e) { res.status(400).json({ erro: 'E-mail já cadastrado.' }); }
});

app.get('/api/clientes', exigirPapeis('admin', 'funcionario'), (req, res) => {
    res.json(db.prepare(`SELECT c.id, c.nome, c.telefone, c.email, COUNT(o.id) AS total_os, COALESCE(SUM(o.status IN ('Aberta', 'Em execução')), 0) AS os_ativas, MAX(o.aberta_em) AS ultima_os FROM clientes c LEFT JOIN ordens_servico o ON o.cliente_id = c.id GROUP BY c.id ORDER BY c.nome`).all());
});

app.post('/api/ordens', exigirPapeis('admin', 'funcionario'), (req, res) => {
    const { cliente_id, cliente_nome, equipamento, tecnico_id, prioridade, descricao } = req.body;
    try {
        const id = db.transaction(() => {
            let cId = Number(cliente_id) || null;
            if (!cId) {
                let c = db.prepare('SELECT id FROM clientes WHERE nome = ? COLLATE NOCASE').get(cliente_nome);
                if (!c) c = { id: Number(db.prepare('INSERT INTO clientes (nome) VALUES (?)').run(cliente_nome).lastInsertRowid) };
                cId = c.id;
            }
            const tId = req.user.papel === 'funcionario' ? req.user.tecnico_id : (Number(tecnico_id) || null);
            return Number(db.prepare(`INSERT INTO ordens_servico (cliente_id, tecnico_id, equipamento, prioridade, descricao) VALUES (?, ?, ?, ?, ?)`).run(cId, tId, equipamento, prioridade || 'Média', descricao).lastInsertRowid);
        })();
        res.status(201).json({ id });
    } catch (e) { res.status(400).json({ erro: e.message }); }
});

app.get('/api/ordens', (req, res) => {
    let sql = `SELECT o.id, c.nome AS cliente, c.telefone AS cliente_telefone, c.email AS cliente_email, t.nome AS tecnico, o.equipamento, o.prioridade, o.status, o.descricao, o.aberta_em FROM ordens_servico o JOIN clientes c ON c.id = o.cliente_id LEFT JOIN tecnicos t ON t.id = o.tecnico_id`;
    if (req.user.papel === 'cliente') sql += ` WHERE o.cliente_id = ${req.user.cliente_id}`;
    else if (req.user.papel === 'funcionario') sql += ` WHERE o.tecnico_id = ${req.user.tecnico_id} OR o.tecnico_id IS NULL`;
    res.json(db.prepare(sql + ` ORDER BY o.id DESC`).all());
});

app.get('/api/ordens/:id', (req, res) => {
    if (!podeAcessarOrdem(req.user, req.params.id)) return res.status(403).json({ erro: 'Acesso negado.' });
    res.json(db.prepare(`SELECT o.*, c.nome AS cliente, c.telefone AS cliente_telefone, c.email AS cliente_email, t.nome AS tecnico FROM ordens_servico o JOIN clientes c ON c.id = o.cliente_id LEFT JOIN tecnicos t ON t.id = o.tecnico_id WHERE o.id = ?`).get(req.params.id));
});

app.put('/api/ordens/:id/status', exigirPapeis('admin', 'funcionario'), (req, res) => {
    if (!podeAcessarOrdem(req.user, req.params.id)) return res.status(403).json({ erro: 'Acesso negado.' });
    const { status, diagnostico } = req.body;
    db.prepare(`UPDATE ordens_servico SET status = ?, diagnostico = ?, fechada_em = CASE WHEN ? IN ('Concluída','Cancelada') THEN CURRENT_TIMESTAMP ELSE NULL END WHERE id = ?`).run(status, diagnostico || null, status, req.params.id);
    if (diagnostico) db.prepare(`INSERT INTO interacoes_cliente (ordem_id, autor_id, canal, mensagem) VALUES (?, ?, 'Atualização', ?)`).run(req.params.id, req.user.id, diagnostico);
    res.json({ ok: true });
});

app.get('/api/ordens/:id/interacoes', (req, res) => {
    if (!podeAcessarOrdem(req.user, req.params.id)) return res.status(403).json({ erro: 'Acesso negado.' });
    res.json(db.prepare(`SELECT id, canal, mensagem, criado_em FROM interacoes_cliente WHERE ordem_id = ? ORDER BY id DESC`).all(req.params.id));
});

app.post('/api/ordens/:id/interacoes', (req, res) => {
    if (!podeAcessarOrdem(req.user, req.params.id)) return res.status(403).json({ erro: 'Acesso negado.' });
    const r = db.prepare(`INSERT INTO interacoes_cliente (ordem_id, autor_id, canal, mensagem) VALUES (?, ?, ?, ?)`).run(req.params.id, req.user.id, req.body.canal || 'Nota', req.body.mensagem);
    res.status(201).json({ id: Number(r.lastInsertRowid) });
});

app.get('/api/dashboard', exigirPapeis('admin', 'funcionario'), (req, res) => {
    const f = req.user.papel === 'funcionario' ? `WHERE tecnico_id = ${req.user.tecnico_id} OR tecnico_id IS NULL` : '';
    res.json(db.prepare(`SELECT COUNT(*) AS total_os, SUM(status = 'Aberta') AS os_abertas, SUM(status = 'Em execução') AS em_execucao, SUM(status = 'Concluída') AS concluidas FROM ordens_servico ${f}`).get());
});

app.listen(3001, '127.0.0.1', () => {
    console.log('=============================================');
    console.log('✅ SERVIDOR NOVO CARREGADO SEM TRAVAS!');
    console.log('🚀 Rodando em http://localhost:3001');
    console.log('=============================================');
});