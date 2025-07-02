from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas
from ..database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.CatalogoArchivo)
def create_archivo(archivo: schemas.CatalogoArchivoCreate, db: Session = Depends(get_db)):
    return crud.create_archivo(db=db, archivo=archivo)

@router.get("/", response_model=List[schemas.CatalogoArchivo])
def read_archivos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    archivos = crud.get_archivos(db, skip=skip, limit=limit)
    return archivos

@router.get("/{archivo_id}", response_model=schemas.CatalogoArchivo)
def read_archivo(archivo_id: int, db: Session = Depends(get_db)):
    db_archivo = crud.get_archivo(db, archivo_id=archivo_id)
    if db_archivo is None:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    return db_archivo

@router.put("/{archivo_id}", response_model=schemas.CatalogoArchivo)
def update_archivo(archivo_id: int, archivo: schemas.CatalogoArchivoCreate, db: Session = Depends(get_db)):
    db_archivo = crud.update_archivo(db, archivo_id=archivo_id, archivo=archivo)
    if db_archivo is None:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    return db_archivo

@router.delete("/{archivo_id}")
def delete_archivo(archivo_id: int, db: Session = Depends(get_db)):
    db_archivo = crud.delete_archivo(db, archivo_id=archivo_id)
    if db_archivo is None:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    return {"message": "Archivo eliminado correctamente"}
    if db_archivo is None:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    return {"message": "Archivo eliminado correctamente"}
