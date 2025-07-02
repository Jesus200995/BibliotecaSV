# 📘 Instrucciones de Instalación y Uso - Biblioteca de Datos Web

## 🎯 Descripción del Proyecto

Has creado exitosamente una **aplicación web profesional y moderna** llamada **Biblioteca de Datos Web** para el programa Sembrando Vida. La aplicación incluye:

### ✨ Características Implementadas

- **🏠 Dashboard moderno** con estadísticas y gráficos interactivos
- **📁 Catálogo de archivos** con búsqueda avanzada y filtros múltiples
- **🗺️ Visor de mapas** con Leaflet para archivos geoespaciales
- **📊 Vista de estadísticas** con charts dinámicos
- **📱 Diseño responsive** que funciona en móviles y escritorio
- **🔍 Buscador inteligente** con filtros por tipo, tema, entidad, municipio
- **📋 Fichas técnicas detalladas** de cada archivo
- **🎨 Interfaz moderna** con sidebar, Bootstrap Vue y FontAwesome

## 🚀 Pasos para Ejecutar Localmente

### Opción 1: Uso Automático (Recomendado)

1. **Abrir VS Code** en la carpeta del proyecto
2. **Ejecutar el setup automático:**
   ```bash
   .\setup.bat
   ```
3. **Iniciar los servicios** (en terminales separadas):
   ```bash
   # Terminal 1 - Backend
   .\start_backend.bat
   
   # Terminal 2 - Frontend  
   .\start_frontend.bat
   ```

### Opción 2: Manual

#### Backend (Terminal 1)
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

#### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

## 🌐 URLs de Acceso

Una vez que ambos servicios estén ejecutándose:

- **🎨 Frontend (Aplicación Principal)**: http://localhost:8080
- **🔧 Backend API**: http://localhost:8000
- **📖 Documentación API Automática**: http://localhost:8000/docs
- **🔍 API Alternative Docs**: http://localhost:8000/redoc

## 📁 Estructura de la Aplicación

```
BibliotecaSV/
├── 🖥️ backend/              # FastAPI Backend
│   ├── app/
│   │   ├── main.py         # Aplicación principal
│   │   ├── config.py       # Configuración (BD, CORS)
│   │   ├── database.py     # Conexión PostgreSQL
│   │   ├── schemas.py      # Modelos de datos
│   │   ├── services.py     # Lógica de negocio
│   │   └── routes.py       # Endpoints API
│   ├── requirements.txt    # Dependencias Python
│   └── .env               # Variables de entorno
├── 🎨 frontend/             # Vue.js Frontend
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   │   └── layout/     # Header, Sidebar
│   │   ├── views/          # Páginas principales
│   │   │   ├── DashboardView.vue     # Dashboard
│   │   │   ├── ArchivosView.vue      # Catálogo
│   │   │   ├── DetalleArchivoView.vue # Ficha técnica
│   │   │   ├── MapaView.vue          # Visor mapas
│   │   │   └── EstadisticasView.vue  # Estadísticas
│   │   ├── store/          # Estado Vuex
│   │   ├── router/         # Rutas de navegación
│   │   └── services/       # Cliente API
│   ├── package.json       # Dependencias Node.js
│   └── .env              # Variables de entorno
└── 📖 README.md           # Documentación principal
```

## 🗄️ Conexión a Base de Datos

La aplicación está configurada para conectarse a tu PostgreSQL en el VPS:

```
Host: 31.97.8.51
Usuario: jesus
Contraseña: 2025
Base de datos: app_registros
```

### Tablas Utilizadas:
- **`catalogo_archivos`**: Información principal de archivos
- **`archivo_campos`**: Estructura de campos de cada archivo

## 🎮 Navegación en la Aplicación

### 1. **Dashboard (/)** 
- Vista de estadísticas generales
- Tarjetas con métricas clave
- Gráficos de distribución
- Accesos rápidos

### 2. **Catálogo (/archivos)**
- Lista completa de archivos
- Búsqueda por texto libre
- Filtros avanzados (tipo, tema, entidad, etc.)
- Vista de tabla y tarjetas
- Paginación

### 3. **Detalle de Archivo (/archivos/:id)**
- Información completa del archivo
- Metadatos técnicos
- Estructura de campos
- Botones de descarga y visualización

