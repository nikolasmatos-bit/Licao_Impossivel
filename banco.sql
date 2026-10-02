CREATE DATABASE IF NOT EXISTS os_system
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE os_system;

CREATE TABLE IF NOT EXISTS tecnicos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    especialidade VARCHAR(120) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ordens (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cliente VARCHAR(120) NOT NULL,
    equipamento VARCHAR(160) NOT NULL,
    tecnico_id INT UNSIGNED NULL,
    prioridade ENUM('Baixa', 'Média', 'Alta') NOT NULL DEFAULT 'Média',
    descricao TEXT NOT NULL,
    status ENUM('Aberta', 'Em execução', 'Concluída', 'Cancelada') NOT NULL DEFAULT 'Aberta',
    data DATE NOT NULL,
    diagnostico TEXT NULL,
    CONSTRAINT fk_ordens_tecnicos
        FOREIGN KEY (tecnico_id) REFERENCES tecnicos(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB;