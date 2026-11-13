# Megabrain Services — Sistema de Ordens de Serviço

Sistema local com login, administrador, funcionários vinculados a técnicos,
clientes, ordens de serviço e portal do cliente. Esta edição acrescenta comentários explicativos aos arquivos
autorais, sem mudar as funções, controles de acesso ou dados de origem.
O SQL tem somente comentários novos; as instruções executadas são as mesmas.

## Como abrir no Windows

1. Instale o **Node.js 20 ou mais recente** (se ainda não tiver).
2. Extraia todo o ZIP, mantendo as pastas.
3. Execute **`Abrir Ordem Clara.bat`** (na raiz).
4. A aplicação abrirá em **http://127.0.0.1:3001**.

O .bat verifica as dependências e tenta corrigir a biblioteca nativa SQLite
se a versão do Node.js instalada precisar. Para uma correção/reinstalação, pode
ser necessário acesso à internet. Nunca execute o programa de dentro do ZIP.

## Pastas organizadas

```text
Licao_Impossivel/
├── Abrir Ordem Clara.bat       Inicia no Windows
├── launch.js                   Inicializa e abre o navegador
├── package.json               Comandos e dependências
├── html/                      Todas as 9 páginas
├── css/
│   ├── base.css               Estilos compartilhados por todas as páginas
│   ├── index.css              Login e cadastro inicial
│   ├── dashboard.css          Painel de indicadores
│   ├── cadastros.css          Cadastro de ordens
│   ├── lista.css              Listagem de ordens
│   ├── detalhes.css           Detalhes e histórico da OS
│   ├── tecnicos.css           Cadastro e lista de técnicos
│   ├── clientes.css           Clientes
│   ├── usuarios.css           Contas e permissões
│   ├── portal-cliente.css     Portal do cliente
│   └── img/                   Imagem original
├── js/                        JavaScript original (funções preservadas)
├── server/
│   ├── server.js              API e regras de acesso
│   ├── mega-brain.sql         Script SQL com comentários explicativos
│   └── os_system.sqlite       Banco SQLite original, com dados
├── tests/                     Testes automatizados
├── docs/                      Documentação da versão anterior
└── node_modules/              Bibliotecas originais (não editar os arquivos de terceiros)
```

**Importante:** As URLs das páginas são iguais às de antes, por exemplo
`/index.html`, `/dashboard.html` e `/portal-cliente.html`. Não abra os HTMLs
por clique duplo: o servidor é necessário para login e API.

## Perfis e acesso

- **Administrador:** gerencia contas, técnicos, clientes e ordens; visualiza todas.
- **Funcionário:** precisa de uma conta vinculada a um técnico cadastrado;
  visualiza apenas ordens atribuídas a ele ou ainda sem responsável.
- **Cliente:** consulta ordens vinculadas ao seu cadastro.

A primeira conta administradora é criada na configuração inicial **somente se o
banco estiver vazio**. Com o banco incluído, faça login com as contas já
existentes. Só um administrador pode criar contas de administrador ou funcionário
em **Acessos**. O cadastro público é exclusivo para clientes.

## Comandos manuais

Na raiz do projeto:

```bash
npm start      # Inicia o servidor
npm run open   # Inicia e abre o navegador
npm test       # Testa API, permissões e cadastros (bancos temporários)
```

O banco real foi preservado em `server/os_system.sqlite`. Faça um backup antes
de substituir o sistema em outra instalação. As instruções do script `server/mega-brain.sql`
foram preservadas; somente comentários explicativos foram acrescentados. Não publique o banco em repositórios públicos,
pois ele pode conter informações pessoais.

Variáveis opcionais: `PORT` (padrão 3001) e `DATABASE_PATH` (caminho de outro
banco SQLite). A aplicação escuta apenas em `127.0.0.1`.

Consulte `SIMPLIFICACAO.md` para a lista de mudanças e validações.

## Comentários educativos

Todos os arquivos autorais em `js/`, `html/`, `css/`, `server/server.js`,
`server/mega-brain.sql`, `launch.js`, `tests/` e no arquivo `.bat` receberam
comentários em português que explicam cada instrução, tag ou propriedade.
O código executável foi mantido; os comentários não aparecem na interface.
Arquivos de terceiros dentro de `node_modules/` não foram alterados para evitar
quebrar dependências e licenças. Arquivos `.json` também não admitem comentários
por padrão: seus campos estão explicados no `GUIA_DE_CODIGO.md`.

Foi retirada uma pasta temporária duplicada de `node_modules` que não faz parte
da inicialização. A biblioteca SQLite original para Windows foi mantida.
