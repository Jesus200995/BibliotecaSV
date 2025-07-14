#!/bin/bash

# Script para probar el sistema localmente antes del deployment

echo "🧪 Probando Biblioteca SV localmente..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

echo "✅ Node.js versión: $(node --version)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

echo "✅ npm versión: $(npm --version)"

# Probar backend
echo ""
echo "🔧 Probando backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    npm install
fi

echo "🚀 Iniciando backend en modo desarrollo..."
NODE_ENV=development npm run dev &
BACKEND_PID=$!

sleep 5

# Probar conexión al backend
echo "🔍 Probando conexión al backend..."
if curl -s http://localhost:4000/test > /dev/null; then
    echo "✅ Backend responde correctamente"
else
    echo "❌ Backend no responde"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Probar login
echo "🔑 Probando login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","contrasena":"admin123"}')

if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
    echo "✅ Login funciona correctamente"
else
    echo "❌ Login falló"
    echo "Respuesta: $LOGIN_RESPONSE"
fi

# Detener backend
kill $BACKEND_PID 2>/dev/null

# Probar frontend
echo ""
echo "🎨 Probando frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    npm install
fi

echo "🔨 Construyendo frontend..."
npm run build

if [ -d "dist" ]; then
    echo "✅ Frontend construido correctamente"
else
    echo "❌ Error al construir frontend"
    exit 1
fi

echo ""
echo "🎉 ¡Todas las pruebas pasaron!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Subir el código al repositorio"
echo "2. Ejecutar el script de deployment en el VPS:"
echo "   ./deploy.sh"
echo "3. Verificar que los dominios apunten al VPS"
echo "4. Probar desde dispositivos externos"
