# 🚀 Guía de Despliegue - BibliotecaSV

Esta guía explica cómo desplegar correctamente BibliotecaSV en producción usando Node.js directo con PM2.

## 📋 Configuración del Servidor (VPS)

### Backend (Node.js + PM2)

#### 1. Preparar el directorio del backend
```bash
# En tu VPS
cd /var/www/biblioteca-api
git pull origin main

# Instalar/actualizar dependencias
cd backend
npm install --production
```

#### 2. Configurar variables de entorno para producción
```bash
# Crear archivo .env.production
cat > .env.production << EOF
# Configuración para producción
NODE_ENV=production
PORT=4000

# Base de datos
DB_HOST=31.97.8.51
DB_PORT=5432
DB_NAME=sembrandodatos
DB_USER=jesus
DB_PASSWORD=2025
DB_SSL=false

# JWT
JWT_SECRET=biblioteca_sembrandodatos_secret_2025

# CORS configuración
CORS_ORIGIN=https://biblioteca.sembrandodatos.com,http://biblioteca.sembrandodatos.com

# URLs del frontend
FRONTEND_URL=https://biblioteca.sembrandodatos.com
FRONTEND_URL_HTTP=http://biblioteca.sembrandodatos.com
EOF
```

#### 3. Verificar configuración
```bash
# Ejecutar script de verificación
node verify-config.js
```

#### 4. Configurar PM2
```bash
# Detener proceso anterior si existe
pm2 stop biblioteca-backend
pm2 delete biblioteca-backend

# Crear archivo de configuración PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'biblioteca-backend',
    script: './index.js',
    cwd: '/var/www/biblioteca-api/backend',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

# Crear directorio de logs
mkdir -p logs

# Iniciar con PM2 en modo producción
pm2 start ecosystem.config.js --env production

# Verificar estado
pm2 status
pm2 logs biblioteca-backend --lines 50
```

#### 5. Configurar inicio automático
```bash
# Guardar configuración PM2
pm2 save

# Configurar inicio automático en boot
pm2 startup
# (Ejecutar el comando que te muestre)
```

### Frontend (Build de producción)

#### 1. Preparar el frontend
```bash
# En tu VPS
cd /var/www/biblioteca-frontend  # o donde tengas el frontend
git pull origin main

# Instalar dependencias
npm install
```

#### 2. Configurar variables de entorno para build
```bash
# Verificar .env.production
cat .env.production
# Debe contener:
# VITE_API_URL=https://biblioteca.sembrandodatos.com:4000/api
# VITE_APP_URL=https://biblioteca.sembrandodatos.com
# VITE_NODE_ENV=production
```

#### 3. Hacer build de producción
```bash
npm run build

# El build estará en /dist
ls -la dist/
```

#### 4. Servir con nginx (configuración ejemplo)
```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name biblioteca.sembrandodatos.com;

    # SSL configuración (si aplica)
    # ssl_certificate /path/to/cert.pem;
    # ssl_certificate_key /path/to/key.pem;

    # Frontend estático
    location / {
        root /var/www/biblioteca-frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Headers de cache para assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Proxy para API backend (puerto 4000)
    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
}
```

## 🔍 Verificación del Despliegue

### 1. URLs de prueba
```bash
# Health check del backend
curl https://biblioteca.sembrandodatos.com:4000/api/health

# Status completo
curl https://biblioteca.sembrandodatos.com:4000/api/status

# Frontend
curl https://biblioteca.sembrandodatos.com/
```

### 2. Logs para debugging
```bash
# Logs del backend
pm2 logs biblioteca-backend

# Logs detallados
pm2 logs biblioteca-backend --lines 100 --raw

# Monitoreo en tiempo real
pm2 monit
```

### 3. Troubleshooting común

#### Backend no responde
```bash
# Verificar estado
pm2 status

# Ver logs de error
pm2 logs biblioteca-backend --err

# Reiniciar proceso
pm2 restart biblioteca-backend

# Verificar puerto
netstat -tlnp | grep :4000
```

#### Problemas CORS
```bash
# Verificar headers CORS
curl -H "Origin: https://biblioteca.sembrandodatos.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Authorization" \
     -X OPTIONS \
     https://biblioteca.sembrandodatos.com:4000/api/health
```

#### Base de datos no conecta
```bash
# Probar conexión directa
psql -h 31.97.8.51 -p 5432 -U jesus -d sembrandodatos

# Verificar en el backend
cd /var/www/biblioteca-api/backend
node verify-config.js
```

## 🔐 Configuración de Firewall

```bash
# Permitir puerto 4000 para el backend
sudo ufw allow 4000/tcp
sudo ufw status
```

## 📊 Monitoreo

### PM2 Monitoring
```bash
# Estado general
pm2 status

# Memoria y CPU
pm2 monit

# Logs en vivo
pm2 logs --raw
```

### Logs estructurados
```bash
# Backend logs con timestamp
tail -f /var/www/biblioteca-api/backend/logs/combined.log

# Filtrar errores
grep -i error /var/www/biblioteca-api/backend/logs/combined.log
```

## 🔄 Actualización en Producción

```bash
# 1. Backend
cd /var/www/biblioteca-api
git pull
cd backend
npm install --production
pm2 restart biblioteca-backend

# 2. Frontend  
cd /var/www/biblioteca-frontend
git pull
npm install
npm run build

# 3. Verificar
curl https://biblioteca.sembrandodatos.com:4000/api/health
```

## 📱 URLs Finales

- **Frontend:** https://biblioteca.sembrandodatos.com
- **API Backend:** https://biblioteca.sembrandodatos.com:4000/api
- **Health Check:** https://biblioteca.sembrandodatos.com:4000/api/health
- **Admin Panel:** https://biblioteca.sembrandodatos.com/usuarios

## ⚡ Performance Tips

1. **Backend:** Usar clustering con PM2
2. **Frontend:** Configurar compresión gzip en nginx
3. **Database:** Indexar tablas principales
4. **Cache:** Implementar Redis si es necesario

---

✅ **Con esta configuración, el backend corre directamente en Node.js puerto 4000 y el frontend se construye estáticamente, eliminando cualquier problema de proxy o subdominios.**
