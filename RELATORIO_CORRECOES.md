# Correções aplicadas — Lição Impossível / Megabrain Services

**Data:** 04/11/2026

## Correções

1. **Cadastro e autorização:** rota `/api/auth/setup` disponível apenas na primeira instalação. O cadastro público `/api/auth/register` aceita somente clientes; administradores e funcionários são gerenciados por uma conta administrativa.
2. **API de clientes:** rotas de consulta por ID, criação, edição e exclusão implementadas com validação e tratamento de vínculos.
3. **API de técnicos:** listagem completa, consulta por ID, edição e exclusão implementadas, além da listagem resumida para formulários.
4. **API de usuários:** listagem, criação por administrador e suspensão/reativação implementadas. Impedido o bloqueio da própria conta ou do último administrador ativo.
5. **Ordens de serviço:** formulário e servidor agora concordam no uso do nome do técnico; telefone/e-mail do cliente são salvos ao criar novos clientes ou preencher dados anteriormente ausentes. Entradas e vínculos são validados.
6. **Histórico e status:** notas internas são invisíveis aos clientes (inclusive notas antigas com marcação pública); clientes só publicam atualizações. Ordens finalizadas não recebem novas alterações. A exclusão de OS é permitida apenas após conclusão/cancelamento.
7. **Dashboard:** todos os indicadores esperados pelo front-end são calculados e enviados pelo servidor, incluindo distribuição por status, prioridade alta, atraso acima de 48 horas e sem responsável.
8. **Funcionários:** ordens sem técnico permanecem visíveis e agora também podem ser abertas por funcionários, com permissões consistentes entre lista e detalhes.
9. **JavaScript da página de usuários:** `js/utils.js` foi preenchido com os métodos usados (`mostrarMensagem`, `comCarregando`, `escapeHTML`).
10. **Configuração para testes:** `PORT` e `DATABASE_PATH` agora funcionam; todos os testes usam bancos temporários e não acessam o banco do usuário.
11. **Inicialização Windows:** adicionado `Abrir Ordem Clara.bat` na raiz; o antigo atalho em `out/` encaminha ao correto. O script testa a compatibilidade do módulo SQLite e tenta prepará-lo caso necessário.
12. **Validação:** tratamento de senhas/campos ausentes e status inválidos para evitar exceções e mensagens enganadoras; proteção contra inserção de nomes em HTML via concatenação.

## Testes

- `npm test`: **22 testes passaram, 0 falhas**.
- Sintaxe dos scripts próprios (arquivos JS e blocos JS de 9 páginas HTML): aprovada.
- Inicialização com cópia do `os_system.sqlite` original: aprovada (`PRAGMA integrity_check = ok`).
- O banco original e suas contas foram **preservados sem alteração**.

## Observações importantes

- O pacote inclui o módulo nativo Windows que acompanhava o projeto enviado. A compatibilidade dele depende da versão do Node.js; o inicializador tenta recompilar/instalar dependências quando necessário. Essa etapa pode requerer acesso à internet e ferramentas de compilação conforme o ambiente.
- O navegador automatizado disponível no ambiente de auditoria bloqueou conexões locais, portanto **não foi possível certificar visualmente as telas no Windows**. A aplicação foi testada por HTTP e por sintaxe, mas o funcionamento de ponta a ponta no computador do usuário ainda deve ser confirmado.
- As senhas de contas existentes não foram modificadas. Se o banco já estava configurado, utilize o login anterior.
