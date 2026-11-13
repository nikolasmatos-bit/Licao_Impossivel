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
const { spawn } = require('child_process');

// Lê um valor configurável do ambiente e o salva em PORT; usa const (referência que não pode ser reatribuída).
const PORT = Number(process.env.PORT) || 3001;
// Declara siteUrl com const (referência que não pode ser reatribuída) e atribui `http://127.0.0.1:${PORT}/index.html`;.
const siteUrl = `http://127.0.0.1:${PORT}/index.html`;
// Declara healthUrl com const (referência que não pode ser reatribuída) e atribui `http://127.0.0.1:${PORT}/api/auth/status`;.
const healthUrl = `http://127.0.0.1:${PORT}/api/auth/status`;

// Declara a função servidorDisponivel; os parâmetros (nenhum) recebem dados quando ela é chamada. A função async pode aguardar tarefas assíncronas.
async function servidorDisponivel() {
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Espera o resultado assíncrono e o armazena em resposta; usa const (referência que não pode ser reatribuída).
        const resposta = await fetch(healthUrl, { signal: AbortSignal.timeout(1200) });
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return resposta.ok && (resposta.headers.get('content-type') || '').includes('application/json');
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch {
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return false;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função abrirNavegador; os parâmetros (nenhum) recebem dados quando ela é chamada.
function abrirNavegador() {
    // Declara comando com let (variável que pode ser reatribuída) e atribui o valor indicado nas próximas linhas.
    let comando;
    // Declara argumentos com let (variável que pode ser reatribuída) e atribui o valor indicado nas próximas linhas.
    let argumentos;

    // Verifica a condição (process.platform === 'win32') {; só executa o trecho correspondente quando ela for verdadeira.
    if (process.platform === 'win32') {
        // Escolhe o comando nativo do sistema operacional que abre uma URL no navegador.
        comando = 'cmd.exe';
        // Define os argumentos que serão enviados ao sistema operacional para abrir o navegador.
        argumentos = ['/c', 'start', '', siteUrl];
    // Quando a condição anterior falha, verifica esta nova alternativa.
    } else if (process.platform === 'darwin') {
        // Escolhe o comando nativo do sistema operacional que abre uma URL no navegador.
        comando = 'open';
        // Define os argumentos que serão enviados ao sistema operacional para abrir o navegador.
        argumentos = [siteUrl];
    // Executa o caminho alternativo caso a condição anterior não seja atendida.
    } else {
        // Escolhe o comando nativo do sistema operacional que abre uma URL no navegador.
        comando = 'xdg-open';
        // Define os argumentos que serão enviados ao sistema operacional para abrir o navegador.
        argumentos = [siteUrl];
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }

    // Declara navegador com const (referência que não pode ser reatribuída) e atribui spawn(comando, argumentos, { detached: true, stdio: 'ignore' });.
    const navegador = spawn(comando, argumentos, { detached: true, stdio: 'ignore' });
    // Registra informação ou erro no terminal para facilitar a identificação de problemas.
    navegador.on('error', erro => console.error('Não foi possível abrir o navegador:', erro.message));
    // Permite que o processo inicializador termine mesmo que o processo do navegador continue aberto.
    navegador.unref();
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função iniciar; os parâmetros (nenhum) recebem dados quando ela é chamada. A função async pode aguardar tarefas assíncronas.
async function iniciar() {
    // Verifica a condição (await servidorDisponivel()) {; só executa o trecho correspondente quando ela for verdadeira.
    if (await servidorDisponivel()) {
        // Registra informação ou erro no terminal para facilitar a identificação de problemas.
        console.log('O servidor já estava ativo. Abrindo o site...');
        // Chama a função abrirNavegador com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        abrirNavegador();
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }

    // Registra informação ou erro no terminal para facilitar a identificação de problemas.
    console.log(`Iniciando Megabrain Services na porta ${PORT}...`);
    // Declara servidor com const (referência que não pode ser reatribuída) e atribui spawn(process.execPath, ['server/server.js'], {.
    const servidor = spawn(process.execPath, ['server/server.js'], {
        // Define a propriedade cwd do objeto; o valor utilizado é __dirname,.
        cwd: __dirname,
        // Define a propriedade stdio do objeto; o valor utilizado é 'inherit',.
        stdio: 'inherit',
        // Consulta uma variável de ambiente que permite configurar o servidor.
        env: { ...process.env, PORT: String(PORT) }
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
    // Declara erroInicializacao com let (variável que pode ser reatribuída) e atribui null;.
    let erroInicializacao = null;
    // Registra um observador de eventos do processo-filho para capturar falhas na inicialização.
    servidor.on('error', erro => { erroInicializacao = erro; });

    // Declara limite com const (referência que não pode ser reatribuída) e atribui Date.now() + 30000;.
    const limite = Date.now() + 30000;
    // Repete este trecho enquanto a condição permanecer verdadeira.
    while (Date.now() < limite) {
        // Verifica a condição (erroInicializacao) throw erroInicializacao;; só executa o trecho correspondente quando ela for verdadeira.
        if (erroInicializacao) throw erroInicializacao;
        // Verifica a condição (servidor.exitCode !== null || servidor.signalCode !== null) {; só executa o trecho correspondente quando ela for verdadeira.
        if (servidor.exitCode !== null || servidor.signalCode !== null) {
            // Lança uma exceção para que o erro seja tratado por um bloco catch ou pelo chamador.
            throw new Error('O servidor encerrou antes de ficar pronto. Verifique a mensagem acima.');
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        }
        // Verifica a condição (await servidorDisponivel()) {; só executa o trecho correspondente quando ela for verdadeira.
        if (await servidorDisponivel()) {
            // Registra informação ou erro no terminal para facilitar a identificação de problemas.
            console.log(`Site pronto: ${siteUrl}`);
            // Chama a função abrirNavegador com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
            abrirNavegador();
            // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
            return;
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        }
        // Espera a operação assíncrona terminar antes de continuar com o resultado.
        await new Promise(resolve => setTimeout(resolve, 350));
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }

    // Encerra o processo do servidor quando a inicialização ultrapassa a verificação prevista.
    servidor.kill();
    // Lança uma exceção para que o erro seja tratado por um bloco catch ou pelo chamador.
    throw new Error('O servidor não ficou pronto em 30 segundos.');
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Chama a função iniciar com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
iniciar().catch(erro => {
    // Registra informação ou erro no terminal para facilitar a identificação de problemas.
    console.error(erro.message);
    // Define o código de encerramento do processo para informar se houve falha.
    process.exitCode = 1;
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});