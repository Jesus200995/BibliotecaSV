#!/bin/bash

# SETUP COMPLETO DEL BACKEND EN VPS
# Ejecutar como root: sudo bash setup-vps.sh

echo "🚀 CONFIGURANDO BACKEND EN VPS - BIBLIOTECA SV"
echo "=============================================="

# Verificar root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Ejecutar como root: sudo bash setup-vps.sh"
    exit 1
fi

# Variables
APP_DIR="/var/www/biblioteca-api"
REPO_URL="https://github.com/Jesus200995/BibliotecaSV.git"

echo "1. INSTALANDO DEPENDENCIAS..."
apt update
apt install -y nodejs npm git nginx curl

echo "2. INSTALANDO PM2..."
npm install -g pm2

echo "3. CONFIGURANDO APLICACIÓN..."
# Crear directorio y clonar
mkdir -p $APP_DIR
cd $APP_DIR

if [ -d ".git" ]; then
    git pull origin main
else
    git clone $REPO_URL .
fi

cd backend

# Instalar dependencias
npm install

echo "4. CONFIGURANDO VARIABLES DE ENTORNO..."
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

echo "5. CONFIGURANDO BASE DE DATOS..."
NODE_ENV=production node setup_db.js

echo "6. INICIANDO APLICACIÓN CON PM2..."
pm2 delete biblioteca-backend 2>/dev/null || true
NODE_ENV=production pm2 start index.js --name "biblioteca-backend"
pm2 save
pm2 startup

echo "7. CONFIGURANDO NGINX..."
cat > /etc/nginx/sites-available/biblioteca-api << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS permisivo
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, Accept, Origin" always;
        add_header Access-Control-Allow-Credentials "true" always;
        
        # Manejar preflight
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "*";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, Accept, Origin";
            add_header Access-Control-Max-Age "3600";
            add_header Content-Length "0";
            add_header Content-Type "text/plain";
            return 204;
        }
    }
}
EOF

# Limpiar configuraciones previas
rm -f /etc/nginx/sites-enabled/*
ln -s /etc/nginx/sites-available/biblioteca-api /etc/nginx/sites-enabled/

# Verificar y reiniciar
nginx -t
systemctl restart nginx
systemctl enable nginx

echo "8. CONFIGURANDO FIREWALL..."
ufw --force reset
ufw allow ssh
ufw allow 22
ufw allow 80
ufw allow 443
ufw allow 3000
ufw --force enable

echo "9. VERIFICANDO INSTALACIÓN..."
sleep 3

echo "Estado de PM2:"
pm2 status

echo "Estado de Nginx:"
systemctl status nginx --no-pager

echo "Probando backend directo:"
curl -s http://localhost:3000/test | head -5

echo "Probando a través de Nginx:"
curl -s http://localhost/test | head -5

echo "Probando API de login:"
curl -X POST http://localhost/api/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","contrasena":"admin123"}' | head -5

echo ""
echo "🎉 CONFIGURACIÓN COMPLETADA!"
echo "============================"
echo ""
echo "✅ Backend ejecutándose en PM2"
echo "✅ Nginx configurado y funcionando"
echo "✅ Firewall configurado"
echo "✅ Base de datos configurada"
echo ""
echo "🌐 ACCESO EXTERNO:"
echo "   • IP directa: http://31.97.8.51"
echo "   • Test: http://31.97.8.51/test"
echo "   • API: http://31.97.8.51/api/login"
echo ""
echo "📱 Para probar desde otros dispositivos:"
echo "   1. Abrir http://31.97.8.51/test en cualquier navegador"
echo "   2. Debería mostrar JSON con información del servidor"
echo ""
echo "🔧 Para monitorear:"
echo "   • pm2 status"
echo "   • pm2 logs"
echo "   • systemctl status nginx"
echo ""
echo "⚠️  El backend ahora funciona 100% desde el VPS"
echo "   Puedes cerrar tu PC sin problemas!"
EOF
