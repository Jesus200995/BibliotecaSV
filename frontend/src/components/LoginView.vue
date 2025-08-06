<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 flex items-center justify-center p-4">
    <!-- Partículas de fondo -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="particles">
        <div class="particle" v-for="n in 50" :key="n" :style="getParticleStyle(n)"></div>
      </div>
    </div>
    
    <!-- Container principal -->
    <div class="relative w-full max-w-md">
      <!-- Logo y título -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full backdrop-blur-sm mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="1" class="book-cover" />
            <path d="M6 4.5c0 0 3 0.9 6 0.9s6 -0.9 6 -0.9v15c0 0 -3 0.9 -6 0.9s-6 -0.9 -6 -0.9v-15z" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M18 7l0.8 -2.5l0.8 2.5" stroke-width="0.75" stroke-linecap="round"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">BIBLIOTECA SV</h1>
        <p class="text-purple-200 text-sm">Sistema de Gestión de Datos</p>
      </div>

      <!-- Formulario de login -->
      <div class="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white border-opacity-20">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="usuario" class="block text-sm font-medium text-white mb-2">
              Usuario
            </label>
            <div class="relative">
              <input
                type="text"
                id="usuario"
                v-model="formData.usuario"
                required
                class="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
                placeholder="Ingresa tu usuario"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-200 absolute right-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          <div>
            <label for="contrasena" class="block text-sm font-medium text-white mb-2">
              Contraseña
            </label>
            <div class="relative">
              <input
                :type="mostrarContrasena ? 'text' : 'password'"
                id="contrasena"
                v-model="formData.contrasena"
                required
                class="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
                placeholder="Ingresa tu contraseña"
              />
              <button
                type="button"
                @click="mostrarContrasena = !mostrarContrasena"
                class="absolute right-3 top-3.5 text-purple-200 hover:text-white transition duration-200"
              >
                <svg v-if="!mostrarContrasena" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m0 0l3.121 3.121M12 12l3.121-3.121m2.121-2.121L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Mensaje de error -->
          <div v-if="error" class="bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <!-- Botón de login -->
          <button
            type="submit"
            :disabled="cargando"
            class="w-full bg-white text-purple-700 py-3 px-4 rounded-lg font-semibold hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!cargando">Iniciar Sesión</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando sesión...
            </span>
          </button>
        </form>

        <!-- Enlaces adicionales -->
        <div class="mt-6 text-center">
          <p class="text-purple-200 text-sm">
            ¿Problemas con el acceso? 
            <a href="mailto:soporte@sembrandodatos.com" class="text-white hover:underline font-medium">
              Contactar soporte
            </a>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8">
        <p class="text-purple-200 text-sm">
          © 2025 Biblioteca de Datos SV - Todos los derechos reservados
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Definir eventos
const emit = defineEmits(['login-success'])

// Estado reactivo
const formData = ref({
  usuario: 'admin',
  contrasena: 'admin123'
})

const mostrarContrasena = ref(false)
const cargando = ref(false)
const error = ref('')

// Configurar URL del backend
const BACKEND_URL = import.meta.env.DEV 
  ? 'http://localhost:4000/api' 
  : 'https://api.biblioteca.sembrandodatos.com/api'

// Función para manejar el login
const handleLogin = async () => {
  cargando.value = true
  error.value = ''

  try {
    console.log('Intentando login con:', formData.value.usuario)
    
    const response = await axios.post(`${BACKEND_URL}/login`, {
      usuario: formData.value.usuario,
      contrasena: formData.value.contrasena
    })

    if (response.data.success) {
      // Guardar token en localStorage
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('userData', JSON.stringify(response.data.usuario))
      
      console.log('Login exitoso:', response.data.usuario)
      
      // Configurar axios con el token
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      
      // Emitir evento de login exitoso
      emit('login-success', response.data)
      
    } else {
      error.value = response.data.error || 'Error en el login'
    }
    
  } catch (err) {
    console.error('Error en login:', err)
    
    if (err.response?.data?.error) {
      error.value = err.response.data.error
    } else if (err.response?.status === 401) {
      error.value = 'Usuario o contraseña incorrectos'
    } else {
      error.value = 'Error de conexión con el servidor'
    }
  } finally {
    cargando.value = false
  }
}

// Función para generar estilos de partículas
const getParticleStyle = (index) => {
  const size = Math.random() * 4 + 2
  const delay = Math.random() * 10
  const duration = Math.random() * 20 + 10
  const left = Math.random() * 100
  const opacity = Math.random() * 0.6 + 0.1
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity: opacity
  }
}

// Verificar si hay token guardado al montar el componente
onMounted(() => {
  const token = localStorage.getItem('authToken')
  if (token) {
    // Si hay token, verificar si es válido
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    
    // Verificar token con el backend
    axios.get(`${BACKEND_URL}/verify-token`)
      .then(response => {
        if (response.data.success) {
          const userData = localStorage.getItem('userData')
          emit('login-success', {
            token,
            usuario: userData ? JSON.parse(userData) : response.data.usuario
          })
        } else {
          // Token inválido, limpiar
          localStorage.removeItem('authToken')
          localStorage.removeItem('userData')
        }
      })
      .catch(() => {
        // Error al verificar token, limpiar
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
      })
  }
})
</script>

<style scoped>
/* Animaciones de partículas */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float infinite linear;
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
  }
  100% {
    transform: translateY(-10vh) rotate(360deg);
  }
}

/* Efecto glassmorphism */
.backdrop-blur-lg {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* Animación de entrada */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Estilos para inputs */
input::placeholder {
  color: rgba(196, 181, 253, 0.7);
}

input:focus::placeholder {
  color: rgba(196, 181, 253, 0.5);
}

/* Hover effects */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}
</style>
