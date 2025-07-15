#!/bin/bash

# Script de despliegue automático para VPS
# Este script debe ejecutarse en el VPS donde se va a hospedar la aplicación

echo "🚀 Iniciando despliegue de Biblioteca SV Backend..."

# Verificar si estamos ejecutando como root o con sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ Este script debe ejecutarse con privilegios de administrador (sudo)"
    exit 1
fi

# Variables de configuración
APP_DIR="/var/www/biblioteca-api"
SERVICE_USER="www-data"
DOMAIN="api.biblioteca.sembrandodatos.com"

# 1. Actualizar el sistema
echo "📦 Actualizando el sistema..."
apt update && apt upgrade -y

# 2. Instalar dependencias necesarias
echo "🔧 Instalando dependencias..."
apt install -y nodejs npm git nginx certbot python3-certbot-nginx postgresql-client

# 3. Instalar PM2 globalmente
echo "⚙️ Instalando PM2..."
npm install -g pm2

# 4. Crear directorio de la aplicación
echo "📁 Preparando directorio de la aplicación..."
mkdir -p $APP_DIR
chown -R $SERVICE_USER:$SERVICE_USER $APP_DIR

# 5. Clonar o actualizar el repositorio
cd $APP_DIR
if [ -d ".git" ]; then
    echo "🔄 Actualizando código existente..."
    sudo -u $SERVICE_USER git pull origin main
else
    echo "📥 Clonando repositorio..."
    sudo -u $SERVICE_USER git clone https://github.com/Jesus200995/BibliotecaSV.git .
fi

# 6. Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd $APP_DIR/backend
sudo -u $SERVICE_USER npm install

# 7. Crear archivo de configuración de producción
echo "⚙️ Configurando variables de entorno de producción..."
cat > .env.production << EOF
# Configuración de la base de datos
DB_HOST=31.97.8.51
DB_PORT=5432
DB_NAME=sembrandodatos
DB_USER=jesus
DB_PASSWORD=2025
DB_SSL=true

# Configuración del servidor
PORT=3000
NODE_ENV=production

# Configuración de seguridad
JWT_SECRET=biblioteca_secret_key_production_2025_secure
CORS_ORIGIN=https://biblioteca.sembrandodatos.com

# URL del frontend para CORS
FRONTEND_URL=https://biblioteca.sembrandodatos.com
API_URL=https://api.biblioteca.sembrandodatos.com
EOF

# 8. Configurar la base de datos
echo "🗄️ Configurando base de datos..."
sudo -u $SERVICE_USER node setup_db.js

# 9. Configurar Nginx
echo "🌐 Configurando Nginx..."
cat > /etc/nginx/sites-available/biblioteca-api << EOF
server {
    server_name $DOMAIN;

    # Redirigir todo el tráfico HTTP a HTTPS
    listen 80;
    return 301 https://\$host\$request_uri;
}

server {
    server_name $DOMAIN;
    
    # Configuración HTTPS (certificados se configurarán con certbot)
    listen 443 ssl;
    
    # Configuraciones de seguridad SSL básicas
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;
    
    # Configuración de cabeceras de seguridad
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000" always;
    
    # Proxy inverso a la aplicación Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Configuración de CORS para APIs
        add_header Access-Control-Allow-Origin "https://biblioteca.sembrandodatos.com" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With" always;
        add_header Access-Control-Allow-Credentials "true" always;
        
        # Manejar preflight requests
        if (\$request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://biblioteca.sembrandodatos.com";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With";
            add_header Access-Control-Allow-Credentials "true";
            return 204;
        }
    }
}
EOF

# 10. Habilitar el sitio
ln -sf /etc/nginx/sites-available/biblioteca-api /etc/nginx/sites-enabled/
nginx -t

# 11. Obtener certificado SSL
echo "🔒 Configurando SSL con Let's Encrypt..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@sembrandodatos.com

# 12. Reiniciar Nginx
systemctl restart nginx

# 13. Configurar PM2 y iniciar la aplicación
echo "🚀 Iniciando aplicación con PM2..."
cd $APP_DIR/backend
sudo -u $SERVICE_USER pm2 start ecosystem.config.js --env production
sudo -u $SERVICE_USER pm2 save
pm2 startup
systemctl enable pm2-$SERVICE_USER

# 14. Configurar firewall (si ufw está instalado)
if command -v ufw >/dev/null 2>&1; then
    echo "🔥 Configurando firewall..."
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 5432/tcp  # PostgreSQL
    ufw --force enable
fi

# 15. Verificar que todo esté funcionando
echo "✅ Verificando el despliegue..."
sleep 5

# Verificar PM2
echo "📊 Estado de PM2:"
sudo -u $SERVICE_USER pm2 status

# Verificar Nginx
echo "🌐 Estado de Nginx:"
systemctl status nginx --no-pager -l

# Probar el endpoint
echo "🧪 Probando endpoint de la API..."
curl -k -X GET https://localhost/test

echo ""
echo "🎉 ¡Despliegue completado!"
echo ""
echo "📋 Resumen:"
echo "   • Backend desplegado en: https://$DOMAIN"
echo "   • Aplicación ejecutándose en PM2"
echo "   • Nginx configurado con SSL"
echo "   • Base de datos configurada"
echo ""
echo "🔍 Para monitorear:"
echo "   • Logs de PM2: sudo -u $SERVICE_USER pm2 logs"
echo "   • Estado de PM2: sudo -u $SERVICE_USER pm2 status"
echo "   • Logs de Nginx: tail -f /var/log/nginx/error.log"
echo ""
echo "🧪 Para probar:"
echo "   curl -X POST https://$DOMAIN/api/login -H 'Content-Type: application/json' -d '{\"usuario\":\"admin\",\"contrasena\":\"admin123\"}'"
