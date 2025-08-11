const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function crearUsuarioPrueba() {
  try {
    console.log('=== CREANDO USUARIO DE PRUEBA ===');
    
    // Verificar si ya existe un usuario admin
    const existingUser = await pool.query('SELECT id, usuario, rol FROM usuarios WHERE rol = $1 LIMIT 1', ['admin']);
    
    if (existingUser.rows.length > 0) {
      console.log('✅ Usuario admin ya existe:', existingUser.rows[0].usuario);
      console.log('Puedes usar este usuario para las pruebas');
      return;
    }
    
    // Crear usuario admin de prueba
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const newUser = await pool.query(`
      INSERT INTO usuarios (usuario, contrasena, rol, activo)
      VALUES ($1, $2, $3, $4)
      RETURNING id, usuario, rol, activo
    `, ['admin', hashedPassword, 'admin', true]);
    
    console.log('✅ Usuario admin creado exitosamente:', newUser.rows[0]);
    console.log('Usuario: admin');
    console.log('Contraseña: admin123');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

crearUsuarioPrueba();
