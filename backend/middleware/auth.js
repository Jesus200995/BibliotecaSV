const jwt = require('jsonwebtoken');

// Clave secreta para JWT (en producción debería estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'biblioteca_secret_key_2025';

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
      rol: user.rol 
    },
    JWT_SECRET,
    { expiresIn: '24h' } // Token válido por 24 horas
  );
};

module.exports = {
  authenticateToken,
  generateToken,
  JWT_SECRET
};