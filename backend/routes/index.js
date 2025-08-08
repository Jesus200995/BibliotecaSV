// routes/index.js - Archivo para centralizar todas las rutas del API

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

// Configuración de la conexión a PostgreSQL (desde variables de entorno)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Middleware para verificar token JWT
function verificarToken(req, res, next) {
  console.log('index.js - Verificando token para ruta:', req.originalUrl);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    console.log('index.js - No se proporcionó token, saltando verificación');
    // En lugar de devolver un error, continuamos sin token
    // Esto permite que las rutas públicas funcionen
    req.usuario = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      console.log('index.js - Token inválido:', err.message);
      // En lugar de devolver un error, continuamos sin token
      req.usuario = null;
      return next();
    }
    console.log('index.js - Token válido para usuario:', usuario.usuario);
    req.usuario = usuario;
    next();
  });
}

// Ruta para verificar que el router está funcionando
router.get('/router-status', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Router centralizado funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Rutas de usuarios
// Endpoint para obtener todos los usuarios - Acceso público temporal
router.get('/usuarios', async (req, res) => {
  console.log('=== GET /usuarios (desde router centralizado) ===');
  
  try {
    // Solo mostrar información segura (sin contraseñas)
    const query = `
      SELECT id, usuario, rol, activo, fecha_creacion
      FROM usuarios 
      ORDER BY id
    `;
    
    const result = await pool.query(query);
    
    console.log(`Usuarios encontrados: ${result.rows.length}`);
    res.json(result.rows);
    
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Endpoint para obtener un usuario específico
router.get('/usuarios/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT id, usuario, rol, activo, fecha_creacion
      FROM usuarios 
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(result.rows[0]);
    
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

module.exports = router;
