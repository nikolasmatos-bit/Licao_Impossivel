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
// Declara fs com const (referência que não pode ser reatribuída) e atribui require('node:fs');.
const fs = require('node:fs');
// Declara os com const (referência que não pode ser reatribuída) e atribui require('node:os');.
const os = require('node:os');
// Declara path com const (referência que não pode ser reatribuída) e atribui require('node:path');.
const path = require('node:path');
// Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
const { portaLivre, pararServidor, removerDiretorioTemporario } = require('./helpers');

// Declara senha com const (referência que não pode ser reatribuída) e atribui 'senha-regressoes-segura-123';.
const senha = 'senha-regressoes-segura-123';
// Declara diretorio com let (variável que pode ser reatribuída) e atribui o valor indicado nas próximas linhas.
let diretorio;
// Declara servidor com let (variável que pode ser reatribuída) e atribui o valor indicado nas próximas linhas.
let servidor;
// Declara base com let (variável que pode ser reatribuída) e atribui o valor indicado nas próximas linhas.
let base;

// Declara a função sessao; os parâmetros (nenhum) recebem dados quando ela é chamada.
function sessao() {
    // Declara cookie com let (variável que pode ser reatribuída) e atribui '';.
    let cookie = '';
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return async (metodo, rota, dados) => {
        // Espera o resultado assíncrono e o armazena em resposta; usa const (referência que não pode ser reatribuída).
        const resposta = await fetch(base + rota, {
            // Define a propriedade method do objeto; o valor utilizado é metodo,.
            method: metodo,
            // Define a propriedade headers do objeto; o valor utilizado é { ...(cookie ? { cookie } : {}), ...(dados === undefined ? {} : { 'Content-Type': 'applicat….
            headers: { ...(cookie ? { cookie } : {}), ...(dados === undefined ? {} : { 'Content-Type': 'application/json' }) },
            // Serializa dados JavaScript para texto JSON, usado no corpo da requisição.
            body: dados === undefined ? undefined : JSON.stringify(dados),
            // Define a propriedade redirect do objeto; o valor utilizado é 'manual'.
            redirect: 'manual'
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        });
        // Declara novoCookie com const (referência que não pode ser reatribuída) e atribui resposta.headers.get('set-cookie');.
        const novoCookie = resposta.headers.get('set-cookie');
        // Verifica a condição (novoCookie) cookie = novoCookie.split(';')[0];; só executa o trecho correspondente quando ela for verdadeira.
        if (novoCookie) cookie = novoCookie.split(';')[0];
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return { status: resposta.status, dados: await resposta.json() };
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    };
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara admin com const (referência que não pode ser reatribuída) e atribui sessao();.
const admin = sessao();

// Chama a função before com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
before(async () => {
    // Atribui ou atualiza diretorio com o resultado da expressão à direita do sinal =.
    diretorio = fs.mkdtempSync(path.join(os.tmpdir(), 'megabrain-vinculos-'));
    // Espera o resultado assíncrono e o armazena em porta; usa const (referência que não pode ser reatribuída).
    const porta = await portaLivre();
    // Atribui ou atualiza base com o resultado da expressão à direita do sinal =.
    base = `http://127.0.0.1:${porta}`;
    // Atribui ou atualiza servidor com o resultado da expressão à direita do sinal =.
    servidor = spawn(process.execPath, ['server/server.js'], {
        // Define a propriedade cwd do objeto; o valor utilizado é path.join(__dirname, '..'),.
        cwd: path.join(__dirname, '..'),
        // Consulta uma variável de ambiente que permite configurar o servidor.
        env: { ...process.env, PORT: String(porta), DATABASE_PATH: path.join(diretorio, 'teste.sqlite') },
        // Define a propriedade stdio do objeto; o valor utilizado é 'pipe'.
        stdio: 'pipe'
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
    // Declara saida com let (variável que pode ser reatribuída) e atribui '';.
    let saida = '';
    // Chama a função servidor.stdout.on com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    servidor.stdout.on('data', trecho => { saida += trecho.toString(); });
    // Chama a função servidor.stderr.on com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    servidor.stderr.on('data', trecho => { saida += trecho.toString(); });
    // Declara limite com const (referência que não pode ser reatribuída) e atribui Date.now() + 20000;.
    const limite = Date.now() + 20000;
    // Declara iniciou com let (variável que pode ser reatribuída) e atribui false;.
    let iniciou = false;
    // Repete este trecho enquanto a condição permanecer verdadeira.
    while (Date.now() < limite && servidor.exitCode === null) {
        // Inicia a tentativa de uma operação que poderá gerar uma exceção.
        try {
            // Verifica a condição ((await fetch(base + '/api/auth/status')).ok) { iniciou = true; break; }; só executa o trecho correspondente quando ela for verdadeira.
            if ((await fetch(base + '/api/auth/status')).ok) { iniciou = true; break; }
        // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
        } catch {}
        // Espera a operação assíncrona terminar antes de continuar com o resultado.
        await new Promise(resolve => setTimeout(resolve, 100));
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
    // Chama a função assert.ok com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.ok(iniciou, `Servidor não iniciou: ${saida}`);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal((await admin('POST', '/api/auth/setup', {
        // Define a propriedade nome do objeto; o valor utilizado é 'Admin Regressões', email: 'admin@vinculos.test', senha.
        nome: 'Admin Regressões', email: 'admin@vinculos.test', senha
    // Finaliza a função de retorno e a chamada que a recebeu.
    })).status, 201);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função after com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
after(async () => {
    // Espera a operação assíncrona terminar antes de continuar com o resultado.
    await pararServidor(servidor);
    // Verifica a condição (diretorio) removerDiretorioTemporario(diretorio);; só executa o trecho correspondente quando ela for verdadeira.
    if (diretorio) removerDiretorioTemporario(diretorio);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Declara a função ordem; os parâmetros (dados) recebem dados quando ela é chamada.
function ordem(dados) {
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return {
        // Define a propriedade equipamento do objeto; o valor utilizado é 'Notebook de teste', descricao: 'O equipamento não liga ao pressionar o botão.',.
        equipamento: 'Notebook de teste', descricao: 'O equipamento não liga ao pressionar o botão.',
        // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
        ...dados
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    };
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função criarCliente; os parâmetros (dados) recebem dados quando ela é chamada. A função async pode aguardar tarefas assíncronas.
async function criarCliente(dados) {
    // Espera o resultado assíncrono e o armazena em resposta; usa const (referência que não pode ser reatribuída).
    const resposta = await admin('POST', '/api/clientes', dados);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(resposta.status, 201);
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return resposta.dados.id;
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('clientes homônimos mantêm ordens separadas e não acessam o portal um do outro', async () => {
    // Espera o resultado assíncrono e o armazena em primeira; usa const (referência que não pode ser reatribuída).
    const primeira = await admin('POST', '/api/ordens', ordem({
        // Define a propriedade cliente_nome do objeto; o valor utilizado é 'Cliente Homônimo', cliente_email: 'homonimo.a@vinculos.test'.
        cliente_nome: 'Cliente Homônimo', cliente_email: 'homonimo.a@vinculos.test'
    // Finaliza a função de retorno e a chamada que a recebeu.
    }));
    // Espera o resultado assíncrono e o armazena em segunda; usa const (referência que não pode ser reatribuída).
    const segunda = await admin('POST', '/api/ordens', ordem({
        // Define a propriedade cliente_nome do objeto; o valor utilizado é 'Cliente Homônimo', cliente_email: 'homonimo.b@vinculos.test'.
        cliente_nome: 'Cliente Homônimo', cliente_email: 'homonimo.b@vinculos.test'
    // Finaliza a função de retorno e a chamada que a recebeu.
    }));
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(primeira.status, 201);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(segunda.status, 201);
    // Espera o resultado assíncrono e o armazena em detalheA; usa const (referência que não pode ser reatribuída).
    const detalheA = await admin('GET', `/api/ordens/${primeira.dados.id}`);
    // Espera o resultado assíncrono e o armazena em detalheB; usa const (referência que não pode ser reatribuída).
    const detalheB = await admin('GET', `/api/ordens/${segunda.dados.id}`);
    // Chama a função assert.notEqual com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.notEqual(detalheA.dados.cliente_id, detalheB.dados.cliente_id);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(detalheA.dados.cliente_email, 'homonimo.a@vinculos.test');
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(detalheB.dados.cliente_email, 'homonimo.b@vinculos.test');
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal((await admin('POST', '/api/usuarios', {
        // Define a propriedade nome do objeto; o valor utilizado é 'Conta do primeiro cliente', email: 'conta.homonimo@vinculos.test', senha,.
        nome: 'Conta do primeiro cliente', email: 'conta.homonimo@vinculos.test', senha,
        // Define a propriedade papel do objeto; o valor utilizado é 'cliente', cliente_id: detalheA.dados.cliente_id.
        papel: 'cliente', cliente_id: detalheA.dados.cliente_id
    // Finaliza a função de retorno e a chamada que a recebeu.
    })).status, 201);
    // Declara cliente com const (referência que não pode ser reatribuída) e atribui sessao();.
    const cliente = sessao();
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal((await cliente('POST', '/api/auth/login', {
        // Define a propriedade email do objeto; o valor utilizado é 'conta.homonimo@vinculos.test', senha.
        email: 'conta.homonimo@vinculos.test', senha
    // Finaliza a função de retorno e a chamada que a recebeu.
    })).status, 200);
    // Transforma os itens da coleção, produzindo uma nova lista de resultados.
    assert.deepEqual((await cliente('GET', '/api/ordens')).dados.map(item => item.id), [primeira.dados.id]);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal((await cliente('GET', `/api/ordens/${primeira.dados.id}`)).status, 200);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal((await cliente('GET', `/api/ordens/${segunda.dados.id}`)).status, 403);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal((await cliente('GET', `/api/ordens/${segunda.dados.id}/interacoes`)).status, 403);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('cadastro público não duplica cliente existente nem concede acesso sem vínculo pelo administrador', async () => {
    // Espera o resultado assíncrono e o armazena em clienteId; usa const (referência que não pode ser reatribuída).
    const clienteId = await criarCliente({ nome: 'Cliente com Histórico', email: 'historico@vinculos.test' });
    // Espera o resultado assíncrono e o armazena em criada; usa const (referência que não pode ser reatribuída).
    const criada = await admin('POST', '/api/ordens', ordem({ cliente_id: clienteId }));
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(criada.status, 201);
    // Espera o resultado assíncrono e o armazena em clientesAntes; usa const (referência que não pode ser reatribuída).
    const clientesAntes = (await admin('GET', '/api/clientes')).dados;
    // Declara visitante com const (referência que não pode ser reatribuída) e atribui sessao();.
    const visitante = sessao();
    // Espera o resultado assíncrono e o armazena em registro; usa const (referência que não pode ser reatribuída).
    const registro = await visitante('POST', '/api/auth/register', {
        // Define a propriedade nome do objeto; o valor utilizado é 'Cliente com Histórico', email: 'HISTORICO@VINCULOS.TEST', senha, papel: 'cliente'.
        nome: 'Cliente com Histórico', email: 'HISTORICO@VINCULOS.TEST', senha, papel: 'cliente'
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(registro.status, 409);
    // Chama a função assert.match com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.match(registro.dados.erro, /equipe|administrador|acesso/i);
    // Chama a função assert.deepEqual com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.deepEqual((await admin('GET', '/api/clientes')).dados, clientesAntes);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal((await visitante('GET', '/api/auth/me')).status, 401);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal((await visitante('GET', '/api/ordens')).status, 401);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal((await admin('POST', '/api/usuarios', {
        // Define a propriedade nome do objeto; o valor utilizado é 'Cliente com Histórico', email: 'historico@vinculos.test', senha,.
        nome: 'Cliente com Histórico', email: 'historico@vinculos.test', senha,
        // Define a propriedade papel do objeto; o valor utilizado é 'cliente', cliente_id: clienteId.
        papel: 'cliente', cliente_id: clienteId
    // Finaliza a função de retorno e a chamada que a recebeu.
    })).status, 201);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal((await visitante('POST', '/api/auth/login', { email: 'historico@vinculos.test', senha })).status, 200);
    // Transforma os itens da coleção, produzindo uma nova lista de resultados.
    assert.deepEqual((await visitante('GET', '/api/ordens')).dados.map(item => item.id), [criada.dados.id]);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('ordens exigem seleção por ID quando o e-mail ou o nome do cliente é ambíguo', async () => {
    // Espera o resultado assíncrono e o armazena em primeiroId; usa const (referência que não pode ser reatribuída).
    const primeiroId = await criarCliente({ nome: 'Cadastro legado A', email: 'repetido@vinculos.test' });
    // Espera o resultado assíncrono e o armazena em segundoId; usa const (referência que não pode ser reatribuída).
    const segundoId = await criarCliente({ nome: 'Cadastro legado B', email: 'REPETIDO@vinculos.test' });
    // Espera o resultado assíncrono e o armazena em ordensAntes; usa const (referência que não pode ser reatribuída).
    const ordensAntes = (await admin('GET', '/api/ordens')).dados.length;
    // Espera o resultado assíncrono e o armazena em ambigua; usa const (referência que não pode ser reatribuída).
    const ambigua = await admin('POST', '/api/ordens', ordem({
        // Define a propriedade cliente_nome do objeto; o valor utilizado é 'Cadastro legado A', cliente_email: 'repetido@vinculos.test'.
        cliente_nome: 'Cadastro legado A', cliente_email: 'repetido@vinculos.test'
    // Finaliza a função de retorno e a chamada que a recebeu.
    }));
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(ambigua.status, 409);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal((await admin('GET', '/api/ordens')).dados.length, ordensAntes);
    // Repete as instruções seguintes seguindo a condição de controle do laço for.
    for (const clienteId of [primeiroId, segundoId]) {
        // Espera o resultado assíncrono e o armazena em explicita; usa const (referência que não pode ser reatribuída).
        const explicita = await admin('POST', '/api/ordens', ordem({ cliente_id: clienteId }));
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal(explicita.status, 201);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await admin('GET', `/api/ordens/${explicita.dados.id}`)).dados.cliente_id, clienteId);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
    // Espera o resultado assíncrono e o armazena em semEmailId; usa const (referência que não pode ser reatribuída).
    const semEmailId = await criarCliente({ nome: 'Cliente sem e-mail' });
    // Espera o resultado assíncrono e o armazena em porNome; usa const (referência que não pode ser reatribuída).
    const porNome = await admin('POST', '/api/ordens', ordem({ cliente_nome: 'Cliente sem e-mail' }));
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(porNome.status, 409);
    // Espera o resultado assíncrono e o armazena em porId; usa const (referência que não pode ser reatribuída).
    const porId = await admin('POST', '/api/ordens', ordem({ cliente_id: semEmailId }));
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(porId.status, 201);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal((await admin('GET', `/api/ordens/${porId.dados.id}`)).dados.cliente_id, semEmailId);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('técnicos homônimos são selecionados por ID e ordens sem responsável continuam permitidas', async () => {
    // Espera o resultado assíncrono e o armazena em clienteId; usa const (referência que não pode ser reatribuída).
    const clienteId = await criarCliente({ nome: 'Cliente Técnicos', email: 'tecnicos@vinculos.test' });
    // Declara tecnicos com const (referência que não pode ser reatribuída) e atribui [];.
    const tecnicos = [];
    // Repete as instruções seguintes seguindo a condição de controle do laço for.
    for (const email of ['tecnico.a@vinculos.test', 'tecnico.b@vinculos.test']) {
        // Espera o resultado assíncrono e o armazena em criado; usa const (referência que não pode ser reatribuída).
        const criado = await admin('POST', '/api/tecnicos', {
            // Define a propriedade nome do objeto; o valor utilizado é 'Técnico Homônimo', email, telefone: '11999990000', especialidade: 'Informática'.
            nome: 'Técnico Homônimo', email, telefone: '11999990000', especialidade: 'Informática'
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        });
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal(criado.status, 201);
        // Chama a função tecnicos.push com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        tecnicos.push(criado.dados.id);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
    // Espera o resultado assíncrono e o armazena em ambigua; usa const (referência que não pode ser reatribuída).
    const ambigua = await admin('POST', '/api/ordens', ordem({ cliente_id: clienteId, tecnico_nome: 'Técnico Homônimo' }));
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(ambigua.status, 409);
    // Espera o resultado assíncrono e o armazena em explicita; usa const (referência que não pode ser reatribuída).
    const explicita = await admin('POST', '/api/ordens', ordem({ cliente_id: clienteId, tecnico_id: tecnicos[1] }));
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(explicita.status, 201);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal((await admin('GET', `/api/ordens/${explicita.dados.id}`)).dados.tecnico_id, tecnicos[1]);
    // Repete as instruções seguintes seguindo a condição de controle do laço for.
    for (let indice = 0; indice < tecnicos.length; indice++) {
        // Declara email com const (referência que não pode ser reatribuída) e atribui `funcionario.${indice}@vinculos.test`;.
        const email = `funcionario.${indice}@vinculos.test`;
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await admin('POST', '/api/usuarios', {
            // Define a propriedade nome do objeto; o valor utilizado é `Funcionário ${indice}`, email, senha, papel: 'funcionario', tecnico_id: tecnicos[indice].
            nome: `Funcionário ${indice}`, email, senha, papel: 'funcionario', tecnico_id: tecnicos[indice]
        // Finaliza a função de retorno e a chamada que a recebeu.
        })).status, 201);
        // Declara funcionario com const (referência que não pode ser reatribuída) e atribui sessao();.
        const funcionario = sessao();
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await funcionario('POST', '/api/auth/login', { email, senha })).status, 200);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await funcionario('GET', `/api/ordens/${explicita.dados.id}`)).status, indice === 1 ? 200 : 403);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
    // Espera o resultado assíncrono e o armazena em semTecnico; usa const (referência que não pode ser reatribuída).
    const semTecnico = await admin('POST', '/api/ordens', ordem({ cliente_id: clienteId }));
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal(semTecnico.status, 201);
    // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    assert.equal((await admin('GET', `/api/ordens/${semTecnico.dados.id}`)).dados.tecnico_id, null);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
