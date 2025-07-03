<template>
  <div>
    <!-- Título de la página y acciones -->
    <div class="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p class="mt-1 text-sm text-gray-500">Gestiona y visualiza todos los archivos del repositorio</p>
      </div>
      
      <!-- Formulario de subida de archivos -->
      <form @submit.prevent="subirArchivo" class="flex flex-wrap sm:flex-nowrap items-center gap-3">
        <div class="relative w-full sm:w-auto">
          <input 
            type="file" 
            id="file-upload"
            @change="seleccionarArchivo" 
            class="hidden" 
          />
          <label 
            for="file-upload" 
            class="w-full sm:w-auto flex items-center gap-2 cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-md transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span class="truncate max-w-[150px]">{{ archivoNombre || 'Seleccionar archivo' }}</span>
          </label>
        </div>
        <button 
          type="submit" 
          class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
          Subir archivo
        </button>
      </form>
    </div>

    <!-- Panel de estadísticas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Total archivos</p>
            <p class="text-2xl font-bold text-gray-800">{{ archivos.length || 0 }}</p>
          </div>
          <div class="rounded-full p-3 bg-blue-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Espacio utilizado</p>
            <p class="text-2xl font-bold text-gray-800">{{ formatSize(totalSize) }}</p>
          </div>
          <div class="rounded-full p-3 bg-green-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Último archivo</p>
            <p class="text-lg font-semibold text-gray-800 truncate">{{ lastFileName || 'Ninguno' }}</p>
          </div>
          <div class="rounded-full p-3 bg-purple-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Formatos distintos</p>
            <p class="text-2xl font-bold text-gray-800">{{ uniqueTypes.length || 0 }}</p>
          </div>
          <div class="rounded-full p-3 bg-orange-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de archivos -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">Listado de archivos</h3>
      </div>

      <!-- Tabla responsiva -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamaño</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="archivo in archivos" :key="archivo.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                <div class="flex items-center">
                  <div class="flex-shrink-0 mr-2">
                    <span v-if="archivo.tipo === 'PDF'" class="bg-red-100 text-red-600 p-1 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    <span v-else-if="archivo.tipo === 'XLSX' || archivo.tipo === 'XLS'" class="bg-green-100 text-green-600 p-1 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm3 1h10v10H6V5zm1 2a1 1 0 100 2h3a1 1 0 100-2H7z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    <span v-else-if="archivo.tipo === 'CSV'" class="bg-yellow-100 text-yellow-600 p-1 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm3 1h10v10H6V5zm1 2a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    <span v-else class="bg-blue-100 text-blue-600 p-1 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <div class="truncate max-w-xs">{{ archivo.nombre }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(archivo.fecha_actualizacion) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                      :class="{
                        'bg-red-100 text-red-800': archivo.tipo === 'PDF',
                        'bg-green-100 text-green-800': archivo.tipo === 'XLSX' || archivo.tipo === 'XLS',
                        'bg-yellow-100 text-yellow-800': archivo.tipo === 'CSV',
                        'bg-blue-100 text-blue-800': !['PDF', 'XLSX', 'XLS', 'CSV'].includes(archivo.tipo)
                      }">
                  {{ archivo.tipo }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatSize(archivo.tamano) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <a :href="`http://localhost:4000/descargas/${archivo.archivo_url}`" 
                     target="_blank" 
                     class="text-blue-600 hover:text-blue-900 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                  <button @click="$emit('ver', archivo.id)" 
                          class="text-blue-600 hover:text-blue-900 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="archivos.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-gray-500">
                <div class="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  <p>No hay archivos disponibles</p>
                  <p class="text-sm mt-1">Sube un archivo para comenzar</p>
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
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const BACKEND_URL = 'http://localhost:4000'
const archivos = ref([])
const archivoSubir = ref(null)
const archivoNombre = ref('')

// Propiedades computadas para estadísticas
const totalSize = computed(() => {
  return archivos.value.reduce((total, archivo) => {
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

onMounted(async () => {
  await cargarArchivos()
})

async function cargarArchivos() {
  try {
    const res = await axios.get(`${BACKEND_URL}/archivos`)
    archivos.value = res.data
  } catch (err) {
    console.error('Error al cargar archivos:', err)
  }
}

function seleccionarArchivo(e) {
  archivoSubir.value = e.target.files[0]
  archivoNombre.value = e.target.files[0]?.name || ''
}

async function subirArchivo() {
  if (!archivoSubir.value) {
    alert("Selecciona un archivo para subir")
    return
  }
  
  try {
    const formData = new FormData()
    formData.append("file", archivoSubir.value)
    
    await axios.post(`${BACKEND_URL}/archivos/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    
    alert("Archivo subido correctamente")
    archivoSubir.value = null
    archivoNombre.value = ''
    await cargarArchivos()
  } catch (err) {
    console.error('Error al subir el archivo:', err)
    alert("Error al subir el archivo: " + (err.response?.data?.error || err.message))
  }
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

function formatSize(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes'
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
