from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
import shutil
from pathlib import Path
from .. import crud, models, schemas
from ..database import get_db

router = APIRouter()

# Configuración para subir archivos
UPLOAD_FOLDER = "uploads"
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_EXTENSIONS = {'.csv', '.xlsx', '.xls', '.shp', '.geojson', '.json', '.xml', '.pdf', '.doc', '.docx'}

# Crear directorio de uploads si no existe
Path(UPLOAD_FOLDER).mkdir(exist_ok=True)

def get_file_extension(filename: str) -> str:
    """Obtener la extensión del archivo"""
    return Path(filename).suffix.lower()

def is_allowed_file(filename: str) -> bool:
    """Verificar si el archivo tiene una extensión permitida"""
    return get_file_extension(filename) in ALLOWED_EXTENSIONS

@router.get("/config")
def get_upload_config():
    """Obtener configuración para subir archivos"""
    return {
        "max_file_size_mb": MAX_FILE_SIZE // (1024 * 1024),
        "allowed_extensions": list(ALLOWED_EXTENSIONS),
        "temas_disponibles": [
            "Cultivos", "Unidades de Producción", "Transformación", 
            "Comercialización", "Territorio", "Población", "Infraestructura"
        ],
        "niveles_validacion": [
            "Borrador", "En Revisión", "Verificado", "Preliminar", "Validado"
        ]
    }

@router.get("/", response_model=List[schemas.CatalogoArchivo])
def read_archivos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_archivos(db, skip=skip, limit=limit)

@router.get("/{archivo_id}", response_model=schemas.CatalogoArchivo)
def read_archivo(archivo_id: int, db: Session = Depends(get_db)):
    db_archivo = crud.get_archivo(db, archivo_id)
    if db_archivo is None:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    return db_archivo

@router.post("/", response_model=schemas.CatalogoArchivo)
def create_archivo(archivo: schemas.CatalogoArchivoCreate, db: Session = Depends(get_db)):
    """Crear un nuevo archivo"""
    return crud.create_archivo(db=db, archivo=archivo)

@router.put("/{archivo_id}", response_model=schemas.CatalogoArchivo)
def update_archivo(
    archivo_id: int, 
    archivo: schemas.CatalogoArchivoUpdate, 
    db: Session = Depends(get_db)
):
    """Actualizar un archivo existente"""
    db_archivo = crud.update_archivo(db, archivo_id, archivo)
    if db_archivo is None:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    return db_archivo

@router.delete("/{archivo_id}")
def delete_archivo(archivo_id: int, db: Session = Depends(get_db)):
    """Eliminar un archivo"""
    db_archivo = crud.delete_archivo(db, archivo_id)
    if db_archivo is None:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    return {"message": "Archivo eliminado correctamente"}

@router.post("/upload", response_model=schemas.CatalogoArchivo)
async def upload_archivo(
    file: UploadFile = File(...),
    nombre_archivo: Optional[str] = Form(None),
    descripcion: Optional[str] = Form(None),
    tema: Optional[str] = Form(None),
    entidad: Optional[str] = Form(None),
    municipio: Optional[str] = Form(None),
    territorio: Optional[str] = Form(None),
    responsable: Optional[str] = Form(None),
    fuente: Optional[str] = Form(None),
    nivel_validacion: str = Form("Borrador"),
    observaciones: Optional[str] = Form(None),
    etiquetas: Optional[str] = Form(None),  # JSON string de etiquetas
    db: Session = Depends(get_db)
):
    """Subir un nuevo archivo"""
    
    # Validar el archivo
    if not file.filename:
        raise HTTPException(status_code=400, detail="No se seleccionó ningún archivo")
    
    if not is_allowed_file(file.filename):
        raise HTTPException(
            status_code=400, 
            detail=f"Tipo de archivo no permitido. Extensiones permitidas: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Validar tamaño del archivo
    if file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400, 
            detail=f"El archivo es demasiado grande. Tamaño máximo: {MAX_FILE_SIZE // (1024 * 1024)}MB"
        )
    
    # Generar nombre único para el archivo
    file_extension = get_file_extension(file.filename)
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = Path(UPLOAD_FOLDER) / unique_filename
    
    try:
        # Guardar el archivo
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Obtener información del archivo
        file_size = file_path.stat().st_size
        
        # Procesar etiquetas
        etiquetas_list = None
        if etiquetas:
            try:
                import json
                etiquetas_list = json.loads(etiquetas)
            except json.JSONDecodeError:
                etiquetas_list = [tag.strip() for tag in etiquetas.split(',') if tag.strip()]
        
        # Crear registro en la base de datos
        archivo_data = schemas.CatalogoArchivoCreate(
            nombre_archivo=nombre_archivo or file.filename,
            descripcion=descripcion,
            tipo_archivo=file_extension.lstrip('.').upper(),
            tamano_bytes=file_size,
            etiquetas=etiquetas_list,
            ruta_archivo=str(file_path),
            tema=tema,
            entidad=entidad,
            municipio=municipio,
            territorio=territorio,
            responsable=responsable,
            fuente=fuente,
            nivel_validacion=nivel_validacion,
            observaciones=observaciones
        )
        
        # Guardar en la base de datos
        db_archivo = crud.create_archivo(db=db, archivo=archivo_data)
        
        return db_archivo
        
    except Exception as e:
        # Si ocurre un error, eliminar el archivo subido
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Error al subir el archivo: {str(e)}")
