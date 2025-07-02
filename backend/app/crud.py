from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional

# CRUD para CatalogoArchivo
def get_archivo(db: Session, archivo_id: int):
    return db.query(models.CatalogoArchivo).filter(models.CatalogoArchivo.id == archivo_id).first()

def get_archivos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CatalogoArchivo).offset(skip).limit(limit).all()

def create_archivo(db: Session, archivo: schemas.CatalogoArchivoCreate):
    db_archivo = models.CatalogoArchivo(**archivo.model_dump())
    db.add(db_archivo)
    db.commit()
    db.refresh(db_archivo)
    return db_archivo

def update_archivo(db: Session, archivo_id: int, archivo: schemas.CatalogoArchivoCreate):
    db_archivo = db.query(models.CatalogoArchivo).filter(models.CatalogoArchivo.id == archivo_id).first()
    if db_archivo:
        for key, value in archivo.model_dump().items():
            setattr(db_archivo, key, value)
        db.commit()
        db.refresh(db_archivo)
    return db_archivo

def delete_archivo(db: Session, archivo_id: int):
    db_archivo = db.query(models.CatalogoArchivo).filter(models.CatalogoArchivo.id == archivo_id).first()
    if db_archivo:
        db.delete(db_archivo)
        db.commit()
    return db_archivo

# CRUD para ArchivoCampo
def get_campo(db: Session, campo_id: int):
    return db.query(models.ArchivoCampo).filter(models.ArchivoCampo.id == campo_id).first()

def get_campos_by_archivo(db: Session, archivo_id: int):
    return db.query(models.ArchivoCampo).filter(models.ArchivoCampo.archivo_id == archivo_id).all()

def create_campo(db: Session, campo: schemas.ArchivoCampoCreate):
    db_campo = models.ArchivoCampo(**campo.model_dump())
    db.add(db_campo)
    db.commit()
    db.refresh(db_campo)
    return db_campo

def update_campo(db: Session, campo_id: int, campo: schemas.ArchivoCampoCreate):
    db_campo = db.query(models.ArchivoCampo).filter(models.ArchivoCampo.id == campo_id).first()
    if db_campo:
        for key, value in campo.model_dump().items():
            setattr(db_campo, key, value)
        db.commit()
        db.refresh(db_campo)
    return db_campo

def delete_campo(db: Session, campo_id: int):
    db_campo = db.query(models.ArchivoCampo).filter(models.ArchivoCampo.id == campo_id).first()
    if db_campo:
        db.delete(db_campo)
        db.commit()
    return db_campo
