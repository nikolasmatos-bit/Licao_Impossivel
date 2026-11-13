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
const tabela = document.getElementById('ordens-cliente');
// Guarda em busca a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const busca = document.getElementById('busca-cliente');
// Declara ordens com let (variável que pode ser reatribuída) e atribui [];.
let ordens = [];

// Declara a função renderizar; os parâmetros (nenhum) recebem dados quando ela é chamada.
function renderizar() {
    // Declara termo com const (referência que não pode ser reatribuída) e atribui busca.value.trim().toLocaleLowerCase('pt-BR');.
    const termo = busca.value.trim().toLocaleLowerCase('pt-BR');
    // Define filtradas com uma função de seta ou com uma expressão; usa const (referência que não pode ser reatribuída).
    const filtradas = ordens.filter(ordem =>
        // Verifica se a lista ou o texto contém o valor pesquisado.
        `${ordem.equipamento} ${ordem.status} ${ordem.tecnico || ''}`.toLocaleLowerCase('pt-BR').includes(termo)
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    );
    // Substitui os filhos do elemento HTML, limpando ou atualizando seu conteúdo.
    tabela.replaceChildren();
    // Percorre cada item da lista e executa a função fornecida para cada um.
    filtradas.forEach(ordem => {
        // Cria um elemento HTML em memória e o guarda em linha, para depois configurá-lo e inseri-lo na página.
        const linha = document.createElement('tr');
        // Cria um elemento HTML em memória e o guarda em numero, para depois configurá-lo e inseri-lo na página.
        const numero = document.createElement('td');
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        numero.textContent = `#${String(ordem.id).padStart(3, '0')}`;
        // Cria um elemento HTML em memória e o guarda em equipamento, para depois configurá-lo e inseri-lo na página.
        const equipamento = document.createElement('td');
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        equipamento.textContent = ordem.equipamento;
        // Cria um elemento HTML em memória e o guarda em tecnico, para depois configurá-lo e inseri-lo na página.
        const tecnico = document.createElement('td');
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        tecnico.textContent = ordem.tecnico || 'A definir';
        // Cria um elemento HTML em memória e o guarda em abertura, para depois configurá-lo e inseri-lo na página.
        const abertura = document.createElement('td');
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        abertura.textContent = Utils.formatarData(ordem.aberta_em);
        // Cria um elemento HTML em memória e o guarda em status, para depois configurá-lo e inseri-lo na página.
        const status = document.createElement('td');
        // Cria um elemento HTML em memória e o guarda em etiqueta, para depois configurá-lo e inseri-lo na página.
        const etiqueta = document.createElement('span');
        // Define a classe CSS que determina o visual do elemento.
        etiqueta.className = `status ${Utils.classeStatus(ordem.status)}`;
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        etiqueta.textContent = ordem.status;
        // Adiciona o elemento criado ao final do elemento pai no documento.
        status.append(etiqueta);
        // Cria um elemento HTML em memória e o guarda em acao, para depois configurá-lo e inseri-lo na página.
        const acao = document.createElement('td');
        // Cria um elemento HTML em memória e o guarda em link, para depois configurá-lo e inseri-lo na página.
        const link = document.createElement('a');
        // Define a classe CSS que determina o visual do elemento.
        link.className = 'button button-outline table-button';
        // Define ou consulta o endereço de destino de um link.
        link.href = `detalhes.html?id=${ordem.id}`;
        // Atualiza o HTML interno do elemento; dados externos devem ser escapados antes de entrar nessa marcação.
        link.innerHTML = ' Acompanhar';
        // Adiciona o elemento criado ao final do elemento pai no documento.
        acao.append(link);
        // Adiciona o elemento criado ao final do elemento pai no documento.
        linha.append(numero, equipamento, tecnico, abertura, status, acao);
        // Adiciona o elemento criado ao final do elemento pai no documento.
        tabela.append(linha);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
    // Oculta ou exibe um elemento da interface de acordo com a condição.
    document.getElementById('vazio-cliente').hidden = filtradas.length > 0;
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    document.getElementById('resumo-cliente').textContent = `${filtradas.length} de ${ordens.length} ordens`;
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Registra uma função para reagir ao evento input (por exemplo, clique, envio ou digitação).
busca.addEventListener('input', renderizar);
// Chama a função compartilhada que envia a solicitação HTTP autenticada para esta rota da API.
apiFetch('/api/ordens')
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .then(async resposta => {
        // Verifica a condição (!resposta.ok) throw new Error('Não foi possível carregar seus atendimentos.');; só executa o trecho correspondente quando ela for verdadeira.
        if (!resposta.ok) throw new Error('Não foi possível carregar seus atendimentos.');
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return resposta.json();
    // Finaliza a função de retorno e a chamada que a recebeu.
    })
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .then(dados => {
        // Atribui ou atualiza ordens com o resultado da expressão à direita do sinal =.
        ordens = dados;
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('total-cliente').textContent = dados.length;
        // Filtra a lista, preservando apenas elementos que atendam à condição.
        document.getElementById('ativas-cliente').textContent = dados.filter(ordem => ['Aberta', 'Em execução'].includes(ordem.status)).length;
        // Filtra a lista, preservando apenas elementos que atendam à condição.
        document.getElementById('concluidas-cliente').textContent = dados.filter(ordem => ordem.status === 'Concluída').length;
        // Chama a função renderizar com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        renderizar();
    // Finaliza a função de retorno e a chamada que a recebeu.
    })
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .catch(() => {
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('resumo-cliente').textContent = 'Não foi possível carregar os atendimentos.';
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
