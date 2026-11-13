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
// Declara statusDaFila com const (referência que não pode ser reatribuída) e atribui [.
const statusDaFila = [
    // Abre uma estrutura de objeto ou array contendo os valores definidos nas linhas seguintes.
    { nome: 'Aberta', classe: 'aberta' },
    // Abre uma estrutura de objeto ou array contendo os valores definidos nas linhas seguintes.
    { nome: 'Em execução', classe: 'andamento' },
    // Abre uma estrutura de objeto ou array contendo os valores definidos nas linhas seguintes.
    { nome: 'Concluída', classe: 'concluida' },
    // Abre uma estrutura de objeto ou array contendo os valores definidos nas linhas seguintes.
    { nome: 'Cancelada', classe: 'cancelada' }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
];

// Declara a função renderizarDistribuicao; os parâmetros (dashboard) recebem dados quando ela é chamada.
function renderizarDistribuicao(dashboard) {
    // Guarda em linhas a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
    const linhas = document.getElementById('distribuicao-status');
    // Declara total com const (referência que não pode ser reatribuída) e atribui dashboard.total_os || 0;.
    const total = dashboard.total_os || 0;
    // Define quantidades com uma função de seta ou com uma expressão; usa const (referência que não pode ser reatribuída).
    const quantidades = Object.fromEntries((dashboard.distribuicao || []).map(item => [item.status, item.total]));
    // Substitui os filhos do elemento HTML, limpando ou atualizando seu conteúdo.
    linhas.replaceChildren();

    // Percorre cada item da lista e executa a função fornecida para cada um.
    statusDaFila.forEach(status => {
        // Declara quantidade com const (referência que não pode ser reatribuída) e atribui quantidades[status.nome] || 0;.
        const quantidade = quantidades[status.nome] || 0;
        // Cria um elemento HTML em memória e o guarda em linha, para depois configurá-lo e inseri-lo na página.
        const linha = document.createElement('div');
        // Define a classe CSS que determina o visual do elemento.
        linha.className = 'distribution-item';
        // Cria um elemento HTML em memória e o guarda em cabecalho, para depois configurá-lo e inseri-lo na página.
        const cabecalho = document.createElement('div');
        // Define a classe CSS que determina o visual do elemento.
        cabecalho.className = 'distribution-label';
        // Cria um elemento HTML em memória e o guarda em nome, para depois configurá-lo e inseri-lo na página.
        const nome = document.createElement('span');
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        nome.textContent = status.nome;
        // Cria um elemento HTML em memória e o guarda em valor, para depois configurá-lo e inseri-lo na página.
        const valor = document.createElement('strong');
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        valor.textContent = `${quantidade} · ${total ? Math.round(quantidade / total * 100) : 0}%`;
        // Adiciona o elemento criado ao final do elemento pai no documento.
        cabecalho.append(nome, valor);
        // Cria um elemento HTML em memória e o guarda em trilho, para depois configurá-lo e inseri-lo na página.
        const trilho = document.createElement('div');
        // Define a classe CSS que determina o visual do elemento.
        trilho.className = 'distribution-track';
        // Define um atributo HTML (inclusive os usados por acessibilidade e navegação).
        trilho.setAttribute('role', 'progressbar');
        // Define um atributo HTML (inclusive os usados por acessibilidade e navegação).
        trilho.setAttribute('aria-label', `${status.nome}: ${quantidade} ordens`);
        // Define um atributo HTML (inclusive os usados por acessibilidade e navegação).
        trilho.setAttribute('aria-valuemin', '0');
        // Define um atributo HTML (inclusive os usados por acessibilidade e navegação).
        trilho.setAttribute('aria-valuemax', String(total || 1));
        // Define um atributo HTML (inclusive os usados por acessibilidade e navegação).
        trilho.setAttribute('aria-valuenow', String(quantidade));
        // Cria um elemento HTML em memória e o guarda em preenchimento, para depois configurá-lo e inseri-lo na página.
        const preenchimento = document.createElement('span');
        // Define a classe CSS que determina o visual do elemento.
        preenchimento.className = `distribution-fill ${status.classe}`;
        // Ajusta diretamente a propriedade visual width do elemento, sem modificar o CSS do arquivo.
        preenchimento.style.width = `${total ? quantidade / total * 100 : 0}%`;
        // Adiciona o elemento criado ao final do elemento pai no documento.
        trilho.append(preenchimento);
        // Adiciona o elemento criado ao final do elemento pai no documento.
        linha.append(cabecalho, trilho);
        // Adiciona o elemento criado ao final do elemento pai no documento.
        linhas.append(linha);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função renderizarOrdens; os parâmetros (ordens) recebem dados quando ela é chamada.
function renderizarOrdens(ordens) {
    // Guarda em tabela a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
    const tabela = document.getElementById('ordens-recentes');
    // Substitui os filhos do elemento HTML, limpando ou atualizando seu conteúdo.
    tabela.replaceChildren();
    // Percorre cada item da lista e executa a função fornecida para cada um.
    ordens.slice(0, 5).forEach(ordem => {
        // Cria um elemento HTML em memória e o guarda em linha, para depois configurá-lo e inseri-lo na página.
        const linha = document.createElement('tr');
        // Cria um elemento HTML em memória e o guarda em numero, para depois configurá-lo e inseri-lo na página.
        const numero = document.createElement('td');
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        numero.textContent = '#' + String(ordem.id).padStart(3, '0');
        // Cria um elemento HTML em memória e o guarda em cliente, para depois configurá-lo e inseri-lo na página.
        const cliente = document.createElement('td');
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        cliente.textContent = ordem.cliente;
        // Cria um elemento HTML em memória e o guarda em equipamento, para depois configurá-lo e inseri-lo na página.
        const equipamento = document.createElement('td');
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        equipamento.textContent = ordem.equipamento;
        // Cria um elemento HTML em memória e o guarda em status, para depois configurá-lo e inseri-lo na página.
        const status = document.createElement('td');
        // Cria um elemento HTML em memória e o guarda em badge, para depois configurá-lo e inseri-lo na página.
        const badge = document.createElement('span');
        // Define a classe CSS que determina o visual do elemento.
        badge.className = 'status ' + Utils.classeStatus(ordem.status);
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        badge.textContent = ordem.status;
        // Adiciona o elemento criado ao final do elemento pai no documento.
        status.append(badge);
        // Cria um elemento HTML em memória e o guarda em acao, para depois configurá-lo e inseri-lo na página.
        const acao = document.createElement('td');
        // Cria um elemento HTML em memória e o guarda em link, para depois configurá-lo e inseri-lo na página.
        const link = document.createElement('a');
        // Define a classe CSS que determina o visual do elemento.
        link.className = 'icon-action';
        // Define ou consulta o endereço de destino de um link.
        link.href = 'detalhes.html?id=' + ordem.id;
        // Atribui ou atualiza link.title com o resultado da expressão à direita do sinal =.
        link.title = 'Abrir ordem';
        // Define um atributo HTML (inclusive os usados por acessibilidade e navegação).
        link.setAttribute('aria-label', 'Abrir ordem ' + ordem.id);
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        link.textContent = 'Abrir';
        // Adiciona o elemento criado ao final do elemento pai no documento.
        acao.append(link);
        // Adiciona o elemento criado ao final do elemento pai no documento.
        linha.append(numero, cliente, equipamento, status, acao);
        // Adiciona o elemento criado ao final do elemento pai no documento.
        tabela.append(linha);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });

    // Verifica a condição (!ordens.length) {; só executa o trecho correspondente quando ela for verdadeira.
    if (!ordens.length) {
        // Cria um elemento HTML em memória e o guarda em vazio, para depois configurá-lo e inseri-lo na página.
        const vazio = document.createElement('tr');
        // Cria um elemento HTML em memória e o guarda em celula, para depois configurá-lo e inseri-lo na página.
        const celula = document.createElement('td');
        // Atribui ou atualiza celula.colSpan com o resultado da expressão à direita do sinal =.
        celula.colSpan = 5;
        // Define a classe CSS que determina o visual do elemento.
        celula.className = 'lista-vazia';
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        celula.textContent = 'Nenhuma ordem cadastrada.';
        // Adiciona o elemento criado ao final do elemento pai no documento.
        vazio.append(celula);
        // Adiciona o elemento criado ao final do elemento pai no documento.
        tabela.append(vazio);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função atualizarPainel; os parâmetros (nenhum) recebem dados quando ela é chamada. A função async pode aguardar tarefas assíncronas.
async function atualizarPainel() {
    // Guarda em botao a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
    const botao = document.getElementById('atualizar-painel');
    // Habilita ou desabilita um botão/campo conforme o estado do sistema.
    botao.disabled = true;
    // Altera as classes CSS do elemento para atualizar aparência ou estado da interface.
    botao.classList.add('is-loading');
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Extrai os elementos do array em variáveis separadas; Promise.all permite aguardar requisições simultâneas quando usado.
        const [respostaDashboard, respostaOrdens] = await Promise.all([
            // Chama a função compartilhada que envia a solicitação HTTP autenticada para esta rota da API.
            apiFetch('/api/dashboard'), apiFetch('/api/ordens')
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        ]);
        // Verifica a condição (!respostaDashboard.ok || !respostaOrdens.ok) throw new Error('Não foi possível sincronizar o p…; só executa o trecho correspondente quando ela for verdadeira.
        if (!respostaDashboard.ok || !respostaOrdens.ok) throw new Error('Não foi possível sincronizar o painel.');
        // Extrai os elementos do array em variáveis separadas; Promise.all permite aguardar requisições simultâneas quando usado.
        const [dashboard, ordens] = await Promise.all([respostaDashboard.json(), respostaOrdens.json()]);
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('total-os').textContent = dashboard.total_os || 0;
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('os-abertas').textContent = dashboard.os_abertas || 0;
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('em-execucao').textContent = dashboard.em_execucao || 0;
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('concluidas').textContent = dashboard.concluidas || 0;
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('alta-prioridade').textContent = dashboard.alta_prioridade || 0;
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('aguardando-48h').textContent = dashboard.aguardando_48h || 0;
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('sem-responsavel').textContent = dashboard.sem_responsavel || 0;
        // Cria uma nova instância e a armazena em atualizado; usa const (referência que não pode ser reatribuída).
        const atualizado = new Date(dashboard.atualizado_em || Date.now()).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('ultima-atualizacao').textContent = `Atualizado às ${atualizado}`;
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('resumo-fila').textContent = `${dashboard.total_os || 0} ordens na sua visão operacional`;
        // Chama a função renderizarDistribuicao com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        renderizarDistribuicao(dashboard);
        // Chama a função renderizarOrdens com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        renderizarOrdens(ordens);
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch (erro) {
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('ultima-atualizacao').textContent = erro.message;
    // Executa a limpeza mesmo se a operação anterior tiver apresentado erro.
    } finally {
        // Habilita ou desabilita um botão/campo conforme o estado do sistema.
        botao.disabled = false;
        // Altera as classes CSS do elemento para atualizar aparência ou estado da interface.
        botao.classList.remove('is-loading');
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Registra uma função para reagir ao evento click (por exemplo, clique, envio ou digitação).
document.getElementById('atualizar-painel').addEventListener('click', atualizarPainel);
// Registra uma função para reagir ao evento visibilitychange (por exemplo, clique, envio ou digitação).
document.addEventListener('visibilitychange', () => {
    // Verifica a condição (!document.hidden) atualizarPainel();; só executa o trecho correspondente quando ela for verdadeira.
    if (!document.hidden) atualizarPainel();
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Chama a função window.setInterval com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
window.setInterval(() => {
    // Verifica a condição (!document.hidden) atualizarPainel();; só executa o trecho correspondente quando ela for verdadeira.
    if (!document.hidden) atualizarPainel();
// Encerra o bloco anterior e segue para a próxima instrução.
}, 60000);
// Chama a função atualizarPainel com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
atualizarPainel();
