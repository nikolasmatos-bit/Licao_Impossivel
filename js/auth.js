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
// Declara rotulosPapel com const (referência que não pode ser reatribuída) e atribui {.
const rotulosPapel = {
    // Define a propriedade admin do objeto; o valor utilizado é 'Administração',.
    admin: 'Administração',
    // Define a propriedade funcionario do objeto; o valor utilizado é 'Equipe',.
    funcionario: 'Equipe',
    // Define a propriedade cliente do objeto; o valor utilizado é 'Área do cliente'.
    cliente: 'Área do cliente'
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
};

// Declara permissoesNav com const (referência que não pode ser reatribuída) e atribui {.
const permissoesNav = {
    // Completa a expressão/chamada JavaScript do bloco atual, utilizando os valores indicados na linha.
    'dashboard.html': ['admin', 'funcionario'],
    // Completa a expressão/chamada JavaScript do bloco atual, utilizando os valores indicados na linha.
    'cadastros.html': ['admin', 'funcionario'],
    // Completa a expressão/chamada JavaScript do bloco atual, utilizando os valores indicados na linha.
    'lista.html': ['admin', 'funcionario'],
    // Completa a expressão/chamada JavaScript do bloco atual, utilizando os valores indicados na linha.
    'tecnicos.html': ['admin'],
    // Completa a expressão/chamada JavaScript do bloco atual, utilizando os valores indicados na linha.
    'clientes.html': ['admin', 'funcionario'],
    // Completa a expressão/chamada JavaScript do bloco atual, utilizando os valores indicados na linha.
    'usuarios.html': ['admin'],
    // Completa a expressão/chamada JavaScript do bloco atual, utilizando os valores indicados na linha.
    'portal-cliente.html': ['cliente']
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
};

