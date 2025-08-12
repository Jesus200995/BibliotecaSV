<template>
  <div>
    <!-- Título de la página -->
    <div class="mb-4 sm:mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div class="px-2 sm:px-0">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800">Archivos</h2>
        <p class="mt-1 text-sm text-gray-500">Gestiona y visualiza todos los archivos del repositorio</p>
      </div>
    </div>
    
    <!-- Estadísticas rápidas -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6 px-2 sm:px-0">
      <div class="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 sm:p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-xs sm:text-sm font-medium">Total archivos</p>
            <p class="text-lg sm:text-2xl font-bold">
              {{ hayFiltrosActivos ? `${archivosFiltrados.length} / ${archivos.length}` : archivos.length || 0 }}
            </p>
          </div>
          <div class="bg-blue-700/30 p-2 sm:p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Componente unificado de tamaño total - Mismo diseño que Estadísticas -->
      <div class="bg-gradient-to-r from-green-600 to-green-500 text-white p-3 sm:p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-xs sm:text-sm font-medium">Tamaño total</p>
            <p class="text-lg sm:text-2xl font-bold">{{ formatFileSize(totalSize) }}</p>
          </div>
          <div class="bg-green-700/30 p-2 sm:p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-3 sm:p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-xs sm:text-sm font-medium">Tipos archivo</p>
            <p class="text-lg sm:text-2xl font-bold">{{ uniqueTypes.length }}</p>
          </div>
          <div class="bg-purple-700/30 p-2 sm:p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-3 sm:p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-orange-100 text-xs sm:text-sm font-medium">Último archivo</p>
            <p class="text-sm sm:text-lg font-bold truncate max-w-[80px] sm:max-w-[120px]" :title="lastFileName">
              {{ lastFileName || 'N/A' }}
            </p>
          </div>
          <div class="bg-orange-700/30 p-2 sm:p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de búsqueda y filtros -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100 mb-4 sm:mb-6 mx-2 sm:mx-0">
      <div class="p-3 sm:p-6 border-b border-gray-100">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-0">
          <h3 class="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            <span class="hidden sm:inline">Filtros de búsqueda</span>
            <span class="sm:hidden">Filtros</span>
          </h3>
          
          <!-- Sección derecha: Resultados de filtros y botón "Subir archivo" -->
          <div class="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <!-- Indicador de resultados de filtros -->
            <div v-if="hayFiltrosActivos" class="flex items-center gap-2">
              <span class="text-xs sm:text-sm text-green-600 font-medium">{{ archivosFiltrados.length }} resultados</span>
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <!-- Botón compacto "Subir archivo" - Solo visible para usuarios con rol 'admin' -->
            <button 
              v-if="esUsuarioAutorizado"
              @click="modalSubidaVisible = true"
              class="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-medium rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
              </svg>
              <span>Subir archivo</span>
            </button>
          </div>
        </div>
        
        <!-- Búsqueda general -->
        <div class="mb-4">
          <input 
            v-model="busqueda" 
            type="text" 
            placeholder="Buscar archivos por nombre..." 
            class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm text-sm sm:text-base"
          />
        </div>
        
        <!-- Filtros específicos - Responsive grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-4">
          <select 
            v-model="filtroTipo" 
            class="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs sm:text-sm"
          >
            <option value="">Todos los tipos</option>
            <option v-for="tipo in uniqueTypes" :key="tipo" :value="tipo">{{ tipo }}</option>
          </select>
          
          <select 
            v-model="filtroAnio" 
            class="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs sm:text-sm"
          >
            <option value="">Todos los años</option>
            <option v-for="anio in aniosDisponibles" :key="anio" :value="anio">{{ anio }}</option>
          </select>
          
          <input 
            v-model="filtroResponsable" 
            type="text" 
            placeholder="Responsable"
            class="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs sm:text-sm"
          />
          
          <input 
            v-model="filtroEtiquetas" 
            type="text" 
            placeholder="Etiquetas"
            class="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs sm:text-sm"
          />
          
          <input 
            v-model="filtroAlcanceGeografico" 
            type="text" 
            placeholder="Ubicación"
            class="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs sm:text-sm"
          />
          
          <select 
            v-model="filtroValidacion" 
            class="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs sm:text-sm"
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
          class="mt-3 sm:mt-4 inline-flex items-center px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all text-xs sm:text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Lista de archivos responsiva -->
    <div class="mx-2 sm:mx-0">
      <!-- Vista de tabla para desktop -->
      <div class="hidden lg:block bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Archivo</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tamaño</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Responsable</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Alcance geográfico</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="cargandoPagina" class="animate-pulse">
                <td colspan="8" class="px-6 py-8 text-center text-gray-500">
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
                <td colspan="8" class="px-6 py-8 text-gray-500">
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
                
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="(lugar, index) in (archivo.alcance_geografico || '').split(',')" 
                      :key="index" 
                      v-show="lugar.trim()"
                      class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium"
                    >
                      {{ lugar.trim() }}
                    </span>
                    <span v-if="!archivo.alcance_geografico" class="text-gray-400 text-xs italic">No especificado</span>
                  </div>
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
                    
                    <!-- Botón Editar - Solo visible para usuarios con rol 'admin' -->
                    <button 
                      v-if="esUsuarioAutorizado"
                      @click="abrirModalEditar(archivo)"
                      class="w-8 h-8 bg-amber-100 hover:bg-amber-200 text-amber-600 hover:text-amber-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                      title="Editar archivo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    <!-- Botón Descargar - Visible para todos -->
                    <button 
                      @click="descargarArchivo(archivo)"
                      class="w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                      title="Descargar archivo"
                      :disabled="descargandoArchivos[archivo.id]"
                    >
                      <!-- Mostrar spinner si se está descargando -->
                      <svg v-if="descargandoArchivos[archivo.id]" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <!-- Icono normal de descarga -->
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                    
                    <!-- Botón Eliminar - Solo visible para usuarios con rol 'admin' -->
                    <button 
                      v-if="esUsuarioAutorizado"
                      @click="confirmarEliminar(archivo)"
                      class="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                      title="Eliminar archivo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Vista de cards para mobile y tablet -->
      <div class="lg:hidden">
        <!-- Estado de carga -->
        <div v-if="cargandoPagina" class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
          <div class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando archivos...
          </div>
        </div>

        <!-- Sin archivos -->
        <div v-else-if="archivosFiltrados.length === 0" class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-base font-medium mb-1">No se encontraron archivos</p>
          <p class="text-sm" v-if="hayFiltrosActivos">No se encontraron resultados con los filtros actuales</p>
        </div>

        <!-- Cards de archivos -->
        <div v-else class="space-y-3">
          <div 
            v-for="archivo in archivosFiltrados" 
            :key="archivo.id" 
            class="bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <!-- Header del card -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center space-x-3 flex-1 min-w-0">
                <!-- Icono del tipo de archivo -->
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                       :class="getFileTypeColor(archivo.tipo)">
                    {{ archivo.tipo || 'DOC' }}
                  </div>
                </div>
                
                <!-- Info principal -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-semibold text-gray-900 truncate" :title="archivo.nombre">
                    {{ archivo.nombre }}
                  </h3>
                  <p class="text-xs text-gray-500 truncate" :title="archivo.descripcion">
                    {{ archivo.descripcion || 'Sin descripción' }}
                  </p>
                </div>
              </div>

              <!-- Estado de validación -->
              <div class="flex-shrink-0 ml-2">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getValidationColor(archivo.validacion)">
                  {{ getValidationText(archivo.validacion) }}
                </span>
              </div>
            </div>

            <!-- Información detallada en grid -->
            <div class="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div>
                <span class="text-gray-500 font-medium">Tamaño:</span>
                <span class="text-gray-900 ml-1">{{ formatFileSize(archivo.tamano) }}</span>
              </div>
              <div>
                <span class="text-gray-500 font-medium">Responsable:</span>
                <span class="text-gray-900 ml-1 truncate">{{ archivo.responsable || 'N/A' }}</span>
              </div>
              <div class="col-span-2">
                <span class="text-gray-500 font-medium">Fecha:</span>
                <span class="text-gray-900 ml-1">{{ formatDate(archivo.fecha_actualizacion) }}</span>
              </div>
            </div>

            <!-- Etiquetas de alcance geográfico -->
            <div v-if="archivo.alcance_geografico" class="mb-3">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="(lugar, index) in (archivo.alcance_geografico || '').split(',')" 
                  :key="index" 
                  v-show="lugar.trim()"
                  class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ lugar.trim() }}
                </span>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <div class="flex items-center space-x-2">
                <!-- Botón Ver detalles -->
                <button 
                  @click="$emit('ver', archivo.id)"
                  class="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 rounded-lg text-xs font-medium transition-all duration-200"
                  title="Ver detalles"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Ver
                </button>
                
                <!-- Botón Descargar -->
                <button 
                  @click="descargarArchivo(archivo)"
                  class="flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-700 rounded-lg text-xs font-medium transition-all duration-200"
                  title="Descargar archivo"
                  :disabled="descargandoArchivos[archivo.id]"
                >
                  <!-- Mostrar spinner si se está descargando -->
                  <svg v-if="descargandoArchivos[archivo.id]" class="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <!-- Icono normal de descarga -->
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descargar
                </button>
              </div>

              <!-- Botones de administración - Solo para admin -->
              <div v-if="esUsuarioAutorizado" class="flex items-center space-x-2">
                <!-- Botón Editar -->
                <button 
                  @click="abrirModalEditar(archivo)"
                  class="w-7 h-7 bg-amber-100 hover:bg-amber-200 text-amber-600 hover:text-amber-700 rounded-lg flex items-center justify-center transition-all duration-200"
                  title="Editar archivo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <!-- Botón Eliminar -->
                <button 
                  @click="confirmarEliminar(archivo)"
                  class="w-7 h-7 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded-lg flex items-center justify-center transition-all duration-200"
                  title="Eliminar archivo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Edición responsivo -->
    <div v-if="modalEditarVisible" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center p-2 sm:p-4">
      <!-- Fondo oscuro con animación -->
      <div 
        class="fixed inset-0 bg-black transition-opacity duration-300"
        :class="{ 'bg-opacity-70': modalEditarVisible, 'bg-opacity-0': !modalEditarVisible }" 
        @click="cerrarModalEditar"
      ></div>
      
      <!-- Contenido del modal responsivo -->
      <div 
        class="relative bg-white rounded-2xl w-full max-w-[95vw] sm:max-w-4xl shadow-2xl transform transition-all duration-300 overflow-hidden max-h-[95vh]"
        :class="{ 'scale-100 opacity-100': modalEditarVisible, 'scale-95 opacity-0': !modalEditarVisible }"
      >
        <!-- Cabecera del modal -->
        <div class="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-2xl px-4 sm:px-8 py-3 sm:py-5 flex items-center justify-between">
          <h3 class="text-base sm:text-xl font-semibold flex items-center gap-2 sm:gap-3 truncate">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-7 sm:w-7 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span class="truncate">Editar: {{ archivoEditando?.nombre }}</span>
          </h3>
          <button 
            @click="cerrarModalEditar" 
            class="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/20 flex-shrink-0"
          >
            <svg class="h-5 w-5 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Formulario de edición con scroll -->
        <div class="p-4 sm:p-8 overflow-y-auto max-h-[calc(95vh-120px)]">
          <form @submit.prevent="guardarCambios" class="space-y-4 sm:space-y-6">
            <!-- Información básica -->
            <div class="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-200">
              <h4 class="text-base sm:text-lg font-semibold text-blue-800 mb-3 sm:mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Información General
              </h4>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre del archivo</label>
                  <input 
                    v-model="formularioEdicion.nombre" 
                    type="text" 
                    class="w-full rounded-lg border border-gray-300 shadow-sm px-3 sm:px-4 py-2 sm:py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm sm:text-base" 
                    placeholder="Nombre del archivo"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
                  <input 
                    v-model="formularioEdicion.tipo" 
                    type="text" 
                    class="w-full rounded-lg border border-gray-300 shadow-sm px-3 sm:px-4 py-2 sm:py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm sm:text-base" 
                    placeholder="Tipo de archivo"
                  />
                </div>
              </div>
              
              <div class="mt-3 sm:mt-4">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                <textarea 
                  v-model="formularioEdicion.descripcion" 
                  rows="3" 
                  class="w-full rounded-lg border border-gray-300 shadow-sm px-3 sm:px-4 py-2 sm:py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm sm:text-base resize-none" 
                  placeholder="Descripción del archivo"
                ></textarea>
              </div>
              
              <!-- Sección para reemplazar archivo -->
              <div class="mt-3 sm:mt-4 p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h5 class="text-sm font-semibold text-amber-800 mb-2 sm:mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  Reemplazar archivo (opcional)
                </h5>
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <label for="nuevo-archivo" class="cursor-pointer bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 sm:px-4 py-2 rounded-lg border border-amber-300 transition-all hover:shadow-md flex items-center gap-2 text-xs sm:text-sm justify-center sm:justify-start">
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
                  <div v-if="nuevoArchivoSeleccionado" class="text-xs sm:text-sm text-gray-600 bg-white px-3 py-2 rounded border truncate flex-1">
                    {{ nuevoArchivoSeleccionado.name }}
                  </div>
                  <div v-else class="text-xs text-amber-600 italic text-center sm:text-left">
                    No se ha seleccionado un nuevo archivo
                  </div>
                </div>
                <p class="text-xs text-amber-600 mt-2">
                  Si seleccionas un nuevo archivo, reemplazará completamente el archivo actual.
                </p>
              </div>
            </div>

            <!-- Información del responsable -->
            <div class="bg-green-50 rounded-xl p-4 sm:p-6 border border-green-200">
              <h4 class="text-base sm:text-lg font-semibold text-green-800 mb-3 sm:mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Detalles del Responsable
              </h4>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Responsable</label>
                  <input 
                    v-model="formularioEdicion.responsable" 
                    type="text" 
                    class="w-full rounded-lg border border-gray-300 shadow-sm px-3 sm:px-4 py-2 sm:py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm sm:text-base" 
                    placeholder="Nombre del responsable"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Fuente</label>
                  <input 
                    v-model="formularioEdicion.fuente" 
                    type="text" 
                    class="w-full rounded-lg border border-gray-300 shadow-sm px-3 sm:px-4 py-2 sm:py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm sm:text-base" 
                    placeholder="Fuente del archivo"
                  />
                </div>
              </div>
            </div>

            <!-- Etiquetas y ubicación -->
            <div class="bg-purple-50 rounded-xl p-4 sm:p-6 border border-purple-200">
              <h4 class="text-base sm:text-lg font-semibold text-purple-800 mb-3 sm:mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Etiquetas y Ubicación
              </h4>
              
              <div class="grid grid-cols-1 gap-3 sm:gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Etiquetas</label>
                  <input 
                    v-model="formularioEdicion.etiquetas" 
                    type="text" 
                    class="w-full rounded-lg border border-gray-300 shadow-sm px-3 sm:px-4 py-2 sm:py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm sm:text-base" 
                    placeholder="Etiquetas separadas por comas"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Alcance geográfico</label>
                  <input 
                    v-model="formularioEdicion.alcance_geografico" 
                    type="text" 
                    class="w-full rounded-lg border border-gray-300 shadow-sm px-3 sm:px-4 py-2 sm:py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm sm:text-base" 
                    placeholder="Ubicación geográfica"
                  />
                </div>
              </div>
            </div>

            <!-- Validación y observaciones -->
            <div class="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
              <h4 class="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Validación y Notas
              </h4>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Estado de validación</label>
                  <select 
                    v-model="formularioEdicion.validacion" 
                    class="w-full rounded-lg border border-gray-300 shadow-sm px-3 sm:px-4 py-2 sm:py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm sm:text-base"
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
                  class="w-full rounded-lg border border-gray-300 shadow-sm px-3 sm:px-4 py-2 sm:py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm sm:text-base resize-none" 
                  placeholder="Observaciones adicionales"
                ></textarea>
              </div>
            </div>

            <!-- Botones de acción responsivos -->
            <div class="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
              <button 
                type="button"
                @click="cerrarModalEditar"
                class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium text-sm sm:text-base order-2 sm:order-1"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                :disabled="guardandoCambios"
                class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all font-medium shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-2"
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

    <!-- Modal de Confirmación para Eliminar -->
    <div v-if="modalEliminarVisible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Overlay con animación de fade -->
      <div 
        class="fixed inset-0 bg-black transition-opacity duration-300 ease-out"
        :class="modalEliminarVisible ? 'opacity-50' : 'opacity-0'"
        @click="cerrarModalEliminar"
      ></div>
      
      <!-- Modal con animación de escala y rebote -->
      <div 
        class="relative bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out w-full max-w-md mx-auto"
        :class="modalEliminarVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'"
        style="animation: modalBounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);"
      >
        <!-- Cabecera con degradado rojo -->
        <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-t-2xl p-6 text-center">
          <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white">¿Eliminar archivo?</h3>
          <p class="text-red-100 text-sm mt-1">Esta acción no se puede deshacer</p>
        </div>
        
        <!-- Contenido del modal -->
        <div class="p-6">
          <!-- Información del archivo -->
          <div class="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                     :class="getFileTypeColor(archivoAEliminar?.tipo)">
                  {{ archivoAEliminar?.tipo || 'DOC' }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-semibold text-gray-900 truncate" :title="archivoAEliminar?.nombre">
                  {{ archivoAEliminar?.nombre }}
                </h4>
                <p class="text-xs text-gray-500 truncate" :title="archivoAEliminar?.descripcion">
                  {{ archivoAEliminar?.descripcion || 'Sin descripción' }}
                </p>
                <div class="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                  <span>{{ formatFileSize(archivoAEliminar?.tamano) }}</span>
                  <span>{{ formatDate(archivoAEliminar?.fecha_actualizacion) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Mensaje de advertencia -->
          <div class="text-center mb-6">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed">
              El archivo será eliminado permanentemente de la biblioteca y la base de datos.
            </p>
          </div>
          
          <!-- Botones de acción -->
          <div class="flex space-x-3">
            <button 
              @click="cerrarModalEliminar"
              class="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancelar
            </button>
            <button 
              @click="eliminarArchivo"
              :disabled="eliminandoArchivo"
              class="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg v-if="eliminandoArchivo" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>{{ eliminandoArchivo ? 'Eliminando...' : 'Eliminar' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para subir archivos -->
    <div v-if="modalSubidaVisible" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center p-2 sm:p-3">
      <!-- Fondo oscuro con animación -->
      <div 
        class="fixed inset-0 bg-black transition-opacity duration-300"
        :class="{ 'bg-opacity-70': modalSubidaVisible, 'bg-opacity-0': !modalSubidaVisible }" 
        @click="modalSubidaVisible = false"
      ></div>
      
      <!-- Contenido del modal responsivo -->
      <div 
        class="relative bg-white rounded-xl w-full max-w-[90vw] sm:max-w-[620px] max-h-[90vh] shadow-2xl transform transition-all duration-300 overflow-hidden"
        :class="{ 'scale-100 opacity-100': modalSubidaVisible, 'scale-95 opacity-0': !modalSubidaVisible }"
      >
        <!-- Cabecera del modal -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-t-xl px-3 sm:px-4 py-2 flex items-center justify-between">
          <h3 class="text-sm sm:text-base font-semibold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
            </svg>
            Subir nuevo archivo
          </h3>
          <button 
            @click="modalSubidaVisible = false" 
            class="text-white hover:text-purple-100 transition-colors p-1 rounded-full hover:bg-white/20"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Formulario responsivo -->
        <form @submit.prevent="subirArchivo" class="p-3 sm:p-4 space-y-3 bg-white max-h-[calc(90vh-60px)] overflow-y-auto">
          
          <!-- Campo de archivo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Archivo *</label>
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <label for="file-upload-archivos" class="cursor-pointer bg-purple-50 hover:bg-purple-100 text-purple-600 px-3 py-2 rounded-lg border border-purple-200 transition-all flex items-center gap-2 text-sm justify-center sm:justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                Seleccionar archivo
              </label>
              <input 
                type="file" 
                id="file-upload-archivos"
                @change="seleccionarArchivo" 
                class="hidden" 
                required 
              />
              <div class="flex-1 py-2 px-3 bg-gray-50 text-sm text-gray-600 rounded-lg border border-gray-200 truncate h-8 flex items-center">
                {{ archivoNombre || 'Ningún archivo seleccionado' }}
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-1">Tamaño máximo: 50MB</p>
          </div>
          
          <!-- Descripción -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea 
              v-model="descripcion" 
              rows="2" 
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all resize-none" 
              placeholder="Descripción del archivo">
            </textarea>
          </div>
          
          <!-- Grid responsive para campos básicos -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Responsable -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
              <input 
                v-model="responsable" 
                type="text" 
                class="w-full rounded-lg border border-gray-300 px-3 py-2 h-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all" 
                placeholder="Responsable" 
              />
            </div>
            
            <!-- Fuente -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fuente</label>
              <input 
                v-model="fuente" 
                type="text" 
                class="w-full rounded-lg border border-gray-300 px-3 py-2 h-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all" 
                placeholder="Fuente" 
              />
            </div>
          </div>
          
          <!-- Grid responsivo para campos con chips -->
          <div class="grid grid-cols-1 gap-3">
            
            <!-- Etiquetas -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Etiquetas</label>
              <div class="flex flex-wrap gap-2 p-2 rounded-lg border border-gray-300 bg-white min-h-[32px] focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all">
                <!-- Chips de etiquetas -->
                <div 
                  v-for="(tag, index) in etiquetasArray" 
                  :key="index"
                  class="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 animate-pop-in"
                >
                  {{ tag }}
                  <button 
                    @click="eliminarEtiqueta(index)" 
                    class="text-orange-500 hover:text-orange-700 focus:outline-none transition-colors rounded-full hover:bg-orange-200 p-0.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <!-- Input para etiquetas -->
                <input 
                  v-model="etiquetaInput" 
                  @keydown="gestionarEtiquetas"
                  @blur="agregarEtiquetaEnBlur"
                  type="text" 
                  class="flex-grow min-w-[80px] py-1 px-2 focus:outline-none text-sm text-gray-700" 
                  placeholder="Agregar etiquetas..."
                />
              </div>
            </div>
            
            <!-- Alcance geográfico -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Alcance geográfico</label>
              <div class="relative alcance-geografico-container">
                <div class="flex flex-wrap gap-2 p-2 rounded-lg border border-gray-300 bg-white min-h-[32px] focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all">
                  <!-- Chips de ubicaciones -->
                  <div 
                    v-for="(lugar, index) in alcanceArray" 
                    :key="index"
                    class="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 animate-pop-in"
                  >
                    {{ lugar.name }}
                    <button 
                      @click="eliminarLugar(index)" 
                      class="text-purple-500 hover:text-purple-700 focus:outline-none transition-colors rounded-full hover:bg-purple-200 p-0.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Input de búsqueda -->
                  <input 
                    v-model="alcanceInput" 
                    @input="buscarUbicaciones"
                    @keydown="gestionarTeclasAlcance"
                    @focus="activarBusquedaUbicaciones"
                    @blur="setTimeout(() => mostrarSugerencias = false, 200)"
                    type="text" 
                    class="flex-grow min-w-[80px] py-1 px-2 focus:outline-none text-sm text-gray-700" 
                    placeholder="Buscar ubicaciones..." 
                  />
                </div>
                
                <!-- Lista de sugerencias -->
                <div 
                  v-if="mostrarSugerencias && !cargandoUbicaciones" 
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-32 overflow-y-auto"
                >
                  <div 
                    v-if="sugerenciasUbicacion.length > 0"
                    v-for="(sugerencia, index) in sugerenciasUbicacion" 
                    :key="index"
                    @click="seleccionarUbicacion(sugerencia)"
                    class="px-2 py-1 hover:bg-purple-50 cursor-pointer text-xs text-gray-700 border-b border-gray-100 last:border-b-0 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="truncate">{{ sugerencia.display_name }}</span>
                  </div>
                  
                  <div 
                    v-if="sugerenciasUbicacion.length === 0 && alcanceInput.length >= 2"
                    class="px-2 py-1 text-xs text-gray-600 text-center"
                  >
                    No encontrado
                  </div>
                </div>
                
                <!-- Indicador de carga -->
                <div 
                  v-if="cargandoUbicaciones && mostrarSugerencias" 
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-1 text-center text-xs text-gray-600"
                >
                  <div class="animate-spin inline-block mr-1 h-2.5 w-2.5 border-t-2 border-purple-500 rounded-full"></div>
                  Buscando...
                </div>
              </div>
            </div>
          </div>
          
          <!-- Campo de Validación responsive -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado de validación *</label>
            
            <!-- Radio buttons responsivos -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              
              <!-- Opción 1: Verificado -->
              <label class="cursor-pointer">
                <input 
                  type="radio" 
                  v-model="validacion" 
                  value="Verificado" 
                  class="sr-only"
                />
                <div class="p-2 sm:p-3 rounded-lg border-2 text-center transition-all"
                     :class="validacion === 'Verificado' 
                       ? 'border-green-500 bg-green-50 shadow-md' 
                       : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'">
                  <div class="flex items-center justify-center mb-1 sm:mb-2">
                    <div class="w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all"
                         :class="validacion === 'Verificado' ? 'bg-green-500 ring-2 ring-green-200' : 'bg-green-200'"></div>
                  </div>
                  <div class="text-xs sm:text-sm transition-all"
                       :class="validacion === 'Verificado' ? 'text-gray-800 font-bold' : 'text-gray-600 font-medium'">
                    Verificado
                  </div>
                </div>
              </label>
              
              <!-- Opción 2: Sin definir -->
              <label class="cursor-pointer">
                <input 
                  type="radio" 
                  v-model="validacion" 
                  value="Sin definir" 
                  class="sr-only"
                />
                <div class="p-2 sm:p-3 rounded-lg border-2 text-center transition-all"
                     :class="validacion === 'Sin definir' 
                       ? 'border-gray-500 bg-gray-50 shadow-md' 
                       : 'border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50'">
                  <div class="flex items-center justify-center mb-1 sm:mb-2">
                    <div class="w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all"
                         :class="validacion === 'Sin definir' ? 'bg-gray-500 ring-2 ring-gray-200' : 'bg-gray-300'"></div>
                  </div>
                  <div class="text-xs sm:text-sm transition-all"
                       :class="validacion === 'Sin definir' ? 'text-gray-800 font-bold' : 'text-gray-600 font-medium'">
                    Sin definir
                  </div>
                </div>
              </label>
              
              <!-- Opción 3: Borrador -->
              <label class="cursor-pointer">
                <input 
                  type="radio" 
                  v-model="validacion" 
                  value="Borrador" 
                  class="sr-only"
                />
                <div class="p-2 sm:p-3 rounded-lg border-2 text-center transition-all"
                     :class="validacion === 'Borrador' 
                       ? 'border-orange-500 bg-orange-50 shadow-md' 
                       : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50'">
                  <div class="flex items-center justify-center mb-1 sm:mb-2">
                    <div class="w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all"
                         :class="validacion === 'Borrador' ? 'bg-orange-500 ring-2 ring-orange-200' : 'bg-orange-200'"></div>
                  </div>
                  <div class="text-xs sm:text-sm transition-all"
                       :class="validacion === 'Borrador' ? 'text-gray-800 font-bold' : 'text-gray-600 font-medium'">
                    Borrador
                  </div>
                </div>
              </label>
            </div>
          </div>
          
          <!-- Observaciones -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
            <input 
              v-model="observaciones" 
              type="text" 
              class="w-full rounded-lg border border-gray-300 px-3 py-2 h-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" 
              placeholder="Observaciones adicionales" 
            />
          </div>
          
          <!-- Botones de acción responsivos -->
          <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 border-t border-gray-200">
            <button 
              type="button" 
              @click="modalSubidaVisible = false" 
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors order-2 sm:order-1"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              :disabled="subiendo"
              class="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              <svg v-if="subiendo" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ subiendo ? 'Subiendo...' : 'Subir archivo' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmación de archivo subido -->
    <div v-if="confirmacionVisible" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <!-- Fondo oscuro con animación mejorada -->
      <div 
        class="fixed inset-0 bg-black transition-opacity duration-300"
        :class="{ 'bg-opacity-70': confirmacionVisible, 'bg-opacity-0': !confirmacionVisible }" 
        @click="cerrarConfirmacion"
      ></div>
      
      <!-- Modal con animación mejorada -->
      <div 
        class="relative bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 overflow-hidden"
        :class="{ 'translate-y-0 scale-100 opacity-100': confirmacionVisible, 'translate-y-4 scale-95 opacity-0': !confirmacionVisible }"
      >
        <div class="bg-gradient-to-b from-white to-gray-50 flex flex-col items-center p-8 text-center">
          <!-- Icono de éxito con animación mejorada -->
          <div class="relative">
            <!-- Círculo exterior pulsante -->
            <div class="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-25"></div>
            <!-- Círculo base -->
            <div class="relative w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          
          <!-- Texto de confirmación -->
          <h3 class="mt-6 text-xl font-bold text-gray-900">¡Archivo subido!</h3>
          <p class="mt-2 text-gray-600 leading-relaxed">
            El archivo se ha guardado correctamente en la biblioteca.
          </p>
          
          <!-- Botón de cierre -->
          <button 
            @click="cerrarConfirmacion"
            class="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>

    <!-- Sistema de Notificaciones responsivo -->
    <div class="fixed top-2 sm:top-4 right-2 sm:right-4 z-50 space-y-2 sm:space-y-3 max-w-[calc(100vw-16px)] sm:max-w-sm">
      <div 
        v-for="notificacion in notificaciones" 
        :key="notificacion.id"
        class="transform transition-all duration-500 ease-out"
        :class="[
          notificacion.visible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95',
          'bg-white rounded-xl shadow-lg border-l-4 p-3 sm:p-4',
          notificacion.tipo === 'success' ? 'border-green-500' : '',
          notificacion.tipo === 'error' ? 'border-red-500' : '',
          notificacion.tipo === 'info' ? 'border-blue-500' : '',
          notificacion.tipo === 'warning' ? 'border-yellow-500' : ''
        ]"
      >
        <div class="flex items-start space-x-2 sm:space-x-3">
          <div class="flex-shrink-0">
            <!-- Icono de éxito con animación -->
            <div v-if="notificacion.tipo === 'success'" class="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <!-- Icono de error -->
            <div v-else-if="notificacion.tipo === 'error'" class="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <!-- Icono de información -->
            <div v-else-if="notificacion.tipo === 'info'" class="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <!-- Icono de advertencia -->
            <div v-else-if="notificacion.tipo === 'warning'" class="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs sm:text-sm font-medium text-gray-900 leading-relaxed break-words">
              {{ notificacion.mensaje }}
            </p>
          </div>
          <div class="flex-shrink-0">
            <button 
              @click="ocultarNotificacion(notificacion.id)"
              class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors p-0.5 sm:p-1 rounded-full hover:bg-gray-100"
            >
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Barra de progreso para auto-cierre -->
        <div class="mt-2 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-75 ease-linear"
            :class="[
              notificacion.tipo === 'success' ? 'bg-green-500' : '',
              notificacion.tipo === 'error' ? 'bg-red-500' : '',
              notificacion.tipo === 'info' ? 'bg-blue-500' : '',
              notificacion.tipo === 'warning' ? 'bg-yellow-500' : ''
            ]"
            style="animation: progressBar 5s linear forwards;"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { API_CONFIG, buildApiUrl } from '../config/api.js'
// Importar funciones utilitarias centralizadas para manejo de archivos
import { formatFileSize, calculateTotalSize, bytesToMB } from '../utils/fileUtils.js'

// Definir emits
defineEmits(['ver'])

// Verificar si el usuario actual está autorizado (cualquier usuario con rol 'admin')
const esUsuarioAutorizado = computed(() => {
  const userData = localStorage.getItem('userData')
  if (!userData) return false
  
  try {
    const usuario = JSON.parse(userData)
    // Comprobar si el usuario tiene el rol 'admin'
    return usuario.rol === 'admin'
  } catch (error) {
    console.error('Error al verificar autorización del usuario:', error)
    return false
  }
})

// Variables reactivas
const archivos = ref([])
const cargandoPagina = ref(false)

// Configurar axios y URLs
axios.defaults.timeout = 10000
const BACKEND_URL = import.meta.env.DEV 
  ? 'http://localhost:4000/api' 
  : 'https://api.biblioteca.sembrandodatos.com/api'

console.log('ArchivosView - Backend URL:', BACKEND_URL)

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

// Variables para el modal de eliminación
const modalEliminarVisible = ref(false)
const archivoAEliminar = ref(null)
const eliminandoArchivo = ref(false)

// Variables para controlar el estado de descarga
const descargandoArchivos = ref({})

// NUEVO: Variables para el modal de subida de archivos (reutilizando lógica del Dashboard)
const modalSubidaVisible = ref(false)
const archivo = ref(null)
const archivoNombre = ref('')
const descripcion = ref('')
const tipo = ref('')
const responsable = ref('')
const fuente = ref('')
const etiquetasArray = ref([])
const etiquetaInput = ref('')
const alcanceArray = ref([])
const alcanceInput = ref('')
const validacion = ref('')
const observaciones = ref('')
const subiendo = ref(false)
const confirmacionVisible = ref(false)
const sugerenciasUbicacion = ref([])
const mostrarSugerencias = ref(false)
const cargandoUbicaciones = ref(false)

// Watcher para asegurar que el modal de subida solo se abra si el usuario tiene rol 'admin'
watch(modalSubidaVisible, (nuevoValor) => {
  if (nuevoValor && !esUsuarioAutorizado.value) {
    modalSubidaVisible.value = false
    mostrarNotificacion('No tienes permiso para subir archivos', 'error')
  }
})

// Variables para notificaciones
const notificaciones = ref([])
let notificacionId = 0

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

// Propiedades computadas para estadísticas usando funciones utilitarias centralizadas
const totalSize = computed(() => {
  console.log('ArchivosView totalSize - calculando...')
  
  // Si hay filtros activos, mostrar el tamaño total de los archivos filtrados
  const archivosToSum = hayFiltrosActivos.value ? archivosFiltrados.value : archivos.value
  
  console.log('ArchivosView totalSize - archivos a sumar:', archivosToSum.length)
  
  if (!archivosToSum || archivosToSum.length === 0) {
    console.log('ArchivosView totalSize - no hay archivos, retornando 0')
    return 0
  }
  
  let total = 0
  archivosToSum.forEach((archivo, index) => {
    const tamano = archivo.tamano || archivo.size || 0
    const tamanoNum = Number(tamano)
    
    if (index < 3) { // Debug de los primeros 3 archivos
      console.log(`ArchivosView - Archivo ${index + 1}:`, {
        nombre: archivo.nombre,
        tamano_original: tamano,
        tamano_convertido: tamanoNum
      })
    }
    
    if (!isNaN(tamanoNum) && tamanoNum > 0) {
      total += tamanoNum
    }
  })
  
  console.log('ArchivosView totalSize resultado:', total, 'bytes')
  console.log('ArchivosView totalSize formateado:', formatFileSize(total))
  return total
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
  console.log('ArchivosView montado')
  await cargarArchivos()
})

async function cargarArchivos() {
  console.log('ArchivosView - Cargando archivos...')
  
  try {
    cargandoPagina.value = true
    
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 15000
    }
    
    console.log('ArchivosView - Petición a:', `${BACKEND_URL}/archivos`)
    
    const res = await axios.get(`${BACKEND_URL}/archivos`, config)
    
    console.log('ArchivosView - Respuesta:', res.status, res.data)
    
    // Obtener todos los archivos sin paginación para el sidebar
    archivos.value = res.data.items || res.data || []
    
    console.log('ArchivosView - Archivos cargados:', archivos.value.length)
    
  } catch (err) {
    console.error('ArchivosView - Error al cargar archivos:', err)
    
    // Intentar URL alternativa
    if (err.response?.status === 404 || err.code === 'ECONNREFUSED') {
      try {
        const fallbackUrl = BACKEND_URL.replace('/api', '')
        console.log('ArchivosView - Intentando fallback:', fallbackUrl)
        
        const res = await axios.get(`${fallbackUrl}/archivos`)
        archivos.value = res.data.items || res.data || []
        console.log('ArchivosView - Fallback exitoso:', archivos.value.length)
      } catch (fallbackErr) {
        console.error('ArchivosView - Error en fallback:', fallbackErr)
        archivos.value = []
        mostrarNotificacion('Error de conexión con el servidor', 'error')
      }
    } else {
      archivos.value = []
      mostrarNotificacion('Error al cargar archivos: ' + err.message, 'error')
    }
  } finally {
    cargandoPagina.value = false
  }
}

