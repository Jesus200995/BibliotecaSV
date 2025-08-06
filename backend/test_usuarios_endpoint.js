const axios = require('axios');

async function testUsuariosEndpoint() {
    try {
        console.log('1. Haciendo login...');
        
        // Login para obtener token
        const loginResponse = await axios.post('http://localhost:4000/api/login', {
            usuario: 'admin',
            contrasena: 'admin123' // Cambia por la contraseña correcta
        });
        
        console.log('Login response:', loginResponse.data);
        
        if (!loginResponse.data.success) {
            console.error('Error en login:', loginResponse.data.error);
            return;
        }
        
        const token = loginResponse.data.token;
        console.log('Token obtenido:', token.substring(0, 20) + '...');
        
        console.log('\n2. Probando endpoint de usuarios...');
        
        // Probar endpoint de usuarios
        const usuariosResponse = await axios.get('http://localhost:4000/api/usuarios', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Usuarios response:', usuariosResponse.status, usuariosResponse.data);
        
        if (usuariosResponse.data.success) {
            console.log('\n✅ Endpoint funcionando correctamente!');
            console.log('Usuarios encontrados:', usuariosResponse.data.usuarios.length);
            usuariosResponse.data.usuarios.forEach(usuario => {
                console.log(`- ID: ${usuario.id}, Usuario: ${usuario.usuario}, Rol: ${usuario.rol}, Activo: ${usuario.activo}`);
            });
        } else {
            console.error('❌ Error en la respuesta:', usuariosResponse.data.error);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testUsuariosEndpoint();
