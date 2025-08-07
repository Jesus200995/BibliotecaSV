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
