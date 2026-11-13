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
// Guarda em form a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const form = document.getElementById('form-os');
// Guarda em mensagem a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const mensagem = document.getElementById('mensagem-os');
// Guarda em clienteSelect a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const clienteSelect = document.getElementById('cliente-id');
// Guarda em camposCliente a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const camposCliente = ['cliente', 'cliente-telefone', 'cliente-email'].map(id => document.getElementById(id));
// Declara clientes com let (variável que pode ser reatribuída) e atribui [];.
let clientes = [];

// Registra uma função para reagir ao evento change (por exemplo, clique, envio ou digitação).
clienteSelect.addEventListener('change', () => {
    // Define cliente com uma função de seta ou com uma expressão; usa const (referência que não pode ser reatribuída).
    const cliente = clientes.find(item => item.id === Number(clienteSelect.value));
    // Declara valores com const (referência que não pode ser reatribuída) e atribui cliente ? [cliente.nome, cliente.telefone, cliente.email] : ['', '', ''];.
    const valores = cliente ? [cliente.nome, cliente.telefone, cliente.email] : ['', '', ''];
    // Percorre cada item da lista e executa a função fornecida para cada um.
    camposCliente.forEach((campo, indice) => {
        // Lê ou atualiza o valor de um campo do formulário.
        campo.value = valores[indice] || '';
        // Atribui ou atualiza campo.readOnly com o resultado da expressão à direita do sinal =.
        campo.readOnly = Boolean(cliente);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função compartilhada que envia a solicitação HTTP autenticada para esta rota da API.
apiFetch('/api/clientes')
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .then(async resposta => {
        // Verifica a condição (!resposta.ok) throw new Error('Não foi possível carregar os clientes.');; só executa o trecho correspondente quando ela for verdadeira.
        if (!resposta.ok) throw new Error('Não foi possível carregar os clientes.');
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return resposta.json();
    // Finaliza a função de retorno e a chamada que a recebeu.
    })
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .then(dados => {
        // Atribui ou atualiza clientes com o resultado da expressão à direita do sinal =.
        clientes = dados;
        // Percorre cada item da lista e executa a função fornecida para cada um.
        dados.forEach(cliente => {
            // Cria um elemento HTML em memória e o guarda em opcao, para depois configurá-lo e inseri-lo na página.
            const opcao = document.createElement('option');
            // Lê ou atualiza o valor de um campo do formulário.
            opcao.value = cliente.id;
            // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
            opcao.textContent = `${cliente.nome} — ${cliente.email || 'Sem e-mail'} (#${cliente.id})`;
            // Adiciona o elemento criado ao final do elemento pai no documento.
            clienteSelect.append(opcao);
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        });
    // Finaliza a função de retorno e a chamada que a recebeu.
    })
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .catch(erro => Utils.mostrarMensagem(mensagem, 'erro', erro.message));

// O identificador distingue técnicos que tenham o mesmo nome.
// Chama a função compartilhada que envia a solicitação HTTP autenticada para esta rota da API.
apiFetch('/api/tecnicos')
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .then(async resposta => {
        // Verifica a condição (!resposta.ok) throw new Error('Não foi possível carregar os técnicos.');; só executa o trecho correspondente quando ela for verdadeira.
        if (!resposta.ok) throw new Error('Não foi possível carregar os técnicos.');
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return resposta.json();
    // Finaliza a função de retorno e a chamada que a recebeu.
    })
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .then(tecnicos => {
        // Guarda em lista a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
        const lista = document.getElementById('tecnico');
        // Percorre cada item da lista e executa a função fornecida para cada um.
        tecnicos.forEach(t => {
            // Cria um elemento HTML em memória e o guarda em opcao, para depois configurá-lo e inseri-lo na página.
            const opcao = document.createElement('option');
            // Lê ou atualiza o valor de um campo do formulário.
            opcao.value = t.id;
            // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
            opcao.textContent = `${t.nome} (#${t.id})`;
            // Adiciona o elemento criado ao final do elemento pai no documento.
            lista.append(opcao);
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        });
    // Finaliza a função de retorno e a chamada que a recebeu.
    })
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .catch(erro => Utils.mostrarMensagem(mensagem, 'erro', erro.message));

// Buscar no Google
// Registra uma função para reagir ao evento click (por exemplo, clique, envio ou digitação).
document.getElementById('buscar-solucao').addEventListener('click', function () {
    // Guarda em descricao a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
    const descricao = document.getElementById('descricao').value.trim();
    // Verifica a condição (descricao === '') {; só executa o trecho correspondente quando ela for verdadeira.
    if (descricao === '') {
        // Mostra feedback de sucesso ou erro no elemento de mensagem da tela.
        Utils.mostrarMensagem(mensagem, 'erro', 'Digite o problema antes de buscar.');
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
    // Chama a função window.open com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    window.open('https://www.google.com/search?q=' + encodeURIComponent(descricao), '_blank');
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Salvar OS no banco
// Registra uma função para reagir ao evento submit (por exemplo, clique, envio ou digitação).
form.addEventListener('submit', function (event) {
    // Impede o comportamento padrão do formulário/evento, evitando o recarregamento imediato da página.
    event.preventDefault();

    // Guarda em descricao a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
    const descricao = document.getElementById('descricao').value.trim();
    // Verifica a condição (descricao.length < 10) {; só executa o trecho correspondente quando ela for verdadeira.
    if (descricao.length < 10) {
        // Mostra feedback de sucesso ou erro no elemento de mensagem da tela.
        Utils.mostrarMensagem(mensagem, 'erro', 'Conte o problema com pelo menos 10 caracteres.');
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }

    // Declara novaOrdem com const (referência que não pode ser reatribuída) e atribui {.
    const novaOrdem = {
        // Define a propriedade cliente_id do objeto; o valor utilizado é clienteSelect.value ? Number(clienteSelect.value) : null,.
        cliente_id: clienteSelect.value ? Number(clienteSelect.value) : null,
        // Define a propriedade cliente_nome do objeto; o valor utilizado é document.getElementById('cliente').value.trim(),.
        cliente_nome: document.getElementById('cliente').value.trim(),
        // Define a propriedade cliente_telefone do objeto; o valor utilizado é document.getElementById('cliente-telefone').value.trim(),.
        cliente_telefone: document.getElementById('cliente-telefone').value.trim(),
        // Define a propriedade cliente_email do objeto; o valor utilizado é document.getElementById('cliente-email').value.trim(),.
        cliente_email: document.getElementById('cliente-email').value.trim(),
        // Define a propriedade equipamento do objeto; o valor utilizado é document.getElementById('equipamento').value.trim(),.
        equipamento: document.getElementById('equipamento').value.trim(),
        // Define a propriedade tecnico_id do objeto; o valor utilizado é document.getElementById('tecnico').value ? Number(document.getElementById('tecnico').value)….
        tecnico_id: document.getElementById('tecnico').value ? Number(document.getElementById('tecnico').value) : null,
        // Define a propriedade prioridade do objeto; o valor utilizado é document.getElementById('prioridade').value,.
        prioridade: document.getElementById('prioridade').value,
        // Define a propriedade descricao do objeto; o valor utilizado é descricao.
        descricao: descricao
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    };

    // Verifica a condição (!novaOrdem.cliente_id && novaOrdem.cliente_telefone && !Utils.numeroWhatsApp(novaOrdem.cliente…; só executa o trecho correspondente quando ela for verdadeira.
    if (!novaOrdem.cliente_id && novaOrdem.cliente_telefone && !Utils.numeroWhatsApp(novaOrdem.cliente_telefone)) {
        // Mostra feedback de sucesso ou erro no elemento de mensagem da tela.
        Utils.mostrarMensagem(mensagem, 'erro', 'Digite um telefone válido com DDD.');
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }

    // Chama a função compartilhada que envia a solicitação HTTP autenticada para esta rota da API.
    apiFetch('/api/ordens', {
        // Define a propriedade method do objeto; o valor utilizado é 'POST',.
        method: 'POST',
        // Define a propriedade headers do objeto; o valor utilizado é { 'Content-Type': 'application/json' },.
        headers: { 'Content-Type': 'application/json' },
        // Serializa dados JavaScript para texto JSON, usado no corpo da requisição.
        body: JSON.stringify(novaOrdem)
    // Finaliza a função de retorno e a chamada que a recebeu.
    })
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .then(r => r.json())
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .then(dados => {
        // Verifica a condição (dados.erro) {; só executa o trecho correspondente quando ela for verdadeira.
        if (dados.erro) {
            // Mostra feedback de sucesso ou erro no elemento de mensagem da tela.
            Utils.mostrarMensagem(mensagem, 'erro', 'Erro: ' + dados.erro);
            // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
            return;
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        }
        // Mostra feedback de sucesso ou erro no elemento de mensagem da tela.
        Utils.mostrarMensagem(mensagem, 'sucesso', 'Serviço salvo no banco de dados!');
        // Define ou consulta o endereço de destino de um link.
        setTimeout(() => { window.location.href = 'lista.html'; }, 800);
    // Finaliza a função de retorno e a chamada que a recebeu.
    })
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .catch(() => Utils.mostrarMensagem(mensagem, 'erro', 'Servidor offline. O Node está rodando?'));
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
