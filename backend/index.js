require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

// Importar middleware de autenticación
const { authenticateToken } = require('./middleware/auth');
const authRoutes = require('./routes/auth');

// Cargar configuración local si existe
try {
  if (fs.existsSync(path.join(__dirname, '.env.local'))) {
    require('dotenv').config({ path: path.join(__dirname, '.env.local') });
    console.log('Cargada configuración local desde .env.local');
  }
  
  // Cargar configuración de producción si está en modo producción
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, '.env.production'))) {
    require('dotenv').config({ path: path.join(__dirname, '.env.production') });
    console.log('Cargada configuración de producción desde .env.production');
  }
} catch (err) {
  console.error('Error al cargar archivos de configuración:', err);
}

// Imprimir información de conexión
console.log('🔧 Configuración de conexión a BD:');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Puerto: ${process.env.DB_PORT}`);
console.log(`Base de datos: ${process.env.DB_NAME}`);
console.log(`Usuario: ${process.env.DB_USER}`);
console.log(`Contraseña: ${process.env.DB_PASSWORD ? '******' : 'no configurada'}`);
console.log(`SSL: ${process.env.DB_SSL}`);
console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'no configurada'}`);
console.log(`API URL: ${process.env.API_URL || 'no configurada'}`);

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
const HTTP_PORT = process.env.HTTP_PORT || 80;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`Iniciando servidor en modo: ${NODE_ENV}`);
console.log(`Puerto principal: ${PORT}`);
console.log(`Puerto HTTP: ${HTTP_PORT}`);

// Configurar CORS específico para producción
const corsOptions = {
  origin: function (origin, callback) {
    // Lista de dominios permitidos
    const allowedOrigins = [
      'https://biblioteca.sembrandodatos.com',
      'https://api.biblioteca.sembrandodatos.com',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:4000'
    ];
    
    // Permitir requests sin origin (aplicaciones móviles, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`CORS: Origen bloqueado: ${origin}`);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));
app.use(express.json());
// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de logging para debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Rutas de autenticación (sin protección)
app.use('/api', authRoutes);

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    routes: {
      login: '/api/login',
      verify: '/api/verify'
    }
  });
});

// Ruta de debug para listar todas las rutas registradas
app.get('/debug/routes', (req, res) => {
  const routes = [];
  
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Rutas directas
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      // Rutas de router
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: '/api' + handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  
  res.json({
    message: 'Rutas registradas en el servidor',
    routes: routes,
    timestamp: new Date().toISOString()
  });
});

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

// Endpoint para listar archivos (optimizado, con paginación) - PROTEGIDO
app.get('/archivos', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    
    // Excluir el campo archivo_contenido para mejorar el rendimiento
    const query = `
      SELECT id, nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, 
             archivo_url, fuente, responsable, alcance_geografico, validacion, observaciones,
             latitud, longitud, coordenadas_json
      FROM catalogo_archivos 
      ORDER BY fecha_actualizacion DESC
      LIMIT $1 OFFSET $2
    `;
    
    // Consulta para el conteo total
    const countQuery = `SELECT COUNT(*) FROM catalogo_archivos`;
    
    // Ejecutar ambas consultas en paralelo
    const [result, countResult] = await Promise.all([
      pool.query(query, [limit, offset]),
      pool.query(countQuery)
    ]);
    
    // Construir respuesta con metadatos de paginación
    const totalItems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);
    
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

