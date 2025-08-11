<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Gestión de Usuarios</h1>
      <div class="flex space-x-3">
        <button 
          @click="cargar" 
          class="glass-button-large glass-purple group"
          :disabled="loading"
          title="Refrescar lista de usuarios"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
               class="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" 
               :class="{'animate-spin': loading}" 
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ loading ? 'Cargando...' : 'Refrescar' }}
        </button>
        
        <button 
          v-if="error"
          @click="mostrarDebug = !mostrarDebug" 
          class="glass-button-large glass-gray group"
          title="Mostrar información de debug"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Info Debug
        </button>
      </div>
    </div>
    
    <!-- Sección de depuración -->
    <div v-if="mostrarDebug && error" class="bg-gray-100 p-4 rounded-md mb-6 text-sm">
      <h3 class="font-bold mb-2">Información de Depuración</h3>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <p><strong>URL API:</strong> {{ BACKEND_URL }}</p>
          <p><strong>Token disponible:</strong> {{ !!localStorage.getItem('authToken') }}</p>
          <p><strong>Usuario disponible:</strong> {{ !!localStorage.getItem('userData') }}</p>
          <p v-if="tokenInfo"><strong>Usuario en token:</strong> {{ tokenInfo.usuario }}</p>
          <p v-if="tokenInfo"><strong>Rol en token:</strong> {{ tokenInfo.rol }}</p>
        </div>
        <div>
          <p><strong>Hora:</strong> {{ new Date().toLocaleTimeString() }}</p>
          <p><strong>Servidor:</strong> {{ modo }}</p>
          <p><button @click="intentarConResolverCORS" class="text-blue-600 underline">Intentar con resolución CORS</button></p>
        </div>
      </div>
    </div>
    
    <section class="card">
      <header class="card-header">
        <div class="flex justify-between items-center">
          <h2>Usuarios del Sistema</h2>
          <button 
            @click="abrirModalAgregar" 
            class="glass-button-large glass-green group"
            title="Crear nuevo usuario"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Usuario
          </button>
        </div>
      </header>
      <div class="card-body">
        <div v-if="loading" class="flex justify-center py-8">
          <svg class="animate-spin h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

        <!-- Tabla responsiva con diseño moderno -->
        <div v-else class="overflow-x-auto">
          <div class="min-w-full inline-block align-middle">
            <!-- Vista de tabla para pantallas grandes -->
            <div class="hidden md:block">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Usuario</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rol</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                    <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="u in usuarios" :key="u.id" class="hover:bg-gray-50 transition-colors duration-200">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ u.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ u.usuario }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        :class="[
                          'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                          u.rol === 'admin' ? 'bg-orange-100 text-orange-800' : 
                          u.rol === 'editor' ? 'bg-blue-100 text-blue-800' : 'bg-blue-100 text-blue-800'
                        ]"
                      >
                        {{ u.rol }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        :class="[
                          'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                          u.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        ]"
                      >
                        {{ u.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <div class="flex justify-center space-x-3">
                        <!-- Botón Editar con efecto de vidrio -->
                        <button 
                          @click="abrirModalEditar(u)" 
                          class="glass-button glass-blue group relative"
                          title="Editar usuario"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <!-- Botón Eliminar con efecto de vidrio -->
                        <button 
                          @click="abrirModalEliminar(u)" 
                          class="glass-button glass-red group relative"
                          title="Eliminar usuario"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Vista de tarjetas para pantallas pequeñas -->
            <div class="md:hidden space-y-4">
              <div 
                v-for="u in usuarios" 
                :key="u.id" 
                class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">{{ u.usuario }}</h3>
                    <p class="text-sm text-gray-500">ID: {{ u.id }}</p>
                  </div>
                  <div class="flex space-x-2">
                    <!-- Botones con efecto de vidrio para móvil -->
                    <button 
                      @click="abrirModalEditar(u)" 
                      class="glass-button glass-blue group"
                      title="Editar usuario"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      @click="abrirModalEliminar(u)" 
                      class="glass-button glass-red group"
                      title="Eliminar usuario"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div class="flex flex-wrap gap-2 mb-3">
                  <span 
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                      u.rol === 'admin' ? 'bg-orange-100 text-orange-800' : 
                      u.rol === 'editor' ? 'bg-blue-100 text-blue-800' : 'bg-blue-100 text-blue-800'
                    ]"
                  >
                    {{ u.rol }}
                  </span>
                  <span 
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                      u.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ u.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Modal Editar Usuario -->
    <div v-if="modalEditar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Editar Usuario</h3>
        <form @submit.prevent="guardarUsuario">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="usuario">
              Usuario:
            </label>
            <input 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text" 
              id="usuario" 
              v-model="usuarioEditando.usuario" 
              placeholder="Usuario"
              required
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="rol">
              Rol:
            </label>
            <select 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="rol" 
              v-model="usuarioEditando.rol"
              required
            >
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="activo">
              Estado:
            </label>
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="activo" 
                v-model="usuarioEditando.activo" 
                class="mr-2"
              />
              <label for="activo">Usuario activo</label>
            </div>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="contrasena">
              Contraseña (dejar en blanco para no cambiar):
            </label>
            <div class="relative">
              <input 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                :type="mostrarContrasenaEdit ? 'text' : 'password'" 
                id="contrasena" 
                v-model="usuarioEditando.contrasena" 
                placeholder="Nueva contraseña"
              />
              <button 
                type="button"
                class="absolute inset-y-0 right-0 px-3 flex items-center"
                @click="mostrarContrasenaEdit = !mostrarContrasenaEdit"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-5 w-5 text-gray-500" 
                  :class="{'text-blue-500': mostrarContrasenaEdit}"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                    v-if="mostrarContrasenaEdit"
                  />
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                    v-if="mostrarContrasenaEdit"
                  />
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" 
                    v-if="!mostrarContrasenaEdit"
                  />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <button 
              type="submit" 
              class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Guardar
            </button>
            <button 
              type="button" 
              @click="cerrarModalEditar" 
              class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal Eliminar Usuario -->
    <div v-if="modalEliminar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Confirmar Eliminación</h3>
        <p class="mb-4">¿Está seguro que desea eliminar al usuario <strong>{{ usuarioEliminar?.usuario }}</strong>?</p>
        <div class="flex justify-end space-x-4">
          <button 
            @click="eliminarUsuario" 
            class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Eliminar
          </button>
          <button 
            @click="cerrarModalEliminar" 
            class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal Agregar Nuevo Usuario -->
    <div v-if="modalAgregar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Nuevo Usuario</h3>
        <form @submit.prevent="crearUsuario">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="nuevoUsuario">
              Usuario:
            </label>
            <input 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text" 
              id="nuevoUsuario" 
              v-model="nuevoUsuario.usuario" 
              placeholder="Nombre de usuario"
              required
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="nuevoRol">
              Rol:
            </label>
            <select 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="nuevoRol" 
              v-model="nuevoUsuario.rol"
              required
            >
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="nuevoActivo">
              Estado:
            </label>
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="nuevoActivo" 
                v-model="nuevoUsuario.activo" 
                class="mr-2"
              />
              <label for="nuevoActivo">Usuario activo</label>
            </div>
          </div>
          
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="nuevaContrasena">
              Contraseña:
            </label>
            <div class="relative">
              <input 
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                :type="mostrarContrasena ? 'text' : 'password'" 
                id="nuevaContrasena" 
                v-model="nuevoUsuario.contrasena" 
                placeholder="Contraseña"
                required
              />
              <button 
                type="button"
                class="absolute inset-y-0 right-0 px-3 flex items-center"
                @click="mostrarContrasena = !mostrarContrasena"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-5 w-5 text-gray-500" 
                  :class="{'text-blue-500': mostrarContrasena}"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                    v-if="mostrarContrasena"
                  />
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                    v-if="mostrarContrasena"
                  />
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" 
                    v-if="!mostrarContrasena"
                  />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <button 
              type="submit" 
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              :disabled="loading"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </span>
              <span v-else>Crear Usuario</span>
            </button>
            <button 
              type="button" 
              @click="cerrarModalAgregar" 
              class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Usar la misma URL base que en el resto de la aplicación
const esDesarrollo = import.meta.env.DEV
const BACKEND_URL = esDesarrollo 
  ? 'http://localhost:4000/api' 
  : 'https://api.biblioteca.sembrandodatos.com/api'
const usuarios = ref([])
const loading = ref(true)
const error = ref('')
const tokenInfo = ref(null)
const mostrarDebug = ref(false)
const modo = ref(esDesarrollo ? 'Desarrollo' : 'Producción')

// Variables para los modales
const modalEditar = ref(false)
const modalEliminar = ref(false)
const modalAgregar = ref(false)
const mostrarContrasena = ref(false)
const mostrarContrasenaEdit = ref(false)
const usuarioEditando = ref({
  id: null,
  usuario: '',
  rol: '',
  activo: true,
  contrasena: ''
})
const usuarioEliminar = ref(null)
const nuevoUsuario = ref({
  usuario: '',
  rol: 'user',
  activo: true,
  contrasena: ''
})

// Comprobar el token al inicio
function verificarToken() {
  const token = localStorage.getItem('authToken')
  if (token) {
    try {
      // Decodificar el token (sin verificar la firma)
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace('-', '+').replace('_', '/')
      const decodedToken = JSON.parse(window.atob(base64))
      tokenInfo.value = decodedToken
      console.log('UsuariosView - Token decodificado:', decodedToken)
      return true
    } catch (e) {
      console.error('UsuariosView - Error al decodificar token:', e)
      return false
    }
  }
  return false
}

async function cargar() {
  console.log('UsuariosView - Intentando cargar usuarios desde:', BACKEND_URL)
  loading.value = true
  error.value = ''
  
  // Verificar el token primero
  if (!verificarToken()) {
    error.value = 'No hay un token de autenticación válido'
    loading.value = false
    return
  }
  
  try {
    const token = localStorage.getItem('authToken')
    console.log('UsuariosView - Token encontrado:', token ? 'Sí' : 'No')
    const res = await fetch(`${BACKEND_URL}/usuarios`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log('UsuariosView - Respuesta recibida:', res.status)
    if (!res.ok) {
      console.error('UsuariosView - Error en la respuesta:', res.status)
      throw new Error(`HTTP ${res.status}`)
    }
    const json = await res.json()
    console.log('UsuariosView - Datos recibidos:', json)
    if (!json.ok) throw new Error(json.error || 'Error')
    usuarios.value = json.data
  } catch (e) {
    console.error('UsuariosView - Error al cargar usuarios:', e);
    error.value = `No se pudo cargar: ${e.message}`
    
    // Intentar con una ruta alternativa si la primera falla
    try {
      console.log('UsuariosView - Intentando con ruta alternativa');
      const token = localStorage.getItem('authToken');
      const altBackendUrl = esDesarrollo 
        ? 'http://localhost:4000' 
        : 'https://api.biblioteca.sembrandodatos.com';
        
      const res = await fetch(`${altBackendUrl}/api/usuarios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('UsuariosView - Respuesta alternativa:', res.status);
      
      if (res.ok) {
        const json = await res.json();
        console.log('UsuariosView - Datos alternativos:', json);
        if (json.ok) {
          usuarios.value = json.data;
          error.value = '';
        }
      }
    } catch (altError) {
      console.error('UsuariosView - Error en ruta alternativa:', altError);
    }
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  console.log('UsuariosView - Componente montado')
  // Verificar si hay un token almacenado
  const token = localStorage.getItem('authToken')
  console.log('UsuariosView - Token en localStorage:', token ? `${token.substring(0, 20)}...` : 'No hay token')
  
  // También intentar recuperar datos del usuario
  const userData = localStorage.getItem('userData')
  console.log('UsuariosView - Datos de usuario en localStorage:', userData ? 'Disponibles' : 'No disponibles')
  
  if (userData) {
    try {
      const user = JSON.parse(userData)
      console.log('UsuariosView - Rol de usuario:', user.rol)
      if (user.rol !== 'admin') {
        error.value = 'Se requieren permisos de administrador para ver esta sección'
        loading.value = false
        return
      }
    } catch (e) {
      console.error('UsuariosView - Error al procesar datos de usuario:', e)
    }
  }
  
  // Cargar los usuarios si todo está correcto
  cargar()
})

// Función para intentar cargar con opciones adicionales para resolver problemas de CORS
async function intentarConResolverCORS() {
  console.log('UsuariosView - Intentando resolver CORS')
  loading.value = true
  try {
    const token = localStorage.getItem('authToken')
    // Usar la URL completa directamente
    const endpoint = esDesarrollo 
      ? 'http://localhost:4000/api/usuarios' 
      : 'https://api.biblioteca.sembrandodatos.com/api/usuarios'
    
    console.log('UsuariosView - Intentando con endpoint directo:', endpoint)
    
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      credentials: 'include'
    })
    console.log('UsuariosView - Respuesta con opciones CORS:', res.status)
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    console.log('UsuariosView - Datos recibidos con CORS:', json)
    
    if (!json.ok) throw new Error(json.error || 'Error')
    usuarios.value = json.data
    error.value = ''
  } catch (e) {
    console.error('UsuariosView - Error al resolver CORS:', e)
    error.value = `Error con opciones CORS: ${e.message}`
  } finally {
    loading.value = false
  }
}

// Funciones para manejar el modal de editar
function abrirModalEditar(usuario) {
  // Clonar usuario para no modificar directamente el objeto original
  usuarioEditando.value = {
    id: usuario.id,
    usuario: usuario.usuario,
    rol: usuario.rol,
    activo: usuario.activo,
    contrasena: '' // La contraseña se deja en blanco inicialmente
  }
  mostrarContrasenaEdit.value = false // Asegurar que la contraseña empiece oculta
  modalEditar.value = true
}

function cerrarModalEditar() {
  modalEditar.value = false
  mostrarContrasenaEdit.value = false // Resetear el estado
}

async function guardarUsuario() {
  loading.value = true
  error.value = ''
  
  try {
    const token = localStorage.getItem('authToken')
    const endpoint = `${BACKEND_URL}/usuarios/${usuarioEditando.value.id}`
    
    console.log('UsuariosView - Guardando cambios de usuario:', usuarioEditando.value.usuario)
    
    // Crear objeto de datos para actualizar
    const datosActualizacion = {
      usuario: usuarioEditando.value.usuario,
      rol: usuarioEditando.value.rol,
      activo: usuarioEditando.value.activo
    }
    
    // Solo incluir la contraseña si se ha ingresado una nueva
    if (usuarioEditando.value.contrasena) {
      datosActualizacion.contrasena = usuarioEditando.value.contrasena
    }
    
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosActualizacion)
    })
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    console.log('UsuariosView - Respuesta actualización:', json)
    
    // Actualizar la lista de usuarios
    await cargar()
    
    // Cerrar el modal
    modalEditar.value = false
  } catch (e) {
    console.error('UsuariosView - Error al actualizar usuario:', e)
    error.value = `No se pudo actualizar: ${e.message}`
  } finally {
    loading.value = false
  }
}

// Funciones para manejar el modal de eliminar
function abrirModalEliminar(usuario) {
  usuarioEliminar.value = usuario
  modalEliminar.value = true
}

function cerrarModalEliminar() {
  modalEliminar.value = false
  usuarioEliminar.value = null
}

async function eliminarUsuario() {
  if (!usuarioEliminar.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    const token = localStorage.getItem('authToken')
    const endpoint = `${BACKEND_URL}/usuarios/${usuarioEliminar.value.id}`
    
    console.log('UsuariosView - Eliminando usuario:', usuarioEliminar.value.usuario)
    
    const res = await fetch(endpoint, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    console.log('UsuariosView - Respuesta eliminación:', json)
    
    // Actualizar la lista de usuarios
    await cargar()
    
    // Cerrar el modal
    cerrarModalEliminar()
  } catch (e) {
    console.error('UsuariosView - Error al eliminar usuario:', e)
    error.value = `No se pudo eliminar: ${e.message}`
  } finally {
    loading.value = false
  }
}

// Funciones para manejar el modal de agregar usuario
function abrirModalAgregar() {
  // Resetear el formulario
  nuevoUsuario.value = {
    usuario: '',
    rol: 'user',
    activo: true,
    contrasena: ''
  }
  mostrarContrasena.value = false // Asegurar que la contraseña empiece oculta
  modalAgregar.value = true
}

function cerrarModalAgregar() {
  modalAgregar.value = false
  mostrarContrasena.value = false // Resetear el estado
}

async function crearUsuario() {
  loading.value = true
  error.value = ''
  
  try {
    const token = localStorage.getItem('authToken')
    // Usar directamente la URL completa para evitar problemas con la ruta
    const endpoint = esDesarrollo 
      ? 'http://localhost:4000/api/usuarios'  
      : 'https://api.biblioteca.sembrandodatos.com/api/usuarios'
    
    console.log('UsuariosView - Creando nuevo usuario:', nuevoUsuario.value.usuario)
    console.log('UsuariosView - URL del endpoint:', endpoint)
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoUsuario.value)
    })
    
    if (!res.ok) {
      console.error('UsuariosView - Error en la respuesta:', res.status)
      
      // Intentar leer el mensaje de error del servidor si está disponible
      try {
        const errorData = await res.json()
        console.error('UsuariosView - Datos del error:', errorData)
        throw new Error(`HTTP ${res.status}: ${errorData.error || 'Error desconocido'}`)
      } catch (jsonError) {
        throw new Error(`HTTP ${res.status}`)
      }
    }
    
    const json = await res.json()
    console.log('UsuariosView - Respuesta creación:', json)
    
    // Actualizar la lista de usuarios
    await cargar()
    
    // Cerrar el modal
    cerrarModalAgregar()
  } catch (e) {
    console.error('UsuariosView - Error al crear usuario:', e)
    error.value = `No se pudo crear el usuario: ${e.message}`
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.card-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #4b5563;
}

.card-body {
  padding: 1.5rem;
}

.alert {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
}

.alert-danger {
  background-color: #fee2e2;
  color: #991b1b;
  border-color: #fecaca;
}

/* Estilos para botones con efecto de vidrio */
.glass-button {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(0);
  transition: all 0.3s ease-in-out;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  
  /* Efecto de vidrio base */
  background: rgba(255, 255, 255, 0.1);
  
  /* Animación hover */
}

.glass-button:hover {
  transform: translateY(-2px) scale(1.1);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.glass-button:active {
  transform: translateY(0) scale(0.95);
}

.glass-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5), 0 0 0 4px rgba(59, 130, 246, 0.3);
}

/* Efecto de ondas al hacer clic */
.glass-button:before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.glass-button:active:before {
  transform: scale(1);
  opacity: 1;
  transition: transform 0s, opacity 0s;
}

/* Botones de vidrio grandes para acciones principales */
.glass-button-large {
  position: relative;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(0);
  transition: all 0.3s ease-in-out;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  font-weight: 500;
  font-size: 0.875rem;
  
  /* Efecto de vidrio base */
  background: rgba(255, 255, 255, 0.1);
}

.glass-button-large:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08);
}

.glass-button-large:active {
  transform: translateY(0) scale(0.98);
}

.glass-button-large:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5), 0 0 0 4px rgba(59, 130, 246, 0.3);
}

/* Efecto de ondas para botones grandes */
.glass-button-large:before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.glass-button-large:active:before {
  transform: scale(1);
  opacity: 1;
  transition: transform 0s, opacity 0s;
}

/* Variantes de color para los botones de vidrio */
.glass-blue {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 197, 253, 0.1) 100%);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #2563eb;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.15);
}

.glass-blue:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(147, 197, 253, 0.2) 100%);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 12px 40px rgba(59, 130, 246, 0.25);
  color: #1d4ed8;
}

.glass-blue:focus {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5), 0 0 0 4px rgba(59, 130, 246, 0.3);
}

.glass-red {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(252, 165, 165, 0.1) 100%);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #dc2626;
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.15);
}

.glass-red:hover {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(252, 165, 165, 0.2) 100%);
  border-color: rgba(239, 68, 68, 0.3);
  box-shadow: 0 12px 40px rgba(239, 68, 68, 0.25);
  color: #b91c1c;
}

.glass-red:focus {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5), 0 0 0 4px rgba(239, 68, 68, 0.3);
}

/* Nuevas variantes de color para botones grandes */
.glass-purple {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(196, 181, 253, 0.1) 100%);
  border: 1px solid rgba(147, 51, 234, 0.2);
  color: #7c3aed;
  box-shadow: 0 8px 32px rgba(147, 51, 234, 0.15);
}

.glass-purple:hover {
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.25) 0%, rgba(196, 181, 253, 0.2) 100%);
  border-color: rgba(147, 51, 234, 0.3);
  box-shadow: 0 12px 40px rgba(147, 51, 234, 0.25);
  color: #6d28d9;
}

.glass-purple:focus {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5), 0 0 0 4px rgba(147, 51, 234, 0.3);
}

.glass-green {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(134, 239, 172, 0.1) 100%);
  border: 1px solid rgba(34, 197, 94, 0.2);
  color: #059669;
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.15);
}

.glass-green:hover {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(134, 239, 172, 0.2) 100%);
  border-color: rgba(34, 197, 94, 0.3);
  box-shadow: 0 12px 40px rgba(34, 197, 94, 0.25);
  color: #047857;
}

.glass-green:focus {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5), 0 0 0 4px rgba(34, 197, 94, 0.3);
}

.glass-gray {
  background: linear-gradient(135deg, rgba(107, 114, 128, 0.15) 0%, rgba(209, 213, 219, 0.1) 100%);
  border: 1px solid rgba(107, 114, 128, 0.2);
  color: #4b5563;
  box-shadow: 0 8px 32px rgba(107, 114, 128, 0.15);
}

.glass-gray:hover {
  background: linear-gradient(135deg, rgba(107, 114, 128, 0.25) 0%, rgba(209, 213, 219, 0.2) 100%);
  border-color: rgba(107, 114, 128, 0.3);
  box-shadow: 0 12px 40px rgba(107, 114, 128, 0.25);
  color: #374151;
}

.glass-gray:focus {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5), 0 0 0 4px rgba(107, 114, 128, 0.3);
}

/* Estilos para tabla responsiva */
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.table th {
  text-align: left;
  padding: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  font-weight: 600;
  color: #475569;
  border-bottom: 2px solid #e2e8f0;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.table tr:hover {
  background-color: #f8fafc;
  transition: background-color 0.2s ease;
}

/* Mejoras visuales para badges y pills */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.pill {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.pill--green {
  background-color: #dcfce7;
  color: #166534;
}

.pill--gray {
  background-color: #f3f4f6;
  color: #4b5563;
}

/* Animaciones suaves */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Aplicar animaciones a elementos de la tabla */
.table tbody tr {
  animation: fadeIn 0.3s ease-out;
}

/* Responsividad mejorada */
@media (max-width: 768px) {
  .card-header {
    padding: 1rem;
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .glass-button {
    width: 2.25rem;
    height: 2.25rem;
  }
  
  .glass-button-large {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 640px) {
  .card-header h2 {
    font-size: 1.125rem;
  }
  
  .glass-button {
    width: 2rem;
    height: 2rem;
  }
  
  .glass-button-large {
    padding: 0.5rem 0.875rem;
    font-size: 0.75rem;
  }
  
  .glass-button-large svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.25rem;
  }
}

/* Efectos de hover mejorados para las tarjetas en móvil */
@media (max-width: 768px) {
  .bg-white.border.border-gray-200 {
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
  }
}

/* Estilos adicionales para mejorar la accesibilidad */
.glass-button:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Mejora en el contraste de texto */
.text-gray-600 {
  color: #4b5563;
}

.text-gray-900 {
  color: #111827;
}

/* Transiciones suaves para elementos interactivos */
.transition-colors {
  transition: color 0.2s ease, background-color 0.2s ease;
}

.transition-shadow {
  transition: box-shadow 0.2s ease;
}

.transition-transform {
  transition: transform 0.2s ease;
}

/* Estilos para el estado de loading */
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

/* Mejoras en el spacing y layout */
.space-x-3 > * + * {
  margin-left: 0.75rem;
}

.space-x-2 > * + * {
  margin-left: 0.5rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

/* Estados hover para elementos de la tabla */
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

/* Bordes y sombras más suaves */
.divide-y > * + * {
  border-top-width: 1px;
  border-color: #e5e7eb;
}

.divide-gray-200 > * + * {
  border-color: #e5e7eb;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
