const https = require('https');
const http = require('http');

// Función para testear conexión a una URL
function testConnection(url, description) {
  return new Promise((resolve) => {
    console.log(`\n🔍 Probando ${description}: ${url}`);
    
    const protocol = url.startsWith('https') ? https : http;
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (url.startsWith('https') ? 443 : 80),
      path: urlObj.pathname,
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'BibliotecaSV-Test/1.0'
      }
    };
    
    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`✅ ${description} - Status: ${res.statusCode}`);
        console.log(`   Headers: ${JSON.stringify(res.headers, null, 2)}`);
        if (data.length < 500) {
          console.log(`   Response: ${data}`);
        }
        resolve({ success: true, status: res.statusCode, data });
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ ${description} - Error: ${error.message}`);
      resolve({ success: false, error: error.message });
    });
    
    req.on('timeout', () => {
      console.log(`⏰ ${description} - Timeout`);
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
    
    req.setTimeout(10000);
    req.end();
  });
}

// Función para testear login
function testLogin(apiUrl) {
  return new Promise((resolve) => {
    console.log(`\n🔐 Probando login en: ${apiUrl}/login`);
    
    const protocol = apiUrl.startsWith('https') ? https : http;
    const urlObj = new URL(apiUrl + '/login');
    
    const postData = JSON.stringify({
      usuario: 'admin',
      contrasena: 'admin123'
    });
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (apiUrl.startsWith('https') ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'BibliotecaSV-Test/1.0'
      }
    };
    
    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`✅ Login - Status: ${res.statusCode}`);
        try {
          const response = JSON.parse(data);
          console.log(`   Success: ${response.success}`);
          console.log(`   Message: ${response.message}`);
          if (response.token) {
            console.log(`   Token recibido: ${response.token.substring(0, 20)}...`);
          }
        } catch (e) {
          console.log(`   Response: ${data}`);
        }
        resolve({ success: true, status: res.statusCode, data });
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Login - Error: ${error.message}`);
      resolve({ success: false, error: error.message });
    });
    
    req.on('timeout', () => {
      console.log(`⏰ Login - Timeout`);
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
    
    req.setTimeout(10000);
    req.write(postData);
    req.end();
  });
}

// Función principal de testing
async function runTests() {
  console.log('🧪 Iniciando tests de conectividad para Biblioteca SV\n');
  console.log('='.repeat(60));
  
  const tests = [
    // Tests básicos de conectividad
    { url: 'https://biblioteca.sembrandodatos.com', desc: 'Frontend (Producción)' },
    { url: 'https://api.biblioteca.sembrandodatos.com', desc: 'API (Producción)' },
    { url: 'https://api.biblioteca.sembrandodatos.com/test', desc: 'API Test Endpoint' },
    { url: 'https://api.biblioteca.sembrandodatos.com/db-status', desc: 'API Database Status' },
    
    // Tests locales (si están disponibles)
    { url: 'http://localhost:5173', desc: 'Frontend (Local)' },
    { url: 'http://localhost:4000', desc: 'API (Local)' },
    { url: 'http://localhost:4000/test', desc: 'API Local Test' }
  ];
  
  // Ejecutar tests de conectividad
  for (const test of tests) {
    await testConnection(test.url, test.desc);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🔐 Tests de autenticación\n');
  
  // Tests de login
  const loginTests = [
    'https://api.biblioteca.sembrandodatos.com/api',
    'http://localhost:4000/api'
  ];
  
  for (const apiUrl of loginTests) {
    await testLogin(apiUrl);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 Resumen de diagnóstico');
  console.log('='.repeat(60));
  
  console.log(`
🔧 Pasos para debugging:

1. Verificar que el backend esté corriendo:
   pm2 status
   pm2 logs biblioteca-backend

2. Verificar configuración de Nginx:
   sudo nginx -t
   sudo systemctl status nginx

3. Verificar certificados SSL:
   sudo certbot certificates

4. Verificar puertos abiertos:
   sudo netstat -tlnp | grep :443
   sudo netstat -tlnp | grep :80

5. Verificar DNS:
   nslookup api.biblioteca.sembrandodatos.com
   nslookup biblioteca.sembrandodatos.com

6. Verificar firewall:
   sudo ufw status

7. Logs del sistema:
   sudo journalctl -u nginx -f
   sudo tail -f /var/log/nginx/error.log

8. Test manual con curl:
   curl -k https://api.biblioteca.sembrandodatos.com/test
   curl -k -X POST https://api.biblioteca.sembrandodatos.com/api/login \\
     -H "Content-Type: application/json" \\
     -d '{"usuario":"admin","contrasena":"admin123"}'
  `);
}

// Ejecutar tests
runTests().catch(console.error);
