<template>
  <div class="flex h-screen w-full bg-gray-50 overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-blue-700 text-white shadow-lg flex-shrink-0">
      <!-- Logo y título -->
      <div class="p-5 border-b border-blue-600 flex items-center">
        <img src="/vite.svg" class="w-8 h-8 mr-2" />
        <h2 class="text-xl font-bold">Biblioteca SV</h2>
      </div>
      
      <!-- Menú de navegación -->
      <nav class="mt-5 overflow-y-auto" style="height: calc(100vh - 80px);">
        <div class="px-4 py-3 text-xs uppercase font-semibold text-blue-200">
          Principal
        </div>
        
        <a href="#" class="flex items-center px-6 py-3 text-blue-100 bg-blue-800 border-l-4 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </a>
        
        <a href="#" class="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Archivos
        </a>
        
        <a href="#" class="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Configuración
        </a>
        
        <div class="px-4 py-3 mt-6 text-xs uppercase font-semibold text-blue-200">
          Gestión
        </div>
        
        <a href="#" class="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Usuarios
        </a>
        
        <a href="#" class="flex items-center px-6 py-3 text-blue-100 hover:bg-blue-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Reportes
        </a>
      </nav>
    </aside>

    <!-- Contenido principal -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white shadow-sm z-10">
        <div class="w-full px-4 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-semibold text-blue-700">Biblioteca de Datos</h1>
          <div class="text-gray-600">
            Plataforma de gestión documental
          </div>
        </div>
      </header>

      <!-- Contenido principal -->
      <main class="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div class="w-full">
          <ArchivoTable @ver="verFicha"/>
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
import { ref } from 'vue'
import axios from 'axios'
import ArchivoTable from './components/ArchivoTable.vue'
import ArchivoFicha from './components/ArchivoFicha.vue'

const archivoSeleccionado = ref(null)
const BACKEND_URL = 'http://localhost:4000'

async function verFicha(id) {
  try {
    // Obtener los datos del archivo desde el backend
    const response = await axios.get(`${BACKEND_URL}/archivos/${id}`)
    archivoSeleccionado.value = response.data
  } catch (error) {
    console.error('Error al obtener datos del archivo:', error)
    alert('No se pudo cargar la información del archivo')
  }
}

function cerrarFicha() {
  archivoSeleccionado.value = null
}
</script>
