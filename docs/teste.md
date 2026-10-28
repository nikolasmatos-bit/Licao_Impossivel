# Testes — Sprint 3

## Ferramenta

`node:test` (built-in do Node 20). Roda com `npm test`.

Sobe um servidor isolado em `127.0.0.1:3987` apontando para SQLite temporário. Ao final, o banco é apagado.

## Cobertura

| # | Cenário | Tipo |
|---|---|---|
| 1 | `/api/auth/status` antes do setup → `configurado=false` | integração |
| 2 | Setup cria admin e emite cookie | integração |
| 3 | Segundo setup é rejeitado (409) | integração |
| 4 | `/api/auth/me` retorna admin | integração |
| 5 | Criação de cliente | integração |
| 6 | Criação de técnico | integração |
| 7 | Atualização de técnico via PUT | integração |
| 8 | Criação de OS | integração |
| 9 | Payload inválido → 400 | validação |
| 10 | Listagem de OS | integração |
| 11 | Atualização de status | integração |
| 12 | Nota interna no histórico | integração |
| 13 | DELETE de OS aberta → 409 | regra de negócio |
| 14 | DELETE de OS concluída → 200 | regra de negócio |
| 15 | DELETE de técnico sem OS | integração |
| 16 | Logout | integração |
| 17 | `/api/auth/me` após logout → 401 | integração |

## Testes manuais complementares

- Login como admin → dashboard com métricas
- Login como funcionario → vê só suas OS
- Login como cliente → redireciona para portal
- Cliente não acessa `/dashboard.html`
- Cliente não vê notas internas
- Busca e filtros funcionam combinados
- Modal de confirmação bloqueia OS encerrada

## Fora do escopo

- Testes de carga
- Acessibilidade WCAG formalizada
- Cross-browser além de Chrome/Edge/Firefox atuais