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
// Extrai uma ou mais propriedades de um módulo/objeto por desestruturação; dispensa acessar cada propriedade manualmente.
const { once } = require('node:events');
// Declara fs com const (referência que não pode ser reatribuída) e atribui require('node:fs');.
const fs = require('node:fs');
// Declara net com const (referência que não pode ser reatribuída) e atribui require('node:net');.
const net = require('node:net');
// Declara os com const (referência que não pode ser reatribuída) e atribui require('node:os');.
const os = require('node:os');
// Declara path com const (referência que não pode ser reatribuída) e atribui require('node:path');.
const path = require('node:path');

// Declara a função portaLivre; os parâmetros (nenhum) recebem dados quando ela é chamada.
function portaLivre() {
    // Termina esta função e devolve o valor/resultado indicado; sem valor, apenas encerra a execução.
    return new Promise((resolve, reject) => {
        // Declara servidor com const (referência que não pode ser reatribuída) e atribui net.createServer();.
        const servidor = net.createServer();
        // Chama a função servidor.once com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        servidor.once('error', reject);
        // Chama a função servidor.listen com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
        servidor.listen(0, '127.0.0.1', () => {
            // Declara porta com const (referência que não pode ser reatribuída) e atribui servidor.address().port;.
            const porta = servidor.address().port;
            // Chama a função servidor.close com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
            servidor.close(erro => erro ? reject(erro) : resolve(porta));
        // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
        });
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    });
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função pararServidor; os parâmetros (servidor) recebem dados quando ela é chamada. A função async pode aguardar tarefas assíncronas.
async function pararServidor(servidor) {
    // Verifica a condição (!servidor || servidor.exitCode !== null || servidor.signalCode !== null) return;; só executa o trecho correspondente quando ela for verdadeira.
    if (!servidor || servidor.exitCode !== null || servidor.signalCode !== null) return;
    // Declara encerrado com const (referência que não pode ser reatribuída) e atribui once(servidor, 'close');.
    const encerrado = once(servidor, 'close');
    // Encerra o processo do servidor quando a inicialização ultrapassa a verificação prevista.
    servidor.kill();
    // Espera a operação assíncrona terminar antes de continuar com o resultado.
    await encerrado;
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Declara a função removerDiretorioTemporario; os parâmetros (diretorio) recebem dados quando ela é chamada.
function removerDiretorioTemporario(diretorio) {
    // Declara destino com const (referência que não pode ser reatribuída) e atribui path.resolve(diretorio);.
    const destino = path.resolve(diretorio);
    // Verifica a condição (path.dirname(destino) !== path.resolve(os.tmpdir()) || !path.basename(destino).startsWith('meg…; só executa o trecho correspondente quando ela for verdadeira.
    if (path.dirname(destino) !== path.resolve(os.tmpdir()) || !path.basename(destino).startsWith('megabrain-')) {
        // Lança uma exceção para que o erro seja tratado por um bloco catch ou pelo chamador.
        throw new Error('A limpeza dos testes só pode remover seu próprio diretório temporário.');
    // Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
    }
    // Chama a função fs.rmSync com os argumentos informados, executando sua tarefa e aproveitando os efeitos/resultado.
    fs.rmSync(destino, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
// Fecha o bloco, a função, a estrutura de dados ou a chamada iniciada anteriormente.
}

// Atribui ou atualiza module.exports com o resultado da expressão à direita do sinal =.
module.exports = { portaLivre, pararServidor, removerDiretorioTemporario };
