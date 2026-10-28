@echo off
setlocal
cd /d "%~dp0"

where node.exe >nul 2>nul
if errorlevel 1 goto sem_node

if not exist "node_modules\express\package.json" goto instalar_dependencias
if not exist "node_modules\better-sqlite3\package.json" goto instalar_dependencias
goto iniciar

:instalar_dependencias
    echo Instalando dependencias do projeto...
    call npm.cmd install
    if errorlevel 1 goto falha

:iniciar
node.exe launch.js
if errorlevel 1 pause
exit /b %errorlevel%

:sem_node
echo Node.js nao foi encontrado. Instale o Node.js LTS e tente novamente.
pause
exit /b 1

:falha
echo Nao foi possivel instalar as dependencias.
pause
exit /b 1
