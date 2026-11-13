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
// Helpers compartilhados pelas páginas do sistema.
// Atribui ou atualiza window.Utils com o resultado da expressão à direita do sinal =.
window.Utils = {
    // Chama a função classeStatus com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    classeStatus(status) {
        // Escolhe uma entre várias ações de acordo com o valor informado.
        switch (status) {
            // Trata este valor específico no switch: case 'Em execução': return 'andamento';.
            case 'Em execução': return 'andamento';
            // Trata este valor específico no switch: case 'Concluída': return 'concluida';.
            case 'Concluída': return 'concluida';
            // Trata este valor específico no switch: case 'Cancelada': return 'cancelada';.
            case 'Cancelada': return 'cancelada';
            // Trata os valores que não corresponderam a nenhum case anterior.
            default: return 'aberta';
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        }
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    },
    // Chama a função numeroWhatsApp com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    numeroWhatsApp(valor) {
        // Declara numero com const (referência que não pode ser reatribuída) e atribui String(valor ?? '').replace(/\D/g, '');.
        const numero = String(valor ?? '').replace(/\D/g, '');
        // Verifica a condição (/^\d{10,11}$/.test(numero)) return `55${numero}`;; só executa o trecho correspondente quando ela for verdadeira.
        if (/^\d{10,11}$/.test(numero)) return `55${numero}`;
        // Verifica a condição (/^55\d{10,11}$/.test(numero)) return numero;; só executa o trecho correspondente quando ela for verdadeira.
        if (/^55\d{10,11}$/.test(numero)) return numero;
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return '';
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    },
    // Chama a função dataUTC com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    dataUTC(valor) {
        // Verifica a condição (!valor) return null;; só executa o trecho correspondente quando ela for verdadeira.
        if (!valor) return null;
        // Declara data com let (variável que pode ser reatribuída) e atribui String(valor).trim().replace(' ', 'T');.
        let data = String(valor).trim().replace(' ', 'T');
        // Verifica a condição (!/(?:Z|[+-]\d{2}:?\d{2})$/i.test(data)) data += 'Z';; só executa o trecho correspondente quando ela for verdadeira.
        if (!/(?:Z|[+-]\d{2}:?\d{2})$/i.test(data)) data += 'Z';
        // Cria uma nova instância e a armazena em resultado; usa const (referência que não pode ser reatribuída).
        const resultado = new Date(data);
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return Number.isNaN(resultado.getTime()) ? null : resultado;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    },
    // Chama a função formatarData com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    formatarData(valor) {
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return this.dataUTC(valor)?.toLocaleDateString('pt-BR') || '—';
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    },
    // Chama a função mostrarMensagem com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    mostrarMensagem(elemento, tipo, mensagem) {
        // Define a classe CSS que determina o visual do elemento.
        elemento.className = `mensagem ${tipo}`;
        // Lê ou define texto visível no HTML de maneira segura, sem interpretar tags como código.
        elemento.textContent = mensagem;
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    },
    // Completa a expressão/chamada JavaScript do bloco atual, utilizando os valores indicados na linha.
    async comCarregando(botao, operacao) {
        // Declara desabilitadoAntes com const (referência que não pode ser reatribuída) e atribui botao.disabled;.
        const desabilitadoAntes = botao.disabled;
        // Habilita ou desabilita um botão/campo conforme o estado do sistema.
        botao.disabled = true;
        // Inicia a tentativa de uma operação que poderá gerar uma exceção.
        try { return await operacao(); }
        // Define uma etapa de limpeza que sempre será executada.
        finally { botao.disabled = desabilitadoAntes; }
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    },
    // Chama a função escapeHTML com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    escapeHTML(valor) {
        // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
        return String(valor ?? '').replace(/[&<>"']/g, caractere => ({
            // Completa a expressão/chamada JavaScript do bloco atual, utilizando os valores indicados na linha.
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        // Finaliza a função de retorno e a chamada que a recebeu.
        })[caractere]);
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
};
