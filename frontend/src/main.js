import { createApp } from 'vue'
import './style.css'
import './assets/main.css'
import './assets/fullscreen.css'
import App from './App.vue'

// Importar configuración de Axios con interceptores antes de cualquier componente
import './config/axiosInterceptors'

// Verificar si hay un router definido
let router
try {
  router = require('./router').default
} catch (e) {
  console.warn('Router no encontrado, la aplicación funcionará sin enrutamiento')
}

const app = createApp(App)

// Registrar el router si existe
if (router) {
  app.use(router)
}

// Añadir propiedades globales útiles
app.config.globalProperties.$isAdmin = () => {
  try {
    const userData = localStorage.getItem('userData')
    if (!userData) return false
    
    const user = JSON.parse(userData)
    return user && user.rol && user.rol.toLowerCase() === 'admin'
  } catch (e) {
    console.error('Error al verificar rol de admin:', e)
    return false
  }
}

app.mount('#app')
