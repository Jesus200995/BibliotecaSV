require('dotenv').config();
const express = require('express');
// const cors = require('cors'); // Comentado - NGINX maneja CORS
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Cargar configuración local si existe
try {
  if (fs.existsSync(path.join(__dirname, '.env.local'))) {
    require('dotenv').config({ path: path.join(__dirname, '.env.local') });
    console.log('Cargada configuración local desde .env.local');
  }
} catch (err) {
  console.error('Error al cargar .env.local:', err);
}

// Imprimir información de conexión
console.log('Configuración de conexión a BD:');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Puerto: ${process.env.DB_PORT}`);
console.log(`Base de datos: ${process.env.DB_NAME}`);
console.log(`Usuario: ${process.env.DB_USER}`);
console.log(`Contraseña: ${process.env.DB_PASSWORD ? '******' : 'no configurada'}`);

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Configuración para almacenar archivos con multer (en memoria)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limitar a 50MB
  fileFilter: function (req, file, cb) {
    console.log('Intentando subir archivo:', file.originalname, file.mimetype);
    // Aceptar todos los tipos de archivo
    cb(null, true);
  }
});

const app = express();
const PORT = process.env.PORT || 4000;

// CORS deshabilitado - NGINX maneja CORS
// app.use(cors({
//   origin: [
//     'https://biblioteca.sembrandodatos.com', // dominio de producción
//     'http://localhost:5173',                 // desarrollo con Vite
//     'http://localhost:3000',                 // desarrollo alternativo
//     'http://127.0.0.1:5173'                  // desarrollo con IP local
//   ],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// }));

// Middleware para parsear JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// ============ MIDDLEWARE DE AUTENTICACIÓN ============

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

// ============ ENDPOINT DE LOGIN ============

// Endpoint de login
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

    // Consultar usuario en la base de datos
    const query = `
      SELECT id, usuario, contrasena, rol, activo 
      FROM usuarios 
      WHERE usuario = $1 AND activo = true
    `;
    
    const result = await pool.query(query, [usuario]);
    
    if (result.rows.length === 0) {
      console.log(`Intento de login fallido para usuario: ${usuario} (usuario no encontrado)`);
      return res.status(401).json({ 
        success: false, 
        error: 'Usuario o contraseña incorrectos' 
      });
    }
    
    const usuarioData = result.rows[0];
    
    // Verificar contraseña
    let contraseñaValida = false;
    
    // Intentar primero con bcrypt (contraseñas encriptadas)
    try {
      contraseñaValida = await bcrypt.compare(contrasena, usuarioData.contrasena);
    } catch (bcryptError) {
      // Si falla bcrypt, comparar como texto plano (backward compatibility)
      contraseñaValida = contrasena === usuarioData.contrasena;
    }
    
    if (!contraseñaValida) {
      console.log(`Intento de login fallido para usuario: ${usuario} (contraseña incorrecta)`);
      return res.status(401).json({ 
        success: false, 
        error: 'Usuario o contraseña incorrectos' 
      });
    }
    console.log(`Login exitoso para usuario: ${usuarioData.usuario}`);
    
    // Generar token JWT
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

// Endpoint para verificar token
app.get('/api/verify-token', verificarToken, (req, res) => {
  res.json({
    success: true,
    usuario: req.usuario
  });
});

// Función para determinar el tipo MIME basado en la extensión
function determinarContentType(tipo) {
  const mimeTypes = {
    'pdf': 'application/pdf',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain',
    'csv': 'text/csv',
    'zip': 'application/zip'
  };
  
  return mimeTypes[tipo.toLowerCase()] || 'application/octet-stream';
}

// ============ RUTAS PRINCIPALES ============

// Endpoint para verificar estado de conexión a la base de datos
app.get('/db-status', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      message: 'Conexión exitosa a la base de datos', 
      time: result.rows[0].now,
      config: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: process.env.DB_SSL === 'true'
      }
    });
  } catch (error) {
    console.error('Error al verificar conexión a BD:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error de conexión a la base de datos', 
      error: error.message 
    });
  }
});

// Endpoint para descargar archivos - DEBE IR ANTES DE LA RUTA GENÉRICA
app.get('/archivos/descargar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Solicitando descarga del archivo con ID: ${id}`);
    
    const query = `SELECT nombre, tipo, archivo_contenido, tamano FROM catalogo_archivos WHERE id = $1`;
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    const archivo = result.rows[0];
    
    if (!archivo.archivo_contenido) {
      return res.status(404).json({ error: 'El contenido del archivo no está disponible' });
    }
    
    const contentType = determinarContentType(archivo.tipo);
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(archivo.nombre)}"`);
    res.setHeader('Content-Length', archivo.tamano);
    
    console.log(`Enviando archivo ${archivo.nombre} (${archivo.tamano} bytes)`);
    res.send(archivo.archivo_contenido);
    
  } catch (error) {
    console.error('Error al descargar el archivo:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para upload de archivos - DEBE IR ANTES DE LA RUTA GENÉRICA
app.post('/archivos/upload', verificarToken, upload.single('file'), async (req, res) => {
  console.log('Recibida solicitud en /archivos/upload');
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }

    const archivo = req.file;
    const nombre = archivo.originalname;
    const tipo = path.extname(nombre).substring(1).toUpperCase();
    const fecha_actualizacion = new Date();
    const tamano = archivo.size;
    const archivo_url = Date.now() + '-' + nombre.replace(/[^a-zA-Z0-9\-_.]/g, '_');

    // Campos del formulario
    const descripcion = req.body.descripcion || '';
    const etiquetas = req.body.etiquetas || '';
    const responsable = req.body.responsable || '';
    const fuente = req.body.fuente || '';
    const alcance_geografico = req.body.alcance || '';
    const validacion = req.body.validacion || '';
    const observaciones = req.body.observaciones || '';
    
    // Procesar coordenadas
    let coordenadas_json = null;
    let latitud = null;
    let longitud = null;
    
    try {
      const coordenadas = req.body.coordenadas || req.body.alcance_coordenadas;
      if (coordenadas) {
        coordenadas_json = typeof coordenadas === 'string' ? JSON.parse(coordenadas) : coordenadas;
        
        if (Array.isArray(coordenadas_json) && coordenadas_json.length > 0) {
          const primeraUbicacion = coordenadas_json[0];
          if (primeraUbicacion.lat && primeraUbicacion.lon) {
            latitud = parseFloat(primeraUbicacion.lat);
            longitud = parseFloat(primeraUbicacion.lon);
          }
        }
      }
    } catch (err) {
      console.log('Error al procesar coordenadas:', err.message);
    }

    const query = `
      INSERT INTO catalogo_archivos
      (nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, archivo_url, fuente, responsable, alcance_geografico, validacion, observaciones, archivo_contenido, latitud, longitud, coordenadas_json)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id, nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, archivo_url, fuente, responsable, alcance_geografico, validacion, observaciones, latitud, longitud, coordenadas_json
    `;
    
    const values = [
      nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, archivo_url,
      fuente, responsable, alcance_geografico, validacion, observaciones, archivo.buffer,
      latitud, longitud, coordenadas_json ? JSON.stringify(coordenadas_json) : null
    ];

    const result = await pool.query(query, values);
    console.log('Archivo guardado en la base de datos con ID:', result.rows[0].id);
    
    res.json({ mensaje: 'Archivo subido y registrado', registro: result.rows[0] });
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para listar archivos
app.get('/archivos', async (req, res) => {
  console.log('=== GET /archivos ===');
  
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT id, nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, 
             archivo_url, fuente, responsable, alcance_geografico, validacion, observaciones,
             latitud, longitud, coordenadas_json
      FROM catalogo_archivos 
      ORDER BY fecha_actualizacion DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await pool.query(query, [limit, offset]);
    const countResult = await pool.query('SELECT COUNT(*) FROM catalogo_archivos');
    const totalItems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);
    
    console.log('Resultados encontrados:', result.rows.length, 'de', totalItems);
    
    res.json({
      items: result.rows,
      metadata: {
        page,
        limit,
        totalItems,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error al listar archivos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener un archivo por su ID
app.get('/archivos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM catalogo_archivos WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error al obtener archivo con ID ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para actualizar un archivo por su ID
app.put('/archivos/:id', verificarToken, async (req, res) => {
  console.log(`=== PUT /archivos/${req.params.id} ===`);
  
  try {
    const { id } = req.params;
    const {
      nombre, descripcion, tipo, responsable, fuente, etiquetas,
      alcance_geografico, validacion, observaciones, coordenadas, alcance_coordenadas
    } = req.body;

    // Procesar coordenadas
    let coordenadas_json = null;
    let latitud = null;
    let longitud = null;
    
    try {
      const coords = coordenadas || alcance_coordenadas;
      if (coords) {
        coordenadas_json = typeof coords === 'string' ? JSON.parse(coords) : coords;
        
        if (Array.isArray(coordenadas_json) && coordenadas_json.length > 0) {
          const primeraUbicacion = coordenadas_json[0];
          if (primeraUbicacion.lat && primeraUbicacion.lon) {
            latitud = parseFloat(primeraUbicacion.lat);
            longitud = parseFloat(primeraUbicacion.lon);
          }
        }
      }
    } catch (err) {
      console.log('Error al procesar coordenadas:', err.message);
    }

    const query = `
      UPDATE catalogo_archivos 
      SET nombre = $1, descripcion = $2, tipo = $3, responsable = $4, fuente = $5,
          etiquetas = $6, alcance_geografico = $7, validacion = $8, observaciones = $9,
          fecha_actualizacion = $10, latitud = $11, longitud = $12, coordenadas_json = $13
      WHERE id = $14
      RETURNING id, nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, archivo_url, fuente, responsable, alcance_geografico, validacion, observaciones, latitud, longitud, coordenadas_json
    `;

    const values = [
      nombre, descripcion, tipo, responsable, fuente, etiquetas, alcance_geografico,
      validacion, observaciones, new Date(), latitud, longitud,
      coordenadas_json ? JSON.stringify(coordenadas_json) : null, id
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    res.json({ mensaje: 'Archivo actualizado correctamente', archivo: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar archivo:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para eliminar un archivo por su ID
app.delete('/archivos/:id', verificarToken, async (req, res) => {
  console.log(`=== DELETE /archivos/${req.params.id} ===`);
  
  try {
    const { id } = req.params;
    
    const checkQuery = 'SELECT nombre FROM catalogo_archivos WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    const deleteQuery = 'DELETE FROM catalogo_archivos WHERE id = $1 RETURNING *';
    const deleteResult = await pool.query(deleteQuery, [id]);
    
    console.log(`Archivo eliminado exitosamente: ${checkResult.rows[0].nombre}`);
    
    res.json({ mensaje: 'Archivo eliminado correctamente', archivo: deleteResult.rows[0] });
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ RUTAS CON PREFIJO /api ============

// Duplicar rutas principales con prefijo /api
app.get('/api/db-status', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      message: 'Conexión exitosa a la base de datos', 
      time: result.rows[0].now,
      config: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: process.env.DB_SSL === 'true'
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Error de conexión a la base de datos', 
      error: error.message 
    });
  }
});

app.get('/api/archivos/descargar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT nombre, tipo, archivo_contenido, tamano FROM catalogo_archivos WHERE id = $1`;
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    const archivo = result.rows[0];
    
    if (!archivo.archivo_contenido) {
      return res.status(404).json({ error: 'El contenido del archivo no está disponible' });
    }
    
    const contentType = determinarContentType(archivo.tipo);
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(archivo.nombre)}"`);
    res.setHeader('Content-Length', archivo.tamano);
    
    res.send(archivo.archivo_contenido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/archivos/upload', verificarToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }

    const archivo = req.file;
    const nombre = archivo.originalname;
    const tipo = path.extname(nombre).substring(1).toUpperCase();
    const fecha_actualizacion = new Date();
    const tamano = archivo.size;
    const archivo_url = Date.now() + '-' + nombre.replace(/[^a-zA-Z0-9\-_.]/g, '_');

    const descripcion = req.body.descripcion || '';
    const etiquetas = req.body.etiquetas || '';
    const responsable = req.body.responsable || '';
    const fuente = req.body.fuente || '';
    const alcance_geografico = req.body.alcance || '';
    const validacion = req.body.validacion || '';
    const observaciones = req.body.observaciones || '';
    
    let coordenadas_json = null;
    let latitud = null;
    let longitud = null;
    
    try {
      const coordenadas = req.body.coordenadas || req.body.alcance_coordenadas;
      if (coordenadas) {
        coordenadas_json = typeof coordenadas === 'string' ? JSON.parse(coordenadas) : coordenadas;
        
        if (Array.isArray(coordenadas_json) && coordenadas_json.length > 0) {
          const primeraUbicacion = coordenadas_json[0];
          if (primeraUbicacion.lat && primeraUbicacion.lon) {
            latitud = parseFloat(primeraUbicacion.lat);
            longitud = parseFloat(primeraUbicacion.lon);
          }
        }
      }
    } catch (err) {
      console.log('Error al procesar coordenadas:', err.message);
    }

    const query = `
      INSERT INTO catalogo_archivos
      (nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, archivo_url, fuente, responsable, alcance_geografico, validacion, observaciones, archivo_contenido, latitud, longitud, coordenadas_json)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id, nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, archivo_url, fuente, responsable, alcance_geografico, validacion, observaciones, latitud, longitud, coordenadas_json
    `;
    
    const values = [
      nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, archivo_url,
      fuente, responsable, alcance_geografico, validacion, observaciones, archivo.buffer,
      latitud, longitud, coordenadas_json ? JSON.stringify(coordenadas_json) : null
    ];

    const result = await pool.query(query, values);
    res.json({ mensaje: 'Archivo subido y registrado', registro: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/archivos', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT id, nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, 
             archivo_url, fuente, responsable, alcance_geografico, validacion, observaciones,
             latitud, longitud, coordenadas_json
      FROM catalogo_archivos 
      ORDER BY fecha_actualizacion DESC
      LIMIT $1 OFFSET $2
    `;
    
    const [result, countResult] = await Promise.all([
      pool.query(query, [limit, offset]),
      pool.query('SELECT COUNT(*) FROM catalogo_archivos')
    ]);
    
    const totalItems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);
    
    res.json({
      items: result.rows,
      metadata: { page, limit, totalItems, totalPages }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/archivos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM catalogo_archivos WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/archivos/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre, descripcion, tipo, responsable, fuente, etiquetas,
      alcance_geografico, validacion, observaciones, coordenadas, alcance_coordenadas
    } = req.body;

    let coordenadas_json = null;
    let latitud = null;
    let longitud = null;
    
    try {
      const coords = coordenadas || alcance_coordenadas;
      if (coords) {
        coordenadas_json = typeof coords === 'string' ? JSON.parse(coords) : coords;
        
        if (Array.isArray(coordenadas_json) && coordenadas_json.length > 0) {
          const primeraUbicacion = coordenadas_json[0];
          if (primeraUbicacion.lat && primeraUbicacion.lon) {
            latitud = parseFloat(primeraUbicacion.lat);
            longitud = parseFloat(primeraUbicacion.lon);
          }
        }
      }
    } catch (err) {
      console.log('Error al procesar coordenadas:', err.message);
    }

    const query = `
      UPDATE catalogo_archivos 
      SET nombre = $1, descripcion = $2, tipo = $3, responsable = $4, fuente = $5,
          etiquetas = $6, alcance_geografico = $7, validacion = $8, observaciones = $9,
          fecha_actualizacion = $10, latitud = $11, longitud = $12, coordenadas_json = $13
      WHERE id = $14
      RETURNING id, nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, archivo_url, fuente, responsable, alcance_geografico, validacion, observaciones, latitud, longitud, coordenadas_json
    `;

    const values = [
      nombre, descripcion, tipo, responsable, fuente, etiquetas, alcance_geografico,
      validacion, observaciones, new Date(), latitud, longitud,
      coordenadas_json ? JSON.stringify(coordenadas_json) : null, id
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    res.json({ mensaje: 'Archivo actualizado correctamente', archivo: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/archivos/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const checkQuery = 'SELECT nombre FROM catalogo_archivos WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    const deleteQuery = 'DELETE FROM catalogo_archivos WHERE id = $1 RETURNING *';
    const deleteResult = await pool.query(deleteQuery, [id]);
    
    res.json({ mensaje: 'Archivo eliminado correctamente', archivo: deleteResult.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Página de prueba para subir archivos
app.get('/test-upload', (req, res) => {
  res.send(`
    <h1>Formulario de prueba para subir archivos</h1>
    <form action="/archivos/upload" method="post" enctype="multipart/form-data">
      <div>
        <label for="file">Selecciona un archivo:</label>
        <input type="file" name="file" id="file" required>
      </div>
      <div>
        <label for="descripcion">Descripción:</label>
        <input type="text" name="descripcion" id="descripcion">
      </div>
      <div>
        <label for="etiquetas">Etiquetas:</label>
        <input type="text" name="etiquetas" id="etiquetas">
      </div>
      <button type="submit">Subir archivo</button>
    </form>
  `);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});