@echo off
setlocal
cd /d "%~dp0"

where node.exe >nul 2>nul
if errorlevel 1 goto sem_node

node.exe -e "const DB=require('better-sqlite3');new DB(':memory:').close();require('express')" >nul 2>nul
if errorlevel 1 goto verificar_dependencias
goto iniciar

:verificar_dependencias
where npm.cmd >nul 2>nul
if errorlevel 1 goto sem_npm
if not exist "node_modules\better-sqlite3\package.json" goto instalar_dependencias
echo Ajustando o SQLite nativo para esta versao do Node.js...
call npm.cmd rebuild better-sqlite3
node.exe -e "const DB=require('better-sqlite3');new DB(':memory:').close();require('express')" >nul 2>nul
if not errorlevel 1 goto iniciar

:instalar_dependencias
echo Preparando dependencias para esta versao do Node.js...
call npm.cmd ci
if errorlevel 1 goto falha

:iniciar
node.exe launch.js
if errorlevel 1 pause
exit /b %errorlevel%

:sem_node
echo Node.js nao foi encontrado. Instale o Node.js LTS (20 ou mais recente).
pause
exit /b 1

:sem_npm
echo npm nao foi encontrado. Reinstale o Node.js com npm.
pause
exit /b 1

:falha
echo Nao foi possivel preparar as dependencias. Verifique a conexao com a internet.
pause
exit /b 1
