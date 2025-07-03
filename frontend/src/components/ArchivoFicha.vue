<template>
  <div v-if="archivo" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div class="bg-gray-900 text-white p-8 rounded-lg shadow-lg w-full max-w-4xl relative">
      <button @click="$emit('cerrar')" class="absolute right-4 top-4 text-2xl font-bold text-gray-400 hover:text-red-500">&times;</button>
      <h2 class="text-2xl font-bold mb-2">{{ archivo.nombre }}</h2>
      <p class="text-sm text-gray-400 mb-4">Fecha de actualización: {{ archivo.fecha_actualizacion }}</p>
      <table class="w-full mb-3">
        <tbody>
          <tr><td class="font-semibold w-1/4 py-2">Descripción</td><td>{{ archivo.descripcion }}</td></tr>
          <tr><td class="font-semibold w-1/4 py-2">Tipo</td><td>{{ archivo.tipo }}</td></tr>
          <tr><td class="font-semibold w-1/4 py-2">Tamaño</td><td>{{ (archivo.tamano/1024).toFixed(1) }} KB</td></tr>
          <tr><td class="font-semibold w-1/4 py-2">Etiquetas</td><td>{{ archivo.etiquetas }}</td></tr>
          <tr><td class="font-semibold w-1/4 py-2">Responsable</td><td>{{ archivo.responsable }}</td></tr>
          <tr><td class="font-semibold w-1/4 py-2">Fuente</td><td>{{ archivo.fuente }}</td></tr>
          <tr><td class="font-semibold w-1/4 py-2">Alcance geográfico</td><td>{{ archivo.alcance_geografico }}</td></tr>
          <tr><td class="font-semibold w-1/4 py-2">Validación</td><td>{{ archivo.validacion }}</td></tr>
          <tr><td class="font-semibold w-1/4 py-2">Observaciones</td><td>{{ archivo.observaciones }}</td></tr>
        </tbody>
      </table>
      <a :href="`${BACKEND_URL}/archivos/descargar/${archivo.id}`" target="_blank" class="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-white">Descargar</a>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  archivo: Object,
})

// URL del backend, primero intentamos localhost y si no funciona usamos la IP del VPS
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
</script>
