@echo off
REM Script para inicializar y ejecutar el backend en Windows

echo === Iniciando Biblioteca SV - Backend ===

REM 1. Verificar que estamos en el directorio correcto
if not exist "index.js" (
    echo Error: No se encontro index.js
    echo Por favor, ejecuta este script desde el directorio 'backend'
    exit /b 1
)

REM 2. Cargar variables de entorno
echo Cargando configuracion...
if "%NODE_ENV%"=="production" (
    echo Entorno: PRODUCCION
    if exist ".env.production" (
        echo Usando archivo .env.production
    ) else (
        echo Advertencia: No se encontro archivo .env.production
    )
) else (
    echo Entorno: DESARROLLO
    if exist ".env.local" (
        echo Usando archivo .env.local
    ) else if exist ".env" (
        echo Usando archivo .env
    ) else (
        echo Advertencia: No se encontro archivo .env o .env.local
    )
)

REM 3. Verificar dependencias
echo.
echo Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias (esto puede tardar unos minutos)...
    call npm install
    if %errorlevel% neq 0 (
        echo Error al instalar dependencias
        exit /b 1
    )
    echo Dependencias instaladas correctamente
) else (
    echo Dependencias ya instaladas
)

REM 4. Configurar la base de datos
echo.
echo Configurando base de datos...
node setup_db.js
if %errorlevel% neq 0 (
    echo Advertencia: Error al configurar la base de datos
    echo Verifica la conexion y credenciales
) else (
    echo Base de datos configurada correctamente
)

REM 5. Iniciar el servidor
echo.
echo Iniciando servidor...
if "%NODE_ENV%"=="production" (
    echo Iniciando en modo produccion con PM2...
    call pm2 start ecosystem.config.js --env production
    echo Servidor iniciado en modo produccion
    echo Para ver logs: pm2 logs
    echo Para monitorear: pm2 monit
) else (
    echo Iniciando en modo desarrollo...
    echo Servidor iniciado en modo desarrollo
    echo Presiona Ctrl+C para detener
    call npm run dev
)

echo.
echo ¡Listo! El backend esta ejecutandose.
