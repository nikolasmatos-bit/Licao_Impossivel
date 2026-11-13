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
// Cria uma nova instância e a armazena em id; usa const (referência que não pode ser reatribuída).
const id = Number(new URLSearchParams(window.location.search).get('id'));
// Declara ordem com let (variável que pode ser reatribuída) e atribui null;.
let ordem = null;
// Declara acao com let (variável que pode ser reatribuída) e atribui '';.
let acao = '';

// Declara a função travarSeEncerrada; os parâmetros (nenhum) recebem dados quando ela é chamada.
function travarSeEncerrada() {
    // Declara encerrada com const (referência que não pode ser reatribuída) e atribui ordem.status === 'Concluída' || ordem.status === 'Cancelada';.
    const encerrada = ordem.status === 'Concluída' || ordem.status === 'Cancelada';
    // Habilita ou desabilita um botão/campo conforme o estado do sistema.
    document.getElementById('diagnostico').disabled = encerrada;
    // Habilita ou desabilita um botão/campo conforme o estado do sistema.
    document.getElementById('status').disabled = encerrada;
    // Habilita ou desabilita um botão/campo conforme o estado do sistema.
    document.getElementById('concluir-atendimento').disabled = encerrada;
    // Habilita ou desabilita um botão/campo conforme o estado do sistema.
    document.getElementById('cancelar-servico').disabled = encerrada;
    // Percorre cada item da lista e executa a função fornecida para cada um.
    document.querySelectorAll('#form-interacao textarea, #form-interacao select, #form-interacao button').forEach(campo => {
        // Habilita ou desabilita um botão/campo conforme o estado do sistema.
        campo.disabled = encerrada;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função mostrarDados; os parâmetros (nenhum) recebem dados quando ela é chamada.
function mostrarDados() {
    // Verifica a condição (!ordem) {; só executa o trecho correspondente quando ela for verdadeira.
    if (!ordem) {
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('titulo-os').textContent = 'OS não encontrada';
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('descricao-os').textContent = 'Volte para a lista e escolha uma ordem válida.';
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }

    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    document.getElementById('titulo-os').textContent = 'OS #' + String(ordem.id).padStart(3, '0');
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    document.getElementById('cliente-os').textContent = ordem.cliente;
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    document.getElementById('tecnico-os').textContent = ordem.tecnico || '—';
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    document.getElementById('equipamento-os').textContent = ordem.equipamento;
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    document.getElementById('prioridade-os').textContent = ordem.prioridade;
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    document.getElementById('data-os').textContent = Utils.formatarData(ordem.aberta_em);
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    document.getElementById('descricao-os').textContent = ordem.descricao;

    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    document.getElementById('status-os').textContent = ordem.status;
    // Define a classe CSS que determina o visual do elemento.
    document.getElementById('status-os').className = 'status ' + Utils.classeStatus(ordem.status);

    // Lê ou atualiza o valor de um campo do formulário.
    document.getElementById('status').value = ordem.status;
    // Lê ou atualiza o valor de um campo do formulário.
    document.getElementById('diagnostico').value = ordem.diagnostico || '';

    // Declara telefone com const (referência que não pode ser reatribuída) e atribui Utils.numeroWhatsApp(ordem.cliente_telefone);.
    const telefone = Utils.numeroWhatsApp(ordem.cliente_telefone);
    // Guarda em whatsapp a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
    const whatsapp = document.getElementById('whatsapp-cliente');
    // Oculta ou exibe um elemento da interface de acordo com a condição.
    whatsapp.hidden = !telefone;
    // Verifica a condição (telefone) {; só executa o trecho correspondente quando ela for verdadeira.
    if (telefone) {
        // Define ou consulta o endereço de destino de um link.
        whatsapp.href = `https://wa.me/${telefone}?text=${encodeURIComponent(`Olá, ${ordem.cliente}! Estamos atualizando sua OS #${ordem.id}.`)}`;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }

    // Guarda em email a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
    const email = document.getElementById('email-cliente');
    // Oculta ou exibe um elemento da interface de acordo com a condição.
    email.hidden = !ordem.cliente_email;
    // Verifica a condição (ordem.cliente_email) email.href = `mailto:${ordem.cliente_email}`;; só executa o trecho correspondente quando ela for verdadeira.
    if (ordem.cliente_email) email.href = `mailto:${ordem.cliente_email}`;

    // Chama a função travarSeEncerrada com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    travarSeEncerrada();
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função salvar; os parâmetros (status, diagnostico) recebem dados quando ela é chamada.
function salvar(status, diagnostico) {
    // Chama a função compartilhada que envia a solicitação HTTP autenticada para esta rota da API.
    apiFetch('/api/ordens/' + ordem.id + '/status', {
        // Define a propriedade method do objeto; o valor utilizado é 'PUT',.
        method: 'PUT',
        // Define a propriedade headers do objeto; o valor utilizado é { 'Content-Type': 'application/json' },.
        headers: { 'Content-Type': 'application/json' },
        // Serializa dados JavaScript para texto JSON, usado no corpo da requisição.
        body: JSON.stringify({ status: status, diagnostico: diagnostico })
    // Finaliza a função de retorno e a chamada que a recebeu.
    })
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .then(r => r.json())
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .then(dados => {
        // Verifica a condição (dados.erro) {; só executa o trecho correspondente quando ela for verdadeira.
        if (dados.erro) {
            // Abre uma mensagem de aviso no navegador para exibir o erro ou a informação.
            alert('Erro: ' + dados.erro);
            // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
            return;
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        }
        // Atribui ou atualiza ordem.status com o resultado da expressão à direita do sinal =.
        ordem.status = status;
        // Atribui ou atualiza ordem.diagnostico com o resultado da expressão à direita do sinal =.
        ordem.diagnostico = diagnostico;
        // Chama a função mostrarDados com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        mostrarDados();
        // Chama a função carregarInteracoes com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        carregarInteracoes();

        // Guarda em mensagem a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
        const mensagem = document.getElementById('mensagem-resposta');
        // Define a classe CSS que determina o visual do elemento.
        mensagem.className = 'mensagem sucesso';
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        mensagem.textContent = 'Resposta salva com sucesso!';
    // Finaliza a função de retorno e a chamada que a recebeu.
    })
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .catch(() => alert('Servidor offline.'));
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função carregarInteracoes; os parâmetros (nenhum) recebem dados quando ela é chamada. A função async pode aguardar tarefas assíncronas.
async function carregarInteracoes() {
    // Guarda em timeline a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
    const timeline = document.getElementById('timeline-interacoes');
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Espera o resultado assíncrono e o armazena em resposta; usa const (referência que não pode ser reatribuída).
        const resposta = await apiFetch(`/api/ordens/${ordem.id}/interacoes`);
        // Espera o resultado assíncrono e o armazena em interacoes; usa const (referência que não pode ser reatribuída).
        const interacoes = await resposta.json();
        // Substitui os filhos do elemento HTML, limpando ou atualizando seu conteúdo.
        timeline.replaceChildren();

        // Verifica a condição (!interacoes.length) {; só executa o trecho correspondente quando ela for verdadeira.
        if (!interacoes.length) {
            // Cria um elemento HTML em memória e o guarda em vazio, para depois configurá-lo e inseri-lo na página.
            const vazio = document.createElement('li');
            // Define a classe CSS que determina o visual do elemento.
            vazio.className = 'timeline-empty';
            // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
            vazio.textContent = 'Nenhuma interação registrada nesta ordem.';
            // Adiciona o elemento criado ao final do elemento pai no documento.
            timeline.append(vazio);
            // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
            return;
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        }

        // Percorre cada item da lista e executa a função fornecida para cada um.
        interacoes.forEach(interacao => {
            // Cria um elemento HTML em memória e o guarda em item, para depois configurá-lo e inseri-lo na página.
            const item = document.createElement('li');
            // Define a classe CSS que determina o visual do elemento.
            item.className = 'timeline-item';
            // Cria um elemento HTML em memória e o guarda em topo, para depois configurá-lo e inseri-lo na página.
            const topo = document.createElement('div');
            // Define a classe CSS que determina o visual do elemento.
            topo.className = 'timeline-meta';
            // Cria um elemento HTML em memória e o guarda em canal, para depois configurá-lo e inseri-lo na página.
            const canal = document.createElement('strong');
            // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
            canal.textContent = interacao.canal;
            // Cria um elemento HTML em memória e o guarda em data, para depois configurá-lo e inseri-lo na página.
            const data = document.createElement('time');
            // Declara criadoEm com const (referência que não pode ser reatribuída) e atribui Utils.dataUTC(interacao.criado_em);.
            const criadoEm = Utils.dataUTC(interacao.criado_em);
            // Verifica a condição (criadoEm) data.dateTime = criadoEm.toISOString();; só executa o trecho correspondente quando ela for verdadeira.
            if (criadoEm) data.dateTime = criadoEm.toISOString();
            // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
            data.textContent = criadoEm?.toLocaleString('pt-BR') || '—';
            // Cria um elemento HTML em memória e o guarda em texto, para depois configurá-lo e inseri-lo na página.
            const texto = document.createElement('p');
            // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
            texto.textContent = interacao.mensagem;
            // Adiciona o elemento criado ao final do elemento pai no documento.
            topo.append(canal, data);
            // Adiciona o elemento criado ao final do elemento pai no documento.
            item.append(topo, texto);
            // Adiciona o elemento criado ao final do elemento pai no documento.
            timeline.append(item);
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        });
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch {
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        timeline.textContent = 'Não foi possível carregar o histórico.';
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função registrarInteracao; os parâmetros (canal, abrirWhatsApp = false) recebem dados quando ela é chamada. A função async pode aguardar tarefas assíncronas.
async function registrarInteracao(canal, abrirWhatsApp = false) {
    // Guarda em campo a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
    const campo = document.getElementById('mensagem-interacao');
    // Guarda em feedback a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
    const feedback = document.getElementById('mensagem-interacao-feedback');
    // Declara texto com const (referência que não pode ser reatribuída) e atribui campo.value.trim();.
    const texto = campo.value.trim();
    // Declara telefone com const (referência que não pode ser reatribuída) e atribui Utils.numeroWhatsApp(ordem.cliente_telefone);.
    const telefone = Utils.numeroWhatsApp(ordem.cliente_telefone);
    // Verifica a condição (!texto) {; só executa o trecho correspondente quando ela for verdadeira.
    if (!texto) {
        // Define a classe CSS que determina o visual do elemento.
        feedback.className = 'mensagem erro';
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        feedback.textContent = 'Escreva uma mensagem antes de registrar.';
        // Chama a função campo.focus com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        campo.focus();
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
    // Verifica a condição (abrirWhatsApp && !telefone) {; só executa o trecho correspondente quando ela for verdadeira.
    if (abrirWhatsApp && !telefone) {
        // Define a classe CSS que determina o visual do elemento.
        feedback.className = 'mensagem erro';
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        feedback.textContent = 'Cadastre um telefone válido com DDD para preparar o WhatsApp.';
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }

    // Declara janela com const (referência que não pode ser reatribuída) e atribui abrirWhatsApp ? window.open('about:blank', '_blank') : null;.
    const janela = abrirWhatsApp ? window.open('about:blank', '_blank') : null;
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Espera o resultado assíncrono e o armazena em resposta; usa const (referência que não pode ser reatribuída).
        const resposta = await apiFetch(`/api/ordens/${ordem.id}/interacoes`, {
            // Define a propriedade method do objeto; o valor utilizado é 'POST',.
            method: 'POST',
            // Define a propriedade headers do objeto; o valor utilizado é { 'Content-Type': 'application/json' },.
            headers: { 'Content-Type': 'application/json' },
            // Serializa dados JavaScript para texto JSON, usado no corpo da requisição.
            body: JSON.stringify({ canal, mensagem: texto })
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        });
        // Espera o resultado assíncrono e o armazena em dados; usa const (referência que não pode ser reatribuída).
        const dados = await resposta.json();
        // Verifica a condição (!resposta.ok) throw new Error(dados.erro || 'Não foi possível registrar a interação.');; só executa o trecho correspondente quando ela for verdadeira.
        if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível registrar a interação.');

        // Lê ou atualiza o valor de um campo do formulário.
        campo.value = '';
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('contador-mensagem').textContent = '0 / 2.000';
        // Define a classe CSS que determina o visual do elemento.
        feedback.className = 'mensagem sucesso';
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        feedback.textContent = abrirWhatsApp ? 'Mensagem registrada. O WhatsApp foi aberto com o texto pronto.' : 'Interação registrada no histórico.';
        // Espera a operação assíncrona terminar antes de continuar com o resultado.
        await carregarInteracoes();

        // Verifica a condição (abrirWhatsApp) {; só executa o trecho correspondente quando ela for verdadeira.
        if (abrirWhatsApp) {
            // Declara url com const (referência que não pode ser reatribuída) e atribui `https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`;.
            const url = `https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`;
            // Verifica a condição (janela) janela.location.href = url;; só executa o trecho correspondente quando ela for verdadeira.
            if (janela) janela.location.href = url;
            // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
            else feedback.textContent = 'Interação registrada. Permita pop-ups para abrir o WhatsApp.';
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        }
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch (erro) {
        // Verifica a condição (janela) janela.close();; só executa o trecho correspondente quando ela for verdadeira.
        if (janela) janela.close();
        // Define a classe CSS que determina o visual do elemento.
        feedback.className = 'mensagem erro';
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        feedback.textContent = erro.message;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função abrirModal; os parâmetros (tipo) recebem dados quando ela é chamada.
function abrirModal(tipo) {
    // Atribui ou atualiza acao com o resultado da expressão à direita do sinal =.
    acao = tipo;
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    document.getElementById('titulo-modal').textContent =
        // Atribui ou atualiza tipo com o resultado da expressão à direita do sinal =.
        tipo === 'concluir' ? 'Concluir atendimento' : 'Cancelar serviço';
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    document.getElementById('texto-modal').textContent =
        // Completa a expressão/chamada JavaScript do bloco atual, utilizando os valores indicados na linha.
        'Depois disso a ordem será encerrada e não poderá mais ser alterada. Deseja confirmar?';
    // Altera as classes CSS do elemento para atualizar aparência ou estado da interface.
    document.getElementById('modal-confirmacao').classList.remove('hidden');
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função fecharModal; os parâmetros (nenhum) recebem dados quando ela é chamada.
function fecharModal() {
    // Atribui ou atualiza acao com o resultado da expressão à direita do sinal =.
    acao = '';
    // Altera as classes CSS do elemento para atualizar aparência ou estado da interface.
    document.getElementById('modal-confirmacao').classList.add('hidden');
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Registra uma função para reagir ao evento submit (por exemplo, clique, envio ou digitação).
document.getElementById('form-resposta').addEventListener('submit', function (event) {
    // Impede o comportamento padrão do formulário/evento, evitando o recarregamento imediato da página.
    event.preventDefault();
    // Verifica a condição (!ordem) return;; só executa o trecho correspondente quando ela for verdadeira.
    if (!ordem) return;
    // Chama a função salvar com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    salvar(document.getElementById('status').value, document.getElementById('diagnostico').value.trim());
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Registra uma função para reagir ao evento submit (por exemplo, clique, envio ou digitação).
document.getElementById('form-interacao').addEventListener('submit', event => {
    // Impede o comportamento padrão do formulário/evento, evitando o recarregamento imediato da página.
    event.preventDefault();
    // Chama a função registrarInteracao com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    registrarInteracao(document.getElementById('canal-interacao').value);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra uma função para reagir ao evento input (por exemplo, clique, envio ou digitação).
document.getElementById('mensagem-interacao').addEventListener('input', event => {
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    document.getElementById('contador-mensagem').textContent = `${event.target.value.length} / 2.000`;
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});
// Registra uma função para reagir ao evento click (por exemplo, clique, envio ou digitação).
document.getElementById('preparar-whatsapp').addEventListener('click', () => registrarInteracao('WhatsApp', true));

// Registra uma função para reagir ao evento click (por exemplo, clique, envio ou digitação).
document.getElementById('concluir-atendimento').addEventListener('click', () => { if (ordem) abrirModal('concluir'); });
// Registra uma função para reagir ao evento click (por exemplo, clique, envio ou digitação).
document.getElementById('cancelar-servico').addEventListener('click', () => { if (ordem) abrirModal('cancelar'); });

// Registra uma função para reagir ao evento click (por exemplo, clique, envio ou digitação).
document.getElementById('confirmar-acoes-modal').addEventListener('click', function () {
    // Guarda em diagnostico a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
    const diagnostico = document.getElementById('diagnostico').value.trim();
    // Verifica a condição (acao === 'concluir') {; só executa o trecho correspondente quando ela for verdadeira.
    if (acao === 'concluir') {
        // Chama a função salvar com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        salvar('Concluída', diagnostico || 'Atendimento concluído com sucesso.');
    // Executa o caminho alternativo caso a condição anterior não seja atendida.
    } else {
        // Chama a função salvar com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        salvar('Cancelada', diagnostico || 'Serviço cancelado.');
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
    // Chama a função fecharModal com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    fecharModal();
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Registra uma função para reagir ao evento click (por exemplo, clique, envio ou digitação).
document.getElementById('cancelar-acoes-modal').addEventListener('click', fecharModal);

// Chama a função compartilhada que envia a solicitação HTTP autenticada para esta rota da API.
apiFetch('/api/ordens/' + id)
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .then(r => r.json())
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .then(dados => {
        // Atribui ou atualiza ordem com o resultado da expressão à direita do sinal =.
        ordem = dados.erro ? null : dados;
        // Chama a função mostrarDados com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        mostrarDados();
        // Verifica a condição (ordem) carregarInteracoes();; só executa o trecho correspondente quando ela for verdadeira.
        if (ordem) carregarInteracoes();
    // Finaliza a função de retorno e a chamada que a recebeu.
    })
    // Continua a operação encadeada do objeto na linha anterior, chamando o método indicado.
    .catch(() => {
        // Atribui ou atualiza ordem com o resultado da expressão à direita do sinal =.
        ordem = null;
        // Chama a função mostrarDados com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        mostrarDados();
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