// Declara a função iniciarSessaoVisual; os parâmetros (nenhum) recebem dados quando ela é chamada. A função async pode aguardar tarefas assíncronas.
async function iniciarSessaoVisual() {
    // Espera o resultado assíncrono e o armazena em resposta; usa const (referência que não pode ser reatribuída).
    const resposta = await apiFetch('/api/auth/me');
    // Verifica a condição (!resposta.ok) {; só executa o trecho correspondente quando ela for verdadeira.
    if (!resposta.ok) {
        // Consulta ou altera a URL atual do navegador para navegação entre as telas.
        window.location.replace('/index.html');
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }

    // Converte o corpo da resposta HTTP de JSON para um objeto JavaScript.
    const { usuario } = await resposta.json();
    // Localiza no HTML o primeiro elemento que atende ao seletor e o guarda em navegacao; usa const (referência que não pode ser reatribuída).
    const navegacao = document.querySelector('nav');
    // Atribui ou atualiza document.body.dataset.role com o resultado da expressão à direita do sinal =.
    document.body.dataset.role = usuario.papel;

    // Percorre cada item da lista e executa a função fornecida para cada um.
    navegacao.querySelectorAll('a').forEach(link => {
        // Declara pagina com const (referência que não pode ser reatribuída) e atribui link.getAttribute('href').split('?')[0];.
        const pagina = link.getAttribute('href').split('?')[0];
        // Declara permitidos com const (referência que não pode ser reatribuída) e atribui permissoesNav[pagina];.
        const permitidos = permissoesNav[pagina];
        // Verifica a condição (permitidos && !permitidos.includes(usuario.papel)) link.remove();; só executa o trecho correspondente quando ela for verdadeira.
        if (permitidos && !permitidos.includes(usuario.papel)) link.remove();
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });

    // Verifica a condição (usuario.papel === 'admin') {; só executa o trecho correspondente quando ela for verdadeira.
    if (usuario.papel === 'admin') {
        // Verifica a condição (!navegacao.querySelector('a[href="usuarios.html"]')) {; só executa o trecho correspondente quando ela for verdadeira.
        if (!navegacao.querySelector('a[href="usuarios.html"]')) {
            // Cria um elemento HTML em memória e o guarda em linkUsuarios, para depois configurá-lo e inseri-lo na página.
            const linkUsuarios = document.createElement('a');
            // Define ou consulta o endereço de destino de um link.
            linkUsuarios.href = 'usuarios.html';
            // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
            linkUsuarios.textContent = 'Acessos';
            // Adiciona o elemento criado ao final do elemento pai no documento.
            navegacao.append(linkUsuarios);
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        }
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }

    // Verifica a condição (usuario.papel === 'cliente' && !location.pathname.endsWith('/portal-cliente.html')) {; só executa o trecho correspondente quando ela for verdadeira.
    if (usuario.papel === 'cliente' && !location.pathname.endsWith('/portal-cliente.html')) {
        // Substitui os filhos do elemento HTML, limpando ou atualizando seu conteúdo.
        navegacao.replaceChildren();
        // Cria um elemento HTML em memória e o guarda em linkPortal, para depois configurá-lo e inseri-lo na página.
        const linkPortal = document.createElement('a');
        // Define ou consulta o endereço de destino de um link.
        linkPortal.href = 'portal-cliente.html';
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        linkPortal.textContent = 'Meus atendimentos';
        // Adiciona o elemento criado ao final do elemento pai no documento.
        navegacao.append(linkPortal);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }

    // Percorre cada item da lista e executa a função fornecida para cada um.
    document.querySelectorAll('[data-roles]').forEach(elemento => {
        // Declara papeis com const (referência que não pode ser reatribuída) e atribui elemento.dataset.roles.split(/\s+/);.
        const papeis = elemento.dataset.roles.split(/\s+/);
        // Verifica se a lista ou o texto contém o valor pesquisado.
        elemento.hidden = !papeis.includes(usuario.papel);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });

    // Verifica a condição (usuario.papel === 'funcionario') {; só executa o trecho correspondente quando ela for verdadeira.
    if (usuario.papel === 'funcionario') {
        // Guarda em campoTecnico a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
        const campoTecnico = document.getElementById('tecnico');
        // Verifica a condição (campoTecnico) {; só executa o trecho correspondente quando ela for verdadeira.
        if (campoTecnico) {
            // Habilita ou desabilita um botão/campo conforme o estado do sistema.
            campoTecnico.disabled = true;
            // Define se o formulário deve exigir o preenchimento deste campo antes do envio.
            campoTecnico.required = false;
            // Oculta ou exibe um elemento da interface de acordo com a condição.
            campoTecnico.hidden = true;
            // Define um atributo HTML (inclusive os usados por acessibilidade e navegação).
            document.querySelector('label[for="tecnico"]')?.setAttribute('hidden', '');
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        }
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }

    // Verifica a condição (usuario.papel === 'cliente') {; só executa o trecho correspondente quando ela for verdadeira.
    if (usuario.papel === 'cliente') {
        // Guarda em canal a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
        const canal = document.getElementById('canal-interacao');
        // Verifica a condição (canal) {; só executa o trecho correspondente quando ela for verdadeira.
        if (canal) {
            // Substitui os filhos do elemento HTML, limpando ou atualizando seu conteúdo.
            canal.replaceChildren(new Option('Mensagem para a equipe', 'Atualização'));
            // Define um atributo HTML (inclusive os usados por acessibilidade e navegação).
            document.querySelector('label[for="canal-interacao"]')?.setAttribute('hidden', '');
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        }
        // Guarda em botaoWhatsApp a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
        const botaoWhatsApp = document.getElementById('preparar-whatsapp');
        // Verifica a condição (botaoWhatsApp) botaoWhatsApp.hidden = true;; só executa o trecho correspondente quando ela for verdadeira.
        if (botaoWhatsApp) botaoWhatsApp.hidden = true;
        // Localiza no HTML o primeiro elemento que atende ao seletor e o guarda em tituloHistorico; usa const (referência que não pode ser reatribuída).
        const tituloHistorico = document.querySelector('.conversation-section .section-heading h2');
        // Verifica a condição (tituloHistorico) tituloHistorico.textContent = 'Conversa com a equipe';; só executa o trecho correspondente quando ela for verdadeira.
        if (tituloHistorico) tituloHistorico.textContent = 'Conversa com a equipe';
        // Localiza no HTML o primeiro elemento que atende ao seletor e o guarda em ajudaHistorico; usa const (referência que não pode ser reatribuída).
        const ajudaHistorico = document.querySelector('.conversation-section .section-heading p');
        // Verifica a condição (ajudaHistorico) ajudaHistorico.textContent = 'Envie uma mensagem sobre este atendimento.';; só executa o trecho correspondente quando ela for verdadeira.
        if (ajudaHistorico) ajudaHistorico.textContent = 'Envie uma mensagem sobre este atendimento.';
        // Guarda em mensagem a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
        const mensagem = document.getElementById('mensagem-interacao');
        // Verifica a condição (mensagem) mensagem.placeholder = 'Escreva sua mensagem para a equipe...';; só executa o trecho correspondente quando ela for verdadeira.
        if (mensagem) mensagem.placeholder = 'Escreva sua mensagem para a equipe...';
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }

    // Localiza no HTML o primeiro elemento que atende ao seletor e o guarda em header; usa const (referência que não pode ser reatribuída).
    const header = document.querySelector('header');
    // Verifica a condição (!header || document.querySelector('.account-tools')) return;; só executa o trecho correspondente quando ela for verdadeira.
    if (!header || document.querySelector('.account-tools')) return;

    // Cria um elemento HTML em memória e o guarda em conta, para depois configurá-lo e inseri-lo na página.
    const conta = document.createElement('div');
    // Define a classe CSS que determina o visual do elemento.
    conta.className = 'account-tools';
    // Cria um elemento HTML em memória e o guarda em identidade, para depois configurá-lo e inseri-lo na página.
    const identidade = document.createElement('div');
    // Define a classe CSS que determina o visual do elemento.
    identidade.className = 'account-identity';
    // Cria um elemento HTML em memória e o guarda em nome, para depois configurá-lo e inseri-lo na página.
    const nome = document.createElement('strong');
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    nome.textContent = usuario.nome;
    // Cria um elemento HTML em memória e o guarda em papel, para depois configurá-lo e inseri-lo na página.
    const papel = document.createElement('span');
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    papel.textContent = rotulosPapel[usuario.papel] || 'Conta';
    // Adiciona o elemento criado ao final do elemento pai no documento.
    identidade.append(nome, papel);

    // Cria um elemento HTML em memória e o guarda em sair, para depois configurá-lo e inseri-lo na página.
    const sair = document.createElement('button');
    // Altera o tipo do campo HTML (por exemplo, entre senha oculta e texto visível).
    sair.type = 'button';
    // Define a classe CSS que determina o visual do elemento.
    sair.className = 'account-logout';
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    sair.textContent = 'Sair';
    // Registra uma função para reagir ao evento click (por exemplo, clique, envio ou digitação).
    sair.addEventListener('click', async () => {
        // Espera a operação assíncrona terminar antes de continuar com o resultado.
        await apiFetch('/api/auth/logout', { method: 'POST' });
        // Consulta ou altera a URL atual do navegador para navegação entre as telas.
        window.location.assign('/index.html');
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });

    // Adiciona o elemento criado ao final do elemento pai no documento.
    conta.append(identidade, sair);
    // Adiciona o elemento criado ao final do elemento pai no documento.
    header.append(conta);
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Consulta ou altera a URL atual do navegador para navegação entre as telas.
iniciarSessaoVisual().catch(() => window.location.replace('/index.html'));
