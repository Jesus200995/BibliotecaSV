<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Historial de Actividades
          </h2>
          <p class="text-sm text-gray-600 mt-1">Registro de todas las actividades del sistema</p>
        </div>
        <button 
          @click="cargarHistoriales" 
          :disabled="cargando"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center"
        >
          <svg v-if="!cargando" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ cargando ? 'Actualizando...' : 'Actualizar' }}
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Filtro por Usuario -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
          <select v-model="filtros.usuario_id" @change="aplicarFiltros" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="">Todos los usuarios</option>
            <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
              {{ usuario.usuario }}
            </option>
          </select>
        </div>

        <!-- Filtro por Archivo -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Archivo ID</label>
          <input 
            v-model="filtros.archivo_id" 
            @input="aplicarFiltros"
            type="number" 
            placeholder="ID del archivo"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
        </div>

        <!-- Filtro Fecha Desde -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Desde</label>
          <input 
            v-model="filtros.desde" 
            @change="aplicarFiltros"
            type="date" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
        </div>

        <!-- Filtro Fecha Hasta -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
          <input 
            v-model="filtros.hasta" 
            @change="aplicarFiltros"
            type="date" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
        </div>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="px-6 py-3 bg-white border-b border-gray-200">
      <div class="flex items-center justify-between text-sm text-gray-600">
        <span>Total de registros: <span class="font-semibold text-purple-600">{{ total }}</span></span>
        <span>Mostrando: {{ historiales.length }} registros</span>
      </div>
    </div>

    <!-- Tabla de Historiales -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha/Hora (CDMX)
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuario
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acción
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Archivo
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Detalle
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              IP
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="cargando">
            <td colspan="6" class="px-6 py-12 text-center">
              <div class="flex items-center justify-center">
                <svg class="animate-spin h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="ml-2 text-gray-600">Cargando historiales...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="historiales.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              No se encontraron registros de historial
            </td>
          </tr>
          <tr v-else v-for="historial in historiales" :key="historial.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatearFechaCDMX(historial.creado_en) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-900">{{ historial.usuario || 'Usuario eliminado' }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="obtenerClaseAccion(historial.accion)">
                {{ historial.accion }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">
                <div class="font-medium">{{ historial.archivo_nombre || 'Archivo eliminado' }}</div>
                <div class="text-gray-500">ID: {{ historial.archivo_id }}</div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              <div class="max-w-xs truncate" :title="historial.detalle">
                {{ historial.detalle || '-' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ historial.ip || '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Mostrando {{ (paginacion.offset) + 1 }} a {{ Math.min(paginacion.offset + paginacion.limit, total) }} de {{ total }} registros
      </div>
      <div class="flex space-x-2">
        <button 
          @click="paginaAnterior" 
          :disabled="paginacion.offset === 0"
          class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <button 
          @click="paginaSiguiente" 
          :disabled="paginacion.offset + paginacion.limit >= total"
          class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { API_CONFIG } from '../config/api.js'

// Estado reactivo
const historiales = ref([])
const usuarios = ref([])
const total = ref(0)
const cargando = ref(false)
const error = ref('')

// Filtros
const filtros = ref({
  usuario_id: '',
  archivo_id: '',
  desde: '',
  hasta: ''
})

// Paginación
const paginacion = ref({
  limit: 50,
  offset: 0
})

// Función para cargar historiales
async function cargarHistoriales() {
  try {
    cargando.value = true
    error.value = ''
    
    // Construir parámetros de consulta
    const params = new URLSearchParams({
      limit: paginacion.value.limit.toString(),
      offset: paginacion.value.offset.toString()
    })
    
    // Agregar filtros si están definidos
    if (filtros.value.usuario_id) params.append('usuario_id', filtros.value.usuario_id)
    if (filtros.value.archivo_id) params.append('archivo_id', filtros.value.archivo_id)
    if (filtros.value.desde) params.append('desde', filtros.value.desde + 'T00:00:00Z')
    if (filtros.value.hasta) params.append('hasta', filtros.value.hasta + 'T23:59:59Z')
    
    console.log('Cargando historiales con parámetros:', params.toString())
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/historiales?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Respuesta del servidor:', data)
    
    if (data.ok) {
      historiales.value = data.data || []
      total.value = data.total || 0
    } else {
      throw new Error(data.error || 'Error desconocido')
    }
    
  } catch (err) {
    console.error('Error al cargar historiales:', err)
    error.value = err.message
    historiales.value = []
    total.value = 0
  } finally {
    cargando.value = false
  }
}

// Función para cargar usuarios para el filtro
async function cargarUsuarios() {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/usuarios`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }
    
    const data = await response.json()
    if (data.ok) {
      usuarios.value = data.data || []
    }
  } catch (err) {
    console.error('Error al cargar usuarios:', err)
  }
}

// Función para formatear fecha en zona horaria de Ciudad de México
function formatearFechaCDMX(fechaUTC) {
  if (!fechaUTC) return '-'
  
  try {
    const fecha = new Date(fechaUTC)
    return new Intl.DateTimeFormat('es-MX', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(fecha)
  } catch (error) {
    console.error('Error al formatear fecha:', error)
    return fechaUTC
  }
}

// Función para obtener clase CSS según la acción
function obtenerClaseAccion(accion) {
  switch (accion) {
    case 'subida':
      return 'bg-green-100 text-green-800'
    case 'descarga':
      return 'bg-blue-100 text-blue-800'
    case 'eliminacion':
      return 'bg-red-100 text-red-800'
    case 'edicion':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Función para aplicar filtros
function aplicarFiltros() {
  paginacion.value.offset = 0 // Reset a primera página
  cargarHistoriales()
}

// Funciones de paginación
function paginaAnterior() {
  if (paginacion.value.offset > 0) {
    paginacion.value.offset = Math.max(0, paginacion.value.offset - paginacion.value.limit)
    cargarHistoriales()
  }
}

function paginaSiguiente() {
  if (paginacion.value.offset + paginacion.value.limit < total.value) {
    paginacion.value.offset += paginacion.value.limit
    cargarHistoriales()
  }
}

// Cargar datos al montar el componente
onMounted(() => {
  cargarUsuarios()
  cargarHistoriales()
})
</script>

<style scoped>
/* Estilos personalizados para mejor presentación */
.table-container {
  max-height: 600px;
  overflow-y: auto;
}

/* Animación para las filas */
tbody tr {
  transition: background-color 0.15s ease-in-out;
}

/* Mejorar el estilo de los badges */
.inline-flex {
  transition: all 0.15s ease-in-out;
}

/* Scroll personalizado para la tabla */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
