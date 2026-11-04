const { once } = require('node:events');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');

function portaLivre() {
    return new Promise((resolve, reject) => {
        const servidor = net.createServer();
        servidor.once('error', reject);
        servidor.listen(0, '127.0.0.1', () => {
            const porta = servidor.address().port;
            servidor.close(erro => erro ? reject(erro) : resolve(porta));
        });
    });
}

async function pararServidor(servidor) {
    if (!servidor || servidor.exitCode !== null || servidor.signalCode !== null) return;
    const encerrado = once(servidor, 'close');
    servidor.kill();
    await encerrado;
}

function removerDiretorioTemporario(diretorio) {
    const destino = path.resolve(diretorio);
    if (path.dirname(destino) !== path.resolve(os.tmpdir()) || !path.basename(destino).startsWith('megabrain-')) {
        throw new Error('A limpeza dos testes só pode remover seu próprio diretório temporário.');
    }
    fs.rmSync(destino, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
}

module.exports = { portaLivre, pararServidor, removerDiretorioTemporario };
