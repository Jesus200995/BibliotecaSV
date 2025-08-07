<template>
  <div>
    <!-- Título de la página -->
    <div class="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Usuarios</h2>
        <p class="mt-1 text-sm text-gray-500">Gestión de usuarios del sistema</p>
      </div>
    </div>
    
    <!-- Estadísticas rápidas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-indigo-100 text-sm font-medium">Total de usuarios</p>
            <p class="text-2xl font-bold">{{ usuarios.length || 0 }}</p>
          </div>
          <div class="bg-indigo-700/30 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.59" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-emerald-100 text-sm font-medium">Usuarios activos</p>
            <p class="text-2xl font-bold">{{ usuariosActivos }}</p>
          </div>
          <div class="bg-emerald-700/30 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-violet-600 to-violet-500 text-white p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-violet-100 text-sm font-medium">Administradores</p>
            <p class="text-2xl font-bold">{{ usuariosAdmin }}</p>
          </div>
          <div class="bg-violet-700/30 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
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
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="cargandoUsuarios" class="animate-pulse">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                <div class="flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5 mr-3 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando usuarios...
                </div>
              </td>
            </tr>
            
            <tr v-else-if="usuarios.length === 0" class="text-center">
              <td colspan="4" class="px-6 py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p class="text-lg font-medium mt-3">No se encontraron usuarios</p>
                <p class="text-sm mt-1">No hay usuarios registrados en el sistema</p>
              </td>
            </tr>
            
            <tr v-else v-for="usuario in usuarios" :key="usuario.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ usuario.id }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                         :class="getRoleColor(usuario.rol)">
                      {{ usuario.usuario.substring(0, 2).toUpperCase() }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ usuario.usuario }}
                    </div>
                  </div>
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getRoleBadgeColor(usuario.rol)">
                  {{ getRoleText(usuario.rol) }}
                </span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg v-if="usuario.activo" class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <span class="text-sm font-medium"
                          :class="usuario.activo ? 'text-green-800' : 'text-red-800'">
                      {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Sistema de Notificaciones -->
    <div class="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      <div 
        v-for="notificacion in notificaciones" 
        :key="notificacion.id"
        class="transform transition-all duration-500 ease-out"
        :class="[
          notificacion.visible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95',
          'bg-white rounded-xl shadow-lg border-l-4 p-4 min-w-[320px]',
          notificacion.tipo === 'success' ? 'border-green-500' : '',
          notificacion.tipo === 'error' ? 'border-red-500' : '',
          notificacion.tipo === 'info' ? 'border-blue-500' : '',
          notificacion.tipo === 'warning' ? 'border-yellow-500' : ''
        ]"
      >
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <!-- Icono de éxito con animación -->
            <div v-if="notificacion.tipo === 'success'" class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <!-- Icono de error -->
            <div v-else-if="notificacion.tipo === 'error'" class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <!-- Icono de información -->
            <div v-else-if="notificacion.tipo === 'info'" class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 leading-relaxed">
              {{ notificacion.mensaje }}
            </p>
          </div>
          <div class="flex-shrink-0">
            <button 
              @click="ocultarNotificacion(notificacion.id)"
              class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Barra de progreso para auto-cierre -->
        <div class="mt-2 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-75 ease-linear"
            :class="[
              notificacion.tipo === 'success' ? 'bg-green-500' : '',
              notificacion.tipo === 'error' ? 'bg-red-500' : '',
              notificacion.tipo === 'info' ? 'bg-blue-500' : ''
            ]"
            style="animation: progressBar 5s linear forwards;"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// Variables reactivas
const usuarios = ref([])
const cargandoUsuarios = ref(false)
const notificaciones = ref([])
let notificacionId = 0

// Configurar axios y URLs
const BACKEND_URL = import.meta.env.DEV 
  ? 'http://localhost:4000/api' 
  : 'https://api.biblioteca.sembrandodatos.com/api'

console.log('UsuariosView - Backend URL:', BACKEND_URL)

