require('dotenv').config();
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

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');

// Imprimir información de conexión
console.log('Configuración de conexión a BD:');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Puerto: ${process.env.DB_PORT}`);
console.log(`Base de datos: ${process.env.DB_NAME}`);
console.log(`Usuario: ${process.env.DB_USER}`);
console.log(`Contraseña: ${process.env.DB_PASSWORD ? '******' : 'no configurada'}`);

// Asegúrate de crear la carpeta si no existe:
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    console.log(`Creando directorio de uploads: ${uploadsDir}`);
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de almacenamiento para los archivos subidos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Carpeta donde guardar los archivos (usando ruta absoluta)
  },
  filename: function (req, file, cb) {
    // Limpiar el nombre del archivo para evitar problemas
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9\-_.]/g, '_');
    cb(null, Date.now() + '-' + cleanName);
  }
});
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
// Servir archivos estáticos desde la carpeta uploads
app.use('/descargas', express.static(uploadsDir));
// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Configurar PostgreSQL
console.log('Configurando conexión a PostgreSQL...');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Endpoint para listar archivos
app.get('/archivos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM catalogo_archivos ORDER BY fecha_actualizacion DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener un archivo específico por ID
app.get('/archivos/:id', async (req, res) => {
  const archivoId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM catalogo_archivos WHERE id = $1', [archivoId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para los campos de un archivo
app.get('/archivos/:id/campos', async (req, res) => {
  const archivoId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM archivo_campos WHERE archivo_id = $1', [archivoId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Prueba de vida
app.get('/', (req, res) => {
  res.send('Backend corriendo');
});

// Ruta para probar la conexión a la base de datos
app.get('/db-status', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as time');
    client.release();
    
    res.json({
      status: 'success',
      message: 'Conexión a la base de datos exitosa',
      time: result.rows[0].time,
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER
      }
    });
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al conectar a la base de datos',
      error: error.message
    });
  }
});

// Ruta de prueba para formularios de subida
app.get('/test-upload', (req, res) => {
  res.send(`
    <h1>Prueba de subida de archivos</h1>
    <form action="/archivos/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="file"><br>
      <input type="text" name="descripcion" placeholder="Descripción"><br>
      <input type="text" name="etiquetas" placeholder="Etiquetas"><br>
      <input type="text" name="responsable" placeholder="Responsable"><br>
      <button>Subir</button>
    </form>
  `);
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
    const archivo_url = archivo.filename;

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

    // Insertar en PostgreSQL
    const query = `
      INSERT INTO catalogo_archivos
      (nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, archivo_url, fuente, responsable, alcance_geografico, validacion, observaciones)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    const values = [
      nombre, descripcion, tipo, fecha_actualizacion, tamano, etiquetas, archivo_url,
      fuente, responsable, alcance_geografico, validacion, observaciones
    ];

    const result = await pool.query(query, values);
    console.log('Archivo guardado en la base de datos con ID:', result.rows[0].id);
    res.json({ mensaje: 'Archivo subido y registrado', registro: result.rows[0] });
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
