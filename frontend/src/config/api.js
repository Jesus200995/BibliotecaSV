// Configuración centralizada del API
export const API_CONFIG = {
  // Usar variable de entorno si está disponible, sino usar localhost para desarrollo
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  APP_URL: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  
  // Configuración de timeouts
  TIMEOUT: 10000,
  
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
  withCredentials: true
}

console.log('API Config:', {
  baseUrl: API_CONFIG.BASE_URL,
  appUrl: API_CONFIG.APP_URL,
  environment: import.meta.env.MODE
})
