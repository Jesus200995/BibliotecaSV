"""
Script para inicializar la base de datos PostgreSQL con datos de prueba
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, Base, SessionLocal
from app.models import CatalogoArchivo, ArchivoCampo
from datetime import datetime

def init_database():
    """Crear tablas y datos de prueba"""
    
    # Crear todas las tablas
    print("Creando tablas...")
    Base.metadata.create_all(bind=engine)
    
    # Crear sesión
    db = SessionLocal()
    
    try:
        # Verificar si ya hay datos
        existing_data = db.query(CatalogoArchivo).first()
        if existing_data:
            print("La base de datos ya contiene datos.")
            return
        
        # Crear archivos de prueba
        archivos_prueba = [
            {
                "nombre_archivo": "censo_poblacion_2023.xlsx",
                "descripcion": "Datos del censo de población y vivienda 2023",
                "tipo_archivo": "Excel",
                "fecha_actualizacion": datetime.now(),
                "tamano_bytes": 2048576,
                "etiquetas": '["censo", "población", "demografía"]',
                "ruta_archivo": "/datos/censos/censo_poblacion_2023.xlsx",
                "tema": "Demografía",
                "entidad": "Instituto Nacional de Estadísticas",
                "municipio": "San Salvador",
                "territorio": "Nacional",
                "responsable": "Juan Pérez",
                "fuente": "INE El Salvador",
                "nivel_validacion": "Validado",
                "observaciones": "Datos oficiales del censo nacional"
            },
            {
                "nombre_archivo": "indicadores_economicos_2024.csv",
                "descripcion": "Indicadores económicos trimestrales",
                "tipo_archivo": "CSV",
                "fecha_actualizacion": datetime.now(),
                "tamano_bytes": 512000,
                "etiquetas": '["economía", "PIB", "inflación"]',
                "ruta_archivo": "/datos/economia/indicadores_economicos_2024.csv",
                "tema": "Economía",
                "entidad": "Banco Central de Reserva",
                "municipio": "San Salvador",
                "territorio": "Nacional",
                "responsable": "María García",
                "fuente": "BCR",
                "nivel_validacion": "En revisión",
                "observaciones": "Datos preliminares del primer trimestre"
            },
            {
                "nombre_archivo": "educacion_municipios.json",
                "descripcion": "Estadísticas educativas por municipio",
                "tipo_archivo": "JSON",
                "fecha_actualizacion": datetime.now(),
                "tamano_bytes": 1024000,
                "etiquetas": '["educación", "municipios", "escolaridad"]',
                "ruta_archivo": "/datos/educacion/educacion_municipios.json",
                "tema": "Educación",
                "entidad": "Ministerio de Educación",
                "municipio": "Todos",
                "territorio": "Municipal",
                "responsable": "Carlos López",
                "fuente": "MINED",
                "nivel_validacion": "Validado",
                "observaciones": "Datos del año escolar 2023-2024"
            }
        ]
        
        print("Insertando archivos de prueba...")
        for archivo_data in archivos_prueba:
            archivo = CatalogoArchivo(**archivo_data)
            db.add(archivo)
        
        db.commit()
        
        # Agregar campos para cada archivo
        archivos = db.query(CatalogoArchivo).all()
        
        for i, archivo in enumerate(archivos):
            if i == 0:  # Censo
                campos = [
                    {"nombre_campo": "id_persona", "tipo_campo": "INTEGER", "descripcion": "Identificador único", "orden": 1},
                    {"nombre_campo": "edad", "tipo_campo": "INTEGER", "descripcion": "Edad de la persona", "orden": 2},
                    {"nombre_campo": "sexo", "tipo_campo": "VARCHAR", "descripcion": "Sexo (M/F)", "orden": 3},
                    {"nombre_campo": "municipio", "tipo_campo": "VARCHAR", "descripcion": "Municipio de residencia", "orden": 4}
                ]
            elif i == 1:  # Economía
                campos = [
                    {"nombre_campo": "trimestre", "tipo_campo": "VARCHAR", "descripcion": "Trimestre del año", "orden": 1},
                    {"nombre_campo": "pib", "tipo_campo": "DECIMAL", "descripcion": "Producto Interno Bruto", "orden": 2},
                    {"nombre_campo": "inflacion", "tipo_campo": "DECIMAL", "descripcion": "Tasa de inflación", "orden": 3}
                ]
            else:  # Educación
                campos = [
                    {"nombre_campo": "municipio", "tipo_campo": "VARCHAR", "descripcion": "Nombre del municipio", "orden": 1},
                    {"nombre_campo": "escuelas", "tipo_campo": "INTEGER", "descripcion": "Número de escuelas", "orden": 2},
                    {"nombre_campo": "estudiantes", "tipo_campo": "INTEGER", "descripcion": "Total de estudiantes", "orden": 3},
                    {"nombre_campo": "docentes", "tipo_campo": "INTEGER", "descripcion": "Total de docentes", "orden": 4}
                ]
            
            for campo_data in campos:
                campo = ArchivoCampo(archivo_id=archivo.id, **campo_data)
                db.add(campo)
        
        db.commit()
        print("¡Base de datos inicializada con éxito!")
        print(f"Se crearon {len(archivos_prueba)} archivos de prueba.")
        
    except Exception as e:
        print(f"Error al inicializar la base de datos: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
