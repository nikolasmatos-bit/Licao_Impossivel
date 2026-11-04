# Megabrain Services — Sistema de Ordens de Serviço

Sistema web local de assistência técnica: clientes, técnicos, ordens de serviço,
autenticação por perfil, dashboard, gerenciamento de contas e portal do cliente.

## Windows: como abrir

1. Instale o **Node.js 20 ou mais recente**, se ainda não estiver instalado.
2. Extraia **todo** o ZIP em uma pasta no computador.
3. Dê dois cliques em **`Abrir Ordem Clara.bat`**, na raiz do projeto.
4. O sistema iniciará em **http://127.0.0.1:3001** e abrirá o navegador.

O ZIP inclui as dependências que vieram no projeto original para Windows. O
inicializador confere se são compatíveis com o Node.js instalado e, se
necessário, tenta recompilar/instalar o módulo SQLite; essa etapa pode exigir
conexão à internet. Não execute o `.bat` dentro do ZIP sem extraí-lo.

O banco `os_system.sqlite` acompanha o pacote, **preservando os dados e as contas
já existentes**. Faça backup desse arquivo antes de substituir outra instalação.
Na primeira instalação com um banco vazio, a tela de entrada permite configurar
o primeiro administrador. Com um banco já configurado, entre usando suas
credenciais existentes — **o pacote não redefine senhas**.

## Comandos manuais

```bash
npm install       # necessário se as dependências não funcionarem ou não existirem
npm run open      # inicia o servidor e abre o navegador
```

`npm start` inicia somente o servidor (acesso via http://127.0.0.1:3001).

## Perfis

| Perfil | Permissões |
|---|---|
| Administrador | Gerenciar técnicos, clientes, contas e ordens, com acesso ao painel |
| Funcionário | Acompanhar ordens próprias e sem responsável, cadastrar clientes e OS |
| Cliente | Consultar as próprias ordens e responder no histórico público |

Funcionários e administradores são cadastrados por um administrador em **Acessos**.
O cadastro público permite apenas novas contas de cliente. Notas internas do
atendimento não são exibidas no portal do cliente.

Se o cliente já estiver cadastrado, um administrador deve criar a conta em
**Acessos**, escolhendo o perfil **Cliente** e o cadastro correspondente. O
cadastro público não duplica nem vincula automaticamente registros existentes.

Em **Nova OS**, selecione um cliente cadastrado ou preencha os dados de um novo
cliente. Clientes e técnicos com nomes iguais são diferenciados nas opções.
O técnico pode ficar **A definir**; funcionários vinculados continuam recebendo
automaticamente as ordens que cadastrarem.

## Banco e testes

O banco usa SQLite (`better-sqlite3`). O script SQL de criação está em
`mega-brain.sql` e é aplicado sem eliminar tabelas existentes.

```bash
npm test
```

Os testes HTTP iniciam servidores isolados com bancos temporários: **não usam o
arquivo `os_system.sqlite` fornecido**. A suíte cobre o fluxo principal,
permissões, API, indicadores e os casos de clientes e técnicos com nomes iguais.

## Configuração

| Variável | Padrão | Uso |
|---|---|---|
| `PORT` | `3001` | Porta HTTP, limitada ao endereço local `127.0.0.1` |
| `DATABASE_PATH` | `./os_system.sqlite` na pasta do sistema | Caminho de outro banco SQLite, se desejado |

Não publique a pasta do projeto, especialmente o arquivo do banco, em
repositórios públicos: ela pode conter informações de clientes e contas.

## Arquivos principais

- `Abrir Ordem Clara.bat` / `launch.js`: inicialização no Windows;
- `server.js`, `mega-brain.sql`, `os_system.sqlite`: API e banco;
- `index.html`, `dashboard.html`, `cadastros.html`, `lista.html`, `detalhes.html`,
  `clientes.html`, `tecnicos.html`, `usuarios.html`, `portal-cliente.html`: páginas;
- `js/`, `css/`: scripts e visual;
- `tests/`: testes automatizados;
- `docs/`: documentação.
