<template>
  <div>
    <!-- Título de la página -->
    <div class="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Estadísticas</h2>
        <p class="mt-1 text-sm text-gray-500">Análisis detallado y métricas del repositorio de datos</p>
      </div>
    </div>

    <!-- Indicador de carga -->
    <div v-if="cargando" class="flex items-center justify-center py-12">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p class="mt-4 text-purple-600 font-medium">Cargando estadísticas...</p>
      </div>
    </div>

    <!-- Contenido principal -->
    <div v-else>
      <!-- Métricas principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total de archivos -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium">Total de archivos</p>
              <p class="text-3xl font-bold">{{ estadisticas.totalArchivos }}</p>
            </div>
            <div class="bg-blue-700/30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Tamaño total -->
        <div class="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium">Tamaño total</p>
              <p class="text-3xl font-bold">{{ formatFileSize(estadisticas.tamanoTotal) }}</p>
            </div>
            <div class="bg-green-700/30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Tipos de archivo -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm font-medium">Tipos de archivo</p>
              <p class="text-3xl font-bold">{{ estadisticas.tiposArchivo.length }}</p>
            </div>
            <div class="bg-purple-700/30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Archivos este mes -->
        <div class="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 rounded-xl shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-100 text-sm font-medium">Archivos este mes</p>
              <p class="text-3xl font-bold">{{ estadisticas.archivosMesActual }}</p>
            </div>
            <div class="bg-orange-700/30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráficos y análisis -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Distribución por tipo de archivo -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Distribución por tipo de archivo
          </h3>
          <div class="space-y-4">
            <div v-for="tipo in estadisticas.tiposArchivo" :key="tipo.tipo" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-3" :class="getTipoColor(tipo.tipo)"></div>
                <span class="text-sm font-medium text-gray-700">{{ tipo.tipo }}</span>
              </div>
              <div class="flex items-center">
                <div class="w-20 h-2 bg-gray-200 rounded-full mr-3">
                  <div class="h-2 rounded-full transition-all duration-300" 
                       :class="getTipoColor(tipo.tipo)"
                       :style="{ width: (tipo.cantidad / estadisticas.totalArchivos * 100) + '%' }"></div>
                </div>
                <span class="text-sm font-bold text-gray-900">{{ tipo.cantidad }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Estados de validación -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Estados de validación
          </h3>
          <div class="space-y-4">
            <div v-for="estado in estadisticas.estadosValidacion" :key="estado.estado" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-3" :class="getEstadoColor(estado.estado)"></div>
                <span class="text-sm font-medium text-gray-700">{{ estado.estado || 'Sin definir' }}</span>
              </div>
              <div class="flex items-center">
                <div class="w-20 h-2 bg-gray-200 rounded-full mr-3">
                  <div class="h-2 rounded-full transition-all duration-300" 
                       :class="getEstadoColor(estado.estado)"
                       :style="{ width: (estado.cantidad / estadisticas.totalArchivos * 100) + '%' }"></div>
                </div>
                <span class="text-sm font-bold text-gray-900">{{ estado.cantidad }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actividad reciente -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Actividad por mes
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="mes in estadisticas.actividadMensual" :key="mes.mes" 
               class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div class="text-sm font-medium text-gray-600">{{ mes.mes }}</div>
            <div class="text-2xl font-bold text-gray-800">{{ mes.cantidad }}</div>
            <div class="text-xs text-gray-500">archivos subidos</div>
          </div>
        </div>
      </div>

      <!-- Ubicaciones más frecuentes -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Ubicaciones más frecuentes
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="ubicacion in estadisticas.ubicacionesFrecuentes" :key="ubicacion.ubicacion" 
               class="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex items-center">
              <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                {{ ubicacion.ubicacion }}
              </span>
            </div>
            <span class="text-sm font-bold text-blue-800">{{ ubicacion.cantidad }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Variables reactivas
const cargando = ref(true)
const estadisticas = ref({
  totalArchivos: 0,
  tamanoTotal: 0,
  tiposArchivo: [],
  archivosMesActual: 0,
  estadosValidacion: [],
  actividadMensual: [],
  ubicacionesFrecuentes: []
})

const BACKEND_URL = 'http://localhost:4000'

// Función para obtener estadísticas
async function obtenerEstadisticas() {
  try {
    cargando.value = true
    
    // Obtener todos los archivos
    const response = await axios.get(`${BACKEND_URL}/archivos`)
    const archivos = response.data

    // Calcular estadísticas
    calcularEstadisticas(archivos)
    
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    // Datos de ejemplo en caso de error
    estadisticas.value = {
      totalArchivos: 0,
      tamanoTotal: 0,
      tiposArchivo: [],
      archivosMesActual: 0,
      estadosValidacion: [],
      actividadMensual: [],
      ubicacionesFrecuentes: []
    }
  } finally {
    cargando.value = false
  }
}

// Función para calcular estadísticas
function calcularEstadisticas(archivos) {
  const ahora = new Date()
  const mesActual = ahora.getMonth() + 1
  const anioActual = ahora.getFullYear()
  
  // Total de archivos
  estadisticas.value.totalArchivos = archivos.length
  
  // Tamaño total
  estadisticas.value.tamanoTotal = archivos.reduce((total, archivo) => total + (archivo.tamano || 0), 0)
  
  // Tipos de archivo
  const tiposMap = {}
  archivos.forEach(archivo => {
    const tipo = archivo.tipo || 'Sin tipo'
    tiposMap[tipo] = (tiposMap[tipo] || 0) + 1
  })
  estadisticas.value.tiposArchivo = Object.entries(tiposMap)
    .map(([tipo, cantidad]) => ({ tipo, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
  
  // Archivos del mes actual
  estadisticas.value.archivosMesActual = archivos.filter(archivo => {
    if (!archivo.fecha_actualizacion) return false
    const fecha = new Date(archivo.fecha_actualizacion)
    return fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === anioActual
  }).length
  
  // Estados de validación
  const estadosMap = {}
  archivos.forEach(archivo => {
    const estado = archivo.validacion || 'Sin definir'
    estadosMap[estado] = (estadosMap[estado] || 0) + 1
  })
  estadisticas.value.estadosValidacion = Object.entries(estadosMap)
    .map(([estado, cantidad]) => ({ estado, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
  
  // Actividad mensual (últimos 6 meses)
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const actividadMap = {}
  
  for (let i = 5; i >= 0; i--) {
    const fecha = new Date()
    fecha.setMonth(fecha.getMonth() - i)
    const mesKey = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`
    const mesNombre = `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`
    actividadMap[mesKey] = { mes: mesNombre, cantidad: 0 }
  }
  
  archivos.forEach(archivo => {
    if (!archivo.fecha_actualizacion) return
    const fecha = new Date(archivo.fecha_actualizacion)
    const mesKey = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`
    if (actividadMap[mesKey]) {
      actividadMap[mesKey].cantidad++
    }
  })
  
  estadisticas.value.actividadMensual = Object.values(actividadMap)
  
  // Ubicaciones más frecuentes
  const ubicacionesMap = {}
  archivos.forEach(archivo => {
    if (!archivo.alcance_geografico) return
    const ubicaciones = archivo.alcance_geografico.split(',')
    ubicaciones.forEach(ubicacion => {
      const ubicacionTrim = ubicacion.trim()
      if (ubicacionTrim) {
        ubicacionesMap[ubicacionTrim] = (ubicacionesMap[ubicacionTrim] || 0) + 1
      }
    })
  })
  
  estadisticas.value.ubicacionesFrecuentes = Object.entries(ubicacionesMap)
    .map(([ubicacion, cantidad]) => ({ ubicacion, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 9) // Top 9 ubicaciones
}

// Función para formatear el tamaño de archivo
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Función para obtener color por tipo de archivo
function getTipoColor(tipo) {
  const colores = {
    'PDF': 'bg-red-500',
    'XLSX': 'bg-green-500',
    'XLS': 'bg-green-500',
    'CSV': 'bg-yellow-500',
    'DOC': 'bg-blue-500',
    'DOCX': 'bg-blue-500',
    'TXT': 'bg-gray-500',
    'PNG': 'bg-purple-500',
    'JPG': 'bg-purple-500',
    'JPEG': 'bg-purple-500'
  }
  return colores[tipo] || 'bg-gray-500'
}

// Función para obtener color por estado
function getEstadoColor(estado) {
  const colores = {
    'Verificado': 'bg-green-500',
    'Preliminar': 'bg-yellow-500',
    'Borrador': 'bg-gray-500',
    'En revisión': 'bg-blue-500'
  }
  return colores[estado] || 'bg-gray-400'
}

// Cargar datos al montar el componente
onMounted(() => {
  obtenerEstadisticas()
})
</script>

<style scoped>
/* Transiciones suaves */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Gradientes personalizados */
.bg-gradient-to-r {
  background: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Animaciones */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

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
</style>
