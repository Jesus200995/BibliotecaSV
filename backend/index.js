require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Detectar entorno y cargar configuración apropiada
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`🌍 Iniciando en modo: ${NODE_ENV}`);

// Cargar configuración específica del entorno
if (NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, '.env.production'))) {
  require('dotenv').config({ path: path.join(__dirname, '.env.production') });
  console.log('✅ Cargada configuración de producción desde .env.production');
} else if (fs.existsSync(path.join(__dirname, '.env.local'))) {
  require('dotenv').config({ path: path.join(__dirname, '.env.local') });
  console.log('✅ Cargada configuración local desde .env.local');
}

// Validar variables de entorno críticas
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Error: Variables de entorno faltantes:', missingVars);
  process.exit(1);
}

// Imprimir información de conexión (sin mostrar contraseñas)
console.log('📋 Configuración de conexión a BD:');
console.log(`   Host: ${process.env.DB_HOST}`);
console.log(`   Puerto: ${process.env.DB_PORT}`);
console.log(`   Base de datos: ${process.env.DB_NAME}`);
console.log(`   Usuario: ${process.env.DB_USER}`);
console.log(`   Contraseña: ${process.env.DB_PASSWORD ? '✅ Configurada' : '❌ No configurada'}`);
console.log(`   SSL: ${process.env.DB_SSL === 'true' ? 'Habilitado' : 'Deshabilitado'}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Configurado' : '❌ NO CONFIGURADO'}`);
console.log(`   Entorno: ${NODE_ENV}`);

// Configuración de la conexión a PostgreSQL con reintentos
const poolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  // Configuración de conexión robusta
  max: 20, // máximo número de clientes en el pool
  idleTimeoutMillis: 30000, // cuánto tiempo un cliente puede estar inactivo antes de ser cerrado
  connectionTimeoutMillis: 10000, // tiempo de espera para obtener conexión
  query_timeout: 30000, // tiempo de espera para queries
  statement_timeout: 30000, // tiempo de espera para statements
};

console.log('🔗 Configuración del pool de conexiones:', {
  host: poolConfig.host,
  port: poolConfig.port,
  database: poolConfig.database,
  user: poolConfig.user,
  ssl: poolConfig.ssl !== false ? 'habilitado' : 'deshabilitado',
  max: poolConfig.max
});

const pool = new Pool(poolConfig);

// Event listeners para el pool
pool.on('connect', () => {
  console.log('🟢 Nueva conexión establecida con la base de datos');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de conexiones:', err);
});

