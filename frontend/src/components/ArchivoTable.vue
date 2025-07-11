<template>
  <!-- Dashboard rediseñado - Home visual profesional -->
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
    <!-- Header del Dashboard -->
    <div class="max-w-6xl mx-auto">
      <!-- Título y descripción del Dashboard -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">
          <span class="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Panel de Control
          </span>
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Gestiona tus archivos y datos de manera eficiente. Sube nuevos documentos o accede a las herramientas de análisis.
        </p>
      </div>

      <!-- Botón principal de "Subir archivo" - Call to Action destacado -->
      <div class="flex justify-center mb-12">
        <button 
          @click="modalVisible = true" 
          class="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
        >
          <!-- Efecto de brillo en hover -->
          <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          
          <div class="relative flex items-center gap-4">
            <!-- Ícono de subir archivo -->
            <div class="bg-white/20 p-3 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div class="text-left">
              <div class="text-xl font-bold">Subir Archivo</div>
              <div class="text-blue-100 text-sm">Añadir nuevo documento al repositorio</div>
            </div>
          </div>
        </button>
      </div>

      <!-- Cards principales de acceso rápido -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        
        <!-- Card 1: Vista previa de Archivos -->
        <div class="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 cursor-pointer border border-gray-100"
             @click="$emit('navigate', 'archivos')">
          
          <!-- Header de la card con gradiente -->
          <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-t-3xl p-6 text-white relative overflow-hidden">
            <!-- Efecto decorativo de fondo -->
            <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div class="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
            
            <div class="relative z-10">
              <!-- Ícono principal -->
              <div class="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
                </svg>
              </div>
              
              <h3 class="text-xl font-bold mb-2">Gestión de Archivos</h3>
              <p class="text-green-100 text-sm">Explora y administra documentos</p>
            </div>
          </div>
          
          <!-- Contenido de la card -->
          <div class="p-6">
            <!-- Estadísticas rápidas -->
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="text-center">
                <div class="text-xl font-bold text-gray-800">{{ totalArchivos }}</div>
                <div class="text-xs text-gray-500">Total archivos</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-bold text-gray-800">{{ formatFileSize(totalSize) }}</div>
                <div class="text-xs text-gray-500">Espacio usado</div>
              </div>
            </div>
            
            <!-- Botón de acción -->
            <div class="flex items-center justify-between">
              <span class="text-gray-600 text-sm">Ver todos los archivos</span>
              <div class="bg-green-100 text-green-600 p-2 rounded-full group-hover:bg-green-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Vista previa de Estadísticas -->
        <div class="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 cursor-pointer border border-gray-100"
             @click="$emit('navigate', 'estadisticas')">
          
          <!-- Header de la card con gradiente -->
          <div class="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-t-3xl p-6 text-white relative overflow-hidden">
            <!-- Efecto decorativo de fondo -->
            <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div class="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
            
            <div class="relative z-10">
              <!-- Ícono principal -->
              <div class="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              
              <h3 class="text-xl font-bold mb-2">Análisis y Reportes</h3>
              <p class="text-purple-100 text-sm">Visualiza estadísticas detalladas</p>
            </div>
          </div>
          
          <!-- Contenido de la card -->
          <div class="p-6">
            <!-- Gráfico miniatura/preview -->
            <div class="mb-4">
              <div class="flex items-end justify-between h-16 gap-1">
                <!-- Barras miniatura representando estadísticas -->
                <div class="bg-gradient-to-t from-purple-200 to-purple-400 rounded-t w-3 h-8"></div>
                <div class="bg-gradient-to-t from-purple-200 to-purple-400 rounded-t w-3 h-12"></div>
                <div class="bg-gradient-to-t from-purple-200 to-purple-400 rounded-t w-3 h-16"></div>
                <div class="bg-gradient-to-t from-purple-200 to-purple-400 rounded-t w-3 h-10"></div>
                <div class="bg-gradient-to-t from-purple-200 to-purple-400 rounded-t w-3 h-14"></div>
                <div class="bg-gradient-to-t from-purple-200 to-purple-400 rounded-t w-3 h-6"></div>
              </div>
              <div class="text-xs text-gray-400 text-center mt-2">Vista previa de análisis</div>
            </div>
            
            <!-- Botón de acción -->
            <div class="flex items-center justify-between">
              <span class="text-gray-600 text-sm">Ver estadísticas completas</span>
              <div class="bg-purple-100 text-purple-600 p-2 rounded-full group-hover:bg-purple-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 3: Vista previa del Mapa Interactivo -->
        <div class="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 cursor-pointer border border-gray-100"
             @click="$emit('navigate', 'mapa')">
          
          <!-- Header de la card con gradiente -->
          <div class="bg-gradient-to-br from-orange-500 to-red-600 rounded-t-3xl p-6 text-white relative overflow-hidden">
            <!-- Efecto decorativo de fondo -->
            <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div class="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
            
            <div class="relative z-10">
              <!-- Ícono principal -->
              <div class="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              
              <h3 class="text-xl font-bold mb-2">Mapa Interactivo</h3>
              <p class="text-orange-100 text-sm">Visualización geográfica</p>
            </div>
          </div>
          
          <!-- Contenido de la card -->
          <div class="p-6">
            <!-- Mapa miniatura/preview -->
            <div class="mb-4">
              <div class="bg-gradient-to-br from-blue-100 to-green-100 rounded-lg h-16 relative overflow-hidden">
                <!-- Simulación de un mapa con puntos -->
                <div class="absolute inset-0 bg-blue-200/30"></div>
                <!-- Puntos simulando ubicaciones -->
                <div class="absolute top-2 left-3 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div class="absolute top-4 right-4 w-2 h-2 bg-green-500 rounded-full animate-pulse" style="animation-delay: 0.5s"></div>
                <div class="absolute bottom-3 left-1/2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" style="animation-delay: 1s"></div>
                <div class="absolute top-1/2 right-6 w-2 h-2 bg-purple-500 rounded-full animate-pulse" style="animation-delay: 1.5s"></div>
                <!-- Líneas simulando fronteras -->
                <svg class="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 60">
                  <path d="M10,20 Q30,10 50,15 T90,25" stroke="#4B5563" stroke-width="1" fill="none"/>
                  <path d="M5,35 Q25,30 45,40 T85,45" stroke="#4B5563" stroke-width="1" fill="none"/>
                </svg>
              </div>
              <div class="text-xs text-gray-400 text-center mt-2">{{ totalUbicaciones }} ubicaciones registradas</div>
            </div>
            
            <!-- Botón de acción -->
            <div class="flex items-center justify-between">
              <span class="text-gray-600 text-sm">Explorar mapa completo</span>
              <div class="bg-orange-100 text-orange-600 p-2 rounded-full group-hover:bg-orange-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Información adicional opcional -->
      <div class="text-center mt-12">
        <p class="text-gray-500 text-sm">
          Última actualización: {{ new Date().toLocaleDateString('es-ES') }}
        </p>
      </div>
    </div>
    
    <!-- Modal para subir archivos - VERSIÓN ULTRA COMPACTA SIN SCROLL -->
    <div v-if="modalVisible" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center p-3">
      <!-- Fondo oscuro con animación -->
      <div 
        class="fixed inset-0 bg-black transition-opacity duration-300"
        :class="{ 'bg-opacity-70': modalVisible, 'bg-opacity-0': !modalVisible }" 
        @click="modalVisible = false"
      ></div>
      
      <!-- Contenido del modal compacto pero más grande - Ancho optimizado 620px, máximo 80% altura -->
      <div 
        class="relative bg-white rounded-xl w-full max-w-[620px] max-h-[80vh] shadow-2xl transform transition-all duration-300 overflow-hidden"
        :class="{ 'scale-100 opacity-100': modalVisible, 'scale-95 opacity-0': !modalVisible }"
      >
        <!-- Cabecera del modal con tema morado desvanecido -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-t-xl px-4 py-2 flex items-center justify-between">
          <h3 class="text-base font-semibold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
            </svg>
            Subir nuevo archivo
          </h3>
          <button 
            @click="modalVisible = false" 
            class="text-white hover:text-purple-100 transition-colors p-1 rounded-full hover:bg-white/20"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Formulario compacto pero más grande sin scroll interno -->
        <form @submit.prevent="subirArchivo" class="p-4 space-y-3 bg-white">
          
          <!-- Campo de archivo compacto pero con mejor espaciado -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Archivo *</label>
            <div class="flex items-center gap-3">
              <label for="file-upload" class="cursor-pointer bg-purple-50 hover:bg-purple-100 text-purple-600 px-3 py-2 rounded-lg border border-purple-200 transition-all flex items-center gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
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
              <div class="flex-1 py-2 px-3 bg-gray-50 text-sm text-gray-600 rounded-lg border border-gray-200 truncate h-8">
                {{ archivoNombre || 'Ningún archivo seleccionado' }}
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-1">Tamaño máximo: 50MB</p>
          </div>
          
          <!-- Descripción con mejor espaciado -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea 
              v-model="descripcion" 
              rows="2" 
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all resize-none" 
              placeholder="Descripción del archivo">
            </textarea>
          </div>
          
          <!-- Grid de 2 columnas para campos básicos con mejor espaciado -->
          <div class="grid grid-cols-2 gap-3">
            <!-- Responsable -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
              <input 
                v_model="responsable" 
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
          
          <!-- Grid de 2 columnas para campos con chips con mejor espaciado -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            <!-- Etiquetas con mejor espaciado -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Etiquetas</label>
              <div class="flex flex-wrap gap-2 p-2 rounded-lg border border-gray-300 bg-white min-h-[32px] focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all">
                <!-- Chips de etiquetas con mejor tamaño -->
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
            
            <!-- Alcance geográfico con mejor espaciado -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Alcance geográfico</label>
              <div class="relative alcance-geografico-container">
                <div class="flex flex-wrap gap-2 p-2 rounded-lg border border-gray-300 bg-white min-h-[32px] focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all">
                  <!-- Chips de ubicaciones con mejor tamaño -->
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
                
                <!-- Lista de sugerencias ultra compacta -->
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
                    <span>{{ sugerencia.display_name }}</span>
                  </div>
                  
                  <div 
                    v-if="sugerenciasUbicacion.length === 0 && alcanceInput.length >= 2"
                    class="px-2 py-1 text-xs text-gray-600 text-center"
                  >
                    No encontrado
                  </div>
                </div>
                
                <!-- Cargando mini -->
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
          
          <!-- Campo de Validación COMPACTO - Radio buttons minimalistas y profesionales -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado de validación *</label>
            
            <!-- Radio buttons compactos horizontales -->
            <div class="flex gap-2">
              
              <!-- Opción 1: Verificado (Verde) -->
              <label class="cursor-pointer flex-1">
                <input 
                  type="radio" 
                  v-model="validacion" 
                  value="Verificado" 
                  class="sr-only"
                />
                <div class="p-3 rounded-lg border-2 text-center transition-all"
                     :class="validacion === 'Verificado' 
                       ? 'border-green-500 bg-green-50 shadow-md' 
                       : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'">
                  <div class="flex items-center justify-center mb-2">
                    <div class="w-4 h-4 rounded-full transition-all"
                         :class="validacion === 'Verificado' ? 'bg-green-500 ring-2 ring-green-200' : 'bg-green-200'"></div>
                  </div>
                  <div class="text-sm transition-all"
                       :class="validacion === 'Verificado' ? 'text-gray-800 font-bold' : 'text-gray-600 font-medium'">
                    Verificado
                  </div>
                </div>
              </label>
              
              <!-- Opción 2: Sin definir (Gris) -->
              <label class="cursor-pointer flex-1">
                <input 
                  type="radio" 
                  v-model="validacion" 
                  value="Sin definir" 
                  class="sr-only"
                />
                <div class="p-3 rounded-lg border-2 text-center transition-all"
                     :class="validacion === 'Sin definir' 
                       ? 'border-gray-500 bg-gray-50 shadow-md' 
                       : 'border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50'">
                  <div class="flex items-center justify-center mb-2">
                    <div class="w-4 h-4 rounded-full transition-all"
                         :class="validacion === 'Sin definir' ? 'bg-gray-500 ring-2 ring-gray-200' : 'bg-gray-300'"></div>
                  </div>
                  <div class="text-sm transition-all"
                       :class="validacion === 'Sin definir' ? 'text-gray-800 font-bold' : 'text-gray-600 font-medium'">
                    Sin definir
                  </div>
                </div>
              </label>
              
              <!-- Opción 3: Borrador (Naranja) -->
              <label class="cursor-pointer flex-1">
                <input 
                  type="radio" 
                  v-model="validacion" 
                  value="Borrador" 
                  class="sr-only"
                />
                <div class="p-3 rounded-lg border-2 text-center transition-all"
                     :class="validacion === 'Borrador' 
                       ? 'border-orange-500 bg-orange-50 shadow-md' 
                       : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50'">
                  <div class="flex items-center justify-center mb-2">
                    <div class="w-4 h-4 rounded-full transition-all"
                         :class="validacion === 'Borrador' ? 'bg-orange-500 ring-2 ring-orange-200' : 'bg-orange-200'"></div>
                  </div>
                  <div class="text-sm transition-all"
                       :class="validacion === 'Borrador' ? 'text-gray-800 font-bold' : 'text-gray-600 font-medium'">
                    Borrador
                  </div>
                </div>
              </label>
            </div>
          </div>
          
          <!-- Observaciones con mejor espaciado -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
            <input 
              v-model="observaciones" 
              type="text" 
              class="w-full rounded-lg border border-gray-300 px-3 py-2 h-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" 
              placeholder="Observaciones adicionales" 
            />
          </div>
          
          <!-- Botones de acción con mejor espaciado -->
          <div class="flex justify-end gap-3 pt-3 border-t border-gray-200">
            <button 
              type="button" 
              @click="modalVisible = false" 
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors min-w-[100px]"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors text-sm font-medium min-w-[120px]"
            >
              Subir archivo
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
// Importar funciones utilitarias centralizadas para manejo de archivos
import { formatFileSize, calculateTotalSize, validateFileSize } from '../utils/fileUtils.js'

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
const validacion = ref("Sin definir") // Valor por defecto: "Sin definir" para campo obligatorio
const observaciones = ref("")
const modalVisible = ref(false)

