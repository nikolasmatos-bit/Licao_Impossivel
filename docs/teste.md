# Testes automatizados — Megabrain Services

Os testes são executados com `node:test` (Node.js 20+) usando `npm test`.

Os dois arquivos em `tests/` inicializam servidores locais e usam bancos SQLite
**temporários**. O banco `os_system.sqlite` da instalação não é alterado.

## Cobertura — 22 testes

- Instalação inicial, criação do administrador, login, sessão, logout e cadastro público de clientes;
- Rejeição de uma segunda configuração inicial e do cadastro público de funcionário/admin;
- Criação e consulta de clientes, técnicos, contas de funcionários/clientes/admin e alteração de técnicos;
- Criação de ordens, validação de entradas, listagem, mudança de status e exclusão de OS encerradas;
- Bloqueio de exclusão de ordens ainda abertas e de técnicos vinculados a outros registros;
- Salvamento de telefone, e-mail e técnico da OS ao utilizar o formulário;
- Métricas e distribuição do dashboard;
- Restrições entre cliente, funcionário e administrador; visibilidade de notas internas;
- Acesso coerente a ordens sem técnico, encerramento imutável e prevenção de suspensão da própria conta admin.

## Verificações manuais complementares

- Testar no Windows o inicializador `Abrir Ordem Clara.bat` com a versão instalada do Node.js;
- Navegar por todas as páginas e verificar os formulários e filtros;
- Confirmar a aparência e a acessibilidade em Chrome, Edge e Firefox;
- Fazer backup do banco e verificar os dados após atualizar uma instalação existente.

**Resultado da revisão em 04/11/2026:** 22/22 testes automatizados aprovados;
validação de sintaxe dos scripts próprios e inicialização com cópia do banco original
aprovadas. O teste visual por navegador automatizado não pôde ser executado no
ambiente utilizado para a revisão devido a uma restrição de navegação local.
