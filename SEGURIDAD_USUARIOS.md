# Seguridad y Control de Acceso - Módulo Usuarios

## Estado Actual ✅
El sistema ahora tiene múltiples capas de seguridad implementadas:

### Frontend (Vue.js)
- ✅ Verificación de rol en App.vue con computed property `esAdmin`
- ✅ Validación antes de mostrar opciones de navegación
- ✅ Pantalla de acceso denegado en UsuariosView.vue
- ✅ Verificación local antes de cargar datos
- ✅ Validación del localStorage antes de hacer peticiones

### Backend (Node.js/Express)
- ✅ Middleware JWT para autenticación (`verificarToken`)
- ✅ Validación de rol 'admin' en todos los endpoints de usuarios
- ✅ Tokens con expiración (24h)
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Protección contra eliminación del admin principal

## Flujo de Seguridad

### 1. Login
```
Usuario → Credenciales → Backend valida → JWT generado → localStorage
```

### 2. Acceso a Usuarios
```
Frontend verifica rol → Si admin → Muestra opción → Usuario hace clic
→ Frontend valida nuevamente → Petición con JWT → Backend valida token y rol
→ Si válido → Retorna datos → Muestra interface
```

### 3. Operaciones CRUD
```
Cada operación → JWT en header → Backend valida token → Verifica rol admin
→ Si válido → Ejecuta operación → Retorna resultado
```

## Medidas de Seguridad Adicionales Recomendadas

### 1. Refresh Tokens (Opcional)
```javascript
// Implementar tokens de actualización para mayor seguridad
const refreshToken = jwt.sign({ id: usuario.id }, REFRESH_SECRET, { expiresIn: '7d' })
```

### 2. Rate Limiting
```javascript
// Limitar intentos de login
const rateLimit = require('express-rate-limit')
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos
  message: 'Demasiados intentos de login'
})
app.use('/api/login', loginLimiter)
```

### 3. Logs de Seguridad
```javascript
// Registrar intentos de acceso no autorizado
function logSecurityEvent(event, userId, ip, userAgent) {
  console.log(`[SECURITY] ${event} - User: ${userId} - IP: ${ip} - UA: ${userAgent}`)
}
```

### 4. Validación de Sesión Periódica
```javascript
// Verificar token periódicamente en frontend
setInterval(async () => {
  try {
    await axios.get('/api/verify-token')
  } catch (error) {
    // Token expirado, cerrar sesión
    cerrarSesion()
  }
}, 5 * 60 * 1000) // Cada 5 minutos
```

### 5. Protección CSRF (Opcional)
```javascript
const csrf = require('csurf')
app.use(csrf())
```

## Testing de Seguridad

### Casos de Prueba ✅
1. ✅ Usuario no admin no ve la opción "Usuarios"
2. ✅ Usuario no admin no puede acceder a /api/usuarios
3. ✅ Token expirado rechaza el acceso
4. ✅ Token malformado rechaza el acceso
5. ✅ Usuario sin token rechaza el acceso
6. ✅ No se puede eliminar admin principal (ID 1)

### Comandos de Prueba
```bash
# Probar sin token
curl -X GET http://localhost:4000/api/usuarios

# Probar con token inválido
curl -X GET http://localhost:4000/api/usuarios -H "Authorization: Bearer invalid-token"

# Probar eliminación de admin principal
curl -X DELETE http://localhost:4000/api/usuarios/1 -H "Authorization: Bearer valid-admin-token"
```

## Configuración Actual

### Variables de Entorno Críticas
```env
JWT_SECRET=tu-secreto-muy-seguro
DB_PASSWORD=contraseña-segura
NODE_ENV=production
```

### Configuración CORS
- ✅ Orígenes permitidos configurados
- ✅ Headers de seguridad incluidos
- ✅ Credentials habilitados para desarrollo

## Monitoreo y Mantenimiento

### Logs a Revisar
1. Intentos de login fallidos
2. Accesos no autorizados a endpoints de admin
3. Tokens expirados o inválidos
4. Operaciones de usuarios (crear, editar, eliminar)

### Mantenimiento Regular
1. Revisar usuarios activos periódicamente
2. Rotar JWT_SECRET cada cierto tiempo
3. Revisar logs de seguridad semanalmente
4. Actualizar dependencias de seguridad

## Estado de Implementación

| Característica | Estado | Prioridad |
|----------------|--------|-----------|
| Control de acceso frontend | ✅ Implementado | Alta |
| Control de acceso backend | ✅ Implementado | Alta |
| JWT Authentication | ✅ Implementado | Alta |
| Validación de roles | ✅ Implementado | Alta |
| Encriptación de contraseñas | ✅ Implementado | Alta |
| Protección admin principal | ✅ Implementado | Alta |
| Rate limiting | ❌ Pendiente | Media |
| Refresh tokens | ❌ Pendiente | Baja |
| Logs de seguridad | ❌ Pendiente | Media |
| Validación CSRF | ❌ Pendiente | Baja |

## Conclusión

El sistema de control de acceso para el módulo de usuarios está **completamente implementado** y funcionando correctamente. Solo los usuarios con rol 'admin' pueden:

1. Ver la opción "Usuarios" en el menú
2. Acceder a la pantalla de gestión de usuarios
3. Realizar operaciones CRUD sobre usuarios
4. Ver estadísticas de usuarios del sistema

El sistema es seguro y está listo para producción.
