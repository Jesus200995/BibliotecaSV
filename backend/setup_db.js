require('dotenv').config();
const { Pool } = require('pg');
const { hashPassword } = require('./middleware/auth');

// Cargar configuración local si existe
const fs = require('fs');
const path = require('path');

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

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function setupDatabase() {
  console.log('🔧 Configurando la base de datos...');

  try {
    // 1. Verificar si la tabla usuarios existe
    const tableExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'usuarios'
      );
    `;

    const tableExists = await pool.query(tableExistsQuery);
    
    if (!tableExists.rows[0].exists) {
      console.log('Tabla usuarios no encontrada, creándola...');
      
      // Crear la tabla usuarios
      const createTableQuery = `
        CREATE TABLE usuarios (
          id SERIAL PRIMARY KEY,
          usuario VARCHAR(50) UNIQUE NOT NULL,
          contrasena VARCHAR(255) NOT NULL,
          rol VARCHAR(50) DEFAULT 'admin',
          activo BOOLEAN DEFAULT TRUE
        );
      `;
      
      await pool.query(createTableQuery);
      console.log('✅ Tabla usuarios creada correctamente');
    } else {
      console.log('✅ Tabla usuarios ya existe');
    }

    // 2. Crear usuario admin inicial si no existe
    const adminExistsQuery = `
      SELECT EXISTS (
        SELECT FROM usuarios
        WHERE usuario = 'admin'
      );
    `;
    
    const adminExists = await pool.query(adminExistsQuery);
    
    if (!adminExists.rows[0].exists) {
      console.log('Usuario admin no encontrado, creándolo...');
      
      // Hashear contraseña
      const hashedPassword = await hashPassword('admin123');
      
      // Insertar usuario admin
      const insertAdminQuery = `
        INSERT INTO usuarios (usuario, contrasena, rol, activo)
        VALUES ('admin', $1, 'admin', true);
      `;
      
      await pool.query(insertAdminQuery, [hashedPassword]);
      console.log('✅ Usuario admin creado correctamente');
    } else {
      console.log('✅ Usuario admin ya existe');
    }

    console.log('✅ Configuración de base de datos completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error al configurar la base de datos:', error);
  } finally {
    // Cerrar la conexión a la base de datos
    await pool.end();
  }
}

// Ejecutar la configuración
setupDatabase()
  .catch(err => {
    console.error('❌ Error durante la configuración de la base de datos:', err);
    process.exit(1);
  });
