const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { portaLivre, pararServidor, removerDiretorioTemporario } = require('./helpers');

const senha = 'senha-regressoes-segura-123';
let diretorio;
let servidor;
let base;

function sessao() {
    let cookie = '';
    return async (metodo, rota, dados) => {
        const resposta = await fetch(base + rota, {
            method: metodo,
            headers: { ...(cookie ? { cookie } : {}), ...(dados === undefined ? {} : { 'Content-Type': 'application/json' }) },
            body: dados === undefined ? undefined : JSON.stringify(dados),
            redirect: 'manual'
        });
        const novoCookie = resposta.headers.get('set-cookie');
        if (novoCookie) cookie = novoCookie.split(';')[0];
        return { status: resposta.status, dados: await resposta.json() };
    };
}

const admin = sessao();

before(async () => {
    diretorio = fs.mkdtempSync(path.join(os.tmpdir(), 'megabrain-vinculos-'));
    const porta = await portaLivre();
    base = `http://127.0.0.1:${porta}`;
    servidor = spawn(process.execPath, ['server.js'], {
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, PORT: String(porta), DATABASE_PATH: path.join(diretorio, 'teste.sqlite') },
        stdio: 'pipe'
    });
    let saida = '';
    servidor.stdout.on('data', trecho => { saida += trecho.toString(); });
    servidor.stderr.on('data', trecho => { saida += trecho.toString(); });
    const limite = Date.now() + 20000;
    let iniciou = false;
    while (Date.now() < limite && servidor.exitCode === null) {
        try {
            if ((await fetch(base + '/api/auth/status')).ok) { iniciou = true; break; }
        } catch {}
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.ok(iniciou, `Servidor não iniciou: ${saida}`);
    assert.equal((await admin('POST', '/api/auth/setup', {
        nome: 'Admin Regressões', email: 'admin@vinculos.test', senha
    })).status, 201);
});

after(async () => {
    await pararServidor(servidor);
    if (diretorio) removerDiretorioTemporario(diretorio);
});

function ordem(dados) {
    return {
        equipamento: 'Notebook de teste', descricao: 'O equipamento não liga ao pressionar o botão.',
        ...dados
    };
}

async function criarCliente(dados) {
    const resposta = await admin('POST', '/api/clientes', dados);
    assert.equal(resposta.status, 201);
    return resposta.dados.id;
}

test('clientes homônimos mantêm ordens separadas e não acessam o portal um do outro', async () => {
    const primeira = await admin('POST', '/api/ordens', ordem({
        cliente_nome: 'Cliente Homônimo', cliente_email: 'homonimo.a@vinculos.test'
    }));
    const segunda = await admin('POST', '/api/ordens', ordem({
        cliente_nome: 'Cliente Homônimo', cliente_email: 'homonimo.b@vinculos.test'
    }));
    assert.equal(primeira.status, 201);
    assert.equal(segunda.status, 201);
    const detalheA = await admin('GET', `/api/ordens/${primeira.dados.id}`);
    const detalheB = await admin('GET', `/api/ordens/${segunda.dados.id}`);
    assert.notEqual(detalheA.dados.cliente_id, detalheB.dados.cliente_id);
    assert.equal(detalheA.dados.cliente_email, 'homonimo.a@vinculos.test');
    assert.equal(detalheB.dados.cliente_email, 'homonimo.b@vinculos.test');
    assert.equal((await admin('POST', '/api/usuarios', {
        nome: 'Conta do primeiro cliente', email: 'conta.homonimo@vinculos.test', senha,
        papel: 'cliente', cliente_id: detalheA.dados.cliente_id
    })).status, 201);
    const cliente = sessao();
    assert.equal((await cliente('POST', '/api/auth/login', {
        email: 'conta.homonimo@vinculos.test', senha
    })).status, 200);
    assert.deepEqual((await cliente('GET', '/api/ordens')).dados.map(item => item.id), [primeira.dados.id]);
    assert.equal((await cliente('GET', `/api/ordens/${primeira.dados.id}`)).status, 200);
    assert.equal((await cliente('GET', `/api/ordens/${segunda.dados.id}`)).status, 403);
    assert.equal((await cliente('GET', `/api/ordens/${segunda.dados.id}/interacoes`)).status, 403);
});

