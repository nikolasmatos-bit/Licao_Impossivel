const rotulosPapel = {
    admin: 'Administração',
    funcionario: 'Equipe',
    cliente: 'Área do cliente'
};

const permissoesNav = {
    'dashboard.html': ['admin', 'funcionario'],
    'cadastros.html': ['admin', 'funcionario'],
    'lista.html': ['admin', 'funcionario'],
    'tecnicos.html': ['admin'],
    'clientes.html': ['admin', 'funcionario'],
    'usuarios.html': ['admin'],
    'portal-cliente.html': ['cliente']
};

async function iniciarSessaoVisual() {
    const resposta = await apiFetch('/api/auth/me');
    if (!resposta.ok) {
        window.location.replace('/index.html');
        return;
    }

    const { usuario } = await resposta.json();
    const navegacao = document.querySelector('nav');
    document.body.dataset.role = usuario.papel;

    navegacao.querySelectorAll('a').forEach(link => {
        const pagina = link.getAttribute('href').split('?')[0];
        const permitidos = permissoesNav[pagina];
        if (permitidos && !permitidos.includes(usuario.papel)) link.remove();
    });

    if (usuario.papel === 'admin') {
        if (!navegacao.querySelector('a[href="usuarios.html"]')) {
            const linkUsuarios = document.createElement('a');
            linkUsuarios.href = 'usuarios.html';
            linkUsuarios.textContent = 'Acessos';
            navegacao.append(linkUsuarios);
        }
    }

    if (usuario.papel === 'cliente' && !location.pathname.endsWith('/portal-cliente.html')) {
        navegacao.replaceChildren();
        const linkPortal = document.createElement('a');
        linkPortal.href = 'portal-cliente.html';
        linkPortal.textContent = 'Meus atendimentos';
        navegacao.append(linkPortal);
    }

    document.querySelectorAll('[data-roles]').forEach(elemento => {
        const papeis = elemento.dataset.roles.split(/\s+/);
        elemento.hidden = !papeis.includes(usuario.papel);
    });

    if (usuario.papel === 'funcionario') {
        const campoTecnico = document.getElementById('tecnico');
        if (campoTecnico) {
            campoTecnico.disabled = true;
            campoTecnico.required = false;
            campoTecnico.hidden = true;
            document.querySelector('label[for="tecnico"]')?.setAttribute('hidden', '');
        }
    }

    if (usuario.papel === 'cliente') {
        const canal = document.getElementById('canal-interacao');
        if (canal) {
            canal.replaceChildren(new Option('Mensagem para a equipe', 'Atualização'));
            document.querySelector('label[for="canal-interacao"]')?.setAttribute('hidden', '');
        }
        const botaoWhatsApp = document.getElementById('preparar-whatsapp');
        if (botaoWhatsApp) botaoWhatsApp.hidden = true;
        const tituloHistorico = document.querySelector('.conversation-section .section-heading h2');
        if (tituloHistorico) tituloHistorico.textContent = 'Conversa com a equipe';
        const ajudaHistorico = document.querySelector('.conversation-section .section-heading p');
        if (ajudaHistorico) ajudaHistorico.textContent = 'Envie uma mensagem sobre este atendimento.';
        const mensagem = document.getElementById('mensagem-interacao');
        if (mensagem) mensagem.placeholder = 'Escreva sua mensagem para a equipe...';
    }

    const header = document.querySelector('header');
    if (!header || document.querySelector('.account-tools')) return;

    const conta = document.createElement('div');
    conta.className = 'account-tools';
    const identidade = document.createElement('div');
    identidade.className = 'account-identity';
    const nome = document.createElement('strong');
    nome.textContent = usuario.nome;
    const papel = document.createElement('span');
    papel.textContent = rotulosPapel[usuario.papel] || 'Conta';
    identidade.append(nome, papel);

    const sair = document.createElement('button');
    sair.type = 'button';
    sair.className = 'account-logout';
    sair.textContent = 'Sair';
    sair.addEventListener('click', async () => {
        await apiFetch('/api/auth/logout', { method: 'POST' });
        window.location.assign('/index.html');
    });

    conta.append(identidade, sair);
    header.append(conta);
}

iniciarSessaoVisual().catch(() => window.location.replace('/index.html'));
