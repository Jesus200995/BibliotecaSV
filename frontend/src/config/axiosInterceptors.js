import axios from 'axios'
import { getAuthToken, API_CONFIG, isTokenValid } from './api'

// Interceptor para añadir automáticamente el token a todas las peticiones
axios.interceptors.request.use(
  config => {
    // Si ya tiene un header Authorization, no hacer nada
    if (config.headers?.Authorization) {
      return config
    }
    
    // Obtener token y añadirlo si existe
    const token = getAuthToken()
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      }
    }
    
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de autenticación (401) y autorización (403)
axios.interceptors.response.use(
  response => response,
  error => {
    // Manejar errores de autenticación/autorización
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('Error de autenticación/autorización:', error.response.data)
      
      // Si es error de token inválido o expirado, intentar notificar al usuario
      if (error.response.data.error?.includes('Token') || 
          error.response.data.detalles?.includes('jwt')) {
        console.warn('Token inválido o expirado, se necesita volver a iniciar sesión')
        
        // Aquí podríamos redirigir al login o mostrar un modal, pero lo dejamos como log
      }
    }
    
    return Promise.reject(error)
  }
)

// Función para configurar los headers por defecto con token
export function setupAxiosDefaults() {
  // Configurar timeout por defecto
  axios.defaults.timeout = API_CONFIG.TIMEOUT
  
  // Configurar headers por defecto
  axios.defaults.headers.common['Content-Type'] = 'application/json'
  axios.defaults.headers.common['Accept'] = 'application/json'
  
  // Añadir token si existe
  const token = getAuthToken()
  if (token && isTokenValid()) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

// Configurar axios al importar este archivo
setupAxiosDefaults()

export default axios
