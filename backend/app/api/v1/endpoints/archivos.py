from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db import models
from app.schemas import archivo

router = APIRouter()

@router.get("/", response_model=List[archivo.CatalogoArchivo])
def listar_archivos(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    tema: Optional[str] = None,
    tipo_archivo: Optional[str] = None,
    entidad: Optional[str] = None,
    territorio: Optional[str] = None
):
    """
    Obtener lista de archivos con filtros opcionales
    """
    query = db.query(models.CatalogoArchivo)
    
    if tema:
        query = query.filter(models.CatalogoArchivo.tema == tema)
    if tipo_archivo:
        query = query.filter(models.CatalogoArchivo.tipo_archivo == tipo_archivo)
    if entidad:
        query = query.filter(models.CatalogoArchivo.entidad == entidad)
    if territorio:
        query = query.filter(models.CatalogoArchivo.territorio == territorio)
        
    return query.offset(skip).limit(limit).all()

@router.get("/{archivo_id}", response_model=archivo.CatalogoArchivo)
def obtener_archivo(archivo_id: int, db: Session = Depends(get_db)):
    """
    Obtener un archivo por ID
    """
    db_archivo = db.query(models.CatalogoArchivo).filter(models.CatalogoArchivo.id == archivo_id).first()
    if db_archivo is None:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    return db_archivo

@router.get("/buscar/", response_model=List[archivo.CatalogoArchivo])
def buscar_archivos(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    """
    Búsqueda de archivos por término
    """
    return db.query(models.CatalogoArchivo).filter(
        models.CatalogoArchivo.nombre_archivo.ilike(f"%{q}%")
    ).all()
