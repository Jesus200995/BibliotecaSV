require('dotenv').config();
const { Pool } = require('pg');

// Conectar a PostgreSQL como administrador (base postgres por defecto)
const adminPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'postgres', // Base de datos por defecto
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function createDatabase() {
  try {
    console.log('Conectando a PostgreSQL...');
    
    // Verificar conexión
    const testQuery = await adminPool.query('SELECT NOW()');
    console.log('✓ Conexión exitosa a PostgreSQL');
    console.log('Tiempo de conexión:', testQuery.rows[0].now);
    
    // Verificar si la base de datos 'sembrando' existe
    const checkDbQuery = `
      SELECT 1 FROM pg_database WHERE datname = 'sembrando'
    `;
    
    const dbResult = await adminPool.query(checkDbQuery);
    
    if (dbResult.rows.length === 0) {
      console.log('Base de datos "sembrando" no existe. Creándola...');
      
      // Crear la base de datos
      await adminPool.query('CREATE DATABASE sembrando');
      console.log('✓ Base de datos "sembrando" creada exitosamente');
    } else {
      console.log('✓ Base de datos "sembrando" ya existe');
    }
    
    console.log('\n✓ Setup de base de datos completado');
    
  } catch (error) {
    console.error('❌ Error en setup de base de datos:', error);
  } finally {
    await adminPool.end();
  }
}

createDatabase();
