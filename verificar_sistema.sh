#!/bin/bash
# Script de verificación para el sistema Biblioteca SV en VPS
echo "=== VERIFICACIÓN SISTEMA BIBLIOTECA SV ==="
echo ""

# Verificar que el backend esté corriendo
echo "1. Verificando backend..."
if curl -s http://localhost:4000/api/health > /dev/null 2>&1; then
    echo "✅ Backend accesible en puerto 4000"
else
    echo "❌ Backend NO accesible en puerto 4000"
fi

# Verificar conexión a base de datos
echo ""
echo "2. Verificando conexión a base de datos..."
cd backend
if node -e "
require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW()').then(() => {
  console.log('✅ Conexión a base de datos exitosa');
  pool.end();
}).catch(err => {
  console.log('❌ Error de conexión a base de datos:', err.message);
  pool.end();
});
" 2>/dev/null; then
    echo "Base de datos verificada"
else
    echo "Error verificando base de datos"
fi

# Verificar usuarios admin
echo ""
echo "3. Verificando usuarios administradores..."
cd backend
node -e "
require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT usuario, rol FROM usuarios WHERE rol = \$1 AND activo = true', ['admin']).then(result => {
  console.log('Usuarios administradores encontrados:', result.rows.length);
  result.rows.forEach(user => {
    console.log('  -', user.usuario, '(', user.rol, ')');
  });
  pool.end();
}).catch(err => {
  console.log('❌ Error consultando usuarios:', err.message);
  pool.end();
});
" 2>/dev/null

# Verificar que el frontend esté construido
echo ""
echo "4. Verificando frontend..."
cd ../frontend
if [ -d "dist" ]; then
    echo "✅ Frontend construido (carpeta dist existe)"
    echo "Archivos en dist:"
    ls -la dist/ | head -10
else
    echo "❌ Frontend NO construido (falta carpeta dist)"
    echo "Para construir: npm run build"
fi

echo ""
echo "=== INSTRUCCIONES PARA RESOLVER PROBLEMAS ==="
echo ""
echo "Si el apartado de usuarios no aparece:"
echo "1. Asegúrate de hacer login con un usuario admin (admin/admin123 o Jess/password)"
echo "2. Verifica que el backend esté corriendo: pm2 start backend/index.js --name biblioteca-backend"
echo "3. Construye el frontend: cd frontend && npm run build"
echo "4. Configura el servidor web (nginx/apache) para servir frontend/dist"
echo "5. Asegúrate que el proxy apunte /api a http://localhost:4000"
echo ""
echo "Configuración nginx sugerida:"
echo "location / { try_files \$uri \$uri/ /index.html; }"
echo "location /api { proxy_pass http://localhost:4000; }"
