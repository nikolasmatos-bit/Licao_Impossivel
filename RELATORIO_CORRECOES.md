# Correções aplicadas — Lição Impossível / Megabrain Services

**Data:** 04/11/2026

## Correções

1. **Cadastro e autorização:** rota `/api/auth/setup` disponível apenas na primeira instalação. O cadastro público `/api/auth/register` aceita somente clientes; administradores e funcionários são gerenciados por uma conta administrativa.
2. **API de clientes:** rotas de consulta por ID, criação, edição e exclusão implementadas com validação e tratamento de vínculos.
3. **API de técnicos:** listagem completa, consulta por ID, edição e exclusão implementadas, além da listagem resumida para formulários.
4. **API de usuários:** listagem, criação por administrador e suspensão/reativação implementadas. Impedido o bloqueio da própria conta ou do último administrador ativo.
5. **Ordens de serviço:** formulário e servidor usam identificadores para selecionar clientes e técnicos; telefone/e-mail são salvos ao criar novos clientes ou preencher dados anteriormente ausentes. Entradas e vínculos são validados.
6. **Histórico e status:** notas internas são invisíveis aos clientes (inclusive notas antigas com marcação pública); clientes só publicam atualizações. Ordens finalizadas não recebem novas alterações. A exclusão de OS é permitida apenas após conclusão/cancelamento.
7. **Dashboard:** todos os indicadores esperados pelo front-end são calculados e enviados pelo servidor, incluindo distribuição por status, prioridade alta, atraso acima de 48 horas e sem responsável.
8. **Funcionários:** ordens sem técnico permanecem visíveis e agora também podem ser abertas por funcionários, com permissões consistentes entre lista e detalhes.
9. **JavaScript da página de usuários:** `js/utils.js` foi preenchido com os métodos usados (`mostrarMensagem`, `comCarregando`, `escapeHTML`).
10. **Configuração para testes:** `PORT` e `DATABASE_PATH` agora funcionam; todos os testes usam bancos temporários e não acessam o banco do usuário.
11. **Inicialização Windows:** adicionado `Abrir Ordem Clara.bat` na raiz; o antigo atalho em `out/` encaminha ao correto. O script testa a compatibilidade do módulo SQLite e tenta prepará-lo caso necessário.
12. **Validação:** tratamento de senhas/campos ausentes e status inválidos para evitar exceções e mensagens enganadoras; proteção contra inserção de nomes em HTML via concatenação.
13. **Clientes homônimos:** nomes iguais com e-mails diferentes não são vinculados ao mesmo cliente. E-mails repetidos e nomes existentes sem e-mail exigem seleção explícita do cadastro.
14. **Cadastro público de cliente existente:** retorna uma orientação para solicitar o acesso à equipe, sem duplicar registros nem conceder acesso a ordens por um e-mail autodeclarado. O administrador cria a conta vinculada em **Acessos**.
15. **Técnicos homônimos:** selecionados por ID no formulário. A API recusa nomes ambíguos em requisições antigas.
16. **OS sem técnico:** opção **A definir** disponível para o administrador, inclusive antes de cadastrar o primeiro técnico.
17. **WhatsApp:** normalização compartilhada evita duplicação do DDI `55` e reconhece corretamente telefones nacionais com DDD `55`.
18. **Datas:** detalhes, carteira de clientes e portal interpretam os timestamps do SQLite como UTC e exibem a data local de maneira consistente.
19. **Testes no Windows:** a limpeza aguarda o encerramento do servidor antes de remover o SQLite temporário; testes usam portas disponíveis e incluem regressões de vínculos e permissões entre homônimos.

## Testes

- `npm test`: **26 testes passaram, 0 falhas**.
- Sintaxe dos scripts próprios (arquivos JS e blocos JS de 9 páginas HTML): aprovada.
- Chrome headless no Windows, com banco temporário: configuração inicial, criação de OS sem técnico, seleção de clientes/técnicos homônimos, preenchimento automático, links de WhatsApp e conversão de datas aprovados, sem exceções JavaScript. Formulário de cadastro também inspecionado por captura de tela.
- Integridade do `os_system.sqlite` original verificada em modo somente leitura: `PRAGMA integrity_check = ok`, sem violações de chaves estrangeiras.
- O banco original e suas contas foram **preservados sem alteração**, confirmado pelo mesmo SHA-256 antes e depois das verificações.

## Observações importantes

- O pacote inclui o módulo nativo Windows que acompanhava o projeto enviado. A compatibilidade dele depende da versão do Node.js; o inicializador tenta recompilar/instalar dependências quando necessário. Essa etapa pode requerer acesso à internet e ferramentas de compilação conforme o ambiente.
- A checagem de navegador cobriu os fluxos alterados no Chrome do Windows, com dados temporários; não substitui uma revisão completa de todas as telas e navegadores.
- As senhas de contas existentes não foram modificadas. Se o banco já estava configurado, utilize o login anterior.
