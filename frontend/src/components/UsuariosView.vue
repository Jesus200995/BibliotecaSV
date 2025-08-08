<template>
  <div>
    <!-- Título de la página -->
    <div class="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
        <p class="mt-1 text-sm text-gray-500">Administra todos los usuarios del sistema</p>
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

// Función para obtener usuarios
async function fetchUsers() {
  loading.value = true
  error.value = ''
  
  try {
    console.log('Obteniendo usuarios desde:', `${BACKEND_URL}/usuarios`)
    
    // Configurar headers con token de autorización
    const token = localStorage.getItem('authToken')
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 10000
    }
    
    // Agregar token de autorización si existe
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await axios.get(`${BACKEND_URL}/usuarios`, config)
    
    console.log('Usuarios obtenidos:', response.data)
    users.value = response.data || []
    
  } catch (err) {
    console.error('Error al obtener usuarios:', err)
    
    // Manejar diferentes tipos de errores
    if (err.response?.status === 401 || err.response?.status === 403) {
      error.value = 'No tienes permisos para ver los usuarios. Por favor, inicia sesión nuevamente.'
    } else if (err.response?.status === 404) {
      error.value = 'El servicio de usuarios no está disponible.'
    } else if (err.code === 'ECONNREFUSED' || err.code === 'NETWORK_ERROR') {
      error.value = 'No se puede conectar con el servidor. Verifica tu conexión.'
    } else {
      error.value = 'Error al cargar los usuarios. Por favor, intenta nuevamente.'
    }
    
    // En caso de error, mostrar array vacío
    users.value = []
    
  } finally {
    loading.value = false
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
