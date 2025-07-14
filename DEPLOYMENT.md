# Biblioteca SV - Guía de Deployment

Esta guía explica cómo configurar y desplegar la aplicación Biblioteca SV para que funcione correctamente desde cualquier dispositivo y ubicación.

## 🚀 Resumen de Problemas Solucionados

### Problemas identificados y solucionados:
1. ✅ **Puerto del backend**: Configurado para usar HTTPS (443) en producción
2. ✅ **Variables de entorno**: URLs de producción correctamente configuradas
3. ✅ **CORS**: Configurado para permitir acceso desde dominios externos
4. ✅ **SSL/HTTPS**: Configuración automática de certificados SSL
5. ✅ **Acceso externo**: Servidor configurado para aceptar conexiones de cualquier IP
6. ✅ **Manejo de errores**: Logging detallado y mensajes de error específicos

## 📋 Requisitos del Sistema

### VPS/Servidor:
- Ubuntu 20.04 LTS o superior
- Node.js 18.x
- PostgreSQL 13 o superior
- Nginx
- Certbot (para SSL)
- PM2 (para gestión de procesos)

### Dominios configurados:
- `https://biblioteca.sembrandodatos.com` (Frontend)
- `https://api.biblioteca.sembrandodatos.com` (Backend/API)

## 🛠️ Instalación y Configuración

### 1. Preparar el VPS

```bash
# Conectar al VPS
ssh usuario@tu-servidor.com

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Clonar el repositorio
git clone <tu-repositorio> /var/www/biblioteca
cd /var/www/biblioteca

# Hacer ejecutable el script de deployment
chmod +x deploy.sh
```

### 2. Ejecutar el deployment automático

```bash
# Ejecutar el script de deployment completo
./deploy.sh
```

Este script automáticamente:
- Instala todas las dependencias del sistema
- Configura Node.js y PM2
- Instala dependencias del backend y frontend
- Configura Nginx con proxy reverso
- Obtiene certificados SSL automáticamente
- Configura el firewall
- Inicia todos los servicios

### 3. Configuración manual (si es necesario)

#### Backend:
```bash
cd /var/www/biblioteca/backend

# Instalar dependencias
npm install --production

# Configurar variables de entorno para producción
cp .env.production .env

# Iniciar con PM2
pm2 start ecosystem.config.js
pm2 save
```

#### Frontend:
```bash
cd /var/www/biblioteca/frontend

# Instalar dependencias
npm install

# Construir para producción
npm run build
```

## 🔧 Configuración de Base de Datos

### Asegúrate de que tu PostgreSQL esté configurado correctamente:

```sql
-- Conectar a PostgreSQL
psql -h 31.97.8.51 -U jesus -d sembrandodatos

-- Verificar tabla de usuarios
SELECT * FROM usuarios;

-- Si no existe, crear la tabla
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'admin',
    activo BOOLEAN DEFAULT TRUE
);

-- Insertar usuario inicial si no existe
INSERT INTO usuarios (usuario, contrasena, rol, activo) 
VALUES ('admin', 'admin123', 'admin', true)
ON CONFLICT (usuario) DO NOTHING;
```

## 🔍 Verificación y Testing

### 1. Probar conectividad

```bash
# Ejecutar tests de conectividad
node test-connectivity.js
```

### 2. Verificar servicios

```bash
# Estado del backend
pm2 status
pm2 logs biblioteca-backend

# Estado de Nginx
sudo systemctl status nginx
sudo nginx -t

# Verificar certificados SSL
sudo certbot certificates

# Verificar puertos abiertos
sudo netstat -tlnp | grep :443
sudo netstat -tlnp | grep :80
```

### 3. Tests manuales

```bash
# Test del backend
curl -k https://api.biblioteca.sembrandodatos.com/test

# Test de login
curl -k -X POST https://api.biblioteca.sembrandodatos.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","contrasena":"admin123"}'

# Test del frontend
curl -k https://biblioteca.sembrandodatos.com
```

## 🌐 Configuración DNS

Asegúrate de que tus dominios apunten al IP de tu VPS:

```
biblioteca.sembrandodatos.com    A    [IP_DE_TU_VPS]
api.biblioteca.sembrandodatos.com A   [IP_DE_TU_VPS]
```

## 🔒 Configuración de Firewall

El script configura automáticamente UFW:

```bash
# Verificar estado del firewall
sudo ufw status

# Reglas configuradas:
# - SSH (22)
# - HTTP (80)
# - HTTPS (443)
```

## 📱 Testing desde Dispositivos Externos

### Después del deployment, prueba desde:

1. **Otro computador**:
   - Abre https://biblioteca.sembrandodatos.com
   - Intenta hacer login con: admin/admin123

2. **Dispositivo móvil**:
   - Usa datos móviles (no WiFi de tu casa)
   - Navega a la misma URL

3. **Red externa**:
   - Conéctate desde una red diferente
   - Verifica que todo funcione correctamente

## 🐛 Debugging y Troubleshooting

### Logs importantes:

```bash
# Logs del backend
pm2 logs biblioteca-backend

# Logs de Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Logs del sistema
sudo journalctl -u nginx -f
```

### Comandos útiles para debugging:

```bash
# Reiniciar servicios
pm2 restart biblioteca-backend
sudo systemctl restart nginx

# Verificar configuración
sudo nginx -t
pm2 describe biblioteca-backend

# Verificar DNS
nslookup api.biblioteca.sembrandodatos.com
nslookup biblioteca.sembrandodatos.com

# Test de conectividad
telnet api.biblioteca.sembrandodatos.com 443
```

### Problemas comunes y soluciones:

1. **Error 502 Bad Gateway**:
   ```bash
   # Verificar que el backend esté corriendo
   pm2 status
   pm2 restart biblioteca-backend
   ```

2. **Error de certificado SSL**:
   ```bash
   # Renovar certificados
   sudo certbot renew
   sudo systemctl restart nginx
   ```

3. **Error de CORS**:
   - Verificar que las URLs en las variables de entorno sean correctas
   - Revisar configuración de CORS en el backend

4. **Error de conexión a base de datos**:
   ```bash
   # Test de conexión
   psql -h 31.97.8.51 -U jesus -d sembrandodatos -c "SELECT NOW();"
   ```

## 🔄 Actualizaciones

Para actualizar la aplicación:

```bash
cd /var/www/biblioteca

# Obtener últimos cambios
git pull origin main

# Actualizar backend
cd backend
npm install --production
pm2 restart biblioteca-backend

# Actualizar frontend
cd ../frontend
npm install
npm run build

# Reiniciar Nginx
sudo systemctl restart nginx
```

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs (comandos arriba)
2. Ejecuta `node test-connectivity.js` para diagnosticar
3. Verifica que todos los servicios estén corriendo
4. Confirma que el DNS esté configurado correctamente

## 🎯 URLs Finales

Después del deployment exitoso:

- **Frontend**: https://biblioteca.sembrandodatos.com
- **API**: https://api.biblioteca.sembrandodatos.com
- **Test endpoint**: https://api.biblioteca.sembrandodatos.com/test
- **DB Status**: https://api.biblioteca.sembrandodatos.com/db-status

¡Listo! Tu aplicación debería estar accesible desde cualquier dispositivo con conexión a Internet.
