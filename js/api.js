(() => {
    const pagina = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
    const liveServerOrigins = new Set([
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ]);
    if (window.location.protocol === 'file:') {
        window.location.replace(
            `http://127.0.0.1:3001/${pagina}${window.location.search}${window.location.hash}`
        );
        return;
    }
    if (liveServerOrigins.has(window.location.origin)) {
        window.location.replace(
            `${window.location.protocol}//${window.location.hostname}:3001/${pagina}${window.location.search}${window.location.hash}`
        );
        return;
    }

    window.apiFetch = (url, options = {}) => fetch(url, {
        ...options,
        credentials: 'include'
    }).catch(erro => {
        if (typeof url === 'string' && url.startsWith('/api/')) {
            const local = ['localhost', '127.0.0.1'].includes(window.location.hostname);
            const endereco = local ? 'http://localhost:3001' : 'o servidor do sistema';
            throw new Error(`Não foi possível conectar à API em ${endereco}. Inicie o Megabrain Services pelo arquivo Abrir Ordem Clara.bat e tente novamente.`);
        }
        throw erro;
    });
})();
