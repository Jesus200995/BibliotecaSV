const axios = require('axios');

console.log('=== TEST DE INTEGRACIÓN FRONTEND-BACKEND ===\n');

const BASE_URL = 'http://localhost:4000';
const API_URL = 'http://localhost:4000/api';

async function testEndpoint(url, description) {
  console.log(`🔍 Probando: ${description}`);
  console.log(`   URL: ${url}`);
  
  try {
    const response = await axios.get(url, { timeout: 5000 });
    const data = response.data;
    
    console.log(`   ✅ Estado: ${response.status}`);
    
    if (Array.isArray(data)) {
      console.log(`   📊 Datos: Array con ${data.length} elementos`);
    } else if (data.items && Array.isArray(data.items)) {
      console.log(`   📊 Datos: Objeto con ${data.items.length} items`);
      console.log(`   📊 Metadata:`, data.metadata || 'No disponible');
    } else if (typeof data === 'object') {
      console.log(`   📊 Datos: Objeto con claves:`, Object.keys(data));
    } else {
      console.log(`   📊 Datos: ${typeof data}`);
    }
    
    return { success: true, data };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    if (error.response) {
      console.log(`   📊 Estado HTTP: ${error.response.status}`);
      console.log(`   📊 Datos error:`, error.response.data);
    }
    return { success: false, error };
  }
  
  console.log('');
}

async function runTests() {
  const tests = [
    // Tests básicos de conectividad
    { url: `${BASE_URL}/db-status`, desc: 'Estado de la base de datos (sin prefijo)' },
    { url: `${API_URL}/db-status`, desc: 'Estado de la base de datos (con prefijo /api)' },
    
    // Tests de archivos
    { url: `${BASE_URL}/archivos`, desc: 'Lista de archivos (sin prefijo)' },
    { url: `${API_URL}/archivos`, desc: 'Lista de archivos (con prefijo /api)' },
    { url: `${API_URL}/archivos?limit=10`, desc: 'Lista limitada de archivos' },
    { url: `${API_URL}/archivos?limit=1000`, desc: 'Lista completa para estadísticas' },
  ];
  
  console.log('Ejecutando tests de integración...\n');
  
  const results = [];
  for (const test of tests) {
    const result = await testEndpoint(test.url, test.desc);
    results.push({ test: test.desc, ...result });
    await new Promise(resolve => setTimeout(resolve, 500)); // Pausa entre tests
  }
  
  // Resumen de resultados
  console.log('\n=== RESUMEN DE RESULTADOS ===');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Exitosos: ${successful}`);
  console.log(`❌ Fallidos: ${failed}`);
  
  if (failed > 0) {
    console.log('\n❌ Tests fallidos:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.test}`);
    });
  }
  
  // Verificar datos específicos si hay archivos
  const archivosTest = results.find(r => r.test.includes('Lista de archivos') && r.success);
  if (archivosTest && archivosTest.data) {
    console.log('\n=== ANÁLISIS DE DATOS ===');
    const archivos = archivosTest.data.items || archivosTest.data || [];
    
    if (archivos.length > 0) {
      console.log(`📁 Total de archivos: ${archivos.length}`);
      
      // Analizar tipos de archivo
      const tipos = {};
      archivos.forEach(archivo => {
        const tipo = archivo.tipo || 'Sin tipo';
        tipos[tipo] = (tipos[tipo] || 0) + 1;
      });
      
      console.log('📊 Tipos de archivo:', tipos);
      
      // Analizar ubicaciones geográficas
      const ubicaciones = archivos
        .filter(a => a.alcance_geografico)
        .map(a => a.alcance_geografico)
        .reduce((acc, ubicacion) => {
          acc[ubicacion] = (acc[ubicacion] || 0) + 1;
          return acc;
        }, {});
      
      console.log('🗺️  Ubicaciones geográficas:', Object.keys(ubicaciones).length, 'únicas');
      
      // Ejemplo de archivo
      console.log('📄 Ejemplo de archivo:', {
        id: archivos[0].id,
        nombre: archivos[0].nombre,
        tipo: archivos[0].tipo,
        tamano: archivos[0].tamano,
        alcance_geografico: archivos[0].alcance_geografico,
        validacion: archivos[0].validacion
      });
    } else {
      console.log('📁 No hay archivos en la base de datos');
    }
  }
  
  console.log('\n=== RECOMENDACIONES ===');
  if (successful === tests.length) {
    console.log('🎉 ¡Todos los tests pasaron! El frontend debería funcionar correctamente.');
  } else {
    console.log('⚠️  Algunos tests fallaron. Verifica:');
    console.log('   1. Que el servidor backend esté corriendo en puerto 4000');
    console.log('   2. Que la base de datos esté conectada y tenga datos');
    console.log('   3. Que las configuraciones CORS estén correctas');
  }
  
  console.log('\n📝 Para el frontend:');
  console.log('   - EstadisticasView debería usar: /api/archivos?limit=1000');
  console.log('   - MapaView debería usar: /api/archivos?limit=1000');
  console.log('   - ArchivosView debería usar: /api/archivos');
}

// Ejecutar los tests
runTests().catch(console.error);
