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
          <EdificioChart 
            :tiposArchivo="estadisticas.tiposArchivo" 
            :totalArchivos="estadisticas.totalArchivos"
          />
        </div>

        <!-- Gráfico de pastel moderno - Estados de validación -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Estados de validación
          </h3>
          
          <!-- Contenedor centrado y responsivo para el gráfico -->
          <div class="flex flex-col lg:flex-row items-center justify-center gap-8">
            <!-- Gráfico de pastel con efectos modernos -->
            <div class="pie-chart-modern-container">
              <div class="pie-chart-modern" style="width: 280px; height: 280px; position: relative;">
                <svg width="280" height="280" viewBox="0 0 280 280" class="pie-svg-modern">
                  <!-- Círculo de fondo sutil -->
                  <circle cx="140" cy="140" r="120" fill="rgba(248, 250, 252, 0.8)" stroke="rgba(226, 232, 240, 0.6)" stroke-width="2"/>
                  
                  <!-- Segmentos del pastel con efectos modernos -->
                  <g class="pie-segments">
                    <path 
                      v-for="(estado, index) in estadisticas.estadosValidacion" 
                      :key="estado.estado"
                      :fill="getEstadoColorHex(estado.estado)"
                      :stroke="getEstadoBorderColor(estado.estado)"
                      :stroke-width="4"
                      :d="getPieSlicePathModern(index)"
                      :style="{ '--delay': index * 0.2 + 's' }"
                      class="pie-slice-modern animate-pie-appear-modern"
                      @mouseenter="highlightSlice"
                      @mouseleave="unhighlightSlice"
                    />
                  </g>
                  
                  <!-- Círculo central con estadísticas -->
                  <circle cx="140" cy="140" r="65" fill="rgba(255, 255, 255, 0.95)" stroke="rgba(226, 232, 240, 0.8)" stroke-width="3" class="center-circle"/>
                  
                  <!-- Texto central con total de archivos -->
                  <text x="140" y="125" text-anchor="middle" class="text-4xl font-bold text-gray-800 center-number">
                    {{ estadisticas.totalArchivos }}
                  </text>
                  <text x="140" y="145" text-anchor="middle" class="text-sm font-medium text-gray-500 center-label">
                    Total de
                  </text>
                  <text x="140" y="160" text-anchor="middle" class="text-sm font-medium text-gray-500 center-label">
                    archivos
                  </text>
                </svg>
              </div>
            </div>
            
            <!-- Leyenda moderna con círculos de colores y porcentajes -->
            <div class="pie-legend-modern space-y-4 min-w-[200px]">
              <div v-for="(estado, index) in estadisticas.estadosValidacion" 
                   :key="estado.estado" 
                   class="legend-item-modern flex items-center group cursor-pointer"
                   :style="{ '--delay': (index * 0.1 + 0.5) + 's' }"
                   @mouseenter="highlightLegendItem(index)"
                   @mouseleave="unhighlightLegendItem()">
                <!-- Círculo de color con borde brillante -->
                <div class="legend-color-circle" 
                     :style="{ 
                       backgroundColor: getEstadoColorHex(estado.estado),
                       borderColor: getEstadoBorderColor(estado.estado)
                     }"></div>
                
                <!-- Información del estado -->
                <div class="flex-1 ml-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                      {{ estado.estado || 'Sin definir' }}
                    </span>
                    <span class="text-lg font-bold text-gray-900">
                      {{ estado.cantidad }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between mt-1">
                    <span class="text-xs text-gray-500">
                      {{ getEstadoPorcentaje(estado.cantidad) }}
                    </span>
                    <!-- Barra de progreso mini -->
                    <div class="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden ml-2">
                      <div class="h-full rounded-full transition-all duration-700 legend-progress-bar"
                           :style="{ 
                             width: getEstadoPorcentaje(estado.cantidad),
                             backgroundColor: getEstadoBorderColor(estado.estado)
                           }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>        <!-- Gráfico de barras horizontales - Actividad mensual -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Actividad por mes
          </h3>
          <!-- Explicación del cálculo del gráfico -->
          <div class="text-xs text-gray-500 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <strong>Cálculo:</strong> El ancho de cada barra se calcula proporcionalmente al mes con más actividad ({{ estadisticas.maxMesCount }} archivos = 100%). Los demás meses muestran su porcentaje real.
            </p>
          </div>
          <div class="chart-container">
            <!-- El ancho de cada barra se calcula proporcionalmente al mes con más archivos -->
            <div class="bar-chart-horizontal-responsive">
              <div v-for="(mes, index) in estadisticas.actividadMensual" 
                   :key="mes.mes" 
                   class="bar-row-responsive"
                   :style="{ '--delay': index * 0.1 + 's' }">
                
                <!-- Etiqueta del mes (lado izquierdo) -->
                <div class="bar-label-responsive">{{ mes.mes }}</div>
                
                <!-- Contenedor de la barra con fondo gris -->
                <div class="bar-track-responsive">
                  <!-- Barra con ancho dinámico proporcional al porcentaje real -->
                  <div class="bar-fill-responsive" 
                       :style="{ 
                         width: getBarWidth(mes.cantidad, estadisticas.maxMesCount) + '%',
                         backgroundColor: getMonthColor(index)
                       }"
                       :class="{ 'bar-small': isSmallBar(mes.cantidad, estadisticas.maxMesCount) }">
                    <!-- Contenido dentro de la barra: cantidad y porcentaje -->
                    <div class="bar-content-responsive"
                         :class="{ 'text-outside': isSmallBar(mes.cantidad, estadisticas.maxMesCount) }">
                      <span class="bar-text-responsive">{{ mes.cantidad }} ({{ getBarPorcentaje(mes.cantidad, estadisticas.maxMesCount) }})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- Ubicaciones más frecuentes con gráfico de burbujas moderno -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Ubicaciones más frecuentes
        </h3>
        
        <!-- Explicación del gráfico -->
        <div class="text-xs text-gray-500 mb-6 bg-red-50 p-3 rounded-lg border border-red-200">
          <p class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <strong>Bubble Chart:</strong> El tamaño de cada burbuja es proporcional a la frecuencia de archivos por ubicación. Ordenadas de mayor a menor frecuencia.
          </p>
        </div>
        
        <!-- Contenedor de burbujas moderno con layout responsivo -->
        <div class="bubble-chart-modern">
          <!-- Contenedor scrolleable horizontal para dispositivos pequeños -->
          <div class="bubble-container-responsive">
            <div v-for="(ubicacion, index) in estadisticas.ubicacionesFrecuentes.slice(0, 10)" 
                 :key="ubicacion.ubicacion" 
                 class="bubble-modern animate-bubble-grow-modern"
                 :style="{ 
                   '--size': getBubbleSizeModern(ubicacion.cantidad, estadisticas.maxUbicacionCount) + 'px',
                   '--color': getBubbleColorModern(index),
                   '--border-color': getBubbleBorderColor(index),
                   '--delay': index * 0.1 + 's'
                 }">
              <!-- Contenido de la burbuja con texto adaptativo -->
              <div class="bubble-content-modern">
                <div class="bubble-text-modern" :title="ubicacion.ubicacion">
                  {{ getShortLocationName(ubicacion.ubicacion) }}
                </div>
                <div class="bubble-count-modern">
                  {{ ubicacion.cantidad }}
                </div>
                <!-- Porcentaje opcional para ubicaciones principales -->
                <div v-if="index < 3" class="bubble-percentage-modern">
                  {{ getUbicacionPorcentaje(ubicacion.cantidad) }}
                </div>
              </div>
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
// Importar funciones utilitarias centralizadas para manejo de archivos
import { formatFileSize, calculateTotalSize, bytesToMB } from '../utils/fileUtils.js'
import EdificioChart from './EdificioChart.vue'

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

