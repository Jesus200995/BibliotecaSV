const express = require('express');
const { Pool } = require('pg');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// Configuración de la conexión a PostgreSQL (reutilizando la configuración del index.js)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Endpoint POST /api/login
router.post('/login', async (req, res) => {
  console.log('=== POST /api/login ===');
  console.log('URL completa:', req.originalUrl);
  console.log('Método:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body recibido:', req.body);
  
  try {
    const { usuario, contrasena } = req.body;

    // Validar que se proporcionen usuario y contraseña
    if (!usuario || !contrasena) {
      return res.status(400).json({
        success: false,
        error: 'Datos incompletos',
        message: 'Usuario y contraseña son requeridos'
      });
    }

    console.log(`Intentando autenticar usuario: ${usuario}`);

    // Buscar usuario en la base de datos
    const query = `
      SELECT id, usuario, contrasena, rol, activo 
      FROM usuarios 
      WHERE usuario = $1 AND activo = true
    `;
    
    const result = await pool.query(query, [usuario]);
    
    if (result.rows.length === 0) {
      console.log(`Usuario no encontrado o inactivo: ${usuario}`);
      return res.status(401).json({
        success: false,
        error: 'usuario_no_encontrado',
        message: 'El usuario ingresado no existe o está inactivo'
      });
    }

    const user = result.rows[0];
    console.log(`Usuario encontrado: ${user.usuario}, rol: ${user.rol}`);

    // Verificar contraseña (por ahora texto plano, preparado para hash en el futuro)
    // TODO: Implementar verificación con hash (bcrypt) en el futuro
    if (user.contrasena !== contrasena) {
      console.log(`Contraseña incorrecta para usuario: ${usuario}`);
      return res.status(401).json({
        success: false,
        error: 'contrasena_incorrecta',
        message: 'La contraseña ingresada es incorrecta'
      });
    }

    // Generar token JWT
    const token = generateToken(user);
    
    console.log(`Login exitoso para usuario: ${usuario}`);
    
    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Login exitoso',
      token: token,
      user: {
        id: user.id,
        usuario: user.usuario,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'Error al procesar la solicitud de login'
    });
  }
});

// Endpoint para verificar token (útil para validar sesión)
router.get('/verify', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token requerido',
      message: 'No se proporcionó token de autenticación'
    });
  }

  try {
    const jwt = require('jsonwebtoken');
    const { JWT_SECRET } = require('../middleware/auth');
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verificar que el usuario sigue activo en la base de datos
    const query = `
      SELECT id, usuario, rol, activo 
      FROM usuarios 
      WHERE id = $1 AND activo = true
    `;
    
    const result = await pool.query(query, [decoded.id]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Usuario inválido',
        message: 'El usuario ya no está activo'
      });
    }

    const user = result.rows[0];
    
    res.json({
      success: true,
      message: 'Token válido',
      user: {
        id: user.id,
        usuario: user.usuario,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(403).json({
      success: false,
      error: 'Token inválido',
      message: 'El token no es válido o ha expirado'
    });
  }
});

module.exports = router;