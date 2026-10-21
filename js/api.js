(() => {
    const localHosts = new Set(['localhost', '127.0.0.1']);
    const liveServerOrigins = new Set([
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ]);
    const usarServidorNode = liveServerOrigins.has(window.location.origin);
    if (usarServidorNode) {
        const pagina = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
        window.location.replace(
            `${window.location.protocol}//${window.location.hostname}:3001/${pagina}${window.location.search}${window.location.hash}`
        );
        return;
    }

    const apiOrigin = usarServidorNode
        ? `${window.location.protocol}//${window.location.hostname}:3001`
        : '';

    window.apiFetch = (url, options = {}) => {
        const destino = typeof url === 'string' && url.startsWith('/api/')
            ? `${apiOrigin}${url}`
            : url;
        const configuracao = { ...options, credentials: 'include' };

        return fetch(destino, configuracao).catch(erro => {
            if (typeof url === 'string' && url.startsWith('/api/')) {
                const local = localHosts.has(window.location.hostname);
                const endereco = local ? 'http://localhost:3001' : 'o servidor do sistema';
                throw new Error(`Não foi possível conectar à API em ${endereco}. Inicie o Megabrain Services pelo arquivo Abrir Ordem Clara.bat e tente novamente.`);
            }
            throw erro;
        });
    };
})();
