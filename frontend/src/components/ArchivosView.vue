<template>
  <div>
    <!-- Título de la página -->
    <div class="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Archivos</h2>
        <p class="mt-1 text-sm text-gray-500">Gestiona y visualiza todos los archivos del repositorio</p>
      </div>
    </div>
    
    <!-- Estadísticas rápidas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm font-medium">Total de archivos</p>
            <p class="text-2xl font-bold">
              {{ hayFiltrosActivos ? `${archivosFiltrados.length} / ${archivos.length}` : archivos.length || 0 }}
            </p>
          </div>
          <div class="bg-blue-700/30 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm font-medium">Tamaño total</p>
            <p class="text-2xl font-bold">{{ formatFileSize(totalSize) }}</p>
          </div>
          <div class="bg-green-700/30 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm font-medium">Tipos de archivo</p>
            <p class="text-2xl font-bold">{{ uniqueTypes.length }}</p>
          </div>
          <div class="bg-purple-700/30 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-orange-100 text-sm font-medium">Último archivo</p>
            <p class="text-lg font-bold truncate max-w-[120px]" :title="lastFileName">
              {{ lastFileName || 'N/A' }}
            </p>
          </div>
          <div class="bg-orange-700/30 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de búsqueda y filtros -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100 mb-6">
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            Filtros de búsqueda
          </h3>
          <div v-if="hayFiltrosActivos" class="flex items-center gap-2">
            <span class="text-sm text-green-600 font-medium">{{ archivosFiltrados.length }} resultados</span>
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <!-- Búsqueda general -->
        <div class="mb-4">
          <input 
            v-model="busqueda" 
            type="text" 
            placeholder="Buscar archivos por nombre..." 
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
        
        <!-- Filtros específicos -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <select 
            v-model="filtroTipo" 
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          >
            <option value="">Todos los tipos</option>
            <option v-for="tipo in uniqueTypes" :key="tipo" :value="tipo">{{ tipo }}</option>
          </select>
          
          <select 
            v-model="filtroAnio" 
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          >
            <option value="">Todos los años</option>
            <option v-for="anio in aniosDisponibles" :key="anio" :value="anio">{{ anio }}</option>
          </select>
          
          <input 
            v-model="filtroResponsable" 
            type="text" 
            placeholder="Responsable"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          />
          
          <input 
            v-model="filtroEtiquetas" 
            type="text" 
            placeholder="Etiquetas"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          />
          
          <input 
            v-model="filtroAlcanceGeografico" 
            type="text" 
            placeholder="Ubicación"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          />
          
          <select 
            v-model="filtroValidacion" 
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          >
            <option value="">Todas las validaciones</option>
            <option value="pendiente">Pendiente</option>
            <option value="validado">Validado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>
        
        <!-- Botón para limpiar filtros -->
        <button 
          @click="limpiarFiltros"
          v-show="hayFiltrosActivos"
          class="mt-4 inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Lista de archivos -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Archivo</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tamaño</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Responsable</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="cargandoPagina" class="animate-pulse">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                <div class="flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando archivos...
                </div>
              </td>
            </tr>
            
            <tr v-else-if="archivosFiltrados.length === 0" class="text-center">
              <td colspan="7" class="px-6 py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-lg font-medium mt-3">No se encontraron archivos</p>
                <p class="text-sm mt-1" v-if="hayFiltrosActivos">No se encontraron resultados con los filtros actuales</p>
              </td>
            </tr>
            
            <tr v-else v-for="archivo in archivosFiltrados" :key="archivo.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                         :class="getFileTypeColor(archivo.tipo)">
                      {{ archivo.tipo || 'DOC' }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 max-w-xs truncate" :title="archivo.nombre">
                      {{ archivo.nombre }}
                    </div>
                    <div class="text-sm text-gray-500 max-w-xs truncate" :title="archivo.descripcion">
                      {{ archivo.descripcion || 'Sin descripción' }}
                    </div>
                  </div>
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getFileTypeColor(archivo.tipo)">
                  {{ archivo.tipo || 'DOC' }}
                </span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatFileSize(archivo.tamano) }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ archivo.responsable || 'No especificado' }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(archivo.fecha_actualizacion) }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getValidationColor(archivo.validacion)">
                  {{ getValidationText(archivo.validacion) }}
                </span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-2">
                  <!-- Botón Ver detalles -->
                  <button 
                    @click="$emit('ver', archivo.id)"
                    class="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    title="Ver detalles"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  
                  <!-- Botón Descargar -->
                  <a 
                    :href="`http://localhost:4000/archivos/${archivo.id}/download`"
                    class="w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    target="_blank"
                    title="Descargar archivo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// Definir emits
