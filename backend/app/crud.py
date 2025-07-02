from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from . import models, schemas, utils

# CRUD básico para CatalogoArchivo
def get_archivos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CatalogoArchivo).offset(skip).limit(limit).all()

def get_archivo(db: Session, archivo_id: int):
    return db.query(models.CatalogoArchivo).filter(models.CatalogoArchivo.id == archivo_id).first()

def get_campos_por_archivo(db: Session, archivo_id: int):
    return db.query(models.ArchivoCampo).filter(models.ArchivoCampo.archivo_id == archivo_id).order_by(models.ArchivoCampo.orden).all()

# CRUD extendido con búsqueda
def get_archivos_with_search(db: Session, skip: int = 0, limit: int = 100, search: Optional[str] = None):
    query = db.query(models.CatalogoArchivo)
    
    if search:
        query = query.filter(
            models.CatalogoArchivo.nombre_archivo.ilike(f"%{search}%") |
            models.CatalogoArchivo.descripcion.ilike(f"%{search}%") |
            models.CatalogoArchivo.tema.ilike(f"%{search}%") |
            models.CatalogoArchivo.entidad.ilike(f"%{search}%")
        )
    
    return query.offset(skip).limit(limit).all()

def get_archivos_count(db: Session, search: Optional[str] = None):
    query = db.query(func.count(models.CatalogoArchivo.id))
    
    if search:
        query = query.filter(
            models.CatalogoArchivo.nombre_archivo.ilike(f"%{search}%") |
            models.CatalogoArchivo.descripcion.ilike(f"%{search}%") |
            models.CatalogoArchivo.tema.ilike(f"%{search}%") |
            models.CatalogoArchivo.entidad.ilike(f"%{search}%")
        )
    
    return query.scalar()

def create_archivo(db: Session, archivo: schemas.CatalogoArchivoCreate):
    # Para PostgreSQL, las etiquetas se manejan directamente como array
    db_archivo = models.CatalogoArchivo(
        nombre_archivo=archivo.nombre_archivo,
        descripcion=archivo.descripcion,
        tipo_archivo=archivo.tipo_archivo,
        fecha_actualizacion=archivo.fecha_actualizacion,
        tamano_bytes=archivo.tamano_bytes,
        etiquetas=archivo.etiquetas,  # Directamente como array en PostgreSQL
        ruta_archivo=archivo.ruta_archivo,
        tema=archivo.tema,
        entidad=archivo.entidad,
        municipio=archivo.municipio,
        territorio=archivo.territorio,
        responsable=archivo.responsable,
        fuente=archivo.fuente,
        nivel_validacion=archivo.nivel_validacion,
        observaciones=archivo.observaciones
    )
    db.add(db_archivo)
    db.commit()
    db.refresh(db_archivo)
    return db_archivo

def update_archivo(db: Session, archivo_id: int, archivo: schemas.CatalogoArchivoUpdate):
    db_archivo = get_archivo(db, archivo_id)
    if not db_archivo:
        return None
    
    update_data = archivo.dict(exclude_unset=True)
    
    # En PostgreSQL, las etiquetas se manejan directamente como array
    for field, value in update_data.items():
        setattr(db_archivo, field, value)
    
    db.commit()
    db.refresh(db_archivo)
    return db_archivo

def delete_archivo(db: Session, archivo_id: int):
    db_archivo = get_archivo(db, archivo_id)
    if not db_archivo:
        return None
    
    db.delete(db_archivo)
    db.commit()
    return db_archivo

# CRUD para ArchivoCampo
def get_campo_archivo(db: Session, campo_id: int):
    return db.query(models.ArchivoCampo).filter(models.ArchivoCampo.id == campo_id).first()

def get_campos_archivo(db: Session, archivo_id: int):
    return db.query(models.ArchivoCampo).filter(models.ArchivoCampo.archivo_id == archivo_id).all()

def create_campo_archivo(db: Session, campo: schemas.ArchivoCampoCreate, archivo_id: int):
    db_campo = models.ArchivoCampo(
        archivo_id=archivo_id,
        nombre_campo=campo.nombre_campo,
        tipo_campo=campo.tipo_campo,
        descripcion=campo.descripcion,
        orden=campo.orden
    )
    db.add(db_campo)
    db.commit()
    db.refresh(db_campo)
    return db_campo

def update_campo_archivo(db: Session, campo_id: int, campo: schemas.ArchivoCampoCreate):
    db_campo = get_campo_archivo(db, campo_id)
    if not db_campo:
        return None
    
    update_data = campo.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_campo, field, value)
    
    db.commit()
    db.refresh(db_campo)
    return db_campo

def delete_campo_archivo(db: Session, campo_id: int):
    db_campo = get_campo_archivo(db, campo_id)
    if not db_campo:
        return None
    
    db.delete(db_campo)
    db.commit()
    return db_campo
