import axios from 'axios'

// Configuración base de Axios
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Aquí se puede añadir autenticación si es necesaria
    // config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Manejo global de errores
    if (error.response?.status === 404) {
      console.error('Recurso no encontrado')
    } else if (error.response?.status === 500) {
      console.error('Error interno del servidor')
    } else if (error.code === 'ECONNABORTED') {
      console.error('Timeout de conexión')
    }

    return Promise.reject(error)
  }
)

export default api
