# OS System

Projeto demonstrativo para cadastrar e acompanhar ordens de serviço. Feito com HTML, CSS e JavaScript, sem servidor ou banco de dados externo.

## Como abrir

Abra o arquivo `index.html` no navegador. Para testar o armazenamento local com mais consistência, você também pode servir a pasta por um servidor local, como a extensão Live Server do VS Code.

Não é necessário instalar dependências. Os ícones usam Font Awesome por CDN, então precisam de internet para aparecer.

## Páginas

- `index.html`: tela de entrada.
- `dashboard.html`: resumo com números e nomes fictícios. Os dados são exemplos fixos e não mudam quando novas ordens são cadastradas.
- `cadastros.html`: cadastro de uma ordem de serviço. Se ainda não houver técnicos, são criados dois técnicos de exemplo para as sugestões.
- `lista.html`: lista e busca ordens por cliente, técnico, aparelho, urgência ou situação.
- `detalhes.html`: consulta uma ordem, salva uma resposta e permite alterar a situação. Ordens concluídas ou canceladas não podem mais ser alteradas.
- `tecnicos.html`: cadastro e consulta de técnicos. O telefone deve ter 10 ou 11 números e não é permitido repetir e-mail.
- `clientes.html`: área demonstrativa com dados de exemplo; não mostra os dados reais das ordens cadastradas.

## Dados e acesso

As ordens (`ordens`) e os técnicos (`tecnicos`) ficam no `localStorage` do navegador. Eles permanecem nesse navegador e nesse perfil, não são enviados para um servidor e não aparecem automaticamente em outro dispositivo.

### MySQL e API

O arquivo `banco.sql` cria o banco `os_system` e as tabelas `tecnicos` e `ordens`. Importe esse arquivo pelo phpMyAdmin ou pelo cliente MySQL antes de iniciar a API. Cada ordem aponta para um técnico pelo campo `tecnico_id`.

Foi criada uma API em Node.js no arquivo `server.js`. Para preparar o acesso:

1. Instale o Node.js 18 ou mais recente e o MySQL.
2. Importe `banco.sql` no MySQL.
3. Copie `.env.example` para `.env` e informe o usuário e a senha do seu MySQL.
4. No terminal, na pasta do projeto, execute `npm.cmd install` e depois `npm.cmd start`.
5. A API ficará disponível em `http://127.0.0.1:3000`.

Rotas disponíveis: `GET /api/health`, `GET` e `POST /api/tecnicos`, `GET /api/ordens`, `POST /api/ordens`, `GET /api/ordens/:id` e `PATCH /api/ordens/:id`. A busca de ordens aceita o parâmetro `busca`. A API permite acesso do Live Server nas origens configuradas por `FRONTEND_ORIGINS` no `.env`.

Importante: as páginas HTML ainda usam o `localStorage`; a API está pronta para receber chamadas, mas a interface ainda precisa ser alterada para usá-la. Esta API é para desenvolvimento local e não possui login de usuários.

A tela de entrada aceita qualquer e-mail válido e uma senha com pelo menos 4 caracteres. O acesso fica guardado na sessão do navegador. Isso é apenas uma demonstração: não há cadastro de contas nem proteção real de dados.

Para apagar os dados de teste, limpe o armazenamento local do site nas ferramentas de desenvolvimento do navegador. Isso remove as ordens e os técnicos salvos.

## Arquivos

- `banco.sql`: estrutura inicial das tabelas do MySQL.
- `server.js`: API Node.js para técnicos e ordens.
- `.env.example`: exemplo de configuração da conexão MySQL.
- `css/style.css`: estilos das páginas.
- `css/img/`: imagens usadas pelo projeto, se houver.