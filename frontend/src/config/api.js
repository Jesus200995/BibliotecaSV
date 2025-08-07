// Configuración centralizada del API
export const API_CONFIG = {
  // Configuración dinámica basada en el entorno
  BASE_URL: (() => {
    const hostname = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;
    
    console.log('🔍 Detectando entorno para API:', {
      hostname,
      port,
      protocol,
      fullUrl: window.location.href,
      isDev: import.meta.env.DEV,
      mode: import.meta.env.MODE
    });
    
    // Detección de desarrollo local
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isDevPort = port === '5173' || port === '5174' || port === '3000';
    const isDevMode = import.meta.env.DEV === true || import.meta.env.MODE === 'development';
    
    if (isLocalhost || isDevPort || isDevMode) {
      const backendUrl = 'http://localhost:4000/api';
      console.log('🔧 Entorno de desarrollo detectado - Backend local:', backendUrl);
      return backendUrl;
    }
    
    // Detección de producción
    if (hostname === 'biblioteca.sembrandodatos.com') {
      // En producción, el backend está corriendo en el puerto 4000
      const backendUrl = `${protocol}//biblioteca.sembrandodatos.com:4000/api`;
      console.log('🌐 Entorno de producción detectado - Backend puerto 4000:', backendUrl);
      return backendUrl;
    }
    
    // Detección por variable de entorno (si existe)
    if (import.meta.env.VITE_API_URL) {
      const envUrl = import.meta.env.VITE_API_URL;
      console.log('🌍 URL del backend desde variable de entorno:', envUrl);
      return envUrl;
    }
    
    // Fallback inteligente
    const fallbackUrl = `${protocol}//${hostname}:4000/api`;
    console.log('🔄 Usando URL de fallback:', fallbackUrl);
    return fallbackUrl;
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

console.log('🚀 API Config final:', {
  baseUrl: API_CONFIG.BASE_URL,
  appUrl: API_CONFIG.APP_URL,
  environment: import.meta.env.MODE,
  hostname: window.location.hostname,
  isDev: import.meta.env.DEV
});
