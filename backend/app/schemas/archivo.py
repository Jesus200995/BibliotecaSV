from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

class ArchivoCampoBase(BaseModel):
    nombre_campo: str
    tipo_campo: Optional[str] = None
    descripcion: Optional[str] = None
    orden: Optional[int] = None

class ArchivoCampoCreate(ArchivoCampoBase):
    pass

class ArchivoCampo(ArchivoCampoBase):
    id: int
    archivo_id: int

    class Config:
        orm_mode = True

class CatalogoArchivoBase(BaseModel):
    nombre_archivo: str
    descripcion: Optional[str] = None
    tipo_archivo: Optional[str] = None
    tamano_bytes: Optional[int] = None
    etiquetas: Optional[List[str]] = None
    ruta_archivo: str
    tema: Optional[str] = None
    entidad: Optional[str] = None
    municipio: Optional[str] = None
    territorio: Optional[str] = None
    responsable: Optional[str] = None
    fuente: Optional[str] = None
    nivel_validacion: Optional[str] = None
    observaciones: Optional[str] = None

class CatalogoArchivoCreate(CatalogoArchivoBase):
    campos: Optional[List[ArchivoCampoCreate]] = None

class CatalogoArchivo(CatalogoArchivoBase):
    id: int
    fecha_actualizacion: datetime
    campos: List[ArchivoCampo] = []

    class Config:
        orm_mode = True
