const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const net = require('node:net');

function portaLivre() {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.once('error', reject);
        server.listen(0, '127.0.0.1', () => {
            const porta = server.address().port;
            server.close(() => resolve(porta));
        });
    });
}

test('integração: permissões, cadastro, ordens, contatos, dashboard e notas privadas', { timeout: 60000 }, async () => {
    const diretorio = fs.mkdtempSync(path.join(os.tmpdir(), 'megabrain-correcoes-'));
    const porta = await portaLivre();
    const base = `http://127.0.0.1:${porta}`;
    const servidor = spawn(process.execPath, ['server.js'], {
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, PORT: String(porta), DATABASE_PATH: path.join(diretorio, 'teste.sqlite') },
        stdio: 'pipe'
    });
    let saida = '';
    servidor.stderr.on('data', trecho => { saida += trecho.toString(); });
    servidor.stdout.on('data', trecho => { saida += trecho.toString(); });
    function sessao() {
        let cookie = '';
        return async function requisitar(metodo, rota, body) {
            const r = await fetch(base + rota, {
                method: metodo,
                headers: { ...(cookie ? { cookie } : {}), ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
                body: body === undefined ? undefined : JSON.stringify(body),
                redirect: 'manual'
            });
            const c = r.headers.get('set-cookie');
            if (c) cookie = c.split(';')[0];
            const raw = await r.text();
            let dados;
            try { dados = JSON.parse(raw); } catch { dados = raw; }
            return { status: r.status, dados };
        };
    }
    const semLogin = sessao();
    const admin = sessao();
    const cliente = sessao();
    const funcionario = sessao();
    try {
        const limite = Date.now() + 25000;
        let iniciou = false;
        while (Date.now() < limite && servidor.exitCode === null) {
            try { const r = await fetch(base + '/api/auth/status'); if (r.ok) { iniciou = true; break; } }
            catch {}
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        assert.ok(iniciou, `Servidor não iniciou: ${saida}`);
        assert.equal((await semLogin('POST', '/api/auth/register', {
            nome: 'Invasor', email: 'admin.fake@teste.com', senha: 'senha-de-12-caracteres', papel: 'admin'
        })).status, 400);
        assert.equal((await semLogin('GET', '/api/usuarios')).status, 401);
        const setup = await admin('POST', '/api/auth/setup', {
            nome: 'Admin', email: 'admin@local.test', senha: 'senha-super-segura-123'
        });
        assert.equal(setup.status, 201);
        assert.equal((await semLogin('POST', '/api/auth/setup', {
            nome: 'Outro', email: 'outro@local.test', senha: 'senha-super-segura-123'
        })).status, 409);
        assert.equal((await admin('POST', '/api/tecnicos', {
            nome: 'Tecnico Uno', email: 'tecnico@local.test', telefone: '11999990000', especialidade: 'Computadores'
        })).status, 201);
        const os = await admin('POST', '/api/ordens', {
            cliente_nome: 'Cliente Novo', cliente_telefone: '11922223333', cliente_email: 'pessoa@local.test',
            equipamento: 'Computador', tecnico_nome: 'Tecnico Uno', descricao: 'Computador não liga ao apertar botão', prioridade: 'Alta'
        });
        assert.equal(os.status, 201);
        const id = os.dados.id;
        const detalhe = await admin('GET', `/api/ordens/${id}`);
        assert.equal(detalhe.dados.cliente_telefone, '11922223333');
        assert.equal(detalhe.dados.cliente_email, 'pessoa@local.test');
        assert.equal(detalhe.dados.tecnico, 'Tecnico Uno');
        const dashboard = await admin('GET', '/api/dashboard');
        assert.equal(dashboard.status, 200);
        assert.equal(dashboard.dados.total_os, 1);
        assert.equal(dashboard.dados.alta_prioridade, 1);
        assert.equal(dashboard.dados.distribuicao.find(x => x.status === 'Aberta').total, 1);
        assert.equal(dashboard.dados.sem_responsavel, 0);
        assert.ok(dashboard.dados.atualizado_em);
        assert.equal((await admin('POST', `/api/ordens/${id}/interacoes`, {
            canal: 'Nota', mensagem: 'Esta é uma nota apenas para a equipe'
        })).status, 201);
        assert.equal((await admin('POST', `/api/ordens/${id}/interacoes`, {
            canal: 'Atualização', mensagem: 'Seu aparelho está em análise'
        })).status, 201);
        const listaClientes = await admin('GET', '/api/clientes');
        assert.equal(listaClientes.dados.length, 1);
        const clienteId = listaClientes.dados[0].id;
        assert.equal((await admin('POST', '/api/usuarios', {
            nome: 'Cliente Conta', email: 'conta@local.test', papel: 'cliente', cliente_id: clienteId,
            senha: 'senha-super-segura-123'
        })).status, 201);
        assert.equal((await cliente('POST', '/api/auth/login', {
            email: 'conta@local.test', senha: 'senha-super-segura-123'
        })).status, 200);
        assert.equal((await cliente('GET', '/api/ordens')).dados.length, 1);
        const historicoCliente = await cliente('GET', `/api/ordens/${id}/interacoes`);
        assert.equal(historicoCliente.status, 200);
        assert.equal(historicoCliente.dados.length, 1);
        assert.equal(historicoCliente.dados[0].mensagem, 'Seu aparelho está em análise');
        assert.equal((await cliente('POST', '/api/usuarios', {
            nome: 'Outro', email: 'outro2@local.test', papel: 'admin', senha: 'senha-super-segura-123'
        })).status, 403);
        assert.equal((await cliente('PUT', `/api/ordens/${id}/status`, { status: 'Concluída' })).status, 403);
        assert.equal((await cliente('POST', `/api/ordens/${id}/interacoes`, { canal: 'Nota', mensagem: 'Resposta do cliente' })).status, 201);
        assert.equal((await cliente('GET', `/api/ordens/${id}/interacoes`)).dados.length, 2);
        const tId = (await admin('GET', '/api/tecnicos')).dados[0].id;
        assert.equal((await admin('POST', '/api/usuarios', {
            nome: 'Funcionário', email: 'func@local.test', senha: 'senha-super-segura-123', papel: 'funcionario', tecnico_id: tId
        })).status, 201);
        assert.equal((await funcionario('POST', '/api/auth/login', { email: 'func@local.test', senha: 'senha-super-segura-123' })).status, 200);
        assert.equal((await funcionario('GET', `/api/ordens/${id}`)).status, 200);
        const semResponsavel = await admin('POST', '/api/ordens', {
            cliente_id: clienteId, equipamento: 'Televisão', descricao: 'A televisão está com a tela apagada', prioridade: 'Média'
        });
        assert.equal(semResponsavel.status, 201);
        assert.equal((await funcionario('GET', `/api/ordens/${semResponsavel.dados.id}`)).status, 200);
        assert.equal((await funcionario('GET', '/api/ordens')).dados.length, 2);
        assert.equal((await admin('PUT', `/api/ordens/${id}/status`, { status: 'INCORRETO' })).status, 400);
        assert.equal((await admin('DELETE', `/api/ordens/${id}`)).status, 409);
        assert.equal((await admin('PUT', `/api/ordens/${id}/status`, { status: 'Concluída', diagnostico: 'Resolvido' })).status, 200);
        assert.equal((await admin('PUT', `/api/ordens/${id}/status`, { status: 'Aberta' })).status, 409);
        assert.equal((await admin('DELETE', `/api/ordens/${id}`)).status, 200);
        assert.equal((await admin('DELETE', `/api/tecnicos/${tId}`)).status, 409);
        assert.equal((await admin('PATCH', `/api/usuarios/${setup.dados.usuario.id}/status`, { ativo: false })).status, 409);
        assert.equal((await admin('POST', '/api/auth/register', { papel: 'admin', nome: 'Alguém', email: 'a@b.test', senha: 'senha-super-segura-123' })).status, 400);
        assert.equal((await admin('POST', '/api/auth/login', { email: 'admin@local.test' })).status, 400);
        assert.equal((await admin('POST', '/api/tecnicos', { nome: 'Incompleto' })).status, 400);
        assert.equal((await admin('GET', '/dashboard.html')).status, 200);
    } finally {
        servidor.kill();
        fs.rmSync(diretorio, { force: true, recursive: true });
    }
});
