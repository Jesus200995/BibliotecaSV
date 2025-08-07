#!/usr/bin/env node

/**
 * Script de prueba para verificar la configuración del backend
 * Puede ejecutarse tanto en desarrollo como en producción
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Colores para la consola
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

async function verificarConfiguracion() {
  log('\n🔍 VERIFICANDO CONFIGURACIÓN DEL BACKEND', 'bright');
  log('='.repeat(50), 'blue');
  
  // 1. Verificar variables de entorno
  log('\n📋 Variables de entorno:', 'yellow');
  const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'];
  let allVarsPresent = true;
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      log(`✅ ${varName}: Configurada`, 'green');
    } else {
      log(`❌ ${varName}: NO CONFIGURADA`, 'red');
      allVarsPresent = false;
    }
  });
  
  // 2. Verificar archivos de configuración
  log('\n📁 Archivos de configuración:', 'yellow');
  const configFiles = ['.env', '.env.local', '.env.production'];
  
  configFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      log(`✅ ${file}: Existe`, 'green');
    } else {
      log(`⚠️  ${file}: No existe`, 'yellow');
    }
  });
  
  // 3. Verificar conexión a base de datos
  log('\n🗄️ Conexión a base de datos:', 'yellow');
  if (allVarsPresent) {
    try {
      const { Pool } = require('pg');
      const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        connectionTimeoutMillis: 5000,
      });
      
      const client = await pool.connect();
      const result = await client.query('SELECT NOW(), version()');
      client.release();
      await pool.end();
      
      log('✅ Conexión a PostgreSQL exitosa', 'green');
      log(`   Timestamp: ${result.rows[0].now}`, 'blue');
      log(`   Version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`, 'blue');
      
    } catch (error) {
      log(`❌ Error de conexión: ${error.message}`, 'red');
    }
  } else {
    log('⏭️  Saltando prueba de BD (variables faltantes)', 'yellow');
  }
  
  // 4. Verificar tablas necesarias
  if (allVarsPresent) {
    log('\n📊 Verificando tablas:', 'yellow');
    try {
      const { Pool } = require('pg');
      const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      });
      
      // Verificar tabla usuarios
      const usuariosResult = await pool.query(`
        SELECT COUNT(*) as count FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'usuarios'
      `);
      
      if (parseInt(usuariosResult.rows[0].count) > 0) {
        const userCount = await pool.query('SELECT COUNT(*) as count FROM usuarios');
        log(`✅ Tabla usuarios: ${userCount.rows[0].count} registros`, 'green');
      } else {
        log('❌ Tabla usuarios: No encontrada', 'red');
      }
      
      // Verificar tabla catalogo_archivos
      const archivosResult = await pool.query(`
        SELECT COUNT(*) as count FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'catalogo_archivos'
      `);
      
      if (parseInt(archivosResult.rows[0].count) > 0) {
        const fileCount = await pool.query('SELECT COUNT(*) as count FROM catalogo_archivos');
        log(`✅ Tabla catalogo_archivos: ${fileCount.rows[0].count} registros`, 'green');
      } else {
        log('❌ Tabla catalogo_archivos: No encontrada', 'red');
      }
      
      await pool.end();
      
    } catch (error) {
      log(`❌ Error verificando tablas: ${error.message}`, 'red');
    }
  }
  
  // 5. Resumen final
  log('\n📋 RESUMEN:', 'bright');
  log('='.repeat(30), 'blue');
  
  if (allVarsPresent) {
    log('✅ Configuración básica: COMPLETA', 'green');
  } else {
    log('❌ Configuración básica: INCOMPLETA', 'red');
  }
  
  log('\n🚀 Para iniciar el servidor:', 'yellow');
  log('   npm run dev    (desarrollo)', 'blue');
  log('   npm run prod   (producción)', 'blue');
  log('   npm start      (modo básico)', 'blue');
  
  log('\n🔗 URLs de prueba:', 'yellow');
  const port = process.env.PORT || 4000;
  log(`   http://localhost:${port}/api/health`, 'blue');
  log(`   http://localhost:${port}/api/status`, 'blue');
  
  log('');
}

// Ejecutar verificación
verificarConfiguracion().catch(error => {
  log(`💥 Error fatal: ${error.message}`, 'red');
  process.exit(1);
});
