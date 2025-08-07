<template>
  <div class="w-full">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-purple-700 mb-2">Gestión de Usuarios</h1>
      <p class="text-gray-600">Administrar usuarios del sistema</p>
    </div>

    <!-- Indicador de carga -->
    <div v-if="cargando" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      <span class="ml-3 text-gray-600">Cargando usuarios...</span>
    </div>

    <!-- Mensaje de error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-red-700 font-medium">Error al cargar usuarios</span>
      </div>
      <p class="text-red-600 text-sm mt-1">{{ error }}</p>
    </div>

    <!-- Tabla de usuarios -->
    <div v-else class="bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Header de la tabla -->
      <div class="bg-purple-50 px-6 py-4 border-b border-purple-100">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-purple-700">Lista de Usuarios</h2>
          <div class="text-sm text-purple-600">
            Total: {{ usuarios.length }} usuario{{ usuarios.length !== 1 ? 's' : '' }}
          </div>
        </div>
      </div>

      <!-- Contenido de la tabla -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Encabezados -->
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          
          <!-- Cuerpo de la tabla -->
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="usuario in usuarios" :key="usuario.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ usuario.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div class="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ usuario.usuario }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="usuario.rol === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'">
                  {{ usuario.rol }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="usuario.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'">
                  {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
            </tr>
            
            <!-- Mensaje cuando no hay usuarios -->
            <tr v-if="usuarios.length === 0">
              <td colspan="4" class="px-6 py-12 text-center">
                <div class="text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p class="mt-2 text-sm font-medium text-gray-900">No hay usuarios registrados</p>
                  <p class="text-sm text-gray-500">No se encontraron usuarios en el sistema.</p>
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
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Estado reactivo
const usuarios = ref([])
const cargando = ref(true)
const error = ref(null)

// Configurar URL del backend
const BACKEND_URL = import.meta.env.DEV 
  ? 'http://localhost:4000/api' 
  : 'https://api.biblioteca.sembrandodatos.com/api'

console.log('UsuariosView - BACKEND_URL configurada:', BACKEND_URL)

// Cargar usuarios al montar el componente
onMounted(() => {
  cargarUsuarios()
})

// Función para cargar usuarios desde el backend
async function cargarUsuarios() {
  try {
    cargando.value = true
    error.value = null
    
    console.log('UsuariosView - Cargando usuarios desde:', `${BACKEND_URL}/usuarios`)
    
    // Verificar si hay token
    const token = localStorage.getItem('authToken')
    console.log('UsuariosView - Token encontrado:', token ? 'Sí' : 'No')
    
    if (!token) {
      throw new Error('No hay token de autenticación')
    }
    
    const response = await axios.get(`${BACKEND_URL}/usuarios`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000
    })
    
    console.log('UsuariosView - Usuarios recibidos:', response.data)
    
    // Manejar diferentes formatos de respuesta
    if (Array.isArray(response.data)) {
      usuarios.value = response.data
    } else if (response.data.usuarios && Array.isArray(response.data.usuarios)) {
      usuarios.value = response.data.usuarios
    } else if (response.data.success && response.data.usuarios) {
      usuarios.value = response.data.usuarios
    } else {
      console.error('Formato de respuesta inesperado:', response.data)
      usuarios.value = []
    }
    
  } catch (err) {
    console.error('UsuariosView - Error al cargar usuarios:', err)
    
    if (err.response?.status === 403) {
      error.value = 'No tienes permisos para ver los usuarios del sistema'
    } else if (err.response?.status === 401) {
      error.value = 'No estás autorizado para acceder a esta información'
    } else if (err.code === 'ECONNREFUSED') {
      error.value = 'No se pudo conectar con el servidor'
    } else {
      error.value = err.message || 'Error desconocido al cargar usuarios'
    }
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
/* Estilos específicos del componente */
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

/* Hover effect en las filas de la tabla */
tbody tr:hover {
  background-color: #f9fafb;
}

/* Estilos para badges */
.bg-purple-100 {
  background-color: #ede9fe;
}

.text-purple-800 {
  color: #5b21b6;
}

.bg-blue-100 {
  background-color: #dbeafe;
}

.text-blue-800 {
  color: #1e40af;
}

.bg-green-100 {
  background-color: #dcfce7;
}

.text-green-800 {
  color: #166534;
}

.bg-red-100 {
  background-color: #fee2e2;
}

.text-red-800 {
  color: #991b1b;
}
</style>
