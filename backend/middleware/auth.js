const jwt = require('jsonwebtoken');

// Clave secreta para JWT (usar variable de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'biblioteca_secret_key_2025';

// Tiempo de expiración del token según el entorno
const TOKEN_EXPIRY = process.env.NODE_ENV === 'production' ? '1h' : '24h';

console.log(`🔐 Auth configurado - Entorno: ${process.env.NODE_ENV}, Expiración token: ${TOKEN_EXPIRY}`);

// Middleware para verificar autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Token de acceso requerido',
      message: 'No se proporcionó token de autenticación' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
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

module.exports = {
  authenticateToken,
  generateToken,
  JWT_SECRET
};