import os
import hashlib
import json
from datetime import datetime
from typing import Optional, List

def generar_nombre_archivo(filename: str) -> str:
    """Genera un nombre único para el archivo basado en timestamp y hash"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_hash = hashlib.md5(filename.encode()).hexdigest()[:8]
    name, ext = os.path.splitext(filename)
    return f"{timestamp}_{file_hash}{ext}"

def validar_tipo_archivo(filename: str, tipos_permitidos: list = None) -> bool:
    """Valida si el tipo de archivo está permitido"""
    if tipos_permitidos is None:
        tipos_permitidos = ['.pdf', '.epub', '.txt', '.doc', '.docx']
    
    _, ext = os.path.splitext(filename.lower())
    return ext in tipos_permitidos

def calcular_tamaño_mb(size_bytes: int) -> float:
    """Convierte bytes a megabytes"""
    return round(size_bytes / (1024 * 1024), 2)

def limpiar_texto(texto: str) -> str:
    """Limpia y normaliza texto para búsquedas"""
    if not texto:
        return ""
    return texto.strip().lower()

def validar_campo_personalizado(nombre_campo: str, valor_campo: str, tipo_campo: str) -> bool:
    """Valida un campo personalizado según su tipo"""
    if not nombre_campo or not nombre_campo.strip():
        return False
    
    if tipo_campo == "numero":
        try:
            float(valor_campo)
            return True
        except (ValueError, TypeError):
            return False
    
    elif tipo_campo == "fecha":
        try:
            datetime.strptime(valor_campo, "%Y-%m-%d")
            return True
        except (ValueError, TypeError):
            return False
    
    # Para tipo "texto" o cualquier otro, siempre es válido
    return True

def etiquetas_a_json(etiquetas: Optional[List[str]]) -> Optional[str]:
    """Convierte una lista de etiquetas a string JSON"""
    if not etiquetas:
        return None
    return json.dumps(etiquetas)

def etiquetas_de_json(etiquetas_json: Optional[str]) -> Optional[List[str]]:
    """Convierte un string JSON a lista de etiquetas"""
    if not etiquetas_json:
        return None
    try:
        return json.loads(etiquetas_json)
    except (json.JSONDecodeError, TypeError):
        return None
