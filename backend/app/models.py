from sqlalchemy import Column, Integer, String, Text, BigInteger, TIMESTAMP, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from .database import Base

class CatalogoArchivo(Base):
    __tablename__ = "catalogo_archivos"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre_archivo = Column(String(255), nullable=False)
    descripcion = Column(Text)
    tipo_archivo = Column(String(20))
    fecha_actualizacion = Column(TIMESTAMP)
    tamano_bytes = Column(BigInteger)
    etiquetas = Column(ARRAY(Text))
    ruta_archivo = Column(Text, nullable=False)
    tema = Column(String(100))
    entidad = Column(String(100))
    municipio = Column(String(100))
    territorio = Column(String(100))
    responsable = Column(String(100))
    fuente = Column(String(255))
    nivel_validacion = Column(String(50))
    observaciones = Column(Text)
    
    # Relación con campos
    campos = relationship("ArchivoCampo", back_populates="archivo")

class ArchivoCampo(Base):
    __tablename__ = "archivo_campos"
    
    id = Column(Integer, primary_key=True, index=True)
    archivo_id = Column(Integer, ForeignKey("catalogo_archivos.id", ondelete="CASCADE"))
    nombre_campo = Column(String(100), nullable=False)
    tipo_campo = Column(String(50))
    descripcion = Column(Text)
    orden = Column(Integer)
    
    # Relación con archivo
    archivo = relationship("CatalogoArchivo", back_populates="campos")