// Propiedades computadas para estadísticas
const usuariosActivos = computed(() => {
  return usuarios.value.filter(usuario => usuario.activo === true).length
})

const usuariosAdmin = computed(() => {
  return usuarios.value.filter(usuario => usuario.rol === 'admin').length
})

// Cargar usuarios al montar el componente
onMounted(async () => {
  console.log('UsuariosView montado')
  await cargarUsuarios()
})

async function cargarUsuarios() {
  console.log('UsuariosView - Cargando usuarios...')
  
  try {
    cargandoUsuarios.value = true
    
    // Obtener el token del localStorage
    const token = localStorage.getItem('authToken')
    
    if (!token) {
      console.error('UsuariosView - No hay token de autenticación')
      mostrarNotificacion('No hay token de autenticación válido', 'error')
      return
    }
    
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 15000
    }
    
    console.log('UsuariosView - Petición a:', `${BACKEND_URL}/usuarios`)
    console.log('UsuariosView - Token:', token ? `${token.substring(0, 20)}...` : 'No token')
    
    const response = await axios.get(`${BACKEND_URL}/usuarios`, config)
    
    console.log('UsuariosView - Respuesta:', response.status, response.data)
    
    if (response.data.success) {
      usuarios.value = response.data.usuarios || []
      console.log('UsuariosView - Usuarios cargados:', usuarios.value.length)
    } else {
      console.error('UsuariosView - Error en respuesta:', response.data.error)
      mostrarNotificacion('Error al cargar usuarios: ' + response.data.error, 'error')
    }
    
  } catch (err) {
    console.error('UsuariosView - Error al cargar usuarios:', err)
    
    if (err.response?.status === 403) {
      mostrarNotificacion('No tienes permisos para ver la lista de usuarios', 'error')
    } else if (err.response?.status === 401) {
      mostrarNotificacion('Tu sesión ha expirado. Por favor, inicia sesión nuevamente', 'error')
    } else {
      mostrarNotificacion('Error de conexión con el servidor', 'error')
    }
    
    usuarios.value = []
  } finally {
    cargandoUsuarios.value = false
  }
}

// Funciones de formato y estilo
function getRoleColor(rol) {
  const colors = {
    'admin': 'bg-red-500',
    'user': 'bg-blue-500'
  }
  
  return colors[rol] || 'bg-gray-500'
}

function getRoleBadgeColor(rol) {
  const colors = {
    'admin': 'bg-red-100 text-red-800',
    'user': 'bg-blue-100 text-blue-800'
  }
  
  return colors[rol] || 'bg-gray-100 text-gray-800'
}

function getRoleText(rol) {
  const texts = {
    'admin': 'Administrador',
    'user': 'Usuario'
  }
  
  return texts[rol] || 'Sin definir'
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
  const id = ++notificacionId
  const notificacion = {
    id,
    mensaje,
    tipo, // 'success', 'error', 'info', 'warning'
    visible: true
  }
  
  notificaciones.value.push(notificacion)
  
  // Auto-eliminar después de 5 segundos
  setTimeout(() => {
    ocultarNotificacion(id)
  }, 5000)
}

// Función para ocultar notificaciones
function ocultarNotificacion(id) {
  const index = notificaciones.value.findIndex(n => n.id === id)
  if (index !== -1) {
    notificaciones.value[index].visible = false
    // Eliminar después de la animación
    setTimeout(() => {
      notificaciones.value.splice(index, 1)
    }, 300)
  }
}
</script>

<style scoped>
/* Animación de la barra de progreso */
@keyframes progressBar {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
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

/* Transiciones suaves */
.transition-colors {
  transition-property: color, background-color, border-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-500 {
  transition-duration: 500ms;
}

/* Mejoras para la responsividad */
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

/* Gradientes personalizados para las estadísticas */
.bg-gradient-to-r {
  background: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Estados focus mejorados */
.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Estilo para la tabla responsive */
@media (max-width: 768px) {
  .overflow-x-auto {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
