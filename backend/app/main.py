from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

# Crear aplicación FastAPI
app = FastAPI(
    title="Biblioteca de Datos Web API",
    description="API para la gestión del catálogo de archivos del programa Sembrando Vida",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Endpoint raíz de la API"""
    return {
        "message": "Biblioteca de Datos Web API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "online"
    }

@app.get("/health")
async def health_check():
    """Verificar el estado de la API"""
    return {
        "status": "healthy",
        "database": "not connected yet",
        "timestamp": "2025-07-02T00:00:00Z"
    }

# Datos de ejemplo mientras conectamos la BD
@app.get("/api/archivos/")
async def listar_archivos():
    """Listar archivos (datos de ejemplo)"""
    return {
        "archivos": [
            {
                "id": 1,
                "nombre_archivo": "cultivos_2024.csv",
                "descripcion": "Datos de cultivos del año 2024",
                "tipo_archivo": "CSV",
                "fecha_actualizacion": "2024-12-01T10:00:00",
                "tamano_bytes": 1024000,
                "tema": "Cultivos",
                "entidad": "Chiapas",
                "municipio": "Tuxtla Gutiérrez"
            },
            {
                "id": 2,
                "nombre_archivo": "territorios_sv.shp",
                "descripcion": "Shapefile de territorios Sembrando Vida",
                "tipo_archivo": "SHP",
                "fecha_actualizacion": "2024-11-15T14:30:00",
                "tamano_bytes": 2048000,
                "tema": "Territorios",
                "entidad": "Veracruz",
                "municipio": "Xalapa"
            }
        ],
        "total": 2,
        "pagina": 1,
        "por_pagina": 20,
        "total_paginas": 1
    }

@app.get("/api/archivos/estadisticas/resumen")
async def obtener_estadisticas():
    """Estadísticas (datos de ejemplo)"""
    return {
        "total_archivos": 150,
        "archivos_por_tipo": {
            "CSV": 45,
            "SHP": 30,
            "XLSX": 25,
            "PDF": 20,
            "ZIP": 30
        },
        "archivos_por_tema": {
            "Cultivos": 50,
            "Territorios": 40,
            "Transformación": 35,
            "Bienestar": 25
        },
        "archivos_por_entidad": {
            "Chiapas": 40,
            "Veracruz": 35,
            "Tabasco": 30,
            "Campeche": 25,
            "Oaxaca": 20
        },
        "tamano_total_mb": 1250.5
    }

@app.get("/api/archivos/filtros/valores")
async def obtener_valores_filtros():
    """Valores para filtros (datos de ejemplo)"""
    return {
        "tipos_archivo": ["CSV", "SHP", "XLSX", "PDF", "ZIP"],
        "temas": ["Cultivos", "Territorios", "Transformación", "Bienestar"],
        "entidades": ["Chiapas", "Veracruz", "Tabasco", "Campeche", "Oaxaca"],
        "municipios": ["Tuxtla Gutiérrez", "Xalapa", "Villahermosa", "Campeche", "Oaxaca de Juárez"],
        "territorios": ["Territorio 1", "Territorio 2", "Territorio 3"],
        "responsables": ["SADER", "BIENESTAR", "CONAFOR"],
        "niveles_validacion": ["Validado", "En revisión", "Preliminar"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