test('cadastro público não duplica cliente existente nem concede acesso sem vínculo pelo administrador', async () => {
    const clienteId = await criarCliente({ nome: 'Cliente com Histórico', email: 'historico@vinculos.test' });
    const criada = await admin('POST', '/api/ordens', ordem({ cliente_id: clienteId }));
    assert.equal(criada.status, 201);
    const clientesAntes = (await admin('GET', '/api/clientes')).dados;
    const visitante = sessao();
    const registro = await visitante('POST', '/api/auth/register', {
        nome: 'Cliente com Histórico', email: 'HISTORICO@VINCULOS.TEST', senha, papel: 'cliente'
    });
    assert.equal(registro.status, 409);
    assert.match(registro.dados.erro, /equipe|administrador|acesso/i);
    assert.deepEqual((await admin('GET', '/api/clientes')).dados, clientesAntes);
    assert.equal((await visitante('GET', '/api/auth/me')).status, 401);
    assert.equal((await visitante('GET', '/api/ordens')).status, 401);
    assert.equal((await admin('POST', '/api/usuarios', {
        nome: 'Cliente com Histórico', email: 'historico@vinculos.test', senha,
        papel: 'cliente', cliente_id: clienteId
    })).status, 201);
    assert.equal((await visitante('POST', '/api/auth/login', { email: 'historico@vinculos.test', senha })).status, 200);
    assert.deepEqual((await visitante('GET', '/api/ordens')).dados.map(item => item.id), [criada.dados.id]);
});

test('ordens exigem seleção por ID quando o e-mail ou o nome do cliente é ambíguo', async () => {
    const primeiroId = await criarCliente({ nome: 'Cadastro legado A', email: 'repetido@vinculos.test' });
    const segundoId = await criarCliente({ nome: 'Cadastro legado B', email: 'REPETIDO@vinculos.test' });
    const ordensAntes = (await admin('GET', '/api/ordens')).dados.length;
    const ambigua = await admin('POST', '/api/ordens', ordem({
        cliente_nome: 'Cadastro legado A', cliente_email: 'repetido@vinculos.test'
    }));
    assert.equal(ambigua.status, 409);
    assert.equal((await admin('GET', '/api/ordens')).dados.length, ordensAntes);
    for (const clienteId of [primeiroId, segundoId]) {
        const explicita = await admin('POST', '/api/ordens', ordem({ cliente_id: clienteId }));
        assert.equal(explicita.status, 201);
        assert.equal((await admin('GET', `/api/ordens/${explicita.dados.id}`)).dados.cliente_id, clienteId);
    }
    const semEmailId = await criarCliente({ nome: 'Cliente sem e-mail' });
    const porNome = await admin('POST', '/api/ordens', ordem({ cliente_nome: 'Cliente sem e-mail' }));
    assert.equal(porNome.status, 409);
    const porId = await admin('POST', '/api/ordens', ordem({ cliente_id: semEmailId }));
    assert.equal(porId.status, 201);
    assert.equal((await admin('GET', `/api/ordens/${porId.dados.id}`)).dados.cliente_id, semEmailId);
});

test('técnicos homônimos são selecionados por ID e ordens sem responsável continuam permitidas', async () => {
    const clienteId = await criarCliente({ nome: 'Cliente Técnicos', email: 'tecnicos@vinculos.test' });
    const tecnicos = [];
    for (const email of ['tecnico.a@vinculos.test', 'tecnico.b@vinculos.test']) {
        const criado = await admin('POST', '/api/tecnicos', {
            nome: 'Técnico Homônimo', email, telefone: '11999990000', especialidade: 'Informática'
        });
        assert.equal(criado.status, 201);
        tecnicos.push(criado.dados.id);
    }
    const ambigua = await admin('POST', '/api/ordens', ordem({ cliente_id: clienteId, tecnico_nome: 'Técnico Homônimo' }));
    assert.equal(ambigua.status, 409);
    const explicita = await admin('POST', '/api/ordens', ordem({ cliente_id: clienteId, tecnico_id: tecnicos[1] }));
    assert.equal(explicita.status, 201);
    assert.equal((await admin('GET', `/api/ordens/${explicita.dados.id}`)).dados.tecnico_id, tecnicos[1]);
    for (let indice = 0; indice < tecnicos.length; indice++) {
        const email = `funcionario.${indice}@vinculos.test`;
        assert.equal((await admin('POST', '/api/usuarios', {
            nome: `Funcionário ${indice}`, email, senha, papel: 'funcionario', tecnico_id: tecnicos[indice]
        })).status, 201);
        const funcionario = sessao();
        assert.equal((await funcionario('POST', '/api/auth/login', { email, senha })).status, 200);
        assert.equal((await funcionario('GET', `/api/ordens/${explicita.dados.id}`)).status, indice === 1 ? 200 : 403);
    }
    const semTecnico = await admin('POST', '/api/ordens', ordem({ cliente_id: clienteId }));
    assert.equal(semTecnico.status, 201);
    assert.equal((await admin('GET', `/api/ordens/${semTecnico.dados.id}`)).dados.tecnico_id, null);
});
