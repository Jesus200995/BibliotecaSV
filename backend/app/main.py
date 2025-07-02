from fastapi import FastAPI
from .database import engine
from .models import Base
from .routers import archivos, campos

app = FastAPI(title="Biblioteca SV API", version="1.0.0")

# Crear tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Incluir routers con prefijos
app.include_router(archivos.router, prefix="/archivos", tags=["archivos"])
app.include_router(campos.router, prefix="/campos", tags=["campos"])

@app.get("/")
def read_root():
    return {"message": "Biblioteca SV API funcionando correctamente"}
