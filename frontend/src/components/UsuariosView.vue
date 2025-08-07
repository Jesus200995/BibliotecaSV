<template>
  <!-- Verificación de permisos de administrador -->
  <div v-if="!esAdmin" class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
      <p class="text-gray-600 mb-6">No tienes permisos para acceder a la gestión de usuarios. Esta sección está disponible solo para administradores.</p>
      <button 
        @click="volverInicio"
        class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
      >
        Volver al Inicio
      </button>
    </div>
  </div>

  <!-- Contenido principal (solo se muestra si es admin) -->
  <div v-else>
    <!-- Título de la página -->
    <div class="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Usuarios</h2>
        <p class="mt-1 text-sm text-gray-500">Gestión de usuarios del sistema</p>
      </div>
      
      <!-- Botón para agregar nuevo usuario -->
      <div class="flex items-center gap-3">
        <!-- Botón de debug (solo en desarrollo) -->
        <button 
          v-if="esDesarrollo"
          @click="verificarConectividad"
          class="inline-flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          title="Verificar conectividad con el servidor"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Debug</span>
        </button>
        
        <button 
          @click="abrirModalCrearUsuario"
          class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Agregar Usuario</span>
        </button>
      </div>
    </div>
    
    <!-- Estadísticas rápidas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-indigo-100 text-sm font-medium">Total de usuarios</p>
            <p class="text-2xl font-bold">{{ usuarios.length || 0 }}</p>
          </div>
          <div class="bg-indigo-700/30 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.59" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-emerald-100 text-sm font-medium">Usuarios activos</p>
            <p class="text-2xl font-bold">{{ usuariosActivos }}</p>
          </div>
          <div class="bg-emerald-700/30 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-violet-600 to-violet-500 text-white p-6 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-violet-100 text-sm font-medium">Administradores</p>
            <p class="text-2xl font-bold">{{ usuariosAdmin }}</p>
          </div>
          <div class="bg-violet-700/30 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de usuarios -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Usuario</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rol</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="cargandoUsuarios" class="animate-pulse">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                <div class="flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5 mr-3 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando usuarios...
                </div>
              </td>
            </tr>
            
            <tr v-else-if="usuarios.length === 0" class="text-center">
              <td colspan="5" class="px-6 py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p class="text-lg font-medium mt-3">No se encontraron usuarios</p>
                <p class="text-sm mt-1">No hay usuarios registrados en el sistema</p>
              </td>
            </tr>
            
            <tr v-else v-for="usuario in usuarios" :key="usuario.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ usuario.id }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                         :class="getRoleColor(usuario.rol)">
                      {{ usuario.usuario.substring(0, 2).toUpperCase() }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ usuario.usuario }}
                    </div>
                  </div>
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getRoleBadgeColor(usuario.rol)">
                  {{ getRoleText(usuario.rol) }}
                </span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg v-if="usuario.activo" class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <span class="text-sm font-medium"
                          :class="usuario.activo ? 'text-green-800' : 'text-red-800'">
                      {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                </div>
              </td>
              
              <!-- Columna de Acciones -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center space-x-2">
                  <!-- Botón Editar -->
                  <button 
                    @click="abrirModalEditarUsuario(usuario)"
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    :title="`Editar usuario ${usuario.usuario}`"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                  
                  <!-- Botón Eliminar -->
                  <button 
                    @click="abrirModalEliminarUsuario(usuario)"
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                    :title="`Eliminar usuario ${usuario.usuario}`"
                    :disabled="usuario.id === 1"
                    :class="{ 'opacity-50 cursor-not-allowed': usuario.id === 1 }"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para crear nuevo usuario -->
    <div v-if="modalCrearVisible" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center p-4">
      <!-- Fondo oscuro con animación -->
      <div 
        class="fixed inset-0 bg-black transition-opacity duration-300"
        :class="{ 'bg-opacity-70': modalCrearVisible, 'bg-opacity-0': !modalCrearVisible }" 
        @click="cerrarModalCrear"
      ></div>
      
      <!-- Contenido del modal -->
      <div 
        class="relative bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl transform transition-all duration-300 overflow-hidden"
        :class="{ 'scale-100 opacity-100': modalCrearVisible, 'scale-95 opacity-0': !modalCrearVisible }"
      >
        <!-- Cabecera del modal -->
        <div class="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <h3 class="text-xl font-semibold flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Crear Nuevo Usuario
          </h3>
          <button 
            @click="cerrarModalCrear" 
            class="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/20"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Formulario -->
        <form @submit.prevent="crearUsuario" class="p-6 space-y-4">
          <!-- Nombre de usuario -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre de usuario *
            </label>
            <input 
              v-model="formularioUsuario.usuario" 
              type="text" 
              class="w-full rounded-lg border border-gray-300 shadow-sm px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
              placeholder="Ingrese el nombre de usuario"
              required
              :disabled="creandoUsuario"
            />
          </div>
          
          <!-- Contraseña -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña *
            </label>
            <div class="relative">
              <input 
                v-model="formularioUsuario.contrasena" 
                :type="mostrarContrasena ? 'text' : 'password'"
                class="w-full rounded-lg border border-gray-300 shadow-sm px-3 py-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                placeholder="Ingrese la contraseña"
                required
                minlength="6"
                :disabled="creandoUsuario"
              />
              <button 
                type="button"
                @click="mostrarContrasena = !mostrarContrasena"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg v-if="mostrarContrasena" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
          </div>
          
          <!-- Rol -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Rol *
            </label>
            <select 
              v-model="formularioUsuario.rol" 
              class="w-full rounded-lg border border-gray-300 shadow-sm px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              required
              :disabled="creandoUsuario"
            >
              <option value="">Seleccionar rol</option>
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
            </select>
          </div>
          
          <!-- Estado activo -->
          <div class="flex items-center">
            <input 
              v-model="formularioUsuario.activo" 
              type="checkbox" 
              id="activo"
              class="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
              :disabled="creandoUsuario"
            />
            <label for="activo" class="ml-2 text-sm font-medium text-gray-700">
              Usuario activo
            </label>
          </div>
          
          <!-- Botones de acción -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              type="button"
              @click="cerrarModalCrear"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium"
              :disabled="creandoUsuario"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              :disabled="creandoUsuario"
              class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all font-medium shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="creandoUsuario" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {{ creandoUsuario ? 'Creando...' : 'Crear Usuario' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmación de usuario creado -->
    <div v-if="confirmacionCrearVisible" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <!-- Fondo oscuro con animación -->
      <div 
        class="fixed inset-0 bg-black transition-opacity duration-300"
        :class="{ 'bg-opacity-70': confirmacionCrearVisible, 'bg-opacity-0': !confirmacionCrearVisible }" 
        @click="cerrarConfirmacionCrear"
      ></div>
      
      <!-- Modal con animación -->
      <div 
        class="relative bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 overflow-hidden"
        :class="{ 'translate-y-0 scale-100 opacity-100': confirmacionCrearVisible, 'translate-y-4 scale-95 opacity-0': !confirmacionCrearVisible }"
      >
        <div class="bg-gradient-to-b from-white to-gray-50 flex flex-col items-center p-8 text-center">
          <!-- Icono de éxito con animación -->
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
          <h3 class="mt-6 text-xl font-bold text-gray-900">¡Usuario creado!</h3>
          <p class="mt-2 text-gray-600 leading-relaxed">
            El usuario se ha creado correctamente en el sistema.
          </p>
          
          <!-- Botón de cierre -->
          <button 
            @click="cerrarConfirmacionCrear"
            class="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para editar usuario -->
    <div v-if="modalEditarVisible" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center p-4">
      <!-- Fondo oscuro con animación -->
      <div 
        class="fixed inset-0 bg-black transition-opacity duration-300"
        :class="{ 'bg-opacity-70': modalEditarVisible, 'bg-opacity-0': !modalEditarVisible }" 
        @click="cerrarModalEditar"
      ></div>
      
      <!-- Contenido del modal -->
      <div 
        class="relative bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl transform transition-all duration-300 overflow-hidden"
        :class="{ 'scale-100 opacity-100': modalEditarVisible, 'scale-95 opacity-0': !modalEditarVisible }"
      >
        <!-- Cabecera del modal -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <h3 class="text-xl font-semibold flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar Usuario
          </h3>
          <button 
            @click="cerrarModalEditar" 
            class="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/20"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Formulario -->
        <form @submit.prevent="editarUsuario" class="p-6 space-y-4">
          <!-- Nombre de usuario -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre de usuario *
            </label>
            <input 
              v-model="formularioEditar.usuario" 
              type="text" 
              class="w-full rounded-lg border border-gray-300 shadow-sm px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
              placeholder="Ingrese el nombre de usuario"
              required
              :disabled="editandoUsuario"
            />
          </div>
          
          <!-- Rol -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Rol *
            </label>
            <select 
              v-model="formularioEditar.rol" 
              class="w-full rounded-lg border border-gray-300 shadow-sm px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
              :disabled="editandoUsuario"
            >
              <option value="">Seleccionar rol</option>
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
            </select>
          </div>
          
          <!-- Estado activo -->
          <div class="flex items-center">
            <input 
              v-model="formularioEditar.activo" 
              type="checkbox" 
              id="activoEditar"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              :disabled="editandoUsuario"
            />
            <label for="activoEditar" class="ml-2 text-sm font-medium text-gray-700">
              Usuario activo
            </label>
          </div>
          
          <!-- Botones de acción -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              type="button"
              @click="cerrarModalEditar"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium"
              :disabled="editandoUsuario"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              :disabled="editandoUsuario"
              class="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="editandoUsuario" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ editandoUsuario ? 'Actualizando...' : 'Actualizar Usuario' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para eliminar usuario -->
    <div v-if="modalEliminarVisible" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center p-4">
      <!-- Fondo oscuro con animación -->
      <div 
        class="fixed inset-0 bg-black transition-opacity duration-300"
        :class="{ 'bg-opacity-70': modalEliminarVisible, 'bg-opacity-0': !modalEliminarVisible }" 
        @click="cerrarModalEliminar"
      ></div>
      
      <!-- Contenido del modal -->
      <div 
        class="relative bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl transform transition-all duration-300 overflow-hidden"
        :class="{ 'scale-100 opacity-100': modalEliminarVisible, 'scale-95 opacity-0': !modalEliminarVisible }"
      >
        <!-- Cabecera del modal -->
        <div class="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <h3 class="text-xl font-semibold flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Eliminar Usuario
          </h3>
          <button 
            @click="cerrarModalEliminar" 
            class="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/20"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Contenido -->
        <div class="p-6">
          <div class="flex items-center justify-center mb-4">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
          </div>
          
          <div class="text-center mb-6">
            <h3 class="text-lg font-bold text-gray-900 mb-2">¿Eliminar usuario?</h3>
            <p class="text-gray-600" v-if="usuarioEliminar">
              ¿Estás seguro de que quieres eliminar al usuario <strong>{{ usuarioEliminar.usuario }}</strong>?
            </p>
            <p class="text-sm text-red-600 mt-2">
              Esta acción no se puede deshacer.
            </p>
          </div>
          
          <!-- Botones de acción -->
          <div class="flex items-center justify-end gap-3">
            <button 
              type="button"
              @click="cerrarModalEliminar"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium"
              :disabled="eliminandoUsuario"
            >
              Cancelar
            </button>
            <button 
              @click="eliminarUsuario"
              :disabled="eliminandoUsuario"
              class="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="eliminandoUsuario" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {{ eliminandoUsuario ? 'Eliminando...' : 'Eliminar Usuario' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sistema de Notificaciones -->
    <div class="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      <div 
        v-for="notificacion in notificaciones" 
        :key="notificacion.id"
        class="transform transition-all duration-500 ease-out"
        :class="[
          notificacion.visible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95',
          'bg-white rounded-xl shadow-lg border-l-4 p-4 min-w-[320px]',
          notificacion.tipo === 'success' ? 'border-green-500' : '',
          notificacion.tipo === 'error' ? 'border-red-500' : '',
          notificacion.tipo === 'info' ? 'border-blue-500' : '',
          notificacion.tipo === 'warning' ? 'border-yellow-500' : ''
        ]"
      >
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <!-- Icono de éxito con animación -->
            <div v-if="notificacion.tipo === 'success'" class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <!-- Icono de error -->
            <div v-else-if="notificacion.tipo === 'error'" class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <!-- Icono de información -->
            <div v-else-if="notificacion.tipo === 'info'" class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 leading-relaxed">
              {{ notificacion.mensaje }}
            </p>
          </div>
          <div class="flex-shrink-0">
            <button 
              @click="ocultarNotificacion(notificacion.id)"
              class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              notificacion.tipo === 'info' ? 'bg-blue-500' : ''
            ]"
            style="animation: progressBar 5s linear forwards;"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { API_CONFIG, buildApiUrl } from '../config/api.js'

// Variables reactivas
const usuarios = ref([])
const cargandoUsuarios = ref(false)
const notificaciones = ref([])
let notificacionId = 0

// Variables para modal de crear usuario
const modalCrearVisible = ref(false)
const creandoUsuario = ref(false)
const confirmacionCrearVisible = ref(false)
const mostrarContrasena = ref(false)
const formularioUsuario = ref({
  usuario: '',
  contrasena: '',
  rol: '',
  activo: true
})

// Variables para modal de editar usuario
const modalEditarVisible = ref(false)
const editandoUsuario = ref(false)
const usuarioEditando = ref(null)
const formularioEditar = ref({
  id: null,
  usuario: '',
  rol: '',
  activo: true
})

// Variables para modal de eliminar usuario
const modalEliminarVisible = ref(false)
const eliminandoUsuario = ref(false)
const usuarioEliminar = ref(null)

// Configurar axios y URLs usando la configuración centralizada
const BACKEND_URL = API_CONFIG.BASE_URL

// Configurar timeout de axios
axios.defaults.timeout = API_CONFIG.TIMEOUT

// Variable para mostrar/ocultar botón de debug
const esDesarrollo = computed(() => !import.meta.env.PROD)

// Computed para verificar si el usuario actual es admin
const esAdmin = computed(() => {
  // Obtener datos del usuario desde localStorage
  try {
    const userData = localStorage.getItem('userData')
    if (userData) {
      const usuario = JSON.parse(userData)
      console.log('UsuariosView - Verificando permisos admin para usuario:', usuario)
      return usuario && usuario.rol === 'admin'
    }
  } catch (error) {
    console.error('Error al verificar rol de admin:', error)
  }
  return false
})

console.log('UsuariosView - Backend URL:', BACKEND_URL)
console.log('UsuariosView - Configuración completa:', API_CONFIG)
console.log('UsuariosView - Hostname actual:', window.location.hostname)
console.log('UsuariosView - Environment:', import.meta.env.MODE)
console.log('UsuariosView - Es desarrollo:', esDesarrollo.value)

// Propiedades computadas para estadísticas
const usuariosActivos = computed(() => {
  return usuarios.value.filter(usuario => usuario.activo === true).length
})

const usuariosAdmin = computed(() => {
  return usuarios.value.filter(usuario => usuario.rol === 'admin').length
})

// Cargar usuarios al montar el componente
onMounted(async () => {
  console.log('UsuariosView montado')
  
  // Verificar permisos antes de cargar datos
  if (!esAdmin.value) {
    console.warn('Usuario sin permisos de administrador intentando acceder a UsuariosView')
    return
  }
  
  await cargarUsuarios()
})

// Función para volver al inicio (emitir evento o usar router si está disponible)
function volverInicio() {
  // Aquí podrías emitir un evento al componente padre o usar router
  // Por ahora, recarga la página para volver al dashboard
  window.location.reload()
}

// Función de debug para verificar conectividad
async function verificarConectividad() {
  console.log('=== Verificando conectividad del API ===')
  
  try {
    // Verificar endpoint de salud
    const healthUrl = buildApiUrl('/health')
    console.log('Verificando health endpoint:', healthUrl)
    
    const healthResponse = await axios.get(healthUrl, { timeout: 5000 })
    console.log('Health check response:', healthResponse.data)
    
    mostrarNotificacion('Conexión al servidor OK', 'success')
    
    // Verificar endpoint de debug de usuarios
    const debugUrl = buildApiUrl('/usuarios/debug')
    console.log('Verificando debug endpoint:', debugUrl)
    
    const debugResponse = await axios.get(debugUrl, { timeout: 5000 })
    console.log('Debug response:', debugResponse.data)
    
    mostrarNotificacion(`Debug OK - ${debugResponse.data.totalUsuarios} usuarios en DB`, 'info')
    
  } catch (error) {
    console.error('Error en verificación de conectividad:', error)
    mostrarNotificacion(`Error de conectividad: ${error.message}`, 'error')
  }
}

async function cargarUsuarios() {
  console.log('UsuariosView - Cargando usuarios...')
  
  // Verificar permisos antes de hacer la petición
  if (!esAdmin.value) {
    console.error('UsuariosView - Usuario sin permisos de administrador')
    mostrarNotificacion('No tienes permisos para ver la lista de usuarios', 'error')
    return
  }
  
  try {
    cargandoUsuarios.value = true
    
    // Obtener el token del localStorage
    const token = localStorage.getItem('authToken')
    
    if (!token) {
      console.error('UsuariosView - No hay token de autenticación')
      mostrarNotificacion('No hay token de autenticación válido', 'error')
      return
    }
    
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: API_CONFIG.TIMEOUT
    }
    
    const url = buildApiUrl('/usuarios')
    console.log('UsuariosView - Petición a:', url)
    console.log('UsuariosView - Token:', token ? `${token.substring(0, 20)}...` : 'No token')
    console.log('UsuariosView - Headers:', config.headers)
    
    const response = await axios.get(url, config)
    
    console.log('UsuariosView - Respuesta completa:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    })
    
    if (response.data.success) {
      usuarios.value = response.data.usuarios || []
      console.log('UsuariosView - Usuarios cargados exitosamente:', usuarios.value.length)
      
      if (usuarios.value.length === 0) {
        console.warn('UsuariosView - No se encontraron usuarios en la respuesta')
        mostrarNotificacion('No se encontraron usuarios en el sistema', 'info')
      } else {
        mostrarNotificacion(`Se cargaron ${usuarios.value.length} usuarios correctamente`, 'success')
      }
    } else {
      console.error('UsuariosView - Error en respuesta del servidor:', response.data.error)
      mostrarNotificacion('Error del servidor: ' + (response.data.error || 'Respuesta inválida'), 'error')
      usuarios.value = []
    }
    
  } catch (err) {
    console.error('UsuariosView - Error completo al cargar usuarios:', {
      message: err.message,
      response: err.response ? {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data,
        headers: err.response.headers
      } : 'No response object',
      request: err.request ? 'Request was made' : 'No request object',
      config: err.config
    })
    
    // Manejar diferentes tipos de errores
    if (err.code === 'ECONNABORTED') {
      mostrarNotificacion('Timeout: El servidor tardó demasiado en responder', 'error')
    } else if (err.code === 'ERR_NETWORK') {
      mostrarNotificacion('Error de red: No se pudo conectar con el servidor', 'error')
    } else if (err.response?.status === 403) {
      mostrarNotificacion('No tienes permisos para ver la lista de usuarios', 'error')
    } else if (err.response?.status === 401) {
      mostrarNotificacion('Tu sesión ha expirado. Por favor, inicia sesión nuevamente', 'error')
      // Limpiar token inválido
      localStorage.removeItem('authToken')
    } else if (err.response?.status === 404) {
      mostrarNotificacion('Endpoint de usuarios no encontrado en el servidor', 'error')
    } else if (err.response?.status >= 500) {
      mostrarNotificacion('Error interno del servidor. Intenta más tarde', 'error')
    } else if (err.response?.data?.error) {
      mostrarNotificacion('Error: ' + err.response.data.error, 'error')
    } else {
      mostrarNotificacion('Error de conexión: ' + (err.message || 'Error desconocido'), 'error')
    }
    
    usuarios.value = []
  } finally {
    cargandoUsuarios.value = false
  }
}

// Funciones de formato y estilo
function getRoleColor(rol) {
  const colors = {
    'admin': 'bg-red-500',
    'user': 'bg-blue-500'
  }
  
  return colors[rol] || 'bg-gray-500'
}

function getRoleBadgeColor(rol) {
  const colors = {
    'admin': 'bg-red-100 text-red-800',
    'user': 'bg-blue-100 text-blue-800'
  }
  
  return colors[rol] || 'bg-gray-100 text-gray-800'
}

function getRoleText(rol) {
  const texts = {
    'admin': 'Administrador',
    'user': 'Usuario'
  }
  
  return texts[rol] || 'Sin definir'
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

// Funciones para el modal de crear usuario
function abrirModalCrearUsuario() {
  console.log('Abriendo modal para crear usuario')
  // Limpiar formulario
  formularioUsuario.value = {
    usuario: '',
    contrasena: '',
    rol: '',
    activo: true
  }
  mostrarContrasena.value = false
  modalCrearVisible.value = true
}

function cerrarModalCrear() {
  modalCrearVisible.value = false
  // Limpiar formulario después de cerrar
  setTimeout(() => {
    formularioUsuario.value = {
      usuario: '',
      contrasena: '',
      rol: '',
      activo: true
    }
    mostrarContrasena.value = false
  }, 300)
}

function cerrarConfirmacionCrear() {
  confirmacionCrearVisible.value = false
}

async function crearUsuario() {
  console.log('Creando usuario:', formularioUsuario.value)
  
  try {
    creandoUsuario.value = true
    
    // Validaciones básicas
    if (!formularioUsuario.value.usuario.trim()) {
      mostrarNotificacion('El nombre de usuario es requerido', 'error')
      return
    }
    
    if (!formularioUsuario.value.contrasena.trim()) {
      mostrarNotificacion('La contraseña es requerida', 'error')
      return
    }
    
    if (formularioUsuario.value.contrasena.length < 6) {
      mostrarNotificacion('La contraseña debe tener al menos 6 caracteres', 'error')
      return
    }
    
    if (!formularioUsuario.value.rol) {
      mostrarNotificacion('El rol es requerido', 'error')
      return
    }
    
    // Obtener el token del localStorage
    const token = localStorage.getItem('authToken')
    
    if (!token) {
      mostrarNotificacion('No hay token de autenticación válido', 'error')
      return
    }
    
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: API_CONFIG.TIMEOUT
    }
    
    const datosUsuario = {
      usuario: formularioUsuario.value.usuario.trim(),
      contrasena: formularioUsuario.value.contrasena,
      rol: formularioUsuario.value.rol,
      activo: formularioUsuario.value.activo
    }
    
    console.log('Enviando datos del usuario:', { ...datosUsuario, contrasena: '[OCULTA]' })
    
    const url = buildApiUrl('/usuarios')
    const response = await axios.post(url, datosUsuario, config)
    
    console.log('Usuario creado - Respuesta:', response.status, response.data)
    
    if (response.data.success) {
      // Cerrar modal de crear
      modalCrearVisible.value = false
      
      // Mostrar modal de confirmación
      confirmacionCrearVisible.value = true
      
      // Recargar la lista de usuarios
      await cargarUsuarios()
      
      mostrarNotificacion('Usuario creado exitosamente', 'success')
      
    } else {
      console.error('Error al crear usuario:', response.data.error)
      mostrarNotificacion('Error al crear usuario: ' + response.data.error, 'error')
    }
    
  } catch (err) {
    console.error('Error al crear usuario:', err)
    
    if (err.response?.status === 409) {
      mostrarNotificacion('Ya existe un usuario con ese nombre', 'error')
    } else if (err.response?.status === 403) {
      mostrarNotificacion('No tienes permisos para crear usuarios', 'error')
    } else if (err.response?.status === 401) {
      mostrarNotificacion('Tu sesión ha expirado. Por favor, inicia sesión nuevamente', 'error')
    } else if (err.response?.data?.error) {
      mostrarNotificacion('Error: ' + err.response.data.error, 'error')
    } else {
      mostrarNotificacion('Error de conexión con el servidor', 'error')
    }
    
  } finally {
    creandoUsuario.value = false
  }
}

// Funciones para editar usuario
function abrirModalEditarUsuario(usuario) {
  console.log('Abriendo modal para editar usuario:', usuario)
  usuarioEditando.value = usuario
  formularioEditar.value = {
    id: usuario.id,
    usuario: usuario.usuario,
    rol: usuario.rol,
    activo: usuario.activo
  }
  modalEditarVisible.value = true
}

function cerrarModalEditar() {
  modalEditarVisible.value = false
  setTimeout(() => {
    usuarioEditando.value = null
    formularioEditar.value = {
      id: null,
      usuario: '',
      rol: '',
      activo: true
    }
  }, 300)
}

async function editarUsuario() {
  console.log('Editando usuario:', formularioEditar.value)
  
  try {
    editandoUsuario.value = true
    
    // Validaciones básicas
    if (!formularioEditar.value.usuario.trim()) {
      mostrarNotificacion('El nombre de usuario es requerido', 'error')
      return
    }
    
    if (!formularioEditar.value.rol) {
      mostrarNotificacion('El rol es requerido', 'error')
      return
    }
    
    // Obtener el token del localStorage
    const token = localStorage.getItem('authToken')
    
    if (!token) {
      mostrarNotificacion('No hay token de autenticación válido', 'error')
      return
    }
    
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: API_CONFIG.TIMEOUT
    }
    
    const datosUsuario = {
      usuario: formularioEditar.value.usuario.trim(),
      rol: formularioEditar.value.rol,
      activo: formularioEditar.value.activo
    }
    
    console.log('Enviando datos actualizados del usuario:', datosUsuario)
    
    const url = buildApiUrl(`/usuarios/${formularioEditar.value.id}`)
    const response = await axios.put(url, datosUsuario, config)
    
    console.log('Usuario editado - Respuesta:', response.status, response.data)
    
    if (response.data.success) {
      // Cerrar modal
      modalEditarVisible.value = false
      
      // Recargar la lista de usuarios
      await cargarUsuarios()
      
      mostrarNotificacion('Usuario actualizado exitosamente', 'success')
      
    } else {
      console.error('Error al editar usuario:', response.data.error)
      mostrarNotificacion('Error al actualizar usuario: ' + response.data.error, 'error')
    }
    
  } catch (err) {
    console.error('Error al editar usuario:', err)
    
    if (err.response?.status === 409) {
      mostrarNotificacion('Ya existe un usuario con ese nombre', 'error')
    } else if (err.response?.status === 403) {
      mostrarNotificacion('No tienes permisos para editar usuarios', 'error')
    } else if (err.response?.status === 401) {
      mostrarNotificacion('Tu sesión ha expirado. Por favor, inicia sesión nuevamente', 'error')
    } else if (err.response?.data?.error) {
      mostrarNotificacion('Error: ' + err.response.data.error, 'error')
    } else {
      mostrarNotificacion('Error de conexión con el servidor', 'error')
    }
    
  } finally {
    editandoUsuario.value = false
  }
}

