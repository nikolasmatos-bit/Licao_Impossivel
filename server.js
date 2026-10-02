require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mysql = require('mysql2/promise');

const requiredSettings = ['DB_HOST', 'DB_USER', 'DB_NAME'];
const missingSettings = requiredSettings.filter(function (name) {
    return !process.env[name];
});

if (missingSettings.length > 0) {
    console.error('Configure estas opções no arquivo .env: ' + missingSettings.join(', '));
    process.exit(1);
}

const app = express();
const port = Number(process.env.PORT || 3000);
const allowedOrigins = (process.env.FRONTEND_ORIGINS || '')
    .split(',')
    .map(function (origin) { return origin.trim(); })
    .filter(Boolean);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
    charset: 'utf8mb4'
});

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error('Origem não permitida.'));
    }
}));
app.use(express.json({ limit: '100kb' }));

function asyncRoute(handler) {
    return function (request, response, next) {
        Promise.resolve(handler(request, response, next)).catch(next);
    };
}

function text(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function isPositiveId(value) {
    return Number.isInteger(Number(value)) && Number(value) > 0;
}

function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    return new Date(value + 'T00:00:00.000Z').toISOString().slice(0, 10) === value;
}

function today() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

const orderSelect = `
    SELECT
        o.id,
        o.cliente,
        o.equipamento,
        o.tecnico_id AS tecnicoId,
        t.nome AS tecnico,
        o.prioridade,
        o.descricao,
        o.status,
        o.data,
        o.diagnostico
    FROM ordens o
    LEFT JOIN tecnicos t ON t.id = o.tecnico_id`;

async function findOrder(id) {
    const [rows] = await pool.execute(orderSelect + ' WHERE o.id = ?', [id]);
    return rows[0];
}

app.get('/api/health', asyncRoute(async function (request, response) {
    await pool.query('SELECT 1');
    response.json({ status: 'ok', banco: 'conectado' });
}));

app.get('/api/tecnicos', asyncRoute(async function (request, response) {
    const [rows] = await pool.execute(
        'SELECT id, nome, email, telefone, especialidade FROM tecnicos ORDER BY nome'
    );
    response.json(rows);
}));

app.post('/api/tecnicos', asyncRoute(async function (request, response) {
    const tecnico = {
        nome: text(request.body.nome),
        email: text(request.body.email).toLowerCase(),
        telefone: text(request.body.telefone),
        especialidade: text(request.body.especialidade)
    };

    if (!tecnico.nome || !tecnico.email || !tecnico.telefone || !tecnico.especialidade) {
        response.status(400).json({ erro: 'Preencha todos os dados do técnico.' });
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tecnico.email)) {
        response.status(400).json({ erro: 'Digite um e-mail válido.' });
        return;
    }

    const phoneDigits = tecnico.telefone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        response.status(400).json({ erro: 'O telefone deve ter 10 ou 11 números.' });
        return;
    }

    const [result] = await pool.execute(
        'INSERT INTO tecnicos (nome, email, telefone, especialidade) VALUES (?, ?, ?, ?)',
        [tecnico.nome, tecnico.email, tecnico.telefone, tecnico.especialidade]
    );

    response.status(201).json({ id: result.insertId, ...tecnico });
}));

app.get('/api/ordens', asyncRoute(async function (request, response) {
    const search = text(request.query.busca);
    const where = search
        ? " WHERE CONCAT_WS(' ', o.cliente, o.equipamento, t.nome, o.prioridade, o.status) LIKE ?"
        : '';
    const values = search ? ['%' + search + '%'] : [];
    const [rows] = await pool.execute(orderSelect + where + ' ORDER BY o.id DESC', values);
    response.json(rows);
}));

