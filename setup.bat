@echo off
echo 🚀 Iniciando Biblioteca de Datos Web...
echo.

echo 📊 Verificando dependencias...
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python no está instalado o no está en el PATH
    pause
    exit /b 1
)

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado o no está en el PATH
    pause
    exit /b 1
)

echo ✅ Python y Node.js detectados
echo.

REM Instalar dependencias del backend si es necesario
if not exist "backend\venv" (
    echo 📦 Creando entorno virtual de Python...
    cd backend
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
    echo ✅ Entorno virtual creado e dependencias instaladas
    echo.
)

REM Instalar dependencias del frontend si es necesario
if not exist "frontend\node_modules" (
    echo 📦 Instalando dependencias de Node.js...
    cd frontend
    npm install
    cd ..
    echo ✅ Dependencias de frontend instaladas
    echo.
)

echo 🚀 Iniciando servicios...
echo.

REM Crear archivo batch para iniciar backend
echo @echo off > start_backend.bat
echo cd backend >> start_backend.bat
echo call venv\Scripts\activate >> start_backend.bat
echo echo 🔧 Iniciando Backend API en http://localhost:8000 >> start_backend.bat
echo echo 📖 Documentación disponible en http://localhost:8000/docs >> start_backend.bat
echo uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 >> start_backend.bat

REM Crear archivo batch para iniciar frontend
echo @echo off > start_frontend.bat
echo cd frontend >> start_frontend.bat
echo echo 🎨 Iniciando Frontend en http://localhost:8080 >> start_frontend.bat
echo npm run dev >> start_frontend.bat

echo ✅ Archivos de inicio creados
echo.
echo 📋 Para usar la aplicación:
echo.
echo   1. Ejecuta 'start_backend.bat' en una terminal
echo   2. Ejecuta 'start_frontend.bat' en otra terminal
echo   3. Abre http://localhost:8080 en tu navegador
echo.
echo 🌐 URLs útiles:
echo   • Frontend: http://localhost:8080
echo   • Backend API: http://localhost:8000
echo   • API Docs: http://localhost:8000/docs
echo.
echo ¡Listo para usar! 🎉
pause
