from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas
from ..database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.ArchivoCampo)
def create_campo(campo: schemas.ArchivoCampoCreate, db: Session = Depends(get_db)):
    return crud.create_campo(db=db, campo=campo)

@router.get("/archivo/{archivo_id}", response_model=List[schemas.ArchivoCampo])
def read_campos_by_archivo(archivo_id: int, db: Session = Depends(get_db)):
    campos = crud.get_campos_by_archivo(db, archivo_id=archivo_id)
    return campos

@router.get("/{campo_id}", response_model=schemas.ArchivoCampo)
def read_campo(campo_id: int, db: Session = Depends(get_db)):
    db_campo = crud.get_campo(db, campo_id=campo_id)
    if db_campo is None:
        raise HTTPException(status_code=404, detail="Campo no encontrado")
    return db_campo

@router.put("/{campo_id}", response_model=schemas.ArchivoCampo)
def update_campo(campo_id: int, campo: schemas.ArchivoCampoCreate, db: Session = Depends(get_db)):
    db_campo = crud.update_campo(db, campo_id=campo_id, campo=campo)
    if db_campo is None:
        raise HTTPException(status_code=404, detail="Campo no encontrado")
    return db_campo

@router.delete("/{campo_id}")
def delete_campo(campo_id: int, db: Session = Depends(get_db)):
    db_campo = crud.delete_campo(db, campo_id=campo_id)
    if db_campo is None:
        raise HTTPException(status_code=404, detail="Campo no encontrado")
    return {"message": "Campo eliminado correctamente"}
    if db_campo is None:
        raise HTTPException(status_code=404, detail="Campo no encontrado")
    return {"message": "Campo eliminado correctamente"}
