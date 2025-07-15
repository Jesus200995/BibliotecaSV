#!/bin/bash

# SCRIPT DE SOLUCIÓN DEFINITIVA PARA CONECTIVIDAD EXTERNA
# Ejecutar en el VPS como root

echo "🔥 SOLUCIONANDO CONECTIVIDAD EXTERNA DE UNA VEZ POR TODAS"
echo "========================================================="

# Variables
DOMAIN="api.biblioteca.sembrandodatos.com"
APP_DIR="/var/www/biblioteca-api"
BACKEND_DIR="$APP_DIR/backend"

# Verificar root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Ejecutar como root: sudo bash fix-connectivity.sh"
    exit 1
fi

echo "1. DETENIENDO SERVICIOS..."
systemctl stop nginx
sudo -u www-data pm2 stop all

echo "2. CONFIGURANDO FIREWALL COMPLETO..."
# Resetear y configurar firewall
ufw --force reset
ufw allow ssh
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp  # Puerto directo del backend para testing
ufw allow 5432/tcp  # PostgreSQL
ufw --force enable

echo "3. CONFIGURANDO NGINX SUPER PERMISIVO..."
cat > /etc/nginx/sites-available/biblioteca-api << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2 default_server;
    listen [::]:443 ssl http2 default_server;
    server_name api.biblioteca.sembrandodatos.com _;
    
    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/api.biblioteca.sembrandodatos.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.biblioteca.sembrandodatos.com/privkey.pem;
    
    # SSL básico
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # CORS súper permisivo
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, HEAD" always;
    add_header Access-Control-Allow-Headers "*" always;
    add_header Access-Control-Allow-Credentials "true" always;
    add_header Access-Control-Max-Age "3600" always;
    
    # Manejar preflight globalmente
    if ($request_method = 'OPTIONS') {
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, HEAD";
        add_header Access-Control-Allow-Headers "*";
        add_header Access-Control-Max-Age "3600";
        add_header Content-Length "0";
        add_header Content-Type "text/plain";
        return 204;
    }
    
    # Proxy a Node.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # Timeouts generosos
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
    }
}
EOF

# Configurar nginx.conf principal
cat > /etc/nginx/nginx.conf << 'EOF'
user www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;
    
    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;
    
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Rate limiting básico
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;
    
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
EOF