// Funciones del modal de edición
function abrirModalEditar(archivo) {
  // Verificar si el usuario tiene rol 'admin' antes de abrir el modal
  if (!esUsuarioAutorizado.value) {
    mostrarNotificacion('No tienes permiso para editar archivos', 'error')
    return
  }
  
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
  
  // Verificación adicional de seguridad para asegurar que solo usuarios con rol 'admin' puedan guardar cambios
  if (!esUsuarioAutorizado.value) {
    mostrarNotificacion('No tienes permiso para modificar archivos', 'error')
    cerrarModalEditar()
    return
  }
  
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
    mostrarNotificacion('Archivo actualizado correctamente', 'success')
    
    // Cerrar modal
    cerrarModalEditar()
    
    // Recargar la lista para asegurar datos actualizados
    await cargarArchivos()
    
  } catch (error) {
    console.error('Error al actualizar archivo:', error)
    mostrarNotificacion('Error al actualizar el archivo: ' + (error.response?.data?.error || error.message), 'error')
  } finally {
    guardandoCambios.value = false
  }
}

// Funciones para eliminar archivo
function confirmarEliminar(archivo) {
  // Verificar si el usuario tiene rol 'admin' antes de abrir el modal de confirmación
  if (!esUsuarioAutorizado.value) {
    mostrarNotificacion('No tienes permiso para eliminar archivos', 'error')
    return
  }
  
  archivoAEliminar.value = archivo
  modalEliminarVisible.value = true
}