// Función para verificar la conexión a la base de datos
async function verificarConexionBD() {
  let reintentos = 5;
  while (reintentos > 0) {
    try {
      console.log(`🔍 Verificando conexión a la base de datos... (intentos restantes: ${reintentos})`);
      const client = await pool.connect();
      const result = await client.query('SELECT NOW(), version()');
      client.release();
      console.log('✅ Conexión a la base de datos exitosa');
      console.log(`   Timestamp: ${result.rows[0].now}`);
      console.log(`   PostgreSQL version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
      return true;
    } catch (error) {
      reintentos--;
      console.error(`❌ Error de conexión a BD (intentos restantes: ${reintentos}):`, error.message);
      if (reintentos > 0) {
        console.log('⏳ Esperando 3 segundos antes del siguiente intento...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }
  console.error('💥 No se pudo establecer conexión con la base de datos después de 5 intentos');
  return false;
}

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

// Configurar CORS de manera robusta para desarrollo y producción
const corsOptions = {
  origin: function (origin, callback) {
    console.log(`🔍 CORS: Verificando origen: ${origin || 'No origin'}`);
    
    // Permitir requests sin origin (aplicaciones móviles, postman, curl, etc.)
    if (!origin) {
      console.log('✅ CORS: Permitido - Sin origin (herramientas de desarrollo)');
      return callback(null, true);
    }
    
    // Lista de orígenes permitidos basada en el entorno
    let allowedOrigins = [];
    
    if (NODE_ENV === 'production') {
      allowedOrigins = [
        'https://biblioteca.sembrandodatos.com',
        'http://biblioteca.sembrandodatos.com',
        // Permitir acceso directo al puerto del backend para debugging
        'https://biblioteca.sembrandodatos.com:4000',
        'http://biblioteca.sembrandodatos.com:4000'
      ];
      
      // Agregar orígenes desde variables de entorno si existen
      if (process.env.CORS_ORIGIN) {
        const envOrigins = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
        allowedOrigins.push(...envOrigins);
      }
    } else {
      // Desarrollo
      allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:3000'
      ];
    }
    
    console.log('📋 CORS: Orígenes permitidos:', allowedOrigins);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS: Origen permitido');
      callback(null, true);
    } else {
      console.log(`❌ CORS: Origen no permitido: ${origin}`);
      // En desarrollo, permitir de todos modos para facilitar testing
      if (NODE_ENV === 'development') {
        console.log('🔧 CORS: Permitido en modo desarrollo');
        callback(null, true);
      } else {
        callback(new Error('No permitido por la política CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type', 
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-HTTP-Method-Override'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400, // 24 horas
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware para parsear JSON con límites apropiados
app.use(express.json({ 
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware de seguridad básica
app.use((req, res, next) => {
  // Headers de seguridad
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  if (NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
});

// Middleware para logging detallado de requests
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const origin = req.get('Origin') || 'No origin';
  const userAgent = req.get('User-Agent') || 'No user agent';
  const ip = req.ip || req.connection.remoteAddress || 'Unknown IP';
  
  console.log(`📥 ${timestamp} - ${req.method} ${req.path}`);
  console.log(`   Origin: ${origin}`);
  console.log(`   IP: ${ip}`);
  console.log(`   User-Agent: ${userAgent.substring(0, 100)}...`);
  
  if (req.method !== 'GET' && Object.keys(req.body).length > 0) {
    console.log(`   Body keys: ${Object.keys(req.body).join(', ')}`);
  }
  
  // Capturar el tiempo de respuesta
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`📤 ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

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

// Endpoint de salud simple
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Servidor backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// Endpoint de estado completo del sistema
app.get('/api/status', async (req, res) => {
  try {
    // Probar conexión a BD
    const dbResult = await pool.query('SELECT NOW(), COUNT(*) as total_archivos FROM catalogo_archivos');
    const dbStatus = {
      connected: true,
      timestamp: dbResult.rows[0].now,
      totalArchivos: parseInt(dbResult.rows[0].total_archivos)
    };

    res.json({
      status: 'ok',
      message: 'Sistema BibliotecaSV funcionando correctamente',
      timestamp: new Date().toISOString(),
      services: {
        api: 'ok',
        database: dbStatus,
        cors: 'enabled'
      },
      environment: {
        nodeVersion: process.version,
        port: PORT,
        dbHost: process.env.DB_HOST,
        dbName: process.env.DB_NAME
      }
    });
  } catch (error) {
    console.error('Error en status check:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error en verificación del sistema',
      error: error.message,
      services: {
        api: 'ok',
        database: 'error',
        cors: 'enabled'
      }
    });
  }
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

// ============ RUTAS DE USUARIOS ============

// Endpoint para listar usuarios (solo campos públicos)
app.get('/api/usuarios', verificarToken, async (req, res) => {
  console.log('=== GET /api/usuarios ===');
  
  try {
    // Solo devolver campos públicos, nunca la contraseña
    const query = `
      SELECT id, usuario, rol, activo
      FROM usuarios 
      ORDER BY usuario ASC
    `;
    
    const result = await pool.query(query);
    
    console.log('Usuarios encontrados:', result.rows.length);
    res.json(result.rows);
    
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener usuarios' });
  }
});

// Endpoint para obtener un usuario específico por ID (sin contraseña)
app.get('/api/usuarios/:id', verificarToken, async (req, res) => {
  console.log(`=== GET /api/usuarios/${req.params.id} ===`);
  
  try {
    const { id } = req.params;
    
    const query = `
      SELECT id, usuario, rol, activo
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
    res.status(500).json({ error: 'Error interno del servidor' });
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

// Función principal para iniciar el servidor
async function iniciarServidor() {
  try {
    console.log('🚀 Iniciando servidor BibliotecaSV...');
    
    // Verificar conexión a la base de datos antes de iniciar el servidor
    const conexionExitosa = await verificarConexionBD();
    if (!conexionExitosa) {
      console.error('💥 No se puede iniciar el servidor sin conexión a la base de datos');
      process.exit(1);
    }
    
    // Verificar que las tablas necesarias existan
    await verificarEsquemaBD();
    
    // Iniciar el servidor
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('🎉 ========================================');
      console.log('✅ Servidor BibliotecaSV iniciado correctamente');
      console.log('🎉 ========================================');
      console.log(`🌐 URL Local: http://localhost:${PORT}`);
      console.log(`🌐 URL Red: http://0.0.0.0:${PORT}`);
      console.log(`📊 Entorno: ${NODE_ENV}`);
      console.log(`🗄️ Base de datos: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
      console.log(`🔐 JWT: ${process.env.JWT_SECRET ? 'Configurado' : 'NO CONFIGURADO'}`);
      console.log('');
      console.log('📚 Endpoints disponibles:');
      console.log(`   GET  ${PORT}/api/health - Health check`);
      console.log(`   GET  ${PORT}/api/status - Estado completo del sistema`);
      console.log(`   POST ${PORT}/api/login - Autenticación`);
      console.log(`   GET  ${PORT}/api/usuarios - Lista de usuarios (requiere auth)`);
      console.log(`   GET  ${PORT}/api/archivos - Lista de archivos`);
      console.log('');
      console.log('🔧 Para debugging:');
      console.log(`   curl http://localhost:${PORT}/api/health`);
      console.log(`   curl http://localhost:${PORT}/api/status`);
      console.log('');
    });
    
    // Configurar timeouts del servidor
    server.timeout = 60000; // 60 segundos
    server.keepAliveTimeout = 65000; // 65 segundos
    server.headersTimeout = 66000; // 66 segundos
    
    // Manejo graceful de cierre del servidor
    process.on('SIGTERM', () => {
      console.log('🛑 Recibida señal SIGTERM, cerrando servidor gracefully...');
      server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        pool.end(() => {
          console.log('✅ Pool de conexiones cerrado correctamente');
          process.exit(0);
        });
      });
    });
    
    process.on('SIGINT', () => {
      console.log('🛑 Recibida señal SIGINT (Ctrl+C), cerrando servidor gracefully...');
      server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        pool.end(() => {
          console.log('✅ Pool de conexiones cerrado correctamente');
          process.exit(0);
        });
      });
    });
    
  } catch (error) {
    console.error('💥 Error fatal al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Función para verificar el esquema de la base de datos
async function verificarEsquemaBD() {
  try {
    console.log('🔍 Verificando esquema de la base de datos...');
    
    // Verificar tabla usuarios
    const usuariosResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'usuarios'
    `);
    
    // Verificar tabla catalogo_archivos
    const archivosResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'catalogo_archivos'
    `);
    
    if (usuariosResult.rows.length === 0) {
      console.warn('⚠️ Tabla "usuarios" no encontrada');
    } else {
      console.log('✅ Tabla "usuarios" encontrada');
    }
    
    if (archivosResult.rows.length === 0) {
      console.warn('⚠️ Tabla "catalogo_archivos" no encontrada');
    } else {
      console.log('✅ Tabla "catalogo_archivos" encontrada');
    }
    
  } catch (error) {
    console.warn('⚠️ Error al verificar esquema de BD:', error.message);
  }
}

// Iniciar el servidor
iniciarServidor();