# 🚀 Despliegue en VPS - Biblioteca SV

## Configuración Actual Verificada

### Base de Datos PostgreSQL
```
Host: 31.97.8.51
Puerto: 5432
Base de datos: sembrandodatos
Usuario: jesus
Contraseña: 2025
SSL: Habilitado
```

### URLs de Producción
- **Frontend**: https://biblioteca.sembrandodatos.com
- **API Backend**: https://api.biblioteca.sembrandodatos.com
- **Pruebas**: Usar `test-connectivity-complete.html`

## 🔧 Pasos para Desplegar en VPS

### 1. Preparar el VPS
```bash
# Conectarse al VPS por SSH
ssh tu_usuario@tu_vps_ip

# Subir el script de despliegue
scp deploy-vps.sh tu_usuario@tu_vps_ip:/tmp/

# Ejecutar el script de despliegue
sudo bash /tmp/deploy-vps.sh
```

### 2. Configuración Manual (si prefieres hacerlo paso a paso)

#### A. Actualizar el sistema e instalar dependencias
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm git nginx certbot python3-certbot-nginx
sudo npm install -g pm2
```

#### B. Clonar el proyecto
```bash
sudo mkdir -p /var/www/biblioteca-api
sudo chown -R www-data:www-data /var/www/biblioteca-api
cd /var/www/biblioteca-api
sudo -u www-data git clone https://github.com/Jesus200995/BibliotecaSV.git .
```

#### C. Configurar el backend
```bash
cd /var/www/biblioteca-api/backend
sudo -u www-data npm install

# Crear archivo .env.production
sudo -u www-data cat > .env.production << EOF
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
```

#### D. Configurar la base de datos
```bash
sudo -u www-data node setup_db.js
```

#### E. Configurar Nginx
```bash
sudo tee /etc/nginx/sites-available/biblioteca-api > /dev/null << EOF
server {
    server_name api.biblioteca.sembrandodatos.com;
    listen 80;
    return 301 https://\$host\$request_uri;
}

server {
    server_name api.biblioteca.sembrandodatos.com;
    listen 443 ssl;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    
    # Headers de seguridad
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000" always;
    
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
        
        # CORS
        add_header Access-Control-Allow-Origin "https://biblioteca.sembrandodatos.com" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With" always;
        add_header Access-Control-Allow-Credentials "true" always;
        
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

# Habilitar el sitio
sudo ln -s /etc/nginx/sites-available/biblioteca-api /etc/nginx/sites-enabled/
sudo nginx -t
```

#### F. Configurar SSL con Let's Encrypt
```bash
sudo certbot --nginx -d api.biblioteca.sembrandodatos.com
sudo systemctl restart nginx
```

#### G. Iniciar la aplicación con PM2
```bash
cd /var/www/biblioteca-api/backend
sudo -u www-data pm2 start ecosystem.config.js --env production
sudo -u www-data pm2 save
sudo pm2 startup
sudo systemctl enable pm2-www-data
```

## 🧪 Verificar el Despliegue

### 1. Verificar servicios
```bash
# Estado de PM2
sudo -u www-data pm2 status

# Estado de Nginx
sudo systemctl status nginx

# Logs de la aplicación
sudo -u www-data pm2 logs
```

### 2. Probar endpoints
```bash
# Probar conectividad básica
curl https://api.biblioteca.sembrandodatos.com/test

# Probar login
curl -X POST https://api.biblioteca.sembrandodatos.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","contrasena":"admin123"}'
```

### 3. Usar la página de pruebas
Abre `test-connectivity-complete.html` en cualquier navegador desde cualquier dispositivo para hacer pruebas completas.

## 🔧 Configuración del Frontend

Asegúrate de que tu frontend esté configurado para usar la URL de producción:

```javascript
// En tu archivo de configuración del frontend
const API_BASE_URL = 'https://api.biblioteca.sembrandodatos.com/api';
```

## 📱 Pruebas desde Otros Dispositivos

1. **Desde cualquier navegador**: Abre `test-connectivity-complete.html`
2. **Desde aplicaciones móviles**: Usa la URL `https://api.biblioteca.sembrandodatos.com/api`
3. **Verificar CORS**: El sistema debería funcionar desde `https://biblioteca.sembrandodatos.com`

## 🔍 Solución de Problemas Comunes

### Error de conexión a la base de datos
```bash
# Verificar conectividad
pg_isready -h 31.97.8.51 -p 5432 -U jesus

# Probar conexión manual
psql -h 31.97.8.51 -p 5432 -U jesus -d sembrandodatos
```

### Error 502 Bad Gateway
```bash
# Verificar que PM2 esté corriendo
sudo -u www-data pm2 status

# Reiniciar aplicación
sudo -u www-data pm2 restart biblioteca-backend
```

### Problemas de CORS
```bash
# Verificar configuración de Nginx
sudo nginx -t
sudo systemctl reload nginx
```

## 🔄 Actualizaciones

Para actualizar el código:
```bash
cd /var/www/biblioteca-api
sudo -u www-data git pull origin main
cd backend
sudo -u www-data npm install
sudo -u www-data pm2 restart biblioteca-backend
```

## 📞 Soporte

Si tienes problemas, revisa:
1. Logs de PM2: `sudo -u www-data pm2 logs`
2. Logs de Nginx: `tail -f /var/log/nginx/error.log`
3. Estado de servicios: `sudo systemctl status nginx pm2-www-data`