// Configurar axios y URLs del backend
axios.defaults.timeout = 10000
const BACKEND_URL = import.meta.env.DEV 
  ? 'http://localhost:4000/api' 
  : 'https://api.biblioteca.sembrandodatos.com/api'

console.log('EstadisticasView - Backend URL:', BACKEND_URL)

// Función para obtener estadísticas
async function obtenerEstadisticas() {
  try {
    cargando.value = true
    
    // Agregar headers explícitos y configuración
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 15000
    }
    
    console.log('EstadisticasView - Obteniendo datos desde:', `${BACKEND_URL}/archivos`)
    
    // Obtener todos los archivos (sin paginación para estadísticas completas)
    const response = await axios.get(`${BACKEND_URL}/archivos?limit=1000`, config)
    
    console.log('EstadisticasView - Respuesta recibida:', response.status, response.data)
    
    // Extraer los archivos del objeto de respuesta
    const archivos = response.data.items || response.data || []
    
    console.log('EstadisticasView - Archivos obtenidos para estadísticas:', archivos.length)
    console.log('EstadisticasView - Ejemplo de archivo:', archivos[0])

    // Calcular estadísticas
    calcularEstadisticas(archivos)
    
  } catch (error) {
    console.error('EstadisticasView - Error al obtener estadísticas:', error)
    
    // Intentar con URL alternativa
    if (error.response?.status === 404 || error.code === 'ECONNREFUSED') {
      try {
        const fallbackUrl = BACKEND_URL.replace('/api', '')
        console.log('EstadisticasView - Intentando URL fallback:', `${fallbackUrl}/archivos`)
        
        const response = await axios.get(`${fallbackUrl}/archivos?limit=1000`)
        const archivos = response.data.items || response.data || []
        
        console.log('EstadisticasView - Fallback exitoso, archivos:', archivos.length)
        calcularEstadisticas(archivos)
      } catch (fallbackError) {
        console.error('EstadisticasView - Error en fallback:', fallbackError)
        calcularEstadisticasEjemplo()
      }
    } else {
      // Datos de ejemplo en caso de error
      calcularEstadisticasEjemplo()
    }
  } finally {
    cargando.value = false
  }
}

