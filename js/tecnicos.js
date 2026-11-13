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
const form = document.getElementById('form-tecnico');
// Guarda em mensagem a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const mensagem = document.getElementById('mensagem-tecnico');
// Guarda em tabela a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const tabela = document.getElementById('lista-tecnicos');
// Guarda em pesquisa a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const pesquisa = document.getElementById('pesquisa-tecnicos');
// Declara equipe com let (variável que pode ser reatribuída) e atribui [];.
let equipe = [];

// Declara a função renderizarTecnicos; os parâmetros (nenhum) recebem dados quando ela é chamada.
function renderizarTecnicos() {
    // Declara termo com const (referência que não pode ser reatribuída) e atribui pesquisa.value.trim().toLocaleLowerCase('pt-BR');.
    const termo = pesquisa.value.trim().toLocaleLowerCase('pt-BR');
    // Define filtrados com uma função de seta ou com uma expressão; usa const (referência que não pode ser reatribuída).
    const filtrados = equipe.filter(tecnico =>
        // Verifica se a lista ou o texto contém o valor pesquisado.
        `${tecnico.nome} ${tecnico.email} ${tecnico.especialidade} ${tecnico.telefone}`.toLocaleLowerCase('pt-BR').includes(termo)
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    );
    // Substitui os filhos do elemento HTML, limpando ou atualizando seu conteúdo.
    tabela.replaceChildren();
    // Percorre cada item da lista e executa a função fornecida para cada um.
    filtrados.forEach(tecnico => {
        // Cria um elemento HTML em memória e o guarda em linha, para depois configurá-lo e inseri-lo na página.
        const linha = document.createElement('tr');
        // Percorre cada item da lista e executa a função fornecida para cada um.
        [tecnico.nome, tecnico.email, tecnico.especialidade, tecnico.telefone].forEach(valor => {
            // Cria um elemento HTML em memória e o guarda em celula, para depois configurá-lo e inseri-lo na página.
            const celula = document.createElement('td');
            // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
            celula.textContent = valor;
            // Adiciona o elemento criado ao final do elemento pai no documento.
            linha.append(celula);
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        });
        // Adiciona o elemento criado ao final do elemento pai no documento.
        tabela.append(linha);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
    // Verifica a condição (!filtrados.length) {; só executa o trecho correspondente quando ela for verdadeira.
    if (!filtrados.length) {
        // Cria um elemento HTML em memória e o guarda em linha, para depois configurá-lo e inseri-lo na página.
        const linha = document.createElement('tr');
        // Cria um elemento HTML em memória e o guarda em celula, para depois configurá-lo e inseri-lo na página.
        const celula = document.createElement('td');
        // Atribui ou atualiza celula.colSpan com o resultado da expressão à direita do sinal =.
        celula.colSpan = 4;
        // Define a classe CSS que determina o visual do elemento.
        celula.className = 'lista-vazia';
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        celula.textContent = equipe.length ? 'Nenhum técnico corresponde à busca.' : 'Nenhum técnico cadastrado.';
        // Adiciona o elemento criado ao final do elemento pai no documento.
        linha.append(celula);
        // Adiciona o elemento criado ao final do elemento pai no documento.
        tabela.append(linha);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    document.getElementById('resultado-tecnicos').textContent = `${filtrados.length} de ${equipe.length} técnicos`;
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função carregarTecnicos; os parâmetros (nenhum) recebem dados quando ela é chamada.
function carregarTecnicos() {
    // Chama a função compartilhada que envia a solicitação HTTP autenticada para esta rota da API.
    apiFetch('/api/tecnicos/lista')
        // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
        .then(r => r.json())
        // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
        .then(tecnicos => {
            // Atribui ou atualiza equipe com o resultado da expressão à direita do sinal =.
            equipe = tecnicos;
            // Chama a função renderizarTecnicos com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
            renderizarTecnicos();
        // Finaliza a função de retorno e a chamada que a recebeu.
        })
        // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
        .catch(() => {
            // Atualiza o HTML interno do elemento; dados externos devem ser escapados antes de entrar nessa marcação.
            tabela.innerHTML = '<tr><td colspan="4" class="lista-vazia">Erro ao carregar técnicos.</td></tr>';
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        });
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Registra uma função para reagir ao evento input (por exemplo, clique, envio ou digitação).
pesquisa.addEventListener('input', renderizarTecnicos);

// Registra uma função para reagir ao evento submit (por exemplo, clique, envio ou digitação).
form.addEventListener('submit', function (event) {
    // Impede o comportamento padrão do formulário/evento, evitando o recarregamento imediato da página.
    event.preventDefault();

    // Declara tecnico com const (referência que não pode ser reatribuída) e atribui {.
    const tecnico = {
        // Define a propriedade nome do objeto; o valor utilizado é document.getElementById('nome').value.trim(),.
        nome: document.getElementById('nome').value.trim(),
        // Define a propriedade email do objeto; o valor utilizado é document.getElementById('email').value.trim().toLowerCase(),.
        email: document.getElementById('email').value.trim().toLowerCase(),
        // Define a propriedade telefone do objeto; o valor utilizado é document.getElementById('telefone').value.trim(),.
        telefone: document.getElementById('telefone').value.trim(),
        // Define a propriedade especialidade do objeto; o valor utilizado é document.getElementById('especialidade').value.trim().
        especialidade: document.getElementById('especialidade').value.trim()
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    };

    // Declara numeros com const (referência que não pode ser reatribuída) e atribui tecnico.telefone.replace(/\D/g, '');.
    const numeros = tecnico.telefone.replace(/\D/g, '');
    // Verifica a condição (numeros.length < 10 || numeros.length > 11) {; só executa o trecho correspondente quando ela for verdadeira.
    if (numeros.length < 10 || numeros.length > 11) {
        // Mostra feedback de sucesso ou erro no elemento de mensagem da tela.
        Utils.mostrarMensagem(mensagem, 'erro', 'Digite um telefone com 10 ou 11 números.');
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }

    // Chama a função compartilhada que envia a solicitação HTTP autenticada para esta rota da API.
    apiFetch('/api/tecnicos', {
        // Define a propriedade method do objeto; o valor utilizado é 'POST',.
        method: 'POST',
        // Define a propriedade headers do objeto; o valor utilizado é { 'Content-Type': 'application/json' },.
        headers: { 'Content-Type': 'application/json' },
        // Serializa dados JavaScript para texto JSON, usado no corpo da requisição.
        body: JSON.stringify(tecnico)
    // Finaliza a função de retorno e a chamada que a recebeu.
    })
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .then(r => r.json())
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .then(dados => {
        // Verifica a condição (dados.erro) {; só executa o trecho correspondente quando ela for verdadeira.
        if (dados.erro) {
            // Mostra feedback de sucesso ou erro no elemento de mensagem da tela.
            Utils.mostrarMensagem(mensagem, 'erro', dados.erro);
            // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
            return;
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        }
        // Limpa os campos do formulário e restaura seus valores iniciais.
        form.reset();
        // Chama a função carregarTecnicos com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        carregarTecnicos();
        // Mostra feedback de sucesso ou erro no elemento de mensagem da tela.
        Utils.mostrarMensagem(mensagem, 'sucesso', 'Técnico cadastrado com sucesso!');
    // Finaliza a função de retorno e a chamada que a recebeu.
    })
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .catch(() => Utils.mostrarMensagem(mensagem, 'erro', 'Servidor offline.'));
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Chama a função carregarTecnicos com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
carregarTecnicos();
