@echo off
cd backend
call venv\Scripts\activate
echo 🔧 Iniciando Backend API en http://localhost:8000
echo 📖 Documentación disponible en http://localhost:8000/docs
echo.
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
