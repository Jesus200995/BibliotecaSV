const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

// Configuración de la conexión a PostgreSQL
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
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

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

// Middleware para verificar si es admin
function verificarAdmin(req, res, next) {
  if (!req.usuario || req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
  next();
}

// Endpoint para obtener todos los usuarios
router.get('/', verificarToken, async (req, res) => {
  console.log('=== GET /usuarios ===');
  
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
router.get('/:id', verificarToken, async (req, res) => {
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

// Endpoint para crear un nuevo usuario (solo admin)
router.post('/', [verificarToken, verificarAdmin], async (req, res) => {
  try {
    const { usuario, contrasena, rol, activo } = req.body;
    
    if (!usuario || !contrasena) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }
    
    // Validar rol
    const rolesValidos = ['admin', 'user', 'editor'];
    if (rol && !rolesValidos.includes(rol)) {
      return res.status(400).json({ error: 'Rol no válido' });
    }
    
    // Verificar si ya existe el usuario
    const checkQuery = 'SELECT id FROM usuarios WHERE usuario = $1';
    const checkResult = await pool.query(checkQuery, [usuario]);
    
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    
    // Crear nuevo usuario
    const query = `
      INSERT INTO usuarios (usuario, contrasena, rol, activo)
      VALUES ($1, $2, $3, $4)
      RETURNING id, usuario, rol, activo, fecha_creacion
    `;
    
    const result = await pool.query(query, [
      usuario, 
      contrasena, // Idealmente, esta contraseña debería estar hasheada
      rol || 'user', 
      activo === undefined ? true : activo
    ]);
    
    res.status(201).json(result.rows[0]);
    
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// Endpoint para actualizar un usuario (solo admin)
router.put('/:id', [verificarToken, verificarAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, contrasena, rol, activo } = req.body;
    
    // Verificar si existe el usuario
    const checkQuery = 'SELECT id FROM usuarios WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Validar rol
    const rolesValidos = ['admin', 'user', 'editor'];
    if (rol && !rolesValidos.includes(rol)) {
      return res.status(400).json({ error: 'Rol no válido' });
    }
    
    // Construir query dinámicamente según los campos a actualizar
    let fields = [];
    let values = [];
    let paramIndex = 1;
    
    if (usuario) {
      fields.push(`usuario = $${paramIndex}`);
      values.push(usuario);
      paramIndex++;
    }
    
    if (contrasena) {
      fields.push(`contrasena = $${paramIndex}`);
      values.push(contrasena); // Idealmente, esta contraseña debería estar hasheada
      paramIndex++;
    }
    
    if (rol) {
      fields.push(`rol = $${paramIndex}`);
      values.push(rol);
      paramIndex++;
    }
    
    if (activo !== undefined) {
      fields.push(`activo = $${paramIndex}`);
      values.push(activo);
      paramIndex++;
    }
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }
    
    // Añadir ID al final de los valores
    values.push(id);
    
    const query = `
      UPDATE usuarios 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, usuario, rol, activo, fecha_creacion
    `;
    
    const result = await pool.query(query, values);
    
    res.json(result.rows[0]);
    
  } catch (error) {
    console.error(`Error al actualizar usuario con ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// Endpoint para eliminar un usuario (solo admin)
router.delete('/:id', [verificarToken, verificarAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si es el último usuario admin
    if (req.usuario.id == id) {
      return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
    }
    
    // Verificar si existe el usuario
    const checkQuery = 'SELECT usuario, rol FROM usuarios WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    const usuarioAEliminar = checkResult.rows[0];
    
    // Si es un admin, verificar que no sea el último
    if (usuarioAEliminar.rol === 'admin') {
      const countAdmins = await pool.query('SELECT COUNT(*) FROM usuarios WHERE rol = $1', ['admin']);
      if (parseInt(countAdmins.rows[0].count) <= 1) {
        return res.status(400).json({ error: 'No se puede eliminar el último usuario administrador' });
      }
    }
    
    // Eliminar usuario
    const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING id, usuario, rol';
    const result = await pool.query(query, [id]);
    
    res.json({ 
      mensaje: 'Usuario eliminado correctamente', 
      usuario: result.rows[0]
    });
    
  } catch (error) {
    console.error(`Error al eliminar usuario con ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

module.exports = router;
