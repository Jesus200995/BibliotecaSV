<template>
  <!-- Modal SIN transiciones para máxima velocidad -->
  <div v-if="archivo" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
    <!-- Contenedor del modal INSTANTÁNEO -->
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-5xl relative overflow-hidden">
      
      <!-- Header del modal -->
      <div class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-8 py-6 relative">
        <!-- Contenido del header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Icono del archivo -->
            <div class="bg-white bg-opacity-20 p-3 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold mb-1 leading-tight">{{ archivo.nombre }}</h2>
              <p class="text-blue-100 text-sm opacity-90">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Actualizado: {{ formatDate(archivo.fecha_actualizacion) }}
              </p>
            </div>
          </div>
          
          <!-- Botón de cerrar -->
          <button 
            @click="$emit('cerrar')" 
            class="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-xl"
          >
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Contenido del modal -->
      <div class="p-8 bg-gradient-to-b from-gray-50 to-white">
        <!-- Grid de información -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          <!-- Información principal -->
          <div class="space-y-6">
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Información General
              </h3>
              <div class="space-y-4">
                <div class="flex justify-between items-start">
                  <span class="text-sm font-medium text-gray-600">Descripción:</span>
                  <span class="text-sm text-gray-800 text-right flex-1 ml-4">{{ archivo.descripcion || 'Sin descripción' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-600">Tipo:</span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ archivo.tipo }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-600">Tamaño:</span>
                  <span class="text-sm text-gray-800 font-mono">{{ formatSize(archivo.tamano) }}</span>
                </div>
              </div>
            </div>

            <!-- Etiquetas -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Etiquetas
              </h3>
              <div class="flex flex-wrap gap-2">
                <template v-if="archivo.etiquetas">
                  <span v-for="(etiqueta, index) in archivo.etiquetas.split(',')" :key="index"
                        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800">
                    {{ etiqueta.trim() }}
                  </span>
                </template>
                <span v-else class="text-sm text-gray-500 italic">Sin etiquetas</span>
              </div>
            </div>
          </div>

          <!-- Información adicional -->
          <div class="space-y-6">
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Detalles del Responsable
              </h3>
              <div class="space-y-4">
                <div class="flex justify-between items-start">
                  <span class="text-sm font-medium text-gray-600">Responsable:</span>
                  <span class="text-sm text-gray-800 text-right flex-1 ml-4">{{ archivo.responsable || 'No especificado' }}</span>
                </div>
                <div class="flex justify-between items-start">
                  <span class="text-sm font-medium text-gray-600">Fuente:</span>
                  <span class="text-sm text-gray-800 text-right flex-1 ml-4">{{ archivo.fuente || 'No especificada' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-600">Validación:</span>
                  <span :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                    archivo.validacion === 'Verificado' ? 'bg-green-100 text-green-800' :
                    archivo.validacion === 'Preliminar' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  ]">
                    {{ archivo.validacion || 'No especificada' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Ubicación y observaciones -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ubicación y Notas
              </h3>
              <div class="space-y-4">
                <div>
                  <span class="text-sm font-medium text-gray-600 block mb-2">Alcance geográfico:</span>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <span class="text-sm text-gray-800">{{ archivo.alcance_geografico || 'No especificado' }}</span>
                  </div>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 block mb-2">Observaciones:</span>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <span class="text-sm text-gray-800">{{ archivo.observaciones || 'Sin observaciones' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botón de descarga -->
        <div class="flex justify-center">
          <a 
            :href="`${BACKEND_URL}/archivos/descargar/${archivo.id}`" 
            target="_blank" 
            class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar Archivo
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  archivo: Object,
})

// URL del backend, primero intentamos localhost y si no funciona usamos la IP del VPS
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

// Función para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return 'No disponible'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Función para formatear el tamaño de archivo
const formatSize = (bytes) => {
  if (!bytes) return '0 KB'
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  
  if (i === 0) return `${bytes} ${sizes[i]}`
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}
</script>

<style scoped>
/* Sin animaciones para velocidad máxima */
button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

a:hover {
  background: linear-gradient(to right, #1d4ed8, #4338ca);
}

/* Responsive ajustments */
@media (max-width: 768px) {
  .max-w-5xl {
    max-width: 95vw;
    margin: 1rem;
  }
  
  .grid-cols-1.lg\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .px-8 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
