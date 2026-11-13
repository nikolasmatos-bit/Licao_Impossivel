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
// Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
const { test, before, after } = require('node:test');
// Declara assert com const (referência que não pode ser reatribuída) e atribui require('node:assert/strict');.
const assert = require('node:assert/strict');
// Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
const { spawn } = require('node:child_process');
// Declara path com const (referência que não pode ser reatribuída) e atribui require('node:path');.
const path = require('node:path');
// Declara fs com const (referência que não pode ser reatribuída) e atribui require('node:fs');.
const fs = require('node:fs');
// Declara os com const (referência que não pode ser reatribuída) e atribui require('node:os');.
const os = require('node:os');
// Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
const { portaLivre, pararServidor, removerDiretorioTemporario } = require('./helpers');

// Declara diretorio com const (referência que não pode ser reatribuída) e atribui fs.mkdtempSync(path.join(os.tmpdir(), 'megabrain-api-'));.
const diretorio = fs.mkdtempSync(path.join(os.tmpdir(), 'megabrain-api-'));
// Declara DB_PATH com const (referência que não pode ser reatribuída) e atribui path.join(diretorio, 'teste.sqlite');.
const DB_PATH = path.join(diretorio, 'teste.sqlite');
// Declara BASE com let (variável que pode ser reatribuída) e atribui o valor indicado nas próximas linhas.
let BASE;
// Declara servidor com let (variável que pode ser reatribuída) e atribui o valor indicado nas próximas linhas.
let servidor;

// Cria uma nova instância e a armazena em cookies; usa const (referência que não pode ser reatribuída).
const cookies = new Map();