function cerrarModalEliminar() {
  modalEliminarVisible.value = false
  archivoAEliminar.value = null
}

async function eliminarArchivo() {
  if (!archivoAEliminar.value) return
  
  // Verificación adicional de seguridad para asegurar que solo usuarios con rol 'admin' puedan eliminar archivos
  if (!esUsuarioAutorizado.value) {
    mostrarNotificacion('No tienes permiso para eliminar archivos', 'error')
    cerrarModalEliminar()
    return
  }
  
  try {
    eliminandoArchivo.value = true
    
    // Llamar al endpoint DELETE del backend
    const response = await axios.delete(`${BACKEND_URL}/archivos/${archivoAEliminar.value.id}`)
    
    console.log('Archivo eliminado:', response.data)
    
    // Eliminar el archivo de la lista local
    const index = archivos.value.findIndex(a => a.id === archivoAEliminar.value.id)
    if (index !== -1) {
      archivos.value.splice(index, 1)
    }
    
    // Mostrar mensaje de éxito
    mostrarNotificacion('Archivo eliminado correctamente de la biblioteca', 'success')
    
    // Cerrar modal
    cerrarModalEliminar()
    
  } catch (error) {
    console.error('Error al eliminar archivo:', error)
    mostrarNotificacion('Error al eliminar el archivo: ' + (error.response?.data?.error || error.message), 'error')
  } finally {
    eliminandoArchivo.value = false
  }
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
  const id = ++notificacionId
  const notificacion = {
    id,
    mensaje,
    tipo, // 'success', 'error', 'info', 'warning'
    visible: true
  }
  
  notificaciones.value.push(notificacion)
  
  // Auto-eliminar después de 5 segundos
  setTimeout(() => {
    ocultarNotificacion(id)
  }, 5000)
}

