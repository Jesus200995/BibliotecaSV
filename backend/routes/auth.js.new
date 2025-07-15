const express = require('express');
const { Pool } = require('pg');
const { generateToken, comparePassword, hashPassword, createInitialUser } = require('../middleware/auth');

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

// Inicializar usuario admin
createInitialUser(pool).catch(err => console.error('Error al inicializar usuario admin:', err));

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

    // Verificar contraseña con bcrypt
    let passwordValid;
    
    // Comprobar si la contraseña ya está hasheada
    if (user.contrasena.startsWith('$2')) {
      // Si ya está hasheada, usar bcrypt.compare
      passwordValid = await comparePassword(contrasena, user.contrasena);
    } else {
      // Para mantener compatibilidad con contraseñas antiguas sin hash
      passwordValid = user.contrasena === contrasena;
      
      // Si la contraseña es válida y no está hasheada, actualizarla con hash
      if (passwordValid) {
        const hashedPassword = await hashPassword(contrasena);
        await pool.query(
          'UPDATE usuarios SET contrasena = $1 WHERE id = $2',
          [hashedPassword, user.id]
        );
        console.log(`Contraseña actualizada con hash para usuario: ${usuario}`);
      }
    }

    if (!passwordValid) {
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
      error: 'token_no_proporcionado',
      message: 'No se proporcionó token de autenticación'
    });
  }
  
  try {
    // La verificación del token la hace el middleware authenticateToken
    // Si llegamos aquí, el token es válido
    res.json({
      success: true,
      message: 'Token válido',
      user: req.user
    });
  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno',
      message: 'Error al verificar el token'
    });
  }
});

// Endpoint para registrar nuevo usuario (solo admin puede crear usuarios)
router.post('/register', async (req, res) => {
  try {
    const { usuario, contrasena, rol } = req.body;
    
    // Validar datos
    if (!usuario || !contrasena) {
      return res.status(400).json({
        success: false,
        error: 'datos_incompletos',
        message: 'Todos los campos son requeridos'
      });
    }
    
    // Verificar si el usuario ya existe
    const checkQuery = 'SELECT id FROM usuarios WHERE usuario = $1';
    const checkResult = await pool.query(checkQuery, [usuario]);
    
    if (checkResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'usuario_existente',
        message: 'El nombre de usuario ya está en uso'
      });
    }
    
    // Generar hash de la contraseña
    const hashedPassword = await hashPassword(contrasena);
    
    // Insertar nuevo usuario
    const insertQuery = `
      INSERT INTO usuarios (usuario, contrasena, rol, activo)
      VALUES ($1, $2, $3, true)
      RETURNING id, usuario, rol, activo
    `;
    
    const newUserRole = rol || 'admin'; // Si no se especifica rol, será admin por defecto
    const result = await pool.query(insertQuery, [usuario, hashedPassword, newUserRole]);
    
    const newUser = result.rows[0];
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      user: {
        id: newUser.id,
        usuario: newUser.usuario,
        rol: newUser.rol,
        activo: newUser.activo
      }
    });
    
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'Error al procesar el registro de usuario'
    });
  }
});

module.exports = router;
