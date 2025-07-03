<template>
  <div>
    <!-- Título de la página y acciones -->
    <div class="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p class="mt-1 text-sm text-gray-500">Gestiona y visualiza todos los archivos del repositorio</p>
      </div>
      
      <!-- Botón para abrir el modal de subida de archivos -->
      <button 
        @click="modalVisible = true" 
        class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
        Subir archivo
      </button>
    </div>
    
    <!-- Modal para subir archivos -->
    <div v-if="modalVisible" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <!-- Fondo oscuro con animación -->
      <div 
        class="fixed inset-0 bg-black transition-opacity duration-300"
        :class="{ 'bg-opacity-70': modalVisible, 'bg-opacity-0': !modalVisible }" 
        @click="modalVisible = false"
      ></div>
      
      <!-- Contenido del modal con animación -->
      <div 
        class="relative bg-white rounded-2xl w-full max-w-5xl mx-4 shadow-2xl transform transition-all duration-300 overflow-hidden"
        :class="{ 'scale-100 opacity-100': modalVisible, 'scale-95 opacity-0': !modalVisible }"
      >
        <!-- Cabecera del modal mejorada -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl px-8 py-5 flex items-center justify-between">
          <h3 class="text-xl font-semibold flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
            </svg>
            Subir nuevo archivo
          </h3>
          <button 
            @click="modalVisible = false" 
            class="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/20"
          >
            <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Formulario con estilos mejorados -->
        <form @submit.prevent="subirArchivo" class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-b from-white to-gray-50">
          <!-- Columna 1 -->
          <div class="space-y-5 md:col-span-2">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Archivo</label>
              <div class="flex items-center">
                <label for="file-upload" class="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 px-5 py-3 rounded-lg border border-blue-200 transition-all hover:shadow-md transform hover:scale-[1.02] flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                  Seleccionar archivo
                </label>
                <input 
                  type="file" 
                  id="file-upload"
                  @change="seleccionarArchivo" 
                  class="hidden" 
                  required 
                />
                <div class="ml-4 py-2 px-3 bg-gray-50 text-sm text-gray-600 rounded-lg border border-gray-200 max-w-xs truncate">
                  {{ archivoNombre || 'Ningún archivo seleccionado' }}
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-2 italic">
                Se aceptan documentos (.doc, .docx, .xls, .xlsx, .ppt, .pptx), imágenes (.jpg, .png, .gif), PDFs y otros formatos de archivo. Tamaño máximo: 50MB.
              </p>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
              <textarea 
                v-model="descripcion" 
                rows="2" 
                class="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                placeholder="Descripción del archivo">
              </textarea>
            </div>
          </div>
          
          <!-- Columna izquierda -->
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Etiquetas</label>
              <div class="flex flex-wrap gap-2 p-2 rounded-lg border border-gray-300 bg-white min-h-[58px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <!-- Mostrar etiquetas como chips -->
                <div 
                  v-for="(tag, index) in etiquetasArray" 
                  :key="index"
                  class="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 animate-pop-in"
                >
                  {{ tag }}
                  <button 
                    @click="eliminarEtiqueta(index)" 
                    class="text-orange-500 hover:text-orange-700 focus:outline-none transition-colors rounded-full hover:bg-orange-200 p-0.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <!-- Input para añadir nuevas etiquetas -->
                <input 
                  v-model="etiquetaInput" 
                  @keydown="gestionarEtiquetas"
                  @blur="agregarEtiquetaEnBlur"
                  type="text" 
                  class="flex-grow min-w-[120px] py-1 px-2 focus:outline-none text-gray-700" 
                  placeholder="Escribe para agregar etiquetas..."
                />
              </div>
              <p class="text-xs text-gray-500 mt-1">Escribe y presiona espacio, coma o haz clic fuera del campo para crear una etiqueta</p>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Responsable</label>
              <input 
                v-model="responsable" 
                type="text" 
                class="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                placeholder="Responsable" 
              />
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Alcance geográfico</label>
              <div class="relative alcance-geografico-container">
                <!-- Contenedor de chips y input -->
                <div class="flex flex-wrap gap-2 p-2 rounded-lg border border-gray-300 bg-white min-h-[58px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                  <!-- Mostrar ubicaciones seleccionadas como chips -->
                  <div 
                    v-for="(lugar, index) in alcanceArray" 
                    :key="index"
                    class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 animate-pop-in"
                  >
                    {{ lugar.name }}
                    <button 
                      @click="eliminarLugar(index)" 
                      class="text-blue-500 hover:text-blue-700 focus:outline-none transition-colors rounded-full hover:bg-blue-200 p-0.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Input para buscar ubicaciones -->
                  <input 
                    v-model="alcanceInput" 
                    @input="buscarUbicaciones"
                    @keydown="gestionarTeclasAlcance"
                    @focus="activarBusquedaUbicaciones"
                    @blur="setTimeout(() => mostrarSugerencias = false, 200)"
                    type="text" 
                    class="flex-grow min-w-[120px] py-1 px-2 focus:outline-none text-gray-700" 
                    placeholder="Escribe para buscar lugares en México..." 
                  />
                </div>
                
                <!-- Lista de sugerencias -->
                <div 
                  v-if="mostrarSugerencias && !cargandoUbicaciones" 
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  <!-- Mostrar sugerencias si hay resultados -->
                  <div 
                    v-if="sugerenciasUbicacion.length > 0"
                    v-for="(sugerencia, index) in sugerenciasUbicacion" 
                    :key="index"
                    @click="seleccionarUbicacion(sugerencia)"
                    class="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-b-0 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{{ sugerencia.display_name }}</span>
                  </div>
                  
                  <!-- Mensaje cuando no hay resultados -->
                  <div 
                    v-if="sugerenciasUbicacion.length === 0 && alcanceInput.length >= 2"
                    class="px-4 py-3 text-sm text-gray-600 text-center"
                  >
                    No se encontraron ubicaciones para "{{ alcanceInput }}". Intenta con otro término.
                  </div>
                </div>
                
                <!-- Mensaje de cargando -->
                <div 
                  v-if="cargandoUbicaciones && mostrarSugerencias" 
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-center text-sm text-gray-600"
                >
                  <div class="animate-spin inline-block mr-2 h-4 w-4 border-t-2 border-blue-500 rounded-full"></div>
                  Buscando ubicaciones...
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-1">Comienza a escribir para buscar ubicaciones en México (ciudades, municipios, estados)</p>
            </div>
          </div>
          
          <!-- Columna derecha -->
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Fuente</label>
              <input 
                v-model="fuente" 
                type="text" 
                class="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                placeholder="Fuente" 
              />
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Validación</label>
              <select 
                v-model="validacion" 
                class="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
              >
                <option value="">Selecciona</option>
                <option value="Borrador">Borrador</option>
                <option value="Verificado">Verificado</option>
                <option value="Preliminar">Preliminar</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Observaciones</label>
              <input 
                v-model="observaciones" 
                type="text" 
                class="w-full rounded-lg border border-gray-300 shadow-sm px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                placeholder="Observaciones" 
              />
            </div>
          </div>
          
          <!-- Botones de acción -->
          <div class="mt-6 flex justify-end space-x-4 md:col-span-2 border-t pt-6">
            <button 
              type="button" 
              @click="modalVisible = false" 
              class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transform hover:scale-[1.02]"
            >
              Subir archivo
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Panel de estadísticas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Total archivos</p>
            <p class="text-2xl font-bold text-gray-800">
              {{ hayFiltrosActivos ? `${archivosFiltrados.length} / ${archivos.length}` : archivos.length || 0 }}
            </p>
          </div>
          <div class="rounded-full p-3 bg-blue-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Espacio utilizado</p>
            <p class="text-2xl font-bold text-gray-800">{{ formatSize(totalSize) }}</p>
          </div>
          <div class="rounded-full p-3 bg-green-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Último archivo</p>
            <p class="text-lg font-semibold text-gray-800 truncate">{{ lastFileName || 'Ninguno' }}</p>
          </div>
          <div class="rounded-full p-3 bg-purple-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Formatos distintos</p>
            <p class="text-2xl font-bold text-gray-800">{{ uniqueTypes.length || 0 }}</p>
          </div>
          <div class="rounded-full p-3 bg-orange-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de búsqueda y filtros -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md mb-8 border border-blue-100 transition-all hover:shadow-lg">
      <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
        </svg>
        Filtros de búsqueda
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        <div class="relative">
          <label class="block text-sm font-medium text-gray-600 mb-1.5">Buscar por nombre</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              v-model="busqueda" 
              type="text" 
              class="w-full pl-10 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
              placeholder="Buscar archivo..." 
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1.5">Tipo</label>
          <select 
            v-model="filtroTipo" 
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-all"
            style="background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23666%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M6 9l6 6 6-6%22/></svg>'); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px;"
          >
            <option value="">Todos los tipos</option>
            <option v-for="tipo in uniqueTypes" :key="tipo" :value="tipo">{{ tipo }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1.5">Año</label>
          <select 
            v-model="filtroAnio" 
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-all"
            style="background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23666%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M6 9l6 6 6-6%22/></svg>'); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px;"
          >
            <option value="">Todos los años</option>
            <option v-for="anio in aniosDisponibles" :key="anio" :value="anio">{{ anio }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1.5">Responsable</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input 
              v-model="filtroResponsable" 
              type="text" 
              class="w-full pl-10 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
              placeholder="Nombre responsable" 
            />
          </div>
        </div>
        <div class="self-end">
          <button 
            @click="limpiarFiltros"
            class="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm transition-all hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla de archivos con paginación -->
    <div class="relative overflow-x-auto bg-white rounded-lg shadow">
      <!-- Indicador de carga -->
      <div 
        v-if="cargandoPagina" 
        class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10"
      >
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-blue-600 font-medium">Cargando datos...</p>
        </div>
      </div>
      
      <table class="w-full divide-y divide-gray-200 table-fixed">
        <colgroup>
          <col style="width: 15%"> <!-- Nombre -->
          <col style="width: 15%"> <!-- Etiquetas -->
          <col style="width: 10%"> <!-- Validación -->
          <col style="width: 15%"> <!-- Alcance geográfico -->
          <col style="width: 12%"> <!-- Fecha -->
          <col style="width: 8%"> <!-- Tipo -->
          <col style="width: 10%"> <!-- Tamaño -->
          <col style="width: 15%"> <!-- Acciones -->
        </colgroup>
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etiquetas</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validación</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alcance geográfico</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamaño</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200" style="max-height: calc(100vh - 350px); overflow-y: auto;">
          <tr v-for="archivo in archivosFiltrados" :key="archivo.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">
              <div class="flex items-center">
                <div class="flex-shrink-0 mr-2">
                  <span v-if="archivo.tipo === 'PDF'" class="bg-red-100 text-red-600 p-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span v-else-if="archivo.tipo === 'XLSX' || archivo.tipo === 'XLS'" class="bg-green-100 text-green-600 p-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm3 1h10v10H6V5zm1 2a1 1 0 100 2h3a1 1 0 100-2H7z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span v-else-if="archivo.tipo === 'CSV'" class="bg-yellow-100 text-yellow-600 p-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm3 1h10v10H6V5zm1 2a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span v-else class="bg-blue-100 text-blue-600 p-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
                <div class="truncate max-w-xs">{{ archivo.nombre }}</div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="(tag, index) in (archivo.etiquetas || '').split(',')" 
                  :key="index" 
                  v-show="tag.trim()"
                  class="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ tag.trim() }}
                </span>
                <span v-if="!archivo.etiquetas" class="text-gray-400 text-xs italic">Sin etiquetas</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-blue-100 text-blue-800': archivo.validacion === 'Verificado',
                  'bg-yellow-100 text-yellow-800': archivo.validacion === 'Preliminar',
                  'bg-gray-100 text-gray-800': archivo.validacion === 'Borrador' || !archivo.validacion
                }"
              >
                {{ archivo.validacion || 'No definido' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="(lugar, index) in (archivo.alcance || '').split(',')" 
                  :key="index" 
                  v-show="lugar.trim()"
                  class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ lugar.trim() }}
                </span>
                <span v-if="!archivo.alcance" class="text-gray-400 text-xs italic">No especificado</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(archivo.fecha_actualizacion) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="{
                      'bg-red-100 text-red-800': archivo.tipo === 'PDF',
                      'bg-green-100 text-green-800': archivo.tipo === 'XLSX' || archivo.tipo === 'XLS',
                      'bg-yellow-100 text-yellow-800': archivo.tipo === 'CSV',
                      'bg-blue-100 text-blue-800': !['PDF', 'XLSX', 'XLS', 'CSV'].includes(archivo.tipo)
                    }">
                {{ archivo.tipo }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatSize(archivo.tamano) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center space-x-2">
                <a :href="`${BACKEND_URL}/archivos/descargar/${archivo.id}`" 
                   target="_blank" 
                   class="text-blue-600 hover:text-blue-900 p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
                <button @click="$emit('ver', archivo.id)" 
                        class="text-blue-600 hover:text-blue-900 p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="archivosFiltrados.length === 0">
            <td colspan="8" class="px-6 py-10 text-center text-gray-500">
              <div class="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <p>No hay archivos disponibles</p>
                <p class="text-sm mt-1" v-if="hayFiltrosActivos">No se encontraron resultados con los filtros actuales</p>
                <p class="text-sm mt-1" v-else>Sube un archivo para comenzar</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Controles de paginación -->
      <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-white rounded-b-lg">
        <div class="flex-1 flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-700">
              Mostrando <span class="font-medium">{{ archivos.length }}</span> de <span class="font-medium">{{ totalItems }}</span> resultados
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <!-- Botón anterior -->
            <button 
              @click="cambiarPagina(paginaActual - 1)" 
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              :disabled="paginaActual <= 1"
              :class="{ 'opacity-50 cursor-not-allowed': paginaActual <= 1 }"
            >
              Anterior
            </button>
            
            <!-- Indicador de página actual -->
            <span class="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-md">
              {{ paginaActual }} de {{ totalPaginas }}
            </span>
            
            <!-- Botón siguiente -->
            <button 
              @click="cambiarPagina(paginaActual + 1)" 
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              :disabled="paginaActual >= totalPaginas"
              :class="{ 'opacity-50 cursor-not-allowed': paginaActual >= totalPaginas }"
            >
              Siguiente
            </button>
          </div>
        </div>
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
            <div class="relative bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-5 shadow-lg mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h3 class="text-2xl font-bold text-gray-800 mb-2">¡Archivo subido exitosamente!</h3>
          
          <p class="text-gray-600 mb-6">
            {{ archivoSubido?.nombre }} se ha añadido correctamente a la biblioteca.
          </p>
          
          <div class="flex justify-center">
            <button 
              @click="cerrarConfirmacion" 
              class="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium transform hover:scale-[1.02]"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'

// Estilos de animación personalizados
const style = document.createElement('style')
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes bounceShort {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes popIn {
  0% { transform: scale(0.8); opacity: 0; }
  70% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-slide-in {
  animation: slideIn 0.4s ease-out;
}

.animate-bounce-short {
  animation: bounceShort 1s ease infinite;
}

.animate-pop-in {
  animation: popIn 0.3s ease-out forwards;
}
`
document.head.appendChild(style)

const BACKEND_URL = 'http://localhost:4000'
const archivos = ref([])
const archivoSubir = ref(null)
const archivoNombre = ref('')
const descripcion = ref("")
const etiquetasArray = ref([])
const etiquetaInput = ref("")
const responsable = ref("")

// Función para gestionar las etiquetas
function gestionarEtiquetas(event) {
  const valor = etiquetaInput.value.trim()
  
  // Si se presiona Espacio, Enter o Coma
  if ((event.key === ' ' || event.key === 'Enter' || event.key === ',') && valor !== '') {
    event.preventDefault()
    agregarEtiqueta(valor)
  }
  
  // Tab también agrega la etiqueta y mueve al siguiente campo
  if (event.key === 'Tab' && valor !== '') {
    agregarEtiqueta(valor)
    // No prevenimos el evento por defecto para que el foco pase al siguiente campo
  }
  
  // Si se presiona Backspace con el input vacío, elimina la última etiqueta
  if (event.key === 'Backspace' && etiquetaInput.value === '' && etiquetasArray.value.length > 0) {
    etiquetasArray.value.pop()
  }
}

// Función auxiliar para agregar una etiqueta
function agregarEtiqueta(valor) {
  // Si la etiqueta no está ya en el array, la añadimos
  if (valor && !etiquetasArray.value.includes(valor)) {
    etiquetasArray.value.push(valor)
  }
  etiquetaInput.value = ''
}

// Función para eliminar una etiqueta específica
function eliminarEtiqueta(index) {
  etiquetasArray.value.splice(index, 1)
}

// Computed property para convertir las etiquetas a formato de string cuando sea necesario
const etiquetas = computed({
  get: () => etiquetasArray.value.join(','),
  set: (val) => {
    if (val) {
      etiquetasArray.value = val.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    } else {
      etiquetasArray.value = []
    }
  }
})
const fuente = ref("")
const confirmacionVisible = ref(false)
const archivoSubido = ref(null)
const cargando = ref(false)
// Gestión del alcance geográfico con chips
const alcanceArray = ref([]) // Array para almacenar los lugares seleccionados como objetos {name, display_name, lat, lon}
const alcanceInput = ref("") // Input para buscar ubicaciones
const sugerenciasUbicacion = ref([]) // Sugerencias de ubicaciones de la API
const mostrarSugerencias = ref(false) // Controla la visibilidad del dropdown de sugerencias
const cargandoUbicaciones = ref(false) // Indicador de carga
const timerBusqueda = ref(null) // Para debounce de la búsqueda

// Computed para mantener compatibilidad con el código existente
const alcance = computed({
  get: () => {
    // Devuelve una cadena con los nombres de lugares separados por comas
    return alcanceArray.value.map(lugar => lugar.name).join(", ")
  },
  set: (val) => {
    if (!val) {
      alcanceArray.value = []
    } else if (typeof val === 'string') {
      // Si recibimos una cadena del backend (por ejemplo al editar), 
      // la convertimos en objetos simples de ubicación
      alcanceArray.value = val.split(',').map(nombre => ({
        name: nombre.trim(),
        display_name: nombre.trim(), // Usamos el mismo nombre como display_name
        lat: "", // No tenemos coordenadas en este caso
        lon: ""
      })).filter(item => item.name !== "")
    }
  }
})
const validacion = ref("")
const observaciones = ref("")
const modalVisible = ref(false)

// Variables para paginación
const paginaActual = ref(1)
const totalPaginas = ref(1)
const itemsPorPagina = ref(50)
const totalItems = ref(0)
const cargandoPagina = ref(false)

// Variables para búsqueda y filtros
const busqueda = ref("")
const filtroTipo = ref("")
const filtroAnio = ref("")
const filtroResponsable = ref("")

// Función para limpiar todos los filtros
function limpiarFiltros() {
  busqueda.value = ""
  filtroTipo.value = ""
  filtroAnio.value = ""
  filtroResponsable.value = ""
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
  return busqueda.value !== "" || filtroTipo.value !== "" || filtroAnio.value !== "" || filtroResponsable.value !== ""
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
    
    return coincideNombre && coincideTipo && coincideAnio && coincideResp
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

onMounted(async () => {
  await cargarArchivos()
})

async function cargarArchivos() {
  try {
    cargandoPagina.value = true
    
    const res = await axios.get(`${BACKEND_URL}/archivos`, {
      params: {
        page: paginaActual.value,
        limit: itemsPorPagina.value
      }
    })
    
    // Actualizar datos y metadatos de paginación
    archivos.value = res.data.items || []
    totalItems.value = res.data.metadata?.totalItems || 0
    totalPaginas.value = res.data.metadata?.totalPages || 1
    paginaActual.value = res.data.metadata?.page || 1
  } catch (err) {
    console.error('Error al cargar archivos:', err)
  } finally {
    cargandoPagina.value = false
  }
}

function seleccionarArchivo(e) {
  const file = e.target.files[0]
  
  // Validar tamaño de archivo (50MB máximo)
  if (file && file.size > 50 * 1024 * 1024) {
    alert("El archivo es demasiado grande. El tamaño máximo permitido es 50MB.")
    e.target.value = null
    archivoSubir.value = null
    archivoNombre.value = ''
    return
  }
  
  archivoSubir.value = file
  archivoNombre.value = file?.name || ''
}

async function subirArchivo() {
  if (!archivoSubir.value) {
    alert("Selecciona un archivo para subir")
    return
  }
  
  // Validar tamaño nuevamente antes de subir
  if (archivoSubir.value.size > 50 * 1024 * 1024) {
    alert("El archivo es demasiado grande. El tamaño máximo permitido es 50MB.")
    return
  }
  
  try {
    // Mostrar indicador de carga
    cargando.value = true
    
    const formData = new FormData()
    formData.append("file", archivoSubir.value)
    formData.append("descripcion", descripcion.value)
    // Las etiquetas se envían como string gracias a la computed property
    formData.append("etiquetas", etiquetas.value)
    formData.append("responsable", responsable.value)
    formData.append("fuente", fuente.value)
    // Enviamos solo los nombres de los lugares como una cadena separada por comas
    formData.append("alcance", alcanceArray.value.map(lugar => lugar.name).join(", "))
    formData.append("validacion", validacion.value)
    formData.append("observaciones", observaciones.value)
    
    const response = await axios.post(`${BACKEND_URL}/archivos/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    
    // Cerrar modal de subida
    modalVisible.value = false
    
    // Guardar información del archivo subido
    archivoSubido.value = {
      nombre: archivoNombre.value,
      tipo: archivoNombre.value.split('.').pop().toUpperCase()
    }
    
    // Mostrar modal de confirmación
    confirmacionVisible.value = true
    
    // Limpiar los campos del formulario
    archivoSubir.value = null
    archivoNombre.value = ''
    descripcion.value = ""
    etiquetas.value = ""
    responsable.value = ""
    fuente.value = ""
    alcanceArray.value = [] // Limpiar el array de ubicaciones
    alcanceInput.value = "" // Limpiar el input
    validacion.value = ""
    observaciones.value = ""
    
    // Actualizar la lista de archivos
    await cargarArchivos()
  } catch (err) {
    console.error('Error al subir el archivo:', err)
    alert("Error al subir el archivo: " + (err.response?.data?.error || err.message))
  } finally {
    // Desactivar indicador de carga
    cargando.value = false
  }
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

// Función para cerrar el modal de confirmación
function cerrarConfirmacion() {
  confirmacionVisible.value = false
  setTimeout(() => {
    archivoSubido.value = null
  }, 300) // Espera a que termine la animación de salida
}

// Función para cambiar de página
async function cambiarPagina(nuevaPagina) {
  if (nuevaPagina < 1 || nuevaPagina > totalPaginas.value || cargandoPagina.value) {
    return;
  }
  
  paginaActual.value = nuevaPagina;
  await cargarArchivos();
  
  // Hacer scroll hacia arriba de la tabla
  const tableEl = document.querySelector('.overflow-x-auto');
  if (tableEl) {
    tableEl.scrollTop = 0;
  }
}

function formatSize(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes'
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
}

// Función para buscar ubicaciones mediante la API Nominatim
function buscarUbicaciones() {
  // Limpiar el timer existente
  clearTimeout(timerBusqueda.value)
  
  // No buscar si está vacío
  if (alcanceInput.value.trim() === '') {
    sugerenciasUbicacion.value = []
    cargandoUbicaciones.value = false
    mostrarSugerencias.value = false
    return
  }
  
  // Configurar debounce (esperar 250ms después de que el usuario deja de escribir)
  // Reducido de 300ms a 250ms para una respuesta más rápida
  cargandoUbicaciones.value = true
  mostrarSugerencias.value = true // Mostrar indicador de carga mientras se busca
  
  timerBusqueda.value = setTimeout(async () => {
    try {
      // Normalizar el término de búsqueda (eliminar acentos, convertir a minúscula)
      const terminoBusqueda = alcanceInput.value.trim();
      
      console.log("Buscando:", terminoBusqueda)
      
      // Parámetros mejorados para la búsqueda:
      // - countrycodes=MX: Limitar a México
      // - q: Término de búsqueda
      // - format=json: Formato de respuesta
      // - addressdetails=1: Incluir detalles de dirección
      // - limit=8: Aumentado de 5 a 8 resultados
      // - namedetails=1: Obtener detalles adicionales de nombres
      // - accept-language=es: Preferir resultados en español
      // - dedupe=1: Eliminar duplicados
      const url = `https://nominatim.openstreetmap.org/search?` + 
                 `countrycodes=MX&` +
                 `q=${encodeURIComponent(terminoBusqueda)}&` +
                 `format=json&` + 
                 `addressdetails=1&` +
                 `namedetails=1&` +
                 `dedupe=1&` +
                 `limit=8`
      
      console.log("URL de búsqueda:", url)
      
      // Usar Axios con configuración mejorada
      const response = await axios.get(url, {
        headers: {
          // Headers requeridos por Nominatim
          'User-Agent': 'BibliotecaSV_App/1.0',
          'Accept-Language': 'es',
          'Referer': window.location.origin // Añadir Referer para mejor comportamiento con CORS
        },
        // Aumentar el tiempo máximo de espera para mayor confiabilidad
        timeout: 5000
      })
      
      console.log("Respuesta obtenida:", response.data)
      
      if (response.data && Array.isArray(response.data)) {
        // Filtrar y priorizar resultados para mejorar relevancia
        const resultados = response.data
          // Ordenar por importancia del tipo de lugar
          .sort((a, b) => {
            // Prioridad: ciudad/pueblo > municipio > estado > otros
            const getPrioridad = (tipo) => {
              if (!tipo) return 5;
              tipo = tipo.toLowerCase();
              if (tipo.includes('city') || tipo.includes('town')) return 1;
              if (tipo.includes('municipality')) return 2;
              if (tipo.includes('administrative') && a.address?.state) return 3;
              if (tipo.includes('administrative')) return 4;
              return 5;
            };
            return getPrioridad(a.type) - getPrioridad(b.type);
          })
          // Eliminar lugares con nombres muy similares
          .filter((lugar, index, self) => {
            return index === self.findIndex(l => 
              l.display_name.toLowerCase().includes(lugar.display_name.toLowerCase()) ||
              lugar.display_name.toLowerCase().includes(l.display_name.toLowerCase())
            );
          });
        
        sugerenciasUbicacion.value = resultados;
        mostrarSugerencias.value = resultados.length > 0;
        
        console.log(`Se encontraron ${resultados.length} resultados para: "${alcanceInput.value}"`);
      } else {
        console.error('Formato de respuesta inesperado:', response.data);
        sugerenciasUbicacion.value = [];
        mostrarSugerencias.value = false;
      }
    } catch (error) {
      console.error('Error al buscar ubicaciones:', error)
      alert("Error al buscar ubicaciones. Revisa la consola para más detalles.")
      sugerenciasUbicacion.value = []
      mostrarSugerencias.value = false
    } finally {
      cargandoUbicaciones.value = false
    }
  }, 250) // Reducido de 300ms a 250ms para una respuesta más rápida
}

// Función para activar la búsqueda cuando el input recibe foco
function activarBusquedaUbicaciones() {
  mostrarSugerencias.value = true;
  
  // Buscar inmediatamente si hay algún texto
  if (alcanceInput.value.trim() !== '') {
    buscarUbicaciones();
  }
}

// Seleccionar una ubicación de las sugerencias
function seleccionarUbicacion(lugar) {
  console.log("Seleccionando ubicación:", lugar)
  
  // Extraer el nombre más significativo con lógica mejorada
  let nombrePrincipal;
  
  // Si tiene namedetails con nombre en español, usar ese prioritariamente
  if (lugar.namedetails && lugar.namedetails.name) {
    nombrePrincipal = lugar.namedetails.name;
  } else if (lugar.namedetails && lugar.namedetails['name:es']) {
    nombrePrincipal = lugar.namedetails['name:es'];
  } else if (lugar.name) {
    nombrePrincipal = lugar.name;
  } else if (lugar.address) {
    // Lógica mejorada para obtener el nombre más relevante de la dirección
    nombrePrincipal = lugar.address.city || 
                     lugar.address.town || 
                     lugar.address.village || 
                     lugar.address.municipality ||
                     lugar.address.county ||
                     lugar.address.state ||
                     extraerNombrePrincipal(lugar.display_name);
                     
    // Si es un estado y ya incluye "México" o "Estado de", dejarlo así
    if (lugar.address.state && !lugar.address.city && !lugar.address.town) {
      nombrePrincipal = lugar.address.state;
    }
  } else {
    nombrePrincipal = extraerNombrePrincipal(lugar.display_name);
  }
  
  // Limpieza adicional (quitar "México" redundante al final si ya está en otro lado)
  nombrePrincipal = nombrePrincipal.replace(/, México$/, '');
  
  // Crear un objeto con la información relevante
  const nuevaUbicacion = {
    name: nombrePrincipal,
    display_name: lugar.display_name,
    lat: lugar.lat,
    lon: lugar.lon,
    type: lugar.type // Tipo de ubicación (ciudad, pueblo, etc.)
  }
  
  console.log("Nueva ubicación a agregar:", nuevaUbicacion);
  
  // Verificar que no esté duplicado (por nombre)
  if (!alcanceArray.value.some(item => item.name === nuevaUbicacion.name)) {
    alcanceArray.value.push(nuevaUbicacion)
    console.log("Ubicación agregada. Ahora hay", alcanceArray.value.length, "ubicaciones");
  } else {
    console.log("La ubicación ya existe en la lista");
  }
  
  // Limpiar input y sugerencias
  alcanceInput.value = ""
  sugerenciasUbicacion.value = []
  mostrarSugerencias.value = false
}

// Función para extraer un nombre utilizable de display_name si name no está disponible
function extraerNombrePrincipal(displayName) {
  if (!displayName) {
    console.warn("displayName es undefined o null");
    return "Ubicación desconocida";
  }
  
  // Dividir la cadena por comas y tomar las partes más relevantes
  const partes = displayName.split(',').map(p => p.trim());
  
  if (partes.length === 0) {
    return "Ubicación desconocida";
  }
  
  // Si hay más de 3 partes, intentar extraer un formato "Ciudad, Estado"
  if (partes.length >= 3) {
    // Intentar detectar si es una ciudad, pueblo o entidad similar
    const primeraParte = partes[0];
    
    // Buscar el estado de México que suele estar en las últimas posiciones
    let estadoIdx = partes.findIndex(p => 
      p.toLowerCase() === 'méxico' || 
      p.toLowerCase() === 'mexico' ||
      p.toLowerCase().includes('estado de')
    );
    
    if (estadoIdx !== -1 && estadoIdx > 0) {
      // Devolver "Ciudad, Estado"
      return `${primeraParte}, ${partes[estadoIdx]}`;
    }
    
    // Si no encontramos el estado, devolver las dos primeras partes
    return `${primeraParte}, ${partes[1]}`;
  }
  
  // Si solo hay 1 o 2 partes, devolver la primera
  return partes[0];
}

// Eliminar una ubicación seleccionada
function eliminarLugar(index) {
  alcanceArray.value.splice(index, 1)
}

// Gestionar teclas especiales para el input de alcance
function gestionarTeclasAlcance(event) {
  // Si presiona Escape, ocultar sugerencias
  if (event.key === 'Escape') {
    mostrarSugerencias.value = false
  }
  
  // Si presiona Enter con sugerencias mostradas
  if (event.key === 'Enter' && sugerenciasUbicacion.value.length > 0) {
    event.preventDefault()
    seleccionarUbicacion(sugerenciasUbicacion.value[0]) // Seleccionar la primera sugerencia
  }
  
  // Si presiona Backspace con el input vacío, eliminar el último lugar
  if (event.key === 'Backspace' && alcanceInput.value === '' && alcanceArray.value.length > 0) {
    alcanceArray.value.pop()
  }
}

// Método para cerrar la lista de sugerencias al hacer clic fuera
function cerrarSugerencias() {
  // Usar setTimeout para permitir que el clic en una sugerencia se procese primero
  setTimeout(() => {
    mostrarSugerencias.value = false
  }, 150)
}

// Añadir el event listener para cerrar sugerencias al hacer clic fuera
// Función para cerrar sugerencias al hacer clic fuera
const cerrarSugerenciasAlClickear = (e) => {
  // Verificar si el clic fue fuera del componente de alcance geográfico
  const alcanceElement = document.querySelector('.alcance-geografico-container')
  if (alcanceElement && !alcanceElement.contains(e.target)) {
    mostrarSugerencias.value = false
  }
}

onMounted(() => {
  // Añadir event listener para cerrar sugerencias al hacer clic fuera
  document.addEventListener('click', cerrarSugerenciasAlClickear)
  
  // Datos iniciales de prueba para demostración
  if (import.meta.env.DEV) {
    // En modo desarrollo, podemos añadir datos de ejemplo
    console.log("Modo desarrollo: Puedes agregar ubicaciones de ejemplo aquí si es necesario")
  }
})

onUnmounted(() => {
  // Limpiar event listeners al desmontar el componente
  document.removeEventListener('click', cerrarSugerenciasAlClickear)
  
  // Limpiar el timer de búsqueda si existe
  if (timerBusqueda.value) {
    clearTimeout(timerBusqueda.value)
  }
})

// Función para agregar etiqueta cuando se hace clic fuera del input
function agregarEtiquetaEnBlur() {
  const valor = etiquetaInput.value.trim();
  
  // Si hay texto en el input, añadirlo como etiqueta
  if (valor !== '') {
    agregarEtiqueta(valor);
  }
}
</script>

<style scoped>
/* Animaciones personalizadas para los modales */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

/* Efecto de hover para inputs y selectores */
input:hover, select:hover, textarea:hover {
  border-color: #93c5fd;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
}

/* Animaciones para los botones */
button {
  transition: all 0.2s ease;
}

/* Efecto de rebote para los modales */
@keyframes modalBounce {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  70% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Animación para inputs en focus */
input:focus, select:focus, textarea:focus {
  animation: focusGlow 0.3s ease forwards;
}

@keyframes focusGlow {
  0% {
    box-shadow: 0 0 0 rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
}

/* Efecto de entrada para modales */
.modal-enter-active {
  animation: modalBounce 0.4s ease-out;
}

/* Efecto de salida para modales */
.modal-leave-active {
  animation: modalBounce 0.3s ease-in reverse;
}

/* Transición suave para todos los elementos */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Estilos para los chips de etiquetas */
.animate-pop-in {
  animation: popIn 0.3s ease-out forwards;
}

/* Evita que el contenedor de etiquetas sea demasiado pequeño */
.min-h-\[58px\] {
  min-height: 58px;
}

/* Asegura que el input dentro del contenedor de etiquetas se comporte correctamente */
.flex-grow {
  flex-grow: 1;
}
</style>
