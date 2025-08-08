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

async function crearUsuariosDePrueba() {
  try {
    console.log('Creando usuarios de prueba...');
    
    const usuariosPrueba = [
      { usuario: 'carlos_admin', contrasena: 'carlos123', rol: 'admin', activo: true },
      { usuario: 'maria_user', contrasena: 'maria123', rol: 'user', activo: true },
      { usuario: 'juan_user', contrasena: 'juan123', rol: 'user', activo: false },
      { usuario: 'ana_admin', contrasena: 'ana123', rol: 'admin', activo: true },
      { usuario: 'pedro_user', contrasena: 'pedro123', rol: 'user', activo: true }
    ];
    
    for (const usuario of usuariosPrueba) {
      try {
        await pool.query(
          'INSERT INTO usuarios (usuario, contrasena, rol, activo) VALUES ($1, $2, $3, $4)',
          [usuario.usuario, usuario.contrasena, usuario.rol, usuario.activo]
        );
        console.log(`✓ Usuario creado: ${usuario.usuario} (${usuario.rol})`);
      } catch (error) {
        if (error.code === '23505') { // Error de duplicación
          console.log(`- Usuario ya existe: ${usuario.usuario}`);
        } else {
          console.error(`✗ Error creando ${usuario.usuario}:`, error.message);
        }
      }
    }
    
    // Mostrar todos los usuarios
    const usuarios = await pool.query('SELECT id, usuario, rol, activo FROM usuarios ORDER BY id');
    
    console.log('\n=== USUARIOS EN LA BASE DE DATOS ===');
    usuarios.rows.forEach(usuario => {
      const estado = usuario.activo ? '✅' : '❌';
      const rolIcon = usuario.rol === 'admin' ? '👑' : '👤';
      console.log(`${estado} ${rolIcon} ID: ${usuario.id} | ${usuario.usuario} | ${usuario.rol.toUpperCase()}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

crearUsuariosDePrueba();
