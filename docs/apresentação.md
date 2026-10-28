# Roteiro de apresentação (12 min)

## 1. Abertura (1 min)
"Bom dia, sou [nome] e vou apresentar o **Megabrain Services** — sistema de ordens de serviço para assistência técnica. Cobre da criação da OS pelo funcionário até o cliente acompanhar pelo portal."

## 2. Problema (1 min)
Planilha + WhatsApp perde histórico e gera ligações repetidas. Solução: 3 atores (admin, funcionário, cliente) com persistência em banco.

Mostrar: `dashboard.html`, `lista.html`, `portal-cliente.html`.

## 3. Arquitetura (2 min)
Node 20 + Express 5 + SQLite + HTML/CSS/JS puro. Sem ORM, SQL explícito.

Mostrar o diagrama de `docs/ARQUITETURA.md`.

Autenticação: cookie HttpOnly + SameSite=Strict, senha com `scrypt`.

## 4. Demo (5 min)
1. Setup inicial em `index.html`
2. Login admin → painel zerado
3. Cadastrar técnico
4. Criar OS (datalist, validação, botão Google)
5. Listar OS com filtros
6. Abrir OS, mudar para Em execução, salvar diagnóstico, registrar nota interna
7. Criar conta de cliente em `usuarios.html`
8. Login cliente → portal → **mostrar que nota interna não aparece**
9. Login admin → Concluir atendimento → campos bloqueados

## 5. Testes (2 min)
`npm test` ao vivo (17 testes de integração, ~3s).
Mencionar validações manuais.

## 6. Desafios (1 min)
- Express 5 muda comportamento de `req.body`
- Validação antes do SQL evita 500
- Sessão em cookie > JWT em localStorage

## 7. Encerramento (1 min)
"Repositório completo: front integrado, back REST, banco, CRUD completo, docs, diagramas e testes. Dúvidas?"

## Perguntas prováveis

| Pergunta | Resposta |
|---|---|
| Por que não React? | Escopo pedagógico: DOM e fetch |
| Como isola OS por cliente? | `podeAcessarOrdem()` checa `cliente_id` |
| Onde fica o hash de senha? | `crypto.scryptSync` com salt 16 bytes |
| Se o servidor cair? | Sessões em SQLite persistem; limpeza horária |
| Rodar em outra máquina? | `npm install && npm start` |
| Risco de dois clientes com mesmo nome? | Sim — POST /ordens cria por nome. Limitação documentada |
| Por que SQLite? | Portabilidade, sem servidor de banco |