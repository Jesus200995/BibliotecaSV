require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Asegúrate de crear la carpeta si no existe:
if (!fs.existsSync('uploads')){
    fs.mkdirSync('uploads');
}

// Configuración de almacenamiento para los archivos subidos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Carpeta donde guardar los archivos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

const app = express();
const PORT = 4000;

// Configurar CORS
app.use(cors());
app.use(express.json());
// Servir archivos estáticos desde la carpeta uploads
app.use('/descargas', express.static(path.join(__dirname, 'uploads')));

// Configurar PostgreSQL
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

// Endpoint para subir archivos
app.post('/archivos/upload', upload.single('file'), async (req, res) => {
  try {
    const archivo = req.file;

    // Datos básicos del archivo
    const nombre = archivo.originalname;
    const tipo = path.extname(nombre).substring(1).toUpperCase(); // "CSV", "XLSX", "ZIP" etc
    const fecha_actualizacion = new Date();
    const tamano = archivo.size;
    const archivo_url = archivo.filename;

    // Puedes dejar los demás campos como null o vacío para pruebas
    const descripcion = '';
    const etiquetas = '';
    const fuente = '';
    const responsable = '';
    const alcance_geografico = '';
    const validacion = '';
    const observaciones = '';

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
    res.json({ mensaje: 'Archivo subido y registrado', registro: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
