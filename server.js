const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// CONEXÃO COM O BANCO DE DADOS
// ==========================================
const db = mysql.createPool({
    host: 'localhost',
    user: 'aluno',       // 👈 Usuário que criamos
    password: '123456',  // 👈 Senha que definimos
    database: 'os_system'
});

// Teste automático de conexão
db.query('SELECT 1 + 1 AS result', (err) => {
    if (err) {
        console.error('❌ Erro ao conectar no MySQL:', err.message);
    } else {
        console.log('✅ Conectado ao banco de dados MySQL com sucesso!');
    }
});

// ==========================================
// ROTAS DA API
// ==========================================

// 0. Rota de teste
app.get('/api/teste', (req, res) => {
    db.query("SELECT nome FROM tecnicos", (erro, resultados) => {
        if (erro) return res.status(500).json({ erro: erro.message });
        res.json(resultados);
    });
});

// 1. Listar todas as ordens (lista.html)
app.get('/api/ordens', (req, res) => {
    const sql = `
        SELECT o.id, c.nome AS cliente, t.nome AS tecnico, 
               o.equipamento, o.prioridade, o.status, o.descricao,
               o.aberta_em
        FROM ordens_servico o
        JOIN clientes c ON c.id = o.cliente_id
        LEFT JOIN tecnicos t ON t.id = o.tecnico_id
        ORDER BY o.id DESC
    `;
    db.query(sql, (erro, resultados) => {
        if (erro) return res.status(500).json({ erro: erro.message });
        res.json(resultados);
    });
});

// 2. Buscar uma ordem específica (detalhes.html)
app.get('/api/ordens/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT o.*, c.nome AS cliente, t.nome AS tecnico 
        FROM ordens_servico o
        JOIN clientes c ON c.id = o.cliente_id
        LEFT JOIN tecnicos t ON t.id = o.tecnico_id
        WHERE o.id = ?
    `;
    db.query(sql, [id], (erro, resultados) => {
        if (erro) return res.status(500).json({ erro: erro.message });
        if (resultados.length === 0) return res.status(404).json({ erro: 'OS não encontrada' });
        res.json(resultados[0]);
    });
});

// 3. Cadastrar nova ordem (cadastros.html)
app.post('/api/ordens', (req, res) => {
    const { cliente_nome, equipamento, tecnico_nome, prioridade, descricao } = req.body;

    db.query("SELECT id FROM clientes WHERE nome = ?", [cliente_nome], (erro, clienteRes) => {
        if (erro) return res.status(500).json({ erro: erro.message });
        
        let cliente_id = clienteRes.length > 0 ? clienteRes[0].id : null;
        
        if (!cliente_id) {
            db.query("INSERT INTO clientes (nome) VALUES (?)", [cliente_nome], (err, result) => {
                if (err) return res.status(500).json({ erro: err.message });
                cliente_id = result.insertId;
                buscarTecnico(cliente_id);
            });
        } else {
            buscarTecnico(cliente_id);
        }

        function buscarTecnico(c_id) {
            if (!tecnico_nome) return inserirOS(c_id, null);

            db.query("SELECT id FROM tecnicos WHERE nome = ?", [tecnico_nome], (erro, tecRes) => {
                if (erro) return res.status(500).json({ erro: erro.message });
                let tecnico_id = tecRes.length > 0 ? tecRes[0].id : null;
                
                if (!tecnico_id) {
                    db.query("INSERT INTO tecnicos (nome, email, telefone, especialidade) VALUES (?, ?, '0000', 'Geral')", 
                        [tecnico_nome, tecnico_nome.toLowerCase().replace(/\s/g, '') + '@temp.com'], 
                        (errTec, resTec) => {
                            if (errTec) return res.status(500).json({ erro: errTec.message });
                            tecnico_id = resTec.insertId;
                            inserirOS(c_id, tecnico_id);
                        });
                } else {
                    inserirOS(c_id, tecnico_id);
                }
            });
        }

        function inserirOS(c_id, t_id) {
            const sqlInsert = `
                INSERT INTO ordens_servico 
                (cliente_id, tecnico_id, equipamento, prioridade, descricao, status) 
                VALUES (?, ?, ?, ?, ?, 'Aberta')
            `;
            db.query(sqlInsert, [c_id, t_id, equipamento, prioridade, descricao], (erro, result) => {
                if (erro) return res.status(500).json({ erro: erro.message });
                res.json({ mensagem: 'OS criada com sucesso!', id: result.insertId });
            });
        }
    });
});

// 4. Atualizar status e diagnóstico da OS (detalhes.html)
app.put('/api/ordens/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, diagnostico } = req.body;
    
    const sql = `
        UPDATE ordens_servico 
        SET status = ?, 
            diagnostico = ?, 
            fechada_em = IF(? IN ('Concluída','Cancelada'), NOW(), NULL) 
        WHERE id = ?
    `;
    db.query(sql, [status, diagnostico, status, id], (erro) => {
        if (erro) return res.status(500).json({ erro: erro.message });
        res.json({ mensagem: 'OS atualizada com sucesso!' });
    });
});

// 5. Listar técnicos (para o datalist)
app.get('/api/tecnicos', (req, res) => {
    db.query("SELECT nome FROM tecnicos ORDER BY nome ASC", (erro, resultados) => {
        if (erro) return res.status(500).json({ erro: erro.message });
        res.json(resultados);
    });
});

// 6. Cadastrar técnico (tecnicos.html)
app.post('/api/tecnicos', (req, res) => {
    const { nome, email, telefone, especialidade } = req.body;

    db.query("SELECT id FROM tecnicos WHERE email = ?", [email], (erro, resultados) => {
        if (erro) return res.status(500).json({ erro: erro.message });
        if (resultados.length > 0) {
            return res.status(400).json({ erro: 'Este e-mail já está cadastrado.' });
        }

        db.query(
            "INSERT INTO tecnicos (nome, email, telefone, especialidade) VALUES (?, ?, ?, ?)",
            [nome, email, telefone, especialidade],
            (erro, result) => {
                if (erro) return res.status(500).json({ erro: erro.message });
                res.json({ mensagem: 'Técnico cadastrado!', id: result.insertId });
            }
        );
    });
});

// 7. Listar todos os técnicos completos (tecnicos.html)
app.get('/api/tecnicos/lista', (req, res) => {
    db.query("SELECT nome, email, telefone, especialidade FROM tecnicos ORDER BY nome ASC", (erro, resultados) => {
        if (erro) return res.status(500).json({ erro: erro.message });
        res.json(resultados);
    });
});

// 8. Contadores do Dashboard
app.get('/api/dashboard', (req, res) => {
    db.query("SELECT * FROM vw_dashboard", (erro, resultados) => {
        if (erro) return res.status(500).json({ erro: erro.message });
        res.json(resultados[0]);
    });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});