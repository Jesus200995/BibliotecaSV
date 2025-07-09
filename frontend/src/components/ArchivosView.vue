<template>
  <div>
    <!-- Título de la página -->
    <div class="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Archivos</h2>
        <p class="mt-1 text-sm text-gray-500">Gestiona y visualiza todos los archivos del repositorio</p>
      </div>
    </div>
    
    <!-- Estadísticas rápidas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm font-medium">Total de archivos</p>
            <p class="text-2xl font-bold">
              {{ hayFiltrosActivos ? `${archivosFiltrados.length} / ${archivos.length}` : archivos.length || 0 }}
            </p>
          </div>
          <div class="bg-blue-700/30 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm font-medium">Tamaño total</p>
            <p class="text-2xl font-bold">{{ formatFileSize(totalSize) }}</p>
          </div>
          <div class="bg-green-700/30 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm font-medium">Tipos de archivo</p>
            <p class="text-2xl font-bold">{{ uniqueTypes.length }}</p>
          </div>
          <div class="bg-purple-700/30 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-orange-100 text-sm font-medium">Último archivo</p>
            <p class="text-lg font-bold truncate max-w-[120px]" :title="lastFileName">
              {{ lastFileName || 'N/A' }}
            </p>
          </div>
          <div class="bg-orange-700/30 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de búsqueda y filtros -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100 mb-6">
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            Filtros de búsqueda
          </h3>
          <div v-if="hayFiltrosActivos" class="flex items-center gap-2">
            <span class="text-sm text-green-600 font-medium">{{ archivosFiltrados.length }} resultados</span>
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <!-- Búsqueda general -->
        <div class="mb-4">
          <input 
            v-model="busqueda" 
            type="text" 
            placeholder="Buscar archivos por nombre..." 
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
        
        <!-- Filtros específicos -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <select 
            v-model="filtroTipo" 
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          >
            <option value="">Todos los tipos</option>
            <option v-for="tipo in uniqueTypes" :key="tipo" :value="tipo">{{ tipo }}</option>
          </select>
          
          <select 
            v-model="filtroAnio" 
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          >
            <option value="">Todos los años</option>
            <option v-for="anio in aniosDisponibles" :key="anio" :value="anio">{{ anio }}</option>
          </select>
          
          <input 
            v-model="filtroResponsable" 
            type="text" 
            placeholder="Responsable"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          />
          
          <input 
            v-model="filtroEtiquetas" 
            type="text" 
            placeholder="Etiquetas"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          />
          
          <input 
            v-model="filtroAlcanceGeografico" 
            type="text" 
            placeholder="Ubicación"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          />
          
          <select 
            v-model="filtroValidacion" 
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          >
            <option value="">Todas las validaciones</option>
            <option value="Borrador">Borrador</option>
            <option value="Verificado">Verificado</option>
          </select>
        </div>
        
        <!-- Botón para limpiar filtros -->
        <button 
          @click="limpiarFiltros"
          v-show="hayFiltrosActivos"
          class="mt-4 inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Lista de archivos -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Archivo</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tamaño</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Responsable</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="cargandoPagina" class="animate-pulse">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                <div class="flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando archivos...
                </div>
              </td>
            </tr>
            
            <tr v-else-if="archivosFiltrados.length === 0" class="text-center">
              <td colspan="7" class="px-6 py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-lg font-medium mt-3">No se encontraron archivos</p>
                <p class="text-sm mt-1" v-if="hayFiltrosActivos">No se encontraron resultados con los filtros actuales</p>
              </td>
            </tr>
            
            <tr v-else v-for="archivo in archivosFiltrados" :key="archivo.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                         :class="getFileTypeColor(archivo.tipo)">
                      {{ archivo.tipo || 'DOC' }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 max-w-xs truncate" :title="archivo.nombre">
                      {{ archivo.nombre }}
                    </div>
                    <div class="text-sm text-gray-500 max-w-xs truncate" :title="archivo.descripcion">
                      {{ archivo.descripcion || 'Sin descripción' }}
                    </div>
                  </div>
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getFileTypeColor(archivo.tipo)">
                  {{ archivo.tipo || 'DOC' }}
                </span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatFileSize(archivo.tamano) }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ archivo.responsable || 'No especificado' }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(archivo.fecha_actualizacion) }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getValidationColor(archivo.validacion)">
                  {{ getValidationText(archivo.validacion) }}
                </span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-2">
                  <!-- Botón Ver detalles -->
                  <button 
                    @click="$emit('ver', archivo.id)"
                    class="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    title="Ver detalles"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  
                  <!-- Botón Editar -->
                  <button 
                    @click="abrirModalEditar(archivo)"
                    class="w-8 h-8 bg-amber-100 hover:bg-amber-200 text-amber-600 hover:text-amber-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    title="Editar archivo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <!-- Botón Descargar -->
                  <a 
                    :href="`http://localhost:4000/archivos/${archivo.id}/download`"
                    class="w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    target="_blank"
                    title="Descargar archivo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Edición -->
    <div v-if="modalEditarVisible" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <!-- Fondo oscuro con animación -->
      <div 
        class="fixed inset-0 bg-black transition-opacity duration-300"
        :class="{ 'bg-opacity-70': modalEditarVisible, 'bg-opacity-0': !modalEditarVisible }" 
        @click="cerrarModalEditar"
      ></div>
      
      <!-- Contenido del modal con animación -->
      <div 
        class="relative bg-white rounded-2xl w-full max-w-4xl mx-4 shadow-2xl transform transition-all duration-300 overflow-hidden max-h-[90vh]"
        :class="{ 'scale-100 opacity-100': modalEditarVisible, 'scale-95 opacity-0': !modalEditarVisible }"
      >
        <!-- Cabecera del modal -->
        <div class="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-2xl px-8 py-5 flex items-center justify-between">
          <h3 class="text-xl font-semibold flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar archivo: {{ archivoEditando?.nombre }}
          </h3>
          <button 
            @click="cerrarModalEditar" 
            class="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/20"
          >
            <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Formulario de edición -->
        <div class="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form @submit.prevent="guardarCambios" class="space-y-6">
            <!-- Información básica -->
            <div class="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h4 class="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Información General
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre del archivo</label>
                  <input 
                    v-model="formularioEdicion.nombre" 
                    type="text" 
                    class="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" 
                    placeholder="Nombre del archivo"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
                  <input 
                    v-model="formularioEdicion.tipo" 
                    type="text" 
                    class="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" 
                    placeholder="Tipo de archivo"
                  />
                </div>
              </div>
              
              <div class="mt-4">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                <textarea 
                  v-model="formularioEdicion.descripcion" 
                  rows="3" 
                  class="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" 
                  placeholder="Descripción del archivo"
                ></textarea>
              </div>
              
              <!-- Sección para reemplazar archivo -->
              <div class="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h5 class="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  Reemplazar archivo (opcional)
                </h5>
                <div class="flex items-center gap-3">
                  <label for="nuevo-archivo" class="cursor-pointer bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 rounded-lg border border-amber-300 transition-all hover:shadow-md flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Seleccionar nuevo archivo
                  </label>
                  <input 
                    type="file" 
                    id="nuevo-archivo"
                    @change="seleccionarNuevoArchivo" 
                    class="hidden"
                  />
                  <div v-if="nuevoArchivoSeleccionado" class="text-sm text-gray-600 bg-white px-3 py-2 rounded border max-w-xs truncate">
                    {{ nuevoArchivoSeleccionado.name }}
                  </div>
                  <div v-else class="text-xs text-amber-600 italic">
                    No se ha seleccionado un nuevo archivo
                  </div>
                </div>
                <p class="text-xs text-amber-600 mt-2">
                  Si seleccionas un nuevo archivo, reemplazará completamente el archivo actual.
                </p>
              </div>
            </div>

            <!-- Información del responsable -->
            <div class="bg-green-50 rounded-xl p-6 border border-green-200">
              <h4 class="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Detalles del Responsable
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Responsable</label>
                  <input 
                    v-model="formularioEdicion.responsable" 
                    type="text" 
                    class="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" 
                    placeholder="Nombre del responsable"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Fuente</label>
                  <input 
                    v-model="formularioEdicion.fuente" 
                    type="text" 
                    class="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" 
                    placeholder="Fuente del archivo"
                  />
                </div>
              </div>
            </div>

            <!-- Etiquetas y ubicación -->
            <div class="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <h4 class="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Etiquetas y Ubicación
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Etiquetas</label>
                  <input 
                    v-model="formularioEdicion.etiquetas" 
                    type="text" 
                    class="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" 
                    placeholder="Etiquetas separadas por comas"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Alcance geográfico</label>
                  <input 
                    v-model="formularioEdicion.alcance_geografico" 
                    type="text" 
                    class="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" 
                    placeholder="Ubicación geográfica"
                  />
                </div>
              </div>
            </div>

            <!-- Validación y observaciones -->
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Validación y Notas
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Estado de validación</label>
                  <select 
                    v-model="formularioEdicion.validacion" 
                    class="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  >
                    <option value="">Sin validar</option>
                    <option value="Borrador">Borrador</option>
                    <option value="Verificado">Verificado</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Observaciones</label>
                <textarea 
                  v-model="formularioEdicion.observaciones" 
                  rows="3" 
                  class="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all" 
                  placeholder="Observaciones adicionales"
                ></textarea>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button 
                type="button"
                @click="cerrarModalEditar"
                class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                :disabled="guardandoCambios"
                class="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all font-medium shadow-lg flex items-center gap-2"
              >
                <svg v-if="guardandoCambios" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {{ guardandoCambios ? 'Guardando...' : 'Guardar cambios' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// Definir emits
defineEmits(['ver'])

// Variables reactivas
const archivos = ref([])
const cargandoPagina = ref(false)
const BACKEND_URL = 'http://localhost:4000'

// Variables para el modal de edición
const modalEditarVisible = ref(false)
const archivoEditando = ref(null)
const guardandoCambios = ref(false)
const nuevoArchivoSeleccionado = ref(null)
const formularioEdicion = ref({
  nombre: '',
  descripcion: '',
  tipo: '',
  responsable: '',
  fuente: '',
  etiquetas: '',
  alcance_geografico: '',
  validacion: '',
  observaciones: ''
})

// Variables para búsqueda y filtros
const busqueda = ref("")
const filtroTipo = ref("")
const filtroAnio = ref("")
const filtroResponsable = ref("")
const filtroEtiquetas = ref("")
const filtroAlcanceGeografico = ref("")
const filtroValidacion = ref("")

// Función para limpiar todos los filtros
function limpiarFiltros() {
  busqueda.value = ""
  filtroTipo.value = ""
  filtroAnio.value = ""
  filtroResponsable.value = ""
  filtroEtiquetas.value = ""
  filtroAlcanceGeografico.value = ""
  filtroValidacion.value = ""
}

// Años disponibles para filtrar
const aniosDisponibles = computed(() => {
  const years = archivos.value
    .map(a => (a.fecha_actualizacion || '').substring(0, 4))
    .filter(year => year && /^\d{4}$/.test(year))
  
  return [...new Set(years)].sort().reverse()
})

// Verificar si hay filtros activos
const hayFiltrosActivos = computed(() => {
  return busqueda.value !== "" || filtroTipo.value !== "" || filtroAnio.value !== "" || 
         filtroResponsable.value !== "" || filtroEtiquetas.value !== "" || 
         filtroAlcanceGeografico.value !== "" || filtroValidacion.value !== ""
})

// Archivos filtrados según los criterios de búsqueda
const archivosFiltrados = computed(() => {
  return archivos.value.filter(a => {
    // Filtro por nombre
    const coincideNombre = a.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
    
    // Filtro por tipo
    const coincideTipo = !filtroTipo.value || a.tipo === filtroTipo.value
    
    // Filtro por año
    const coincideAnio = !filtroAnio.value || (a.fecha_actualizacion || '').substring(0, 4) === filtroAnio.value
    
    // Filtro por responsable
    const coincideResp = !filtroResponsable.value || 
                        (a.responsable || '').toLowerCase().includes(filtroResponsable.value.toLowerCase())
    
    // Filtro por etiquetas (búsqueda parcial en múltiples etiquetas)
    const coincideEtiquetas = !filtroEtiquetas.value || 
                             (a.etiquetas || '').toLowerCase().includes(filtroEtiquetas.value.toLowerCase())
    
    // Filtro por alcance geográfico (búsqueda parcial)
    const coincideAlcance = !filtroAlcanceGeografico.value || 
                           (a.alcance_geografico || '').toLowerCase().includes(filtroAlcanceGeografico.value.toLowerCase())
    
    // Filtro por validación (coincidencia exacta)
    const coincideValidacion = !filtroValidacion.value || a.validacion === filtroValidacion.value
    
    return coincideNombre && coincideTipo && coincideAnio && coincideResp && 
           coincideEtiquetas && coincideAlcance && coincideValidacion
  })
})

// Propiedades computadas para estadísticas
const totalSize = computed(() => {
  // Si hay filtros activos, mostrar el tamaño total de los archivos filtrados
  const archivosToSum = hayFiltrosActivos.value ? archivosFiltrados.value : archivos.value
  return archivosToSum.reduce((total, archivo) => {
    return total + (archivo.tamano || 0)
  }, 0)
})

const lastFileName = computed(() => {
  if (archivos.value.length === 0) return null
  
  const sorted = [...archivos.value].sort((a, b) => {
    return new Date(b.fecha_actualizacion) - new Date(a.fecha_actualizacion)
  })
  
  return sorted[0]?.nombre || null
})

const uniqueTypes = computed(() => {
  const types = archivos.value.map(archivo => archivo.tipo)
  return [...new Set(types)]
})

// Funciones de formato
function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDate(dateString) {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function getFileTypeColor(tipo) {
  const colors = {
    'PDF': 'bg-red-500 text-white',
    'DOC': 'bg-blue-500 text-white',
    'DOCX': 'bg-blue-500 text-white',
    'XLS': 'bg-green-500 text-white',
    'XLSX': 'bg-green-500 text-white',
    'PPT': 'bg-orange-500 text-white',
    'PPTX': 'bg-orange-500 text-white',
    'JPG': 'bg-purple-500 text-white',
    'JPEG': 'bg-purple-500 text-white',
    'PNG': 'bg-purple-500 text-white',
    'GIF': 'bg-purple-500 text-white',
    'TXT': 'bg-gray-500 text-white',
    'CSV': 'bg-yellow-500 text-white',
    'ZIP': 'bg-indigo-500 text-white',
    'RAR': 'bg-indigo-500 text-white',
    'SHP': 'bg-teal-500 text-white'
  }
  
  return colors[tipo?.toUpperCase()] || 'bg-gray-400 text-white'
}

function getValidationColor(validacion) {
  const colors = {
    'Verificado': 'bg-green-100 text-green-800',
    'Borrador': 'bg-yellow-100 text-yellow-800',
    'validado': 'bg-green-100 text-green-800',
    'pendiente': 'bg-yellow-100 text-yellow-800',
    'rechazado': 'bg-red-100 text-red-800'
  }
  
  return colors[validacion] || 'bg-gray-100 text-gray-800'
}

function getValidationText(validacion) {
  const texts = {
    'Verificado': 'Verificado',
    'Borrador': 'Borrador',
    'validado': 'Validado',
    'pendiente': 'Pendiente',
    'rechazado': 'Rechazado'
  }
  
  return texts[validacion] || 'Sin validar'
}

// Cargar archivos al montar el componente
onMounted(async () => {
  await cargarArchivos()
})

async function cargarArchivos() {
  try {
    cargandoPagina.value = true
    
    const res = await axios.get(`${BACKEND_URL}/archivos`)
    
    // Obtener todos los archivos sin paginación para el sidebar
    archivos.value = res.data.items || res.data || []
  } catch (err) {
    console.error('Error al cargar archivos:', err)
  } finally {
    cargandoPagina.value = false
  }
}

// Funciones del modal de edición
function abrirModalEditar(archivo) {
  archivoEditando.value = archivo
  formularioEdicion.value = {
    nombre: archivo.nombre || '',
    descripcion: archivo.descripcion || '',
    tipo: archivo.tipo || '',
    responsable: archivo.responsable || '',
    fuente: archivo.fuente || '',
    etiquetas: archivo.etiquetas || '',
    alcance_geografico: archivo.alcance_geografico || '',
    validacion: archivo.validacion || '',
    observaciones: archivo.observaciones || ''
  }
  modalEditarVisible.value = true
}

function cerrarModalEditar() {
  modalEditarVisible.value = false
  archivoEditando.value = null
  nuevoArchivoSeleccionado.value = null
  formularioEdicion.value = {
    nombre: '',
    descripcion: '',
    tipo: '',
    responsable: '',
    fuente: '',
    etiquetas: '',
    alcance_geografico: '',
    validacion: '',
    observaciones: ''
  }
}

function seleccionarNuevoArchivo(event) {
  const file = event.target.files[0]
  
  // Validar tamaño de archivo (50MB máximo)
  if (file && file.size > 50 * 1024 * 1024) {
    alert("El archivo es demasiado grande. El tamaño máximo permitido es 50MB.")
    event.target.value = null
    nuevoArchivoSeleccionado.value = null
    return
  }
  
  nuevoArchivoSeleccionado.value = file
  
  // Actualizar automáticamente el nombre y tipo si se selecciona un nuevo archivo
  if (file) {
    formularioEdicion.value.nombre = file.name
    formularioEdicion.value.tipo = file.name.split('.').pop()?.toUpperCase() || ''
  }
}

async function guardarCambios() {
  if (!archivoEditando.value) return
  
  try {
    guardandoCambios.value = true
    
    // Si hay un nuevo archivo seleccionado, usar FormData para enviarlo
    if (nuevoArchivoSeleccionado.value) {
      const formData = new FormData()
      formData.append('file', nuevoArchivoSeleccionado.value)
      formData.append('nombre', formularioEdicion.value.nombre)
      formData.append('descripcion', formularioEdicion.value.descripcion)
      formData.append('tipo', formularioEdicion.value.tipo)
      formData.append('responsable', formularioEdicion.value.responsable)
      formData.append('fuente', formularioEdicion.value.fuente)
      formData.append('etiquetas', formularioEdicion.value.etiquetas)
      formData.append('alcance', formularioEdicion.value.alcance_geografico)
      formData.append('validacion', formularioEdicion.value.validacion)
      formData.append('observaciones', formularioEdicion.value.observaciones)
      
      // Usar endpoint especial para actualizar con archivo
      const response = await axios.put(`${BACKEND_URL}/archivos/${archivoEditando.value.id}/with-file`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      
      console.log('Archivo actualizado con nuevo archivo:', response.data)
    } else {
      // Solo actualizar metadatos sin cambiar el archivo
      const response = await axios.put(`${BACKEND_URL}/archivos/${archivoEditando.value.id}`, {
        nombre: formularioEdicion.value.nombre,
        descripcion: formularioEdicion.value.descripcion,
        tipo: formularioEdicion.value.tipo,
        responsable: formularioEdicion.value.responsable,
        fuente: formularioEdicion.value.fuente,
        etiquetas: formularioEdicion.value.etiquetas,
        alcance_geografico: formularioEdicion.value.alcance_geografico,
        validacion: formularioEdicion.value.validacion,
        observaciones: formularioEdicion.value.observaciones
      })
      
      console.log('Metadatos actualizados:', response.data)
    }
    
    // Actualizar el archivo en la lista local
    const index = archivos.value.findIndex(a => a.id === archivoEditando.value.id)
    if (index !== -1) {
      archivos.value[index] = { ...archivos.value[index], ...formularioEdicion.value }
    }
    
    // Mostrar mensaje de éxito
    alert('Archivo actualizado correctamente')
    
    // Cerrar modal
    cerrarModalEditar()
    
    // Recargar la lista para asegurar datos actualizados
    await cargarArchivos()
    
  } catch (error) {
    console.error('Error al actualizar archivo:', error)
    alert('Error al actualizar el archivo: ' + (error.response?.data?.error || error.message))
  } finally {
    guardandoCambios.value = false
  }
}
</script>

<style scoped>
/* Animación de entrada para elementos */
@keyframes pop-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-pop-in {
  animation: pop-in 0.3s ease-out forwards;
}

/* Efectos hover mejorados */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Estilo para la tabla responsive */
@media (max-width: 768px) {
  .overflow-x-auto {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

/* Gradientes personalizados para las estadísticas */
.bg-gradient-to-r {
  background: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Estados de carga personalizados */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Mejoras visuales para los chips de filtro */
.rounded-full {
  border-radius: 9999px;
}

/* Transiciones suaves */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Estados focus mejorados */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Estilo para los iconos de estado */
.text-green-600 {
  color: #059669;
}

.text-blue-600 {
  color: #2563eb;
}

.text-red-600 {
  color: #dc2626;
}

.text-yellow-600 {
  color: #d97706;
}

/* Mejoras para la responsividad en dispositivos pequeños */
@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .py-4 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
}

/* Animación de spinner personalizada */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Estilos para los botones de acción con iconos */
.hover\:scale-110:hover {
  transform: scale(1.1);
}

/* Efectos de sombra para los botones circulares */
.bg-blue-100:hover {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.bg-green-100:hover {
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.bg-amber-100:hover {
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

/* Transiciones suaves para los iconos */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-200 {
  transition-duration: 200ms;
}
</style>