// IMPORTANTE: Esta ruta debe estar ANTES de la ruta genérica '/archivos/:id'
app.get('/archivos/descargar/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Solicitando descarga del archivo con ID: ${id}`);
    
    // Consultar el archivo en la base de datos
    const query = `
      SELECT nombre, tipo, archivo_contenido, tamano
      FROM catalogo_archivos
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      console.log(`Archivo con ID ${id} no encontrado`);
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    const archivo = result.rows[0];
    
    // Si no hay contenido en la base de datos, intentamos leer del sistema de archivos
    if (!archivo.archivo_contenido) {
      console.log(`El archivo con ID ${id} no tiene contenido en la base de datos. Actualizando desde el disco...`);
      
      // Verificar si hay un archivo en disco para migrar
      const oldFilePath = path.join(__dirname, 'uploads', archivo.archivo_url);
      if (fs.existsSync(oldFilePath)) {
        // Si existe el archivo en disco, lo leemos y actualizamos la base de datos
        const fileContent = fs.readFileSync(oldFilePath);
        
        // Actualizar la base de datos con el contenido del archivo
        await pool.query(
          'UPDATE catalogo_archivos SET archivo_contenido = $1 WHERE id = $2',
          [fileContent, id]
        );
        
        console.log(`Archivo migrado desde el disco a la base de datos: ${oldFilePath}`);
        
        // Enviar el archivo recién leído
        const contentType = determinarContentType(archivo.tipo);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(archivo.nombre)}"`);
        res.setHeader('Content-Length', archivo.tamano);
        console.log(`Enviando archivo migrado ${archivo.nombre} (${archivo.tamano} bytes)`);
        return res.send(fileContent);
      } else {
        console.log(`No se encontró el archivo en disco: ${oldFilePath}`);
        return res.status(404).json({ error: 'El contenido del archivo no está disponible' });
      }
    }
    
    // Determinar el tipo MIME adecuado
    const contentType = determinarContentType(archivo.tipo);
    
    // Configurar headers para descarga
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(archivo.nombre)}"`);
    res.setHeader('Content-Length', archivo.tamano);
    
    // Enviar el archivo como respuesta
    console.log(`Enviando archivo ${archivo.nombre} (${archivo.tamano} bytes)`);
    return res.send(archivo.archivo_contenido);
    
  } catch (error) {
    console.error('Error al descargar el archivo:', error);
    res.status(500).json({ error: error.message });
  }
});

// Función para determinar el tipo MIME basado en la extensión
function determinarContentType(tipo) {
  let contentType = 'application/octet-stream';  // Por defecto
  const extension = tipo.toLowerCase();
  
  // Asignar tipos MIME comunes
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
  
  if (mimeTypes[extension]) {
    contentType = mimeTypes[extension];
  }
  
  return contentType;
}

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

