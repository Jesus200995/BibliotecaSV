from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ArchivoCampoBase(BaseModel):
    nombre_campo: str
    tipo_campo: str
    descripcion: Optional[str] = None
    orden: int

class ArchivoCampoCreate(ArchivoCampoBase):
    archivo_id: int

class ArchivoCampo(ArchivoCampoBase):
    id: int
    archivo_id: int
    
    class Config:
        from_attributes = True

class CatalogoArchivoBase(BaseModel):
    nombre_archivo: str
    descripcion: Optional[str] = None
    tipo_archivo: str
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
    pass

class CatalogoArchivo(CatalogoArchivoBase):
    id: int
    fecha_actualizacion: Optional[datetime] = None
    campos: List[ArchivoCampo] = []
    
    class Config:
        from_attributes = True
