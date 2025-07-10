require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Cargar configuración local si existe
try {
  if (fs.existsSync(path.join(__dirname, '.env.local'))) {
    require('dotenv').config({ path: path.join(__dirname, '.env.local') });
    console.log('Cargada configuración local desde .env.local');
  }
} catch (err) {
  console.error('Error al cargar .env.local:', err);
}

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function addCoordinatesColumns() {
  try {
    console.log('Conectando a la base de datos...');
    
    // Verificar si las columnas ya existen
    const checkColumns = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'catalogo_archivos' 
      AND column_name IN ('latitud', 'longitud', 'coordenadas_json');
    `);
    
    const existingColumns = checkColumns.rows.map(row => row.column_name);
    
    if (existingColumns.includes('latitud') && existingColumns.includes('longitud') && existingColumns.includes('coordenadas_json')) {
      console.log('Las columnas de coordenadas ya existen');
      return;
    }
    
    console.log('Agregando columnas de coordenadas...');
    
    // Agregar columnas de coordenadas
    if (!existingColumns.includes('latitud')) {
      await pool.query('ALTER TABLE catalogo_archivos ADD COLUMN latitud DECIMAL(10, 7)');
      console.log('Columna latitud agregada');
    }
    
    if (!existingColumns.includes('longitud')) {
      await pool.query('ALTER TABLE catalogo_archivos ADD COLUMN longitud DECIMAL(10, 7)');
      console.log('Columna longitud agregada');
    }
    
    if (!existingColumns.includes('coordenadas_json')) {
      await pool.query('ALTER TABLE catalogo_archivos ADD COLUMN coordenadas_json JSONB');
      console.log('Columna coordenadas_json agregada');
    }
    
    console.log('Columnas de coordenadas agregadas exitosamente');
    
  } catch (error) {
    console.error('Error al agregar columnas de coordenadas:', error);
  } finally {
    await pool.end();
  }
}

// Ejecutar la migración
addCoordinatesColumns();
