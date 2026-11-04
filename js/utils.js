// Helpers usados pela página de administração de usuários.
window.Utils = {
    mostrarMensagem(elemento, tipo, mensagem) {
        elemento.className = `mensagem ${tipo}`;
        elemento.textContent = mensagem;
    },
    async comCarregando(botao, operacao) {
        const desabilitadoAntes = botao.disabled;
        botao.disabled = true;
        try { return await operacao(); }
        finally { botao.disabled = desabilitadoAntes; }
    },
    escapeHTML(valor) {
        return String(valor ?? '').replace(/[&<>"']/g, caractere => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[caractere]);
    }
};
