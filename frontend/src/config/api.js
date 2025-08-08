// Configuración centralizada del API
export const API_CONFIG = {
  // Configuración dinámica basada en el entorno
  BASE_URL: (() => {
    const hostname = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;
    
    console.log('Detectando entorno:', {
      hostname,
      port,
      protocol,
      fullUrl: window.location.href,
      isDev: import.meta.env.DEV,
      mode: import.meta.env.MODE
    });
    
    // Si estamos en desarrollo o localhost, usar el backend local
    if (hostname === 'localhost' || 
        hostname === '127.0.0.1' || 
        import.meta.env.DEV === true ||
        import.meta.env.MODE === 'development' ||
        port === '5173' || 
        port === '5174') {
      console.log('🔧 Usando backend local');
      return 'http://localhost:4000/api'
    }
    
    // En producción: el backend está corriendo directamente en Node.js puerto 4000
    if (hostname === 'biblioteca.sembrandodatos.com') {
      const prodUrl = `${protocol}//biblioteca.sembrandodatos.com:4000/api`;
      console.log('🌐 Usando backend de producción (Node.js directo):', prodUrl);
      return prodUrl;
    }
    
    // Fallback para otros dominios de producción
    const fallbackUrl = import.meta.env.VITE_API_URL || `${protocol}//${hostname}:4000/api`;
    console.log('🌐 Usando backend fallback:', fallbackUrl);
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
