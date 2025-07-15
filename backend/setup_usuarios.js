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

async function setupUsuarios() {
  try {
    console.log('Conectando a la base de datos...');
    
    // Verificar conexión
    const testQuery = await pool.query('SELECT NOW()');
    console.log('✓ Conexión exitosa a la base de datos');
    console.log('Tiempo de conexión:', testQuery.rows[0].now);
    
    // Crear tabla usuarios si no existe
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS usuarios (
          id SERIAL PRIMARY KEY,
          usuario VARCHAR(50) UNIQUE NOT NULL,
          contrasena VARCHAR(255) NOT NULL,
          rol VARCHAR(50) DEFAULT 'admin',
          activo BOOLEAN DEFAULT TRUE,
          fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await pool.query(createTableQuery);
    console.log('✓ Tabla usuarios verificada/creada');
    
    // Verificar si existe el usuario admin
    const checkAdminQuery = 'SELECT * FROM usuarios WHERE usuario = $1';
    const adminResult = await pool.query(checkAdminQuery, ['admin']);
    
    if (adminResult.rows.length === 0) {
      // Crear usuario admin inicial
      const insertAdminQuery = `
        INSERT INTO usuarios (usuario, contrasena, rol, activo)
        VALUES ($1, $2, $3, $4)
        RETURNING id, usuario, rol, activo
      `;
      
      const newAdmin = await pool.query(insertAdminQuery, ['admin', 'admin123', 'admin', true]);
      console.log('✓ Usuario admin creado:', newAdmin.rows[0]);
    } else {
      console.log('✓ Usuario admin ya existe:', {
        id: adminResult.rows[0].id,
        usuario: adminResult.rows[0].usuario,
        rol: adminResult.rows[0].rol,
        activo: adminResult.rows[0].activo
      });
    }
    
    // Mostrar todos los usuarios
    const allUsersQuery = 'SELECT id, usuario, rol, activo FROM usuarios ORDER BY id';
    const allUsers = await pool.query(allUsersQuery);
    
    console.log('\n=== USUARIOS EN LA BASE DE DATOS ===');
    console.table(allUsers.rows);
    
    console.log('\n✓ Setup de usuarios completado exitosamente');
    
  } catch (error) {
    console.error('❌ Error en setup de usuarios:', error);
  } finally {
    await pool.end();
  }
}

setupUsuarios();
