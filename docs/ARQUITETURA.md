# Arquitetura

## Visão geral

```
Navegador (HTML/CSS/JS)
   │  fetch + Cookie os_session
   ▼
Express 5
   ├─ Middleware req.user
   ├─ Middleware exigirPapeis
   └─ Rotas /api/*
   │  better-sqlite3 (síncrono)
   ▼
SQLite (os_system.sqlite)
```

## ER

```mermaid
erDiagram
    CLIENTES ||--o{ ORDENS_SERVICO : possui
    CLIENTES ||--o{ USUARIOS : conta
    TECNICOS ||--o{ ORDENS_SERVICO : atende
    TECNICOS ||--o{ USUARIOS : conta
    ORDENS_SERVICO ||--o{ INTERACOES_CLIENTE : registra
    USUARIOS ||--o{ SESSOES : abre
    USUARIOS ||--o{ INTERACOES_CLIENTE : autor

    CLIENTES { int id PK  text nome  text telefone  text email }
    TECNICOS { int id PK  text nome  text email UK  text telefone  text especialidade }
    ORDENS_SERVICO { int id PK  int cliente_id FK  int tecnico_id FK  text equipamento  text prioridade  text status  text descricao  text diagnostico  text aberta_em  text fechada_em }
    USUARIOS { int id PK  text nome  text email UK  text senha_hash  text papel  int cliente_id FK  int tecnico_id FK  int ativo }
    SESSOES { text token_hash PK  int usuario_id FK  int expira_em }
    INTERACOES_CLIENTE { int id PK  int ordem_id FK  int autor_id FK  text canal  text visibilidade  text mensagem  text criado_em }
```

## Login

```mermaid
sequenceDiagram
    participant N as Navegador
    participant E as Express
    participant DB as SQLite

    N->>E: POST /api/auth/login
    E->>DB: SELECT usuario WHERE email
    E->>E: scrypt(senha) == hash?
    alt ok
        E->>DB: INSERT sessao
        E-->>N: Set-Cookie + {usuario}
    else
        E-->>N: 401
    end
```

## Criação de OS

```mermaid
sequenceDiagram
    participant F as Funcionário
    participant E as Express
    participant DB as SQLite

    F->>E: POST /api/ordens
    E->>E: valida payload
    E->>DB: BEGIN
    E->>DB: cliente existe? senão INSERT
    E->>DB: técnico existe? senão INSERT
    E->>DB: INSERT OS status=Aberta
    E->>DB: COMMIT
    E-->>F: 201 {id}
```

## Decisões

| Decisão | Motivo |
|---|---|
| `better-sqlite3` | Simples, síncrono, sem pool |
| Sessão em cookie HttpOnly | Imune a XSS/CSRF sem dependência externa |
| `scrypt` + salt | Padrão do Node |
| Sem framework no front | Domínio de JS/DOM |
| `exigirPapeis` centralizado | Não esquece autorização em endpoints novos |
| Validação antes do SQL | 400 com mensagem clara em vez de 500 |
| DELETE de OS só após concluir | Preserva histórico |
| `corpoSeguro(req)` | Express 5 deixa body `undefined` sem Content-Type |