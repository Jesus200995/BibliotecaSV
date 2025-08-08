<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Gestión de Usuarios</h1>
      <div class="flex space-x-2">
        <button 
          @click="cargar" 
          class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center"
          :disabled="loading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
               class="h-4 w-4 mr-2" 
               :class="{'animate-spin': loading}" 
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ loading ? 'Cargando...' : 'Refrescar' }}
        </button>
        
        <button 
          v-if="error"
          @click="mostrarDebug = !mostrarDebug" 
          class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <h2>Usuarios del Sistema</h2>
      </header>
      <div class="card-body">
        <div v-if="loading" class="flex justify-center py-8">
          <svg class="animate-spin h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

        <table v-else class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usuarios" :key="u.id">
              <td>{{ u.id }}</td>
              <td>{{ u.usuario }}</td>
              <td>
                <span 
                  :class="[
                    'badge', 
                    u.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 
                    u.rol === 'editor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  ]"
                >
                  {{ u.rol }}
                </span>
              </td>
              <td>
                <span :class="['pill', u.activo ? 'pill--green' : 'pill--gray']">
                  {{ u.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="flex space-x-2">
                <button 
                  @click="abrirModalEditar(u)" 
                  class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors flex items-center text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button 
                  @click="abrirModalEliminar(u)" 
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors flex items-center text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
            <input 
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password" 
              id="contrasena" 
              v-model="usuarioEditando.contrasena" 
              placeholder="Nueva contraseña"
            />
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
const usuarioEditando = ref({
  id: null,
  usuario: '',
  rol: '',
  activo: true,
  contrasena: ''
})
const usuarioEliminar = ref(null)

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
  modalEditar.value = true
}

function cerrarModalEditar() {
  modalEditar.value = false
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
</script>

<style scoped>
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-header {
  background-color: #f9fafb;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.card-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #4b5563;
}

.card-body {
  padding: 1rem 1.5rem;
}

.alert {
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.alert-danger {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.table th {
  text-align: left;
  padding: 0.75rem 1rem;
  background-color: #f3f4f6;
  font-weight: 600;
  color: #4b5563;
  border-bottom: 2px solid #e5e7eb;
}

.table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.table tr:hover {
  background-color: #f9fafb;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: #ede9fe;
  color: #5b21b6;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.pill {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.pill--green {
  background-color: #dcfce7;
  color: #166534;
}

.pill--gray {
  background-color: #f3f4f6;
  color: #4b5563;
}
</style>
