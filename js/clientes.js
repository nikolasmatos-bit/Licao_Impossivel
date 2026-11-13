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
// Guarda em tabela a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const tabela = document.getElementById('lista-clientes');
// Guarda em pesquisa a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const pesquisa = document.getElementById('pesquisa-clientes');
// Guarda em vazio a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const vazio = document.getElementById('vazio-clientes');
// Declara clientes com let (variável que pode ser reatribuída) e atribui [];.
let clientes = [];

// Declara a função criarCelula; os parâmetros (valor, classe = '') recebem dados quando ela é chamada.
function criarCelula(valor, classe = '') {
    // Cria um elemento HTML em memória e o guarda em celula, para depois configurá-lo e inseri-lo na página.
    const celula = document.createElement('td');
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    celula.textContent = valor === null || valor === undefined || valor === '' ? '—' : String(valor);
    // Verifica a condição (classe) celula.className = classe;; só executa o trecho correspondente quando ela for verdadeira.
    if (classe) celula.className = classe;
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return celula;
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função renderizarClientes; os parâmetros (nenhum) recebem dados quando ela é chamada.
function renderizarClientes() {
    // Declara termo com const (referência que não pode ser reatribuída) e atribui pesquisa.value.trim().toLocaleLowerCase('pt-BR');.
    const termo = pesquisa.value.trim().toLocaleLowerCase('pt-BR');
    // Define filtrados com uma função de seta ou com uma expressão; usa const (referência que não pode ser reatribuída).
    const filtrados = clientes.filter(cliente =>
        // Abre uma estrutura de objeto ou array contendo os valores definidos nas linhas seguintes.
        [cliente.nome, cliente.telefone, cliente.email].some(valor =>
            // Verifica se a lista ou o texto contém o valor pesquisado.
            (valor || '').toLocaleLowerCase('pt-BR').includes(termo)
        // Encerra os argumentos ou a coleção iniciados nas linhas anteriores.
        )
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    );

    // Substitui os filhos do elemento HTML, limpando ou atualizando seu conteúdo.
    tabela.replaceChildren();
    // Percorre cada item da lista e executa a função fornecida para cada um.
    filtrados.forEach(cliente => {
        // Cria um elemento HTML em memória e o guarda em linha, para depois configurá-lo e inseri-lo na página.
        const linha = document.createElement('tr');
        // Adiciona o elemento criado ao final do elemento pai no documento.
        linha.append(criarCelula(cliente.nome, 'customer-name'));
        // Adiciona o elemento criado ao final do elemento pai no documento.
        linha.append(criarCelula(cliente.telefone));
        // Adiciona o elemento criado ao final do elemento pai no documento.
        linha.append(criarCelula(cliente.email));
        // Adiciona o elemento criado ao final do elemento pai no documento.
        linha.append(criarCelula(cliente.total_os));
        // Adiciona o elemento criado ao final do elemento pai no documento.
        linha.append(criarCelula(cliente.os_ativas));
        // Adiciona o elemento criado ao final do elemento pai no documento.
        linha.append(criarCelula(Utils.formatarData(cliente.ultima_os)));

        // Cria um elemento HTML em memória e o guarda em acoes, para depois configurá-lo e inseri-lo na página.
        const acoes = document.createElement('td');
        // Define a classe CSS que determina o visual do elemento.
        acoes.className = 'row-actions';
        // Declara telefone com const (referência que não pode ser reatribuída) e atribui Utils.numeroWhatsApp(cliente.telefone);.
        const telefone = Utils.numeroWhatsApp(cliente.telefone);
        // Verifica a condição (telefone) {; só executa o trecho correspondente quando ela for verdadeira.
        if (telefone) {
            // Cria um elemento HTML em memória e o guarda em whatsapp, para depois configurá-lo e inseri-lo na página.
            const whatsapp = document.createElement('a');
            // Define ou consulta o endereço de destino de um link.
            whatsapp.href = `https://wa.me/${telefone}?text=${encodeURIComponent(`Olá, ${cliente.nome}! Aqui é da assistência técnica.`)}`;
            // Atribui ou atualiza whatsapp.target com o resultado da expressão à direita do sinal =.
            whatsapp.target = '_blank';
            // Atribui ou atualiza whatsapp.rel com o resultado da expressão à direita do sinal =.
            whatsapp.rel = 'noopener noreferrer';
            // Atribui ou atualiza whatsapp.title com o resultado da expressão à direita do sinal =.
            whatsapp.title = 'Conversar pelo WhatsApp';
            // Define um atributo HTML (inclusive os usados por acessibilidade e navegação).
            whatsapp.setAttribute('aria-label', `Conversar com ${cliente.nome} pelo WhatsApp`);
            // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
            whatsapp.textContent = 'WhatsApp';
            // Adiciona o elemento criado ao final do elemento pai no documento.
            acoes.append(whatsapp);
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        }
        // Verifica a condição (cliente.email) {; só executa o trecho correspondente quando ela for verdadeira.
        if (cliente.email) {
            // Cria um elemento HTML em memória e o guarda em email, para depois configurá-lo e inseri-lo na página.
            const email = document.createElement('a');
            // Define ou consulta o endereço de destino de um link.
            email.href = `mailto:${encodeURIComponent(cliente.email)}`;
            // Atribui ou atualiza email.title com o resultado da expressão à direita do sinal =.
            email.title = 'Enviar e-mail';
            // Define um atributo HTML (inclusive os usados por acessibilidade e navegação).
            email.setAttribute('aria-label', `Enviar e-mail para ${cliente.nome}`);
            // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
            email.textContent = 'E-mail';
            // Adiciona o elemento criado ao final do elemento pai no documento.
            acoes.append(email);
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        }
        // Cria um elemento HTML em memória e o guarda em ordens, para depois configurá-lo e inseri-lo na página.
        const ordens = document.createElement('a');
        // Define ou consulta o endereço de destino de um link.
        ordens.href = `lista.html?cliente=${encodeURIComponent(cliente.nome)}`;
        // Atribui ou atualiza ordens.title com o resultado da expressão à direita do sinal =.
        ordens.title = 'Ver ordens deste cliente';
        // Define um atributo HTML (inclusive os usados por acessibilidade e navegação).
        ordens.setAttribute('aria-label', `Ver ordens de ${cliente.nome}`);
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        ordens.textContent = 'Ordens';
        // Adiciona o elemento criado ao final do elemento pai no documento.
        acoes.append(ordens);
        // Adiciona o elemento criado ao final do elemento pai no documento.
        linha.append(acoes);
        // Adiciona o elemento criado ao final do elemento pai no documento.
        tabela.append(linha);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });

    // Oculta ou exibe um elemento da interface de acordo com a condição.
    vazio.hidden = filtrados.length > 0;
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    document.getElementById('resultado-clientes').textContent = `${filtrados.length} de ${clientes.length} clientes`;
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Registra uma função para reagir ao evento input (por exemplo, clique, envio ou digitação).
pesquisa.addEventListener('input', renderizarClientes);
// Chama a função compartilhada que envia a solicitação HTTP autenticada para esta rota da API.
apiFetch('/api/clientes')
    // Converte o corpo da resposta HTTP de JSON para um objeto JavaScript.
    .then(resposta => resposta.json())
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .then(dados => {
        // Atribui ou atualiza clientes com o resultado da expressão à direita do sinal =.
        clientes = dados;
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('total-clientes').textContent = dados.length;
        // Filtra a lista, preservando apenas elementos que atendam à condição.
        document.getElementById('com-contato').textContent = dados.filter(cliente => cliente.telefone || cliente.email).length;
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('os-ativas').textContent = dados.reduce((total, cliente) => total + cliente.os_ativas, 0);
        // Chama a função renderizarClientes com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        renderizarClientes();
    // Finaliza a função de retorno e a chamada que a recebeu.
    })
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .catch(() => {
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('resultado-clientes').textContent = 'Não foi possível carregar os clientes.';
        // Oculta ou exibe um elemento da interface de acordo com a condição.
        vazio.hidden = false;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
