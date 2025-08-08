#!/bin/bash

echo "🔧 Probando conexión directa al backend Node.js en el puerto 4000..."
echo "=========================================================="

# URLs del backend directo (sin proxy nginx)
BACKEND_URLS=(
    "http://localhost:4000"
    "http://127.0.0.1:4000"
    "http://api.biblioteca.sembrandodatos.com:4000"  # Si el puerto está abierto
    "http://biblioteca.sembrandodatos.com:4000"      # Si el puerto está abierto
)

# Endpoints específicos del backend
ENDPOINTS=(
    "/health"
    "/backend-usuarios"
    "/server-usuarios"
    "/test-usuarios"
    "/usuarios-publico"
    "/api/usuarios-publico"
    "/db-status"
)

# Función para probar conexión directa al backend
test_backend_direct() {
    local backend_url=$1
    local endpoint=$2
    local url="${backend_url}${endpoint}"
    
    echo ""
    echo "🎯 Probando conexión directa: $url"
    echo "----------------------------------------"
    
    # Probar con timeout corto para detectar si el puerto está abierto
    response=$(curl -s -w "HTTPSTATUS:%{http_code};TIME:%{time_total}" \
        -H "Accept: application/json" \
        -H "Content-Type: application/json" \
        -H "Origin: https://biblioteca.sembrandodatos.com" \
        -H "User-Agent: Direct-Backend-Test/1.0" \
        --connect-timeout 5 \
        --max-time 10 \
        "$url" 2>/dev/null)
    
    # Separar el cuerpo de la respuesta del código HTTP
    body=$(echo "$response" | sed -E 's/HTTPSTATUS:[0-9]+;TIME:[0-9.]+//')
    httpstatus=$(echo "$response" | grep -oE "HTTPSTATUS:[0-9]+" | cut -d: -f2)
    time_total=$(echo "$response" | grep -oE "TIME:[0-9.]+" | cut -d: -f2)
    
    if [ -z "$httpstatus" ]; then
        echo "❌ Sin respuesta (puerto cerrado o servidor apagado)"
        return
    fi
    
    echo "📊 Status: $httpstatus"
    echo "⏱️  Tiempo: ${time_total}s"
    
    if [ "$httpstatus" -ge 200 ] && [ "$httpstatus" -lt 300 ]; then
        echo "✅ ¡CONEXIÓN EXITOSA AL BACKEND!"
        
        # Verificar si es JSON válido
        if echo "$body" | jq . >/dev/null 2>&1; then
            echo "📄 Contenido: JSON válido"
            
            # Si es el endpoint de usuarios, mostrar información
            if [[ "$endpoint" == *"usuarios"* ]]; then
                if echo "$body" | jq -e 'type == "array"' >/dev/null 2>&1; then
                    count=$(echo "$body" | jq 'length')
                    echo "👥 Usuarios encontrados: $count"
                    
                    if [ "$count" -gt 0 ]; then
                        echo "👤 Usuarios:"
                        echo "$body" | jq -r '.[] | "  - ID: \(.id), Usuario: \(.usuario), Rol: \(.rol), Activo: \(.activo)"'
                    fi
                elif echo "$body" | jq -e '.usuarios | type == "array"' >/dev/null 2>&1; then
                    count=$(echo "$body" | jq '.usuarios | length')
                    echo "👥 Usuarios encontrados: $count"
                    
                    if [ "$count" -gt 0 ]; then
                        echo "👤 Usuarios:"
                        echo "$body" | jq -r '.usuarios[] | "  - ID: \(.id), Usuario: \(.usuario), Rol: \(.rol), Activo: \(.activo)"'
                    fi
                else
                    echo "📋 Respuesta: $(echo "$body" | jq -c .)"
                fi
            else
                echo "📋 Respuesta: $(echo "$body" | jq -c . | head -c 150)..."
            fi
        else
            echo "⚠️  Contenido: No es JSON válido"
            echo "📄 Contenido: $(echo "$body" | head -c 100)..."
        fi
        
        # Si encontramos usuarios, esta es la URL que necesitas usar
        if [[ "$endpoint" == *"usuarios"* ]] && [ "$httpstatus" -eq 200 ]; then
            echo ""
            echo "🎉 ¡ESTA ES LA URL QUE NECESITAS USAR EN EL FRONTEND!"
            echo "URL: $url"
            echo "Configura tu frontend para usar esta URL directamente"
            echo ""
        fi
        
    else
        echo "❌ Error HTTP: $httpstatus"
        if [ ${#body} -gt 0 ]; then
            echo "📄 Error: $(echo "$body" | head -c 100)..."
        fi
    fi
}

# Probar cada backend URL con cada endpoint
for backend_url in "${BACKEND_URLS[@]}"; do
    echo ""
    echo "🖥️  Probando backend: $backend_url"
    echo "=========================================================="
    
    for endpoint in "${ENDPOINTS[@]}"; do
        test_backend_direct "$backend_url" "$endpoint"
        sleep 0.3  # Pausa breve entre requests
    done
    
    echo ""
done

echo ""
echo "🔍 DIAGNÓSTICO ADICIONAL:"
echo "========================="

# Verificar si el proceso Node.js está corriendo
echo "📋 Procesos Node.js corriendo:"
if command -v ps >/dev/null 2>&1; then
    ps aux | grep -i node | grep -v grep || echo "  No se encontraron procesos Node.js"
else
    echo "  Comando 'ps' no disponible"
fi

# Verificar puertos abiertos
echo ""
echo "🔌 Puertos abiertos relacionados:"
if command -v ss >/dev/null 2>&1; then
    ss -tulnp | grep -E ":4000|:3000|:5173" || echo "  No se encontraron puertos relevantes abiertos"
elif command -v netstat >/dev/null 2>&1; then
    netstat -tulnp | grep -E ":4000|:3000|:5173" || echo "  No se encontraron puertos relevantes abiertos"
else
    echo "  Comandos 'ss' o 'netstat' no disponibles"
fi

echo ""
echo "💡 RECOMENDACIONES:"
echo "==================="
echo "1. Si ves '✅ CONEXIÓN EXITOSA AL BACKEND!' arriba, usa esa URL en el frontend"
echo "2. Si no hay conexiones exitosas, verifica que el backend Node.js esté corriendo"
echo "3. Si el puerto 4000 no está abierto externamente, necesitas configurar nginx o firewall"
echo "4. Si encuentras usuarios, el problema es solo de configuración de proxy/nginx"
