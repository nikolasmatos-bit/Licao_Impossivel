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
const { test } = require('node:test');
// Declara assert com const (referência que não pode ser reatribuída) e atribui require('node:assert/strict');.
const assert = require('node:assert/strict');
// Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
const { spawn } = require('node:child_process');
// Declara fs com const (referência que não pode ser reatribuída) e atribui require('node:fs');.
const fs = require('node:fs');
// Declara path com const (referência que não pode ser reatribuída) e atribui require('node:path');.
const path = require('node:path');
// Declara os com const (referência que não pode ser reatribuída) e atribui require('node:os');.
const os = require('node:os');
// Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
const { portaLivre, pararServidor, removerDiretorioTemporario } = require('./helpers');

// Chama a função test com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
test('integração: permissões, cadastro, ordens, contatos, dashboard e notas privadas', { timeout: 60000 }, async () => {
    // Declara diretorio com const (referência que não pode ser reatribuída) e atribui fs.mkdtempSync(path.join(os.tmpdir(), 'megabrain-correcoes-'));.
    const diretorio = fs.mkdtempSync(path.join(os.tmpdir(), 'megabrain-correcoes-'));
    // Espera o resultado assíncrono e o armazena em porta; usa const (referência que não pode ser reatribuída).
    const porta = await portaLivre();
    // Declara base com const (referência que não pode ser reatribuída) e atribui `http://127.0.0.1:${porta}`;.
    const base = `http://127.0.0.1:${porta}`;
    // Declara servidor com const (referência que não pode ser reatribuída) e atribui spawn(process.execPath, ['server/server.js'], {.
    const servidor = spawn(process.execPath, ['server/server.js'], {
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
    // Chama a função servidor.stderr.on com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    servidor.stderr.on('data', trecho => { saida += trecho.toString(); });
    // Chama a função servidor.stdout.on com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    servidor.stdout.on('data', trecho => { saida += trecho.toString(); });
    // Declara a função sessao; os parâmetros (nenhum) recebem dados quando ela é chamada.
    function sessao() {
        // Declara cookie com let (variável que pode ser reatribuída) e atribui '';.
        let cookie = '';
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return async function requisitar(metodo, rota, body) {
            // Espera o resultado assíncrono e o armazena em r; usa const (referência que não pode ser reatribuída).
            const r = await fetch(base + rota, {
                // Define a propriedade method do objeto; o valor utilizado é metodo,.
                method: metodo,
                // Define a propriedade headers do objeto; o valor utilizado é { ...(cookie ? { cookie } : {}), ...(body === undefined ? {} : { 'Content-Type': 'applicati….
                headers: { ...(cookie ? { cookie } : {}), ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
                // Serializa dados JavaScript para texto JSON, usado no corpo da requisição.
                body: body === undefined ? undefined : JSON.stringify(body),
                // Define a propriedade redirect do objeto; o valor utilizado é 'manual'.
                redirect: 'manual'
            // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
            });
            // Declara c com const (referência que não pode ser reatribuída) e atribui r.headers.get('set-cookie');.
            const c = r.headers.get('set-cookie');
            // Verifica a condição (c) cookie = c.split(';')[0];; só executa o trecho correspondente quando ela for verdadeira.
            if (c) cookie = c.split(';')[0];
            // Espera o resultado assíncrono e o armazena em raw; usa const (referência que não pode ser reatribuída).
            const raw = await r.text();
            // Declara dados com let (variável que pode ser reatribuída) e atribui o valor indicado nas próximas linhas.
            let dados;
            // Inicia a tentativa de uma operação que poderá gerar uma exceção.
            try { dados = JSON.parse(raw); } catch { dados = raw; }
            // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
            return { status: r.status, dados };
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        };
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
    // Declara semLogin com const (referência que não pode ser reatribuída) e atribui sessao();.
    const semLogin = sessao();
    // Declara admin com const (referência que não pode ser reatribuída) e atribui sessao();.
    const admin = sessao();
    // Declara cliente com const (referência que não pode ser reatribuída) e atribui sessao();.
    const cliente = sessao();
    // Declara funcionario com const (referência que não pode ser reatribuída) e atribui sessao();.
    const funcionario = sessao();
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Declara limite com const (referência que não pode ser reatribuída) e atribui Date.now() + 25000;.
        const limite = Date.now() + 25000;
        // Declara iniciou com let (variável que pode ser reatribuída) e atribui false;.
        let iniciou = false;
        // Repete este trecho enquanto a condição permanecer verdadeira.
        while (Date.now() < limite && servidor.exitCode === null) {
            // Inicia a tentativa de uma operação que poderá gerar uma exceção.
            try { const r = await fetch(base + '/api/auth/status'); if (r.ok) { iniciou = true; break; } }
            // Define como tratar o erro capturado da operação anterior.
            catch {}
            // Espera a operação assíncrona terminar antes de continuar com o resultado.
            await new Promise(resolve => setTimeout(resolve, 100));
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        }
        // Chama a função assert.ok com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.ok(iniciou, `Servidor não iniciou: ${saida}`);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await semLogin('POST', '/api/auth/register', {
            // Define a propriedade nome do objeto; o valor utilizado é 'Invasor', email: 'admin.fake@teste.com', senha: 'senha-de-12-caracteres', papel: 'admin'.
            nome: 'Invasor', email: 'admin.fake@teste.com', senha: 'senha-de-12-caracteres', papel: 'admin'
        // Finaliza a função de retorno e a chamada que a recebeu.
        })).status, 400);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await semLogin('GET', '/api/usuarios')).status, 401);
        // Espera o resultado assíncrono e o armazena em setup; usa const (referência que não pode ser reatribuída).
        const setup = await admin('POST', '/api/auth/setup', {
            // Define a propriedade nome do objeto; o valor utilizado é 'Admin', email: 'admin@local.test', senha: 'senha-super-segura-123'.
            nome: 'Admin', email: 'admin@local.test', senha: 'senha-super-segura-123'
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        });
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal(setup.status, 201);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await semLogin('POST', '/api/auth/setup', {
            // Define a propriedade nome do objeto; o valor utilizado é 'Outro', email: 'outro@local.test', senha: 'senha-super-segura-123'.
            nome: 'Outro', email: 'outro@local.test', senha: 'senha-super-segura-123'
        // Finaliza a função de retorno e a chamada que a recebeu.
        })).status, 409);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await admin('POST', '/api/tecnicos', {
            // Define a propriedade nome do objeto; o valor utilizado é 'Tecnico Uno', email: 'tecnico@local.test', telefone: '11999990000', especialidade: 'Comput….
            nome: 'Tecnico Uno', email: 'tecnico@local.test', telefone: '11999990000', especialidade: 'Computadores'
        // Finaliza a função de retorno e a chamada que a recebeu.
        })).status, 201);
        // Espera o resultado assíncrono e o armazena em os; usa const (referência que não pode ser reatribuída).
        const os = await admin('POST', '/api/ordens', {
            // Define a propriedade cliente_nome do objeto; o valor utilizado é 'Cliente Novo', cliente_telefone: '11922223333', cliente_email: 'pessoa@local.test',.
            cliente_nome: 'Cliente Novo', cliente_telefone: '11922223333', cliente_email: 'pessoa@local.test',
            // Define a propriedade equipamento do objeto; o valor utilizado é 'Computador', tecnico_nome: 'Tecnico Uno', descricao: 'Computador não liga ao apertar botão….
            equipamento: 'Computador', tecnico_nome: 'Tecnico Uno', descricao: 'Computador não liga ao apertar botão', prioridade: 'Alta'
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        });
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal(os.status, 201);
        // Declara id com const (referência que não pode ser reatribuída) e atribui os.dados.id;.
        const id = os.dados.id;
        // Espera o resultado assíncrono e o armazena em detalhe; usa const (referência que não pode ser reatribuída).
        const detalhe = await admin('GET', `/api/ordens/${id}`);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal(detalhe.dados.cliente_telefone, '11922223333');
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal(detalhe.dados.cliente_email, 'pessoa@local.test');
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal(detalhe.dados.tecnico, 'Tecnico Uno');
        // Espera o resultado assíncrono e o armazena em dashboard; usa const (referência que não pode ser reatribuída).
        const dashboard = await admin('GET', '/api/dashboard');
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal(dashboard.status, 200);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal(dashboard.dados.total_os, 1);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal(dashboard.dados.alta_prioridade, 1);
        // Procura o primeiro item que satisfaz o critério informado.
        assert.equal(dashboard.dados.distribuicao.find(x => x.status === 'Aberta').total, 1);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal(dashboard.dados.sem_responsavel, 0);
        // Chama a função assert.ok com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.ok(dashboard.dados.atualizado_em);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await admin('POST', `/api/ordens/${id}/interacoes`, {
            // Define a propriedade canal do objeto; o valor utilizado é 'Nota', mensagem: 'Esta é uma nota apenas para a equipe'.
            canal: 'Nota', mensagem: 'Esta é uma nota apenas para a equipe'
        // Finaliza a função de retorno e a chamada que a recebeu.
        })).status, 201);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await admin('POST', `/api/ordens/${id}/interacoes`, {
            // Define a propriedade canal do objeto; o valor utilizado é 'Atualização', mensagem: 'Seu aparelho está em análise'.
            canal: 'Atualização', mensagem: 'Seu aparelho está em análise'
        // Finaliza a função de retorno e a chamada que a recebeu.
        })).status, 201);
        // Espera o resultado assíncrono e o armazena em listaClientes; usa const (referência que não pode ser reatribuída).
        const listaClientes = await admin('GET', '/api/clientes');
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal(listaClientes.dados.length, 1);
        // Declara clienteId com const (referência que não pode ser reatribuída) e atribui listaClientes.dados[0].id;.
        const clienteId = listaClientes.dados[0].id;
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await admin('POST', '/api/usuarios', {
            // Define a propriedade nome do objeto; o valor utilizado é 'Cliente Conta', email: 'conta@local.test', papel: 'cliente', cliente_id: clienteId,.
            nome: 'Cliente Conta', email: 'conta@local.test', papel: 'cliente', cliente_id: clienteId,
            // Define a propriedade senha do objeto; o valor utilizado é 'senha-super-segura-123'.
            senha: 'senha-super-segura-123'
        // Finaliza a função de retorno e a chamada que a recebeu.
        })).status, 201);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await cliente('POST', '/api/auth/login', {
            // Define a propriedade email do objeto; o valor utilizado é 'conta@local.test', senha: 'senha-super-segura-123'.
            email: 'conta@local.test', senha: 'senha-super-segura-123'
        // Finaliza a função de retorno e a chamada que a recebeu.
        })).status, 200);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await cliente('GET', '/api/ordens')).dados.length, 1);
        // Espera o resultado assíncrono e o armazena em historicoCliente; usa const (referência que não pode ser reatribuída).
        const historicoCliente = await cliente('GET', `/api/ordens/${id}/interacoes`);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal(historicoCliente.status, 200);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal(historicoCliente.dados.length, 1);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal(historicoCliente.dados[0].mensagem, 'Seu aparelho está em análise');
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await cliente('POST', '/api/usuarios', {
            // Define a propriedade nome do objeto; o valor utilizado é 'Outro', email: 'outro2@local.test', papel: 'admin', senha: 'senha-super-segura-123'.
            nome: 'Outro', email: 'outro2@local.test', papel: 'admin', senha: 'senha-super-segura-123'
        // Finaliza a função de retorno e a chamada que a recebeu.
        })).status, 403);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await cliente('PUT', `/api/ordens/${id}/status`, { status: 'Concluída' })).status, 403);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await cliente('POST', `/api/ordens/${id}/interacoes`, { canal: 'Nota', mensagem: 'Resposta do cliente' })).status, 201);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await cliente('GET', `/api/ordens/${id}/interacoes`)).dados.length, 2);
        // Espera o resultado assíncrono e o armazena em tId; usa const (referência que não pode ser reatribuída).
        const tId = (await admin('GET', '/api/tecnicos')).dados[0].id;
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await admin('POST', '/api/usuarios', {
            // Define a propriedade nome do objeto; o valor utilizado é 'Funcionário', email: 'func@local.test', senha: 'senha-super-segura-123', papel: 'funcionar….
            nome: 'Funcionário', email: 'func@local.test', senha: 'senha-super-segura-123', papel: 'funcionario', tecnico_id: tId
        // Finaliza a função de retorno e a chamada que a recebeu.
        })).status, 201);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await funcionario('POST', '/api/auth/login', { email: 'func@local.test', senha: 'senha-super-segura-123' })).status, 200);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await funcionario('GET', `/api/ordens/${id}`)).status, 200);
        // Espera o resultado assíncrono e o armazena em semResponsavel; usa const (referência que não pode ser reatribuída).
        const semResponsavel = await admin('POST', '/api/ordens', {
            // Define a propriedade cliente_id do objeto; o valor utilizado é clienteId, equipamento: 'Televisão', descricao: 'A televisão está com a tela apagada', prio….
            cliente_id: clienteId, equipamento: 'Televisão', descricao: 'A televisão está com a tela apagada', prioridade: 'Média'
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        });
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal(semResponsavel.status, 201);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await funcionario('GET', `/api/ordens/${semResponsavel.dados.id}`)).status, 200);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await funcionario('GET', '/api/ordens')).dados.length, 2);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await admin('PUT', `/api/ordens/${id}/status`, { status: 'INCORRETO' })).status, 400);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await admin('DELETE', `/api/ordens/${id}`)).status, 409);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await admin('PUT', `/api/ordens/${id}/status`, { status: 'Concluída', diagnostico: 'Resolvido' })).status, 200);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await admin('PUT', `/api/ordens/${id}/status`, { status: 'Aberta' })).status, 409);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await admin('DELETE', `/api/ordens/${id}`)).status, 200);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await admin('DELETE', `/api/tecnicos/${tId}`)).status, 409);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await admin('PATCH', `/api/usuarios/${setup.dados.usuario.id}/status`, { ativo: false })).status, 409);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await admin('POST', '/api/auth/register', { papel: 'admin', nome: 'Alguém', email: 'a@b.test', senha: 'senha-super-segura-123' })).status, 400);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await admin('POST', '/api/auth/login', { email: 'admin@local.test' })).status, 400);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await admin('POST', '/api/tecnicos', { nome: 'Incompleto' })).status, 400);
        // Chama a função assert.equal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        assert.equal((await admin('GET', '/dashboard.html')).status, 200);
    // Executa a limpeza mesmo se a operação anterior tiver apresentado erro.
    } finally {
        // Espera a operação assíncrona terminar antes de continuar com o resultado.
        await pararServidor(servidor);
        // Chama a função removerDiretorioTemporario com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        removerDiretorioTemporario(diretorio);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
