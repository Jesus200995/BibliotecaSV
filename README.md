# Biblioteca de Datos Web - Sembrando Vida

Una aplicación web moderna para el catálogo de datos del programa Sembrando Vida, desarrollada con Vue.js y FastAPI.

## 🌟 Características

- **📁 Catálogo completo** de archivos con metadatos detallados
- **🔍 Búsqueda avanzada** con múltiples filtros
- **🗺️ Visor de mapas** para archivos geoespaciales con Leaflet
- **📊 Dashboard** con estadísticas interactivas
- **📱 Diseño responsive** compatible con móviles
- **⚡ Interfaz moderna** con Bootstrap Vue

## 🛠️ Tecnologías

### Backend
- **FastAPI** - Framework web moderno y rápido
- **PostgreSQL** - Base de datos robusta
- **AsyncPG** - Driver asíncrono para PostgreSQL
- **Pydantic** - Validación de datos

### Frontend
- **Vue.js 2** - Framework progresivo
- **Bootstrap Vue** - Componentes UI
- **Leaflet** - Mapas interactivos
- **Chart.js** - Gráficos y estadísticas
- **Axios** - Cliente HTTP

## 🚀 Instalación y Configuración

### Prerrequisitos
- Python 3.8+
- Node.js 16+
- PostgreSQL (ya configurado en VPS)

### 1. Configurar Backend

```bash
# Navegar al directorio backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual (Windows)
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

### 2. Configurar Frontend

```bash
# Navegar al directorio frontend
cd frontend

# Instalar dependencias
npm install
```

## 🏃‍♂️ Ejecutar en Desarrollo

### Backend (Terminal 1)
```bash
cd backend
venv\Scripts\activate  # Windows
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs

## 📁 Estructura del Proyecto

```
BibliotecaSV/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # Aplicación principal
│   │   ├── config.py        # Configuración
│   │   ├── database.py      # Conexión a BD
│   │   ├── schemas.py       # Modelos Pydantic
│   │   ├── services.py      # Lógica de negocio
│   │   └── routes.py        # Endpoints API
│   ├── requirements.txt     # Dependencias Python
│   └── .env                # Variables de entorno
└── frontend/
    ├── src/
    │   ├── components/      # Componentes Vue
    │   ├── views/          # Vistas/Páginas
    │   ├── store/          # Estado Vuex
    │   ├── router/         # Rutas
    │   └── services/       # Servicios API
    ├── package.json        # Dependencias Node.js
    └── .env               # Variables de entorno
```

## 🗄️ Base de Datos

La aplicación se conecta a PostgreSQL en el VPS (31.97.8.51) con las siguientes tablas:

### `catalogo_archivos`
- Información principal de archivos
- Metadatos como tema, entidad, municipio
- Rutas y tipos de archivo

### `archivo_campos`
- Estructura de campos de cada archivo
- Tipos y descripciones de columnas

## 🎯 Funcionalidades Principales

### 📊 Dashboard
- Estadísticas generales del catálogo
- Gráficos interactivos
- Acceso rápido a funciones principales

### 📁 Catálogo de Archivos
- Lista paginada de archivos
- Filtros por tipo, tema, entidad, municipio
- Vista de tabla y tarjetas
- Búsqueda en tiempo real

### 📄 Detalles de Archivo
- Información completa del archivo
- Estructura de campos
- Acciones (descargar, ver en mapa)

### 🗺️ Visor de Mapas
- Visualización de archivos geoespaciales
- Múltiples capas superpuestas
- Mapas base (OSM, Satelital, Terreno)
- Controles interactivos

## 🔧 API Endpoints

### Archivos
- `GET /api/archivos/` - Listar archivos con filtros
- `GET /api/archivos/{id}` - Obtener archivo específico
- `POST /api/archivos/` - Crear archivo
- `GET /api/archivos/estadisticas/resumen` - Estadísticas
- `GET /api/archivos/filtros/valores` - Valores para filtros

---

**Desarrollado para el programa Sembrando Vida** 🌱
