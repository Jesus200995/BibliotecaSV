#!/bin/bash

# 🚀 Script de despliegue automático para BibliotecaSV
# Ejecutar en el VPS como: bash deploy.sh

set -e  # Salir si hay errores

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logs con colores
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Configuración
BACKEND_DIR="/var/www/biblioteca-api"
FRONTEND_DIR="/var/www/biblioteca-frontend"
BACKUP_DIR="/var/backups/biblioteca"
PM2_APP_NAME="biblioteca-backend"

log "🚀 Iniciando despliegue de BibliotecaSV"
log "================================================"

# Verificar que estamos ejecutando como el usuario correcto
if [ "$EUID" -eq 0 ]; then
    error "No ejecutar este script como root"
    exit 1
fi

# Crear directorio de backup si no existe
mkdir -p "$BACKUP_DIR/$(date +%Y%m%d)"

# ================================
# BACKEND DEPLOYMENT
# ================================

log "📦 1. Desplegando Backend"

if [ ! -d "$BACKEND_DIR" ]; then
    error "Directorio del backend no encontrado: $BACKEND_DIR"
    exit 1
fi

cd "$BACKEND_DIR"

# Backup de la configuración actual
info "Creando backup de configuración..."
cp -r backend "$BACKUP_DIR/$(date +%Y%m%d)/backend-backup-$(date +%H%M%S)" || true

# Pull latest changes
log "Descargando últimos cambios..."
git fetch origin
git reset --hard origin/main
git pull origin main

cd backend

# Instalar/actualizar dependencias
log "Instalando dependencias..."
npm install --production

# Verificar configuración
log "Verificando configuración..."
if [ -f "verify-config.js" ]; then
    node verify-config.js || {
        error "Error en la configuración del backend"
        exit 1
    }
else
    warning "Script de verificación no encontrado"
fi

# Crear directorio de logs
mkdir -p logs

# Gestionar proceso PM2
log "Gestionando proceso PM2..."

# Verificar si PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    error "PM2 no está instalado. Instalar con: npm install -g pm2"
    exit 1
fi

# Detener proceso anterior si existe
if pm2 list | grep -q "$PM2_APP_NAME"; then
    info "Deteniendo proceso existente..."
    pm2 stop "$PM2_APP_NAME" || true
    pm2 delete "$PM2_APP_NAME" || true
fi

# Iniciar nuevo proceso
log "Iniciando proceso de backend..."
if [ -f "ecosystem.config.js" ]; then
    pm2 start ecosystem.config.js --env production
else
    pm2 start index.js --name "$PM2_APP_NAME" -- --env=production
fi

# Verificar que el proceso está corriendo
sleep 3
if ! pm2 list | grep -q "$PM2_APP_NAME.*online"; then
    error "Backend no se inició correctamente"
    pm2 logs "$PM2_APP_NAME" --lines 20
    exit 1
fi

log "✅ Backend desplegado correctamente"

# ================================
# FRONTEND DEPLOYMENT  
# ================================

log "🌐 2. Desplegando Frontend"

if [ ! -d "$FRONTEND_DIR" ]; then
    error "Directorio del frontend no encontrado: $FRONTEND_DIR"
    exit 1
fi

cd "$FRONTEND_DIR"

# Backup del build anterior
if [ -d "dist" ]; then
    info "Creando backup del build anterior..."
    mv dist "$BACKUP_DIR/$(date +%Y%m%d)/frontend-dist-backup-$(date +%H%M%S)" || true
fi

# Pull latest changes
log "Descargando últimos cambios del frontend..."
git fetch origin
git reset --hard origin/main  
git pull origin main

# Instalar dependencias
log "Instalando dependencias del frontend..."
npm install

# Verificar configuración de producción
log "Verificando configuración de producción..."
if [ ! -f ".env.production" ]; then
    error "Archivo .env.production no encontrado"
    exit 1
fi

info "Configuración de producción:"
cat .env.production

# Build de producción
log "Construyendo aplicación para producción..."
npm run build

if [ ! -d "dist" ]; then
    error "Build de producción falló - directorio 'dist' no encontrado"
    exit 1
fi

log "✅ Frontend construido correctamente"

# ================================
# VERIFICACIÓN FINAL
# ================================

log "🔍 3. Verificando despliegue"

# Verificar backend
info "Verificando backend..."
sleep 5

# Health check
BACKEND_URL="http://localhost:4000/api/health"
if curl -f -s "$BACKEND_URL" > /dev/null; then
    log "✅ Backend responde correctamente"
else
    error "Backend no responde en $BACKEND_URL"
    pm2 logs "$PM2_APP_NAME" --lines 20
    exit 1
fi

# Verificar frontend build
info "Verificando frontend..."
if [ -f "dist/index.html" ]; then
    log "✅ Frontend build exitoso"
else
    error "Frontend build incompleto"
    exit 1
fi

# Estado PM2
log "Estado de PM2:"
pm2 status

# Información del sistema
log "Información del sistema:"
info "Memoria disponible: $(free -h | grep '^Mem:' | awk '{print $7}')"
info "Espacio en disco: $(df -h . | tail -1 | awk '{print $4}')"
info "Uptime: $(uptime -p)"

# ================================
# LIMPIEZA Y FINALIZACIÓN
# ================================

log "🧹 4. Limpieza"

# Guardar configuración PM2
pm2 save

# Limpiar backups antiguos (mantener solo últimos 7 días)
find "$BACKUP_DIR" -type d -mtime +7 -name "20*" -exec rm -rf {} + 2>/dev/null || true

log "🎉 ¡DESPLIEGUE COMPLETADO EXITOSAMENTE!"
log "================================================"
log "URLs de la aplicación:"
log "  Frontend: https://biblioteca.sembrandodatos.com"
log "  Backend:  https://biblioteca.sembrandodatos.com:4000/api"
log "  Health:   https://biblioteca.sembrandodatos.com:4000/api/health"
log ""
log "Para monitorear:"
log "  pm2 monit"
log "  pm2 logs $PM2_APP_NAME"
log "  curl https://biblioteca.sembrandodatos.com:4000/api/health"
log ""
log "Backup creado en: $BACKUP_DIR/$(date +%Y%m%d)"
