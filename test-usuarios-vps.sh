#!/bin/bash

# Script para probar los endpoints de usuarios en el VPS
# Uso: chmod +x test-usuarios-vps.sh && ./test-usuarios-vps.sh

echo "🚀 Probando endpoints de usuarios en VPS..."
echo "================================================"

# Configuración
SERVERS=(
    "https://api.biblioteca.sembrandodatos.com"
    "https://biblioteca.sembrandodatos.com"
    "http://localhost:4000"
)

ENDPOINTS=(
    "/health"
    "/api/health"
    "/test-usuarios"
    "/api/test-usuarios"
    "/usuarios-publico"
    "/api/usuarios-publico"
    "/usuarios/usuarios-publico"
    "/api/usuarios/usuarios-publico"
    "/usuarios/publico"
    "/api/usuarios/publico"
    "/usuarios"
    "/api/usuarios"
)

# Función para probar un endpoint
test_endpoint() {
    local server=$1
    local endpoint=$2
    local url="${server}${endpoint}"
    
    echo ""
    echo "🧪 Probando: $url"
    echo "----------------------------------------"
    
    # Usar curl para probar el endpoint
    response=$(curl -s -w "HTTPSTATUS:%{http_code};TIME:%{time_total}" \
        -H "Accept: application/json" \
        -H "Content-Type: application/json" \
        -H "User-Agent: VPS-Test-Script/1.0" \
        --connect-timeout 10 \
        --max-time 15 \
        "$url" 2>/dev/null)
    
    # Separar el cuerpo de la respuesta del código HTTP
    body=$(echo "$response" | sed -E 's/HTTPSTATUS:[0-9]+;TIME:[0-9.]+//')
    httpstatus=$(echo "$response" | grep -oE "HTTPSTATUS:[0-9]+" | cut -d: -f2)
    time_total=$(echo "$response" | grep -oE "TIME:[0-9.]+" | cut -d: -f2)
    
    if [ -z "$httpstatus" ]; then
        echo "❌ Error de conexión o timeout"
        return
    fi
    
    echo "📊 Status: $httpstatus"
    echo "⏱️  Tiempo: ${time_total}s"
    
    # Verificar el código de respuesta
    if [ "$httpstatus" -ge 200 ] && [ "$httpstatus" -lt 300 ]; then
        echo "✅ Respuesta exitosa"
        
        # Verificar si es JSON válido
        if echo "$body" | jq . >/dev/null 2>&1; then
            echo "📄 Contenido: JSON válido"
            
            # Contar usuarios si es un array
            if echo "$body" | jq -e 'type == "array"' >/dev/null 2>&1; then
                count=$(echo "$body" | jq 'length')
                echo "👥 Usuarios encontrados: $count"
                
                if [ "$count" -gt 0 ]; then
                    first_user=$(echo "$body" | jq -r '.[0] | "\(.id): \(.usuario) (\(.rol))"')
                    echo "👤 Primer usuario: $first_user"
                fi
            elif echo "$body" | jq -e '.usuarios | type == "array"' >/dev/null 2>&1; then
                count=$(echo "$body" | jq '.usuarios | length')
                echo "👥 Usuarios encontrados: $count"
                
                if [ "$count" -gt 0 ]; then
                    first_user=$(echo "$body" | jq -r '.usuarios[0] | "\(.id): \(.usuario) (\(.rol))"')
                    echo "👤 Primer usuario: $first_user"
                fi
            else
                echo "📋 Otros datos JSON: $(echo "$body" | jq -c . | head -c 100)..."
            fi
        else
            echo "⚠️  Contenido: No es JSON válido"
            echo "📄 Primeros 100 caracteres: $(echo "$body" | head -c 100)..."
        fi
    else
        echo "❌ Error HTTP: $httpstatus"
        echo "📄 Contenido: $(echo "$body" | head -c 200)..."
    fi
}

# Probar todos los endpoints
for server in "${SERVERS[@]}"; do
    echo ""
    echo "🌐 Probando servidor: $server"
    echo "================================================"
    
    for endpoint in "${ENDPOINTS[@]}"; do
        test_endpoint "$server" "$endpoint"
        sleep 0.5  # Pausa entre requests
    done
    
    echo ""
done

echo ""
echo "✨ Pruebas completadas"
echo ""
echo "📝 Notas:"
echo "   - Si ves HTML en lugar de JSON, hay un problema de proxy/nginx"
echo "   - Los endpoints que retornen usuarios son los que necesitas"
echo "   - Revisa los logs del servidor para más detalles"
