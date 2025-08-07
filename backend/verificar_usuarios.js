require('dotenv').config();
const { Pool } = require('pg');

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
    console.log('Verificando tabla de usuarios...');
    
    // Verificar si la tabla existe
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios'
      );
    `;
    
    const tableResult = await pool.query(checkTableQuery);
    
    if (tableResult.rows[0].exists) {
      console.log('✓ Tabla usuarios existe');
      
      // Obtener usuarios
      const usuariosResult = await pool.query('SELECT id, usuario, rol, activo FROM usuarios ORDER BY id');
      console.log(`✓ Usuarios encontrados: ${usuariosResult.rows.length}`);
      
      usuariosResult.rows.forEach(usuario => {
        console.log(`  - ID: ${usuario.id}, Usuario: ${usuario.usuario}, Rol: ${usuario.rol}, Activo: ${usuario.activo}`);
      });
      
    } else {
      console.log('❌ Tabla usuarios NO existe');
      
      // Crear tabla usuarios
      console.log('Creando tabla usuarios...');
      
      const createTableQuery = `
        CREATE TABLE usuarios (
          id SERIAL PRIMARY KEY,
          usuario VARCHAR(50) UNIQUE NOT NULL,
          contrasena VARCHAR(255) NOT NULL,
          rol VARCHAR(20) DEFAULT 'user',
          activo BOOLEAN DEFAULT true,
          fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      
      await pool.query(createTableQuery);
      console.log('✓ Tabla usuarios creada');
      
      // Insertar usuarios de prueba
      const insertQuery = `
        INSERT INTO usuarios (usuario, contrasena, rol, activo) VALUES
        ('admin', 'admin123', 'admin', true),
        ('sembrando', 'sembrando123', 'user', true)
        ON CONFLICT (usuario) DO NOTHING;
      `;
      
      await pool.query(insertQuery);
      console.log('✓ Usuarios de prueba insertados');
      
      // Verificar usuarios insertados
      const newUsuariosResult = await pool.query('SELECT id, usuario, rol, activo FROM usuarios ORDER BY id');
      console.log(`✓ Usuarios después de insertar: ${newUsuariosResult.rows.length}`);
      
      newUsuariosResult.rows.forEach(usuario => {
        console.log(`  - ID: ${usuario.id}, Usuario: ${usuario.usuario}, Rol: ${usuario.rol}, Activo: ${usuario.activo}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

verificarUsuarios();
