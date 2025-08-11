# Sistema de Usuarios y Historiales - BibliotecaSV

## Resumen de Implementación

Se ha implementado completamente el sistema de gestión de usuarios y historiales para administradores según las especificaciones solicitadas.

## ✅ Backend - Endpoints Implementados

### 1. Middlewares de Autenticación
- ✅ `requireAuth`: Valida JWT de Authorization Bearer
- ✅ `requireAdmin`: Verifica rol de administrador
- ✅ Token incluye `id`, `usuario` y `rol`

### 2. Endpoint GET /api/usuarios (solo admin)
- ✅ Protegido con `requireAuth` y `requireAdmin`
- ✅ Respuesta: `[{ id, usuario, rol, activo }]`

### 3. Endpoint GET /api/historiales (solo admin)
- ✅ Protegido con `requireAuth` y `requireAdmin`  
- ✅ Parámetros opcionales:
  - `limit` (por defecto 50)
  - `offset` (por defecto 0)
  - `archivo_id` (filtrar por archivo)
  - `usuario_id` (filtrar por usuario)
  - `desde` (fecha inicio)
  - `hasta` (fecha fin)
- ✅ JOIN con usuarios y catalogo_archivos
- ✅ Respuesta incluye contexto completo
- ✅ Fechas en formato UTC (timestamptz)

### 4. Registro Automático de Historial
- ✅ Se registra automáticamente al subir archivo
- ✅ Incluye:
  - `archivo_id` (ID del archivo insertado)
  - `usuario_id` (de req.user.id)
  - `accion = 'subida'`
  - `detalle` (nombre, tipo, tamaño)
  - `ip` (de req.ip o headers)
  - `user_agent` (de headers)

### 5. CORS
- ✅ Configurado solo en Express
- ✅ Origin permitido en desarrollo: `http://localhost:5174`
- ✅ Origin permitido en producción: `https://biblioteca.sembrandodatos.com`

## ✅ Frontend - Implementado

### 1. Sidebar
- ✅ Entrada "Usuarios" → /usuarios
- ✅ Entrada "Historiales" → /historiales
- ✅ Visible solo si `user.rol === 'admin'`

### 2. Router
- ✅ Ruta `/usuarios` con `meta: { requiresAuth: true, requiresAdmin: true }`
- ✅ Ruta `/historiales` con `meta: { requiresAuth: true, requiresAdmin: true }`
- ✅ Guard global implementado:
  - Si `requiresAuth` y no hay token → redirige a `/login`
  - Si `requiresAdmin` y `user.rol !== 'admin'` → redirige a `/`

### 3. Vista UsuariosView.vue
- ✅ Diseño consistente con otros apartados
- ✅ Tabla con columnas: ID, Usuario, Rol, Activo
- ✅ GET a `/api/usuarios` con header Authorization
- ✅ Funcionalidades CRUD completas

### 4. Vista HistorialesView.vue
- ✅ Diseño consistente (card/tabla)
- ✅ Filtros implementados:
  - Por usuario (dropdown)
  - Por archivo ID (input)
  - Rango de fechas (date inputs)
- ✅ Tabla con columnas:
  - **Fecha/Hora (CDMX)**: Formateada a `America/Mexico_City`
  - **Usuario**: Con avatar y nombre
  - **Acción**: Badge con colores
  - **Archivo**: Nombre + tipo + ID
  - **IP**: Dirección IP
- ✅ Paginación simple (limit, offset)
- ✅ Formateo de fechas a zona horaria de México
- ✅ GET a `/api/historiales` con filtros y Authorization

### 5. Flujo de Subida de Archivos
- ✅ No se cambió el flujo del frontend
- ✅ El backend registra automáticamente el historial
- ✅ Refresca la lista normal tras subir

## ✅ Aceptación - Cumplida en Desarrollo

### Tests Realizados:
1. ✅ Login admin → Sidebar muestra Usuarios y Historiales
2. ✅ Login user → Sidebar NO muestra esos ítems  
3. ✅ GET /api/usuarios → 200 con admin, 403 con user
4. ✅ GET /api/historiales → 200 con admin, 403 con user
5. ✅ Subir archivo registra fila en historiales con accion='subida'
6. ✅ Fechas se ven en hora de Ciudad de México en UI

## 📱 URLs de Acceso

- **Aplicación**: http://localhost:5174
- **Backend API**: http://localhost:4000
- **Usuarios**: http://localhost:5174/usuarios (solo admin)
- **Historiales**: http://localhost:5174/historiales (solo admin)

## 🗄️ Base de Datos

La tabla `historiales` ya existe con la estructura:

```sql
CREATE TABLE historiales (
    id SERIAL PRIMARY KEY,
    archivo_id INTEGER NOT NULL REFERENCES catalogo_archivos(id) ON DELETE CASCADE,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    accion VARCHAR(50) NOT NULL DEFAULT 'subida',
    detalle TEXT,
    ip VARCHAR(45),
    user_agent TEXT,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_historiales_archivo   ON historiales (archivo_id);
CREATE INDEX idx_historiales_usuario   ON historiales (usuario_id);
CREATE INDEX idx_historiales_creado_en ON historiales (creado_en DESC);
```

## 🔧 Configuración

### Backend (puerto 4000)
- JWT_SECRET configurado
- PostgreSQL conectado a 31.97.8.51
- Base de datos: sembrandodatos
- CORS habilitado para desarrollo

### Frontend (puerto 5174)
- Vue 3 + Vite
- Tailwind CSS
- Axios configurado
- API_CONFIG dinámico (dev/prod)

## 📋 Funcionalidades Principales

### Gestión de Usuarios (Admin)
- Listar usuarios con paginación
- Crear nuevos usuarios
- Editar usuarios existentes
- Eliminar usuarios (con confirmación)
- Filtros y búsqueda
- Estados activo/inactivo

### Historial de Actividades (Admin)
- Ver todas las actividades del sistema
- Filtrar por usuario, archivo, fechas
- Paginación eficiente (50 registros por página)
- Fechas en zona horaria de México
- Detalles completos de cada acción
- Registro automático al subir archivos

### Seguridad
- Autenticación JWT requerida
- Verificación de rol de administrador
- Guards de navegación en frontend
- Validación en backend
- Headers de autorización seguros

## 🎯 Estado del Proyecto

✅ **COMPLETADO**: Todos los requisitos de la especificación han sido implementados y probados.

El sistema está listo para producción y cumple con todos los criterios de aceptación especificados en la petición original.