// Función para calcular estadísticas
function calcularEstadisticas(archivos) {
  console.log('EstadisticasView - Calculando estadísticas para', archivos.length, 'archivos')
  
  const ahora = new Date()
  const mesActual = ahora.getMonth() + 1
  const anioActual = ahora.getFullYear()
  
  // Total de archivos
  estadisticas.value.totalArchivos = archivos.length
  
  // Tamaño total con debug detallado
  let tamanoTotal = 0
  archivos.forEach((archivo, index) => {
    const tamano = archivo.tamano || archivo.size || 0
    const tamanoNum = Number(tamano)
    
    if (index < 3) { // Log de los primeros 3 archivos para debug
      console.log(`EstadisticasView - Archivo ${index + 1}:`, {
        nombre: archivo.nombre,
        tamano_original: tamano,
        tamano_convertido: tamanoNum,
        tipo: typeof tamano
      })
    }
    
    if (!isNaN(tamanoNum) && tamanoNum > 0) {
      tamanoTotal += tamanoNum
    }
  })
  
  estadisticas.value.tamanoTotal = tamanoTotal
  console.log('EstadisticasView - Tamaño total calculado:', tamanoTotal, 'bytes')
  console.log('EstadisticasView - Tamaño total formateado:', formatFileSize(tamanoTotal))
  
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

// Funciones auxiliares para los gráficos específicos de estadísticas
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

// Colores modernos y suaves con translucidez para el gráfico de pastel
function getEstadoColorHex(estado) {
  const colores = {
    'Verificado': 'rgba(34, 197, 94, 0.75)',      // Verde suave translúcido
    'Preliminar': 'rgba(251, 191, 36, 0.70)',     // Amarillo suave translúcido  
    'Borrador': 'rgba(107, 114, 128, 0.65)',      // Gris suave translúcido
    'En revisión': 'rgba(59, 130, 246, 0.70)',    // Azul suave translúcido
    'Sin definir': 'rgba(156, 163, 175, 0.60)'    // Gris claro translúcido
  }
  return colores[estado] || 'rgba(156, 163, 175, 0.60)'
}

// Colores de borde brillantes para el efecto resplandeciente
function getEstadoBorderColor(estado) {
  const coloresBorde = {
    'Verificado': 'rgba(34, 230, 120, 0.95)',     // Verde brillante
    'Preliminar': 'rgba(255, 220, 80, 0.95)',     // Amarillo brillante
    'Borrador': 'rgba(140, 150, 180, 0.95)',      // Gris brillante
    'En revisión': 'rgba(80, 150, 255, 0.95)',    // Azul brillante
    'Sin definir': 'rgba(180, 190, 200, 0.90)'    // Gris claro brillante
  }
  return coloresBorde[estado] || 'rgba(180, 190, 200, 0.90)'
}

// Función para calcular la altura basada en el porcentaje respecto al total
function getBarHeight(cantidad, max) {
  return max > 0 ? (cantidad / max) * 100 : 0
}

// Función para calcular el porcentaje que representa un tipo respecto al total de archivos
function getTipoPorcentaje(cantidad) {
  const total = estadisticas.value.totalArchivos
  return total > 0 ? (cantidad / total) * 100 : 0
}

// Función para formatear el porcentaje con un decimal fijo
function getTipoPorcentajeFormateado(cantidad) {
  const porcentaje = getTipoPorcentaje(cantidad)
  return porcentaje.toFixed(1) + '%'
}

// Función para calcular la altura en píxeles basada en el porcentaje
function getAlturaEdificio(cantidad) {
  const porcentaje = getTipoPorcentaje(cantidad)
  const alturaMaxima = 180 // altura máxima en píxeles para el 100%
  const alturaMinima = 20 // altura mínima para tipos con pocos archivos
  
  // Calculamos la altura proporcional exacta al porcentaje
  return Math.max(Math.round((porcentaje / 100) * alturaMaxima), alturaMinima)
}

// El ancho de cada barra se calcula proporcionalmente al mes con más archivos
// Función para calcular el porcentaje real de cada mes respecto al máximo
function getBarWidth(cantidad, max) {
  // Si no hay máximo o la cantidad es 0, retornar 0%
  if (max === 0 || cantidad === 0) return 0
  
  // Calcular el porcentaje real: (count / maxCount) * 100
  // Ejemplo: si hay 8 archivos en julio (máximo) y 4 en mayo, entonces para mayo: (4 / 8) * 100 = 50%
  const porcentaje = (cantidad / max) * 100
  
  // Retornar el porcentaje exacto sin mínimos artificiales
  return porcentaje
}

// Función para obtener el porcentaje formateado para mostrar en la barra
function getBarPorcentaje(cantidad, max) {
  if (max === 0 || cantidad === 0) return '0%'
  const porcentaje = (cantidad / max) * 100
  return Math.round(porcentaje) + '%'
}

function getMonthColor(index) {
  const colores = ['#3b82f6', '#06b6d4', '#10b981', '#84cc16', '#eab308', '#f59e0b']
  return colores[index % colores.length]
}

// Función para determinar si una barra es muy pequeña (menos del 20%)
function isSmallBar(cantidad, max) {
  if (max === 0) return true
  const porcentaje = (cantidad / max) * 100
  return porcentaje < 20
}

// Funciones para el gráfico de pastel moderno
function getPieSlicePathModern(index) {
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
  
  // Radio del pastel más grande para mejor presencia visual
  const radius = 110
  const centerX = 140
  const centerY = 140
  
  // Calcular puntos de inicio y fin para el arco
  const x1 = centerX + radius * Math.cos(startAngle - Math.PI / 2)
  const y1 = centerY + radius * Math.sin(startAngle - Math.PI / 2)
  const x2 = centerX + radius * Math.cos(endAngle - Math.PI / 2)
  const y2 = centerY + radius * Math.sin(endAngle - Math.PI / 2)
  
  // Bandera para arco grande
  const largeArc = percentage > 0.5 ? 1 : 0
  
  // Crear el path del slice con radio mayor
  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
}

// Función para calcular el porcentaje de cada estado
function getEstadoPorcentaje(cantidad) {
  const total = estadisticas.value.totalArchivos
  if (total === 0) return '0%'
  const porcentaje = (cantidad / total) * 100
  return Math.round(porcentaje) + '%'
}

// Funciones para efectos de hover en el gráfico de pastel
function highlightSlice(event) {
  event.target.style.filter = 'brightness(1.1) drop-shadow(0 0 15px rgba(0,0,0,0.3))'
  event.target.style.transform = 'scale(1.02)'
  event.target.style.transformOrigin = '140px 140px'
}

function unhighlightSlice(event) {
  event.target.style.filter = ''
  event.target.style.transform = ''
}

function highlightLegendItem(index) {
  // Efecto visual en el elemento de leyenda correspondiente
  const slices = document.querySelectorAll('.pie-slice-modern')
  if (slices[index]) {
    slices[index].style.filter = 'brightness(1.1) drop-shadow(0 0 15px rgba(0,0,0,0.3))'
    slices[index].style.transform = 'scale(1.02)'
    slices[index].style.transformOrigin = '140px 140px'
  }
}

function unhighlightLegendItem() {
  const slices = document.querySelectorAll('.pie-slice-modern')
  slices.forEach(slice => {
    slice.style.filter = ''
    slice.style.transform = ''
  })
}

// Funciones para el gráfico de burbujas moderno
// Calcula el tamaño de las burbujas de forma proporcional con rango controlado
function getBubbleSizeModern(cantidad, max) {
  const minSize = 70   // Tamaño mínimo para legibilidad
  const maxSize = 140  // Tamaño máximo para evitar que dominen la pantalla
  
  if (max === 0) return minSize
  
  // Calcular tamaño proporcional con escala suave
  const ratio = cantidad / max
  const size = minSize + (ratio * (maxSize - minSize))
  
  return Math.round(size)
}

// Colores modernos con gradientes y translucidez para las burbujas
function getBubbleColorModern(index) {
  const colores = [
    'rgba(239, 68, 68, 0.85)',    // Rojo vibrante
    'rgba(59, 130, 246, 0.85)',   // Azul vibrante
    'rgba(34, 197, 94, 0.85)',    // Verde vibrante
    'rgba(251, 191, 36, 0.85)',   // Amarillo vibrante
    'rgba(168, 85, 247, 0.85)',   // Púrpura vibrante
    'rgba(6, 182, 212, 0.85)',    // Cian vibrante
    'rgba(132, 204, 22, 0.85)',   // Lima vibrante
    'rgba(245, 158, 11, 0.85)',   // Ámbar vibrante
    'rgba(236, 72, 153, 0.85)',   // Rosa vibrante
    'rgba(99, 102, 241, 0.85)'    // Índigo vibrante
  ]
  return colores[index % colores.length]
}

// Colores de borde brillantes para cada burbuja
function getBubbleBorderColor(index) {
  const coloresBorde = [
    'rgba(255, 255, 255, 0.9)',   // Blanco brillante universal
    'rgba(255, 255, 255, 0.9)',   
    'rgba(255, 255, 255, 0.9)',   
    'rgba(255, 255, 255, 0.9)',   
    'rgba(255, 255, 255, 0.9)',   
    'rgba(255, 255, 255, 0.9)',   
    'rgba(255, 255, 255, 0.9)',   
    'rgba(255, 255, 255, 0.9)',   
    'rgba(255, 255, 255, 0.9)',   
    'rgba(255, 255, 255, 0.9)'    
  ]
  return coloresBorde[index % coloresBorde.length]
}

// Función para acortar nombres de ubicaciones largas manteniendo legibilidad
function getShortLocationName(ubicacion) {
  if (!ubicacion) return ''
  
  // Si el nombre es corto, devolverlo completo
  if (ubicacion.length <= 12) return ubicacion
  
  // Para nombres largos, usar abreviaciones inteligentes
  const palabras = ubicacion.split(' ')
  
  if (palabras.length === 1) {
    // Si es una palabra larga, truncar con puntos suspensivos
    return ubicacion.substring(0, 10) + '...'
  } else {
    // Si son múltiples palabras, tomar las primeras letras o palabras más cortas
    if (palabras.length === 2) {
      return palabras[0].substring(0, 6) + ' ' + palabras[1].substring(0, 6)
    } else {
      // Para 3+ palabras, tomar la primera completa y abreviar el resto
      return palabras[0] + ' ' + palabras.slice(1).map(p => p.charAt(0)).join('.')
    }
  }
}

// Función para calcular el porcentaje de cada ubicación
function getUbicacionPorcentaje(cantidad) {
  const total = estadisticas.value.ubicacionesFrecuentes.reduce((sum, u) => sum + u.cantidad, 0)
  if (total === 0) return '0%'
  const porcentaje = (cantidad / total) * 100
  return Math.round(porcentaje) + '%'
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

@keyframes buildingGrow {
  from { 
    height: 0 !important; 
    opacity: 0.3; 
    transform: scaleY(0.1);
  }
  to { 
    height: var(--height) !important; 
    opacity: 1; 
    transform: scaleY(1);
    transform: scaleY(1);
    transform-origin: bottom;
  }
}

@keyframes barGrowHorizontal {
  from { width: 0%; }
  to { width: var(--final-width); }
}

/* Estilos modernos para el gráfico de pastel con efectos premium */
.pie-chart-modern-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.pie-chart-modern {
  position: relative;
  /* Sombra elegante con efecto de elevación */
  filter: drop-shadow(0 8px 32px rgba(59, 130, 246, 0.15)) 
          drop-shadow(0 4px 16px rgba(34, 197, 94, 0.1));
  transition: all 0.3s ease;
}

.pie-chart-modern:hover {
  /* Efecto hover con mayor elevación */
  filter: drop-shadow(0 12px 40px rgba(59, 130, 246, 0.2)) 
          drop-shadow(0 6px 20px rgba(34, 197, 94, 0.15));
  transform: translateY(-2px);
}

.pie-svg-modern {
  /* Efectos de resplandor sutil en el SVG */
  border-radius: 50%;
  background: radial-gradient(circle at center, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(248, 250, 252, 0.8) 100%);
  box-shadow: 
    inset 0 1px 3px rgba(0,0,0,0.05),
    0 0 20px rgba(59, 130, 246, 0.08);
}

.pie-slice-modern {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  stroke-linejoin: round;
  stroke-linecap: round;
  /* Efectos de brillo en cada segmento */
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.1));
}

