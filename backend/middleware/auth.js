const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Clave secreta para JWT (usar variable de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'biblioteca_secret_key_2025';

// Tiempo de expiración del token según el entorno
const TOKEN_EXPIRY = process.env.NODE_ENV === 'production' ? '1h' : '24h';

// Costo del hash para bcrypt
const SALT_ROUNDS = 10;

console.log(`🔐 Auth configurado - Entorno: ${process.env.NODE_ENV}, Expiración token: ${TOKEN_EXPIRY}`);

// Middleware para verificar autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Token de acceso requerido',
      message: 'No se proporcionó token de autenticación' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false,
        error: 'Token inválido',
        message: 'El token de autenticación no es válido o ha expirado' 
      });
    }
    
    req.user = user;
    next();
  });
};

// Función para generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      usuario: user.usuario, 
      rol: user.rol,
      iat: Math.floor(Date.now() / 1000) // timestamp de creación
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};

// Funciones para el manejo de contraseñas con bcrypt
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

// Función para crear usuario inicial con contraseña hasheada
const createInitialUser = async (pool) => {
  try {
    // Verificar si ya existe el usuario admin
    const checkQuery = "SELECT * FROM usuarios WHERE usuario = 'admin'";
    const checkResult = await pool.query(checkQuery);
    
    if (checkResult.rows.length === 0) {
      // Crear hash de la contraseña
      const hashedPassword = await hashPassword('admin123');
      
      // Insertar usuario admin
      const insertQuery = `
        INSERT INTO usuarios (usuario, contrasena, rol, activo) 
        VALUES ('admin', $1, 'admin', true)
        RETURNING id, usuario, rol
      `;
      
      await pool.query(insertQuery, [hashedPassword]);
      console.log('✅ Usuario admin creado correctamente');
    } else {
      console.log('ℹ️ Usuario admin ya existe');
    }
  } catch (error) {
    console.error('❌ Error al crear usuario admin:', error);
  }
};

module.exports = {
  authenticateToken,
  generateToken,
  hashPassword,
  comparePassword,
  createInitialUser,
  JWT_SECRET
};