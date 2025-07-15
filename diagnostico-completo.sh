#!/bin/bash

# Script de diagnóstico completo para problemas de conectividad
# Ejecutar en el VPS donde está desplegado el backend

echo "🔍 DIAGNÓSTICO COMPLETO DE CONECTIVIDAD - BIBLIOTECA SV"
echo "=================================================="
echo ""

# Variables
DOMAIN="api.biblioteca.sembrandodatos.com"
FRONTEND_DOMAIN="biblioteca.sembrandodatos.com"
PORT=3000
DB_HOST="31.97.8.51"
DB_PORT=5432

# Función para imprimir con colores
print_status() {
    if [ "$2" = "OK" ]; then
        echo -e "✅ $1: \033[32m$2\033[0m"
    elif [ "$2" = "ERROR" ]; then
        echo -e "❌ $1: \033[31m$2\033[0m"
    else
        echo -e "⚠️  $1: \033[33m$2\033[0m"
    fi
}

echo "1. VERIFICANDO SERVICIOS BÁSICOS"
echo "--------------------------------"

# Verificar si Node.js está instalado
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    print_status "Node.js" "OK ($NODE_VERSION)"
else
    print_status "Node.js" "ERROR - No instalado"
fi

# Verificar si PM2 está instalado
if command -v pm2 >/dev/null 2>&1; then
    print_status "PM2" "OK"
else
    print_status "PM2" "ERROR - No instalado"
fi

# Verificar si Nginx está instalado y corriendo
if systemctl is-active --quiet nginx; then
    print_status "Nginx" "OK - Activo"
else
    print_status "Nginx" "ERROR - No activo"
fi

echo ""
echo "2. VERIFICANDO PROCESOS DE LA APLICACIÓN"
echo "----------------------------------------"

# Verificar procesos PM2
if command -v pm2 >/dev/null 2>&1; then
    echo "Procesos PM2:"
    pm2 status
    echo ""
else
    print_status "PM2 Status" "ERROR - PM2 no disponible"
fi

# Verificar si el puerto 3000 está en uso
if netstat -tulpn | grep :3000 >/dev/null 2>&1; then
    PROCESS_3000=$(netstat -tulpn | grep :3000)
    print_status "Puerto 3000" "OK - En uso"
    echo "   $PROCESS_3000"
else
    print_status "Puerto 3000" "ERROR - No está en uso"
fi

# Verificar puertos 80 y 443
if netstat -tulpn | grep :80 >/dev/null 2>&1; then
    print_status "Puerto 80 (HTTP)" "OK"
else
    print_status "Puerto 80 (HTTP)" "ERROR"
fi

if netstat -tulpn | grep :443 >/dev/null 2>&1; then
    print_status "Puerto 443 (HTTPS)" "OK"
else
    print_status "Puerto 443 (HTTPS)" "ERROR"
fi

echo ""
echo "3. VERIFICANDO CONECTIVIDAD DE BASE DE DATOS"
echo "--------------------------------------------"

# Verificar conectividad a PostgreSQL
if command -v pg_isready >/dev/null 2>&1; then
    if pg_isready -h $DB_HOST -p $DB_PORT -U jesus >/dev/null 2>&1; then
        print_status "Conexión a PostgreSQL" "OK"
    else
        print_status "Conexión a PostgreSQL" "ERROR"
    fi
else
    print_status "PostgreSQL Client" "ADVERTENCIA - pg_isready no disponible"
fi

echo ""
echo "4. VERIFICANDO CONFIGURACIÓN DE RED"
echo "-----------------------------------"

