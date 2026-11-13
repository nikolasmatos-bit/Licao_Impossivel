# Guia detalhado dos comandos e comentários

Este projeto contém comentários em português diretamente acima das instruções do código, dos elementos HTML, das regras CSS e dos comandos do inicializador. **Os comentários são didáticos; não alteram o funcionamento.**

## Como ler os comentários

- **JavaScript (`js/`, `launch.js`, `server/server.js`, `tests/`):** cada linha relevante explica o que a instrução faz. `//` indica comentário de uma linha e `/* ... */` indica um bloco de explicações. As instruções dentro de strings e templates JavaScript não recebem comentários embutidos para não alterar HTML ou SQL enviados pelo código.
- **HTML (`html/`):** `<!-- ... -->` explica as tags, os campos, os botões, os IDs e a navegação. O navegador ignora esses comentários. O `<!DOCTYPE html>` e o `<meta charset>` são mantidos no início para compatibilidade.
- **CSS (`css/`):** `/* ... */` explica os seletores, as propriedades e os valores de cada declaração, inclusive cores, espaçamentos e regras de responsividade. `base.css` é compartilhado; os demais continuam separados por página.
- **SQL (`server/mega-brain.sql`):** `--` explica cada tabela, coluna, chave, índice e restrição; as instruções SQL não foram substituídas.
- **Lote Windows (`Abrir Ordem Clara.bat`):** `REM` explica cada verificação, desvio, instalação e chamada do Node.js.
- **JSON:** JSON padrão não aceita comentários. Para impedir erros, os comentários sobre `package.json` e `package-lock.json` ficam neste guia.

## Termos e pequenos símbolos usados em JavaScript

- `const`: cria uma referência que não será reatribuída; `let`: variável que pode mudar.
- `=`: atribui valor; `===`: compara valor e tipo; `!==`: testa diferença; `&&`: exige duas condições; `||`: aceita uma das duas.
- `??`: usa um valor alternativo quando o original é `null` ou `undefined`; `?.`: acessa apenas se o objeto existir.
- `()`: argumentos ou agrupamento; `{}`: bloco ou objeto; `[]`: lista/array; `;`: encerra uma instrução, quando utilizado.
- `async`: indica uma função assíncrona; `await`: espera uma tarefa; `=>`: define uma função de seta.
- `req`: requisição recebida pelo servidor; `res`: resposta que o servidor devolve; `next()`: passa ao próximo middleware.
- `db.prepare(...)`: prepara SQL parametrizado; `.run(...)`: executa; `.get(...)`: pega um registro; `.all(...)`: lista todos os resultados.
- `?` no SQL: espaço preenchido com parâmetro, evitando juntar entrada do usuário diretamente ao comando SQL.
- `addEventListener`: aguarda o usuário clicar, digitar ou enviar um formulário.
- `textContent`: insere texto sem interpretar código HTML; `innerHTML`: escreve marcação HTML e exige cuidado com dados externos.

## Para que serve cada arquivo de configuração?

### `package.json`

| Campo | Explicação |
|---|---|
| `name` | Nome técnico do projeto usado pelo npm. |
| `version` | Versão declarada do pacote. |
| `main` | Arquivo principal da aplicação. |
| `scripts.start` | Comando `npm start`: inicia o servidor. |
| `scripts.open` | Comando `npm run open`: inicia e abre no navegador. |
| `scripts.test` | Comando `npm test`: roda os testes automatizados. |
| `repository` | Endereço do repositório de origem. |
| `keywords` | Palavras-chave opcionais, atualmente vazias. |
| `author` | Nome do autor (campo originalmente vazio). |
| `license` | Identificador da licença informado no arquivo original. |
| `bugs` | Página de registro de problemas. |
| `homepage` | Página principal do projeto. |
| `description` | Resumo do propósito da aplicação. |
| `engines.node` | Versão mínima exigida do Node.js. |
| `dependencies.express` | Biblioteca para criar as rotas HTTP/API. |
| `dependencies.better-sqlite3` | Biblioteca SQLite usada para consultar e alterar o banco. |

### `package-lock.json`

Registra versões exatas das dependências e a integridade de seus pacotes. O npm usa esse arquivo no `npm ci` para reproduzir a instalação. Não se deve inserir comentários nesse JSON nem editar manualmente as verificações de integridade.

### `.vscode/settings.json`

Contém preferências locais do editor VS Code; não contém lógica do sistema. JSON puro também não aceita comentários.

## O que não foi removido?

- O banco de dados `os_system.sqlite`, que pode conter os registros cadastrados.
- O `package-lock.json` e as bibliotecas necessárias para executar a aplicação no Windows.
- As nove páginas, seus CSS por página, a API, o controle de sessões, os perfis e os testes.
- Documentos de apresentação, arquitetura e relatórios que podem ajudar no trabalho escolar.

## O que foi removido?

Somente a pasta temporária de instalação `node_modules/.better-sqlite3-b4vobw4S`, que duplicava a biblioteca já presente em `node_modules/better-sqlite3`.

## Testes e limite da validação

Os testes de sintaxe JavaScript e integridade dos arquivos foram executados nesta revisão. A biblioteca `better-sqlite3` do ZIP é uma DLL Windows, portanto os testes de API que exigem executá-la precisam ser rodados no Windows com o Node.js, usando `npm test`. O arquivo `.bat` recompila/reinstala as dependências automaticamente, se necessário.