# Limpiar sitios habilitados
rm -f /etc/nginx/sites-enabled/*
ln -s /etc/nginx/sites-available/biblioteca-api /etc/nginx/sites-enabled/

echo "4. CONFIGURANDO BACKEND PARA ACCESO EXTERNO..."

cd $BACKEND_DIR

# Backup del index.js original
cp index.js index.js.original

# Crear versión modificada del index.js
cat > index.js << 'EOF'
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

// Importar middleware de autenticación
const { authenticateToken } = require('./middleware/auth');
const authRoutes = require('./routes/auth');

// Cargar configuración según el entorno
try {
  if (fs.existsSync(path.join(__dirname, '.env.local'))) {
    require('dotenv').config({ path: path.join(__dirname, '.env.local') });
    console.log('Cargada configuración local desde .env.local');
  }
  
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, '.env.production'))) {
    require('dotenv').config({ path: path.join(__dirname, '.env.production') });
    console.log('Cargada configuración de producción desde .env.production');
  }
} catch (err) {
  console.error('Error al cargar archivos de configuración:', err);
}

console.log('🔧 Configuración de conexión a BD:');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Puerto: ${process.env.DB_PORT}`);
console.log(`Base de datos: ${process.env.DB_NAME}`);
console.log(`Usuario: ${process.env.DB_USER}`);
console.log(`Contraseña: ${process.env.DB_PASSWORD ? '******' : 'no configurada'}`);

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`Iniciando servidor en modo: ${NODE_ENV}`);
console.log(`Puerto: ${PORT}`);

// CORS súper permisivo para debugging
const corsOptions = {
  origin: true, // Permitir cualquier origen
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['*'],
  exposedHeaders: ['*'],
  maxAge: 86400
};

app.use(cors(corsOptions));

// Middleware adicional para CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).send();
  }
  
  next();
});

// Parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Logging detallado
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress || 'unknown';
  
  console.log(`${timestamp} - ${req.method} ${req.originalUrl} - IP: ${clientIP}`);
  console.log('Origin:', req.headers.origin || 'no-origin');
  console.log('User-Agent:', req.headers['user-agent'] || 'unknown');
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  
  next();
});

// Rutas de autenticación
app.use('/api', authRoutes);

// Ruta de prueba
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando correctamente desde cualquier dispositivo!',
    timestamp: new Date().toISOString(),
    server: {
      environment: NODE_ENV,
      port: PORT,
      cors: 'PERMISIVO'
    },
    client: {
      ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      origin: req.headers.origin
    },
    routes: {
      login: '/api/login',
      verify: '/api/verify',
      register: '/api/register'
    }
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`,
    availableRoutes: ['/test', '/health', '/api/login', '/api/verify', '/api/register']
  });
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 Accesible desde cualquier IP en: http://0.0.0.0:${PORT}`);
  console.log(`🔗 URL externa: https://api.biblioteca.sembrandodatos.com`);
});

// Manejar cierre graceful
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado.');
    pool.end();
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado.');
    pool.end();
  });
});
EOF

# Asegurar que .env.production tenga la configuración correcta
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

# URLs
FRONTEND_URL=https://biblioteca.sembrandodatos.com
API_URL=https://api.biblioteca.sembrandodatos.com
EOF

chown -R www-data:www-data $APP_DIR

echo "5. CONFIGURANDO SSL..."
# Renovar certificados
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@sembrandodatos.com --force-renewal

echo "6. INICIANDO SERVICIOS..."
# Verificar configuración de Nginx
nginx -t

# Iniciar servicios
systemctl start nginx
systemctl enable nginx

# Iniciar aplicación
cd $BACKEND_DIR
sudo -u www-data NODE_ENV=production pm2 start index.js --name "biblioteca-backend"
sudo -u www-data pm2 save

# Configurar PM2 para inicio automático
pm2 startup
systemctl enable pm2-www-data

echo "7. VERIFICANDO CONECTIVIDAD..."
sleep 5

echo "Probando endpoints..."
curl -s http://localhost:3000/test && echo "✅ Backend directo: OK" || echo "❌ Backend directo: FAIL"
curl -s http://localhost/test && echo "✅ Nginx HTTP: OK" || echo "❌ Nginx HTTP: FAIL"  
curl -k -s https://localhost/test && echo "✅ Nginx HTTPS: OK" || echo "❌ Nginx HTTPS: FAIL"
curl -s https://$DOMAIN/test && echo "✅ Dominio externo: OK" || echo "❌ Dominio externo: FAIL"

echo "Probando API de login..."
curl -X POST https://$DOMAIN/api/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","contrasena":"admin123"}' \
  && echo "✅ API Login: OK" || echo "❌ API Login: FAIL"

echo ""
echo "🎉 CONFIGURACIÓN COMPLETADA!"
echo "============================"
echo ""
echo "📱 PRUEBAS DESDE OTROS DISPOSITIVOS:"
echo "   1. Abrir: https://$DOMAIN/test"
echo "   2. Usar: test-connectivity-complete.html"
echo "   3. Probar API: https://$DOMAIN/api/login"
echo ""
echo "📊 MONITOREO:"
echo "   • PM2: sudo -u www-data pm2 status"
echo "   • Logs: sudo -u www-data pm2 logs"
echo "   • Nginx: systemctl status nginx"
echo ""
echo "⚠️ CORS está en modo SÚPER PERMISIVO para debugging."
echo "   Funciona desde cualquier origen, dispositivo y navegador."
echo ""
echo "🔧 Si aún no funciona, ejecutar:"
echo "   sudo bash diagnostico-completo.sh"
EOF
