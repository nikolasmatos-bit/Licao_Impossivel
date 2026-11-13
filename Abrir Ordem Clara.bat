@echo off
REM Desliga a exibição dos comandos executados para deixar o terminal limpo.
REM Limita as variáveis de ambiente a este arquivo .bat, sem alterar o sistema.
setlocal
REM Entra na pasta onde este .bat está salvo, mesmo que esteja em outro disco.
cd /d "%~dp0"

REM Confere se o executável do Node.js está acessível pelo PATH; oculta saída normal e erros.
where node.exe >nul 2>nul
REM Se o comando anterior terminou com erro, salta para a etapa indicada.
if errorlevel 1 goto sem_node

REM Executa um teste rápido das bibliotecas SQLite e Express para confirmar que carregam corretamente.
node.exe -e "const DB=require('better-sqlite3');new DB(':memory:').close();require('express')" >nul 2>nul
REM Se o comando anterior terminou com erro, salta para a etapa indicada.
if errorlevel 1 goto verificar_dependencias
REM Desvia a execução para a seção identificada pelo rótulo após goto.
goto iniciar

REM Rótulo usado como destino dos desvios de execução do script.
:verificar_dependencias
REM Confere se o npm está instalado e acessível pelo PATH; oculta a saída.
where npm.cmd >nul 2>nul
REM Se o comando anterior terminou com erro, salta para a etapa indicada.
if errorlevel 1 goto sem_npm
REM Verifica se um arquivo exigido existe; caso não exista, inicia a instalação.
if not exist "node_modules\better-sqlite3\package.json" goto instalar_dependencias
REM Mostra no terminal o aviso: Ajustando o SQLite nativo para esta versao do Node.js....
echo Ajustando o SQLite nativo para esta versao do Node.js...
REM Reconstrói a biblioteca nativa SQLite para a versão de Node.js instalada nesta máquina.
call npm.cmd rebuild better-sqlite3
REM Executa um teste rápido das bibliotecas SQLite e Express para confirmar que carregam corretamente.
node.exe -e "const DB=require('better-sqlite3');new DB(':memory:').close();require('express')" >nul 2>nul
REM Se o comando anterior teve sucesso, continua na etapa indicada.
if not errorlevel 1 goto iniciar

REM Rótulo usado como destino dos desvios de execução do script.
:instalar_dependencias
REM Mostra no terminal o aviso: Preparando dependencias para esta versao do Node.js....
echo Preparando dependencias para esta versao do Node.js...
REM Instala exatamente as dependências descritas no package-lock.json, sem trocar as versões do projeto.
call npm.cmd ci
REM Se o comando anterior terminou com erro, salta para a etapa indicada.
if errorlevel 1 goto falha

REM Rótulo usado como destino dos desvios de execução do script.
:iniciar
REM Executa o inicializador do servidor e pede a abertura automática do navegador.
node.exe launch.js
REM Se o comando anterior terminou com erro, salta para a etapa indicada.
if errorlevel 1 pause
REM Encerra o .bat e devolve ao Windows o código de sucesso ou erro indicado.
exit /b %errorlevel%

REM Rótulo usado como destino dos desvios de execução do script.
:sem_node
REM Mostra no terminal o aviso: Node.js nao foi encontrado. Instale o Node.js LTS (20 ou mais recente)..
echo Node.js nao foi encontrado. Instale o Node.js LTS (20 ou mais recente).
REM Mantém a janela aberta para que o usuário leia a mensagem antes de fechar.
pause
REM Encerra o .bat e devolve ao Windows o código de sucesso ou erro indicado.
exit /b 1

REM Rótulo usado como destino dos desvios de execução do script.
:sem_npm
REM Mostra no terminal o aviso: npm nao foi encontrado. Reinstale o Node.js com npm..
echo npm nao foi encontrado. Reinstale o Node.js com npm.
REM Mantém a janela aberta para que o usuário leia a mensagem antes de fechar.
pause
REM Encerra o .bat e devolve ao Windows o código de sucesso ou erro indicado.
exit /b 1

REM Rótulo usado como destino dos desvios de execução do script.
:falha
REM Mostra no terminal o aviso: Nao foi possivel preparar as dependencias. Verifique a conexao com a internet..
echo Nao foi possivel preparar as dependencias. Verifique a conexao com a internet.
REM Mantém a janela aberta para que o usuário leia a mensagem antes de fechar.
pause
REM Encerra o .bat e devolve ao Windows o código de sucesso ou erro indicado.
exit /b 1
