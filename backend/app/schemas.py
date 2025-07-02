from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ArchivoCampoBase(BaseModel):
    nombre_campo: str
    tipo_campo: Optional[str]
    descripcion: Optional[str]
    orden: Optional[int]

class ArchivoCampo(ArchivoCampoBase):
    id: int
    archivo_id: int

    class Config:
        orm_mode = True

class CatalogoArchivoBase(BaseModel):
    nombre_archivo: str
    descripcion: Optional[str]
    tipo_archivo: Optional[str]
    tamano_bytes: Optional[int]
    etiquetas: Optional[List[str]]
    ruta_archivo: str
    tema: Optional[str]
    entidad: Optional[str]
    municipio: Optional[str]
    territorio: Optional[str]
    responsable: Optional[str]
    fuente: Optional[str]
    nivel_validacion: Optional[str]
    observaciones: Optional[str]

class CatalogoArchivoCreate(CatalogoArchivoBase):
    pass

class CatalogoArchivo(CatalogoArchivoBase):
    id: int
    fecha_actualizacion: Optional[datetime]
    campos: Optional[List[ArchivoCampo]] = []

    class Config:
        orm_mode = True
    
    class Config:
        from_attributes = True
