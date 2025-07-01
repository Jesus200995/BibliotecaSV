from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db

router = APIRouter()

@router.get("/por_archivo/{archivo_id}", response_model=List[schemas.ArchivoCampo])
def read_campos_por_archivo(archivo_id: int, db: Session = Depends(get_db)):
    campos = crud.get_campos_por_archivo(db, archivo_id)
    if not campos:
        raise HTTPException(status_code=404, detail="No hay campos para este archivo")
    return campos

@router.get("/{campo_id}", response_model=schemas.ArchivoCampo)
def read_campo(campo_id: int, db: Session = Depends(get_db)):
    """Obtener un campo específico por ID"""
    db_campo = crud.get_campo_archivo(db, campo_id=campo_id)
    if db_campo is None:
        raise HTTPException(status_code=404, detail="Campo no encontrado")
    return db_campo

@router.post("/archivo/{archivo_id}", response_model=schemas.ArchivoCampo)
def create_campo_archivo(
    archivo_id: int, 
    campo: schemas.ArchivoCampoCreate, 
    db: Session = Depends(get_db)
):
    """Crear un nuevo campo para un archivo"""
    # Verificar que el archivo existe
    archivo = crud.get_archivo(db, archivo_id)
    if archivo is None:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    
    return crud.create_campo_archivo(db=db, campo=campo, archivo_id=archivo_id)

@router.put("/{campo_id}", response_model=schemas.ArchivoCampo)
def update_campo(
    campo_id: int, 
    campo: schemas.ArchivoCampoUpdate, 
    db: Session = Depends(get_db)
):
    """Actualizar un campo existente"""
    db_campo = crud.update_campo_archivo(db, campo_id, campo)
    if db_campo is None:
        raise HTTPException(status_code=404, detail="Campo no encontrado")
    return db_campo

@router.delete("/{campo_id}")
def delete_campo(campo_id: int, db: Session = Depends(get_db)):
    """Eliminar un campo"""
    db_campo = crud.delete_campo_archivo(db, campo_id)
    if db_campo is None:
        raise HTTPException(status_code=404, detail="Campo no encontrado")
    return {"message": "Campo eliminado correctamente"}
