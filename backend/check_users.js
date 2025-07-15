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

async function checkUsers() {
  try {
    console.log('Verificando usuarios en la base de datos...');
    
    // Verificar todos los usuarios
    const allUsersQuery = 'SELECT id, usuario, contrasena, rol, activo FROM usuarios';
    const allUsers = await pool.query(allUsersQuery);
    
    console.log('\n=== USUARIOS EN LA BASE DE DATOS ===');
    allUsers.rows.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`Usuario: "${user.usuario}"`);
      console.log(`Contraseña: "${user.contrasena}"`);
      console.log(`Rol: "${user.rol}"`);
      console.log(`Activo: ${user.activo}`);
      console.log('---');
    });
    
    // Probar query específica
    const testQuery = `
      SELECT id, usuario, rol, activo 
      FROM usuarios 
      WHERE usuario = $1 AND contrasena = $2 AND activo = true
    `;
    
    console.log('\n=== PROBANDO QUERY DE LOGIN ===');
    console.log('Usuario: "admin"');
    console.log('Contraseña: "admin123"');
    
    const result = await pool.query(testQuery, ['admin', 'admin123']);
    console.log('Resultado:', result.rows);
    
    if (result.rows.length === 0) {
      console.log('\n❌ No se encontró usuario con esas credenciales');
      
      // Probar con diferentes variaciones
      console.log('\nProbando variaciones...');
      
      const variations = [
        ['Admin', 'admin123'],
        ['admin', 'Admin123'],
        ['ADMIN', 'ADMIN123']
      ];
      
      for (const [user, pass] of variations) {
        const varResult = await pool.query(testQuery, [user, pass]);
        console.log(`"${user}" / "${pass}": ${varResult.rows.length} resultados`);
      }
    } else {
      console.log('\n✓ Usuario encontrado correctamente');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkUsers();
