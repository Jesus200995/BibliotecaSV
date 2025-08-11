const axios = require('axios');

async function testUsuarioFiltro() {
  try {
    // Login
    const loginResponse = await axios.post('http://localhost:4000/api/login', {
      usuario: 'admin',
      contrasena: 'admin123'
    });
    
    const token = loginResponse.data.token;
    
    // La URL exacta que está fallando
    const url = 'http://localhost:4000/api/historiales?limit=50&offset=0&usuario_id=19';
    console.log('Probando URL:', url);
    
    const response = await axios.get(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('✅ Respuesta exitosa:', response.data);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testUsuarioFiltro();
