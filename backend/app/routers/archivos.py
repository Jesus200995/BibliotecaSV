from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.CatalogoArchivo])
def listar_archivos(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return crud.get_archivos(db, skip=skip, limit=limit)

@router.get("/{archivo_id}", response_model=schemas.CatalogoArchivo)
def obtener_archivo(archivo_id: int, db: Session = Depends(get_db)):
    db_archivo = crud.get_archivo(db, archivo_id)
    if not db_archivo:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    db_archivo.campos = crud.get_campos_by_archivo(db, archivo_id)
    return db_archivo

@router.post("/", response_model=schemas.CatalogoArchivo)
def create_archivo(archivo: schemas.CatalogoArchivoCreate, db: Session = Depends(get_db)):
    return crud.create_archivo(db=db, archivo=archivo)

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
