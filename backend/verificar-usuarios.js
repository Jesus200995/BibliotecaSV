// verificar-usuarios.js
// Script para verificar el funcionamiento del endpoint de usuarios

require('dotenv').config();
const axios = require('axios');

// Variables de configuración
const API_URL = process.env.API_URL || 'http://localhost:4000';
const API_PATH = '/api/usuarios';

// Función principal para verificar la API
async function verificarEndpointUsuarios() {
  console.log('=== Verificando endpoint de usuarios ===');
  console.log(`URL: ${API_URL}${API_PATH}`);
  
  try {
    // Intentar acceder al endpoint sin autenticación
    console.log('\n1. Verificando acceso sin autenticación:');
    const responseNoAuth = await axios.get(`${API_URL}${API_PATH}`);
    console.log('✓ Respuesta recibida:', {
      status: responseNoAuth.status,
      tipo: typeof responseNoAuth.data,
      esArray: Array.isArray(responseNoAuth.data),
      tamaño: Array.isArray(responseNoAuth.data) ? responseNoAuth.data.length : 'N/A'
    });
    
    if (Array.isArray(responseNoAuth.data) && responseNoAuth.data.length > 0) {
      console.log('✓ Ejemplo de usuario:', {
        id: responseNoAuth.data[0].id,
        usuario: responseNoAuth.data[0].usuario,
        rol: responseNoAuth.data[0].rol,
        activo: responseNoAuth.data[0].activo
      });
    } else {
      console.log('⚠ No se encontraron usuarios en la respuesta');
    }
    
    // Intentar iniciar sesión
    console.log('\n2. Verificando autenticación:');
    const responseLogin = await axios.post(`${API_URL}/api/login`, {
      usuario: 'admin',
      contrasena: 'admin123'
    });
    
    if (responseLogin.data.token) {
      console.log('✓ Login exitoso, token recibido');
      
      // Intentar acceso con autenticación
      console.log('\n3. Verificando acceso con autenticación:');
      const responseAuth = await axios.get(`${API_URL}${API_PATH}`, {
        headers: {
          Authorization: `Bearer ${responseLogin.data.token}`
        }
      });
      
      console.log('✓ Respuesta autenticada recibida:', {
        status: responseAuth.status,
        tipo: typeof responseAuth.data,
        esArray: Array.isArray(responseAuth.data),
        tamaño: Array.isArray(responseAuth.data) ? responseAuth.data.length : 'N/A'
      });
    } else {
      console.log('❌ Login fallido, no se pudo obtener token');
    }
    
  } catch (error) {
    console.error('❌ Error al verificar endpoint:', error.message);
    
    if (error.response) {
      console.error('Detalles de la respuesta:', {
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor. Verifica que el servidor esté en ejecución.');
    } else {
      console.error('Error en la configuración de la solicitud:', error.message);
    }
    
    process.exit(1);
  }
}

// Ejecutar verificación
verificarEndpointUsuarios();