// Variables básicas para mostrar totales en las cards
const totalArchivos = computed(() => archivos.value.length || 0)

// Propiedades computadas para estadísticas usando funciones utilitarias centralizadas
const totalSize = computed(() => {
  return calculateTotalSize(archivos.value)
})

// Computed property para el total de ubicaciones únicas
const totalUbicaciones = computed(() => {
  const ubicaciones = archivos.value
    .filter(archivo => archivo.alcance_geografico)
    .map(archivo => archivo.alcance_geografico)
    .filter(ubicacion => ubicacion.trim() !== '')
  
  return new Set(ubicaciones).size
})

onMounted(async () => {
  await cargarArchivos()
})

async function cargarArchivos() {
  try {
    const res = await axios.get(`${BACKEND_URL}/archivos`)
    archivos.value = res.data.items || res.data || []
  } catch (err) {
    console.error('Error al cargar archivos:', err)
    archivos.value = []
  }
}

function seleccionarArchivo(e) {
  const file = e.target.files[0]
  
  // Validar tamaño de archivo usando función utilitaria centralizada (50MB máximo)
  if (file && !validateFileSize(file.size, 50)) {
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
  
  // Validación obligatoria del estado de validación - SOLO acepta los 3 valores específicos
  if (!validacion.value || !['Verificado', 'Sin definir', 'Borrador'].includes(validacion.value)) {
    alert("Debes seleccionar un estado de validación válido: Verificado, Sin definir o Borrador")
    return
  }
  
  // Validar tamaño nuevamente antes de subir usando función utilitaria centralizada
  if (!validateFileSize(archivoSubir.value.size, 50)) {
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
    validacion.value = "Sin definir" // Volver al valor por defecto para el campo obligatorio
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

// Función para cerrar el modal de confirmación
function cerrarConfirmacion() {
  confirmacionVisible.value = false
  setTimeout(() => {
    archivoSubido.value = null
  }, 300) // Espera a que termine la animación de salida
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
