<template>
  <!-- Vista de Login -->
  <LoginView 
    v-if="!estaAutenticado" 
    @login-success="manejarLoginExitoso"
  />
  
  <!-- Vista Principal (cuando está autenticado) -->
  <div v-else class="flex h-screen w-full bg-gray-50 overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-purple-700 text-white shadow-lg flex-shrink-0">
      <!-- Logo y título -->
      <div class="p-5 border-b border-purple-600 flex flex-col items-center">
        <div class="mb-3 book-container">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <!-- Libro base -->
            <rect x="4" y="4" width="16" height="16" rx="1" class="book-cover" />
            
            <!-- Páginas animadas -->
            <path d="M6 4.5c0 0 3 0.9 6 0.9s6 -0.9 6 -0.9v15c0 0 -3 0.9 -6 0.9s-6 -0.9 -6 -0.9v-15z" class="book-page page-1" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M7 4.7c0 0 2.5 0.7 5 0.7s5 -0.7 5 -0.7v14.6c0 0 -2.5 0.7 -5 0.7s-5 -0.7 -5 -0.7v-14.6z" class="book-page page-2" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M8 4.9c0 0 2 0.5 4 0.5s4 -0.5 4 -0.5v14.2c0 0 -2 0.5 -4 0.5s-4 -0.5 -4 -0.5v-14.2z" class="book-page page-3" stroke-width="0.9" stroke-linecap="round"/>
            
            <!-- Marcapáginas -->
            <path d="M18 7l0.8 -2.5l0.8 2.5" class="book-bookmark" stroke-width="0.75" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="text-center">
          <h2 class="sv-title tracking-wider">
            <span class="text-sm uppercase font-bold sv-gradient tracking-wider">SEMBRANDO VIDA</span>
          </h2>
        </div>
        <div class="w-32 h-0.5 bg-gradient-to-r from-white via-purple-400 to-white mt-2"></div>
        <div class="text-xs mt-2 font-extrabold biblioteca-gradient uppercase">BIBLIOTECA DE DATOS</div>
      </div>
      
      <!-- Información del usuario -->
      <div class="px-4 py-3 bg-purple-800 border-b border-purple-600">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-white">{{ usuarioActual?.usuario || 'Usuario' }}</p>
            <p class="text-xs text-purple-200">{{ usuarioActual?.rol || 'admin' }}</p>
          </div>
          <button 
            @click="cerrarSesion"
            class="text-purple-200 hover:text-white transition-colors"
            title="Cerrar sesión"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Menú de navegación -->
      <nav class="mt-5 overflow-y-auto" style="height: calc(100vh - 160px);">
        <!-- Botón Geoportal -->
        <div class="flex justify-center mb-4 px-4">
          <a href="https://sembrandodatos.com/" target="_blank" 
             class="flex items-center px-4 py-2 rounded-full shadow-lg w-full geoportal-btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
            </svg>
            <span class="text-sm text-white font-medium">Ir a Inicio Geoportal</span>
          </a>
        </div>
        
        <div class="px-4 py-3 text-xs uppercase font-semibold text-purple-200">
          Principal
        </div>
        
        <a href="#" @click="vistaActual = 'dashboard'" 
           class="flex items-center px-6 py-3 text-purple-100 transition-colors"
           :class="vistaActual === 'dashboard' ? 'bg-purple-800 border-l-4 border-white' : 'hover:bg-purple-800'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </a>
        
        <a href="#" @click="vistaActual = 'archivos'" 
           class="flex items-center px-6 py-3 text-purple-100 transition-colors"
           :class="vistaActual === 'archivos' ? 'bg-purple-800 border-l-4 border-white' : 'hover:bg-purple-800'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Archivos
        </a>

        <a href="#" @click="vistaActual = 'estadisticas'" 
           class="flex items-center px-6 py-3 text-purple-100 transition-colors"
           :class="vistaActual === 'estadisticas' ? 'bg-purple-800 border-l-4 border-white' : 'hover:bg-purple-800'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Estadísticas
        </a>

        <a href="#" @click="vistaActual = 'mapa'" 
           class="flex items-center px-6 py-3 text-purple-100 transition-colors"
           :class="vistaActual === 'mapa' ? 'bg-purple-800 border-l-4 border-white' : 'hover:bg-purple-800'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Mapa
        </a>
      </nav>
    </aside>

    <!-- Contenido principal -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white shadow-sm z-10">
        <div class="w-full px-4 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-semibold text-purple-700">Biblioteca de Datos</h1>
          <div class="text-gray-600">
            Plataforma de gestión documental
          </div>
        </div>
      </header>

      <!-- Contenido principal -->
      <main class="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div class="w-full">
          <!-- Dashboard -->
          <ArchivoTable v-if="vistaActual === 'dashboard'" @ver="verFicha" @navigate="navegarA"/>
          
          <!-- Vista de Archivos -->
          <ArchivosView v-if="vistaActual === 'archivos'" @ver="verFicha"/>
          
          <!-- Vista de Estadísticas -->
          <EstadisticasView v-if="vistaActual === 'estadisticas'"/>
          
          <!-- Vista de Mapa -->
          <MapaView v-if="vistaActual === 'mapa'"/>
        </div>
      </main>

      <!-- Modal de ficha técnica -->
      <ArchivoFicha 
        v-if="archivoSeleccionado" 
        :archivo="archivoSeleccionado" 
        @cerrar="cerrarFicha"
      />

      <!-- Footer -->
      <footer class="bg-white text-gray-500 text-sm py-3 shadow-inner">
        <div class="w-full px-6 text-center">
          © 2025 Biblioteca de Datos - Todos los derechos reservados
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import LoginView from './components/LoginView.vue'
import ArchivoTable from './components/ArchivoTable.vue'
import ArchivoFicha from './components/ArchivoFicha.vue'
import ArchivosView from './components/ArchivosView.vue'
import EstadisticasView from './components/EstadisticasView.vue'
import MapaView from './components/MapaView.vue'

