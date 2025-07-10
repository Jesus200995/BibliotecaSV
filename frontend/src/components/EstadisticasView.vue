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
        <div class="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
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
        <div class="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
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
        <div class="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
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
        <div class="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
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

      <!-- Gráficos principales -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Gráfico de barras verticales (Edificios) - Distribución por tipo -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Distribución por tipo de archivo
          </h3>
          <div class="chart-container">
            <div class="bar-chart-vertical" style="height: 300px;">
              <div class="chart-grid">
                <div v-for="i in 5" :key="i" class="grid-line"></div>
              </div>
              <div class="bars-container">
                <div v-for="(tipo, index) in estadisticas.tiposArchivo.slice(0, 6)" 
                     :key="tipo.tipo" 
                     class="bar-wrapper"
                     :style="{ '--delay': index * 0.1 + 's' }">
                  <div class="bar-vertical animate-bar-grow" 
                       :style="{ 
                         height: getBarHeight(tipo.cantidad, estadisticas.maxTipoCount) + '%',
                         backgroundColor: getTipoColorHex(tipo.tipo)
                       }">
                    <div class="bar-value">{{ tipo.cantidad }}</div>
                  </div>
                  <div class="bar-label">{{ tipo.tipo }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gráfico de pastel - Estados de validación -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Estados de validación
          </h3>
          <div class="chart-container flex items-center">
            <div class="pie-chart" style="width: 200px; height: 200px; position: relative;">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <!-- Círculos de fondo para el pastel -->
                <g>
                  <path 
                    v-for="(estado, index) in estadisticas.estadosValidacion" 
                    :key="estado.estado"
                    :fill="getEstadoColorHex(estado.estado)"
                    :d="getPieSlicePath(index)"
                    :style="{ '--delay': index * 0.2 + 's' }"
                    class="pie-slice animate-pie-appear"
                  />
                </g>
                <text x="100" y="85" text-anchor="middle" class="text-2xl font-bold text-gray-800">
                  {{ estadisticas.totalArchivos }}
                </text>
                <text x="100" y="115" text-anchor="middle" class="text-sm text-gray-500">
                  Total
                </text>
              </svg>
            </div>
            <div class="ml-6 space-y-3">
              <div v-for="estado in estadisticas.estadosValidacion" :key="estado.estado" class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: getEstadoColorHex(estado.estado) }"></div>
                <span class="text-sm font-medium text-gray-700">{{ estado.estado || 'Sin definir' }}</span>
                <span class="ml-auto text-sm font-bold text-gray-900">{{ estado.cantidad }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico de barras horizontales - Actividad mensual -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Actividad por mes
        </h3>
        <div class="chart-container">
          <div class="bar-chart-horizontal">
            <div v-for="(mes, index) in estadisticas.actividadMensual" 
                 :key="mes.mes" 
                 class="bar-row"
                 :style="{ '--delay': index * 0.1 + 's' }">
              <div class="bar-label-left">{{ mes.mes }}</div>
              <div class="bar-track">
                <div class="bar-horizontal animate-bar-grow-horizontal" 
                     :style="{ 
                       width: getBarWidth(mes.cantidad, estadisticas.maxMesCount) + '%',
                       backgroundColor: getMonthColor(index)
                     }">
                  <span class="bar-value-horizontal">{{ mes.cantidad }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ubicaciones más frecuentes con gráfico de burbujas -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Ubicaciones más frecuentes
        </h3>
        <div class="bubble-chart">
          <div v-for="(ubicacion, index) in estadisticas.ubicacionesFrecuentes.slice(0, 8)" 
               :key="ubicacion.ubicacion" 
               class="bubble animate-bubble-grow"
               :style="{ 
                 '--size': getBubbleSize(ubicacion.cantidad, estadisticas.maxUbicacionCount) + 'px',
                 '--color': getBubbleColor(index),
                 '--delay': index * 0.1 + 's',
                 '--x': getBubbleX(index) + '%',
                 '--y': getBubbleY(index) + '%'
               }">
            <div class="bubble-content">
              <div class="bubble-text">{{ ubicacion.ubicacion }}</div>
              <div class="bubble-count">{{ ubicacion.cantidad }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
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
  ubicacionesFrecuentes: [],
  maxTipoCount: 0,
  maxMesCount: 0,
  maxUbicacionCount: 0
})

const BACKEND_URL = 'http://localhost:4000'

