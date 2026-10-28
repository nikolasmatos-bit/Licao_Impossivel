# Megabrain Services — Sistema de Ordens de Serviço

Sistema web para assistência técnica: cadastro de clientes, técnicos, ordens de serviço, controle de acesso por perfil e portal do cliente.

## Stack

- **Runtime:** Node.js 20+
- **Back-end:** Express 5
- **Banco:** SQLite (via `better-sqlite3`)
- **Autenticação:** sessões em cookie `HttpOnly` + `SameSite=Strict`, senhas com `scrypt` + salt
- **Front-end:** HTML/CSS/JS puro

## Como rodar

### Windows
Duplo-clique em **`Abrir Ordem Clara.bat`**.

### Manual
```bash
npm install
npm start
npm run open
```

Na primeira execução o sistema pede para criar a **conta administradora** em `/index.html`.

## Perfis de acesso

| Papel | Pode fazer |
|---|---|
| **admin** | Tudo: CRUD de técnicos, clientes, ordens, gestão de usuários |
| **funcionario** | Criar OS, atualizar as OS atribuídas a ele, cadastrar clientes |
| **cliente** | Ver as próprias OS pelo portal do cliente e responder no histórico |

## Estrutura

```
.
├── Abrir Ordem Clara.bat
├── launch.js
├── server.js
├── mega-brain.sql
├── package.json
├── tests/api.test.js
├── docs/
│   ├── API.md
│   ├── ARQUITETURA.md
│   ├── TESTES.md
│   └── APRESENTACAO.md
├── css/    js/
└── *.html
```

## Testes

```bash
npm test
```

Sobe um servidor isolado com banco temporário e valida o fluxo completo via HTTP.

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `PORT` | `3001` | Porta HTTP |
| `DATABASE_PATH` | `./os_system.sqlite` | Caminho do banco |

## Licença

ISC.