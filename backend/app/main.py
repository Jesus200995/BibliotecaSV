from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import archivos, campos

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BibliotecaSV API",
    description="API para gestión de biblioteca digital",
    version="1.0.0"
)

# Configurar CORS para permitir requests desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Puerto del frontend Vue
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar las rutas
app.include_router(archivos.router, prefix="/api/archivos", tags=["archivos"])
app.include_router(campos.router, prefix="/api/campos", tags=["campos"])

@app.get("/")
async def root():
    return {"message": "BibliotecaSV API está funcionando"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