// Estado de autenticación
const estaAutenticado = ref(false)
const usuarioActual = ref(null)

// Estado de la aplicación
const archivoSeleccionado = ref(null)
const vistaActual = ref('dashboard') // Estado para controlar la vista actual

// Configurar URL del backend
const BACKEND_URL = import.meta.env.DEV 
  ? 'http://localhost:4000/api' 
  : 'https://api.biblioteca.sembrandodatos.com/api'

console.log('App - Backend URL configurada:', BACKEND_URL)

// Verificar autenticación al cargar la aplicación
onMounted(() => {
  verificarAutenticacion()
})

// Función para verificar si el usuario está autenticado
function verificarAutenticacion() {
  const token = localStorage.getItem('authToken')
  const userData = localStorage.getItem('userData')
  
  if (token && userData) {
    try {
      // Configurar axios con el token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Establecer estado de autenticación
      estaAutenticado.value = true
      usuarioActual.value = JSON.parse(userData)
      
      console.log('Usuario autenticado:', usuarioActual.value)
    } catch (error) {
      console.error('Error al verificar autenticación:', error)
      cerrarSesion()
    }
  }
}

// Manejar login exitoso
function manejarLoginExitoso(loginData) {
  console.log('Login exitoso en App:', loginData)
  
  estaAutenticado.value = true
  usuarioActual.value = loginData.usuario
  
  // Configurar axios con el token
  axios.defaults.headers.common['Authorization'] = `Bearer ${loginData.token}`
}

// Cerrar sesión
function cerrarSesion() {
  console.log('Cerrando sesión...')
  
  // Limpiar localStorage
  localStorage.removeItem('authToken')
  localStorage.removeItem('userData')
  
  // Limpiar headers de axios
  delete axios.defaults.headers.common['Authorization']
  
  // Resetear estado
  estaAutenticado.value = false
  usuarioActual.value = null
  vistaActual.value = 'dashboard'
  archivoSeleccionado.value = null
}

async function verFicha(id) {
  console.log('App - Obteniendo ficha para archivo ID:', id)
  
  try {
    // Agregar headers y timeout
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 10000
    }
    
    console.log('App - Petición a:', `${BACKEND_URL}/archivos/${id}`)
    
    // Obtener los datos del archivo desde el backend
    const response = await axios.get(`${BACKEND_URL}/archivos/${id}`, config)
    
    console.log('App - Datos del archivo recibidos:', response.data)
    archivoSeleccionado.value = response.data
    
  } catch (error) {
    console.error('App - Error al obtener datos del archivo:', error)
    
    // Intentar con URL alternativa
    if (error.response?.status === 404 || error.code === 'ECONNREFUSED') {
      try {
        const fallbackUrl = BACKEND_URL.replace('/api', '')
        console.log('App - Intentando fallback:', `${fallbackUrl}/archivos/${id}`)
        
        const response = await axios.get(`${fallbackUrl}/archivos/${id}`)
        archivoSeleccionado.value = response.data
        console.log('App - Fallback exitoso')
      } catch (fallbackError) {
        console.error('App - Error en fallback:', fallbackError)
        alert('No se pudo cargar la información del archivo')
      }
    } else {
      alert('No se pudo cargar la información del archivo: ' + error.message)
    }
  }
}

