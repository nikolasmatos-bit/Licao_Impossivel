# API — Megabrain Services

Base: `http://127.0.0.1:3001`
Autenticação: cookie `os_session` (HttpOnly, SameSite=Strict, 8h).

## Autenticação

| Método | Rota | Papel | Descrição |
|---|---|---|---|
| GET | `/api/auth/status` | público | `{configurado: bool}` |
| POST | `/api/auth/setup` | público, apenas banco vazio | Cria o primeiro admin |
| POST | `/api/auth/register` | público, após configuração | Cadastra somente cliente e cria vínculo em `clientes` |
| POST | `/api/auth/login` | público | Autentica e emite cookie |
| POST | `/api/auth/logout` | logado | Encerra sessão |
| GET | `/api/auth/me` | logado | Usuário atual |

O cadastro público retorna `409` se já existir um cliente com o e-mail informado.
Nesse caso, um administrador deve criar a conta em `/api/usuarios`, com
`papel: "cliente"` e o `cliente_id` correspondente. Informar um e-mail no cadastro
público não comprova a identidade para acessar ordens anteriores.

## Clientes

| Método | Rota | Papel |
|---|---|---|
| GET | `/api/clientes` | admin, funcionario |
| GET | `/api/clientes/:id` | admin, funcionario |
| POST | `/api/clientes` | admin, funcionario |
| PUT | `/api/clientes/:id` | admin, funcionario |
| DELETE | `/api/clientes/:id` | admin |

Body: `{nome, telefone, email}`

## Técnicos

| Método | Rota | Papel |
|---|---|---|
| GET | `/api/tecnicos` | admin, funcionario |
| GET | `/api/tecnicos/lista` | admin |
| GET | `/api/tecnicos/:id` | admin |
| POST | `/api/tecnicos` | admin |
| PUT | `/api/tecnicos/:id` | admin |
| DELETE | `/api/tecnicos/:id` | admin |

Body: `{nome, email, telefone, especialidade}`

## Ordens

| Método | Rota | Papel |
|---|---|---|
| GET | `/api/ordens` | filtrado por papel |
| GET | `/api/ordens/:id` | conforme vínculo |
| POST | `/api/ordens` | admin, funcionario |
| PUT | `/api/ordens/:id/status` | admin, funcionario |
| DELETE | `/api/ordens/:id` | admin (só Concluída/Cancelada) |

Body POST: `{cliente_id, equipamento, tecnico_id, prioridade, descricao}` para
cadastros existentes. Para novos clientes, envie `cliente_nome`,
`cliente_telefone` e `cliente_email` no lugar de `cliente_id`.

O formulário seleciona clientes e técnicos por ID, inclusive quando os nomes
coincidem. `tecnico_id` pode ser nulo ou omitido para deixar a OS sem responsável.
Funcionários vinculados assumem automaticamente suas novas ordens.

Por compatibilidade, a API também aceita `tecnico_nome` quando identifica um
único técnico. Mais de um técnico com o mesmo nome resulta em `409` e exige ID.
Sem `cliente_id`, um e-mail que identifica um único cliente reaproveita esse
cadastro. E-mail presente em vários cadastros, ou nome já existente sem e-mail,
resulta em `409` e exige seleção explícita. Nomes iguais com e-mails diferentes
não são vinculados automaticamente.

Body PUT: `{status, diagnostico}`. Após a conclusão ou o cancelamento não é possível alterar a ordem. A exclusão depende de a OS estar encerrada.

## Interações

| Método | Rota | Papel |
|---|---|---|
| GET | `/api/ordens/:id/interacoes` | conforme vínculo |
| POST | `/api/ordens/:id/interacoes` | conforme vínculo |

Body: `{canal: "Nota"|"WhatsApp"|"Atualização", mensagem}`
Cliente sempre grava como `Atualização`. `Nota` é interna, não aparece no portal do cliente; `WhatsApp` e `Atualização` são públicas. Interações não podem ser adicionadas a OS encerradas.

## Usuários (admin)

| Método | Rota |
|---|---|
| GET | `/api/usuarios` |
| POST | `/api/usuarios` |
| PATCH | `/api/usuarios/:id/status` |

## Dashboard

`GET /api/dashboard` — admin e funcionario. Retorna `total_os`, `os_abertas`,
`em_execucao`, `concluidas`, `alta_prioridade`, `aguardando_48h`,
`sem_responsavel`, `distribuicao` e `atualizado_em`, de acordo com a fila visível ao perfil.

## Códigos de resposta

200, 201, 400, 401, 403, 404, 409, 413, 500 — sempre em `{erro: "..."}`.