defineEmits(['ver'])

// Variables reactivas
const archivos = ref([])
const cargandoPagina = ref(false)
const BACKEND_URL = 'http://localhost:4000'

// Variables para búsqueda y filtros
const busqueda = ref("")
const filtroTipo = ref("")
const filtroAnio = ref("")
const filtroResponsable = ref("")
const filtroEtiquetas = ref("")
const filtroAlcanceGeografico = ref("")
const filtroValidacion = ref("")

// Función para limpiar todos los filtros
function limpiarFiltros() {
  busqueda.value = ""
  filtroTipo.value = ""
  filtroAnio.value = ""
  filtroResponsable.value = ""
  filtroEtiquetas.value = ""
  filtroAlcanceGeografico.value = ""
  filtroValidacion.value = ""
}

// Años disponibles para filtrar
const aniosDisponibles = computed(() => {
  const years = archivos.value
    .map(a => (a.fecha_actualizacion || '').substring(0, 4))
    .filter(year => year && /^\d{4}$/.test(year))
  
  return [...new Set(years)].sort().reverse()
})

// Verificar si hay filtros activos
const hayFiltrosActivos = computed(() => {
  return busqueda.value !== "" || filtroTipo.value !== "" || filtroAnio.value !== "" || 
         filtroResponsable.value !== "" || filtroEtiquetas.value !== "" || 
         filtroAlcanceGeografico.value !== "" || filtroValidacion.value !== ""
})

// Archivos filtrados según los criterios de búsqueda
const archivosFiltrados = computed(() => {
  return archivos.value.filter(a => {
    // Filtro por nombre
    const coincideNombre = a.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
    
    // Filtro por tipo
    const coincideTipo = !filtroTipo.value || a.tipo === filtroTipo.value
    
    // Filtro por año
    const coincideAnio = !filtroAnio.value || (a.fecha_actualizacion || '').substring(0, 4) === filtroAnio.value
    
    // Filtro por responsable
    const coincideResp = !filtroResponsable.value || 
                        (a.responsable || '').toLowerCase().includes(filtroResponsable.value.toLowerCase())
    
    // Filtro por etiquetas (búsqueda parcial en múltiples etiquetas)
    const coincideEtiquetas = !filtroEtiquetas.value || 
                             (a.etiquetas || '').toLowerCase().includes(filtroEtiquetas.value.toLowerCase())
    
    // Filtro por alcance geográfico (búsqueda parcial)
    const coincideAlcance = !filtroAlcanceGeografico.value || 
                           (a.alcance_geografico || '').toLowerCase().includes(filtroAlcanceGeografico.value.toLowerCase())
    
    // Filtro por validación (coincidencia exacta)
    const coincideValidacion = !filtroValidacion.value || a.validacion === filtroValidacion.value
    
    return coincideNombre && coincideTipo && coincideAnio && coincideResp && 
           coincideEtiquetas && coincideAlcance && coincideValidacion
  })
})

// Propiedades computadas para estadísticas
const totalSize = computed(() => {
  // Si hay filtros activos, mostrar el tamaño total de los archivos filtrados
  const archivosToSum = hayFiltrosActivos.value ? archivosFiltrados.value : archivos.value
  return archivosToSum.reduce((total, archivo) => {
    return total + (archivo.tamano || 0)
  }, 0)
})