// Función para ocultar notificaciones
function ocultarNotificacion(id) {
  const index = notificaciones.value.findIndex(n => n.id === id)
  if (index !== -1) {
    notificaciones.value[index].visible = false
    // Eliminar después de la animación
    setTimeout(() => {
      notificaciones.value.splice(index, 1)
    }, 300)
  }
}

// NUEVAS FUNCIONES PARA MODAL DE SUBIDA DE ARCHIVOS (Reutilizando lógica del Dashboard)

// Función para seleccionar archivo
function seleccionarArchivo(event) {
  const file = event.target.files[0]
  if (file) {
    archivo.value = file
    archivoNombre.value = file.name
    
    // Auto-detectar tipo de archivo
    const extension = file.name.split('.').pop().toLowerCase()
    const tiposArchivo = {
      'pdf': 'PDF',
      'doc': 'DOC',
      'docx': 'DOCX',
      'xls': 'XLS',
      'xlsx': 'XLSX',
      'jpg': 'JPG',
      'jpeg': 'JPEG',
      'png': 'PNG',
      'txt': 'TXT',
      'zip': 'ZIP',
      'rar': 'RAR'
    }
    tipo.value = tiposArchivo[extension] || extension.toUpperCase()
  }
}

// Funciones para manejar etiquetas
function gestionarEtiquetas(event) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    agregarEtiqueta()
  } else if (event.key === 'Backspace' && !etiquetaInput.value && etiquetasArray.value.length > 0) {
    eliminarEtiqueta(etiquetasArray.value.length - 1)
  }
}

