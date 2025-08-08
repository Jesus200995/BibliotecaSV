// Configuración de API alternativa para conectar directamente al backend
// Este archivo puede usarse cuando el proxy nginx no está funcionando correctamente

// Detectar automáticamente la mejor URL para el backend
const detectBackendUrl = () => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // Si estamos en desarrollo local
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:4000';
  }
  
  // Si estamos en producción, intentar varias opciones
  const possibleUrls = [
    `${protocol}//${hostname}:4000`,              // Puerto directo del backend
    `https://api.${hostname}:4000`,               // Subdominio API con puerto
    `${protocol}//api.${hostname}`,               // Subdominio API sin puerto
    `${protocol}//${hostname}/backend`,           // Ruta backend
    `${protocol}//${hostname}`,                   // Misma URL (con proxy)
  ];
  
  // Por defecto usar la primera opción (conexión directa al puerto 4000)
  return possibleUrls[0];
};

export const API_CONFIG_DIRECT = {
  // Configuración para conexión directa al backend
  BASE_URL: detectBackendUrl(),
  
  // URLs alternativas para probar
  FALLBACK_URLS: [
    'https://api.biblioteca.sembrandodatos.com:4000',
    'http://api.biblioteca.sembrandodatos.com:4000',
    'https://biblioteca.sembrandodatos.com:4000',
    'http://biblioteca.sembrandodatos.com:4000',
    'https://api.biblioteca.sembrandodatos.com',
    'https://biblioteca.sembrandodatos.com',
  ],
  
  // Endpoints específicos del backend que no entran en conflicto
  ENDPOINTS: {
    usuarios: '/backend-usuarios',
    usuariosAlt: '/server-usuarios',
    usuariosTest: '/test-usuarios',
    health: '/health',
    dbStatus: '/db-status'
  },
  
  // Configuración de timeouts más largos para conexiones directas
  TIMEOUT: 20000,
  
  // Headers optimizados para conexión directa
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': window.location.origin
  }
};

// Función para probar múltiples URLs hasta encontrar una que funcione
export const findWorkingBackendUrl = async () => {
  const urlsToTest = [API_CONFIG_DIRECT.BASE_URL, ...API_CONFIG_DIRECT.FALLBACK_URLS];
  
  for (const baseUrl of urlsToTest) {
    try {
      console.log(`Probando backend URL: ${baseUrl}`);
      
      const response = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        headers: API_CONFIG_DIRECT.DEFAULT_HEADERS,
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok') {
          console.log(`✅ Backend encontrado en: ${baseUrl}`);
          return baseUrl;
        }
      }
    } catch (error) {
      console.log(`❌ Error probando ${baseUrl}:`, error.message);
      continue;
    }
  }
  
  throw new Error('No se pudo conectar a ningún backend disponible');
};

// Función para obtener usuarios usando conexión directa
export const fetchUsuariosDirect = async () => {
  const backendUrl = await findWorkingBackendUrl();
  const endpointsToTry = [
    API_CONFIG_DIRECT.ENDPOINTS.usuarios,
    API_CONFIG_DIRECT.ENDPOINTS.usuariosAlt,
    API_CONFIG_DIRECT.ENDPOINTS.usuariosTest,
    '/usuarios-publico',
    '/api/usuarios-publico'
  ];
  
  for (const endpoint of endpointsToTry) {
    try {
      console.log(`Probando endpoint: ${backendUrl}${endpoint}`);
      
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'GET',
        headers: API_CONFIG_DIRECT.DEFAULT_HEADERS,
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Manejar diferentes formatos de respuesta
        let usuarios = [];
        if (Array.isArray(data)) {
          usuarios = data;
        } else if (data.usuarios && Array.isArray(data.usuarios)) {
          usuarios = data.usuarios;
        } else if (data.items && Array.isArray(data.items)) {
          usuarios = data.items;
        }
        
        if (usuarios.length > 0) {
          console.log(`✅ Usuarios obtenidos desde ${backendUrl}${endpoint}:`, usuarios.length);
          return usuarios;
        }
      }
    } catch (error) {
      console.log(`❌ Error en ${endpoint}:`, error.message);
      continue;
    }
  }
  
  throw new Error('No se pudieron obtener usuarios desde ningún endpoint');
};

console.log('Configuración de API directa cargada:', {
  baseUrl: API_CONFIG_DIRECT.BASE_URL,
  fallbackUrls: API_CONFIG_DIRECT.FALLBACK_URLS.length,
  endpoints: API_CONFIG_DIRECT.ENDPOINTS
});
