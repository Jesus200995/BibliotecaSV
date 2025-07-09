require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
const PORT = 4000;

// Configurar CORS
app.use(cors());
app.use(express.json());
// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

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

// Endpoint para listar archivos (optimizado, con paginación)
app.get('/archivos', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    
    // Excluir el campo archivo_contenido para mejorar el rendimiento
    const query = `
      SELECT id, nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, 
             archivo_url, fuente, responsable, alcance_geografico, validacion, observaciones
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

// Endpoint para subir archivos
app.post('/archivos/upload', upload.single('file'), async (req, res) => {
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

    console.log('Campos adicionales:', {
      descripcion, etiquetas, responsable, fuente, 
      alcance_geografico, validacion, observaciones
    });

    // Insertar en PostgreSQL incluyendo el contenido del archivo (que está en memoria)
    const query = `
      INSERT INTO catalogo_archivos
      (nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, archivo_url, fuente, responsable, alcance_geografico, validacion, observaciones, archivo_contenido)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id, nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, archivo_url, fuente, responsable, alcance_geografico, validacion, observaciones
    `;
    const values = [
      nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, archivo_url,
      fuente, responsable, alcance_geografico, validacion, observaciones, archivo.buffer
    ];

    const result = await pool.query(query, values);
    console.log('Archivo guardado en la base de datos con ID:', result.rows[0].id);
    
    res.json({ mensaje: 'Archivo subido y registrado', registro: result.rows[0] });
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para actualizar un archivo por su ID
app.put('/archivos/:id', async (req, res) => {
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
      observaciones
    } = req.body;

    console.log('Actualizando archivo ID:', id);
    console.log('Datos recibidos:', req.body);

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
        fecha_actualizacion = $10
      WHERE id = $11
      RETURNING id, nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, archivo_url, fuente, responsable, alcance_geografico, validacion, observaciones
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