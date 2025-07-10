<template>
  <div>
    <!-- Título de la página -->
    <div class="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Mapa Interactivo</h2>
        <p class="mt-1 text-sm text-gray-500">Visualización geográfica de los archivos del repositorio</p>
      </div>
    </div>

    <!-- Indicador de carga -->
    <div v-if="cargando" class="flex items-center justify-center py-12">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p class="mt-4 text-purple-600 font-medium">Cargando mapa...</p>
      </div>
    </div>

    <!-- Contenido principal -->
    <div v-else>
      <!-- Estadísticas rápidas del mapa -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <!-- Total de ubicaciones -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm font-medium">Ubicaciones</p>
              <p class="text-2xl font-bold">{{ totalUbicaciones }}</p>
            </div>
            <div class="bg-purple-700/30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Archivos geolocalizados -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium">Archivos geolocalizados</p>
              <p class="text-2xl font-bold">{{ archivosGeolocalizados }}</p>
            </div>
            <div class="bg-blue-700/30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Estados cubiertos -->
        <div class="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium">Estados cubiertos</p>
              <p class="text-2xl font-bold">{{ estadosCubiertos }}</p>
            </div>
            <div class="bg-green-700/30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Región más activa -->
        <div class="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-100 text-sm font-medium">Región más activa</p>
              <p class="text-xl font-bold">{{ regionMasActiva || 'N/A' }}</p>
            </div>
            <div class="bg-orange-700/30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenedor principal del mapa -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Distribución Geográfica de Archivos
            </h3>
            
            <!-- Controles del mapa -->
            <div class="flex items-center gap-3">
              <!-- Selector de vista -->
              <select 
                v-model="tipoVista" 
                @change="cambiarTipoVista"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
              >
                <option value="clustered">Vista agrupada</option>
                <option value="individual">Puntos individuales</option>
                <option value="heatmap">Mapa de calor</option>
              </select>
              
              <!-- Botón de centrar mapa -->
              <button 
                @click="centrarMapa"
                class="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Centrar
              </button>
            </div>
          </div>
        </div>
        
        <!-- Contenedor del mapa -->
        <div class="relative">
          <!-- Mapa principal -->
          <div id="mapa-contenedor" class="w-full h-[600px] bg-gray-100 relative">
            <!-- Placeholder del mapa - Aquí se integrará el mapa real -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="w-24 h-24 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-700 mb-2">Mapa Interactivo</h4>
                <p class="text-gray-600">
                  Aquí se mostrará la visualización geográfica de los archivos
                </p>
                <p class="text-sm text-gray-500 mt-2">
                  En desarrollo - Se integrará con mapas de OpenStreetMap o Google Maps
                </p>
              </div>
            </div>
          </div>
          
          <!-- Leyenda del mapa -->
          <div class="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
            <h4 class="text-sm font-semibold text-gray-800 mb-3">Leyenda</h4>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-xs text-gray-600">Archivos verificados</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span class="text-xs text-gray-600">Archivos en borrador</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span class="text-xs text-gray-600">Sin definir</span>
              </div>
            </div>
          </div>
          
          <!-- Panel de información -->
          <div v-if="ubicacionSeleccionada" class="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-sm">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-semibold text-gray-800">Información de Ubicación</h4>
              <button @click="ubicacionSeleccionada = null" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div class="space-y-2">
              <p class="text-xs text-gray-600">
                <strong>Ubicación:</strong> {{ ubicacionSeleccionada.nombre }}
              </p>
              <p class="text-xs text-gray-600">
                <strong>Archivos:</strong> {{ ubicacionSeleccionada.cantidad }}
              </p>
              <p class="text-xs text-gray-600">
                <strong>Tipos:</strong> {{ ubicacionSeleccionada.tipos?.join(', ') || 'N/A' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel de ubicaciones más frecuentes -->
      <div class="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          Top 10 Ubicaciones Geográficas
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div 
            v-for="(ubicacion, index) in ubicacionesFrecuentes.slice(0, 10)" 
            :key="index"
            @click="seleccionarUbicacion(ubicacion)"
            class="cursor-pointer p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-800">{{ ubicacion.ubicacion }}</span>
              <span class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                {{ ubicacion.cantidad }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${(ubicacion.cantidad / maxUbicacionCount) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
// Importar funciones utilitarias centralizadas para manejo de archivos
import { formatFileSize, calculateTotalSize, bytesToMB } from '../utils/fileUtils.js'

// Variables reactivas
const cargando = ref(true)
const archivos = ref([])
const tipoVista = ref('clustered')
const ubicacionSeleccionada = ref(null)

const BACKEND_URL = 'http://localhost:4000'

// Computed properties para estadísticas del mapa
const totalUbicaciones = computed(() => {
  const ubicaciones = archivos.value
    .filter(archivo => archivo.alcance_geografico)
    .map(archivo => archivo.alcance_geografico)
    .filter(ubicacion => ubicacion.trim() !== '')
  
  return new Set(ubicaciones).size
})

const archivosGeolocalizados = computed(() => {
  return archivos.value.filter(archivo => 
    archivo.alcance_geografico && archivo.alcance_geografico.trim() !== ''
  ).length
})

const estadosCubiertos = computed(() => {
  const estados = archivos.value
    .filter(archivo => archivo.alcance_geografico)
    .map(archivo => {
      // Intentar extraer el estado de la ubicación (asumiendo formato "Ciudad, Estado, País")
      const partes = archivo.alcance_geografico.split(',')
      return partes.length > 1 ? partes[1].trim() : null
    })
    .filter(estado => estado)
  
  return new Set(estados).size
})

const regionMasActiva = computed(() => {
  if (ubicacionesFrecuentes.value.length === 0) return null
  return ubicacionesFrecuentes.value[0]?.ubicacion?.split(',')[0]?.trim()
})

const ubicacionesFrecuentes = computed(() => {
  // Crear un mapa de ubicaciones y sus frecuencias
  const ubicacionesMap = {}
  
  archivos.value.forEach(archivo => {
    if (archivo.alcance_geografico && archivo.alcance_geografico.trim() !== '') {
      const ubicacion = archivo.alcance_geografico.trim()
      if (ubicacionesMap[ubicacion]) {
        ubicacionesMap[ubicacion].cantidad++
        ubicacionesMap[ubicacion].tipos.add(archivo.tipo || 'Sin tipo')
      } else {
        ubicacionesMap[ubicacion] = {
          ubicacion,
          cantidad: 1,
          tipos: new Set([archivo.tipo || 'Sin tipo'])
        }
      }
    }
  })
  
  // Convertir a array y ordenar por cantidad
  return Object.values(ubicacionesMap)
    .map(item => ({
      ...item,
      tipos: Array.from(item.tipos)
    }))
    .sort((a, b) => b.cantidad - a.cantidad)
})

const maxUbicacionCount = computed(() => {
  return ubicacionesFrecuentes.value.length > 0 
    ? ubicacionesFrecuentes.value[0].cantidad 
    : 1
})

// Función para obtener archivos
async function obtenerArchivos() {
  try {
    const res = await axios.get(`${BACKEND_URL}/archivos`)
    archivos.value = res.data.items || res.data || []
  } catch (err) {
    console.error('Error al cargar archivos:', err)
    archivos.value = []
  } finally {
    cargando.value = false
  }
}

// Funciones para interacción con el mapa
function cambiarTipoVista() {
  console.log('Cambiando vista a:', tipoVista.value)
  // Aquí se implementaría la lógica para cambiar la vista del mapa
}

function centrarMapa() {
  console.log('Centrando mapa')
  // Aquí se implementaría la lógica para centrar el mapa
}

function seleccionarUbicacion(ubicacion) {
  ubicacionSeleccionada.value = {
    nombre: ubicacion.ubicacion,
    cantidad: ubicacion.cantidad,
    tipos: ubicacion.tipos
  }
  console.log('Ubicación seleccionada:', ubicacion)
  // Aquí se implementaría la lógica para centrar el mapa en la ubicación seleccionada
}

// Cargar datos al montar el componente
onMounted(async () => {
  await obtenerArchivos()
})
</script>

<style scoped>
/* Animaciones y estilos personalizados */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Hover effects para las tarjetas de ubicaciones */
.hover\:border-purple-300:hover {
  border-color: #d8b4fe;
}

.hover\:bg-purple-50:hover {
  background-color: #faf5ff;
}

/* Estilos para el mapa */
#mapa-contenedor {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}

/* Animación de carga */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Estilos para las métricas */
.transform:hover {
  transform: scale(1.05);
}

/* Gradientes personalizados */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Sombras personalizadas */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
