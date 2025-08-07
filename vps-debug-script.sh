#!/bin/bash
# Script de diagnóstico para BibliotecaSV
# Ejecutar como: bash vps-debug-script.sh

echo "🔍 DIAGNÓSTICO DE BIBLIOTECA SV"
echo "==============================="

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

check() {
    echo -e "${BLUE}🔍 $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Verificar estructura de directorios
check "Verificando estructura de directorios"
if [ -d "/var/www/biblioteca/backend" ]; then
    success "Directorio backend existe"
else
    error "Directorio backend NO existe"
fi

if [ -d "/var/www/biblioteca/frontend" ]; then
    success "Directorio frontend existe"
else
    error "Directorio frontend NO existe"
fi

# 2. Verificar archivos clave del backend
check "Verificando archivos clave del backend"
cd /var/www/biblioteca/backend

if [ -f "index.js" ]; then
    success "index.js existe"
    
    # Verificar endpoints de usuarios
    if grep -q "/api/usuarios" index.js; then
        success "Endpoints de usuarios encontrados"
        echo "   📊 Resumen de endpoints:"
        grep -c "app\.get.*\/api\/usuarios" index.js && echo "      GET endpoints: $(grep -c "app\.get.*\/api\/usuarios" index.js)"
        grep -c "app\.post.*\/api\/usuarios" index.js && echo "      POST endpoints: $(grep -c "app\.post.*\/api\/usuarios" index.js)"
        grep -c "app\.put.*\/api\/usuarios" index.js && echo "      PUT endpoints: $(grep -c "app\.put.*\/api\/usuarios" index.js)"
        grep -c "app\.delete.*\/api\/usuarios" index.js && echo "      DELETE endpoints: $(grep -c "app\.delete.*\/api\/usuarios" index.js)"
    else
        error "NO se encontraron endpoints de usuarios"
    fi
    
    # Verificar middleware de autenticación
    if grep -q "verificarToken" index.js; then
        success "Middleware de autenticación encontrado"
    else
        error "Middleware de autenticación NO encontrado"
    fi
else
    error "index.js NO existe"
fi

if [ -f ".env" ]; then
    success "Archivo .env existe"
    echo "   🔧 Variables configuradas:"
    grep -E "^[A-Z]" .env | cut -d'=' -f1 | sed 's/^/      /'
else
    error "Archivo .env NO existe"
fi

if [ -f "package.json" ]; then
    success "package.json existe"
else
    error "package.json NO existe"
fi

# 3. Verificar archivos del frontend
check "Verificando archivos del frontend"
cd /var/www/biblioteca/frontend

if [ -f "src/components/UsuariosView.vue" ]; then
    success "UsuariosView.vue existe"
else
    error "UsuariosView.vue NO existe"
fi

if [ -f "src/config/api.js" ]; then
    success "Configuración de API existe"
    echo "   🌐 Configuración actual:"
    grep -A3 -B1 "BASE_URL" src/config/api.js
else
    error "Configuración de API NO existe"
fi

if [ -d "dist" ]; then
    success "Directorio dist existe (frontend construido)"
else
    warning "Directorio dist NO existe (frontend no construido)"
fi

# 4. Verificar servicios
check "Verificando servicios del sistema"

# Backend
if systemctl is-active --quiet biblioteca-backend; then
    success "Servicio biblioteca-backend está activo"
elif pgrep -f "node.*index.js" > /dev/null; then
    success "Backend corriendo como proceso de Node.js"
elif pgrep -f "pm2" > /dev/null; then
    success "PM2 está corriendo"
    if command -v pm2 > /dev/null; then
        pm2 list
    fi
else
    error "Backend NO está corriendo"
fi

# Nginx
if systemctl is-active --quiet nginx; then
    success "Nginx está activo"
else
    error "Nginx NO está activo"
fi

# 5. Verificar conectividad
check "Verificando conectividad"

# Backend local
if curl -s -o /dev/null -w "%{http_code}" http://localhost:4000 | grep -E "^(200|404)$" > /dev/null; then
    success "Backend responde en localhost:4000"
else
    error "Backend NO responde en localhost:4000"
fi

# Test específico de API
echo "   🧪 Probando endpoint de health..."
if curl -s http://localhost:4000/api/health 2>/dev/null | grep -q "ok\|success\|healthy"; then
    success "Endpoint de health responde"
else
    warning "Endpoint de health no responde o no existe"
fi

# 6. Verificar configuración de nginx
check "Verificando configuración de nginx"
if [ -f "/etc/nginx/sites-available/biblioteca" ]; then
    success "Archivo de configuración nginx existe"
    echo "   📋 Configuración de proxy API:"
    grep -A5 -B2 "location /api" /etc/nginx/sites-available/biblioteca || warning "Configuración de API no encontrada"
else
    error "Archivo de configuración nginx NO existe"
fi

# 7. Verificar logs recientes
check "Verificando logs recientes"

echo "   📜 Últimos errores de nginx:"
if [ -f "/var/log/nginx/error.log" ]; then
    tail -5 /var/log/nginx/error.log | sed 's/^/      /'
else
    warning "Log de errores de nginx no encontrado"
fi

echo "   📜 Estado del servicio backend:"
if systemctl is-active --quiet biblioteca-backend; then
    sudo systemctl status biblioteca-backend --no-pager -l | tail -5 | sed 's/^/      /'
else
    warning "Servicio biblioteca-backend no está corriendo"
fi

# 8. Prueba de autenticación
check "Probando endpoints críticos"

echo "   🔐 Probando endpoint de login..."
response=$(curl -s -w "%{http_code}" -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"test","contrasena":"test"}' -o /tmp/login_test 2>/dev/null)

if [ "$response" = "200" ] || [ "$response" = "401" ] || [ "$response" = "400" ]; then
    success "Endpoint de login responde (código: $response)"
else
    error "Endpoint de login NO responde correctamente (código: $response)"
fi

# 9. Resumen final
echo ""
echo "=================================="
echo -e "${BLUE}📊 RESUMEN DEL DIAGNÓSTICO${NC}"
echo "=================================="
echo ""

# Contar problemas
total_checks=0
failed_checks=0

echo "🏥 ESTADO GENERAL:"
if [ -f "/var/www/biblioteca/backend/index.js" ] && grep -q "/api/usuarios" /var/www/biblioteca/backend/index.js; then
    success "Backend: Configuración OK"
else
    error "Backend: Problemas detectados"
    ((failed_checks++))
fi

if [ -f "/var/www/biblioteca/frontend/src/components/UsuariosView.vue" ]; then
    success "Frontend: Archivos OK"
else
    error "Frontend: Archivos faltantes"
    ((failed_checks++))
fi

if systemctl is-active --quiet nginx && (systemctl is-active --quiet biblioteca-backend || pgrep -f "node.*index.js" > /dev/null); then
    success "Servicios: Funcionando"
else
    error "Servicios: Problemas detectados"
    ((failed_checks++))
fi

echo ""
if [ $failed_checks -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡Sistema aparenta estar funcionando correctamente!${NC}"
    echo ""
    echo "📱 Próximos pasos:"
    echo "1. Ve a tu sitio web"
    echo "2. Haz login como admin"
    echo "3. Busca el apartado 'Usuarios' en el sidebar"
else
    echo -e "${RED}⚠️ Se detectaron $failed_checks problemas${NC}"
    echo ""
    echo "🔧 Pasos recomendados:"
    echo "1. Ejecuta el script de actualización: bash vps-update-script.sh"
    echo "2. Revisa los logs: sudo journalctl -u biblioteca-backend -f"
    echo "3. Verifica la configuración de nginx"
fi

echo ""
echo "🆘 Si necesitas ayuda:"
echo "   - Logs del backend: sudo journalctl -u biblioteca-backend -f"
echo "   - Logs de nginx: sudo tail -f /var/log/nginx/error.log"
echo "   - Estado de servicios: sudo systemctl status biblioteca-backend nginx"
