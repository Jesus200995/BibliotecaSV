// Configuración centralizada del API
export const API_CONFIG = {
  // Configuración dinámica basada en el entorno
  BASE_URL: (() => {
    // Si estamos en desarrollo (localhost), usar el backend local
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:4000/api'
    }
    // En producción o si hay variable de entorno específica
    return import.meta.env.VITE_API_URL || 'https://api.biblioteca.sembrandodatos.com/api'
  })(),
  
  APP_URL: import.meta.env.VITE_APP_URL || window.location.origin,
  
  // Configuración de timeouts
  TIMEOUT: 15000,
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

// Función utilitaria para construir URLs
export const buildApiUrl = (endpoint) => {
  const baseUrl = API_CONFIG.BASE_URL
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${baseUrl}${cleanEndpoint}`
}

// Obtener token JWT del localStorage
export const getAuthToken = () => {
  return localStorage.getItem('token')
}

// Función para verificar si el usuario es admin
export const isUserAdmin = () => {
  try {
    // Intentar obtener datos del usuario desde localStorage
    const userData = localStorage.getItem('userData')
    if (!userData) return false
    
    const user = JSON.parse(userData)
    
    // Verificar si tiene rol y si es admin
    if (!user || !user.rol) return false
    
    // Comparación case-insensitive para mayor robustez
    return user.rol.toLowerCase() === 'admin'
  } catch (error) {
    console.error('Error al verificar rol de admin:', error)
    return false
  }
}

// Obtener información del usuario actual
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('userData')
    if (!userData) return null
    
    return JSON.parse(userData)
  } catch (error) {
    console.error('Error al obtener datos de usuario:', error)
    return null
  }
}

// Función para decodificar un token JWT sin validación criptográfica
export const decodeToken = (token) => {
  try {
    if (!token) return null
    
    // Extraer la parte central del token (payload)
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error al decodificar token:', error)
    return null
  }
}

// Verificar si el token es válido (no caducado)
export const isTokenValid = () => {
  try {
    const token = getAuthToken()
    if (!token) return false
    
    const decodedToken = decodeToken(token)
    if (!decodedToken || !decodedToken.exp) return false
    
    // Comprobar expiración
    const expirationTime = decodedToken.exp * 1000 // Convertir a milisegundos
    const currentTime = Date.now()
    
    return expirationTime > currentTime
  } catch (error) {
    console.error('Error al verificar validez del token:', error)
    return false
  }
}

// Función para obtener headers con autenticación
export const getAuthHeaders = () => {
  const token = getAuthToken()
  if (!token) return API_CONFIG.DEFAULT_HEADERS
  
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    'Authorization': `Bearer ${token}`
  }
}

// Configuración de Axios por defecto
export const axiosConfig = {
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
  withCredentials: false // Cambiado a false para evitar problemas CORS en desarrollo
}

console.log('API Config:', {
  baseUrl: API_CONFIG.BASE_URL,
  appUrl: API_CONFIG.APP_URL,
  environment: import.meta.env.MODE,
  hostname: window.location.hostname
})
