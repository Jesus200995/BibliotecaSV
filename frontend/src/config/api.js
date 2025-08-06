// Configuración centralizada del API
export const API_CONFIG = {
  // Configuración dinámica basada en el entorno
  BASE_URL: (() => {
    // Si estamos en desarrollo (localhost), usar el backend local
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:4000/api'
    }
    
    // En producción, verificar primero las variables de entorno
    const envApiUrl = import.meta.env.VITE_API_URL
    if (envApiUrl) {
      return envApiUrl
    }
    
    // Como fallback, construir la URL basada en el hostname actual
    if (window.location.hostname.includes('biblioteca.sembrandodatos.com')) {
      return 'https://api.biblioteca.sembrandodatos.com/api'
    }
    
    // Si no coincide con ningún patrón conocido, usar la URL de producción por defecto
    return 'https://api.biblioteca.sembrandodatos.com/api'
  })(),
  
  APP_URL: import.meta.env.VITE_APP_URL || window.location.origin,
  
  // Configuración de timeouts (más tiempo para producción)
  TIMEOUT: import.meta.env.PROD ? 30000 : 15000,
  
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

// Log de configuración para debugging
console.log('=== API Configuration ===')
console.log('Base URL:', API_CONFIG.BASE_URL)
console.log('App URL:', API_CONFIG.APP_URL)
console.log('Timeout:', API_CONFIG.TIMEOUT)
console.log('Environment:', import.meta.env.MODE)
console.log('Is Production:', import.meta.env.PROD)
console.log('Hostname:', window.location.hostname)
console.log('Full URL:', window.location.href)
console.log('Environment Variables:')
console.log('  VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('  VITE_APP_URL:', import.meta.env.VITE_APP_URL)
console.log('==========================')

// Función para verificar la conectividad del API
export const checkApiHealth = async () => {
  try {
    const response = await fetch(buildApiUrl('/health'), {
      method: 'GET',
      headers: API_CONFIG.DEFAULT_HEADERS,
      signal: AbortSignal.timeout(5000) // 5 segundos de timeout
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('API Health Check - OK:', data)
      return { success: true, data }
    } else {
      console.warn('API Health Check - Error:', response.status, response.statusText)
      return { success: false, error: `HTTP ${response.status}: ${response.statusText}` }
    }
  } catch (error) {
    console.error('API Health Check - Failed:', error)
    return { success: false, error: error.message }
  }
}
