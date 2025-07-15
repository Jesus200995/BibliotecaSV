# Guía de Despliegue - Backend de Autenticación

Este documento detalla el proceso para desplegar el backend de autenticación en un entorno de producción, específicamente en un VPS.

## Requisitos Previos

- VPS con acceso SSH
- Node.js instalado (v14 o superior)
- NPM instalado
- PostgreSQL instalado o accesible remotamente
- Nginx (para proxy reverso y SSL) 
- Dominio configurado (api.biblioteca.sembrandodatos.com)
- Certificado SSL (Let's Encrypt recomendado)

## Pasos para el Despliegue

### 1. Preparar el Entorno

```bash
# Actualizar el sistema
sudo apt update
sudo apt upgrade -y

# Instalar dependencias si no están instaladas
sudo apt install -y nodejs npm git nginx certbot python3-certbot-nginx

# Instalar PM2 globalmente (para gestionar el proceso Node.js)
sudo npm install -g pm2
```

### 2. Clonar el Repositorio

```bash
# Crear directorio para la aplicación
mkdir -p /var/www/biblioteca-api
cd /var/www/biblioteca-api

# Clonar el repositorio (sustituir con tu repositorio)
git clone https://github.com/Jesus200995/BibliotecaSV.git .
cd backend
```

### 3. Configurar Variables de Entorno

Crear un archivo `.env.production` en la carpeta `/var/www/biblioteca-api/backend/`:

```
# Configuración de la base de datos
DB_HOST=31.97.8.51
DB_PORT=5432
DB_NAME=sembrandodatos
DB_USER=jesus
DB_PASSWORD=TU_CONTRASEÑA_AQUÍ
DB_SSL=true

# Configuración del servidor
PORT=3000
NODE_ENV=production

# Configuración de seguridad
JWT_SECRET=TU_CLAVE_SECRETA_AQUÍ_CAMBIALA
CORS_ORIGIN=https://biblioteca.sembrandodatos.com

# URL del frontend para CORS
FRONTEND_URL=https://biblioteca.sembrandodatos.com
API_URL=https://api.biblioteca.sembrandodatos.com
```

### 4. Instalar Dependencias y Configurar la Base de Datos

```bash
# Instalar dependencias
npm install

# Configurar la base de datos (crear tabla y usuario admin)
node setup_db.js
```

### 5. Configurar PM2 para Gestionar la Aplicación

```bash
# Iniciar la aplicación con PM2 en modo producción
pm2 start ecosystem.config.js --env production

# Guardar la configuración de PM2 para que se inicie con el sistema
pm2 save
pm2 startup
```

### 6. Configurar Nginx como Proxy Reverso

Crear un archivo de configuración para Nginx:

```bash
sudo nano /etc/nginx/sites-available/biblioteca-api
```

Añadir la siguiente configuración:

```nginx
server {
    server_name api.biblioteca.sembrandodatos.com;

    # Redirigir todo el tráfico HTTP a HTTPS
    listen 80;
    return 301 https://$host$request_uri;
}

server {
    server_name api.biblioteca.sembrandodatos.com;
    
    # Configuración HTTPS
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/api.biblioteca.sembrandodatos.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.biblioteca.sembrandodatos.com/privkey.pem;
    
    # Configuraciones de seguridad SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
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
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activar la configuración y obtener certificado SSL:

```bash
# Habilitar el sitio
sudo ln -s /etc/nginx/sites-available/biblioteca-api /etc/nginx/sites-enabled/

# Comprobar la configuración de Nginx
sudo nginx -t

# Obtener certificado SSL con Certbot
sudo certbot --nginx -d api.biblioteca.sembrandodatos.com

# Reiniciar Nginx
sudo systemctl restart nginx
```

### 7. Verificar el Despliegue

```bash
# Comprobar que PM2 esté ejecutando la aplicación
pm2 status

# Verificar los logs
pm2 logs biblioteca-backend

# Probar el endpoint de login
curl -X POST https://api.biblioteca.sembrandodatos.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"usuario": "admin", "contrasena": "admin123"}'
```

## Mantenimiento y Actualizaciones

### Actualizar el Código

```bash
cd /var/www/biblioteca-api
git pull origin main
cd backend
npm install
pm2 restart biblioteca-backend
```

### Monitorizar la Aplicación

```bash
# Ver logs en tiempo real
pm2 logs

# Monitorización en tiempo real
pm2 monit

# Reiniciar la aplicación
pm2 restart biblioteca-backend
```

## Solución de Problemas

1. **Error de conexión a la base de datos**:
   - Verificar credenciales en `.env.production`
   - Comprobar firewall y reglas de acceso
   - Verificar que PostgreSQL acepta conexiones remotas

2. **Error 502 Bad Gateway**:
   - Verificar que la aplicación Node.js está en ejecución: `pm2 status`
   - Revisar logs: `pm2 logs`
   - Comprobar configuración de puertos en Nginx y PM2

3. **Problemas con CORS**:
   - Verificar la configuración CORS en el código
   - Comprobar los dominios permitidos

4. **Problemas con SSL**:
   - Renovar certificados: `sudo certbot renew`
   - Verificar permisos de archivos de certificados

## Respaldo y Recuperación

```bash
# Hacer respaldo de la base de datos
pg_dump -h 31.97.8.51 -U jesus -d sembrandodatos -f backup_$(date +%Y%m%d).sql

# Restaurar respaldo
psql -h 31.97.8.51 -U jesus -d sembrandodatos -f backup_YYYYMMDD.sql
```

---

Esta guía cubre los aspectos básicos para desplegar el backend de autenticación en un entorno de producción. Ajusta los pasos según las necesidades específicas de tu entorno.
