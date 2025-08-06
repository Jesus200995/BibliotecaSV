require('dotenv').config();
const { Pool } = require('pg');

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function verificarUsuarios() {
  try {
    console.log('Conectando a la base de datos...');
    
    // Verificar conexión
    const test = await pool.query('SELECT NOW()');
    console.log('Conexión exitosa:', test.rows[0].now);
    
    // Verificar si existe la tabla usuarios
    const tablaExiste = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios'
      );
    `);
    
    console.log('¿Tabla usuarios existe?', tablaExiste.rows[0].exists);
    
    if (tablaExiste.rows[0].exists) {
      // Obtener usuarios
      const usuarios = await pool.query('SELECT id, usuario, rol, activo FROM usuarios ORDER BY id');
      console.log('Usuarios encontrados:', usuarios.rows.length);
      console.log('Usuarios:', usuarios.rows);
    } else {
      console.log('La tabla usuarios no existe');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

verificarUsuarios();
