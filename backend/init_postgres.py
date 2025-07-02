"""
Script para crear las tablas en PostgreSQL
"""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración de conexión
POSTGRES_HOST = os.getenv('POSTGRES_HOST')
POSTGRES_PORT = os.getenv('POSTGRES_PORT')
POSTGRES_DB = os.getenv('POSTGRES_DB')
POSTGRES_USER = os.getenv('POSTGRES_USER')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')

def create_tables():
    """Crear las tablas en PostgreSQL"""
    
    # SQL para crear las tablas
    create_tables_sql = """
    -- Crear tabla catalogo_archivos
    CREATE TABLE IF NOT EXISTS catalogo_archivos (
        id SERIAL PRIMARY KEY,
        nombre_archivo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        tipo_archivo VARCHAR(20),           -- CSV, SHP, XLSX, etc.
        fecha_actualizacion TIMESTAMP DEFAULT NOW(),
        tamano_bytes BIGINT,
        etiquetas TEXT[],                   -- Array de texto para etiquetas
        ruta_archivo TEXT NOT NULL,         -- Ruta o URL del archivo en el servidor
        tema VARCHAR(100),                  -- Cultivos, unidades, etc.
        entidad VARCHAR(100),               -- Opcional: para filtrar por entidad
        municipio VARCHAR(100),             -- Opcional: para filtrar por municipio
        territorio VARCHAR(100),            -- Opcional: para filtrar por territorio
        responsable VARCHAR(100),           -- Quién subió o validó
        fuente VARCHAR(255),                -- Fuente del dato
        nivel_validacion VARCHAR(50),       -- Borrador, verificado, preliminar
        observaciones TEXT
    );

    -- Crear tabla archivo_campos
    CREATE TABLE IF NOT EXISTS archivo_campos (
        id SERIAL PRIMARY KEY,
        archivo_id INTEGER REFERENCES catalogo_archivos(id) ON DELETE CASCADE,
        nombre_campo VARCHAR(100) NOT NULL,
        tipo_campo VARCHAR(50),        -- Ej: texto, número, fecha, geometry, etc.
        descripcion TEXT,
        orden INTEGER                  -- Para mostrar en el orden correcto
    );

    -- Crear índices para mejor rendimiento
    CREATE INDEX IF NOT EXISTS idx_catalogo_archivos_nombre ON catalogo_archivos(nombre_archivo);
    CREATE INDEX IF NOT EXISTS idx_catalogo_archivos_tema ON catalogo_archivos(tema);
    CREATE INDEX IF NOT EXISTS idx_catalogo_archivos_entidad ON catalogo_archivos(entidad);
    CREATE INDEX IF NOT EXISTS idx_catalogo_archivos_municipio ON catalogo_archivos(municipio);
    CREATE INDEX IF NOT EXISTS idx_catalogo_archivos_fecha ON catalogo_archivos(fecha_actualizacion);
    CREATE INDEX IF NOT EXISTS idx_archivo_campos_archivo_id ON archivo_campos(archivo_id);
    CREATE INDEX IF NOT EXISTS idx_archivo_campos_orden ON archivo_campos(archivo_id, orden);
    """
    
    try:
        # Conectar a PostgreSQL
        print(f"Conectando a PostgreSQL en {POSTGRES_HOST}:{POSTGRES_PORT}")
        connection = psycopg2.connect(
            host=POSTGRES_HOST,
            port=POSTGRES_PORT,
            database=POSTGRES_DB,
            user=POSTGRES_USER,
            password=POSTGRES_PASSWORD
        )
        
        connection.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = connection.cursor()
        
        print("Creando tablas...")
        cursor.execute(create_tables_sql)
        
        print("✅ Tablas creadas exitosamente!")
        
        # Verificar que las tablas se crearon
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('catalogo_archivos', 'archivo_campos')
            ORDER BY table_name;
        """)
        
        tables = cursor.fetchall()
        print(f"Tablas encontradas: {[table[0] for table in tables]}")
        
        # Insertar datos de ejemplo
        print("Insertando datos de ejemplo...")
        insert_sample_data(cursor)
        
        cursor.close()
        connection.close()
        
        print("🎉 Base de datos inicializada correctamente!")
        
    except Exception as e:
        print(f"❌ Error al crear las tablas: {e}")
        return False
    
    return True

def insert_sample_data(cursor):
    """Insertar algunos datos de ejemplo"""
    
    sample_data_sql = """
    -- Insertar archivo de ejemplo
    INSERT INTO catalogo_archivos (
        nombre_archivo, descripcion, tipo_archivo, tamano_bytes, 
        etiquetas, ruta_archivo, tema, entidad, municipio, 
        responsable, fuente, nivel_validacion, observaciones
    ) VALUES (
        'Censo_Agricola_2024.xlsx',
        'Datos del censo agrícola nacional correspondiente al año 2024',
        'XLSX',
        2048576,
        ARRAY['censo', 'agricultura', '2024', 'nacional'],
        '/uploads/ejemplo_censo.xlsx',
        'Cultivos',
        'Ministerio de Agricultura',
        'San Salvador',
        'jesus',
        'CENAGRO 2024',
        'Verificado',
        'Archivo de ejemplo para pruebas del sistema'
    ) ON CONFLICT DO NOTHING;
    
    -- Insertar campos del archivo de ejemplo
    INSERT INTO archivo_campos (archivo_id, nombre_campo, tipo_campo, descripcion, orden) 
    SELECT 
        id,
        'departamento',
        'texto',
        'Nombre del departamento',
        1
    FROM catalogo_archivos 
    WHERE nombre_archivo = 'Censo_Agricola_2024.xlsx'
    ON CONFLICT DO NOTHING;
    
    INSERT INTO archivo_campos (archivo_id, nombre_campo, tipo_campo, descripcion, orden) 
    SELECT 
        id,
        'municipio',
        'texto',
        'Nombre del municipio',
        2
    FROM catalogo_archivos 
    WHERE nombre_archivo = 'Censo_Agricola_2024.xlsx'
    ON CONFLICT DO NOTHING;
    
    INSERT INTO archivo_campos (archivo_id, nombre_campo, tipo_campo, descripcion, orden) 
    SELECT 
        id,
        'superficie_total',
        'numero',
        'Superficie total en hectáreas',
        3
    FROM catalogo_archivos 
    WHERE nombre_archivo = 'Censo_Agricola_2024.xlsx'
    ON CONFLICT DO NOTHING;
    """
    
    try:
        cursor.execute(sample_data_sql)
        print("✅ Datos de ejemplo insertados!")
    except Exception as e:
        print(f"⚠️ Error al insertar datos de ejemplo: {e}")

if __name__ == "__main__":
    print("🚀 Inicializando base de datos PostgreSQL para BibliotecaSV...")
    create_tables()
