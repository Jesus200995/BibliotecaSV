// Configuración centralizada del API
export const API_CONFIG = {
  // USAR VPS DIRECTAMENTE - Backend corriendo en el VPS
  BASE_URL: 'http://31.97.8.51',
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
