from fastapi import APIRouter

from app.api.v1.endpoints import archivos

api_router = APIRouter()
api_router.include_router(archivos.router, prefix="/archivos", tags=["archivos"])
