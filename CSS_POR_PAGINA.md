# CSS separado por página

Cada HTML carrega dois estilos, nesta ordem:

1. `css/base.css` — regras compartilhadas: cores, cabeçalho, menus, botões e formulários.
2. `css/<nome-da-pagina>.css` — estilos necessários àquela tela, inclusive regras
   de responsividade na ordem original.

| HTML | CSS específico |
| --- | --- |
| `index.html` | `index.css` |
| `dashboard.html` | `dashboard.css` |
| `cadastros.html` | `cadastros.css` |
| `lista.html` | `lista.css` |
| `detalhes.html` | `detalhes.css` |
| `tecnicos.html` | `tecnicos.css` |
| `clientes.html` | `clientes.css` |
| `usuarios.html` | `usuarios.css` |
| `portal-cliente.html` | `portal-cliente.css` |

As páginas continuam acessíveis nas mesmas URLs através do servidor.
Não foram modificados SQL, dados SQLite, funções de JavaScript ou rotas do servidor.
