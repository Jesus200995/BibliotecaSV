require('dotenv').config();
const axios = require('axios');

async function testUsuariosEndpoint() {
  try {
    console.log('1. Haciendo login...');
    
    // Hacer login
    const loginResponse = await axios.post('http://localhost:4000/api/login', {
      usuario: 'admin',
      contrasena: 'admin123'
    });
    
    console.log('✓ Login exitoso');
    const token = loginResponse.data.token;
    console.log('Token obtenido:', token.substring(0, 20) + '...');
    
    console.log('\n2. Probando endpoint de usuarios...');
    
    // Probar endpoint de usuarios
    const usuariosResponse = await axios.get('http://localhost:4000/api/usuarios', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    console.log('✓ Endpoint de usuarios funciona correctamente');
    console.log('Respuesta completa:', usuariosResponse.data);
    console.log('Tipo de datos:', typeof usuariosResponse.data);
    console.log('Es array:', Array.isArray(usuariosResponse.data));
    
    if (Array.isArray(usuariosResponse.data)) {
      console.log('Usuarios obtenidos:', usuariosResponse.data.length);
      usuariosResponse.data.forEach(usuario => {
        console.log(`  - ${usuario.id}: ${usuario.usuario} (${usuario.rol}) - ${usuario.activo ? 'Activo' : 'Inactivo'}`);
      });
    } else {
      console.log('La respuesta no es un array');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testUsuariosEndpoint();
