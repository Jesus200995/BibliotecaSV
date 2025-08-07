#!/bin/bash
# Script completo para actualizar BibliotecaSV en VPS
# Ejecutar como: bash vps-update-script.sh

echo "🚀 ACTUALIZANDO BIBLIOTECA SV EN VPS..."
echo "========================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar pasos
step() {
    echo -e "${BLUE}📋 PASO $1: $2${NC}"
}

# Función para mostrar éxito
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para mostrar advertencia
warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# Función para mostrar error
error() {
    echo -e "${RED}❌ $1${NC}"
}

# PASO 1: Verificar ubicación
step 1 "Verificando ubicación del proyecto"
if [ ! -d "/var/www/biblioteca" ]; then
    error "Directorio /var/www/biblioteca no encontrado"
    exit 1
fi
success "Directorio del proyecto encontrado"

# PASO 2: Actualizar backend
step 2 "Actualizando backend"
cd /var/www/biblioteca/backend

echo "   Haciendo git pull..."
git pull origin main
if [ $? -eq 0 ]; then
    success "Backend actualizado desde Git"
else
    error "Error al actualizar backend desde Git"
    exit 1
fi

echo "   Instalando dependencias..."
npm install
if [ $? -eq 0 ]; then
    success "Dependencias del backend instaladas"
else
    warning "Problemas con dependencias del backend"
fi

# PASO 3: Verificar endpoints de usuarios en backend
step 3 "Verificando endpoints de usuarios en backend"
if grep -q "/api/usuarios" index.js; then
    success "Endpoints de usuarios encontrados en index.js"
    echo "   Endpoints encontrados:"
    grep -n "app\.[a-z]*('/api/usuarios" index.js | head -4
else
    error "No se encontraron endpoints de usuarios en index.js"
    echo "   Verificando contenido del archivo..."
    ls -la index.js
    exit 1
fi

# PASO 4: Verificar variables de entorno
step 4 "Verificando variables de entorno del backend"
if [ -f ".env" ]; then
    success "Archivo .env encontrado"
    echo "   Variables configuradas:"
    grep -E "^(DB_|JWT_)" .env | sed 's/=.*/=***/'
else
    error "Archivo .env no encontrado en backend"
    echo "   Creando archivo .env básico..."
    cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_NAME=biblioteca_sv
DB_USER=tu_usuario_db
DB_PASSWORD=tu_password_db
DB_SSL=false
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
EOF
    warning "Archivo .env creado. DEBE configurar las variables correctas!"
fi

# PASO 5: Actualizar frontend
step 5 "Actualizando frontend"
cd /var/www/biblioteca/frontend

echo "   Haciendo git pull..."
git pull origin main
if [ $? -eq 0 ]; then
    success "Frontend actualizado desde Git"
else
    error "Error al actualizar frontend desde Git"
    exit 1
fi

echo "   Instalando dependencias..."
npm install
if [ $? -eq 0 ]; then
    success "Dependencias del frontend instaladas"
else
    warning "Problemas con dependencias del frontend"
fi

echo "   Construyendo para producción..."
npm run build
if [ $? -eq 0 ]; then
    success "Frontend construido exitosamente"
else
    error "Error al construir frontend"
    exit 1
fi

# PASO 6: Verificar configuración de API en frontend
step 6 "Verificando configuración de API en frontend"
if [ -f "src/config/api.js" ]; then
    success "Archivo de configuración API encontrado"
    echo "   Configuración actual:"
    grep -A5 -B5 "BASE_URL" src/config/api.js
else
    error "Archivo src/config/api.js no encontrado"
fi

# PASO 7: Verificar/crear archivo .env.production
step 7 "Verificando configuración de producción"
if [ ! -f ".env.production" ]; then
    warning "Archivo .env.production no encontrado, creando..."
    cat > .env.production << EOF
VITE_API_URL=https://api.biblioteca.sembrandodatos.com/api
VITE_APP_URL=https://biblioteca.sembrandodatos.com
EOF
    success "Archivo .env.production creado"
else
    success "Archivo .env.production encontrado"
    echo "   Contenido:"
    cat .env.production
fi

# PASO 8: Reiniciar servicios
step 8 "Reiniciando servicios"

echo "   Reiniciando backend..."
if systemctl is-active --quiet biblioteca-backend; then
    sudo systemctl restart biblioteca-backend
    success "Servicio biblioteca-backend reiniciado"
elif command -v pm2 > /dev/null; then
    pm2 restart biblioteca-backend 2>/dev/null || pm2 restart all
    success "Backend reiniciado con PM2"
else
    warning "No se pudo reiniciar automáticamente el backend"
    echo "   Ejecute manualmente: sudo systemctl restart biblioteca-backend"
    echo "   O si usa PM2: pm2 restart biblioteca-backend"
fi

echo "   Reiniciando nginx..."
if sudo systemctl restart nginx; then
    success "Nginx reiniciado"
else
    error "Error al reiniciar nginx"
fi

# PASO 9: Verificaciones finales
step 9 "Verificaciones finales"

echo "   Verificando que el backend esté corriendo..."
if curl -s http://localhost:4000/api/health >/dev/null 2>&1; then
    success "Backend responde en puerto 4000"
else
    warning "Backend no responde en puerto 4000"
fi

echo "   Verificando nginx..."
if systemctl is-active --quiet nginx; then
    success "Nginx está activo"
else
    error "Nginx no está activo"
fi

echo "   Verificando archivos del frontend..."
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    success "Frontend construido correctamente en dist/"
else
    error "Frontend no se construyó correctamente"
fi

# PASO 10: Resumen y próximos pasos
echo ""
echo "=========================================="
echo -e "${BLUE}🎉 ACTUALIZACIÓN COMPLETADA${NC}"
echo "=========================================="
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Ve a tu sitio web en el navegador"
echo "2. Haz login como admin"
echo "3. Verifica que aparezca el apartado 'Usuarios' en el sidebar"
echo "4. Prueba crear, editar y eliminar usuarios"
echo ""
echo "🔧 SI NO FUNCIONA, EJECUTA ESTOS COMANDOS:"
echo "   # Ver logs del backend:"
echo "   sudo journalctl -u biblioteca-backend -f"
echo "   # O con PM2:"
echo "   pm2 logs biblioteca-backend"
echo ""
echo "   # Ver logs de nginx:"
echo "   sudo tail -f /var/log/nginx/error.log"
echo ""
echo "   # Probar endpoint directamente:"
echo "   curl http://localhost:4000/api/usuarios"
echo ""
echo "🌐 URLs importantes:"
echo "   Backend: http://localhost:4000"
echo "   Frontend: https://biblioteca.sembrandodatos.com"
echo "   API: https://api.biblioteca.sembrandodatos.com"
echo ""

# Final
success "Script completado. ¡Verifica tu sitio web!"
