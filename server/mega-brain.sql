-- database: os_system.sqlite
-- Cria a tabela clientes apenas se ela ainda não existir; evita apagar registros já cadastrados.
CREATE TABLE IF NOT EXISTS clientes (
-- Identificador único e autoincremental do registro. PRIMARY KEY é chave única; AUTOINCREMENT gera números automaticamente.
	id INTEGER PRIMARY KEY AUTOINCREMENT,
-- Nome da pessoa ou cadastro. NOT NULL proíbe ausência de valor.
	nome TEXT NOT NULL,
-- Telefone de contato.
	telefone TEXT,
-- Endereço de e-mail.
	email TEXT
-- Encerra a definição da tabela clientes e confirma seus campos e restrições.
);

-- Cria a tabela tecnicos apenas se ela ainda não existir; evita apagar registros já cadastrados.
CREATE TABLE IF NOT EXISTS tecnicos (
-- Identificador único e autoincremental do registro. PRIMARY KEY é chave única; AUTOINCREMENT gera números automaticamente.
	id INTEGER PRIMARY KEY AUTOINCREMENT,
-- Nome da pessoa ou cadastro. NOT NULL proíbe ausência de valor.
	nome TEXT NOT NULL,
-- Endereço de e-mail. NOT NULL proíbe ausência de valor. UNIQUE impede duplicidade.
	email TEXT NOT NULL UNIQUE,
-- Telefone de contato. NOT NULL proíbe ausência de valor.
	telefone TEXT NOT NULL,
-- Área de atuação do técnico. NOT NULL proíbe ausência de valor.
	especialidade TEXT NOT NULL
-- Encerra a definição da tabela tecnicos e confirma seus campos e restrições.
);

-- Cria a tabela ordens_servico apenas se ela ainda não existir; evita apagar registros já cadastrados.
CREATE TABLE IF NOT EXISTS ordens_servico (
-- Identificador único e autoincremental do registro. PRIMARY KEY é chave única; AUTOINCREMENT gera números automaticamente.
	id INTEGER PRIMARY KEY AUTOINCREMENT,
-- Chave estrangeira para associar o cliente cadastrado. NOT NULL proíbe ausência de valor. REFERENCES garante relacionamento com outra tabela.
	cliente_id INTEGER NOT NULL REFERENCES clientes(id),
-- Chave estrangeira para associar o técnico responsável. REFERENCES garante relacionamento com outra tabela.
	tecnico_id INTEGER REFERENCES tecnicos(id),
-- Equipamento que precisa de atendimento. NOT NULL proíbe ausência de valor.
	equipamento TEXT NOT NULL,
-- Nível de urgência aceito pela aplicação. NOT NULL proíbe ausência de valor. CHECK restringe os valores permitidos. DEFAULT fornece valor automático quando omitido.
	prioridade TEXT NOT NULL DEFAULT 'Média' CHECK (prioridade IN ('Baixa', 'Média', 'Alta')),
-- Etapa atual da ordem de serviço. NOT NULL proíbe ausência de valor. CHECK restringe os valores permitidos. DEFAULT fornece valor automático quando omitido.
	status TEXT NOT NULL DEFAULT 'Aberta' CHECK (status IN ('Aberta', 'Em execução', 'Concluída', 'Cancelada')),
-- Descrição do defeito relatado. NOT NULL proíbe ausência de valor.
	descricao TEXT NOT NULL,
-- Diagnóstico e solução informados pelo técnico.
	diagnostico TEXT,
-- Momento da abertura da ordem. NOT NULL proíbe ausência de valor. DEFAULT fornece valor automático quando omitido.
	aberta_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
-- Momento em que a ordem foi encerrada.
	fechada_em TEXT
-- Encerra a definição da tabela ordens_servico e confirma seus campos e restrições.
);

