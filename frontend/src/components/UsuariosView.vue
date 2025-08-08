<template>
  <div>
    <!-- Título de la página -->
    <div class="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
        <p class="mt-1 text-sm text-gray-500">Administra todos los usuarios del sistema</p>
      </div>
      
      <!-- Botón de recarga -->
      <div class="flex gap-2">
        <button 
          @click="fetchUsers"
          :disabled="loading"
          class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ loading ? 'Cargando...' : 'Recargar' }}
        </button>
      </div>
    </div>
    
    <!-- Estadísticas rápidas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm font-medium">Total de usuarios</p>
            <p class="text-2xl font-bold">{{ users.length || 0 }}</p>
          </div>
          <div class="bg-purple-700/30 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20a3 3 0 117.64.67A3 3 0 017 20zM12 3a4 4 0 110 8 4 4 0 010-8zm5 6a3 3 0 110 6 3 3 0 010-6z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm font-medium">Usuarios activos</p>
            <p class="text-2xl font-bold">{{ activeUsersCount }}</p>
          </div>
          <div class="bg-green-700/30 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm font-medium">Administradores</p>
            <p class="text-2xl font-bold">{{ adminUsersCount }}</p>
          </div>
          <div class="bg-blue-700/30 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-orange-100 text-sm font-medium">Usuarios normales</p>
            <p class="text-2xl font-bold">{{ regularUsersCount }}</p>
          </div>
          <div class="bg-orange-700/30 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de usuarios -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100">
      <div class="p-6 border-b border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20a3 3 0 117.64.67A3 3 0 017 20zM12 3a4 4 0 110 8 4 4 0 010-8zm5 6a3 3 0 110 6 3 3 0 010-6z" />
          </svg>
          Lista de usuarios
        </h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Usuario</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rol</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Estado de carga -->
            <tr v-if="loading" class="text-center">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                <div class="flex justify-center items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando usuarios...
                </div>
              </td>
            </tr>
            
            <!-- Estado sin usuarios -->
            <tr v-else-if="users.length === 0" class="text-center">
              <td colspan="4" class="px-6 py-8 text-gray-500">
                <div class="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20a3 3 0 117.64.67A3 3 0 017 20zM12 3a4 4 0 110 8 4 4 0 010-8zm5 6a3 3 0 110 6 3 3 0 010-6z" />
                  </svg>
                  <p class="text-lg font-medium">No hay usuarios registrados</p>
                  <p class="text-sm text-gray-400 mt-1">Aún no se han creado usuarios en el sistema</p>
                </div>
              </td>
            </tr>
            
            <!-- Lista de usuarios -->
            <tr v-else v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors duration-150">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ user.id }}
              </td>
              
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.usuario }}</div>
                  </div>
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="user.rol === 'admin'" 
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Administrador
                </span>
                <span v-else 
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Usuario
                </span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="user.activo" 
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Activo
                </span>
                <span v-else 
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Inactivo
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mensaje de error -->
    <div v-if="error" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-700 text-sm">{{ error }}</p>
      </div>
    </div>

    <!-- Información de debug -->
    <div class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 class="text-sm font-medium text-blue-800 mb-2">🔧 Información de debugging:</h4>
      <div class="text-xs text-blue-700 space-y-1">
        <p><strong>Backend URL configurada:</strong> {{ BACKEND_URL }}</p>
        <p><strong>Hostname actual:</strong> {{ window.location.hostname }}</p>
        <p><strong>Puerto actual:</strong> {{ window.location.port }}</p>
        <p><strong>URL completa:</strong> {{ window.location.href }}</p>
        <p><strong>Modo:</strong> {{ envMode }}</p>
        <p><strong>Es desarrollo:</strong> {{ envDev }}</p>
        <p><strong>Token presente:</strong> {{ hasToken }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { API_CONFIG } from '../config/api.js'

// Estado reactivo
const users = ref([])
const loading = ref(true)
const error = ref('')

// Exposer window para el template
const window = globalThis.window

// Variables de entorno para el template
const envMode = import.meta.env.MODE || 'No definido'
const envDev = import.meta.env.DEV ? 'Sí' : 'No'

// Configurar URLs del backend
const BACKEND_URL = API_CONFIG.BASE_URL

// Configurar axios con timeout
axios.defaults.timeout = 10000

// Computed properties para estadísticas
const activeUsersCount = computed(() => {
  return users.value.filter(user => user.activo === true).length
})

const adminUsersCount = computed(() => {
  return users.value.filter(user => user.rol === 'admin').length
})

const regularUsersCount = computed(() => {
  return users.value.filter(user => user.rol !== 'admin').length
})

// Computed para información de debug
const hasToken = computed(() => {
  const token = localStorage.getItem('authToken')
  return token && token !== 'null' && token !== 'undefined' ? 'Sí' : 'No'
})

// Función para obtener usuarios
async function fetchUsers() {
  loading.value = true
  error.value = ''
  
  try {
    console.log('=== INICIANDO CARGA DE USUARIOS ===')
    console.log('Backend URL:', BACKEND_URL)
    console.log('URL completa:', `${BACKEND_URL}/usuarios`)
    
    // Configurar headers con token de autorización
    const token = localStorage.getItem('authToken')
    console.log('Token obtenido de localStorage:', token ? `${token.substring(0, 20)}...` : 'No hay token')
    
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 15000 // Aumentar timeout para producción
    }
    
    // Agregar token de autorización si existe
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers['Authorization'] = `Bearer ${token}`
      console.log('Token agregado a headers')
    } else {
      console.warn('No se encontró token de autorización válido')
      error.value = 'Sesión expirada. Por favor, inicia sesión nuevamente.'
      return
    }
    
    console.log('Configuración de la petición:', {
      url: `${BACKEND_URL}/usuarios`,
      headers: config.headers,
      timeout: config.timeout
    })
    
    // Intentar con la URL principal primero
    let response
    try {
      console.log('Intentando petición principal...')
      response = await axios.get(`${BACKEND_URL}/usuarios`, config)
      console.log('✅ Petición principal exitosa')
    } catch (primaryError) {
      console.log('❌ Error en URL principal:', primaryError.message)
      console.log('Detalles del error:', {
        status: primaryError.response?.status,
        statusText: primaryError.response?.statusText,
        data: primaryError.response?.data,
        code: primaryError.code
      })
      
      // Intentar con localhost como fallback (para desarrollo)
      console.log('Intentando con localhost como fallback...')
      try {
        const localhostConfig = { ...config }
        response = await axios.get('http://localhost:4000/api/usuarios', localhostConfig)
        console.log('✅ Fallback localhost exitoso')
      } catch (localhostError) {
        console.log('❌ Fallback localhost falló:', localhostError.message)
        
        // Intentar con el puerto 4000 en el dominio actual (para producción)
        const productionFallback = `${window.location.protocol}//${window.location.hostname}:4000/api/usuarios`;
        console.log('Intentando URL de producción directa:', productionFallback)
        try {
          response = await axios.get(productionFallback, config)
          console.log('✅ Fallback producción exitoso')
        } catch (productionError) {
          console.log('❌ Fallback producción falló:', productionError.message)
          
          // Último intento sin puerto específico
          const basicFallback = `${window.location.protocol}//${window.location.hostname}/api/usuarios`;
          console.log('Intentando URL básica:', basicFallback)
          try {
            response = await axios.get(basicFallback, config)
            console.log('✅ Fallback básico exitoso')
          } catch (basicError) {
            console.log('❌ Todos los fallbacks fallaron')
            // Si todos fallan, lanzar el error original
            throw primaryError
          }
        }
      }
    }
    
    console.log('Respuesta recibida:', response)
    console.log('Status:', response.status)
    console.log('Data:', response.data)
    
    // Validar que la respuesta sea un array
    if (Array.isArray(response.data)) {
      users.value = response.data
      console.log(`✅ ${response.data.length} usuarios cargados exitosamente`)
    } else if (response.data && Array.isArray(response.data.items)) {
      // En caso de que venga paginado
      users.value = response.data.items
      console.log(`✅ ${response.data.items.length} usuarios cargados exitosamente (paginado)`)
    } else {
      console.warn('⚠️ Formato de respuesta inesperado:', response.data)
      users.value = []
    }
    
    console.log('=== USUARIOS CARGADOS EXITOSAMENTE ===')
    
  } catch (err) {
    console.error('=== ERROR AL OBTENER USUARIOS ===')
    console.error('Error completo:', err)
    
    // Manejar diferentes tipos de errores
    if (err.response?.status === 401) {
      error.value = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
      console.log('Error 401: Token expirado o inválido')
      // Opcional: redirigir al login
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
    } else if (err.response?.status === 403) {
      error.value = 'No tienes permisos suficientes para ver los usuarios.'
      console.log('Error 403: Sin permisos')
    } else if (err.response?.status === 404) {
      error.value = 'El servicio de usuarios no está disponible en el servidor.'
      console.log('Error 404: Endpoint no encontrado')
    } else if (err.code === 'ECONNREFUSED' || err.code === 'NETWORK_ERROR') {
      error.value = 'No se puede conectar con el servidor. Verifica tu conexión a internet.'
      console.log('Error de conexión:', err.code)
    } else if (err.code === 'ECONNABORTED') {
      error.value = 'La conexión tardó demasiado. El servidor puede estar sobrecargado.'
      console.log('Error de timeout')
    } else {
      error.value = `Error al cargar los usuarios: ${err.message || 'Error desconocido'}`
      console.log('Error desconocido:', err.message)
    }
    
    // En caso de error, mostrar array vacío
    users.value = []
    
  } finally {
    loading.value = false
    console.log('=== CARGA DE USUARIOS FINALIZADA ===')
  }
}

// Cargar usuarios al montar el componente
onMounted(() => {
  console.log('UsuariosView montado, cargando usuarios...')
  fetchUsers()
})
</script>

<style scoped>
/* Estilos específicos para la vista de usuarios */
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

/* Transiciones suaves para badges */
.inline-flex {
  transition: all 0.2s ease-in-out;
}

/* Animación del spinner */
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
