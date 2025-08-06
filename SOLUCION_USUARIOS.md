# Solución al Problema de Usuarios en Hosting

## Problema Original
Los usuarios no aparecían cuando la aplicación se hosteaba en producción, aunque funcionaba correctamente en desarrollo local.

## Causa del Problema
El componente `UsuariosView.vue` y otros componentes estaban usando una configuración hardcodeada para determinar la URL del backend:

```javascript
const BACKEND_URL = import.meta.env.DEV 
  ? 'http://localhost:4000/api' 
  : 'https://api.biblioteca.sembrandodatos.com/api'
```

Esto causaba problemas porque:
1. No utilizaba variables de entorno configurables
2. No manejaba correctamente diferentes escenarios de hosting
3. No tenía manejo robusto de errores de conectividad
4. No había logging adecuado para debugging en producción

## Soluciones Implementadas

### 1. Configuración Centralizada de API
Se creó un archivo de configuración centralizada (`src/config/api.js`) que:

- Detecta automáticamente el entorno (desarrollo vs producción)
- Utiliza variables de entorno configurables
- Proporciona URLs de fallback inteligentes
- Incluye configuración de timeouts más largos para producción

### 2. Mejoras en Manejo de Errores
Se implementó manejo robusto de errores que incluye:

- Detección específica de tipos de error (timeout, red, autenticación, etc.)
- Mensajes de error informativos para el usuario
- Logging detallado para debugging
- Limpieza automática de tokens inválidos

### 3. Sistema de Debug
Se agregó un sistema de debug que permite:

- Verificar conectividad del servidor
- Probar endpoints específicos
- Mostrar información detallada de configuración
- Solo visible en modo desarrollo

### 4. Configuración CORS Mejorada
Se actualizó la configuración CORS del backend para:

- Soportar múltiples orígenes de producción
- Manejar headers adicionales necesarios
- Proporcionar mejor logging de requests CORS

### 5. Middleware de Autenticación Mejorado
Se mejoró el middleware JWT para:

- Proporcionar mensajes de error más específicos
- Manejar diferentes tipos de errores de token
- Incluir logging detallado para debugging

## Archivos Modificados

### Frontend:
- `src/config/api.js` - Configuración centralizada
- `src/components/UsuariosView.vue` - Componente principal de usuarios
- `src/components/LoginView.vue` - Componente de login
- `src/components/MapaView.vue` - Componente de mapa
- `src/App.vue` - Aplicación principal
- `.env.example` - Ejemplo de variables de entorno
- `.env.production` - Variables de entorno para producción

### Backend:
- `index.js` - Configuración CORS y middleware mejorados

## Variables de Entorno Necesarias

### Para Desarrollo (.env.local):
```bash
VITE_API_URL=http://localhost:4000/api
VITE_APP_URL=http://localhost:5173
```

### Para Producción (.env.production):
```bash
VITE_API_URL=https://api.biblioteca.sembrandodatos.com/api
VITE_APP_URL=https://biblioteca.sembrandodatos.com
```

## Instrucciones de Deployment

### 1. Configurar Variables de Entorno
Asegúrate de que las variables de entorno estén configuradas correctamente en tu plataforma de hosting.

### 2. Verificar CORS
Confirma que la URL de tu frontend esté incluida en la lista de orígenes permitidos en el backend.

### 3. Verificar Conectividad
Usa el botón "Debug" (solo visible en desarrollo) para verificar la conectividad con el servidor.

### 4. Monitorear Logs
Revisa los logs del navegador y del servidor para identificar posibles problemas.

## Verificación de Funcionamiento

### En Desarrollo:
1. Ejecutar `npm run dev` en el frontend
2. Ejecutar `node index.js` en el backend
3. Acceder a la sección de usuarios
4. Usar el botón "Debug" para verificar conectividad

### En Producción:
1. Verificar que las variables de entorno estén configuradas
2. Confirmar que el backend esté ejecutándose correctamente
3. Probar la carga de usuarios desde el frontend
4. Revisar logs del servidor en caso de errores

## Debugging Adicional

Si los usuarios siguen sin aparecer en producción:

1. **Verificar Network Tab**: Revisar las peticiones HTTP en las herramientas de desarrollo
2. **Verificar Console**: Buscar errores de JavaScript en la consola
3. **Verificar CORS**: Confirmar que no hay errores CORS en la consola
4. **Verificar Backend**: Confirmar que el endpoint `/api/usuarios` responde correctamente
5. **Verificar Token**: Confirmar que el token JWT es válido y no ha expirado

## Beneficios de las Mejoras

1. **Configuración Flexible**: Fácil cambio entre entornos
2. **Mejor UX**: Mensajes de error informativos para el usuario
3. **Debugging Eficiente**: Herramientas integradas para diagnosticar problemas
4. **Mantenibilidad**: Código más organizado y fácil de mantener
5. **Robustez**: Mejor manejo de errores y casos extremos

Este conjunto de mejoras debería resolver completamente el problema de los usuarios que no aparecen en producción, proporcionando además herramientas para diagnosticar y resolver futuros problemas similares.