-- Cria a tabela usuarios apenas se ela ainda não existir; evita apagar registros já cadastrados.
CREATE TABLE IF NOT EXISTS usuarios (
-- Identificador único e autoincremental do registro. PRIMARY KEY é chave única; AUTOINCREMENT gera números automaticamente.
	id INTEGER PRIMARY KEY AUTOINCREMENT,
-- Nome da pessoa ou cadastro. NOT NULL proíbe ausência de valor.
	nome TEXT NOT NULL,
-- Endereço de e-mail. NOT NULL proíbe ausência de valor. UNIQUE impede duplicidade.
	email TEXT NOT NULL COLLATE NOCASE UNIQUE,
-- Representação protegida da senha; não armazena a senha em texto puro. NOT NULL proíbe ausência de valor.
	senha_hash TEXT NOT NULL,
-- Tipo/perfil de acesso do usuário. NOT NULL proíbe ausência de valor. CHECK restringe os valores permitidos.
	papel TEXT NOT NULL CHECK (papel IN ('admin', 'funcionario', 'cliente')),
-- Chave estrangeira para associar o cliente cadastrado. REFERENCES garante relacionamento com outra tabela.
	cliente_id INTEGER REFERENCES clientes(id),
-- Chave estrangeira para associar o técnico responsável. REFERENCES garante relacionamento com outra tabela.
	tecnico_id INTEGER REFERENCES tecnicos(id),
-- Indica se a conta está ativa (1) ou suspensa (0). NOT NULL proíbe ausência de valor. CHECK restringe os valores permitidos. DEFAULT fornece valor automático quando omitido.
	ativo INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1)),
-- Data e hora em que este registro foi criado. NOT NULL proíbe ausência de valor. DEFAULT fornece valor automático quando omitido.
	criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
-- Encerra a definição da tabela usuarios e confirma seus campos e restrições.
);

-- Cria a tabela sessoes apenas se ela ainda não existir; evita apagar registros já cadastrados.
CREATE TABLE IF NOT EXISTS sessoes (
-- Resumo criptográfico do token de sessão, usado sem guardar o token original.
	token_hash TEXT PRIMARY KEY,
-- Chave estrangeira que indica o usuário autenticado. NOT NULL proíbe ausência de valor. REFERENCES garante relacionamento com outra tabela.
	usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
-- Instante em que a sessão deixa de ser válida. NOT NULL proíbe ausência de valor.
	expira_em INTEGER NOT NULL,
-- Data e hora em que este registro foi criado. NOT NULL proíbe ausência de valor. DEFAULT fornece valor automático quando omitido.
	criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
-- Encerra a definição da tabela sessoes e confirma seus campos e restrições.
);

-- Cria a tabela interacoes_cliente apenas se ela ainda não existir; evita apagar registros já cadastrados.
CREATE TABLE IF NOT EXISTS interacoes_cliente (
-- Identificador único e autoincremental do registro. PRIMARY KEY é chave única; AUTOINCREMENT gera números automaticamente.
	id INTEGER PRIMARY KEY AUTOINCREMENT,
-- Chave estrangeira que identifica a ordem de serviço. NOT NULL proíbe ausência de valor. REFERENCES garante relacionamento com outra tabela.
	ordem_id INTEGER NOT NULL REFERENCES ordens_servico(id) ON DELETE CASCADE,
-- Usuário que escreveu o histórico. REFERENCES garante relacionamento com outra tabela.
	autor_id INTEGER REFERENCES usuarios(id),
-- Origem ou tipo de interação com a ordem. NOT NULL proíbe ausência de valor. CHECK restringe os valores permitidos. DEFAULT fornece valor automático quando omitido.
	canal TEXT NOT NULL DEFAULT 'Nota' CHECK (canal IN ('Nota', 'WhatsApp', 'Atualização')),
-- Define se a interação aparece ao cliente. NOT NULL proíbe ausência de valor. CHECK restringe os valores permitidos. DEFAULT fornece valor automático quando omitido.
	visibilidade TEXT NOT NULL DEFAULT 'publica' CHECK (visibilidade IN ('interna', 'publica')),
-- Conteúdo textual da interação. NOT NULL proíbe ausência de valor.
	mensagem TEXT NOT NULL,
-- Data e hora em que este registro foi criado. NOT NULL proíbe ausência de valor. DEFAULT fornece valor automático quando omitido.
	criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
-- Encerra a definição da tabela interacoes_cliente e confirma seus campos e restrições.
);

-- Cria um índice para acelerar a busca e a ordenação de interações por ordem de serviço.
CREATE INDEX IF NOT EXISTS idx_interacoes_ordem ON interacoes_cliente(ordem_id, criado_em DESC);