function cerrarFicha() {
  archivoSeleccionado.value = null
}

// Función para manejar la navegación desde el Dashboard
function navegarA(vista) {
  vistaActual.value = vista
}
</script>

<style>
/* Importar fuentes profesionales */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

/* Estilos globales */
body, html {
  font-family: "Montserrat", "Segoe UI", Roboto, -apple-system, sans-serif;
}

/* Estilos del logo y animación del libro */
.book-container {
  filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.4));
  perspective: 800px;
  transform-style: preserve-3d;
  margin-top: 5px;
}

.logo-icon {
  color: #e9d5ff; /* Morado muy claro para el logo */
  overflow: visible;
}

.book-cover {
  stroke: #a78bfa; /* Morado claro para la cubierta del libro */
  stroke-width: 1.5;
  fill: rgba(139, 92, 246, 0.5); /* Morado con transparencia */
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2));
}

.book-page {
  stroke: #e9d5ff; /* Morado muy claro para las páginas */
  fill: rgba(255, 255, 255, 0.95); /* Páginas blancas con ligera transparencia */
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.7));
}

.book-bookmark {
  stroke: #fb7185; /* Color rosa para el marcapáginas */
  stroke-width: 1.25;
  filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.8));
}

/* Efectos de degradado en el texto */
.text-gradient {
  background: linear-gradient(to right, #FFFFFF 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.12em;
  font-family: "Montserrat", "Segoe UI", Roboto, -apple-system, sans-serif;
  font-weight: 700;
}

.biblioteca-gradient {
  background: linear-gradient(to right, #FFFFFF 80%, rgba(255, 255, 255, 0.7) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.12em;
  font-family: "Montserrat", "Segoe UI", Roboto, -apple-system, sans-serif;
  font-weight: 700;
}

.sv-gradient {
  background: linear-gradient(to right, #FFFFFF 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

.sv-title {
  letter-spacing: 0.05em;
  font-family: "Montserrat", "Segoe UI", Roboto, -apple-system, sans-serif;
  font-weight: 500;
}

/* Animaciones para las páginas del libro */
.page-1 {
  animation: page-turn 4s ease-in-out infinite;
  transform-origin: center left;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.page-2 {
  animation: page-turn 4.5s ease-in-out 1.2s infinite;
  transform-origin: center left;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.page-3 {
  animation: page-turn 5s ease-in-out 2.4s infinite;
  transform-origin: center left;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.book-bookmark {
  animation: bookmark-sway 3s ease-in-out infinite;
  transform-origin: top center;
}

@keyframes page-turn {
  0%, 100% {
    transform: rotateY(0deg) translateX(0);
    filter: brightness(1) drop-shadow(0 0 1px rgba(255, 255, 255, 0.3));
  }
  45% {
    transform: rotateY(-30deg) translateX(2px);
    filter: brightness(1.1) drop-shadow(0 0 2px rgba(255, 255, 255, 0.5));
  }
  50% {
    transform: rotateY(-40deg) translateX(3px);
    filter: brightness(1.2) drop-shadow(0 0 3px rgba(255, 255, 255, 0.6));
  }
  55% {
    transform: rotateY(-30deg) translateX(2px);
    filter: brightness(1.1) drop-shadow(0 0 2px rgba(255, 255, 255, 0.5));
  }
}

@keyframes bookmark-sway {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

/* Estilo para el botón del geoportal con degradado */
.geoportal-btn {
  background: linear-gradient(90deg, #16a34a 0%, #047857 50%, #6d28d9 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.geoportal-btn:hover {
  box-shadow: 0 0 15px rgba(22, 163, 74, 0.6);
  transform: translateY(-1px);
  background: linear-gradient(90deg, #15803d 0%, #065f46 50%, #5b21b6 100%);
}
</style>