function agregarEtiqueta() {
  if (etiquetaInput.value.trim() && !etiquetasArray.value.includes(etiquetaInput.value.trim())) {
    etiquetasArray.value.push(etiquetaInput.value.trim())
    etiquetaInput.value = ''
  }
}

function agregarEtiquetaEnBlur() {
  if (etiquetaInput.value.trim()) {
    agregarEtiqueta()
  }
}

function eliminarEtiqueta(index) {
  etiquetasArray.value.splice(index, 1)
}

// Funciones para alcance geográfico
async function buscarUbicaciones() {
  if (alcanceInput.value.length < 2) {
    mostrarSugerencias.value = false
    return
  }

  try {
    cargandoUbicaciones.value = true
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(alcanceInput.value)}&limit=5&addressdetails=1`)
    const data = await response.json()
    
    sugerenciasUbicacion.value = data.map(item => ({
      name: item.display_name.split(',').slice(0, 3).join(', '),
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon
    }))
    
    mostrarSugerencias.value = true
  } catch (error) {
    console.error('Error al buscar ubicaciones:', error)
  } finally {
    cargandoUbicaciones.value = false
  }
}

function activarBusquedaUbicaciones() {
  if (alcanceInput.value.length >= 2) {
    mostrarSugerencias.value = true
  }
}

function seleccionarUbicacion(ubicacion) {
  if (!alcanceArray.value.find(item => item.name === ubicacion.name)) {
    alcanceArray.value.push(ubicacion)
  }
  alcanceInput.value = ''
  mostrarSugerencias.value = false
}

function eliminarLugar(index) {
  alcanceArray.value.splice(index, 1)
}

function gestionarTeclasAlcance(event) {
  if (event.key === 'Backspace' && !alcanceInput.value && alcanceArray.value.length > 0) {
    eliminarLugar(alcanceArray.value.length - 1)
  }
}

// Función principal para subir archivo
async function subirArchivo() {
  // Verificación adicional de seguridad para asegurar que solo usuarios con rol 'admin' puedan subir archivos
  if (!esUsuarioAutorizado.value) {
    mostrarNotificacion('No tienes permiso para subir archivos', 'error')
    modalSubidaVisible.value = false
    return
  }
  
  if (!archivo.value) {
    mostrarNotificacion('Debe seleccionar un archivo', 'error')
    return
  }

  if (!validacion.value) {
    mostrarNotificacion('Debe seleccionar un estado de validación', 'error')
    return
  }

  try {
    subiendo.value = true

    const formData = new FormData()
    formData.append('file', archivo.value)
    formData.append('descripcion', descripcion.value || '')
    formData.append('etiquetas', etiquetasArray.value.join(', '))
    formData.append('responsable', responsable.value || '')
    formData.append('fuente', fuente.value || '')
    formData.append('alcance', alcanceArray.value.map(u => u.name).join(', '))
    formData.append('validacion', validacion.value)
    formData.append('observaciones', observaciones.value || '')
    
    // Agregar coordenadas si están disponibles
    if (alcanceArray.value.length > 0) {
      formData.append('alcance_coordenadas', JSON.stringify(alcanceArray.value))
    }

    const response = await axios.post(`${BACKEND_URL}/archivos/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log('Archivo subido exitosamente:', response.data)
    
    // Limpiar formulario
    limpiarFormularioSubida()
    
    // Mostrar confirmación
    confirmacionVisible.value = true
    
    // Recargar lista de archivos
    await cargarArchivos()
    
  } catch (error) {
    console.error('Error al subir archivo:', error)
    mostrarNotificacion('Error al subir el archivo: ' + (error.response?.data?.error || error.message), 'error')
  } finally {
    subiendo.value = false
  }
}

