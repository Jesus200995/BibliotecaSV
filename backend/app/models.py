from sqlalchemy import Column, Integer, String, Text, BigInteger, TIMESTAMP, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from .database import Base
from sqlalchemy.sql import func
import json
from typing import List, Optional

class CatalogoArchivo(Base):
    __tablename__ = "catalogo_archivos"

    id = Column(Integer, primary_key=True, index=True)
    nombre_archivo = Column(String(255), nullable=False)
    descripcion = Column(Text)
    tipo_archivo = Column(String(20))  # CSV, SHP, XLSX, etc.
    fecha_actualizacion = Column(TIMESTAMP, default=func.now())
    tamano_bytes = Column(BigInteger)
    etiquetas = Column(ARRAY(Text))  # Array de texto en PostgreSQL
    ruta_archivo = Column(Text, nullable=False)  # Ruta o URL del archivo en el servidor
    tema = Column(String(100))  # Cultivos, unidades, etc.
    entidad = Column(String(100))  # Opcional: para filtrar por entidad
    municipio = Column(String(100))  # Opcional: para filtrar por municipio
    territorio = Column(String(100))  # Opcional: para filtrar por territorio
    responsable = Column(String(100))  # Quién subió o validó
    fuente = Column(String(255))  # Fuente del dato
    nivel_validacion = Column(String(50))  # Borrador, verificado, preliminar
    observaciones = Column(Text)

    campos = relationship("ArchivoCampo", back_populates="archivo", cascade="all, delete-orphan")

class ArchivoCampo(Base):
    __tablename__ = "archivo_campos"

    id = Column(Integer, primary_key=True, index=True)
    archivo_id = Column(Integer, ForeignKey("catalogo_archivos.id", ondelete="CASCADE"))
    nombre_campo = Column(String(100), nullable=False)
    tipo_campo = Column(String(50))  # Ej: texto, número, fecha, geometry, etc.
    descripcion = Column(Text)
    orden = Column(Integer)  # Para mostrar en el orden correcto

    archivo = relationship("CatalogoArchivo", back_populates="campos")