// Funciones para eliminar usuario
function abrirModalEliminarUsuario(usuario) {
  console.log('Abriendo modal para eliminar usuario:', usuario)
  
  // No permitir eliminar al usuario admin principal (ID 1)
  if (usuario.id === 1) {
    mostrarNotificacion('No se puede eliminar el usuario administrador principal', 'error')
    return
  }
  
  usuarioEliminar.value = usuario
  modalEliminarVisible.value = true
}

function cerrarModalEliminar() {
  modalEliminarVisible.value = false
  setTimeout(() => {
    usuarioEliminar.value = null
  }, 300)
}

async function eliminarUsuario() {
  console.log('Eliminando usuario:', usuarioEliminar.value)
  
  try {
    eliminandoUsuario.value = true
    
    // Obtener el token del localStorage
    const token = localStorage.getItem('authToken')
    
    if (!token) {
      mostrarNotificacion('No hay token de autenticación válido', 'error')
      return
    }
    
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: API_CONFIG.TIMEOUT
    }
    
    console.log('Eliminando usuario ID:', usuarioEliminar.value.id)
    
    const url = buildApiUrl(`/usuarios/${usuarioEliminar.value.id}`)
    const response = await axios.delete(url, config)
    
    console.log('Usuario eliminado - Respuesta:', response.status, response.data)
    
    if (response.data.success) {
      // Cerrar modal
      modalEliminarVisible.value = false
      
      // Recargar la lista de usuarios
      await cargarUsuarios()
      
      mostrarNotificacion('Usuario eliminado exitosamente', 'success')
      
    } else {
      console.error('Error al eliminar usuario:', response.data.error)
      mostrarNotificacion('Error al eliminar usuario: ' + response.data.error, 'error')
    }
    
  } catch (err) {
    console.error('Error al eliminar usuario:', err)
    
    if (err.response?.status === 403) {
      mostrarNotificacion('No tienes permisos para eliminar usuarios', 'error')
    } else if (err.response?.status === 401) {
      mostrarNotificacion('Tu sesión ha expirado. Por favor, inicia sesión nuevamente', 'error')
    } else if (err.response?.status === 404) {
      mostrarNotificacion('Usuario no encontrado', 'error')
    } else if (err.response?.data?.error) {
      mostrarNotificacion('Error: ' + err.response.data.error, 'error')
    } else {
      mostrarNotificacion('Error de conexión con el servidor', 'error')
    }
    
  } finally {
    eliminandoUsuario.value = false
  }
}
</script>

<style scoped>
/* Animación de la barra de progreso */
@keyframes progressBar {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
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

/* Transiciones suaves */
.transition-colors {
  transition-property: color, background-color, border-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-500 {
  transition-duration: 500ms;
}

/* Mejoras para la responsividad */
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

/* Gradientes personalizados para las estadísticas */
.bg-gradient-to-r {
  background: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Estados focus mejorados */
.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Estilo para la tabla responsive */
@media (max-width: 768px) {
  .overflow-x-auto {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
