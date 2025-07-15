const { Pool } = require('pg');
const axios = require('axios');
require('dotenv').config();

// Cargar configuración local si existe
try {
  require('dotenv').config({ path: '.env.local' });
} catch (err) {
  // Ignorar si no existe
}

console.log('=== TEST DE CONEXIÓN Y FUNCIONALIDAD ===\n');

// Test 1: Verificar configuración
console.log('1. Verificando configuración...');
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_PORT: ${process.env.DB_PORT}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? '***' : 'NO CONFIGURADA'}`);
console.log('');

// Test 2: Conexión a base de datos
async function testDatabase() {
  console.log('2. Probando conexión a base de datos...');
  
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Conexión a BD exitosa:', result.rows[0].now);
    
    // Verificar tabla
    const tableCheck = await pool.query(`
      SELECT COUNT(*) as count FROM catalogo_archivos
    `);
    console.log(`✅ Tabla catalogo_archivos existe con ${tableCheck.rows[0].count} registros`);
    
  } catch (error) {
    console.log('❌ Error de conexión a BD:', error.message);
  } finally {
    await pool.end();
  }
}

// Test 3: Verificar servidor backend
async function testBackendServer() {
  console.log('\n3. Probando servidor backend...');
  
  try {
    // Probar estado de la BD via HTTP
    const dbStatus = await axios.get('http://localhost:4000/db-status', { timeout: 5000 });
    console.log('✅ Endpoint /db-status responde:', dbStatus.data.status);
    
    // Probar endpoint de archivos
    const archivos = await axios.get('http://localhost:4000/archivos', { timeout: 5000 });
    console.log('✅ Endpoint /archivos responde con', Array.isArray(archivos.data) ? archivos.data.length : 'datos');
    
    // Probar endpoint de archivos con prefijo API
    const archivosApi = await axios.get('http://localhost:4000/api/archivos', { timeout: 5000 });
    console.log('✅ Endpoint /api/archivos responde con', Array.isArray(archivosApi.data?.items) ? archivosApi.data.items.length : 'datos');
    
  } catch (error) {
    console.log('❌ Error del servidor backend:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('   ⚠️  El servidor backend no está ejecutándose en puerto 4000');
    }
  }
}

// Ejecutar todos los tests
async function runAllTests() {
  await testDatabase();
  await testBackendServer();
  
  console.log('\n=== INSTRUCCIONES ===');
  console.log('Si ves errores:');
  console.log('1. Asegúrate de que el backend esté ejecutándose: npm start');
  console.log('2. Verifica las variables de entorno en .env o .env.local');
  console.log('3. Confirma que PostgreSQL esté accesible');
  console.log('');
}

runAllTests();
