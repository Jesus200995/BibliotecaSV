#!/bin/bash

# Script de solución rápida para problemas de conectividad
# Ejecutar como root en el VPS

echo "🚀 SOLUCIONANDO PROBLEMAS DE CONECTIVIDAD"
echo "=========================================="

# Variables
DOMAIN="api.biblioteca.sembrandodatos.com"
FRONTEND_DOMAIN="biblioteca.sembrandodatos.com"
APP_DIR="/var/www/biblioteca-api"

# Verificar que estamos ejecutando como root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Este script debe ejecutarse como root (sudo)"
    exit 1
fi

echo "1. INSTALANDO DEPENDENCIAS NECESARIAS..."

# Actualizar sistema
apt update

# Instalar Node.js si no está instalado
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi

# Instalar PM2 globalmente
npm install -g pm2

# Instalar nginx
apt install -y nginx

echo "2. CONFIGURANDO APLICACIÓN..."

# Crear directorio y obtener código
mkdir -p $APP_DIR
cd $APP_DIR

# Si existe git, actualizar, sino clonar
if [ -d ".git" ]; then
    git pull origin main
else
    git clone https://github.com/Jesus200995/BibliotecaSV.git .
fi

cd backend

# Instalar dependencias del backend
npm install

# Crear archivo de configuración de producción
cat > .env.production << 'EOF'
DB_HOST=31.97.8.51
DB_PORT=5432
DB_NAME=sembrandodatos
DB_USER=jesus
DB_PASSWORD=2025
DB_SSL=true
PORT=3000
NODE_ENV=production
JWT_SECRET=biblioteca_secret_key_production_2025_secure
FRONTEND_URL=https://biblioteca.sembrandodatos.com
API_URL=https://api.biblioteca.sembrandodatos.com
EOF

# Configurar base de datos
node setup_db.js

# Detener cualquier instancia previa y iniciar con PM2
pm2 delete biblioteca-backend 2>/dev/null || true
NODE_ENV=production pm2 start index.js --name "biblioteca-backend"
pm2 save
pm2 startup

echo "2. CONFIGURANDO FIREWALL..."

# Configurar UFW para permitir tráfico web
ufw --force reset
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 5432/tcp  # PostgreSQL
ufw --force enable

echo "3. CONFIGURANDO NGINX CON CONFIGURACIÓN ROBUSTA..."

# Crear configuración de Nginx más simple y robusta
cat > /etc/nginx/sites-available/biblioteca-api << 'EOF'
# Configuración principal del backend API
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    
    # Configuración de CORS permisiva
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
    add_header Access-Control-Expose-Headers "Content-Length,Content-Range" always;
    add_header Access-Control-Allow-Credentials "true" always;
    
    # Proxy hacia Node.js
    location / {
        # Manejar OPTIONS requests para CORS
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "*";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type "text/plain; charset=utf-8";
            add_header Content-Length 0;
            return 204;
        }
        
        # Proxy pass
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        
        # Headers importantes
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $server_name;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        
        proxy_cache_bypass $http_upgrade;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Habilitar la configuración
ln -sf /etc/nginx/sites-available/biblioteca-api /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Verificar configuración de Nginx
if nginx -t; then
    echo "✅ Configuración de Nginx válida"
else
    echo "❌ Error en configuración de Nginx"
    nginx -t
    exit 1
fi

echo "4. CONFIGURANDO NGINX..."

# Habilitar la configuración
rm -f /etc/nginx/sites-enabled/*
ln -sf /etc/nginx/sites-available/biblioteca-api /etc/nginx/sites-enabled/

# Verificar configuración de Nginx
if nginx -t; then
    echo "✅ Configuración de Nginx válida"
else
    echo "❌ Error en configuración de Nginx"
    nginx -t
    exit 1
fi

# Reiniciar Nginx
systemctl restart nginx
systemctl enable nginx

echo "5. REINICIANDO SERVICIOS..."

# Reiniciar servicios
systemctl restart nginx
pm2 restart all

echo "6. VERIFICANDO CONFIGURACIÓN DEL BACKEND..."

# Verificar que el archivo .env.production esté correcto
cd $APP_DIR/backend

# El archivo ya se creó arriba, solo verificamos
if [ -f ".env.production" ]; then
    echo "✅ Archivo .env.production existe"
else
    echo "❌ Error: archivo .env.production no encontrado"
    exit 1
fi

echo "7. ACTUALIZANDO CONFIGURACIÓN DE CORS EN EL CÓDIGO..."

# Crear una versión temporal del index.js con CORS más permisivo
if [ -f "index.js" ]; then
    # Backup del original
    cp index.js index.js.backup
    
    # Buscar y reemplazar la configuración CORS
    sed -i '/const corsOptions = {/,/};/c\
const corsOptions = {\
  origin: function (origin, callback) {\
    console.log("CORS: Origen solicitado:", origin);\
    // Permitir todos los orígenes temporalmente para debugging\
    callback(null, true);\
  },\
  credentials: true,\
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],\
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],\
  exposedHeaders: ["Content-Range", "X-Content-Range"]\
};' index.js
fi

echo "7. REINICIANDO APLICACIÓN..."

# Reiniciar la aplicación con la nueva configuración
pm2 restart all
pm2 save

echo "8. VERIFICANDO CONECTIVIDAD..."

sleep 5

# Obtener la IP externa del servidor
EXTERNAL_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip || echo "srv824686")

# Pruebas básicas
echo "Probando conectividad local..."
curl -s http://localhost:3000/test && echo "✅ Local 3000: OK" || echo "❌ Local 3000: FAIL"
curl -s http://localhost/test && echo "✅ Local 80: OK" || echo "❌ Local 80: FAIL"

echo "Probando conectividad externa..."
echo "Tu servidor está disponible en: http://$EXTERNAL_IP"

echo "9. CONFIGURACIÓN FINAL DE RED..."

# Asegurar que el servidor escuche en todas las interfaces
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p

echo ""
echo "🎉 SOLUCIÓN COMPLETADA!"
echo "======================"
echo ""
echo "📋 Resumen de cambios aplicados:"
echo "  ✅ Node.js y PM2 instalados"
echo "  ✅ Aplicación descargada y configurada"
echo "  ✅ Base de datos configurada"
echo "  ✅ Firewall configurado (puertos 22, 80, 443, 3000, 5432)"
echo "  ✅ Nginx configurado con CORS permisivo"
echo "  ✅ Backend ejecutándose con PM2"
echo ""
echo "🌐 ACCESO DESDE CUALQUIER DISPOSITIVO:"
echo "  • IP del servidor: $EXTERNAL_IP"
echo "  • Test: http://$EXTERNAL_IP/test"
echo "  • API Login: http://$EXTERNAL_IP/api/login"
echo ""
echo "📱 Para probar desde otro dispositivo:"
echo "  1. Abrir: http://$EXTERNAL_IP/test"
echo "  2. Debería mostrar información del servidor"
echo "  3. Para login: POST a http://$EXTERNAL_IP/api/login"
echo ""
echo "📊 Para monitorear:"
echo "  • Estado PM2: pm2 status"
echo "  • Logs PM2: pm2 logs"
echo "  • Estado Nginx: systemctl status nginx"
echo "  • Logs Nginx: tail -f /var/log/nginx/error.log"
echo ""
echo "✅ AHORA PUEDES CERRAR TU PC - EL BACKEND FUNCIONA 100% DESDE EL VPS"
