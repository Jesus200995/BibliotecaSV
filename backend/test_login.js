const fetch = require('node-fetch').default || require('node-fetch');

async function testLogin() {
  try {
    console.log('=== PRUEBA DE LOGIN ===\n');
    
    // Prueba 1: Login exitoso
    console.log('1. Probando login exitoso...');
    const loginResponse = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuario: 'admin',
        contrasena: 'admin123'
      })
    });
    
    const loginResult = await loginResponse.json();
    console.log('Respuesta login exitoso:', loginResult);
    
    if (loginResult.success && loginResult.token) {
      console.log('✓ Login exitoso, token recibido\n');
      
      // Prueba 2: Verificar token
      console.log('2. Probando verificación de token...');
      const verifyResponse = await fetch('http://localhost:4000/api/verify-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginResult.token}`
        }
      });
      
      const verifyResult = await verifyResponse.json();
      console.log('Respuesta verificación:', verifyResult);
      
      if (verifyResult.success) {
        console.log('✓ Token válido\n');
      } else {
        console.log('❌ Token inválido\n');
      }
      
      // Prueba 3: Acceso a ruta protegida (upload)
      console.log('3. Probando acceso a ruta protegida sin archivo...');
      const protectedResponse = await fetch('http://localhost:4000/api/archivos/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${loginResult.token}`
        }
      });
      
      const protectedResult = await protectedResponse.json();
      console.log('Respuesta ruta protegida:', protectedResult);
      
      if (protectedResponse.status === 400 && protectedResult.error === 'No se ha subido ningún archivo') {
        console.log('✓ Ruta protegida accesible con token válido\n');
      }
      
    } else {
      console.log('❌ Login falló\n');
    }
    
    // Prueba 4: Login con credenciales incorrectas
    console.log('4. Probando login con credenciales incorrectas...');
    const badLoginResponse = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuario: 'admin',
        contrasena: 'contraseña_incorrecta'
      })
    });
    
    const badLoginResult = await badLoginResponse.json();
    console.log('Respuesta login incorrecto:', badLoginResult);
    
    if (!badLoginResult.success && badLoginResponse.status === 401) {
      console.log('✓ Login rechazado correctamente\n');
    } else {
      console.log('❌ Login debería haber sido rechazado\n');
    }
    
    // Prueba 5: Acceso sin token
    console.log('5. Probando acceso sin token...');
    const noTokenResponse = await fetch('http://localhost:4000/api/archivos/upload', {
      method: 'POST'
    });
    
    const noTokenResult = await noTokenResponse.json();
    console.log('Respuesta sin token:', noTokenResult);
    
    if (noTokenResponse.status === 401) {
      console.log('✓ Acceso denegado sin token\n');
    } else {
      console.log('❌ Debería denegar acceso sin token\n');
    }
    
    console.log('=== PRUEBAS COMPLETADAS ===');
    
  } catch (error) {
    console.error('Error en las pruebas:', error);
  }
}

// Instalar node-fetch si no está disponible
async function installFetchIfNeeded() {
  try {
    require('node-fetch');
  } catch (err) {
    console.log('Instalando node-fetch...');
    const { execSync } = require('child_process');
    execSync('npm install node-fetch@2', { stdio: 'inherit' });
  }
}

// Ejecutar pruebas
(async () => {
  await installFetchIfNeeded();
  await testLogin();
})();
