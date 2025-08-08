const { Pool } = require('pg');
require('dotenv').config();

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
    
    // Verificar si existe la tabla usuarios
    const tablaExiste = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios'
      );
    `);
    
    if (!tablaExiste.rows[0].exists) {
      console.log('La tabla usuarios no existe, creándola...');
      
      // Crear tabla usuarios
      await pool.query(`
        CREATE TABLE usuarios (
          id SERIAL PRIMARY KEY,
          usuario VARCHAR(50) UNIQUE NOT NULL,
          contrasena VARCHAR(255) NOT NULL,
          rol VARCHAR(20) DEFAULT 'user' CHECK (rol IN ('admin', 'user')),
          activo BOOLEAN DEFAULT true,
          fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      console.log('Tabla usuarios creada exitosamente');
      
      // Insertar usuario admin por defecto
      await pool.query(`
        INSERT INTO usuarios (usuario, contrasena, rol, activo)
        VALUES ('admin', 'admin123', 'admin', true);
      `);
      
      console.log('Usuario admin creado exitosamente');
    } else {
      console.log('La tabla usuarios ya existe');
    }
    
    // Mostrar todos los usuarios
    const usuarios = await pool.query('SELECT id, usuario, rol, activo FROM usuarios ORDER BY id');
    
    console.log('\n=== USUARIOS EN LA BASE DE DATOS ===');
    usuarios.rows.forEach(usuario => {
      console.log(`ID: ${usuario.id}, Usuario: ${usuario.usuario}, Rol: ${usuario.rol}, Activo: ${usuario.activo}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

verificarUsuarios();