// Declara a função req; os parâmetros (method, rota, corpo) recebem dados quando ela é chamada. A função async pode aguardar tarefas assíncronas.
async function req(method, rota, corpo) {
    // Declara headers com const (referência que não pode ser reatribuída) e atribui { 'Content-Type': 'application/json' };.
    const headers = { 'Content-Type': 'application/json' };
    // Define ck com uma função de seta ou com uma expressão; usa const (referência que não pode ser reatribuída).
    const ck = [...cookies.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
    // Verifica a condição (ck) headers.Cookie = ck;; só executa o trecho correspondente quando ela for verdadeira.
    if (ck) headers.Cookie = ck;

    // Espera o resultado assíncrono e o armazena em resposta; usa const (referência que não pode ser reatribuída).
    const resposta = await fetch(`${BASE}${rota}`, {
        // Completa a expressão/chamada JavaScript do bloco atual, utilizando os valores indicados na linha.
        method,
        // Completa a expressão/chamada JavaScript do bloco atual, utilizando os valores indicados na linha.
        headers,
        // Serializa dados JavaScript para texto JSON, usado no corpo da requisição.
        body: corpo ? JSON.stringify(corpo) : undefined
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });

    // Declara setCookie com const (referência que não pode ser reatribuída) e atribui resposta.headers.get('set-cookie');.
    const setCookie = resposta.headers.get('set-cookie');
    // Verifica a condição (setCookie) {; só executa o trecho correspondente quando ela for verdadeira.
    if (setCookie) {
        // Declara par com const (referência que não pode ser reatribuída) e atribui setCookie.split(';')[0];.
        const par = setCookie.split(';')[0];
        // Declara idx com const (referência que não pode ser reatribuída) e atribui par.indexOf('=');.
        const idx = par.indexOf('=');
        // Declara nome com const (referência que não pode ser reatribuída) e atribui par.slice(0, idx).trim();.
        const nome = par.slice(0, idx).trim();
        // Declara valor com const (referência que não pode ser reatribuída) e atribui par.slice(idx + 1).trim();.
        const valor = par.slice(idx + 1).trim();
        // Verifica a condição (valor) cookies.set(nome, valor);; só executa o trecho correspondente quando ela for verdadeira.
        if (valor) cookies.set(nome, valor);
        // Completa a expressão/chamada JavaScript do bloco atual, utilizando os valores indicados na linha.
        else cookies.delete(nome);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }

    // Espera o resultado assíncrono e o armazena em texto; usa const (referência que não pode ser reatribuída).
    const texto = await resposta.text();
    // Declara json com let (variável que pode ser reatribuída) e atribui null;.
    let json = null;
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try { json = texto ? JSON.parse(texto) : null; } catch {}
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return { status: resposta.status, json, texto };
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Chama a função before com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
before(async () => {
    // Espera o resultado assíncrono e o armazena em PORT; usa const (referência que não pode ser reatribuída).
    const PORT = await portaLivre();
    // Atribui ou atualiza BASE com o resultado da expressão à direita do sinal =.
    BASE = `http://127.0.0.1:${PORT}`;
    // Atribui ou atualiza servidor com o resultado da expressão à direita do sinal =.
    servidor = spawn(process.execPath, ['server/server.js'], {
        // Define a propriedade cwd do objeto; o valor utilizado é path.join(__dirname, '..'),.
        cwd: path.join(__dirname, '..'),
        // Consulta uma variável de ambiente que permite configurar o servidor.
        env: { ...process.env, PORT: String(PORT), DATABASE_PATH: DB_PATH },
        // Define a propriedade stdio do objeto; o valor utilizado é 'pipe'.
        stdio: 'pipe'
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });

    // Declara limite com const (referência que não pode ser reatribuída) e atribui Date.now() + 20000;.
    const limite = Date.now() + 20000;
    // Repete este trecho enquanto a condição permanecer verdadeira.
    while (Date.now() < limite) {
        // Inicia a tentativa de uma operação que poderá gerar uma exceção.
        try {
            // Espera o resultado assíncrono e o armazena em r; usa const (referência que não pode ser reatribuída).
            const r = await fetch(`${BASE}/api/auth/status`);
            // Verifica a condição (r.ok) return;; só executa o trecho correspondente quando ela for verdadeira.
            if (r.ok) return;
        // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
        } catch {}
        // Espera a operação assíncrona terminar antes de continuar com o resultado.
        await new Promise(r => setTimeout(r, 200));
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
    // Lança uma exceção para que o erro seja tratado por um bloco catch ou pelo chamador.
    throw new Error('Servidor não ficou pronto em 20s.');
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função after com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
after(async () => {
    // Espera a operação assíncrona terminar antes de continuar com o resultado.
    await pararServidor(servidor);
    // Chama a função removerDiretorioTemporario com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    removerDiretorioTemporario(diretorio);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('GET /api/auth/status — sistema ainda não configurado', async () => {
    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status, json } = await req('GET', '/api/auth/status');
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 200);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(json.configurado, false);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('POST /api/auth/setup — cria admin e autentica', async () => {
    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status, json } = await req('POST', '/api/auth/setup', {
        // Define a propriedade nome do objeto; o valor utilizado é 'Admin Teste',.
        nome: 'Admin Teste',
        // Define a propriedade email do objeto; o valor utilizado é 'admin@teste.com',.
        email: 'admin@teste.com',
        // Define a propriedade senha do objeto; o valor utilizado é 'senha-super-segura-123'.
        senha: 'senha-super-segura-123'
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 201);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(json.usuario.papel, 'admin');
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('POST /api/auth/setup — rejeita segunda configuração', async () => {
    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status, json } = await req('POST', '/api/auth/setup', {
        // Define a propriedade nome do objeto; o valor utilizado é 'Outro', email: 'outro@teste.com', senha: 'senha-super-segura-123'.
        nome: 'Outro', email: 'outro@teste.com', senha: 'senha-super-segura-123'
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 409);
    // Chama a função assert.match com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.match(json.erro, /já foi concluída/i);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('GET /api/auth/me — retorna o admin logado', async () => {
    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status, json } = await req('GET', '/api/auth/me');
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 200);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(json.usuario.email, 'admin@teste.com');
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('POST /api/clientes — cria cliente', async () => {
    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status, json } = await req('POST', '/api/clientes', {
        // Define a propriedade nome do objeto; o valor utilizado é 'Cliente Teste',.
        nome: 'Cliente Teste',
        // Define a propriedade telefone do objeto; o valor utilizado é '11999999999',.
        telefone: '11999999999',
        // Define a propriedade email do objeto; o valor utilizado é 'cliente@teste.com'.
        email: 'cliente@teste.com'
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 201);
    // Chama a função assert.ok com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.ok(json.id);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('POST /api/tecnicos — cria técnico', async () => {
    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status, json } = await req('POST', '/api/tecnicos', {
        // Define a propriedade nome do objeto; o valor utilizado é 'Técnico Teste',.
        nome: 'Técnico Teste',
        // Define a propriedade email do objeto; o valor utilizado é 'tecnico@teste.com',.
        email: 'tecnico@teste.com',
        // Define a propriedade telefone do objeto; o valor utilizado é '11888888888',.
        telefone: '11888888888',
        // Define a propriedade especialidade do objeto; o valor utilizado é 'Informática'.
        especialidade: 'Informática'
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 201);
    // Chama a função assert.ok com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.ok(json.id);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('POST /api/usuarios — cria funcionário vinculado ao técnico', async () => {
    // Espera o resultado assíncrono e o armazena em tecnicos; usa const (referência que não pode ser reatribuída).
    const tecnicos = await req('GET', '/api/tecnicos');
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(tecnicos.status, 200);
    // Chama a função assert.ok com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.ok(Number.isInteger(tecnicos.json[0].id));

    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status, json } = await req('POST', '/api/usuarios', {
        // Define a propriedade nome do objeto; o valor utilizado é 'Funcionário Teste',.
        nome: 'Funcionário Teste',
        // Define a propriedade email do objeto; o valor utilizado é 'funcionario@teste.com',.
        email: 'funcionario@teste.com',
        // Define a propriedade senha do objeto; o valor utilizado é 'senha-super-segura-123',.
        senha: 'senha-super-segura-123',
        // Define a propriedade papel do objeto; o valor utilizado é 'funcionario',.
        papel: 'funcionario',
        // Define a propriedade tecnico_id do objeto; o valor utilizado é tecnicos.json[0].id.
        tecnico_id: tecnicos.json[0].id
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });

    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 201);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(json.mensagem, 'Conta criada.');
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('POST /api/usuarios — administrador cria contas de cliente e admin', async () => {
    // Espera o resultado assíncrono e o armazena em clientes; usa const (referência que não pode ser reatribuída).
    const clientes = await req('GET', '/api/clientes');
    // Espera o resultado assíncrono e o armazena em cliente; usa const (referência que não pode ser reatribuída).
    const cliente = await req('POST', '/api/usuarios', {
        // Define a propriedade nome do objeto; o valor utilizado é 'Conta Cliente Teste',.
        nome: 'Conta Cliente Teste',
        // Define a propriedade email do objeto; o valor utilizado é 'conta.cliente@teste.com',.
        email: 'conta.cliente@teste.com',
        // Define a propriedade senha do objeto; o valor utilizado é 'senha-super-segura-123',.
        senha: 'senha-super-segura-123',
        // Define a propriedade papel do objeto; o valor utilizado é 'cliente',.
        papel: 'cliente',
        // Define a propriedade cliente_id do objeto; o valor utilizado é clientes.json[0].id.
        cliente_id: clientes.json[0].id
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
    // Espera o resultado assíncrono e o armazena em admin; usa const (referência que não pode ser reatribuída).
    const admin = await req('POST', '/api/usuarios', {
        // Define a propriedade nome do objeto; o valor utilizado é 'Segundo Admin',.
        nome: 'Segundo Admin',
        // Define a propriedade email do objeto; o valor utilizado é 'segundo.admin@teste.com',.
        email: 'segundo.admin@teste.com',
        // Define a propriedade senha do objeto; o valor utilizado é 'senha-super-segura-123',.
        senha: 'senha-super-segura-123',
        // Define a propriedade papel do objeto; o valor utilizado é 'admin'.
        papel: 'admin'
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });

    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(cliente.status, 201);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(admin.status, 201);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('PUT /api/tecnicos/:id — atualiza técnico', async () => {
    // Espera o resultado assíncrono e o armazena em lista; usa const (referência que não pode ser reatribuída).
    const lista = await req('GET', '/api/tecnicos/lista');
    // Declara id com const (referência que não pode ser reatribuída) e atribui lista.json[0].id;.
    const id = lista.json[0].id;
    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status } = await req('PUT', `/api/tecnicos/${id}`, {
        // Define a propriedade nome do objeto; o valor utilizado é 'Técnico Atualizado',.
        nome: 'Técnico Atualizado',
        // Define a propriedade email do objeto; o valor utilizado é 'tecnico@teste.com',.
        email: 'tecnico@teste.com',
        // Define a propriedade telefone do objeto; o valor utilizado é '11888888888',.
        telefone: '11888888888',
        // Define a propriedade especialidade do objeto; o valor utilizado é 'Redes'.
        especialidade: 'Redes'
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 200);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('POST /api/ordens — cria OS', async () => {
    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status, json } = await req('POST', '/api/ordens', {
        // Define a propriedade cliente_nome do objeto; o valor utilizado é 'Cliente Teste',.
        cliente_nome: 'Cliente Teste',
        // Define a propriedade cliente_telefone do objeto; o valor utilizado é '11999999999',.
        cliente_telefone: '11999999999',
        // Define a propriedade cliente_email do objeto; o valor utilizado é 'cliente@teste.com',.
        cliente_email: 'cliente@teste.com',
        // Define a propriedade equipamento do objeto; o valor utilizado é 'Notebook Dell',.
        equipamento: 'Notebook Dell',
        // Define a propriedade tecnico_nome do objeto; o valor utilizado é 'Técnico Atualizado',.
        tecnico_nome: 'Técnico Atualizado',
        // Define a propriedade prioridade do objeto; o valor utilizado é 'Alta',.
        prioridade: 'Alta',
        // Define a propriedade descricao do objeto; o valor utilizado é 'Não liga, suspeita de fonte.'.
        descricao: 'Não liga, suspeita de fonte.'
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 201);
    // Chama a função assert.ok com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.ok(json.id);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('POST /api/ordens — rejeita payload inválido', async () => {
    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status, json } = await req('POST', '/api/ordens', {
        // Define a propriedade cliente_nome do objeto; o valor utilizado é '', equipamento: '', descricao: 'curta', prioridade: 'X'.
        cliente_nome: '', equipamento: '', descricao: 'curta', prioridade: 'X'
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 400);
    // Chama a função assert.ok com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.ok(json.erro);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('GET /api/ordens — lista ordens', async () => {
    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status, json } = await req('GET', '/api/ordens');
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 200);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(json.length, 1);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(json[0].status, 'Aberta');
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('PUT /api/ordens/:id/status — atualiza para Em execução', async () => {
    // Espera o resultado assíncrono e o armazena em lista; usa const (referência que não pode ser reatribuída).
    const lista = await req('GET', '/api/ordens');
    // Declara id com const (referência que não pode ser reatribuída) e atribui lista.json[0].id;.
    const id = lista.json[0].id;
    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status } = await req('PUT', `/api/ordens/${id}/status`, {
        // Define a propriedade status do objeto; o valor utilizado é 'Em execução',.
        status: 'Em execução',
        // Define a propriedade diagnostico do objeto; o valor utilizado é 'Testando fonte'.
        diagnostico: 'Testando fonte'
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 200);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('POST /api/ordens/:id/interacoes — registra nota interna', async () => {
    // Espera o resultado assíncrono e o armazena em lista; usa const (referência que não pode ser reatribuída).
    const lista = await req('GET', '/api/ordens');
    // Declara id com const (referência que não pode ser reatribuída) e atribui lista.json[0].id;.
    const id = lista.json[0].id;
    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status } = await req('POST', `/api/ordens/${id}/interacoes`, {
        // Define a propriedade canal do objeto; o valor utilizado é 'Nota',.
        canal: 'Nota',
        // Define a propriedade mensagem do objeto; o valor utilizado é 'Cliente autorizou abrir o equipamento.'.
        mensagem: 'Cliente autorizou abrir o equipamento.'
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 201);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('DELETE /api/ordens/:id — bloqueia enquanto não concluída', async () => {
    // Espera o resultado assíncrono e o armazena em lista; usa const (referência que não pode ser reatribuída).
    const lista = await req('GET', '/api/ordens');
    // Declara id com const (referência que não pode ser reatribuída) e atribui lista.json[0].id;.
    const id = lista.json[0].id;
    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status } = await req('DELETE', `/api/ordens/${id}`);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 409);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('DELETE /api/ordens/:id — conclui e depois exclui', async () => {
    // Espera o resultado assíncrono e o armazena em lista; usa const (referência que não pode ser reatribuída).
    const lista = await req('GET', '/api/ordens');
    // Declara id com const (referência que não pode ser reatribuída) e atribui lista.json[0].id;.
    const id = lista.json[0].id;
    // Espera a operação assíncrona terminar antes de continuar com o resultado.
    await req('PUT', `/api/ordens/${id}/status`, { status: 'Concluída', diagnostico: 'OK' });
    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status } = await req('DELETE', `/api/ordens/${id}`);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 200);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('DELETE /api/tecnicos/:id — exclui técnico sem ordens', async () => {
    // Espera a operação assíncrona terminar antes de continuar com o resultado.
    await req('POST', '/api/tecnicos', {
        // Define a propriedade nome do objeto; o valor utilizado é 'Técnico Livre',.
        nome: 'Técnico Livre',
        // Define a propriedade email do objeto; o valor utilizado é 'livre@teste.com',.
        email: 'livre@teste.com',
        // Define a propriedade telefone do objeto; o valor utilizado é '11777777777',.
        telefone: '11777777777',
        // Define a propriedade especialidade do objeto; o valor utilizado é 'Manutenção'.
        especialidade: 'Manutenção'
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
    // Espera o resultado assíncrono e o armazena em lista; usa const (referência que não pode ser reatribuída).
    const lista = await req('GET', '/api/tecnicos/lista');
    // Define id com uma função de seta ou com uma expressão; usa const (referência que não pode ser reatribuída).
    const id = lista.json.find(tecnico => tecnico.email === 'livre@teste.com').id;
    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status } = await req('DELETE', `/api/tecnicos/${id}`);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 200);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('POST /api/auth/logout — encerra sessão', async () => {
    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status } = await req('POST', '/api/auth/logout');
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 200);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('GET /api/auth/me — retorna 401 após logout', async () => {
    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status } = await req('GET', '/api/auth/me');
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 401);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('POST /api/auth/register — cria conta de cliente e autentica', async () => {
    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status, json } = await req('POST', '/api/auth/register', {
        // Define a propriedade nome do objeto; o valor utilizado é 'Cliente Registro',.
        nome: 'Cliente Registro',
        // Define a propriedade email do objeto; o valor utilizado é 'cliente.registro@teste.com',.
        email: 'cliente.registro@teste.com',
        // Define a propriedade senha do objeto; o valor utilizado é 'senha-super-segura-123',.
        senha: 'senha-super-segura-123',
        // Define a propriedade papel do objeto; o valor utilizado é 'cliente',.
        papel: 'cliente',
        // Define a propriedade telefone do objeto; o valor utilizado é '11999999999'.
        telefone: '11999999999'
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });

    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 201);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(json.usuario.papel, 'cliente');
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(json.usuario.email, 'cliente.registro@teste.com');

    // Espera o resultado assíncrono e o armazena em paginaPortal; usa const (referência que não pode ser reatribuída).
    const paginaPortal = await req('GET', '/portal-cliente.html');
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(paginaPortal.status, 200);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('POST /api/auth/register — não permite criar conta de funcionário publicamente', async () => {
    // Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
    const { status, json } = await req('POST', '/api/auth/register', {
        // Define a propriedade nome do objeto; o valor utilizado é 'Funcionário sem autorização',.
        nome: 'Funcionário sem autorização',
        // Define a propriedade email do objeto; o valor utilizado é 'funcionario.publico@teste.com',.
        email: 'funcionario.publico@teste.com',
        // Define a propriedade senha do objeto; o valor utilizado é 'senha-super-segura-123',.
        senha: 'senha-super-segura-123',
        // Define a propriedade papel do objeto; o valor utilizado é 'funcionario',.
        papel: 'funcionario',
        // Define a propriedade telefone do objeto; o valor utilizado é '11999999999',.
        telefone: '11999999999',
        // Define a propriedade especialidade do objeto; o valor utilizado é 'Suporte'.
        especialidade: 'Suporte'
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });

    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(status, 400);
    // Chama a função assert.match com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.match(json.erro, /perfil válido/i);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
