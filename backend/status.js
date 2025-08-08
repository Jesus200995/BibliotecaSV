#!/usr/bin/env node

/**
 * Script de verificación rápida del estado de BibliotecaSV
 * Uso: node status.js
 */

const http = require('http');
const https = require('https');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Colores para consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Función para hacer requests HTTP
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const timeout = options.timeout || 5000;
    
    const req = client.get(url, { timeout }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data),
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function verificarEstado() {
  log('\n🔍 ESTADO DEL SISTEMA BIBLIOTECA SV', 'bright');
  log('='.repeat(50), 'blue');
  
  const resultados = {
    backend_local: false,
    backend_prod: false,
    database: false,
    frontend_build: false
  };

  // 1. Backend Local
  log('\n🌐 Backend Local (desarrollo):', 'yellow');
  try {
    const response = await makeRequest('http://localhost:4000/api/health');
    if (response.status === 200 && response.data.status === 'ok') {
      log('✅ http://localhost:4000/api/health - OK', 'green');
      resultados.backend_local = true;
      
      // Probar endpoint de usuarios si hay token
      log('🔐 Probando endpoint de usuarios...', 'blue');
      // (Este test requeriría un token, lo saltamos por ahora)
      
    } else {
      log(`❌ Backend local respondió con status: ${response.status}`, 'red');
    }
  } catch (error) {
    log(`❌ Backend local no disponible: ${error.message}`, 'red');
  }

  // 2. Backend Producción (si aplica)
  log('\n🌍 Backend Producción:', 'yellow');
  try {
    const response = await makeRequest('https://biblioteca.sembrandodatos.com:4000/api/health');
    if (response.status === 200 && response.data.status === 'ok') {
      log('✅ https://biblioteca.sembrandodatos.com:4000/api/health - OK', 'green');
      resultados.backend_prod = true;
    } else {
      log(`⚠️ Backend producción respondió con status: ${response.status}`, 'yellow');
    }
  } catch (error) {
    log(`⚠️ Backend producción no disponible: ${error.message}`, 'yellow');
  }

  // 3. Base de datos
  log('\n🗄️ Base de Datos:', 'yellow');
  try {
    require('dotenv').config();
    
    if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD) {
      const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        connectionTimeoutMillis: 3000,
      });
      
      const client = await pool.connect();
      const result = await client.query('SELECT NOW(), COUNT(*) as usuarios FROM usuarios');
      const archivos = await client.query('SELECT COUNT(*) as archivos FROM catalogo_archivos');
      client.release();
      await pool.end();
      
      log('✅ Conexión a PostgreSQL exitosa', 'green');
      log(`   📊 Usuarios: ${result.rows[0].usuarios}`, 'blue');
      log(`   📁 Archivos: ${archivos.rows[0].archivos}`, 'blue');
      log(`   🕒 Timestamp: ${result.rows[0].now}`, 'blue');
      resultados.database = true;
      
    } else {
      log('⚠️ Variables de entorno de BD no configuradas', 'yellow');
    }
  } catch (error) {
    log(`❌ Error de conexión a BD: ${error.message}`, 'red');
  }

  // 4. Frontend Build
  log('\n🎨 Frontend:', 'yellow');
  const frontendDir = path.join(__dirname, '..', 'frontend');
  const distDir = path.join(frontendDir, 'dist');
  
  if (fs.existsSync(distDir)) {
    const indexFile = path.join(distDir, 'index.html');
    if (fs.existsSync(indexFile)) {
      log('✅ Build de producción existe', 'green');
      
      // Verificar tamaño del build
      const stats = fs.statSync(distDir);
      log(`   📦 Build date: ${stats.mtime.toISOString()}`, 'blue');
      resultados.frontend_build = true;
    } else {
      log('❌ Build incompleto (no index.html)', 'red');
    }
  } else {
    log('⚠️ No hay build de producción (ejecutar npm run build)', 'yellow');
  }

  // 5. Archivos de configuración
  log('\n⚙️ Configuración:', 'yellow');
  const configFiles = [
    { path: '.env', name: 'Entorno base' },
    { path: '.env.local', name: 'Entorno local' },
    { path: '.env.production', name: 'Entorno producción' },
    { path: 'ecosystem.config.js', name: 'Configuración PM2' }
  ];

  configFiles.forEach(({ path: filePath, name }) => {
    if (fs.existsSync(filePath)) {
      log(`✅ ${name}: ${filePath}`, 'green');
    } else {
      log(`⚠️ ${name}: ${filePath} (no encontrado)`, 'yellow');
    }
  });

  // 6. Resumen final
  log('\n📊 RESUMEN:', 'bright');
  log('='.repeat(30), 'blue');
  
  const total = Object.keys(resultados).length;
  const exitosos = Object.values(resultados).filter(Boolean).length;
  const porcentaje = Math.round((exitosos / total) * 100);
  
  if (porcentaje >= 75) {
    log(`✅ Sistema funcional: ${exitosos}/${total} (${porcentaje}%)`, 'green');
  } else if (porcentaje >= 50) {
    log(`⚠️ Sistema parcial: ${exitosos}/${total} (${porcentaje}%)`, 'yellow');
  } else {
    log(`❌ Sistema con problemas: ${exitosos}/${total} (${porcentaje}%)`, 'red');
  }

  // 7. Recomendaciones
  log('\n💡 Recomendaciones:', 'yellow');
  
  if (!resultados.backend_local) {
    log('   • Iniciar backend local: npm start', 'blue');
  }
  
  if (!resultados.database) {
    log('   • Verificar configuración de BD: node verify-config.js', 'blue');
  }
  
  if (!resultados.frontend_build) {
    log('   • Construir frontend: npm run build (en directorio frontend)', 'blue');
  }

  log('\n🔗 URLs útiles:', 'yellow');
  log('   • Backend local: http://localhost:4000/api/health', 'blue');
  log('   • Frontend local: http://localhost:5173 o 5174', 'blue');
  log('   • Producción: https://biblioteca.sembrandodatos.com', 'blue');

  log('');
}

// Ejecutar verificación
verificarEstado().catch(error => {
  log(`💥 Error fatal: ${error.message}`, 'red');
  process.exit(1);
});
