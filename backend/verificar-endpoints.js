// Script para verificar que los endpoints de usuarios funcionen correctamente
require('dotenv').config();
const axios = require('axios');

// Función para verificar una URL
async function verificarUrl(url) {
  console.log(`Verificando: ${url}`);
  try {
    const respuesta = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
      },
      timeout: 5000
    });
    console.log(`✅ ${url} - OK (${respuesta.status}):`);
    console.log(`   Usuarios encontrados: ${respuesta.data.length || 0}`);
    return true;
  } catch (error) {
    console.error(`❌ ${url} - ERROR:`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Datos: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error('   No se recibió respuesta del servidor');
    } else {
      console.error(`   Error: ${error.message}`);
    }
    return false;
  }
}

// URLs a verificar
const urls = [
  'http://localhost:4000/usuarios',
  'http://localhost:4000/api/usuarios',
  'http://localhost:4000/usuarios-publico',
  'http://localhost:4000/api/usuarios-publico'
];

// Verificar todas las URLs
async function verificarTodas() {
  console.log('=== Verificación de endpoints de usuarios ===');
  const resultados = await Promise.all(urls.map(url => verificarUrl(url)));
  
  const exitosos = resultados.filter(Boolean).length;
  console.log(`\n=== Resumen ===`);
  console.log(`Total de endpoints: ${urls.length}`);
  console.log(`Exitosos: ${exitosos}`);
  console.log(`Fallidos: ${urls.length - exitosos}`);
  
  if (exitosos === 0) {
    console.error('\n❌ TODOS LOS ENDPOINTS FALLARON. Verifica que el servidor esté en ejecución.');
  } else {
    console.log('\n✅ Al menos un endpoint está funcionando correctamente.');
  }
}

// Ejecutar la verificación
verificarTodas();
