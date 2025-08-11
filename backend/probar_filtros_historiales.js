const axios = require('axios');

// URL del backend
const BACKEND_URL = 'http://localhost:4000';

async function probarFiltroHistoriales() {
  try {
    console.log('=== PRUEBA DE FILTROS DE HISTORIALES ===');
    
    // 1. Hacer login
    console.log('1. Haciendo login...');
    const loginResponse = await axios.post(`${BACKEND_URL}/api/login`, {
      usuario: 'admin',
      contrasena: 'admin123'
    });
    
    if (!loginResponse.data.success) {
      throw new Error('Login fallido');
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Login exitoso');
    
    // 2. Probar obtener todos los historiales
    console.log('\\n2. Obteniendo todos los historiales...');
    const todosHistoriales = await axios.get(`${BACKEND_URL}/api/historiales`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('✅ Total de historiales:', todosHistoriales.data.total);
    console.log('Registros devueltos:', todosHistoriales.data.data.length);
    
    if (todosHistoriales.data.data.length > 0) {
      const primerRegistro = todosHistoriales.data.data[0];
      console.log('Primer registro:', {
        id: primerRegistro.id,
        usuario: primerRegistro.usuario,
        archivo_id: primerRegistro.archivo_id,
        archivo_nombre: primerRegistro.archivo_nombre,
        accion: primerRegistro.accion
      });
      
      // 3. Probar filtro por usuario
      console.log('\\n3. Probando filtro por usuario...');
      const porUsuario = await axios.get(`${BACKEND_URL}/api/historiales?usuario_id=${primerRegistro.usuario_id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('✅ Filtro por usuario ID', primerRegistro.usuario_id, ':', porUsuario.data.data.length, 'registros');
      
      // 4. Probar filtro por archivo
      console.log('\\n4. Probando filtro por archivo...');
      const porArchivo = await axios.get(`${BACKEND_URL}/api/historiales?archivo_id=${primerRegistro.archivo_id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('✅ Filtro por archivo ID', primerRegistro.archivo_id, ':', porArchivo.data.data.length, 'registros');
      
      // 5. Probar filtro por fecha
      console.log('\\n5. Probando filtro por fecha...');
      const hoy = new Date().toISOString().split('T')[0];
      const porFecha = await axios.get(`${BACKEND_URL}/api/historiales?desde=${hoy}T00:00:00Z`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('✅ Filtro por fecha desde hoy:', porFecha.data.data.length, 'registros');
    }
    
    console.log('\\n🎉 Todas las pruebas de filtros completadas exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.status);
      console.error('Datos del error:', error.response.data);
    }
  }
}

probarFiltroHistoriales();
