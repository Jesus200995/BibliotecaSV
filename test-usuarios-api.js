const axios = require('axios');

// Script para probar los endpoints de usuarios en el VPS

const baseUrls = [
  'http://localhost:4000',                        // Local
  'https://api.biblioteca.sembrandodatos.com',    // VPS API
  'https://biblioteca.sembrandodatos.com'         // VPS Frontend
];

const endpoints = [
  '/health',
  '/api/health',
  '/test-usuarios',
  '/api/test-usuarios',
  '/usuarios-publico',
  '/api/usuarios-publico',
  '/usuarios/usuarios-publico',
  '/api/usuarios/usuarios-publico',
  '/usuarios/publico',
  '/api/usuarios/publico',
  '/usuarios',
  '/api/usuarios'
];

async function testEndpoint(baseUrl, endpoint) {
  try {
    console.log(`\n🧪 Probando: ${baseUrl}${endpoint}`);
    
    const response = await axios.get(`${baseUrl}${endpoint}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Script/1.0'
      },
      timeout: 10000
    });
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📄 Content-Type: ${response.headers['content-type']}`);
    
    if (response.headers['content-type']?.includes('application/json')) {
      if (Array.isArray(response.data)) {
        console.log(`📊 Usuarios encontrados: ${response.data.length}`);
        if (response.data.length > 0) {
          console.log(`👤 Primer usuario:`, response.data[0]);
        }
      } else if (response.data.usuarios) {
        console.log(`📊 Usuarios encontrados: ${response.data.usuarios.length}`);
        if (response.data.usuarios.length > 0) {
          console.log(`👤 Primer usuario:`, response.data.usuarios[0]);
        }
      } else {
        console.log(`📄 Respuesta:`, response.data);
      }
    } else {
      console.log(`⚠️  Respuesta no es JSON:`, response.data?.substring(0, 100) + '...');
    }
    
  } catch (error) {
    if (error.response) {
      console.log(`❌ Error ${error.response.status}: ${error.response.statusText}`);
      console.log(`📄 Content-Type: ${error.response.headers['content-type']}`);
      
      if (error.response.headers['content-type']?.includes('text/html')) {
        console.log(`⚠️  Respuesta HTML (probablemente proxy o nginx):`, error.response.data?.substring(0, 100) + '...');
      } else {
        console.log(`📄 Error data:`, error.response.data);
      }
    } else if (error.request) {
      console.log(`❌ Sin respuesta del servidor: ${error.message}`);
    } else {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

async function runTests() {
  console.log('🚀 Iniciando pruebas de endpoints de usuarios...\n');
  
  for (const baseUrl of baseUrls) {
    console.log(`\n🌐 Probando servidor: ${baseUrl}`);
    console.log('='.repeat(50));
    
    for (const endpoint of endpoints) {
      await testEndpoint(baseUrl, endpoint);
      await new Promise(resolve => setTimeout(resolve, 500)); // Pausa entre requests
    }
  }
  
  console.log('\n✨ Pruebas completadas');
}

// Ejecutar las pruebas
runTests().catch(console.error);