// Función para limpiar el formulario de subida
function limpiarFormularioSubida() {
  archivo.value = null
  archivoNombre.value = ''
  descripcion.value = ''
  tipo.value = ''
  responsable.value = ''
  fuente.value = ''
  etiquetasArray.value = []
  etiquetaInput.value = ''
  alcanceArray.value = []
  alcanceInput.value = ''
  validacion.value = ''
  observaciones.value = ''
  modalSubidaVisible.value = false
}

// Función para cerrar confirmación
function cerrarConfirmacion() {
  confirmacionVisible.value = false
}

// Función para descargar archivo
async function descargarArchivo(archivo) {
  console.log('Iniciando descarga del archivo:', archivo.nombre)
  
  try {
    // Marcar como descargando
    descargandoArchivos.value[archivo.id] = true
    
    // Construir la URL de descarga - usar el endpoint correcto del backend
    // El backend tiene los endpoints: /archivos/descargar/:id y /api/archivos/descargar/:id
    const downloadUrl = `${BACKEND_URL}/archivos/descargar/${archivo.id}`
    
    console.log('URL de descarga:', downloadUrl)
    
    // Realizar la petición de descarga
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`)
    }
    
    // Obtener el blob del archivo
    const blob = await response.blob()
    
    // Crear un enlace temporal para la descarga
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // Usar el nombre original del archivo o extraer de los headers de respuesta
    let filename = archivo.nombre
    const contentDisposition = response.headers.get('content-disposition')
    if (contentDisposition) {
      const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (match && match[1]) {
        filename = match[1].replace(/['"]/g, '')
        filename = decodeURIComponent(filename)
      }
    }
    
    link.download = filename
    
    // Agregar al DOM, hacer click y remover
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Limpiar la URL temporal
    window.URL.revokeObjectURL(url)
    
    // Mostrar notificación de éxito
    mostrarNotificacion(`Descarga iniciada: ${filename}`, 'success')
    
    console.log('Descarga completada exitosamente')
    
  } catch (error) {
    console.error('Error al descargar archivo:', error)
    mostrarNotificacion(`Error al descargar el archivo: ${error.message}`, 'error')
  } finally {
    // Remover el estado de descargando
    delete descargandoArchivos.value[archivo.id]
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

/* Animación de rebote para el modal */
@keyframes modalBounce {
  0% {
    opacity: 0;
    transform: scale(0.3) translate3d(0, 0, 0);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Animación suave para el overlay */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.5;
  }
}

/* Animación de la barra de progreso */
@keyframes progressBar {
  from {
    width: 100%;
  }
  to {
    width: 0%;
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

  /* Mejorar spacing en móvil */
  .space-y-3 > * + * {
    margin-top: 0.75rem;
  }

  .gap-3 {
    gap: 0.75rem;
  }
}

/* Responsive breakpoints adicionales */
@media (max-width: 768px) {
  /* Ocultar tabla en tablet pequeño */
  .lg\:hidden {
    display: block;
  }
  
  .lg\:block {
    display: none;
  }

  /* Mejorar modales en tablets */
  .max-w-4xl {
    max-width: 95vw;
  }

  /* Cards responsivos */
  .card-responsive {
    margin: 0.5rem;
    padding: 1rem;
  }
}

@media (min-width: 1024px) {
  /* Mostrar tabla en desktop */
  .lg\:block {
    display: block;
  }
  
  .lg\:hidden {
    display: none;
  }
}

/* Mejoras para notificaciones en móvil */
@media (max-width: 480px) {
  .fixed.top-2.right-2 {
    top: 0.5rem;
    right: 0.5rem;
    left: 0.5rem;
  }

  .max-w-sm {
    max-width: none;
  }
}

/* Animaciones mejoradas para cards */
@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.card-enter {
  animation: slideInUp 0.3s ease-out;
}

/* Mejoras para hover en dispositivos táctiles */
@media (hover: hover) {
  .hover\:shadow-xl:hover {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  .hover\:-translate-y-1:hover {
    transform: translateY(-4px);
  }
}

/* Mejoras para focus en navegación por teclado */
.focus\:ring-2:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Botones responsivos */
@media (max-width: 640px) {
  .btn-responsive {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .btn-icon-responsive {
    width: 2rem;
    height: 2rem;
  }

  .btn-icon-responsive svg {
    width: 1rem;
    height: 1rem;
  }
}

/* Mejoras para texto truncado */
.truncate-responsive {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

@media (max-width: 640px) {
  .truncate-responsive {
    max-width: 150px;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  .truncate-responsive {
    max-width: 200px;
  }
}

/* Mejoras para formularios responsivos */
@media (max-width: 640px) {
  .form-responsive input,
  .form-responsive select,
  .form-responsive textarea {
    font-size: 16px; /* Prevenir zoom en iOS */
  }
}

/* Estados de loading responsivos */
.loading-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@media (max-width: 640px) {
  .loading-spinner {
    width: 0.875rem;
    height: 0.875rem;
  }
}

/* Mejoras para scrolling en móvil */
.overflow-scroll-mobile {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

/* Mejoras para accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .transition-all,
  .transform,
  .animate-spin,
  .animate-pulse {
    transition: none;
    animation: none;
  }
}

/* Dark mode compatibility (preparado para futuro) */
@media (prefers-color-scheme: dark) {
  .bg-white {
    background-color: #1f2937;
    color: #f9fafb;
  }

  .text-gray-900 {
    color: #f9fafb;
  }

  .text-gray-600 {
    color: #d1d5db;
  }

  .border-gray-200 {
    border-color: #374151;
  }
}

/* Clases utilitarias adicionales para responsividad */
.safe-area-inset {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

.touch-manipulation {
  touch-action: manipulation;
}

.select-none-mobile {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Mejoras para performance en móvil */
.will-change-transform {
  will-change: transform;
}

.translate3d-0 {
  transform: translate3d(0, 0, 0);
}

/* Mejoras para interacción táctil */
.tap-highlight-transparent {
  -webkit-tap-highlight-color: transparent;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

.bg-red-100:hover {
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Transiciones suaves para los iconos */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-200 {
  transition-duration: 200ms;
}
</style>
