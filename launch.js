const { spawn } = require('child_process');

const siteUrl = 'http://localhost:3001/index.html';
const healthUrl = 'http://127.0.0.1:3001/';

async function servidorDisponivel() {
    try {
        const resposta = await fetch(healthUrl, { signal: AbortSignal.timeout(1200) });
        return resposta.ok;
    } catch {
        return false;
    }
}

function abrirNavegador() {
    let comando;
    let argumentos;

    if (process.platform === 'win32') {
        comando = 'cmd.exe';
        argumentos = ['/c', 'start', '', siteUrl];
    } else if (process.platform === 'darwin') {
        comando = 'open';
        argumentos = [siteUrl];
    } else {
        comando = 'xdg-open';
        argumentos = [siteUrl];
    }

    const navegador = spawn(comando, argumentos, { detached: true, stdio: 'ignore' });
    navegador.on('error', erro => console.error('Não foi possível abrir o navegador:', erro.message));
    navegador.unref();
}

async function iniciar() {
    if (await servidorDisponivel()) {
        console.log('O servidor já estava ativo. Abrindo o site...');
        abrirNavegador();
        return;
    }

    console.log('Iniciando Ordem Clara...');
    const servidor = spawn(process.execPath, ['server.js'], {
        cwd: __dirname,
        stdio: 'inherit'
    });
    let erroInicializacao = null;
    servidor.on('error', erro => { erroInicializacao = erro; });

    const limite = Date.now() + 30000;
    while (Date.now() < limite) {
        if (erroInicializacao) throw erroInicializacao;
        if (servidor.exitCode !== null || servidor.signalCode !== null) {
            throw new Error('O servidor encerrou antes de ficar pronto. Verifique a mensagem acima.');
        }
        if (await servidorDisponivel()) {
            console.log(`Site pronto: ${siteUrl}`);
            abrirNavegador();
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 350));
    }

    servidor.kill();
    throw new Error('O servidor não ficou pronto em 30 segundos.');
}

iniciar().catch(erro => {
    console.error(erro.message);
    process.exitCode = 1;
});
