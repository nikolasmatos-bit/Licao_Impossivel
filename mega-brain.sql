CREATE TABLE IF NOT EXISTS clientes (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	nome TEXT NOT NULL,
	telefone TEXT,
	email TEXT
);

CREATE TABLE IF NOT EXISTS tecnicos (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	nome TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	telefone TEXT NOT NULL,
	especialidade TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ordens_servico (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	cliente_id INTEGER NOT NULL REFERENCES clientes(id),
	tecnico_id INTEGER REFERENCES tecnicos(id),
	equipamento TEXT NOT NULL,
	prioridade TEXT NOT NULL DEFAULT 'Média' CHECK (prioridade IN ('Baixa', 'Média', 'Alta')),
	status TEXT NOT NULL DEFAULT 'Aberta' CHECK (status IN ('Aberta', 'Em execução', 'Concluída', 'Cancelada')),
	descricao TEXT NOT NULL,
	diagnostico TEXT,
	aberta_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	fechada_em TEXT
);

CREATE TABLE IF NOT EXISTS usuarios (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	nome TEXT NOT NULL,
	email TEXT NOT NULL COLLATE NOCASE UNIQUE,
	senha_hash TEXT NOT NULL,
	papel TEXT NOT NULL CHECK (papel IN ('admin', 'funcionario', 'cliente')),
	cliente_id INTEGER REFERENCES clientes(id),
	tecnico_id INTEGER REFERENCES tecnicos(id),
	ativo INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1)),
	criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessoes (
	token_hash TEXT PRIMARY KEY,
	usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
	expira_em INTEGER NOT NULL,
	criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interacoes_cliente (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	ordem_id INTEGER NOT NULL REFERENCES ordens_servico(id) ON DELETE CASCADE,
	autor_id INTEGER REFERENCES usuarios(id),
	canal TEXT NOT NULL DEFAULT 'Nota' CHECK (canal IN ('Nota', 'WhatsApp', 'Atualização')),
	visibilidade TEXT NOT NULL DEFAULT 'publica' CHECK (visibilidade IN ('interna', 'publica')),
	mensagem TEXT NOT NULL,
	criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_interacoes_ordem ON interacoes_cliente(ordem_id, criado_em DESC);