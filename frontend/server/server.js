import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURACIÓN DE LA BASE DE DATOS (XAMPP)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'local_explorer',
    charset: 'utf8mb4'
});

db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err.message);
        return;
    }
    console.log('✅ Conectado exitosamente a MySQL (local_explorer)');
});

// --- RUTA DE REGISTRO ---
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    const sql = "INSERT INTO usuarios (username, email, password_hash) VALUES (?, ?, ?)";
    db.query(sql, [username, email, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "El usuario o email ya existe" });
            return res.status(500).json({ message: "Error en la base de datos" });
        }
        res.status(201).json({ message: "Usuario creado", user: { id: result.insertId, username } });
    });
});

// --- RUTA DE LOGIN ---
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM usuarios WHERE email = ? AND password_hash = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).json({ message: "Error en el servidor" });
        if (result.length > 0) {
            res.status(200).json({ message: "Bienvenido", user: { id: result[0].id, username: result[0].username } });
        } else {
            res.status(401).json({ message: "Correo o contraseña incorrectos" });
        }
    });
});

// --- RUTAS DE LUGARES ---
app.get('/api/lugares', (req, res) => {
    db.query("SELECT * FROM lugares", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/lugares', (req, res) => {
    const { nombre, categoria, latitud, longitud, descripcion } = req.body;
    const sql = "INSERT INTO lugares (nombre, categoria, latitud, longitud, descripcion) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [nombre, categoria, latitud, longitud, descripcion], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, message: "Lugar creado" });
    });
});

app.delete('/api/lugares/:id', (req, res) => {
    db.query("DELETE FROM lugares WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Lugar eliminado" });
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`));