app.post('/api/ordens', asyncRoute(async function (request, response) {
    const cliente = text(request.body.cliente);
    const equipamento = text(request.body.equipamento);
    const descricao = text(request.body.descricao);
    const prioridade = text(request.body.prioridade) || 'Média';
    const data = text(request.body.data) || today();
    const tecnicoIdInput = request.body.tecnicoId;
    const tecnicoId = tecnicoIdInput === undefined || tecnicoIdInput === null || tecnicoIdInput === ''
        ? null
        : Number(tecnicoIdInput);
    const priorities = ['Baixa', 'Média', 'Alta'];

    if (!cliente || !equipamento || descricao.length < 10) {
        response.status(400).json({ erro: 'Informe cliente, aparelho e problema com pelo menos 10 caracteres.' });
        return;
    }

    if (!priorities.includes(prioridade)) {
        response.status(400).json({ erro: 'A urgência deve ser Baixa, Média ou Alta.' });
        return;
    }

    if (tecnicoId !== null && !isPositiveId(tecnicoId)) {
        response.status(400).json({ erro: 'O ID do técnico é inválido.' });
        return;
    }

    if (!isValidDate(data)) {
        response.status(400).json({ erro: 'A data deve estar no formato AAAA-MM-DD.' });
        return;
    }

    const [result] = await pool.execute(
        `INSERT INTO ordens (cliente, equipamento, tecnico_id, prioridade, descricao, status, data)
         VALUES (?, ?, ?, ?, ?, 'Aberta', ?)`,
        [cliente, equipamento, tecnicoId, prioridade, descricao, data]
    );

    response.status(201).json(await findOrder(result.insertId));
}));

app.get('/api/ordens/:id', asyncRoute(async function (request, response) {
    if (!isPositiveId(request.params.id)) {
        response.status(400).json({ erro: 'O número do serviço é inválido.' });
        return;
    }

    const ordem = await findOrder(Number(request.params.id));
    if (!ordem) {
        response.status(404).json({ erro: 'Serviço não encontrado.' });
        return;
    }

    response.json(ordem);
}));

app.patch('/api/ordens/:id', asyncRoute(async function (request, response) {
    if (!isPositiveId(request.params.id)) {
        response.status(400).json({ erro: 'O número do serviço é inválido.' });
        return;
    }

    const status = text(request.body.status);
    const diagnostico = text(request.body.diagnostico);
    const statuses = ['Aberta', 'Em execução', 'Concluída', 'Cancelada'];

    if (!statuses.includes(status)) {
        response.status(400).json({ erro: 'A situação informada não é válida.' });
        return;
    }

    const id = Number(request.params.id);
    const [result] = await pool.execute(
        `UPDATE ordens
         SET status = ?, diagnostico = ?
         WHERE id = ? AND status NOT IN ('Concluída', 'Cancelada')`,
        [status, diagnostico || null, id]
    );

    if (result.affectedRows === 0) {
        const ordemAtual = await findOrder(id);
        if (!ordemAtual) {
            response.status(404).json({ erro: 'Serviço não encontrado.' });
            return;
        }

        response.status(409).json({ erro: 'Esse serviço já foi concluído ou cancelado.' });
        return;
    }

    response.json(await findOrder(id));
}));

app.use(function (request, response) {
    response.status(404).json({ erro: 'Rota não encontrada.' });
});

app.use(function (error, request, response, next) {
    if (error.code === 'ER_DUP_ENTRY') {
        response.status(409).json({ erro: 'Já existe um técnico com esse e-mail.' });
        return;
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        response.status(400).json({ erro: 'O técnico informado não existe.' });
        return;
    }

    if (error.type === 'entity.parse.failed') {
        response.status(400).json({ erro: 'O corpo da requisição precisa ser um JSON válido.' });
        return;
    }

    console.error(error);
    response.status(500).json({ erro: 'Não foi possível concluir a operação.' });
});

async function start() {
    try {
        await pool.query('SELECT 1');
        app.listen(port, '127.0.0.1', function () {
            console.log('API disponível em http://127.0.0.1:' + port);
        });
    } catch (error) {
        console.error('Não foi possível conectar ao MySQL. Confira o arquivo .env e o banco os_system.');
        console.error(error.message);
        await pool.end();
        process.exitCode = 1;
    }
}

start();