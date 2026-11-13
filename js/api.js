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
// Continua a expressão lógica ou a lista de alternativas começada na linha anterior; é parte da mesma validação.
(() => {
    // Declara pagina com const (referência que não pode ser reatribuída) e atribui window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';.
    const pagina = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
    // Cria uma nova instância e a armazena em liveServerOrigins; usa const (referência que não pode ser reatribuída).
    const liveServerOrigins = new Set([
        // Define a propriedade http do objeto; o valor utilizado é //localhost:5500',.
        'http://localhost:5500',
        // Define a propriedade http do objeto; o valor utilizado é //127.0.0.1:5500'.
        'http://127.0.0.1:5500'
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    ]);
    // Verifica a condição (window.location.protocol === 'file:') {; só executa o trecho correspondente quando ela for verdadeira.
    if (window.location.protocol === 'file:') {
        // Consulta ou altera a URL atual do navegador para navegação entre as telas.
        window.location.replace(
            // Consulta ou altera a URL atual do navegador para navegação entre as telas.
            `http://127.0.0.1:3001/${pagina}${window.location.search}${window.location.hash}`
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        );
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
    // Verifica a condição (liveServerOrigins.has(window.location.origin)) {; só executa o trecho correspondente quando ela for verdadeira.
    if (liveServerOrigins.has(window.location.origin)) {
        // Consulta ou altera a URL atual do navegador para navegação entre as telas.
        window.location.replace(
            // Consulta ou altera a URL atual do navegador para navegação entre as telas.
            `${window.location.protocol}//${window.location.hostname}:3001/${pagina}${window.location.search}${window.location.hash}`
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        );
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }

    // Envia uma requisição HTTP para a API, aguardando ou tratando a resposta.
    window.apiFetch = (url, options = {}) => fetch(url, {
        // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
        ...options,
        // Define a propriedade credentials do objeto; o valor utilizado é 'include'.
        credentials: 'include'
    // Finaliza a função de retorno e a chamada que a recebeu.
    }).catch(erro => {
        // Verifica a condição (typeof url === 'string' && url.startsWith('/api/')) {; só executa o trecho correspondente quando ela for verdadeira.
        if (typeof url === 'string' && url.startsWith('/api/')) {
            // Declara local com const (referência que não pode ser reatribuída) e atribui ['localhost', '127.0.0.1'].includes(window.location.hostname);.
            const local = ['localhost', '127.0.0.1'].includes(window.location.hostname);
            // Declara endereco com const (referência que não pode ser reatribuída) e atribui local ? 'http://localhost:3001' : 'o servidor do sistema';.
            const endereco = local ? 'http://localhost:3001' : 'o servidor do sistema';
            // Lança uma exceção para que o erro seja tratado por um bloco catch ou pelo chamador.
            throw new Error(`Não foi possível conectar à API em ${endereco}. Inicie o Megabrain Services pelo arquivo Abrir Ordem Clara.bat e tente novamente.`);
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        }
        // Lança uma exceção para que o erro seja tratado por um bloco catch ou pelo chamador.
        throw erro;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
// Finaliza a função de retorno e a chamada que a recebeu.
})();