// Endpoint para obtener los campos de un archivo
app.get('/archivos/:id/campos', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM archivo_campos WHERE archivo_id = $1',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(`Error al obtener campos del archivo ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para subir archivos - PROTEGIDO
app.post('/archivos/upload', authenticateToken, upload.single('file'), async (req, res) => {
  console.log('Recibida solicitud en /archivos/upload');
  console.log('Body:', req.body);
  console.log('File:', req.file);
  
  try {
    if (!req.file) {
      console.log('No se recibió ningún archivo');
      return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }

    const archivo = req.file;
    console.log('Archivo recibido:', archivo);

    // Datos básicos del archivo
    const nombre = archivo.originalname;
    const tipo = path.extname(nombre).substring(1).toUpperCase(); // "CSV", "XLSX", "ZIP" etc
    const fecha_actualizacion = new Date();
    const tamano = archivo.size;
    // Ya no usamos archivo_url para guardar la ruta, ahora guardamos un identificador único
    const archivo_url = Date.now() + '-' + nombre.replace(/[^a-zA-Z0-9\-_.]/g, '_');

    console.log('Datos del archivo:', { nombre, tipo, fecha_actualizacion, tamano, archivo_url });

    // Recibe los nuevos campos desde req.body
    const descripcion = req.body.descripcion || '';
    const etiquetas = req.body.etiquetas || '';
    const responsable = req.body.responsable || '';
    const fuente = req.body.fuente || '';
    const alcance_geografico = req.body.alcance || '';
    const validacion = req.body.validacion || '';
    const observaciones = req.body.observaciones || '';
    
    // Procesar coordenadas si vienen en el alcance
    let coordenadas_json = null;
    let latitud = null;
    let longitud = null;
    
    try {
      const coordenadas = req.body.coordenadas || req.body.alcance_coordenadas;
      if (coordenadas) {
        if (typeof coordenadas === 'string') {
          coordenadas_json = JSON.parse(coordenadas);
        } else {
          coordenadas_json = coordenadas;
        }
        
        // Si es un array de ubicaciones, tomar la primera
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

    console.log('Campos adicionales:', {
      descripcion, etiquetas, responsable, fuente, 
      alcance_geografico, validacion, observaciones, latitud, longitud
    });

    // Insertar en PostgreSQL incluyendo el contenido del archivo (que está en memoria)
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

// Endpoint para actualizar un archivo por su ID - PROTEGIDO
app.put('/archivos/:id', authenticateToken, async (req, res) => {
  console.log(`=== PUT /archivos/${req.params.id} ===`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      tipo,
      responsable,
      fuente,
      etiquetas,
      alcance_geografico,
      validacion,
      observaciones,
      coordenadas,
      alcance_coordenadas
    } = req.body;

    console.log('Actualizando archivo ID:', id);
    console.log('Datos recibidos:', req.body);

    // Procesar coordenadas si vienen en el alcance
    let coordenadas_json = null;
    let latitud = null;
    let longitud = null;
    
    try {
      const coords = coordenadas || alcance_coordenadas;
      if (coords) {
        if (typeof coords === 'string') {
          coordenadas_json = JSON.parse(coords);
        } else {
          coordenadas_json = coords;
        }
        
        // Si es un array de ubicaciones, tomar la primera
        if (Array.isArray(coordenadas_json) && coordenadas_json.length > 0) {
          const primeraUbicacion = coordenadas_json[0];
          if (primeraUbicacion.lat && primeraUbicacion.lon) {
            latitud = parseFloat(primeraUbicacion.lat);
            longitud = parseFloat(primeraUbicacion.lon);
          }
        }
      }
    } catch (err) {
      console.log('Error al procesar coordenadas en actualización:', err.message);
    }

    // Actualizar el archivo en la base de datos
    const query = `
      UPDATE catalogo_archivos 
      SET 
        nombre = $1,
        descripcion = $2,
        tipo = $3,
        responsable = $4,
        fuente = $5,
        etiquetas = $6,
        alcance_geografico = $7,
        validacion = $8,
        observaciones = $9,
        fecha_actualizacion = $10,
        latitud = $11,
        longitud = $12,
        coordenadas_json = $13
      WHERE id = $14
      RETURNING id, nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, archivo_url, fuente, responsable, alcance_geografico, validacion, observaciones, latitud, longitud, coordenadas_json
    `;

    const values = [
      nombre,
      descripcion,
      tipo,
      responsable,
      fuente,
      etiquetas,
      alcance_geografico,
      validacion,
      observaciones,
      new Date(), // fecha_actualizacion
      latitud,
      longitud,
      coordenadas_json ? JSON.stringify(coordenadas_json) : null,
      id
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    console.log('Archivo actualizado exitosamente:', result.rows[0]);
    res.json({ 
      mensaje: 'Archivo actualizado correctamente', 
      archivo: result.rows[0] 
    });

  } catch (error) {
    console.error('Error al actualizar archivo:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para actualizar un archivo con nuevo archivo físico
app.put('/archivos/:id/with-file', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }

    const archivo = req.file;
    console.log('Actualizando archivo ID:', id, 'con nuevo archivo:', archivo.originalname);

    // Datos del nuevo archivo
    const nombre = req.body.nombre || archivo.originalname;
    const tipo = req.body.tipo || path.extname(archivo.originalname).substring(1).toUpperCase();
    const fecha_actualizacion = new Date();
    const tamano = archivo.size;
    const archivo_url = Date.now() + '-' + archivo.originalname.replace(/[^a-zA-Z0-9\-_.]/g, '_');

    // Metadatos del formulario
    const descripcion = req.body.descripcion || '';
    const responsable = req.body.responsable || '';
    const fuente = req.body.fuente || '';
    const etiquetas = req.body.etiquetas || '';
    const alcance_geografico = req.body.alcance || '';
    const validacion = req.body.validacion || '';
    const observaciones = req.body.observaciones || '';

    // Procesar coordenadas si vienen en el alcance
    let coordenadas_json = null;
    let latitud = null;
    let longitud = null;
    
    try {
      const coords = req.body.coordenadas || req.body.alcance_coordenadas;
      if (coords) {
        if (typeof coords === 'string') {
          coordenadas_json = JSON.parse(coords);
        } else {
          coordenadas_json = coords;
        }
        
        // Si es un array de ubicaciones, tomar la primera
        if (Array.isArray(coordenadas_json) && coordenadas_json.length > 0) {
          const primeraUbicacion = coordenadas_json[0];
          if (primeraUbicacion.lat && primeraUbicacion.lon) {
            latitud = parseFloat(primeraUbicacion.lat);
            longitud = parseFloat(primeraUbicacion.lon);
          }
        }
      }
    } catch (err) {
      console.log('Error al procesar coordenadas en actualización con archivo:', err.message);
    }

    console.log('Datos de actualización:', {
      nombre, tipo, tamano, descripcion, responsable, fuente,
      etiquetas, alcance_geografico, validacion, observaciones, latitud, longitud
    });

    // Actualizar el archivo en la base de datos con el nuevo contenido
    const query = `
      UPDATE catalogo_archivos 
      SET 
        nombre = $1,
        descripcion = $2,
        tipo = $3,
        responsable = $4,
        fuente = $5,
        etiquetas = $6,
        alcance_geografico = $7,
        validacion = $8,
        observaciones = $9,
        fecha_actualizacion = $10,
        tamano = $11,
        archivo_url = $12,
        archivo_contenido = $13,
        latitud = $14,
        longitud = $15,
        coordenadas_json = $16
      WHERE id = $17
      RETURNING id, nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, archivo_url, fuente, responsable, alcance_geografico, validacion, observaciones, latitud, longitud, coordenadas_json
    `;

    const values = [
      nombre,
      descripcion,
      tipo,
      responsable,
      fuente,
      etiquetas,
      alcance_geografico,
      validacion,
      observaciones,
      fecha_actualizacion,
      tamano,
      archivo_url,
      archivo.buffer, // Nuevo contenido del archivo
      latitud,
      longitud,
      coordenadas_json ? JSON.stringify(coordenadas_json) : null,
      id
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    console.log('Archivo actualizado exitosamente con nuevo archivo:', result.rows[0]);
    res.json({ 
      mensaje: 'Archivo y contenido actualizados correctamente', 
      archivo: result.rows[0] 
    });

  } catch (error) {
    console.error('Error al actualizar archivo con nuevo archivo:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para eliminar un archivo por su ID - PROTEGIDO
app.delete('/archivos/:id', authenticateToken, async (req, res) => {
  console.log(`=== DELETE /archivos/${req.params.id} ===`);
  
  try {
    const { id } = req.params;
    
    console.log('Eliminando archivo ID:', id);
    
    // Verificar si el archivo existe antes de eliminar
    const checkQuery = 'SELECT nombre FROM catalogo_archivos WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      console.log(`Archivo con ID ${id} no encontrado`);
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    const nombreArchivo = checkResult.rows[0].nombre;
    console.log(`Archivo encontrado: ${nombreArchivo}`);
    
    // Eliminar el archivo de la base de datos
    const deleteQuery = 'DELETE FROM catalogo_archivos WHERE id = $1 RETURNING *';
    const deleteResult = await pool.query(deleteQuery, [id]);
    
    if (deleteResult.rows.length === 0) {
      console.log(`No se pudo eliminar el archivo con ID ${id}`);
      return res.status(404).json({ error: 'No se pudo eliminar el archivo' });
    }
    
    console.log(`Archivo eliminado exitosamente: ${nombreArchivo}`);
    
    res.json({ 
      mensaje: 'Archivo eliminado correctamente', 
      archivo: deleteResult.rows[0] 
    });
    
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    res.status(500).json({ error: error.message });
  }
});

// Duplicar todas las rutas con prefijo /api para compatibilidad con proxy
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
    console.error('Error al verificar conexión a BD:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error de conexión a la base de datos', 
      error: error.message 
    });
  }
});

// Duplicar rutas de archivos con prefijo /api - PROTEGIDAS
app.get('/api/archivos', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    
    // Excluir el campo archivo_contenido para mejorar el rendimiento
    const query = `
      SELECT id, nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, 
             archivo_url, fuente, responsable, alcance_geografico, validacion, observaciones,
             latitud, longitud, coordenadas_json
      FROM catalogo_archivos 
      ORDER BY fecha_actualizacion DESC
      LIMIT $1 OFFSET $2
    `;
    
    // Consulta para el conteo total
    const countQuery = `SELECT COUNT(*) FROM catalogo_archivos`;
    
    // Ejecutar ambas consultas en paralelo
    const [result, countResult] = await Promise.all([
      pool.query(query, [limit, offset]),
      pool.query(countQuery)
    ]);
    
    // Construir respuesta con metadatos de paginación
    const totalItems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);
    
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

app.get('/api/archivos/descargar/:id', async (req, res) => {
  // Reutilizar la misma lógica que la ruta sin prefijo
  return app._router.handle(Object.assign(req, { url: req.url.replace('/api', '') }), res);
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
    console.error(`Error al obtener archivo con ID ${req.params.id}:`, error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/archivos/upload', authenticateToken, upload.single('file'), async (req, res) => {
  // Reutilizar la misma lógica que la ruta sin prefijo
  console.log('Recibida solicitud en /api/archivos/upload');
  console.log('Body:', req.body);
  console.log('File:', req.file);
  
  try {
    if (!req.file) {
      console.log('No se recibió ningún archivo');
      return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }

    const archivo = req.file;
    console.log('Archivo recibido:', archivo);

    // Datos básicos del archivo
    const nombre = archivo.originalname;
    const tipo = path.extname(nombre).substring(1).toUpperCase(); // "CSV", "XLSX", "ZIP" etc
    const fecha_actualizacion = new Date();
    const tamano = archivo.size;
    // Ya no usamos archivo_url para guardar la ruta, ahora guardamos un identificador único
    const archivo_url = Date.now() + '-' + nombre.replace(/[^a-zA-Z0-9\-_.]/g, '_');

    console.log('Datos del archivo:', { nombre, tipo, fecha_actualizacion, tamano, archivo_url });

    // Recibe los nuevos campos desde req.body
    const descripcion = req.body.descripcion || '';
    const etiquetas = req.body.etiquetas || '';
    const responsable = req.body.responsable || '';
    const fuente = req.body.fuente || '';
    const alcance_geografico = req.body.alcance || '';
    const validacion = req.body.validacion || '';
    const observaciones = req.body.observaciones || '';
    
    // Procesar coordenadas si vienen en el alcance
    let coordenadas_json = null;
    let latitud = null;
    let longitud = null;
    
    try {
      const coordenadas = req.body.coordenadas || req.body.alcance_coordenadas;
      if (coordenadas) {
        if (typeof coordenadas === 'string') {
          coordenadas_json = JSON.parse(coordenadas);
        } else {
          coordenadas_json = coordenadas;
        }
        
        // Si es un array de ubicaciones, tomar la primera
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

    console.log('Campos adicionales:', {
      descripcion, etiquetas, responsable, fuente, 
      alcance_geografico, validacion, observaciones, latitud, longitud
    });

    // Insertar en PostgreSQL incluyendo el contenido del archivo (que está en memoria)
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

app.put('/api/archivos/:id', authenticateToken, async (req, res) => {
  // Reutilizar la misma lógica que la ruta sin prefijo
  console.log(`=== PUT /api/archivos/${req.params.id} ===`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      tipo,
      responsable,
      fuente,
      etiquetas,
      alcance_geografico,
      validacion,
      observaciones,
      coordenadas,
      alcance_coordenadas
    } = req.body;

    console.log('Actualizando archivo ID:', id);
    console.log('Datos recibidos:', req.body);

    // Procesar coordenadas si vienen en el alcance
    let coordenadas_json = null;
    let latitud = null;
    let longitud = null;
    
    try {
      const coords = coordenadas || alcance_coordenadas;
      if (coords) {
        if (typeof coords === 'string') {
          coordenadas_json = JSON.parse(coords);
        } else {
          coordenadas_json = coords;
        }
        
        // Si es un array de ubicaciones, tomar la primera
        if (Array.isArray(coordenadas_json) && coordenadas_json.length > 0) {
          const primeraUbicacion = coordenadas_json[0];
          if (primeraUbicacion.lat && primeraUbicacion.lon) {
            latitud = parseFloat(primeraUbicacion.lat);
            longitud = parseFloat(primeraUbicacion.lon);
          }
        }
      }
    } catch (err) {
      console.log('Error al procesar coordenadas en actualización:', err.message);
    }

    // Actualizar el archivo en la base de datos
    const query = `
      UPDATE catalogo_archivos 
      SET 
        nombre = $1,
        descripcion = $2,
        tipo = $3,
        responsable = $4,
        fuente = $5,
        etiquetas = $6,
        alcance_geografico = $7,
        validacion = $8,
        observaciones = $9,
        fecha_actualizacion = $10,
        latitud = $11,
        longitud = $12,
        coordenadas_json = $13
      WHERE id = $14
      RETURNING id, nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, archivo_url, fuente, responsable, alcance_geografico, validacion, observaciones, latitud, longitud, coordenadas_json
    `;

    const values = [
      nombre,
      descripcion,
      tipo,
      responsable,
      fuente,
      etiquetas,
      alcance_geografico,
      validacion,
      observaciones,
      new Date(), // fecha_actualizacion
      latitud,
      longitud,
      coordenadas_json ? JSON.stringify(coordenadas_json) : null,
      id
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    console.log('Archivo actualizado exitosamente:', result.rows[0]);
    res.json({ 
      mensaje: 'Archivo actualizado correctamente', 
      archivo: result.rows[0] 
    });

  } catch (error) {
    console.error('Error al actualizar archivo:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/archivos/:id', authenticateToken, async (req, res) => {
  // Reutilizar la misma lógica que la ruta sin prefijo
  console.log(`=== DELETE /api/archivos/${req.params.id} ===`);
  
  try {
    const { id } = req.params;
    
    console.log('Eliminando archivo con ID:', id);
    
    // Primero verificar que el archivo existe
    const checkQuery = 'SELECT id, nombre FROM catalogo_archivos WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      console.log(`Archivo con ID ${id} no encontrado`);
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    const archivo = checkResult.rows[0];
    console.log('Archivo encontrado:', archivo.nombre);
    
    // Eliminar el archivo de la base de datos
    const deleteQuery = 'DELETE FROM catalogo_archivos WHERE id = $1 RETURNING id, nombre';
    const deleteResult = await pool.query(deleteQuery, [id]);
    
    if (deleteResult.rows.length === 0) {
      console.log(`Error al eliminar archivo con ID ${id}`);
      return res.status(500).json({ error: 'Error al eliminar el archivo' });
    }
    
    const archivoEliminado = deleteResult.rows[0];
    console.log('Archivo eliminado exitosamente:', archivoEliminado);
    
    res.json({ 
      mensaje: 'Archivo eliminado correctamente',
      archivo: archivoEliminado
    });
    
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta de fallback para login sin prefijo /api (para debug)
app.post('/login', async (req, res) => {
  console.log('=== FALLBACK: POST /login (sin /api) ===');
  console.log('Esta ruta no debería ser llamada normalmente, pero la procesaremos');
  console.log('Body recibido:', req.body);
  console.log('Headers:', req.headers);
  
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

    console.log(`Intentando autenticar usuario: ${usuario} (desde ruta fallback)`);

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

    // Verificar contraseña (por ahora texto plano)
    if (user.contrasena !== contrasena) {
      console.log(`Contraseña incorrecta para usuario: ${usuario}`);
      return res.status(401).json({
        success: false,
        error: 'contrasena_incorrecta',
        message: 'La contraseña ingresada es incorrecta'
      });
    }

    // Generar token JWT
    const { generateToken } = require('./middleware/auth');
    const token = generateToken(user);
    
    console.log(`Login exitoso para usuario: ${usuario} (desde ruta fallback)`);
    
    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Login exitoso (ruta fallback)',
      token: token,
      user: {
        id: user.id,
        usuario: user.usuario,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('Error en login fallback:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'Error al procesar la solicitud de login'
    });
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

// Función para iniciar el servidor
function startServer() {
  if (NODE_ENV === 'production') {
    // En producción, intentar usar HTTPS
    try {
      const sslKeyPath = process.env.SSL_KEY_PATH;
      const sslCertPath = process.env.SSL_CERT_PATH;
      
      if (sslKeyPath && sslCertPath && fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
        const privateKey = fs.readFileSync(sslKeyPath, 'utf8');
        const certificate = fs.readFileSync(sslCertPath, 'utf8');
        const credentials = { key: privateKey, cert: certificate };
        
        // Crear servidor HTTPS
        const httpsServer = https.createServer(credentials, app);
        httpsServer.listen(PORT, '0.0.0.0', () => {
          console.log(`🚀 Servidor HTTPS corriendo en puerto ${PORT}`);
          console.log(`🌍 Accesible desde: https://api.biblioteca.sembrandodatos.com`);
        });
        
        // Crear servidor HTTP para redirección a HTTPS
        const httpApp = express();
        httpApp.use((req, res) => {
          res.redirect(301, `https://${req.headers.host}${req.url}`);
        });
        
        const httpServer = http.createServer(httpApp);
        httpServer.listen(HTTP_PORT, '0.0.0.0', () => {
          console.log(`🔀 Servidor HTTP (redirección) corriendo en puerto ${HTTP_PORT}`);
        });
        
      } else {
        console.log('⚠️  Certificados SSL no encontrados, iniciando en modo HTTP');
        startHttpServer();
      }
    } catch (error) {
      console.error('❌ Error al configurar HTTPS:', error);
      console.log('🔄 Fallback a servidor HTTP');
      startHttpServer();
    }
  } else {
    // En desarrollo, usar HTTP
    console.log('🛠️  Modo desarrollo: usando HTTP');
    startHttpServer();
  }
}

function startHttpServer() {
  const server = http.createServer(app);
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor HTTP corriendo en puerto ${PORT}`);
    console.log(`🌐 Modo: ${NODE_ENV}`);
    console.log(`📡 Accesible desde: http://0.0.0.0:${PORT}`);
    
    if (NODE_ENV === 'development') {
      console.log(`🏠 Local: http://localhost:${PORT}`);
    }
  });
  
  // Manejar errores del servidor
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ El puerto ${PORT} ya está en uso`);
      process.exit(1);
    } else {
      console.error('❌ Error del servidor:', error);
    }
  });
}

// Manejar cierre graceful del servidor
process.on('SIGTERM', () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
  process.exit(0);
});

// Iniciar el servidor
startServer();