const lastFileName = computed(() => {
  if (archivos.value.length === 0) return null
  
  const sorted = [...archivos.value].sort((a, b) => {
    return new Date(b.fecha_actualizacion) - new Date(a.fecha_actualizacion)
  })
  
  return sorted[0]?.nombre || null
})

const uniqueTypes = computed(() => {
  const types = archivos.value.map(archivo => archivo.tipo)
  return [...new Set(types)]
})

// Funciones de formato
function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDate(dateString) {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function getFileTypeColor(tipo) {
  const colors = {
    'PDF': 'bg-red-500 text-white',
    'DOC': 'bg-blue-500 text-white',
    'DOCX': 'bg-blue-500 text-white',
    'XLS': 'bg-green-500 text-white',
    'XLSX': 'bg-green-500 text-white',
    'PPT': 'bg-orange-500 text-white',
    'PPTX': 'bg-orange-500 text-white',
    'JPG': 'bg-purple-500 text-white',
    'JPEG': 'bg-purple-500 text-white',
    'PNG': 'bg-purple-500 text-white',
    'GIF': 'bg-purple-500 text-white',
    'TXT': 'bg-gray-500 text-white',
    'CSV': 'bg-yellow-500 text-white',
    'ZIP': 'bg-indigo-500 text-white',
    'RAR': 'bg-indigo-500 text-white',
    'SHP': 'bg-teal-500 text-white'
  }
  
  return colors[tipo?.toUpperCase()] || 'bg-gray-400 text-white'
}

function getValidationColor(validacion) {
  const colors = {
    'validado': 'bg-green-100 text-green-800',
    'pendiente': 'bg-yellow-100 text-yellow-800',
    'rechazado': 'bg-red-100 text-red-800'
  }
  
  return colors[validacion] || 'bg-gray-100 text-gray-800'
}

function getValidationText(validacion) {
  const texts = {
    'validado': 'Validado',
    'pendiente': 'Pendiente',
    'rechazado': 'Rechazado'
  }
  
  return texts[validacion] || 'Sin validar'
}

// Cargar archivos al montar el componente
onMounted(async () => {
  await cargarArchivos()
})

async function cargarArchivos() {
  try {
    cargandoPagina.value = true
    
    const res = await axios.get(`${BACKEND_URL}/archivos`)
    
    // Obtener todos los archivos sin paginación para el sidebar
    archivos.value = res.data.items || res.data || []
  } catch (err) {
    console.error('Error al cargar archivos:', err)
  } finally {
    cargandoPagina.value = false
  }
}
</script>

<style scoped>
/* Animación de entrada para elementos */
@keyframes pop-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-pop-in {
  animation: pop-in 0.3s ease-out forwards;
}

/* Efectos hover mejorados */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Estilo para la tabla responsive */
@media (max-width: 768px) {
  .overflow-x-auto {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

/* Gradientes personalizados para las estadísticas */
.bg-gradient-to-r {
  background: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Estados de carga personalizados */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Mejoras visuales para los chips de filtro */
.rounded-full {
  border-radius: 9999px;
}

/* Transiciones suaves */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Estados focus mejorados */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Estilo para los iconos de estado */
.text-green-600 {
  color: #059669;
}

.text-blue-600 {
  color: #2563eb;
}

.text-red-600 {
  color: #dc2626;
}

.text-yellow-600 {
  color: #d97706;
}

/* Mejoras para la responsividad en dispositivos pequeños */
@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .py-4 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
}

/* Animación de spinner personalizada */
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

/* Estilos para los botones de acción con iconos */
.hover\:scale-110:hover {
  transform: scale(1.1);
}

/* Efectos de sombra para los botones circulares */
.bg-blue-100:hover {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.bg-green-100:hover {
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

/* Transiciones suaves para los iconos */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-200 {
  transition-duration: 200ms;
}
</style>
