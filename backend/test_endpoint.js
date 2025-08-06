// Test simple para verificar el endpoint POST /api/usuarios
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 4000;

// Configurar CORS
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Configuración de BD
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Middleware de verificación de token
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.usuario = usuario;
    next();
  });
}

// Health check
app.get('/api/health', (req, res) => {
  console.log('Health check solicitado');
  res.json({ status: 'ok', message: 'Servidor de prueba funcionando' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  console.log('=== POST /api/login ===');
  
  try {
    const { usuario, contrasena } = req.body;
    
    if (!usuario || !contrasena) {
      return res.status(400).json({ 
        success: false, 
        error: 'Usuario y contraseña son requeridos' 
      });
    }

    const query = `
      SELECT id, usuario, contrasena, rol, activo 
      FROM usuarios 
      WHERE usuario = $1 AND activo = true
    `;
    
    const result = await pool.query(query, [usuario]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: 'Usuario o contraseña incorrectos' 
      });
    }
    
    const usuarioData = result.rows[0];
    
    // Verificar contraseña
    let contraseñaValida = false;
    
    try {
      contraseñaValida = await bcrypt.compare(contrasena, usuarioData.contrasena);
    } catch (bcryptError) {
      contraseñaValida = contrasena === usuarioData.contrasena;
    }
    
    if (!contraseñaValida) {
      return res.status(401).json({ 
        success: false, 
        error: 'Usuario o contraseña incorrectos' 
      });
    }
    
    const token = jwt.sign(
      { 
        id: usuarioData.id, 
        usuario: usuarioData.usuario, 
        rol: usuarioData.rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      token,
      usuario: {
        id: usuarioData.id,
        usuario: usuarioData.usuario,
        rol: usuarioData.rol
      }
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// GET usuarios
app.get('/api/usuarios', verificarToken, async (req, res) => {
  console.log('=== GET /api/usuarios ===');
  console.log('Usuario autenticado:', req.usuario);
  
  try {
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Acceso denegado' 
      });
    }

    const query = `SELECT id, usuario, rol, activo FROM usuarios ORDER BY usuario ASC`;
    const result = await pool.query(query);
    
    console.log('Usuarios encontrados:', result.rows.length);
    
    res.json({
      success: true,
      usuarios: result.rows
    });
    
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// POST usuarios - ESTE ES EL ENDPOINT QUE NECESITAMOS
app.post('/api/usuarios', verificarToken, async (req, res) => {
  console.log('=== POST /api/usuarios ===');
  console.log('Usuario autenticado:', req.usuario);
  console.log('Datos recibidos:', req.body);
  
  try {
    // Verificar que el usuario sea admin
    if (req.usuario.rol !== 'admin') {
      console.log('Acceso denegado - rol:', req.usuario.rol);
      return res.status(403).json({ 
        success: false, 
        error: 'Acceso denegado. Solo administradores pueden crear usuarios.' 
      });
    }

    const { usuario, contrasena, rol, activo } = req.body;
    
    // Validar campos requeridos
    if (!usuario || !contrasena || !rol) {
      return res.status(400).json({
        success: false,
        error: 'Usuario, contraseña y rol son requeridos'
      });
    }
    
    // Validar que el rol sea válido
    if (!['admin', 'user'].includes(rol)) {
      return res.status(400).json({
        success: false,
        error: 'El rol debe ser "admin" o "user"'
      });
    }
    
    // Verificar si el usuario ya existe
    const checkQuery = 'SELECT id FROM usuarios WHERE usuario = $1';
    const checkResult = await pool.query(checkQuery, [usuario]);
    
    if (checkResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'El usuario ya existe'
      });
    }
    
    console.log('Encriptando contraseña...');
    
    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);
    
    console.log('Insertando nuevo usuario en la base de datos...');
    
    // Insertar el nuevo usuario
    const insertQuery = `
      INSERT INTO usuarios (usuario, contrasena, rol, activo)
      VALUES ($1, $2, $3, $4)
      RETURNING id, usuario, rol, activo
    `;
    
    const insertResult = await pool.query(insertQuery, [
      usuario, 
      hashedPassword, 
      rol, 
      activo !== undefined ? activo : true
    ]);
    
    const nuevoUsuario = insertResult.rows[0];
    
    console.log('Usuario creado exitosamente:', nuevoUsuario);
    
    res.json({
      success: true,
      message: 'Usuario creado exitosamente',
      usuario: nuevoUsuario
    });
    
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de prueba corriendo en http://localhost:${PORT}`);
  console.log('Endpoints disponibles:');
  console.log('- GET /api/health');
  console.log('- POST /api/login');
  console.log('- GET /api/usuarios');
  console.log('- POST /api/usuarios');
});
