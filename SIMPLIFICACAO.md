# Reorganização simplificada do projeto

## O que mudou

- As 9 páginas HTML foram movidas para a pasta `html/`.
- O CSS unificado foi dividido em `css/base.css` (regras gerais) e um CSS por
  página HTML (`dashboard.css`, `usuarios.css`, `clientes.css` etc.). A ordem de
  aplicação das regras originais foi preservada. A imagem foi mantida.
- O servidor e os dois arquivos de banco foram agrupados em `server/`.
- Foram corrigidos **somente os caminhos relativos** necessários para o
  Express, `npm start`, `launch.js` e os scripts de testes.
- O JavaScript das telas e toda a lógica da API foram preservados.

## O que NÃO mudou

- Código SQL `mega-brain.sql`: os mesmos bytes do original.
- Banco `os_system.sqlite`: os mesmos bytes do original; os dados não são zerados.
- Endpoints HTTP, nomes de páginas na URL, cadastros e permissões.
- Funções do frontend, autenticação, segurança das sessões e regras das OS.
- Dependências Node que já acompanhavam o arquivo enviado.

## Como executar

No Windows, extraia o ZIP e execute `Abrir Ordem Clara.bat`.
Para testes via terminal na raiz: `npm test`.

**Observação técnica:** `better-sqlite3` é uma dependência nativa. O módulo
incluído neste pacote é do Windows. Para rodar em outro sistema operacional,
recompile/reinstale as dependências nesse sistema operacional.