// Función para obtener estadísticas
async function obtenerEstadisticas() {
  try {
    cargando.value = true
    
    // Obtener todos los archivos (sin paginación para estadísticas completas)
    const response = await axios.get(`${BACKEND_URL}/archivos?limit=1000`)
    
    // Extraer los archivos del objeto de respuesta
    const archivos = response.data.items || response.data || []
    
    console.log('Archivos obtenidos:', archivos.length)
    console.log('Ejemplo de archivo:', archivos[0])

    // Calcular estadísticas
    calcularEstadisticas(archivos)
    
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    // Datos de ejemplo en caso de error
    calcularEstadisticasEjemplo()
  } finally {
    cargando.value = false
  }
}

// Función para calcular estadísticas
function calcularEstadisticas(archivos) {
  console.log('Calculando estadísticas para', archivos.length, 'archivos')
  
  const ahora = new Date()
  const mesActual = ahora.getMonth() + 1
  const anioActual = ahora.getFullYear()
  
  // Total de archivos
  estadisticas.value.totalArchivos = archivos.length
  
  // Tamaño total (manejar diferentes formatos de tamaño)
  estadisticas.value.tamanoTotal = archivos.reduce((total, archivo) => {
    let tamano = 0
    if (archivo.tamano) {
      // Si ya es un número
      if (typeof archivo.tamano === 'number') {
        tamano = archivo.tamano
      } else if (typeof archivo.tamano === 'string') {
        // Si es string, intentar parsearlo
        const num = parseInt(archivo.tamano.replace(/[^\d]/g, ''))
        tamano = isNaN(num) ? 0 : num
      }
    }
    return total + tamano
  }, 0)
  
  // Tipos de archivo
  const tiposMap = {}
  archivos.forEach(archivo => {
    let tipo = archivo.tipo
    if (!tipo && archivo.nombre) {
      // Extraer extensión del nombre del archivo
      const extension = archivo.nombre.split('.').pop()
      tipo = extension ? extension.toUpperCase() : 'Sin tipo'
    }
    tipo = tipo || 'Sin tipo'
    tiposMap[tipo] = (tiposMap[tipo] || 0) + 1
  })
  
  estadisticas.value.tiposArchivo = Object.entries(tiposMap)
    .map(([tipo, cantidad]) => ({ tipo, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
  
  estadisticas.value.maxTipoCount = Math.max(...estadisticas.value.tiposArchivo.map(t => t.cantidad), 1)
  
  // Archivos del mes actual
  estadisticas.value.archivosMesActual = archivos.filter(archivo => {
    if (!archivo.fecha_actualizacion) return false
    try {
      const fecha = new Date(archivo.fecha_actualizacion)
      return fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === anioActual
    } catch {
      return false
    }
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
    const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
    const mesNombre = `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`
    actividadMap[mesKey] = { mes: mesNombre, cantidad: 0 }
  }
  
  archivos.forEach(archivo => {
    if (!archivo.fecha_actualizacion) return
    try {
      const fecha = new Date(archivo.fecha_actualizacion)
      const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
      if (actividadMap[mesKey]) {
        actividadMap[mesKey].cantidad++
      }
    } catch (error) {
      console.warn('Error al procesar fecha:', archivo.fecha_actualizacion)
    }
  })
  
  estadisticas.value.actividadMensual = Object.values(actividadMap)
  estadisticas.value.maxMesCount = Math.max(...estadisticas.value.actividadMensual.map(m => m.cantidad), 1)
  
  // Ubicaciones más frecuentes
  const ubicacionesMap = {}
  archivos.forEach(archivo => {
    if (!archivo.alcance_geografico) return
    
    // Manejar diferentes formatos de alcance geográfico
    let ubicaciones = []
    if (typeof archivo.alcance_geografico === 'string') {
      ubicaciones = archivo.alcance_geografico.split(/[,;]/)
    } else if (Array.isArray(archivo.alcance_geografico)) {
      ubicaciones = archivo.alcance_geografico
    }
    
    ubicaciones.forEach(ubicacion => {
      const ubicacionTrim = String(ubicacion).trim()
      if (ubicacionTrim && ubicacionTrim !== '') {
        ubicacionesMap[ubicacionTrim] = (ubicacionesMap[ubicacionTrim] || 0) + 1
      }
    })
  })
  
  estadisticas.value.ubicacionesFrecuentes = Object.entries(ubicacionesMap)
    .map(([ubicacion, cantidad]) => ({ ubicacion, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 12)
  
  estadisticas.value.maxUbicacionCount = Math.max(...estadisticas.value.ubicacionesFrecuentes.map(u => u.cantidad), 1)
  
  console.log('Estadísticas calculadas:', estadisticas.value)
}

// Función de datos de ejemplo en caso de error
function calcularEstadisticasEjemplo() {
  estadisticas.value = {
    totalArchivos: 156,
    tamanoTotal: 2048576000, // 2GB
    tiposArchivo: [
      { tipo: 'PDF', cantidad: 45 },
      { tipo: 'XLSX', cantidad: 32 },
      { tipo: 'CSV', cantidad: 28 },
      { tipo: 'DOC', cantidad: 25 },
      { tipo: 'PNG', cantidad: 15 },
      { tipo: 'TXT', cantidad: 11 }
    ],
    archivosMesActual: 23,
    estadosValidacion: [
      { estado: 'Verificado', cantidad: 89 },
      { estado: 'Preliminar', cantidad: 34 },
      { estado: 'Borrador', cantidad: 22 },
      { estado: 'En revisión', cantidad: 11 }
    ],
    actividadMensual: [
      { mes: 'Febrero 2025', cantidad: 12 },
      { mes: 'Marzo 2025', cantidad: 18 },
      { mes: 'Abril 2025', cantidad: 25 },
      { mes: 'Mayo 2025', cantidad: 31 },
      { mes: 'Junio 2025', cantidad: 27 },
      { mes: 'Julio 2025', cantidad: 23 }
    ],
    ubicacionesFrecuentes: [
      { ubicacion: 'Ciudad de México', cantidad: 35 },
      { ubicacion: 'Guadalajara', cantidad: 22 },
      { ubicacion: 'Monterrey', cantidad: 18 },
      { ubicacion: 'Puebla', cantidad: 15 },
      { ubicacion: 'Tijuana', cantidad: 12 },
      { ubicacion: 'León', cantidad: 10 },
      { ubicacion: 'Juárez', cantidad: 8 },
      { ubicacion: 'Torreón', cantidad: 6 }
    ],
    maxTipoCount: 45,
    maxMesCount: 31,
    maxUbicacionCount: 35
  }
}

// Funciones auxiliares para los gráficos
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getTipoColorHex(tipo) {
  const colores = {
    'PDF': '#ef4444',
    'XLSX': '#22c55e',
    'XLS': '#22c55e',
    'CSV': '#eab308',
    'DOC': '#3b82f6',
    'DOCX': '#3b82f6',
    'TXT': '#6b7280',
    'PNG': '#a855f7',
    'JPG': '#a855f7',
    'JPEG': '#a855f7'
  }
  return colores[tipo] || '#6b7280'
}

function getEstadoColorHex(estado) {
  const colores = {
    'Verificado': '#22c55e',
    'Preliminar': '#eab308',
    'Borrador': '#6b7280',
    'En revisión': '#3b82f6'
  }
  return colores[estado] || '#9ca3af'
}

function getBarHeight(cantidad, max) {
  return max > 0 ? (cantidad / max) * 100 : 0
}

function getBarWidth(cantidad, max) {
  return max > 0 ? (cantidad / max) * 100 : 0
}

function getMonthColor(index) {
  const colores = ['#3b82f6', '#06b6d4', '#10b981', '#84cc16', '#eab308', '#f59e0b']
  return colores[index % colores.length]
}

// Funciones para el gráfico de pastel
function getPieSlicePath(index) {
  const total = estadisticas.value.totalArchivos
  const estados = estadisticas.value.estadosValidacion
  
  // Calcular ángulos iniciales y finales para esta sección
  let startAngle = 0
  for (let i = 0; i < index; i++) {
    const percentage = estados[i].cantidad / total
    startAngle += percentage * 2 * Math.PI
  }
  
  const percentage = estados[index].cantidad / total
  const endAngle = startAngle + percentage * 2 * Math.PI
  
  // Radio del pastel
  const radius = 80
  const centerX = 100
  const centerY = 100
  
  // Calcular puntos de inicio y fin para el arco
  const x1 = centerX + radius * Math.cos(startAngle - Math.PI / 2)
  const y1 = centerY + radius * Math.sin(startAngle - Math.PI / 2)
  const x2 = centerX + radius * Math.cos(endAngle - Math.PI / 2)
  const y2 = centerY + radius * Math.sin(endAngle - Math.PI / 2)
  
  // Bandera para arco grande
  const largeArc = percentage > 0.5 ? 1 : 0
  
  // Crear el path del slice
  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
}

// Funciones para el gráfico de burbujas
function getBubbleSize(cantidad, max) {
  const minSize = 60
  const maxSize = 120
  return max > 0 ? minSize + (cantidad / max) * (maxSize - minSize) : minSize
}

function getBubbleColor(index) {
  const colores = ['#3b82f6', '#ef4444', '#22c55e', '#eab308', '#a855f7', '#06b6d4', '#84cc16', '#f59e0b']
  return colores[index % colores.length]
}

function getBubbleX(index) {
  const positions = [15, 35, 55, 75, 25, 45, 65, 85]
  return positions[index % positions.length]
}

function getBubbleY(index) {
  const positions = [20, 60, 30, 70, 80, 40, 50, 90]
  return positions[index % positions.length]
}

// Cargar datos al montar el componente
onMounted(() => {
  obtenerEstadisticas()
})
</script>

<style scoped>
/* Animaciones base */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes barGrow {
  from { height: 0%; }
  to { height: var(--final-height); }
}

@keyframes barGrowHorizontal {
  from { width: 0%; }
  to { width: var(--final-width); }
}

@keyframes pieAppear {
  from { opacity: 0; transform: scale(0); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes bubbleGrow {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Estilos para gráfico de barras verticales */
.chart-container {
  position: relative;
  width: 100%;
}

.bar-chart-vertical {
  position: relative;
  display: flex;
  align-items: end;
  justify-content: space-around;
  padding: 20px 0;
  background: linear-gradient(to top, #f9fafb 0%, #ffffff 100%);
  border-radius: 8px;
}

.chart-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 0;
}

.grid-line {
  height: 1px;
  background: #e5e7eb;
  width: 100%;
}

.bars-container {
  display: flex;
  align-items: end;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 80px;
}

.bar-vertical {
  width: 40px;
  background: linear-gradient(to top, var(--color), color-mix(in srgb, var(--color) 80%, white));
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: all 0.3s ease;
  animation: barGrow 1s ease-out var(--delay, 0s) both;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.bar-vertical:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.bar-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: bold;
  color: #374151;
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.bar-label {
  margin-top: 8px;
  font-size: 11px;
  font-weight: 500;
  color: #6b7280;
  text-align: center;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.animate-bar-grow {
  --final-height: var(--height);
  animation: barGrow 1s ease-out var(--delay, 0s) both;
}

/* Estilos para gráfico de pastel */
.pie-chart svg {
  overflow: visible;
}

.pie-slice {
  transform-origin: center;
  transition: all 0.3s ease;
}

.pie-slice:hover {
  transform: translateX(5px) translateY(5px);
  filter: brightness(1.1);
  stroke: #ffffff;
  stroke-width: 2;
}

@keyframes pieAppear {
  from { 
    opacity: 0; 
    transform: scale(0.5);
  }
  to { 
    opacity: 1; 
    transform: scale(1);
  }
}

.animate-pie-appear {
  animation: pieAppear 0.8s ease-out var(--delay, 0s) both;
  transform-origin: 100px 100px;
}

/* Estilos para gráfico de barras horizontales */
.bar-chart-horizontal {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 0;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 15px;
  animation: slideInLeft 0.8s ease-out var(--delay, 0s) both;
}

.bar-label-left {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  min-width: 120px;
  text-align: right;
}

.bar-track {
  flex: 1;
  height: 24px;
  background: #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.bar-horizontal {
  height: 100%;
  border-radius: 12px;
  position: relative;
  transition: all 0.3s ease;
  animation: barGrowHorizontal 1.2s ease-out var(--delay, 0s) both;
  background: linear-gradient(90deg, var(--color), color-mix(in srgb, var(--color) 80%, white));
}

.bar-horizontal:hover {
  transform: scaleY(1.1);
  filter: brightness(1.05);
}

.bar-value-horizontal {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: 11px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.animate-bar-grow-horizontal {
  --final-width: var(--width);
  animation: barGrowHorizontal 1.2s ease-out var(--delay, 0s) both;
}

/* Estilos para gráfico de burbujas */
.bubble-chart {
  position: relative;
  height: 300px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  overflow: hidden;
}

.bubble {
  position: absolute;
  width: var(--size);
  height: var(--size);
  left: var(--x);
  top: var(--y);
  transform: translate(-50%, -50%);
  background: radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--color) 90%, white), var(--color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: bubbleGrow 0.8s ease-out var(--delay, 0s) both;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.bubble:hover {
  transform: translate(-50%, -50%) scale(1.1);
  z-index: 10;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
}

.bubble-content {
  text-align: center;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.bubble-text {
  font-size: 11px;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 2px;
}

.bubble-count {
  font-size: 14px;
  font-weight: 800;
}

.animate-bubble-grow {
  animation: bubbleGrow 0.8s ease-out var(--delay, 0s) both;
}

/* Animaciones adicionales */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInLeft {
  from { transform: translateX(-30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .bar-chart-vertical {
    height: 250px;
  }
  
  .bar-vertical {
    width: 30px;
  }
  
  .bar-label-left {
    min-width: 80px;
    font-size: 11px;
  }
  
  .bubble-chart {
    height: 250px;
  }
  
  .pie-chart {
    width: 150px !important;
    height: 150px !important;
  }
}

/* Efectos hover para las tarjetas métricas */
.transform {
  transition: transform 0.3s ease;
}

.hover\\:scale-105:hover {
  transform: scale(1.05);
}
</style>
