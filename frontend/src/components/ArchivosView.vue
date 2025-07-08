<template>
  <div class="h-full">
    <!-- Título de la página -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Archivos</h2>
      <p class="mt-1 text-sm text-gray-500">Gestión y administración de archivos del sistema</p>
    </div>
    
    <!-- Contenido vacío por ahora -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div class="text-center">
        <div class="mx-auto h-24 w-24 text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Vista de Archivos</h3>
        <p class="text-gray-500 mb-4">
          Esta sección está en desarrollo. Aquí podrás gestionar y administrar todos los archivos del sistema.
        </p>
        <div class="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Próximamente disponible
        </div>
      </div>
    </div>
    
    <!-- Cards de funcionalidades futuras -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center mb-4">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h4 class="ml-3 text-lg font-medium text-gray-900">Subir Archivos</h4>
        </div>
        <p class="text-gray-600 text-sm">
          Carga y gestiona nuevos documentos al repositorio con metadatos completos.
        </p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center mb-4">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <h4 class="ml-3 text-lg font-medium text-gray-900">Organizar</h4>
        </div>
        <p class="text-gray-600 text-sm">
          Clasifica y organiza archivos por categorías, etiquetas y metadatos.
        </p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center mb-4">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h4 class="ml-3 text-lg font-medium text-gray-900">Buscar</h4>
        </div>
        <p class="text-gray-600 text-sm">
          Encuentra archivos rápidamente con búsqueda avanzada y filtros.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Componente vacío por ahora, se puede expandir en el futuro
</script>

<style scoped>
/* Estilos específicos del componente si se necesitan */
</style>
