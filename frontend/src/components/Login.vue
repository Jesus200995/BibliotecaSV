<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo y título -->
      <div class="text-center">
        <div class="flex justify-center mb-6">
          <div class="book-container-login">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 logo-icon-login" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <!-- Libro base -->
              <rect x="4" y="4" width="16" height="16" rx="1" class="book-cover-login" />
              
              <!-- Páginas animadas -->
              <path d="M6 4.5c0 0 3 0.9 6 0.9s6 -0.9 6 -0.9v15c0 0 -3 0.9 -6 0.9s-6 -0.9 -6 -0.9v-15z" class="book-page-login page-1-login" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M7 4.7c0 0 2.5 0.7 5 0.7s5 -0.7 5 -0.7v14.6c0 0 -2.5 0.7 -5 0.7s-5 -0.7 -5 -0.7v-14.6z" class="book-page-login page-2-login" stroke-width="1.2" stroke-linecap="round"/>
              <path d="M8 4.9c0 0 2 0.5 4 0.5s4 -0.5 4 -0.5v14.2c0 0 -2 0.5 -4 0.5s-4 -0.5 -4 -0.5v-14.2z" class="book-page-login page-3-login" stroke-width="0.9" stroke-linecap="round"/>
              
              <!-- Marcapáginas -->
              <path d="M18 7l0.8 -2.5l0.8 2.5" class="book-bookmark-login" stroke-width="0.75" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
        
        <h2 class="text-3xl font-bold text-white mb-2">
          <span class="sv-title-login tracking-wider">SEMBRANDO VIDA</span>
        </h2>
        <div class="w-48 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-3"></div>
        <p class="text-lg font-semibold text-purple-100 uppercase tracking-wider">
          BIBLIOTECA DE DATOS
        </p>
        <p class="mt-4 text-sm text-purple-200">
          Ingresa tus credenciales para acceder al sistema
        </p>
      </div>

      <!-- Formulario de login -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-white/20">
          <div class="space-y-6">
            <!-- Campo Usuario -->
            <div>
              <label for="usuario" class="block text-sm font-medium text-white mb-2">
                Usuario
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="usuario"
                  name="usuario"
                  type="text"
                  required
                  v-model="formData.usuario"
                  class="block w-full pl-10 pr-3 py-3 border border-white/30 rounded-lg bg-white/20 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                  placeholder="Ingresa tu usuario"
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Campo Contraseña -->
            <div>
              <label for="contrasena" class="block text-sm font-medium text-white mb-2">
                Contraseña
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  required
                  v-model="formData.contrasena"
                  class="block w-full pl-10 pr-3 py-3 border border-white/30 rounded-lg bg-white/20 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                  placeholder="Ingresa tu contraseña"
                  :disabled="loading"
                />
              </div>
            </div>
          </div>

          <!-- Mensaje de error -->
          <div v-if="errorMessage" class="mt-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-red-200 text-sm">{{ errorMessage }}</span>
            </div>
          </div>

          <!-- Botón de login -->
          <div class="mt-6">
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!loading" class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Iniciar Sesión
              </span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </span>
            </button>
          </div>
        </div>
      </form>

      <!-- Información adicional -->
      <div class="text-center">
        <p class="text-xs text-purple-200">
          Sistema de gestión documental seguro
        </p>
        <p class="text-xs text-purple-300 mt-1">
          © 2025 Biblioteca de Datos - Todos los derechos reservados
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { authService } from '../services/auth.js'

// Definir eventos que el componente puede emitir
const emit = defineEmits(['login-success'])

// Estado reactivo
const loading = ref(false)
const errorMessage = ref('')

// Datos del formulario
const formData = reactive({
  usuario: '',
  contrasena: ''
})

// Función para manejar el login
async function handleLogin() {
  if (loading.value) return
  
  // Limpiar mensaje de error previo
  errorMessage.value = ''
  
  // Validar campos
  if (!formData.usuario.trim() || !formData.contrasena.trim()) {
    errorMessage.value = 'Por favor, completa todos los campos'
    return
  }
  
  loading.value = true
  
  try {
    const result = await authService.login(formData.usuario.trim(), formData.contrasena)
    
    if (result.success) {
      // Login exitoso
      emit('login-success', result.user)
    } else {
      // Mostrar mensaje de error específico basado en el tipo de error
      if (result.error === 'usuario_no_encontrado') {
        errorMessage.value = `El usuario "${formData.usuario}" no existe o está inactivo`
      } else if (result.error === 'contrasena_incorrecta') {
        errorMessage.value = 'La contraseña ingresada es incorrecta'
      } else {
        errorMessage.value = result.message || 'Error en las credenciales'
      }
    }
  } catch (error) {
    console.error('Error en login:', error)
    errorMessage.value = 'Error de conexión con el servidor. Verifica tu conexión e inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Estilos específicos para el login */
.book-container-login {
  filter: drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.3));
  perspective: 800px;
  transform-style: preserve-3d;
}

.logo-icon-login {
  color: #f3e8ff; /* Morado muy claro para el logo */
  overflow: visible;
}

.book-cover-login {
  stroke: #c4b5fd; /* Morado claro para la cubierta del libro */
  stroke-width: 1.5;
  fill: rgba(196, 181, 253, 0.3); /* Morado con transparencia */
  filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.2));
}

.book-page-login {
  stroke: #f3e8ff; /* Morado muy claro para las páginas */
  fill: rgba(255, 255, 255, 0.95); /* Páginas blancas con ligera transparencia */
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.8));
}

.book-bookmark-login {
  stroke: #fb7185; /* Color rosa para el marcapáginas */
  stroke-width: 1.25;
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.9));
}

.sv-title-login {
  letter-spacing: 0.05em;
  font-family: "Montserrat", "Segoe UI", Roboto, -apple-system, sans-serif;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Animaciones para las páginas del libro en login */
.page-1-login {
  animation: page-turn-login 4s ease-in-out infinite;
  transform-origin: center left;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.page-2-login {
  animation: page-turn-login 4.5s ease-in-out 1.2s infinite;
  transform-origin: center left;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.page-3-login {
  animation: page-turn-login 5s ease-in-out 2.4s infinite;
  transform-origin: center left;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.book-bookmark-login {
  animation: bookmark-sway-login 3s ease-in-out infinite;
  transform-origin: top center;
}

@keyframes page-turn-login {
  0%, 100% {
    transform: rotateY(0deg) translateX(0);
    filter: brightness(1) drop-shadow(0 0 2px rgba(255, 255, 255, 0.4));
  }
  45% {
    transform: rotateY(-30deg) translateX(2px);
    filter: brightness(1.1) drop-shadow(0 0 3px rgba(255, 255, 255, 0.6));
  }
  50% {
    transform: rotateY(-40deg) translateX(3px);
    filter: brightness(1.2) drop-shadow(0 0 4px rgba(255, 255, 255, 0.7));
  }
  55% {
    transform: rotateY(-30deg) translateX(2px);
    filter: brightness(1.1) drop-shadow(0 0 3px rgba(255, 255, 255, 0.6));
  }
}

@keyframes bookmark-sway-login {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

/* Efectos de focus mejorados */
input:focus {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Animación de entrada */
.login-container {
  animation: fadeInUp 0.6s ease-out;
}

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
</style>