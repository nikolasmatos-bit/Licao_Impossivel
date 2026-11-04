# Testes automatizados — Megabrain Services

Os testes são executados com `node:test` (Node.js 20+) usando `npm test`.

Os três arquivos `*.test.js` em `tests/` inicializam servidores locais e usam bancos SQLite
**temporários**. O banco `os_system.sqlite` da instalação não é alterado.
As portas são escolhidas entre as disponíveis e a limpeza aguarda o encerramento
dos processos antes de remover os bancos, inclusive no Windows.

## Cobertura — 26 testes

- Instalação inicial, criação do administrador, login, sessão, logout e cadastro público de clientes;
- Rejeição de uma segunda configuração inicial e do cadastro público de funcionário/admin;
- Criação e consulta de clientes, técnicos, contas de funcionários/clientes/admin e alteração de técnicos;
- Criação de ordens, validação de entradas, listagem, mudança de status e exclusão de OS encerradas;
- Bloqueio de exclusão de ordens ainda abertas e de técnicos vinculados a outros registros;
- Salvamento de telefone, e-mail e técnico da OS ao utilizar o formulário;
- Métricas e distribuição do dashboard;
- Restrições entre cliente, funcionário e administrador; visibilidade de notas internas;
- Acesso coerente a ordens sem técnico, encerramento imutável e prevenção de suspensão da própria conta admin.
- Isolamento das ordens de clientes com o mesmo nome, sem exposição no portal de outra pessoa;
- Cadastro público sem duplicação ou acesso a cadastros existentes, com criação do acesso pelo administrador;
- Seleção de clientes por ID quando nome ou e-mail forem ambíguos;
- Seleção de técnicos homônimos por ID e criação de ordens sem responsável.

## Verificações manuais complementares

- Testar no Windows o inicializador `Abrir Ordem Clara.bat` com a versão instalada do Node.js;
- Navegar por todas as páginas e verificar os formulários e filtros;
- Confirmar a aparência e a acessibilidade em Chrome, Edge e Firefox;
- Fazer backup do banco e verificar os dados após atualizar uma instalação existente.

**Resultado da revisão em 04/11/2026:** 26/26 testes automatizados aprovados.
A sintaxe dos scripts próprios e a integridade do banco original foram
verificadas sem alterar o banco da instalação.
Os fluxos alterados também foram validados no Chrome headless no Windows, com
banco temporário: configuração inicial, cadastro de OS sem técnico, seleção
de clientes e técnicos homônimos, preenchimento automático, WhatsApp e datas.
Não ocorreram exceções JavaScript nesses fluxos; o formulário de cadastro foi
inspecionado por captura de tela.
