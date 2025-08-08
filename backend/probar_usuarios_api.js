const axios = require('axios');

async function probarEndpoints() {
  try {
    console.log('=== PROBANDO LOGIN ===');
    
    // Hacer login para obtener token
    const loginResponse = await axios.post('http://localhost:4000/api/login', {
      usuario: 'admin',
      contrasena: 'admin123'
    });
    
    console.log('Login exitoso:', loginResponse.data);
    
    const token = loginResponse.data.token;
    
    console.log('\n=== PROBANDO ENDPOINT DE USUARIOS ===');
    
    // Usar el token para acceder al endpoint de usuarios
    const usuariosResponse = await axios.get('http://localhost:4000/api/usuarios', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Usuarios obtenidos:');
    usuariosResponse.data.forEach(usuario => {
      console.log(`- ID: ${usuario.id}, Usuario: ${usuario.usuario}, Rol: ${usuario.rol}, Activo: ${usuario.activo}`);
    });
    
    console.log('\n=== PROBANDO CON USUARIO NO ADMIN ===');
    
    // Probar con usuario no admin
    const loginUserResponse = await axios.post('http://localhost:4000/api/login', {
      usuario: 'sembrando',
      contrasena: 'sembrando' // Necesitaríamos conocer la contraseña real
    });
    
  } catch (error) {
    if (error.response) {
      console.error('Error de respuesta:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else {
      console.error('Error de red:', error.message);
    }
  }
}

probarEndpoints();
