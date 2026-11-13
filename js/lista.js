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
const tabela = document.getElementById('lista-ordens');
// Guarda em pesquisa a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const pesquisa = document.getElementById('pesquisa-ordens');
// Localiza no HTML o primeiro elemento que atende ao seletor e o guarda em chips; usa const (referência que não pode ser reatribuída).
const chips = [...document.querySelectorAll('[data-status]')];
// Cria uma nova instância e a armazena em parametros; usa const (referência que não pode ser reatribuída).
const parametros = new URLSearchParams(window.location.search);
// Lê ou atualiza o valor de um campo do formulário.
pesquisa.value = parametros.get('cliente') || '';
// Declara todasOrdens com let (variável que pode ser reatribuída) e atribui [];.
let todasOrdens = [];
// Declara statusSelecionado com let (variável que pode ser reatribuída) e atribui parametros.get('status') || 'Todas';.
let statusSelecionado = parametros.get('status') || 'Todas';
// Verifica a condição (!chips.some(chip => chip.dataset.status === statusSelecionado)) statusSelecionado = 'Todas';; só executa o trecho correspondente quando ela for verdadeira.
if (!chips.some(chip => chip.dataset.status === statusSelecionado)) statusSelecionado = 'Todas';

// Declara a função renderizar; os parâmetros (nenhum) recebem dados quando ela é chamada.
function renderizar() {
    // Declara termo com const (referência que não pode ser reatribuída) e atribui pesquisa.value.trim().toLocaleLowerCase('pt-BR');.
    const termo = pesquisa.value.trim().toLocaleLowerCase('pt-BR');
    // Declara linhas com let (variável que pode ser reatribuída) e atribui '';.
    let linhas = '';
    // Declara quantidade com let (variável que pode ser reatribuída) e atribui 0;.
    let quantidade = 0;

    // Repete as instruções seguintes seguindo a condição de controle do laço for.
    for (let i = 0; i < todasOrdens.length; i++) {
        // Declara o com const (referência que não pode ser reatribuída) e atribui todasOrdens[i];.
        const o = todasOrdens[i];
        // Declara texto com const (referência que não pode ser reatribuída) e atribui [o.cliente, o.cliente_telefone, o.cliente_email, o.tecnico, o.equipamento, o.prioridade, o.sta….
        const texto = [o.cliente, o.cliente_telefone, o.cliente_email, o.tecnico, o.equipamento, o.prioridade, o.status].join(' ').toLocaleLowerCase('pt-BR');
        // Verifica a condição (!texto.includes(termo)) continue;; só executa o trecho correspondente quando ela for verdadeira.
        if (!texto.includes(termo)) continue;
        // Verifica a condição (statusSelecionado !== 'Todas' && o.status !== statusSelecionado) continue;; só executa o trecho correspondente quando ela for verdadeira.
        if (statusSelecionado !== 'Todas' && o.status !== statusSelecionado) continue;
        // Completa a expressão/chamada JavaScript do bloco atual, utilizando os valores indicados na linha.
        quantidade++;

        // Declara acao com let (variável que pode ser reatribuída) e atribui '<a class="icon-action" href="detalhes.html?id=' + o.id + '">Abrir</a>';.
        let acao = '<a class="icon-action" href="detalhes.html?id=' + o.id + '">Abrir</a>';
        // Verifica a condição (o.status === 'Concluída' || o.status === 'Cancelada') {; só executa o trecho correspondente quando ela for verdadeira.
        if (o.status === 'Concluída' || o.status === 'Cancelada') {
            // Completa a expressão/chamada JavaScript do bloco atual, utilizando os valores indicados na linha.
            acao += '<span class="acao-fechada">Finalizada</span>';
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        }

        // Completa a expressão/chamada JavaScript do bloco atual, utilizando os valores indicados na linha.
        linhas += `
            <tr>
                <td>#${String(o.id).padStart(3, '0')}</td>
                <td><a class="customer-link" href="clientes.html">${Utils.escapeHTML(o.cliente || '')}</a></td>
                <td>${Utils.escapeHTML(o.tecnico || '—')}</td>
                <td>${Utils.escapeHTML(o.prioridade || '')}</td>
                <td><span class="status ${Utils.classeStatus(o.status)}">${Utils.escapeHTML(o.status || '')}</span></td>
                <td class="row-actions">${acao}<button class="icon-action copiar-link" type="button" data-os="${o.id}">Copiar link</button></td>
            </tr>`;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }

    // Atualiza o HTML interno do elemento; dados externos devem ser escapados antes de entrar nessa marcação.
    tabela.innerHTML = linhas;
    // Oculta ou exibe um elemento da interface de acordo com a condição.
    document.getElementById('vazio-ordens').hidden = quantidade > 0;
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    document.getElementById('resultado-ordens').textContent = `${quantidade} de ${todasOrdens.length} ordens`;
    // Percorre cada item da lista e executa a função fornecida para cada um.
    chips.forEach(chip => {
        // Declara ativo com const (referência que não pode ser reatribuída) e atribui chip.dataset.status === statusSelecionado;.
        const ativo = chip.dataset.status === statusSelecionado;
        // Altera as classes CSS do elemento para atualizar aparência ou estado da interface.
        chip.classList.toggle('is-active', ativo);
        // Define um atributo HTML (inclusive os usados por acessibilidade e navegação).
        chip.setAttribute('aria-pressed', String(ativo));
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Chama a função compartilhada que envia a solicitação HTTP autenticada para esta rota da API.
apiFetch('/api/ordens')
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .then(r => r.json())
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .then(dados => {
        // Atribui ou atualiza todasOrdens com o resultado da expressão à direita do sinal =.
        todasOrdens = dados;
        // Chama a função renderizar com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        renderizar();
    // Finaliza a função de retorno e a chamada que a recebeu.
    })
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .catch(() => {
        // Atualiza o HTML interno do elemento; dados externos devem ser escapados antes de entrar nessa marcação.
        tabela.innerHTML = '<tr><td colspan="6" class="lista-vazia">Erro ao conectar no servidor. O Node está rodando?</td></tr>';
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });

// Registra uma função para reagir ao evento input (por exemplo, clique, envio ou digitação).
pesquisa.addEventListener('input', renderizar);
// Registra uma função para reagir ao evento click (por exemplo, clique, envio ou digitação).
chips.forEach(chip => chip.addEventListener('click', () => {
    // Atribui ou atualiza statusSelecionado com o resultado da expressão à direita do sinal =.
    statusSelecionado = chip.dataset.status;
    // Chama a função renderizar com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    renderizar();
// Finaliza a função de retorno e a chamada que a recebeu.
}));
// Registra uma função para reagir ao evento click (por exemplo, clique, envio ou digitação).
tabela.addEventListener('click', async event => {
    // Declara botao com const (referência que não pode ser reatribuída) e atribui event.target.closest('.copiar-link');.
    const botao = event.target.closest('.copiar-link');
    // Verifica a condição (!botao) return;; só executa o trecho correspondente quando ela for verdadeira.
    if (!botao) return;
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Espera a operação assíncrona terminar antes de continuar com o resultado.
        await navigator.clipboard.writeText(`${location.origin}/detalhes.html?id=${botao.dataset.os}`);
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        botao.textContent = 'Copiado';
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        setTimeout(() => { botao.textContent = 'Copiar link'; }, 1400);
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch {
        // Abre uma mensagem de aviso no navegador para exibir o erro ou a informação.
        alert('Não foi possível copiar o link neste navegador.');
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
