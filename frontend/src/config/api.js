// Configuración centralizada del API
export const API_CONFIG = {
  // Configuración dinámica basada en el entorno
  BASE_URL: (() => {
    // En desarrollo (localhost o 127.0.0.1)
    if (import.meta.env.DEV) {
      return 'http://localhost:4000/api'
    }
    
    // En producción, buscar en el orden de prioridad:
    // 1. Variable de entorno específica
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL
    }
    
    // 2. Si estamos en el dominio principal de biblioteca
    if (window.location.hostname.includes('biblioteca.sembrandodatos.com')) {
      return 'https://api.biblioteca.sembrandodatos.com/api'
    }
    
    // 3. Para cualquier otro dominio o IP (como tu VPS), detectar automáticamente
    const protocol = window.location.protocol
    const hostname = window.location.hostname
    const port = window.location.port
    
    // Si hay puerto específico y no es estándar (80, 443)
    if (port && port !== '80' && port !== '443') {
      return `${protocol}//${hostname}:4000/api`
    }
    
    // Si no hay puerto específico, probar primero con /api
    // Esta configuración permite que funcione tanto con proxies como con backends directos
    return `${protocol}//${hostname}/api`
  })(),
  
  APP_URL: import.meta.env.VITE_APP_URL || window.location.origin,
  
  // Configuración de timeouts más larga para VPS
  TIMEOUT: 20000,  // 20 segundos para conexiones más lentas
  
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
