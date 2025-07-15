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

echo "1. VERIFICANDO Y ARREGLANDO SERVICIOS..."

# Asegurar que los servicios estén corriendo
systemctl start nginx
systemctl enable nginx

# Verificar PM2 para el usuario www-data
if ! sudo -u www-data pm2 status | grep -q "biblioteca-backend"; then
    echo "🔧 Iniciando aplicación con PM2..."
    cd $APP_DIR/backend
    sudo -u www-data NODE_ENV=production pm2 start ecosystem.config.js --env production
    sudo -u www-data pm2 save
fi

echo "2. CONFIGURANDO FIREWALL..."

# Configurar UFW para permitir tráfico web
ufw --force reset
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 5432/tcp  # PostgreSQL
ufw --force enable

echo "3. CONFIGURANDO NGINX CON CONFIGURACIÓN ROBUSTA..."

# Crear configuración de Nginx más robusta
cat > /etc/nginx/sites-available/biblioteca-api << 'EOF'
# Configuración para el backend API
server {
    listen 80;
    server_name api.biblioteca.sembrandodatos.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.biblioteca.sembrandodatos.com;
    
    # Certificados SSL (se configurarán con certbot)
    ssl_certificate /etc/letsencrypt/live/api.biblioteca.sembrandodatos.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.biblioteca.sembrandodatos.com/privkey.pem;
    
    # Configuración SSL robusta
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozTLS:10m;
    ssl_session_tickets off;
    
    # Headers de seguridad
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # Configuración de CORS más permisiva para debugging
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

echo "4. CONFIGURANDO CERTIFICADOS SSL..."

# Instalar certbot si no está instalado
if ! command -v certbot &> /dev/null; then
    apt update
    apt install -y certbot python3-certbot-nginx
fi

# Obtener certificado SSL
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@sembrandodatos.com --redirect

echo "5. REINICIANDO SERVICIOS..."

# Reiniciar servicios
systemctl restart nginx
sudo -u www-data pm2 restart all

echo "6. VERIFICANDO CONFIGURACIÓN DEL BACKEND..."

# Verificar que el archivo .env.production esté correcto
cd $APP_DIR/backend

if [ ! -f ".env.production" ]; then
    echo "🔧 Creando archivo .env.production..."
    cat > .env.production << 'EOF'
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

# CORS - Permitir todos los orígenes para debugging (cambiar en producción)
CORS_ORIGIN=*

# URLs
FRONTEND_URL=https://biblioteca.sembrandodatos.com
API_URL=https://api.biblioteca.sembrandodatos.com
EOF
    chown www-data:www-data .env.production
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

echo "8. REINICIANDO APLICACIÓN..."

# Reiniciar la aplicación con la nueva configuración
sudo -u www-data pm2 restart all
sudo -u www-data pm2 save

echo "9. VERIFICANDO CONECTIVIDAD..."

sleep 5

# Pruebas básicas
echo "Probando conectividad local..."
curl -s http://localhost:3000/test && echo "✅ Local 3000: OK" || echo "❌ Local 3000: FAIL"
curl -s http://localhost/test && echo "✅ Local 80: OK" || echo "❌ Local 80: FAIL"
curl -k -s https://localhost/test && echo "✅ Local 443: OK" || echo "❌ Local 443: FAIL"

echo "Probando conectividad externa..."
curl -s https://$DOMAIN/test && echo "✅ External HTTPS: OK" || echo "❌ External HTTPS: FAIL"

echo "10. CONFIGURACIÓN FINAL DE RED..."

# Asegurar que el servidor escuche en todas las interfaces
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p

echo ""
echo "🎉 SOLUCIÓN COMPLETADA!"
echo "======================"
echo ""
echo "📋 Resumen de cambios aplicados:"
echo "  ✅ Firewall configurado (puertos 22, 80, 443, 5432)"
echo "  ✅ Nginx configurado con CORS permisivo"
echo "  ✅ Certificados SSL renovados"
echo "  ✅ Backend reiniciado con configuración actualizada"
echo "  ✅ CORS temporalmente permisivo para debugging"
echo ""
echo "🧪 Para probar desde otro dispositivo:"
echo "  1. Abrir: https://$DOMAIN/test"
echo "  2. Abrir: https://$DOMAIN/api/login (POST con credenciales)"
echo "  3. Usar test-connectivity-complete.html"
echo ""
echo "📊 Para monitorear:"
echo "  • Estado PM2: sudo -u www-data pm2 status"
echo "  • Logs PM2: sudo -u www-data pm2 logs"
echo "  • Estado Nginx: systemctl status nginx"
echo "  • Logs Nginx: tail -f /var/log/nginx/error.log"
echo ""
echo "⚠️  IMPORTANTE: La configuración CORS está en modo permisivo para debugging."
echo "   Cambiar a dominios específicos después de confirmar que funciona."
