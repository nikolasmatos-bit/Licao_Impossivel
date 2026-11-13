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
// Guarda em loginForm a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const loginForm = document.getElementById('form-login');
// Guarda em setupForm a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const setupForm = document.getElementById('form-setup');
// Guarda em botaoCriarConta a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const botaoCriarConta = document.getElementById('botao-criar-conta');
// Guarda em botaoVoltarLogin a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const botaoVoltarLogin = document.getElementById('botao-voltar-login');
// Guarda em setupPapel a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const setupPapel = document.getElementById('setup-papel');
// Guarda em campoTelefone a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const campoTelefone = document.getElementById('campo-telefone');
// Guarda em setupTelefone a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
const setupTelefone = document.getElementById('setup-telefone');

// Declara sistemaConfigurado com let (variável que pode ser reatribuída) e atribui true;.
let sistemaConfigurado = true;

// --- ATUALIZA OS CAMPOS CONFORME O TIPO DE CONTA ---
// Declara a função atualizarTipoConta; os parâmetros (nenhum) recebem dados quando ela é chamada.
function atualizarTipoConta() {
    // Declara papel com const (referência que não pode ser reatribuída) e atribui setupPapel.value;.
    const papel = setupPapel.value;

    // Oculta ou exibe um elemento da interface de acordo com a condição.
    campoTelefone.hidden = papel !== 'cliente';

    // Ajusta o texto do botão
    // Declara botao com const (referência que não pode ser reatribuída) e atribui setupForm.querySelector('button[type="submit"]');.
    const botao = setupForm.querySelector('button[type="submit"]');
    // Verifica a condição (papel === 'admin') botao.textContent = 'Criar conta administradora';; só executa o trecho correspondente quando ela for verdadeira.
    if (papel === 'admin') botao.textContent = 'Criar conta administradora';
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    else botao.textContent = 'Criar conta de cliente';

    // Ajusta os títulos
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    document.getElementById('auth-title').textContent = 'Crie sua conta';
    // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
    document.getElementById('auth-description').textContent = 'Preencha os dados abaixo para criar o acesso.';
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função destinoDoPerfil; os parâmetros (papel) recebem dados quando ela é chamada.
function destinoDoPerfil(papel) {
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return papel === 'cliente' ? '/portal-cliente.html' : '/dashboard.html';
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função alternarFormulario; os parâmetros (modo) recebem dados quando ela é chamada.
function alternarFormulario(modo) {
    // Declara loginAtivo com const (referência que não pode ser reatribuída) e atribui modo === 'login';.
    const loginAtivo = modo === 'login';
    // Oculta ou exibe um elemento da interface de acordo com a condição.
    loginForm.hidden = !loginAtivo;
    // Oculta ou exibe um elemento da interface de acordo com a condição.
    setupForm.hidden = loginAtivo;
    // Verifica a condição (loginAtivo) {; só executa o trecho correspondente quando ela for verdadeira.
    if (loginAtivo) {
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('auth-title').textContent = 'Entrar no sistema';
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        document.getElementById('auth-description').textContent = 'Use o e-mail e a senha da sua conta.';
        // Chama a função document.getElementById com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        document.getElementById('email').focus();
    // Executa o caminho alternativo caso a condição anterior não seja atendida.
    } else {
        // Chama a função atualizarTipoConta com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        atualizarTipoConta();
        // Chama a função document.getElementById com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        document.getElementById('admin-nome').focus();
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função mostrarCriacaoConta; os parâmetros (nenhum) recebem dados quando ela é chamada.
function mostrarCriacaoConta() {
    // Oculta ou exibe um elemento da interface de acordo com a condição.
    botaoCriarConta.hidden = false;
    // Lê ou atualiza o valor de um campo do formulário.
    setupPapel.value = sistemaConfigurado ? 'cliente' : 'admin';
    // Chama a função alternarFormulario com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    alternarFormulario('cadastro');
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função enviar; os parâmetros (url, dados) recebem dados quando ela é chamada. A função async pode aguardar tarefas assíncronas.
async function enviar(url, dados) {
    // Espera o resultado assíncrono e o armazena em resposta; usa const (referência que não pode ser reatribuída).
    const resposta = await apiFetch(url, {
        // Define a propriedade method do objeto; o valor utilizado é 'POST',.
        method: 'POST',
        // Define a propriedade headers do objeto; o valor utilizado é { 'Content-Type': 'application/json' },.
        headers: { 'Content-Type': 'application/json' },
        // Serializa dados JavaScript para texto JSON, usado no corpo da requisição.
        body: JSON.stringify(dados)
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
    // Espera o resultado assíncrono e o armazena em resultado; usa const (referência que não pode ser reatribuída).
    const resultado = await resposta.json().catch(() => null);
    // Verifica a condição (!resposta.ok) {; só executa o trecho correspondente quando ela for verdadeira.
    if (!resposta.ok) {
        // Lança uma exceção para que o erro seja tratado por um bloco catch ou pelo chamador.
        throw new Error(resultado?.erro || `O servidor retornou HTTP ${resposta.status}.`);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
    // Verifica a condição (!resultado) throw new Error('O servidor respondeu em um formato inesperado.');; só executa o trecho correspondente quando ela for verdadeira.
    if (!resultado) throw new Error('O servidor respondeu em um formato inesperado.');
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return resultado;
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// --- EVENTOS ---
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

// Registra uma função para reagir ao evento click (por exemplo, clique, envio ou digitação).
botaoCriarConta.addEventListener('click', mostrarCriacaoConta);
// Registra uma função para reagir ao evento click (por exemplo, clique, envio ou digitação).
botaoVoltarLogin.addEventListener('click', () => alternarFormulario('login'));
// Registra uma função para reagir ao evento change (por exemplo, clique, envio ou digitação).
setupPapel.addEventListener('change', atualizarTipoConta);

// Registra uma função para reagir ao evento submit (por exemplo, clique, envio ou digitação).
loginForm.addEventListener('submit', async event => {
    // Impede o comportamento padrão do formulário/evento, evitando o recarregamento imediato da página.
    event.preventDefault();
    // Declara botao com const (referência que não pode ser reatribuída) e atribui loginForm.querySelector('button[type="submit"]');.
    const botao = loginForm.querySelector('button[type="submit"]');
    // Guarda em mensagem a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
    const mensagem = document.getElementById('mensagem-login');
    // Habilita ou desabilita um botão/campo conforme o estado do sistema.
    botao.disabled = true;
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Espera o resultado assíncrono e o armazena em resultado; usa const (referência que não pode ser reatribuída).
        const resultado = await enviar('/api/auth/login', {
            // Define a propriedade email do objeto; o valor utilizado é document.getElementById('email').value,.
            email: document.getElementById('email').value,
            // Define a propriedade senha do objeto; o valor utilizado é document.getElementById('senha').value.
            senha: document.getElementById('senha').value
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        });
        // Consulta ou altera a URL atual do navegador para navegação entre as telas.
        window.location.assign(destinoDoPerfil(resultado.usuario.papel));
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch (erro) {
        // Mostra feedback de sucesso ou erro no elemento de mensagem da tela.
        Utils.mostrarMensagem(mensagem, 'erro', erro.message);
    // Executa a limpeza mesmo se a operação anterior tiver apresentado erro.
    } finally {
        // Habilita ou desabilita um botão/campo conforme o estado do sistema.
        botao.disabled = false;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Registra uma função para reagir ao evento submit (por exemplo, clique, envio ou digitação).
setupForm.addEventListener('submit', async event => {
    // Impede o comportamento padrão do formulário/evento, evitando o recarregamento imediato da página.
    event.preventDefault();
    // Declara botao com const (referência que não pode ser reatribuída) e atribui setupForm.querySelector('button[type="submit"]');.
    const botao = setupForm.querySelector('button[type="submit"]');
    // Guarda em mensagem a referência a um elemento HTML encontrado pelo seu id; usa const (referência que não pode ser reatribuída).
    const mensagem = document.getElementById('mensagem-setup');
    // Habilita ou desabilita um botão/campo conforme o estado do sistema.
    botao.disabled = true;
    // Inicia a tentativa de uma operação que poderá gerar uma exceção.
    try {
        // Declara payload com const (referência que não pode ser reatribuída) e atribui {.
        const payload = {
            // Define a propriedade nome do objeto; o valor utilizado é document.getElementById('admin-nome').value,.
            nome: document.getElementById('admin-nome').value,
            // Define a propriedade email do objeto; o valor utilizado é document.getElementById('admin-email').value,.
            email: document.getElementById('admin-email').value,
            // Define a propriedade senha do objeto; o valor utilizado é document.getElementById('admin-senha').value,.
            senha: document.getElementById('admin-senha').value,
            // Define a propriedade papel do objeto; o valor utilizado é setupPapel.value.
            papel: setupPapel.value
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        };

        // Verifica a condição (payload.papel === 'cliente') {; só executa o trecho correspondente quando ela for verdadeira.
        if (payload.papel === 'cliente') {
            // Lê ou atualiza o valor de um campo do formulário.
            payload.telefone = setupTelefone.value.trim();
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        }

        // Espera o resultado assíncrono e o armazena em resultado; usa const (referência que não pode ser reatribuída).
        const resultado = await enviar(sistemaConfigurado ? '/api/auth/register' : '/api/auth/setup', payload);
        // Consulta ou altera a URL atual do navegador para navegação entre as telas.
        window.location.assign(destinoDoPerfil(resultado.usuario.papel));
    // Captura a falha da operação anterior para tratar o erro sem encerrar inesperadamente o programa.
    } catch (erro) {
        // Mostra feedback de sucesso ou erro no elemento de mensagem da tela.
        Utils.mostrarMensagem(mensagem, 'erro', erro.message);
    // Executa a limpeza mesmo se a operação anterior tiver apresentado erro.
    } finally {
        // Habilita ou desabilita um botão/campo conforme o estado do sistema.
        botao.disabled = false;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
});

// Primeiro acesso cria somente o administrador; depois, a página pública cria clientes.
// Chama a função compartilhada que envia a solicitação HTTP autenticada para esta rota da API.
apiFetch('/api/auth/status').then(async resposta => {
    // Verifica a condição (!resposta.ok) throw new Error('Não foi possível verificar a configuração do sistema.');; só executa o trecho correspondente quando ela for verdadeira.
    if (!resposta.ok) throw new Error('Não foi possível verificar a configuração do sistema.');
    // Espera o resultado assíncrono e o armazena em status; usa const (referência que não pode ser reatribuída).
    const status = await resposta.json();
    // Atribui ou atualiza sistemaConfigurado com o resultado da expressão à direita do sinal =.
    sistemaConfigurado = status.configurado;
    // Declara admin com const (referência que não pode ser reatribuída) e atribui setupPapel.querySelector('option[value="admin"]');.
    const admin = setupPapel.querySelector('option[value="admin"]');
    // Declara cliente com const (referência que não pode ser reatribuída) e atribui setupPapel.querySelector('option[value="cliente"]');.
    const cliente = setupPapel.querySelector('option[value="cliente"]');
    // Habilita ou desabilita um botão/campo conforme o estado do sistema.
    admin.disabled = sistemaConfigurado;
    // Habilita ou desabilita um botão/campo conforme o estado do sistema.
    cliente.disabled = !sistemaConfigurado;
    // Lê ou atualiza o valor de um campo do formulário.
    setupPapel.value = sistemaConfigurado ? 'cliente' : 'admin';
    // Habilita ou desabilita um botão/campo conforme o estado do sistema.
    setupPapel.disabled = true;
    // Verifica a condição (!sistemaConfigurado) mostrarCriacaoConta();; só executa o trecho correspondente quando ela for verdadeira.
    if (!sistemaConfigurado) mostrarCriacaoConta();
// Finaliza a função de retorno e a chamada que a recebeu.
}).catch(erro => Utils.mostrarMensagem(document.getElementById('mensagem-login'), 'erro', erro.message));
// Oculta ou exibe um elemento da interface de acordo com a condição.
loginForm.hidden = false;
// Oculta ou exibe um elemento da interface de acordo com a condição.
setupForm.hidden = true;
// Finaliza a função de retorno e a chamada que a recebeu.
})();