# Verificar IP pública
PUBLIC_IP=$(curl -s https://api.ipify.org)
print_status "IP Pública del VPS" "$PUBLIC_IP"

# Verificar resolución DNS
if nslookup $DOMAIN >/dev/null 2>&1; then
    DNS_IP=$(nslookup $DOMAIN | grep "Address:" | tail -1 | awk '{print $2}')
    print_status "DNS $DOMAIN" "OK → $DNS_IP"
else
    print_status "DNS $DOMAIN" "ERROR"
fi

if nslookup $FRONTEND_DOMAIN >/dev/null 2>&1; then
    FRONTEND_DNS_IP=$(nslookup $FRONTEND_DOMAIN | grep "Address:" | tail -1 | awk '{print $2}')
    print_status "DNS $FRONTEND_DOMAIN" "OK → $FRONTEND_DNS_IP"
else
    print_status "DNS $FRONTEND_DOMAIN" "ERROR"
fi

echo ""
echo "5. VERIFICANDO FIREWALL"
echo "----------------------"

# Verificar UFW
if command -v ufw >/dev/null 2>&1; then
    UFW_STATUS=$(ufw status | head -1)
    print_status "UFW Firewall" "$UFW_STATUS"
    if [[ "$UFW_STATUS" == *"active"* ]]; then
        echo "Reglas activas:"
        ufw status numbered | grep -E "(80|443|22|3000|5432)"
    fi
else
    print_status "UFW" "No instalado"
fi

# Verificar iptables
if iptables -L INPUT | grep -E "(80|443|22)" >/dev/null 2>&1; then
    print_status "Iptables" "Reglas configuradas"
else
    print_status "Iptables" "Sin reglas específicas"
fi

echo ""
echo "6. VERIFICANDO NGINX"
echo "-------------------"

# Verificar configuración de Nginx
if [ -f "/etc/nginx/sites-enabled/biblioteca-api" ]; then
    print_status "Configuración Nginx" "OK - Archivo presente"
else
    print_status "Configuración Nginx" "ERROR - Archivo no encontrado"
fi

# Verificar sintaxis de Nginx
if nginx -t >/dev/null 2>&1; then
    print_status "Sintaxis Nginx" "OK"
else
    print_status "Sintaxis Nginx" "ERROR"
    echo "Errores de sintaxis:"
    nginx -t
fi

# Verificar certificados SSL
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    CERT_EXPIRY=$(openssl x509 -enddate -noout -in /etc/letsencrypt/live/$DOMAIN/fullchain.pem)
    print_status "Certificado SSL" "OK - $CERT_EXPIRY"
else
    print_status "Certificado SSL" "ERROR - No encontrado"
fi

echo ""
echo "7. PRUEBAS DE CONECTIVIDAD LOCAL"
echo "--------------------------------"

# Probar conectividad local
echo "Probando localhost:3000..."
if curl -s http://localhost:3000/test >/dev/null 2>&1; then
    print_status "Localhost:3000" "OK"
else
    print_status "Localhost:3000" "ERROR"
fi

echo "Probando localhost:80..."
if curl -s http://localhost/test >/dev/null 2>&1; then
    print_status "Localhost:80" "OK"
else
    print_status "Localhost:80" "ERROR"
fi

echo "Probando localhost:443..."
if curl -k -s https://localhost/test >/dev/null 2>&1; then
    print_status "Localhost:443" "OK"
else
    print_status "Localhost:443" "ERROR"
fi

echo ""
echo "8. PRUEBAS DE CONECTIVIDAD EXTERNA"
echo "----------------------------------"

# Probar desde dominio
echo "Probando $DOMAIN..."
if curl -s https://$DOMAIN/test >/dev/null 2>&1; then
    print_status "HTTPS $DOMAIN" "OK"
    echo "Respuesta:"
    curl -s https://$DOMAIN/test | head -5
else
    print_status "HTTPS $DOMAIN" "ERROR"
fi

echo ""
echo "9. LOGS RECIENTES"
echo "----------------"

echo "Últimos logs de PM2:"
if command -v pm2 >/dev/null 2>&1; then
    pm2 logs --lines 10
else
    echo "PM2 no disponible"
fi

echo ""
echo "Últimos logs de Nginx (error):"
if [ -f "/var/log/nginx/error.log" ]; then
    tail -10 /var/log/nginx/error.log
else
    echo "Log de Nginx no encontrado"
fi

echo ""
echo "10. RECOMENDACIONES"
echo "------------------"

# Generar recomendaciones basadas en los problemas encontrados
echo "Basado en el diagnóstico:"

# Verificar si el backend está corriendo
if ! netstat -tulpn | grep :3000 >/dev/null 2>&1; then
    echo "🔧 ACCIÓN REQUERIDA: El backend no está corriendo en el puerto 3000"
    echo "   Ejecutar: pm2 start ecosystem.config.js --env production"
fi

# Verificar si Nginx está corriendo
if ! systemctl is-active --quiet nginx; then
    echo "🔧 ACCIÓN REQUERIDA: Nginx no está activo"
    echo "   Ejecutar: sudo systemctl start nginx"
fi

# Verificar firewall
if command -v ufw >/dev/null 2>&1 && [[ "$(ufw status)" == *"active"* ]]; then
    if ! ufw status | grep -E "(80|443)" >/dev/null 2>&1; then
        echo "🔧 ACCIÓN REQUERIDA: Firewall puede estar bloqueando puertos"
        echo "   Ejecutar: sudo ufw allow 80/tcp && sudo ufw allow 443/tcp"
    fi
fi

echo ""
echo "=================================================="
echo "DIAGNÓSTICO COMPLETADO"
echo "=================================================="
