<template>
  <div>
    <!-- Título de la página -->
    <div class="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Usuarios</h2>
        <p class="mt-1 text-sm text-gray-500">Gestión de usuarios del sistema</p>
      </div>
    </div>

    <!-- Indicador de error -->
    <div v-if="error" class="mb-6 bg-red-100 border-l-4 border-red-500 p-4 rounded-lg">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">
            {{ error }}
          </p>
        </div>
      </div>
    </div>

    <!-- Lista de usuarios -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Usuario</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rol</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Activo</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" class="animate-pulse">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                <div class="flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando usuarios...
                </div>
              </td>
            </tr>
            
            <tr v-else-if="users.length === 0" class="text-center">
              <td colspan="4" class="px-6 py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p class="text-lg font-medium mt-3">No hay usuarios registrados</p>
              </td>
            </tr>
            
            <tr v-else v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ user.id }}
              </td>
              
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {{ getInitials(user.usuario) }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.usuario }}
                    </div>
                  </div>
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getRolColor(user.rol)">
                  {{ user.rol }}
                </span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getActiveColor(user.activo)">
                  {{ user.activo ? 'Sí' : 'No' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Variables reactivas para el estado
const users = ref([])
const loading = ref(true)
const error = ref('')

// URL del backend configurada dinámicamente - IGUAL QUE ARCHIVOS
const BACKEND_URL = import.meta.env.DEV 
  ? 'http://localhost:4000/api'
  : 'https://api.biblioteca.sembrandodatos.com/api'

// Función para cargar usuarios desde la base de datos PostgreSQL - IGUAL QUE ARCHIVOS
async function fetchUsers() {
  try {
    console.log('UsuariosView - Iniciando carga de usuarios')
    loading.value = true
    error.value = ''
    
    // Configuración para la petición - IGUAL QUE ARCHIVOS
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 15000 // 15 segundos de timeout
    }
    
    console.log('Realizando petición GET a:', `${BACKEND_URL}/usuarios`)
    
    const res = await axios.get(`${BACKEND_URL}/usuarios`, config)
    
    console.log('Respuesta recibida:', res.status, res.data)
    
    // Manejar diferentes formatos de respuesta - IGUAL QUE ARCHIVOS
    if (res.data && res.data.items) {
      users.value = res.data.items
      console.log('Usuarios cargados desde items:', users.value.length)
    } else if (Array.isArray(res.data)) {
      users.value = res.data
      console.log('Usuarios cargados directamente:', users.value.length)
    } else {
      console.warn('Formato de respuesta inesperado:', res.data)
      users.value = []
    }
    
  } catch (err) {
    console.error('Error detallado al cargar usuarios:', {
      message: err.message,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      config: err.config
    })
    
    // Intentar con la URL sin /api como fallback - IGUAL QUE ARCHIVOS
    if (err.response?.status === 404 || err.code === 'ECONNREFUSED') {
      console.log('Intentando URL alternativa...')
      try {
        const fallbackUrl = BACKEND_URL.replace('/api', '')
        console.log('URL fallback:', fallbackUrl)
        
        const res = await axios.get(`${fallbackUrl}/usuarios`)
        console.log('Respuesta fallback:', res.data)
        
        users.value = res.data.items || res.data || []
      } catch (fallbackErr) {
        console.error('Error en fallback:', fallbackErr)
        users.value = []
        error.value = 'Error de conexión con el servidor. Verifica que el backend esté funcionando.'
      }
    } else {
      users.value = []
      error.value = 'Error al cargar los usuarios. Verifica tu conexión con el servidor.'
    }
  } finally {
    loading.value = false
  }
}

// Obtener iniciales del nombre de usuario
function getInitials(username) {
  if (!username) return '?'
  return username.substring(0, 2).toUpperCase()
}

// Función para determinar el color del rol
function getRolColor(rol) {
  const colors = {
    'admin': 'bg-purple-100 text-purple-800',
    'user': 'bg-blue-100 text-blue-800',
    'editor': 'bg-green-100 text-green-800'
  }
  
  return colors[rol] || 'bg-gray-100 text-gray-800'
}

// Función para determinar el color del estado activo
function getActiveColor(activo) {
  return activo 
    ? 'bg-green-100 text-green-800' 
    : 'bg-gray-100 text-gray-800'
}

// Cargar usuarios al montar el componente
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
/* Transiciones suaves */
.transition-colors {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Estados focus mejorados */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Animación de spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Estilos para tabla responsiva */
@media (max-width: 640px) {
  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .py-4 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
}
</style>
