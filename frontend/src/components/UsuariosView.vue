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
import { API_CONFIG, buildApiUrl } from '../config/api.js'
import { fetchUsuariosDirect } from '../config/api-direct.js'

// Variables reactivas para el estado
const users = ref([])
const loading = ref(true)
const error = ref('')

// Función para cargar usuarios desde la base de datos PostgreSQL
async function fetchUsers() {
  try {
    console.log('UsuariosView - Iniciando carga de usuarios')
    loading.value = true
    error.value = ''
    
    // Configuración para la petición
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: API_CONFIG.TIMEOUT
    }
    
    // Añadir token de autorización si está disponible
    const token = localStorage.getItem('authToken')
    if (token) {
      console.log('UsuariosView - Token encontrado, añadiendo a headers')
      config.headers['Authorization'] = `Bearer ${token}`
    } else {
      console.log('UsuariosView - No se encontró token de autenticación')
    }
    
    // Intentar diferentes rutas en secuencia, priorizando las rutas específicas del backend
    let response = null
    let success = false
    const rutas = [
      '/backend-usuarios',           // Nueva ruta específica del backend
      '/server-usuarios',            // Nueva ruta específica del servidor
      '/test-usuarios',              // Nueva ruta de prueba
      '/api/test-usuarios',          // Nueva ruta de prueba con prefijo
      '/usuarios-publico',           // Ruta directa en index.js
      '/api/usuarios-publico',       // Ruta con prefijo /api en index.js
      '/usuarios/usuarios-publico',  // Ruta dentro del router usuarios
      '/api/usuarios/usuarios-publico', // Ruta con prefijo /api dentro del router usuarios
      '/usuarios/publico',           // Nueva ruta simplificada
      '/api/usuarios/publico',       // Nueva ruta simplificada con prefijo
      '/usuarios',                   // Ruta básica de usuarios
      '/api/usuarios'                // Ruta básica con prefijo
    ]
    
    console.log('UsuariosView - Intentando varias rutas para obtener usuarios reales')
    
    // Intentar cada ruta hasta que una funcione
    for (const ruta of rutas) {
      try {
        const apiUrl = buildApiUrl(ruta)
        console.log(`UsuariosView - Intentando ruta: ${apiUrl}`)
        response = await axios.get(apiUrl, config)
        console.log(`UsuariosView - Éxito con ruta: ${ruta}, usuarios encontrados:`, response.data.length)
        success = true
        break
      } catch (err) {
        console.log(`UsuariosView - Error en ruta ${ruta}:`, err.message)
        continue
      }
    }
    
    // Si todas las rutas fallan, intenta conexión directa al backend
    if (!success) {
      try {
        console.log('UsuariosView - Intentando conexión directa al backend Node.js')
        const usuariosDirectos = await fetchUsuariosDirect()
        
        if (usuariosDirectos && usuariosDirectos.length > 0) {
          users.value = usuariosDirectos
          console.log('UsuariosView - ¡Usuarios obtenidos mediante conexión directa!:', users.value)
          return
        }
      } catch (directError) {
        console.error('UsuariosView - Error en conexión directa:', directError)
      }
    }
    
    // Si aún no tenemos éxito, intentar con URLs modificadas sin el prefijo /api
    if (!success) {
      try {
        console.log('UsuariosView - Intentando conexión directa al backend sin proxy')
        const baseUrl = API_CONFIG.BASE_URL.replace('/api', '')
        const directUrls = [
          `${baseUrl}/backend-usuarios`,
          `${baseUrl}/server-usuarios`,
          `${baseUrl}/test-usuarios`,
          `${baseUrl}/usuarios-publico`,
          `${baseUrl}/usuarios/usuarios-publico`,
          `${baseUrl}/usuarios/publico`,
          `${baseUrl}/usuarios`
        ]
        
        for (const url of directUrls) {
          try {
            console.log(`UsuariosView - Intentando URL directa: ${url}`)
            response = await axios.get(url, config)
            console.log(`UsuariosView - Éxito con URL directa: ${url}`)
            success = true
            break
          } catch (directErr) {
            console.log(`UsuariosView - Error en URL directa ${url}:`, directErr.message)
            continue
          }
        }
      } catch (baseErr) {
        console.error('UsuariosView - Error en conexión directa:', baseErr)
      }
    }
    
    // Si todas las rutas fallan, mostrar mensaje de error
    if (!success) {
      console.error('UsuariosView - No se pudieron obtener los usuarios de la base de datos')
      error.value = 'No se pudieron cargar los usuarios. Verifica la conexión con el servidor.'
      users.value = []
      return
    }
    
    // Guardar datos de los usuarios reales
    console.log('UsuariosView - Respuesta recibida:', response.status, response.data)
    
    // Verificar si la respuesta es HTML en lugar de JSON
    if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      console.warn('UsuariosView - La respuesta contiene HTML en lugar de JSON')
      error.value = 'El servidor devolvió HTML en lugar de datos JSON. Verifica la configuración del proxy.'
      users.value = []
      return
    }
    
    // Extraer usuarios de diferentes formatos de respuesta
    let usuariosData = response.data
    if (response.data.usuarios) {
      // Si la respuesta tiene un wrapper con 'usuarios'
      usuariosData = response.data.usuarios
    } else if (response.data.items) {
      // Si la respuesta tiene un wrapper con 'items'
      usuariosData = response.data.items
    }
    
    // Verificar que tenemos un array
    if (!Array.isArray(usuariosData)) {
      console.error('UsuariosView - La respuesta no contiene un array de usuarios:', usuariosData)
      error.value = 'Los datos de usuarios no tienen el formato esperado.'
      users.value = []
      return
    }
    
    users.value = usuariosData
    console.log('UsuariosView - Usuarios reales cargados desde PostgreSQL:', users.value)
    
  } catch (err) {
    console.error('UsuariosView - Error al cargar usuarios:', err)
    
    // Información detallada del error para depuración
    if (err.response) {
      console.log('UsuariosView - Error de respuesta:', {
        status: err.response.status,
        data: err.response.data,
        headers: err.response.headers
      })
    } else if (err.request) {
      console.log('UsuariosView - Error de request:', err.request)
    }
    
    error.value = 'Error al cargar los usuarios. Verifica tu conexión con el servidor.'
    users.value = []
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
