from typing import List, Optional
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
import json

class ArchivoCampoBase(BaseModel):
    nombre_campo: str
    tipo_campo: Optional[str] = None
    descripcion: Optional[str] = None
    orden: Optional[int] = None

class ArchivoCampoCreate(ArchivoCampoBase):
    pass

class ArchivoCampoUpdate(ArchivoCampoBase):
    pass

class ArchivoCampo(ArchivoCampoBase):
    id: int

    class Config:
        from_attributes = True

class CatalogoArchivoBase(BaseModel):
    nombre_archivo: str
    descripcion: Optional[str] = None
    tipo_archivo: Optional[str] = None
    fecha_actualizacion: Optional[datetime] = None
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

class CatalogoArchivoUpdate(CatalogoArchivoBase):
    pass

class CatalogoArchivo(CatalogoArchivoBase):
    id: int
    campos: Optional[List[ArchivoCampo]] = []

    @field_validator('etiquetas', mode='before')
    @classmethod
    def parse_etiquetas(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return None
        return v

    class Config:
        from_attributes = True

# Esquemas para respuestas
class ArchivoList(BaseModel):
    archivos: List[CatalogoArchivo]
    total: int
    pagina: int
    por_pagina: int
