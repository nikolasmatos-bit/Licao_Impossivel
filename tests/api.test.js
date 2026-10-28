const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

const PORT = 3987;
const DB_PATH = path.join(os.tmpdir(), `mb-test-${Date.now()}.sqlite`);
const BASE = `http://127.0.0.1:${PORT}`;
let servidor;

const cookies = new Map();

async function req(method, rota, corpo) {
    const headers = { 'Content-Type': 'application/json' };
    const ck = [...cookies.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
    if (ck) headers.Cookie = ck;

    const resposta = await fetch(`${BASE}${rota}`, {
        method,
        headers,
        body: corpo ? JSON.stringify(corpo) : undefined
    });

    const setCookie = resposta.headers.get('set-cookie');
    if (setCookie) {
        const par = setCookie.split(';')[0];
        const idx = par.indexOf('=');
        const nome = par.slice(0, idx).trim();
        const valor = par.slice(idx + 1).trim();
        if (valor) cookies.set(nome, valor);
        else cookies.delete(nome);
    }

    const texto = await resposta.text();
    let json = null;
    try { json = texto ? JSON.parse(texto) : null; } catch {}
    return { status: resposta.status, json, texto };
}

before(async () => {
    servidor = spawn(process.execPath, ['server.js'], {
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, PORT: String(PORT), DATABASE_PATH: DB_PATH },
        stdio: 'pipe'
    });

    const limite = Date.now() + 20000;
    while (Date.now() < limite) {
        try {
            const r = await fetch(`${BASE}/api/auth/status`);
            if (r.ok) return;
        } catch {}
        await new Promise(r => setTimeout(r, 200));
    }
    throw new Error('Servidor não ficou pronto em 20s.');
});

after(() => {
    if (servidor) servidor.kill();
    try { fs.unlinkSync(DB_PATH); } catch {}
});

test('GET /api/auth/status — sistema ainda não configurado', async () => {
    const { status, json } = await req('GET', '/api/auth/status');
    assert.equal(status, 200);
    assert.equal(json.configurado, false);
});

test('POST /api/auth/setup — cria admin e autentica', async () => {
    const { status, json } = await req('POST', '/api/auth/setup', {
        nome: 'Admin Teste',
        email: 'admin@teste.com',
        senha: 'senha-super-segura-123'
    });
    assert.equal(status, 201);
    assert.equal(json.usuario.papel, 'admin');
});

test('POST /api/auth/setup — rejeita segunda configuração', async () => {
    const { status, json } = await req('POST', '/api/auth/setup', {
        nome: 'Outro', email: 'outro@teste.com', senha: 'senha-super-segura-123'
    });
    assert.equal(status, 409);
    assert.match(json.erro, /já foi concluída/i);
});

test('GET /api/auth/me — retorna o admin logado', async () => {
    const { status, json } = await req('GET', '/api/auth/me');
    assert.equal(status, 200);
    assert.equal(json.usuario.email, 'admin@teste.com');
});

test('POST /api/clientes — cria cliente', async () => {
    const { status, json } = await req('POST', '/api/clientes', {
        nome: 'Cliente Teste',
        telefone: '11999999999',
        email: 'cliente@teste.com'
    });
    assert.equal(status, 201);
    assert.ok(json.id);
});

test('POST /api/tecnicos — cria técnico', async () => {
    const { status, json } = await req('POST', '/api/tecnicos', {
        nome: 'Técnico Teste',
        email: 'tecnico@teste.com',
        telefone: '11888888888',
        especialidade: 'Informática'
    });
    assert.equal(status, 201);
    assert.ok(json.id);
});

test('PUT /api/tecnicos/:id — atualiza técnico', async () => {
    const lista = await req('GET', '/api/tecnicos/lista');
    const id = lista.json[0].id;
    const { status } = await req('PUT', `/api/tecnicos/${id}`, {
        nome: 'Técnico Atualizado',
        email: 'tecnico@teste.com',
        telefone: '11888888888',
        especialidade: 'Redes'
    });
    assert.equal(status, 200);
});

test('POST /api/ordens — cria OS', async () => {
    const { status, json } = await req('POST', '/api/ordens', {
        cliente_nome: 'Cliente Teste',
        cliente_telefone: '11999999999',
        cliente_email: 'cliente@teste.com',
        equipamento: 'Notebook Dell',
        tecnico_nome: 'Técnico Atualizado',
        prioridade: 'Alta',
        descricao: 'Não liga, suspeita de fonte.'
    });
    assert.equal(status, 201);
    assert.ok(json.id);
});

test('POST /api/ordens — rejeita payload inválido', async () => {
    const { status, json } = await req('POST', '/api/ordens', {
        cliente_nome: '', equipamento: '', descricao: 'curta', prioridade: 'X'
    });
    assert.equal(status, 400);
    assert.ok(json.erro);
});

test('GET /api/ordens — lista ordens', async () => {
    const { status, json } = await req('GET', '/api/ordens');
    assert.equal(status, 200);
    assert.equal(json.length, 1);
    assert.equal(json[0].status, 'Aberta');
});

test('PUT /api/ordens/:id/status — atualiza para Em execução', async () => {
    const lista = await req('GET', '/api/ordens');
    const id = lista.json[0].id;
    const { status } = await req('PUT', `/api/ordens/${id}/status`, {
        status: 'Em execução',
        diagnostico: 'Testando fonte'
    });
    assert.equal(status, 200);
});

test('POST /api/ordens/:id/interacoes — registra nota interna', async () => {
    const lista = await req('GET', '/api/ordens');
    const id = lista.json[0].id;
    const { status } = await req('POST', `/api/ordens/${id}/interacoes`, {
        canal: 'Nota',
        mensagem: 'Cliente autorizou abrir o equipamento.'
    });
    assert.equal(status, 201);
});

test('DELETE /api/ordens/:id — bloqueia enquanto não concluída', async () => {
    const lista = await req('GET', '/api/ordens');
    const id = lista.json[0].id;
    const { status } = await req('DELETE', `/api/ordens/${id}`);
    assert.equal(status, 409);
});

test('DELETE /api/ordens/:id — conclui e depois exclui', async () => {
    const lista = await req('GET', '/api/ordens');
    const id = lista.json[0].id;
    await req('PUT', `/api/ordens/${id}/status`, { status: 'Concluída', diagnostico: 'OK' });
    const { status } = await req('DELETE', `/api/ordens/${id}`);
    assert.equal(status, 200);
});

test('DELETE /api/tecnicos/:id — exclui técnico sem ordens', async () => {
    const lista = await req('GET', '/api/tecnicos/lista');
    const id = lista.json[0].id;
    const { status } = await req('DELETE', `/api/tecnicos/${id}`);
    assert.equal(status, 200);
});

test('POST /api/auth/logout — encerra sessão', async () => {
    const { status } = await req('POST', '/api/auth/logout');
    assert.equal(status, 200);
});

test('GET /api/auth/me — retorna 401 após logout', async () => {
    const { status } = await req('GET', '/api/auth/me');
    assert.equal(status, 401);
});