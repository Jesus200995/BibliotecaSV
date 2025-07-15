#!/bin/bash

# Script para inicializar y ejecutar el backend

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Iniciando Biblioteca SV - Backend ===${NC}\n"

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "index.js" ] || [ ! -f "package.json" ]; then
    echo -e "${RED}Error: No se encontró index.js o package.json${NC}"
    echo "Por favor, ejecuta este script desde el directorio 'backend'"
    exit 1
fi

# 2. Cargar variables de entorno
echo -e "${YELLOW}Cargando configuración...${NC}"
if [ "$NODE_ENV" == "production" ]; then
    echo "Entorno: PRODUCCIÓN"
    if [ -f ".env.production" ]; then
        echo "Usando archivo .env.production"
    else
        echo -e "${RED}Advertencia: No se encontró archivo .env.production${NC}"
    fi
else
    echo "Entorno: DESARROLLO"
    if [ -f ".env.local" ]; then
        echo "Usando archivo .env.local"
    elif [ -f ".env" ]; then
        echo "Usando archivo .env"
    else
        echo -e "${RED}Advertencia: No se encontró archivo .env o .env.local${NC}"
    fi
fi

# 3. Verificar dependencias
echo -e "\n${YELLOW}Verificando dependencias...${NC}"
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias (esto puede tardar unos minutos)..."
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error al instalar dependencias${NC}"
        exit 1
    fi
    echo -e "${GREEN}Dependencias instaladas correctamente${NC}"
else
    echo -e "${GREEN}Dependencias ya instaladas${NC}"
fi

# 4. Configurar la base de datos
echo -e "\n${YELLOW}Configurando base de datos...${NC}"
node setup_db.js
if [ $? -ne 0 ]; then
    echo -e "${RED}Advertencia: Error al configurar la base de datos${NC}"
    echo "Verifica la conexión y credenciales"
else
    echo -e "${GREEN}Base de datos configurada correctamente${NC}"
fi

# 5. Iniciar el servidor
echo -e "\n${YELLOW}Iniciando servidor...${NC}"
if [ "$NODE_ENV" == "production" ]; then
    echo "Iniciando en modo producción con PM2..."
    pm2 start ecosystem.config.js --env production
    echo -e "${GREEN}Servidor iniciado en modo producción${NC}"
    echo "Para ver logs: pm2 logs"
    echo "Para monitorear: pm2 monit"
else
    echo "Iniciando en modo desarrollo..."
    echo -e "${GREEN}Servidor iniciado en modo desarrollo${NC}"
    echo "Presiona Ctrl+C para detener"
    npm run dev
fi

echo -e "\n${GREEN}¡Listo! El backend está ejecutándose.${NC}"
