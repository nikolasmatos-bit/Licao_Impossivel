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
const form = document.getElementById('form-usuario');
// Guarda em mensagem a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const mensagem = document.getElementById('mensagem-usuario');
// Guarda em papelSelect a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const papelSelect = document.getElementById('papel');
// Guarda em blocoCliente a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const blocoCliente = document.getElementById('bloco-cliente');
// Guarda em blocoTecnico a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const blocoTecnico = document.getElementById('bloco-tecnico');
// Guarda em clienteSelect a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const clienteSelect = document.getElementById('cliente-id');
// Guarda em tecnicoSelect a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const tecnicoSelect = document.getElementById('tecnico-id');
// Guarda em btnCriar a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const btnCriar = document.getElementById('btn-criar');

// Guarda em tabela a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const tabela = document.getElementById('lista-usuarios');
// Guarda em pesquisa a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const pesquisa = document.getElementById('pesquisa-usuarios');
// Guarda em vazio a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const vazio = document.getElementById('vazio-usuarios');
// Declara todosUsuarios com let (variável que pode ser reatribuída) e atribui [];.
let todosUsuarios = [];

// --- LÓGICA DO FORMULÁRIO (CRIAR CONTA) ---
// Percorre cada item da lista e executa a função fornecida para cada um.
document.querySelectorAll('[data-password-target]').forEach(botao => {
    // Registra uma função para reagir ao evento click (por exemplo, clique, envio ou digitação).
    botao.addEventListener('click', () => {
        // Guarda em campo a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
        const campo = document.getElementById(botao.dataset.passwordTarget);
        // Declara mostrar com const (referência que não pode ser reatribuída) e atribui campo.type === 'password';.
        const mostrar = campo.type === 'password';
        // Altera o tipo do campo HTML (por exemplo, entre senha oculta e texto visível).
        campo.type = mostrar ? 'text' : 'password';
        // Define um atributo HTML (inclusive os usados por acessibilidade e navegação).
        botao.setAttribute('aria-pressed', String(mostrar));
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        botao.textContent = mostrar ? 'Ocultar' : 'Mostrar';
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Declara a função atualizarCamposPapel; os parâmetros (nenhum) recebem dados quando ela é chamada.
function atualizarCamposPapel() {
    // Declara papel com const (referência que não pode ser reatribuída) e atribui papelSelect.value;.
    const papel = papelSelect.value;
    // Oculta ou exibe um elemento da interface de acordo com a condição.
    blocoCliente.hidden = papel !== 'cliente';
    // Oculta ou exibe um elemento da interface de acordo com a condição.
    blocoTecnico.hidden = papel !== 'funcionario';
    // Define se o formulário deve exigir o preenchimento deste campo antes do envio.
    clienteSelect.required = papel === 'cliente';
    // Define se o formulário deve exigir o preenchimento deste campo antes do envio.
    tecnicoSelect.required = false; // Técnico agora é opcional para funcionário
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função carregaSelecoes; os parâmetros (nenhum) recebem dados quando ela é chamada. A função async pode aguardar tarefas assíncronas.
async function carregaSelecoes() {
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Extrai os elementos do array em variáveis separadas; Promise.all permite aguardar requisições simultâneas quando usado.
        const [rClientes, rTecnicos] = await Promise.all([
            // Chama a função compartilhada que envia a solicitação HTTP autenticada para esta rota da API.
            apiFetch('/api/clientes'), apiFetch('/api/tecnicos')
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        ]);
        // Espera o resultado assíncrono e o armazena em clientes; usa const (referência que não pode ser reatribuída).
        const clientes = await rClientes.json();
        // Espera o resultado assíncrono e o armazena em tecnicos; usa const (referência que não pode ser reatribuída).
        const tecnicos = await rTecnicos.json();

        // Atualiza o HTML interno do elemento; dados externos devem ser escapados antes de entrar nessa marcação.
        clienteSelect.innerHTML = '<option value="">Selecione o cliente</option>';
        // Percorre cada item da lista e executa a função fornecida para cada um.
        clientes.forEach(c => {
            // Cria um elemento HTML em memória e o guarda em opt, para depois configurá-lo e inseri-lo na página.
            const opt = document.createElement('option');
            // Lê ou atualiza o valor de um campo do formulário.
            opt.value = c.id;
            // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
            opt.textContent = c.nome;
            // Adiciona o elemento criado ao final do elemento pai no documento.
            clienteSelect.appendChild(opt);
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        });

        // Atualiza o HTML interno do elemento; dados externos devem ser escapados antes de entrar nessa marcação.
        tecnicoSelect.innerHTML = '<option value="">Nenhum (Vincular depois)</option>';
        // Percorre cada item da lista e executa a função fornecida para cada um.
        tecnicos.forEach(t => {
            // Cria um elemento HTML em memória e o guarda em opt, para depois configurá-lo e inseri-lo na página.
            const opt = document.createElement('option');
            // Lê ou atualiza o valor de um campo do formulário.
            opt.value = t.id;
            // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
            opt.textContent = t.nome;
            // Adiciona o elemento criado ao final do elemento pai no documento.
            tecnicoSelect.appendChild(opt);
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        });
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch (e) {
        // Mostra feedback de sucesso ou erro no elemento de mensagem da tela.
        Utils.mostrarMensagem(mensagem, 'erro', 'Erro ao carregar clientes/técnicos.');
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Registra uma função para reagir ao evento change (por exemplo, clique, envio ou digitação).
papelSelect.addEventListener('change', atualizarCamposPapel);

// Registra uma função para reagir ao evento submit (por exemplo, clique, envio ou digitação).
form.addEventListener('submit', async event => {
    // Impede o comportamento padrão do formulário/evento, evitando o recarregamento imediato da página.
    event.preventDefault();
    // Declara payload com const (referência que não pode ser reatribuída) e atribui {.
    const payload = {
        // Define a propriedade nome do objeto; o valor utilizado é document.getElementById('nome').value.trim(),.
        nome: document.getElementById('nome').value.trim(),
        // Define a propriedade email do objeto; o valor utilizado é document.getElementById('email').value.trim(),.
        email: document.getElementById('email').value.trim(),
        // Define a propriedade senha do objeto; o valor utilizado é document.getElementById('senha').value,.
        senha: document.getElementById('senha').value,
        // Define a propriedade papel do objeto; o valor utilizado é papelSelect.value.
        papel: papelSelect.value
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    };
    // Verifica a condição (payload.papel === 'cliente') payload.cliente_id = Number(clienteSelect.value);; só executa o trecho correspondente quando ela for verdadeira.
    if (payload.papel === 'cliente') payload.cliente_id = Number(clienteSelect.value);
    // Verifica a condição (payload.papel === 'funcionario' && tecnicoSelect.value) {; só executa o trecho correspondente quando ela for verdadeira.
    if (payload.papel === 'funcionario' && tecnicoSelect.value) {
        // Lê ou atualiza o valor de um campo do formulário.
        payload.tecnico_id = Number(tecnicoSelect.value);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
    // Verifica a condição (payload.papel !== 'admin' && !payload.cliente_id && !payload.tecnico_id && payload.papel === '…; só executa o trecho correspondente quando ela for verdadeira.
    if (payload.papel !== 'admin' && !payload.cliente_id && !payload.tecnico_id && payload.papel === 'cliente') {
        // Mostra feedback de sucesso ou erro no elemento de mensagem da tela.
        Utils.mostrarMensagem(mensagem, 'erro', 'Selecione o cliente.');
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }

    // Espera a operação assíncrona terminar antes de continuar com o resultado.
    await Utils.comCarregando(btnCriar, async () => {
        // Inicia a tentativa de uma operação que poderá gerar uma exceção.
        try {
            // Espera o resultado assíncrono e o armazena em resposta; usa const (referência que não pode ser reatribuída).
            const resposta = await apiFetch('/api/usuarios', {
                // Define a propriedade method do objeto; o valor utilizado é 'POST',.
                method: 'POST',
                // Define a propriedade headers do objeto; o valor utilizado é { 'Content-Type': 'application/json' },.
                headers: { 'Content-Type': 'application/json' },
                // Serializa dados JavaScript para texto JSON, usado no corpo da requisição.
                body: JSON.stringify(payload)
            // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
            });
            // Espera o resultado assíncrono e o armazena em dados; usa const (referência que não pode ser reatribuída).
            const dados = await resposta.json();
            // Verifica a condição (!resposta.ok) throw new Error(dados.erro || 'Erro ao criar conta.');; só executa o trecho correspondente quando ela for verdadeira.
            if (!resposta.ok) throw new Error(dados.erro || 'Erro ao criar conta.');

            // Mostra feedback de sucesso ou erro no elemento de mensagem da tela.
            Utils.mostrarMensagem(mensagem, 'sucesso', 'Conta criada com sucesso!');
            // Limpa os campos do formulário e restaura seus valores iniciais.
            form.reset();
            // Chama a função atualizarCamposPapel com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
            atualizarCamposPapel();
            // Chama a função carregarUsuarios com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
            carregarUsuarios(); // Recarrega a tabela
        // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
        } catch (erro) {
            // Mostra feedback de sucesso ou erro no elemento de mensagem da tela.
            Utils.mostrarMensagem(mensagem, 'erro', erro.message);
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        }
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// --- LÓGICA DA TABELA (SUSPENDER / REATIVAR) ---
// Declara a função renderizarUsuarios; os parâmetros (nenhum) recebem dados quando ela é chamada.
function renderizarUsuarios() {
    // Declara termo com const (referência que não pode ser reatribuída) e atribui pesquisa.value.trim().toLowerCase();.
    const termo = pesquisa.value.trim().toLowerCase();
    // Define filtrados com uma função de seta ou com uma expressão; usa const (referência que não pode ser reatribuída).
    const filtrados = todosUsuarios.filter(u => 
        // Verifica se a lista ou o texto contém o valor pesquisado.
        u.nome.toLowerCase().includes(termo) || u.email.toLowerCase().includes(termo)
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    );

    // Atualiza o HTML interno do elemento; dados externos devem ser escapados antes de entrar nessa marcação.
    tabela.innerHTML = '';
    // Percorre cada item da lista e executa a função fornecida para cada um.
    filtrados.forEach(u => {
        // Cria um elemento HTML em memória e o guarda em tr, para depois configurá-lo e inseri-lo na página.
        const tr = document.createElement('tr');

        // Nome e E-mail
        // Atualiza o HTML interno do elemento; dados externos devem ser escapados antes de entrar nessa marcação.
        tr.innerHTML = `
            <td><strong>${Utils.escapeHTML(u.nome)}</strong></td>
            <td>${Utils.escapeHTML(u.email)}</td>
            <td><span class="badge">${u.papel}</span></td>
            <td>${Utils.escapeHTML(u.cliente || u.tecnico || '—')}</td>
        `;

        // Status
        // Cria um elemento HTML em memória e o guarda em tdStatus, para depois configurá-lo e inseri-lo na página.
        const tdStatus = document.createElement('td');
        // Cria um elemento HTML em memória e o guarda em badgeStatus, para depois configurá-lo e inseri-lo na página.
        const badgeStatus = document.createElement('span');
        // Define a classe CSS que determina o visual do elemento.
        badgeStatus.className = 'badge ' + (u.ativo ? 'status-concluida' : 'status-cancelada');
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        badgeStatus.textContent = u.ativo ? 'Ativo' : 'Suspenso';
        // Adiciona o elemento criado ao final do elemento pai no documento.
        tdStatus.appendChild(badgeStatus);
        // Adiciona o elemento criado ao final do elemento pai no documento.
        tr.appendChild(tdStatus);

        // Ações
        // Cria um elemento HTML em memória e o guarda em tdAcoes, para depois configurá-lo e inseri-lo na página.
        const tdAcoes = document.createElement('td');
        // Cria um elemento HTML em memória e o guarda em btnStatus, para depois configurá-lo e inseri-lo na página.
        const btnStatus = document.createElement('button');
        // Define a classe CSS que determina o visual do elemento.
        btnStatus.className = 'button ' + (u.ativo ? 'botao-cancelar' : 'button-primary');
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        btnStatus.textContent = u.ativo ? 'Suspender' : 'Reativar';
        // Ajusta diretamente a propriedade visual padding do elemento, sem modificar o CSS do arquivo.
        btnStatus.style.padding = '4px 12px';

        // Registra uma função para reagir ao evento click (por exemplo, clique, envio ou digitação).
        btnStatus.addEventListener('click', () => {
            // Declara acao com const (referência que não pode ser reatribuída) e atribui u.ativo ? 'suspender' : 'reativar';.
            const acao = u.ativo ? 'suspender' : 'reativar';
            // Verifica a condição (confirm(`Tem certeza que deseja ${acao} a conta de ${u.nome}?`)) {; só executa o trecho correspondente quando ela for verdadeira.
            if (confirm(`Tem certeza que deseja ${acao} a conta de ${u.nome}?`)) {
                // Chama a função alterarStatus com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
                alterarStatus(u.id, !u.ativo, btnStatus);
            // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
            }
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        });
        // Adiciona o elemento criado ao final do elemento pai no documento.
        tdAcoes.appendChild(btnStatus);
        // Adiciona o elemento criado ao final do elemento pai no documento.
        tr.appendChild(tdAcoes);

        // Adiciona o elemento criado ao final do elemento pai no documento.
        tabela.appendChild(tr);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });

    // Oculta ou exibe um elemento da interface de acordo com a condição.
    vazio.hidden = filtrados.length > 0;
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    document.getElementById('resultado-usuarios').textContent = `${filtrados.length} conta(s) encontrada(s)`;
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função alterarStatus; os parâmetros (id, novoStatus, botao) recebem dados quando ela é chamada. A função async pode aguardar tarefas assíncronas.
async function alterarStatus(id, novoStatus, botao) {
    // Espera a operação assíncrona terminar antes de continuar com o resultado.
    await Utils.comCarregando(botao, async () => {
        // Inicia a tentativa de uma operação que poderá gerar uma exceção.
        try {
            // Espera o resultado assíncrono e o armazena em resposta; usa const (referência que não pode ser reatribuída).
            const resposta = await apiFetch(`/api/usuarios/${id}/status`, {
                // Define a propriedade method do objeto; o valor utilizado é 'PATCH',.
                method: 'PATCH',
                // Define a propriedade headers do objeto; o valor utilizado é { 'Content-Type': 'application/json' },.
                headers: { 'Content-Type': 'application/json' },
                // Serializa dados JavaScript para texto JSON, usado no corpo da requisição.
                body: JSON.stringify({ ativo: novoStatus })
            // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
            });
            // Espera o resultado assíncrono e o armazena em dados; usa const (referência que não pode ser reatribuída).
            const dados = await resposta.json();
            // Verifica a condição (!resposta.ok) throw new Error(dados.erro || 'Erro ao alterar status.');; só executa o trecho correspondente quando ela for verdadeira.
            if (!resposta.ok) throw new Error(dados.erro || 'Erro ao alterar status.');

            // Atualiza a lista local e a tabela
            // Define usuario com uma função de seta ou com uma expressão; usa const (referência que não pode ser reatribuída).
            const usuario = todosUsuarios.find(u => u.id === id);
            // Verifica a condição (usuario) usuario.ativo = novoStatus;; só executa o trecho correspondente quando ela for verdadeira.
            if (usuario) usuario.ativo = novoStatus;
            // Chama a função renderizarUsuarios com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
            renderizarUsuarios();
        // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
        } catch (erro) {
            // Abre uma mensagem de aviso no navegador para exibir o erro ou a informação.
            alert(erro.message);
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        }
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função carregarUsuarios; os parâmetros (nenhum) recebem dados quando ela é chamada. A função async pode aguardar tarefas assíncronas.
async function carregarUsuarios() {
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Espera o resultado assíncrono e o armazena em resposta; usa const (referência que não pode ser reatribuída).
        const resposta = await apiFetch('/api/usuarios');
        // Converte o corpo da resposta HTTP de JSON para um objeto JavaScript.
        todosUsuarios = await resposta.json();
        // Chama a função renderizarUsuarios com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        renderizarUsuarios();
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch (erro) {
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('resultado-usuarios').textContent = 'Erro ao carregar contas.';
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Registra uma função para reagir ao evento input (por exemplo, clique, envio ou digitação).
pesquisa.addEventListener('input', renderizarUsuarios);

// Inicialização
// Chama a função atualizarCamposPapel com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
atualizarCamposPapel();
// Chama a função carregaSelecoes com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
carregaSelecoes();
// Chama a função carregarUsuarios com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
carregarUsuarios();
