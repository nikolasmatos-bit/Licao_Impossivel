// Helpers compartilhados pelas páginas do sistema.
window.Utils = {
    numeroWhatsApp(valor) {
        const numero = String(valor ?? '').replace(/\D/g, '');
        if (/^\d{10,11}$/.test(numero)) return `55${numero}`;
        if (/^55\d{10,11}$/.test(numero)) return numero;
        return '';
    },
    dataUTC(valor) {
        if (!valor) return null;
        let data = String(valor).trim().replace(' ', 'T');
        if (!/(?:Z|[+-]\d{2}:?\d{2})$/i.test(data)) data += 'Z';
        const resultado = new Date(data);
        return Number.isNaN(resultado.getTime()) ? null : resultado;
    },
    formatarData(valor) {
        return this.dataUTC(valor)?.toLocaleDateString('pt-BR') || '—';
    },
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
