# GUÍA DE DESPLIEGUE EN VPS - BIBLIOTECA SV

## PROBLEMA IDENTIFICADO
El apartado de usuarios no aparece porque:
1. La URL del API no está configurada correctamente para el VPS
2. El usuario no tiene rol de administrador
3. El backend no está corriendo o no es accesible

## SOLUCIÓN IMPLEMENTADA

### 1. URLs dinámicas del API
He mejorado la detección automática de URLs para que funcione en cualquier VPS:
- En desarrollo: `http://localhost:4000/api`
- En tu VPS: `http://TU_IP:4000/api` (se detecta automáticamente)
- Con dominio: puedes configurar con variables de entorno

### 2. Sidebar mejorado
- El apartado de usuarios ahora tiene su propia sección "Administración"
- Solo aparece para usuarios con rol 'admin'
- Mejor visibilidad visual

### 3. Manejo de errores mejorado
- Mensajes de error más específicos
- Panel de debug temporal para diagnosticar problemas
- Logging detallado en consola

## PASOS PARA DESPLEGAR EN TU VPS

### Paso 1: Backend
```bash
cd backend
npm install
# Verificar que .env tenga la configuración correcta
node index.js
# O mejor, usar PM2:
pm2 start index.js --name biblioteca-backend
```

### Paso 2: Frontend
```bash
cd frontend
npm install

# Para desarrollo/testing:
npm run dev

# Para producción:
npm run build
# Esto crea la carpeta 'dist' que debes servir con nginx/apache
```

### Paso 3: Configurar servidor web (nginx ejemplo)
```nginx
server {
    listen 80;
    server_name tu-dominio.com;  # o tu IP
    
    # Servir el frontend
    location / {
        root /ruta/a/tu/proyecto/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy para el backend
    location /api {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Paso 4: Verificar usuarios admin
```bash
# Ejecutar desde la carpeta backend:
node -e "
require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT usuario, rol FROM usuarios WHERE rol = \$1', ['admin']).then(result => {
  console.log('Usuarios administradores:');
  result.rows.forEach(user => console.log('- ' + user.usuario));
  pool.end();
});
"
```

## USUARIOS ADMINISTRADORES DISPONIBLES
Según la base de datos, estos usuarios tienen permisos de admin:
- `admin` (rol: admin)  
- `Jess` (rol: admin)

Prueba hacer login con alguno de estos usuarios.

## DIAGNÓSTICO DE PROBLEMAS

### Si aún no aparece el apartado usuarios:
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña Console
3. Busca mensajes que empiecen con "App -" o "UsuariosView -"
4. Verifica la información del panel de debug en la página de usuarios

### Mensajes de error comunes:
- "No se pudo conectar con el servidor": Backend no está corriendo
- "No tienes permisos de administrador": Usuario no tiene rol admin
- "Token inválido": Sesión expirada, hacer login nuevamente

## CONFIGURACIÓN DE VARIABLES DE ENTORNO

Si necesitas configurar una URL específica, crea un archivo `.env.local` en la carpeta frontend:

```bash
# .env.local
VITE_API_URL=http://31.97.8.51:4000/api
VITE_APP_URL=http://31.97.8.51
```

## VERIFICACIÓN FINAL

Una vez desplegado, deberías poder:
1. Acceder a la aplicación en tu navegador
2. Hacer login con un usuario admin (admin, Jess)
3. Ver el apartado "Gestión de Usuarios" en la sección "Administración" del sidebar
4. Acceder a la lista de usuarios sin errores

Si sigues teniendo problemas, revisa los logs de la consola del navegador y del backend para más detalles específicos.
