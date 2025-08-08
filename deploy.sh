#!/bin/bash

# Script de despliegue para BibliotecaSV
# Este script actualiza el backend y frontend en el servidor

echo "=== Iniciando despliegue de BibliotecaSV ==="

# Variables
BACKEND_DIR="/ruta/a/tu/backend"
FRONTEND_DIR="/ruta/a/tu/frontend"
LOG_FILE="/var/log/biblioteca_deploy.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

echo "=== $TIMESTAMP: Inicio de despliegue ===" >> $LOG_FILE

# Función para manejar errores
handle_error() {
  echo "ERROR: $1" | tee -a $LOG_FILE
  exit 1
}

# Actualizar el repositorio
echo "1. Actualizando repositorio..." | tee -a $LOG_FILE
cd $BACKEND_DIR || handle_error "No se pudo acceder al directorio backend"
git pull || handle_error "Error al actualizar el repositorio backend"

cd $FRONTEND_DIR || handle_error "No se pudo acceder al directorio frontend"
git pull || handle_error "Error al actualizar el repositorio frontend"

# Instalar dependencias backend
echo "2. Instalando dependencias del backend..." | tee -a $LOG_FILE
cd $BACKEND_DIR || handle_error "No se pudo acceder al directorio backend"
npm install || handle_error "Error al instalar dependencias del backend"

# Instalar dependencias frontend
echo "3. Instalando dependencias del frontend..." | tee -a $LOG_FILE
cd $FRONTEND_DIR || handle_error "No se pudo acceder al directorio frontend"
npm install || handle_error "Error al instalar dependencias del frontend"

# Construir el frontend
echo "4. Construyendo el frontend..." | tee -a $LOG_FILE
cd $FRONTEND_DIR || handle_error "No se pudo acceder al directorio frontend"
npm run build || handle_error "Error al construir el frontend"

# Detener y reiniciar el backend (usando PM2)
echo "5. Reiniciando el backend..." | tee -a $LOG_FILE
cd $BACKEND_DIR || handle_error "No se pudo acceder al directorio backend"
pm2 restart biblioteca_api || handle_error "Error al reiniciar el backend"

# Verificar estado de PM2
echo "6. Verificando estado de servicios..." | tee -a $LOG_FILE
pm2 status >> $LOG_FILE

# Verificar conexión a la base de datos
echo "7. Verificando conexión a la base de datos..." | tee -a $LOG_FILE
node -e "
const { Pool } = require('pg'); 
require('dotenv').config(); 
const pool = new Pool({
  user: process.env.DB_USER, 
  host: process.env.DB_HOST, 
  database: process.env.DB_NAME, 
  password: process.env.DB_PASSWORD, 
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
}); 
pool.query('SELECT NOW()')
  .then(res => {
    console.log('✓ Conexión exitosa a la base de datos:', res.rows[0].now);
    pool.end();
  })
  .catch(err => {
    console.error('❌ Error de conexión a BD:', err);
    process.exit(1);
  });
" || handle_error "Error al verificar la conexión a la base de datos"

# Verificar conexión al endpoint de usuarios
echo "8. Verificando endpoint /api/usuarios..." | tee -a $LOG_FILE
curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/usuarios >> $LOG_FILE
if [ $? -ne 0 ]; then
  handle_error "Error al verificar el endpoint /api/usuarios"
fi

echo "=== Despliegue completado exitosamente ===" | tee -a $LOG_FILE
echo "$TIMESTAMP: Despliegue completado" >> $LOG_FILE
