#!/bin/bash

# Script de deployment para VPS
# Este script debe ejecutarse en el VPS donde se hospeda la aplicación

set -e  # Salir si hay algún error

echo "🚀 Iniciando deployment de Biblioteca SV..."

# Configurar variables
PROJECT_DIR="/var/www/biblioteca"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
NGINX_CONFIG="/etc/nginx/sites-available/biblioteca"
SERVICE_NAME="biblioteca-backend"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si estamos ejecutando como root
if [[ $EUID -eq 0 ]]; then
   echo_error "Este script no debe ejecutarse como root"
   exit 1
fi

# Función para instalar dependencias del sistema
install_system_dependencies() {
    echo_info "Instalando dependencias del sistema..."
    sudo apt update
    sudo apt install -y curl git nginx certbot python3-certbot-nginx postgresql-client
    
    # Instalar Node.js 18
    if ! command -v node &> /dev/null; then
        echo_info "Instalando Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    
    # Instalar PM2 para gestión de procesos
    if ! command -v pm2 &> /dev/null; then
        echo_info "Instalando PM2..."
        sudo npm install -g pm2
    fi
}

# Función para configurar el backend
setup_backend() {
    echo_info "Configurando backend..."
    
    cd $BACKEND_DIR
    
    # Instalar dependencias
    npm install --production
    
    # Crear archivo de configuración de PM2
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$SERVICE_NAME',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 443,
      HTTP_PORT: 80
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF
    
    # Crear directorio de logs
    mkdir -p logs
    
    echo_info "Backend configurado"
}

# Función para configurar SSL
setup_ssl() {
    echo_info "Configurando SSL..."
    
    # Obtener certificados SSL con Certbot
    sudo certbot --nginx -d api.biblioteca.sembrandodatos.com -d biblioteca.sembrandodatos.com --non-interactive --agree-tos --email admin@sembrandodatos.com
    
    echo_info "SSL configurado"
}

# Función para configurar Nginx
setup_nginx() {
    echo_info "Configurando Nginx..."
    
    # Crear configuración de Nginx
    sudo tee $NGINX_CONFIG > /dev/null << EOF
# Backend API
server {
    listen 80;
    server_name api.biblioteca.sembrandodatos.com;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.biblioteca.sembrandodatos.com;
    
    # SSL configuration will be added by certbot
    
    # Configuración de seguridad
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Proxy al backend
    location / {
        proxy_pass http://localhost:3000;  # Puerto interno para el backend
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # Configuración para archivos grandes
    client_max_body_size 100M;
}

# Frontend
server {
    listen 80;
    server_name biblioteca.sembrandodatos.com;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name biblioteca.sembrandodatos.com;
    
    # SSL configuration will be added by certbot
    
    root $FRONTEND_DIR/dist;
    index index.html;
    
    # Configuración de seguridad
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Configuración para SPA (Single Page Application)
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
    
    # Habilitar el sitio
    sudo ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/
    
    # Eliminar configuración por defecto
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Verificar configuración
    sudo nginx -t
    
    echo_info "Nginx configurado"
}

# Función para configurar el firewall
setup_firewall() {
    echo_info "Configurando firewall..."
    
    # Habilitar UFW
    sudo ufw --force enable
    
    # Configurar reglas
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    
    # Permitir SSH
    sudo ufw allow ssh
    
    # Permitir HTTP y HTTPS
    sudo ufw allow 'Nginx Full'
    
    # Permitir PostgreSQL (solo si es necesario externamente)
    # sudo ufw allow 5432
    
    echo_info "Firewall configurado"
}

# Función para configurar servicios
setup_services() {
    echo_info "Configurando servicios..."
    
    cd $BACKEND_DIR
    
    # Detener servicio si está corriendo
    pm2 stop $SERVICE_NAME 2>/dev/null || true
    pm2 delete $SERVICE_NAME 2>/dev/null || true
    
    # Actualizar configuración de .env.production
    cat > .env.production << EOF
NODE_ENV=production
DB_HOST=31.97.8.51
DB_PORT=5432
DB_NAME=sembrandodatos
DB_USER=jesus
DB_PASSWORD=2025
DB_SSL=true
PORT=3000
HTTP_PORT=80
JWT_SECRET=biblioteca_secret_key_production_2025_secure_$(date +%s)
FRONTEND_URL=https://biblioteca.sembrandodatos.com
API_URL=https://api.biblioteca.sembrandodatos.com
EOF
    
    # Iniciar servicio con PM2
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    
    echo_info "Servicios configurados"
}

# Función para construir frontend
build_frontend() {
    echo_info "Construyendo frontend..."
    
    cd $FRONTEND_DIR
    
    # Instalar dependencias
    npm install
    
    # Construir para producción
    npm run build
    
    echo_info "Frontend construido"
}

# Función principal
main() {
    echo_info "Iniciando deployment completo..."
    
    # Verificar si el proyecto existe
    if [ ! -d "$PROJECT_DIR" ]; then
        echo_error "Directorio del proyecto no encontrado: $PROJECT_DIR"
        echo_info "Clona el repositorio primero:"
        echo_info "git clone <repository-url> $PROJECT_DIR"
        exit 1
    fi
    
    # Instalar dependencias del sistema
    install_system_dependencies
    
    # Configurar backend
    setup_backend
    
    # Construir frontend
    build_frontend
    
    # Configurar Nginx
    setup_nginx
    
    # Configurar SSL
    setup_ssl
    
    # Configurar firewall
    setup_firewall
    
    # Configurar servicios
    setup_services
    
    # Reiniciar servicios
    sudo systemctl restart nginx
    pm2 restart $SERVICE_NAME
    
    echo_info "✅ Deployment completado exitosamente!"
    echo_info "🌐 Frontend: https://biblioteca.sembrandodatos.com"
    echo_info "🔧 API: https://api.biblioteca.sembrandodatos.com"
    echo_info ""
    echo_info "Para verificar el estado de los servicios:"
    echo_info "  - Backend: pm2 status"
    echo_info "  - Nginx: sudo systemctl status nginx"
    echo_info "  - Logs: pm2 logs $SERVICE_NAME"
}

# Ejecutar función principal
main "$@"