.pie-slice-modern:hover {
  filter: brightness(1.15) drop-shadow(0 4px 16px rgba(0,0,0,0.2));
  transform-origin: 140px 140px;
}

.center-circle {
  /* Círculo central con sombra interna */
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.08));
}

.center-number {
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 800;
  fill: #1f2937;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.center-label {
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 500;
  fill: #6b7280;
}

/* Leyenda moderna con efectos elegantes */
.pie-legend-modern {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(248, 250, 252, 0.8) 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow: 
    0 4px 16px rgba(0,0,0,0.04),
    0 1px 4px rgba(0,0,0,0.02);
  backdrop-filter: blur(8px);
}

.legend-item-modern {
  padding: 12px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  animation: slideInRight 0.6s ease-out var(--delay, 0s) both;
  border: 1px solid transparent;
}

.legend-item-modern:hover {
  background: rgba(248, 250, 252, 0.8);
  border-color: rgba(226, 232, 240, 0.8);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.legend-color-circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid;
  box-shadow: 
    0 2px 8px rgba(0,0,0,0.15),
    inset 0 1px 2px rgba(255,255,255,0.3);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.legend-item-modern:hover .legend-color-circle {
  transform: scale(1.2);
  box-shadow: 
    0 4px 16px rgba(0,0,0,0.2),
    inset 0 1px 2px rgba(255,255,255,0.4);
}

.legend-progress-bar {
  animation: progressGrow 1s ease-out var(--delay, 0s) both;
}

/* Animaciones modernas y suaves */
@keyframes animate-pie-appear-modern {
  0% {
    opacity: 0;
    transform: scale(0.8) rotate(-10deg);
    filter: blur(2px);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05) rotate(2deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
    filter: blur(0px);
  }
}

@keyframes slideInRight {
  0% {
    opacity: 0;
    transform: translateX(30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}

@keyframes progressGrow {
  0% {
    width: 0%;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}

/* Responsive para el gráfico de pastel moderno */
@media (max-width: 1024px) {
  .pie-chart-modern {
    width: 240px !important;
    height: 240px !important;
  }
  
  .pie-svg-modern {
    width: 240px;
    height: 240px;
  }
  
  .pie-legend-modern {
    margin-top: 20px;
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .pie-chart-modern-container {
    padding: 10px;
  }
  
  .pie-chart-modern {
    width: 200px !important;
    height: 200px !important;
  }
  
  .pie-svg-modern {
    width: 200px;
    height: 200px;
  }
  
  .center-number {
    font-size: 28px;
  }
  
  .pie-legend-modern {
    padding: 16px;
    margin-top: 16px;
  }
  
  .legend-item-modern {
    padding: 8px 12px;
  }
}

@media (max-width: 480px) {
  .pie-chart-modern {
    width: 180px !important;
    height: 180px !important;
  }
  
  .pie-svg-modern {
    width: 180px;
    height: 180px;
  }
  
  .center-number {
    font-size: 24px;
  }
  
  .center-label {
    font-size: 10px;
  }
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

.building-vertical {
  width: 48px;
  background: linear-gradient(to top, var(--color), color-mix(in srgb, var(--color) 90%, white));
  border-radius: 6px 6px 0 0;
  position: relative;
  transition: all 0.3s ease;
  animation: buildingGrow 1.2s ease-out var(--delay, 0s) both;
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
  position: relative;
  min-height: 30px; /* Altura mínima para tipos con pocos archivos */
}

.building-vertical:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.building-windows {
  position: absolute;
  top: 15%;
  left: 10%;
  right: 10%;
  bottom: 10%;
  background-image: 
    linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px);
  background-size: 10px 10px;
  border-radius: 2px;
}

.building-value {
  position: absolute;
  top: -30px; /* Ajustado para dar más espacio */
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  font-weight: bold;
  color: #374151;
  background: white;
  padding: 4px 8px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  white-space: nowrap;
}

.building-value .cantidad {
  font-size: 14px;
  color: #374151;
}

.building-value .porcentaje {
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
}

.building-windows {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 4px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 2px;
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

.animate-building-grow {
  --height: var(--height);
  animation: buildingGrow 1.2s ease-out var(--delay, 0s) both;
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

/* Estilos para gráfico de barras horizontales responsivo */
.bar-chart-horizontal-responsive {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 0;
}

.bar-row-responsive {
  display: flex;
  align-items: center;
  gap: 16px;
  animation: slideInLeft 0.8s ease-out var(--delay, 0s) both;
}

.bar-label-responsive {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  min-width: 140px;
  text-align: right;
  flex-shrink: 0;
  padding-right: 8px;
}

.bar-track-responsive {
  flex: 1;
  height: 40px;
  background: #f3f4f6;
  border-radius: 20px;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
  overflow: visible; /* Cambio para permitir que el contenido sea visible fuera si es necesario */
}

.bar-fill-responsive {
  height: 100%;
  border-radius: 20px;
  position: relative;
  transition: all 0.7s ease; /* Transición suave de 700ms */
  background: linear-gradient(90deg, var(--color, #3b82f6), color-mix(in srgb, var(--color, #3b82f6) 85%, white));
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  animation: barGrowWidth 1.2s ease-out var(--delay, 0s) both;
  /* Ancho mínimo solo para barras con datos */
  min-width: var(--min-width, 0);
}

.bar-fill-responsive:hover {
  transform: scaleY(1.05);
  filter: brightness(1.08);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.bar-content-responsive {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
  white-space: nowrap;
  z-index: 10;
  transition: all 0.3s ease;
}

.bar-text-responsive {
  font-size: 14px;
  font-weight: 700;
}

/* Estilos para barras pequeñas */
.bar-small {
  min-width: 40px; /* Ancho mínimo visual para barras pequeñas */
}

/* Texto fuera de barras pequeñas */
.text-outside {
  right: -80px;
  color: #374151 !important;
  text-shadow: none !important;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Animación mejorada para el crecimiento de las barras */
@keyframes barGrowWidth {
  0% {
    width: 0%;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive para barras horizontales */
@media (max-width: 768px) {
  .bar-chart-horizontal-responsive {
    gap: 14px;
  }
  
  .bar-label-responsive {
    min-width: 120px;
    font-size: 13px;
  }
  
  .bar-track-responsive {
    height: 36px;
  }
  
  .bar-content-responsive {
    right: 10px;
  }
  
  .bar-text-responsive {
    font-size: 13px;
  }
  
  .text-outside {
    right: -70px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .bar-row-responsive {
    gap: 12px;
  }
  
  .bar-label-responsive {
    min-width: 100px;
    font-size: 12px;
  }
  
  .bar-track-responsive {
    height: 32px;
  }
  
  .bar-content-responsive {
    right: 8px;
  }
  
  .bar-text-responsive {
    font-size: 12px;
  }
  
  .text-outside {
    right: -60px;
    font-size: 11px;
    padding: 1px 6px;
  }
}

/* Estilos modernos para gráfico de burbujas con layout responsivo */
.bubble-chart-modern {
  width: 100%;
  padding: 20px 0;
  /* Fondo con gradiente sutil para mayor elegancia */
  background: linear-gradient(135deg, 
    rgba(248, 250, 252, 0.8) 0%, 
    rgba(241, 245, 249, 0.6) 50%,
    rgba(248, 250, 252, 0.8) 100%);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

/* Contenedor responsivo que maneja el overflow horizontal */
.bubble-container-responsive {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: end;
  gap: 20px;
  padding: 20px;
  min-height: 200px;
  /* Para pantallas pequeñas, permitir scroll horizontal */
  overflow-x: auto;
  /* Centrar las burbujas cuando no llenan todo el ancho */
  width: 100%;
}

/* Estilos para cada burbuja moderna con efectos premium */
.bubble-modern {
  /* Tamaño dinámico calculado por JavaScript */
  width: var(--size);
  height: var(--size);
  min-width: 70px;
  min-height: 70px;
  
  /* Forma circular perfecta */
  border-radius: 50%;
  
  /* Gradiente de color con translucidez */
  background: radial-gradient(circle at 30% 30%, 
    color-mix(in srgb, var(--color) 90%, white) 0%,
    var(--color) 70%,
    color-mix(in srgb, var(--color) 80%, black) 100%);
  
  /* Borde brillante blanco */
  border: 3px solid var(--border-color);
  
  /* Sombras múltiples para efecto de elevación */
  box-shadow: 
    0 8px 25px rgba(0,0,0,0.15),
    0 3px 10px rgba(0,0,0,0.1),
    inset 0 1px 3px rgba(255,255,255,0.3);
  
  /* Centro para el contenido */
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Efectos de interacción */
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Evitar que las burbujas se deformen */
  flex-shrink: 0;
  position: relative;
  
  /* Efecto de resplandor sutil */
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.1));
}

.bubble-modern:hover {
  /* Crecimiento suave al hacer hover */
  transform: scale(1.08) translateY(-5px);
  
  /* Sombra más intensa */
  box-shadow: 
    0 12px 35px rgba(0,0,0,0.2),
    0 5px 15px rgba(0,0,0,0.15),
    inset 0 1px 3px rgba(255,255,255,0.4);
  
  /* Mayor resplandor */
  filter: drop-shadow(0 6px 20px rgba(0,0,0,0.15)) brightness(1.05);
  
  /* Asegurar que esté por encima de otras burbujas */
  z-index: 10;
}

/* Contenido dentro de cada burbuja */
.bubble-content-modern {
  text-align: center;
  padding: 8px;
  color: white;
  /* Sombra en el texto para máxima legibilidad */
  text-shadow: 0 2px 4px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3);
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
}

/* Nombre de la ubicación */
.bubble-text-modern {
  font-size: clamp(9px, calc(var(--size) * 0.08), 13px);
  font-weight: 700;
  line-height: 1.1;
  word-break: break-word;
  hyphens: auto;
  /* Limitar el ancho para evitar desbordamiento */
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Número de archivos */
.bubble-count-modern {
  font-size: clamp(11px, calc(var(--size) * 0.12), 18px);
  font-weight: 800;
  line-height: 1;
  margin-top: 1px;
}

/* Porcentaje para ubicaciones principales */
.bubble-percentage-modern {
  font-size: clamp(8px, calc(var(--size) * 0.07), 11px);
  font-weight: 600;
  opacity: 0.9;
  line-height: 1;
  margin-top: 1px;
}

/* Animación de aparición moderna */
.animate-bubble-grow-modern {
  animation: bubbleGrowModern 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) var(--delay, 0s) both;
}

@keyframes bubbleGrowModern {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
    filter: blur(4px);
  }
  50% {
    transform: scale(1.1) rotate(-90deg);
    opacity: 0.8;
    filter: blur(1px);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
    filter: blur(0px);
  }
}

/* Responsive design para diferentes tamaños de pantalla */
@media (max-width: 1024px) {
  .bubble-container-responsive {
    gap: 16px;
    padding: 16px;
  }
  
  .bubble-modern {
    min-width: 60px;
    min-height: 60px;
  }
}

@media (max-width: 768px) {
  .bubble-chart-modern {
    padding: 15px 0;
  }
  
  .bubble-container-responsive {
    gap: 12px;
    padding: 12px;
    /* En móvil, permitir scroll horizontal si es necesario */
    flex-wrap: nowrap;
    justify-content: flex-start;
    overflow-x: auto;
    overflow-y: hidden;
    /* Padding para que no se corten las burbujas en los bordes */
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .bubble-modern {
    min-width: 55px;
    min-height: 55px;
    /* Evitar que se encojan en móvil */
    flex-shrink: 0;
  }
  
  .bubble-content-modern {
    padding: 6px;
  }
}

@media (max-width: 480px) {
  .bubble-container-responsive {
    gap: 10px;
    padding: 10px 15px;
  }
  
  .bubble-modern {
    min-width: 50px;
    min-height: 50px;
    border-width: 2px;
  }
  
  .bubble-content-modern {
    padding: 4px;
    gap: 1px;
  }
  
  .bubble-text-modern {
    font-size: 8px !important;
    -webkit-line-clamp: 1;
    line-clamp: 1;
  }
  
  .bubble-count-modern {
    font-size: 10px !important;
  }
  
  .bubble-percentage-modern {
    display: none; /* Ocultar porcentaje en pantallas muy pequeñas */
  }
}

/* Estilos para gráfico de burbujas original (mantener para compatibilidad) */
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

/* Estilos para el nuevo gráfico de edificios */
.edificios-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  padding: 20px 0;
  height: 300px;
  margin-top: 30px; /* Espacio para las etiquetas de cantidad */
  position: relative;
}

.edificio-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.5s ease-out var(--delay, 0s) both;
  flex: 1;
  max-width: 80px;
  min-width: 50px;
}

.edificio-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  position: relative;
  width: 100%;
}

.edificio {
  width: 50px;
  height: var(--height) !important; /* Altura explícita basada en el porcentaje */
  border-radius: 6px 6px 0 0;
  position: relative;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  animation: buildingGrow 1s ease-out var(--delay, 0s) both;
  background: linear-gradient(to top, var(--color), color-mix(in srgb, var(--color) 90%, white));
  transform-origin: bottom;
  overflow: hidden;
}

.edificio:hover {
  transform: scaleY(1.05);
  box-shadow: 0 8px 20px rgba(0,0,0,0.25);
  z-index: 10;
}

.edificio-ventanas {
  position: absolute;
  top: 10%;
  left: 10%;
  right: 10%;
  bottom:  10%;
  background-image: 
    linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px);
  background-size: 8px 8px;
  border-radius: 2px;
}

.building-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 4px 8px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  z-index: 5;
  min-width: 60px;
  text-align: center;
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
}

.building-cantidad {
  font-size: 15px;
  font-weight: 700;
  color: #374151;
}

.building-porcentaje {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  margin-top: -2px;
}

.building-label {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
  text-align: center;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .edificios-container {
    height: 250px;
    gap: 12px;
    margin-top: 40px;
  }

  .edificio-wrapper {
    max-width: 60px;
    min-width: 40px;
  }
  
  .edificio {
    width: 40px;
  }
  
  .building-stats {
    padding: 3px 6px;
    min-width: 50px;
    top: -38px;
  }
  
  .building-cantidad {
    font-size: 13px;
  }
  
  .building-porcentaje {
    font-size: 10px;
  }
  
  .building-label {
    font-size: 10px;
    max-width: 50px;
    margin-top: 6px;
  }
}

/* Para pantallas muy pequeñas */
@media (max-width: 480px) {
  .edificios-container {
    height: 200px;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 35px;
  }

  .edificio-wrapper {
    max-width: 45px;
    min-width: 35px;
  }
  
  .edificio {
    width: 35px;
  }
  
  .building-stats {
    padding: 2px 4px;
    min-width: 40px;
    top: -32px;
  }
  
  .building-cantidad {
    font-size: 11px;
  }
  
  .building-porcentaje {
    font-size: 9px;
  }
  
  .building-label {
    font-size: 9px;
    max-width: 40px;
    margin-top: 4px;
  }
}
</style>
