const axios = require('axios');

async function testDirecto() {
  try {
    // Login primero
    const login = await axios.post('http://localhost:4000/api/login', {
      usuario: 'admin',
      contrasena: 'admin123'
    });
    
    const token = login.data.token;
    
    // Probar con solo un parámetro
    console.log('Probando con archivo_id=47...');
    
    const response = await axios.get('http://localhost:4000/api/historiales?archivo_id=47', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('✅ Respuesta exitosa:', response.data);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testDirecto();
