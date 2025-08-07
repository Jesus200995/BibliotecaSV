require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function updatePassword() {
  try {
    console.log('Actualizando contraseña del usuario "sembrando"...');
    
    // Nueva contraseña conocida
    const nuevaContrasena = 'user123';
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
    
    // Actualizar en la base de datos
    const result = await pool.query(
      'UPDATE usuarios SET contrasena = $1 WHERE usuario = $2 RETURNING id, usuario, rol',
      [hashedPassword, 'sembrando']
    );
    
    if (result.rows.length > 0) {
      console.log('✓ Contraseña actualizada exitosamente para:', result.rows[0]);
      console.log(`Nueva contraseña: "${nuevaContrasena}"`);
    } else {
      console.log('❌ Usuario no encontrado');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

updatePassword();
