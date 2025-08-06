const fetch = require('node-fetch').default || require('node-fetch');

async function testSembrandoPassword() {
  const passwords = ['sembrando', 'user', '123', 'sembrando123', 'password'];
  
  console.log('Probando contraseñas para usuario "sembrando":');
  
  for (const pwd of passwords) {
    try {
      const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({usuario: 'sembrando', contrasena: pwd})
      });
      
      const data = await res.json();
      console.log(`Contraseña "${pwd}":`, data.success ? 'EXITOSO ✓' : data.error);
      
      if (data.success) {
        console.log('Usuario data:', data.usuario);
        break;
      }
    } catch (e) {
      console.log(`Error con "${pwd}":`, e.message);
    }
  }
}

testSembrandoPassword();