### 4. **Visor de Mapas (/mapa)**
- Mapas base (OpenStreetMap, Satelital, Terreno)
- Carga de capas geoespaciales
- Controles de zoom y navegación
- Panel lateral con lista de capas

### 5. **Estadísticas (/estadisticas)**
- Gráficos detallados
- Distribuciones por tipo y tema
- Tablas con porcentajes
- Métricas avanzadas

## 🔧 Endpoints API Disponibles

### Archivos
- `GET /api/archivos/` - Listar con filtros y paginación
- `GET /api/archivos/{id}` - Obtener archivo específico con campos
- `POST /api/archivos/` - Crear nuevo archivo
- `GET /api/archivos/estadisticas/resumen` - Estadísticas generales
- `GET /api/archivos/filtros/valores` - Valores únicos para filtros

### Utilidades
- `GET /` - Información de la API
- `GET /health` - Estado de la API y BD

## 🛠️ Tecnologías Utilizadas

### Backend
- **FastAPI** - Framework web moderno
- **AsyncPG** - Driver asíncrono PostgreSQL
- **Pydantic** - Validación de datos
- **Uvicorn** - Servidor ASGI

### Frontend  
- **Vue.js 2** - Framework progresivo
- **Bootstrap Vue** - Componentes UI
- **Vuex** - Gestión de estado
- **Vue Router** - Navegación
- **Leaflet** - Mapas interactivos
- **Chart.js** - Gráficos
- **Axios** - Cliente HTTP
- **FontAwesome** - Iconos

## 🎨 Características de Diseño

- **Sidebar colapsible** con navegación intuitiva
- **Header dinámico** con breadcrumbs
- **Tarjetas modernas** con efectos hover
- **Tablas responsivas** con paginación
- **Colores corporativos** de Sembrando Vida
- **Iconos consistentes** para tipos de archivo
- **Animaciones suaves** en transiciones

## 🔍 Funcionalidades de Búsqueda

- **Búsqueda libre** por nombre, descripción y tema
- **Filtros múltiples** simultáneos
- **Autocompletado** en selectores
- **Paginación** eficiente
- **URLs compartibles** con filtros

## 🗺️ Funcionalidades de Mapas

- **Múltiples mapas base** (OSM, Satelital, Terreno)
- **Carga dinámica** de capas geoespaciales
- **Panel de control** de capas
- **Popups informativos** con metadatos
- **Zoom automático** a extensión de capas
- **Leyenda dinámica** por capa

## 📊 Funcionalidades de Estadísticas

- **Gráficos de dona** para distribuciones
- **Gráficos de barras** horizontales y verticales
- **Tablas dinámicas** con porcentajes
- **Métricas en tiempo real**
- **Indicadores visuales** (tarjetas de estadísticas)

## 🚀 Próximos Pasos para Producción

### 1. Despliegue en VPS (31.97.8.51)
```bash
# Compilar frontend
cd frontend
npm run build

# Configurar Nginx para servir archivos estáticos
# Configurar Gunicorn para FastAPI
# Configurar SSL con Let's Encrypt
```

### 2. Configuración de Dominio
- Apuntar `biblioteca.sembrandodatos.com` a la IP 31.97.8.51
- Configurar certificado SSL

### 3. Optimizaciones
- Implementar cache con Redis
- Configurar CDN para assets
- Monitoreo con logs

## ❗ Troubleshooting

### Backend no inicia
- Verificar que PostgreSQL está accesible desde tu IP
- Comprobar credenciales en `.env`
- Verificar que el puerto 8000 está libre

### Frontend no carga
- Verificar que Node.js 16+ está instalado
- Verificar que el backend está corriendo en puerto 8000
- Comprobar la configuración en `frontend/.env`

### Error de conexión a BD
- Verificar conectividad: `telnet 31.97.8.51 5432`
- Comprobar credenciales
- Verificar que tu IP está autorizada en el firewall del VPS

## 🎉 ¡Felicidades!

Has creado exitosamente una aplicación web completa y profesional. La Biblioteca de Datos Web está lista para:

✅ Mostrar catálogo de archivos
✅ Búsqueda y filtrado avanzado  
✅ Visualización en mapas
✅ Estadísticas interactivas
✅ Fichas técnicas detalladas
✅ Descarga de archivos
✅ Interfaz responsive y moderna

La aplicación está optimizada para el programa Sembrando Vida y lista para producción. ¡Excelente trabajo! 🌱
