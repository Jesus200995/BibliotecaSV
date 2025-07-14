import axios from 'axios'

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

console.log('🔧 Configuración de API:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL: API_BASE_URL,
  env: import.meta.env
})

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Log de todas las peticiones para debug
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Petición axios:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers
    })
    return config
  },
  (error) => {
    console.error('❌ Error en interceptor de petición:', error)
    return Promise.reject(error)
  }
)

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas de error (401 - no autorizado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido, limpiar sesión
      logout()
      // Redirigir al login (esto se manejará en el componente principal)
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

// Funciones de autenticación
export const authService = {
  // Realizar login
  async login(usuario, contrasena) {
    try {
      console.log('🔑 Intentando login con:', { usuario, API_BASE_URL })
      
      // Crear una nueva instancia de axios para evitar interceptores globales
      const freshAxios = axios.create({
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      // Usar URL completa directamente
      const loginUrl = `${API_BASE_URL}/login`
      console.log('🎯 URL de login:', loginUrl)
      
      const response = await freshAxios.post(loginUrl, {
        usuario,
        contrasena
      })
      
      console.log('✅ Respuesta del login:', response.data)
      
      if (response.data.success) {
        // Guardar token y datos del usuario
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('user_data', JSON.stringify(response.data.user))
        return {
          success: true,
          user: response.data.user,
          token: response.data.token
        }
      } else {
        return {
          success: false,
          message: response.data.message || 'Error en el login'
        }
      }
    } catch (error) {
      console.error('❌ Error en login:', error)
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
        url: error.config?.url
      })
      
      // Si el error es 404, intentar con diferentes URLs para debug
      if (error.response?.status === 404) {
        console.log('🔍 Intentando URLs alternativas para debug...')
        
        try {
          // Intentar con la URL base sin /api
          const fallbackUrl = 'http://localhost:4000/api/login'
          console.log('🔄 Intentando con URL fallback:', fallbackUrl)
          
          const fallbackResponse = await axios.post(fallbackUrl, {
            usuario,
            contrasena
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          
          if (fallbackResponse.data.success) {
            localStorage.setItem('auth_token', fallbackResponse.data.token)
            localStorage.setItem('user_data', JSON.stringify(fallbackResponse.data.user))
            return {
              success: true,
              user: fallbackResponse.data.user,
              token: fallbackResponse.data.token
            }
          }
        } catch (fallbackError) {
          console.error('❌ Error en URL fallback:', fallbackError)
        }
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      }
    }
  },

  // Verificar token actual
  async verifyToken() {
    try {
      const response = await api.get('/verify')
      if (response.data.success) {
        // Actualizar datos del usuario si es necesario
        localStorage.setItem('user_data', JSON.stringify(response.data.user))
        return {
          success: true,
          user: response.data.user
        }
      }
      return { success: false }
    } catch (error) {
      console.error('Error al verificar token:', error)
      return { success: false }
    }
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  },

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = getToken()
    const userData = getUserData()
    return !!(token && userData)
  },

  // Obtener datos del usuario actual
  getCurrentUser() {
    return getUserData()
  }
}

// Funciones auxiliares
export function getToken() {
  return localStorage.getItem('auth_token')
}

export function getUserData() {
  const userData = localStorage.getItem('user_data')
  return userData ? JSON.parse(userData) : null
}

export function logout() {
  authService.logout()
}

// Exportar la instancia de axios configurada para usar en otros servicios
export { api }

export default authService