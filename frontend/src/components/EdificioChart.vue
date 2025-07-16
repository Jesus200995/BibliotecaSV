<template>
  <div class="edificios-chart">
    <!-- Título del componente -->
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      Distribución por tipo de archivo
    </h3>

    <!-- Leyenda para explicar la visualización -->
    <div class="text-xs text-gray-500 mb-2 text-center">
      La altura representa el porcentaje de cada tipo respecto al total de archivos
    </div>

    <!-- Contenedor principal para los edificios -->
    <div class="edificios-container">
      <div 
        v-for="(tipo, index) in tiposArchivo.slice(0, 6)" 
        :key="tipo.tipo" 
        class="edificio-wrapper"
        :style="{ '--delay': index * 0.1 + 's' }"
      >
        <!-- Contenedor con altura fija para mantener alineación -->
        <div class="edificio-container">
          <!-- Etiqueta con cantidad y porcentaje -->
          <div class="edificio-stats">
            <span class="edificio-cantidad">{{ tipo.cantidad }}</span>
            <span class="edificio-porcentaje">{{ calcularPorcentaje(tipo.cantidad) }}</span>
          </div>
          
          <!-- Edificio con altura proporcional al porcentaje -->
          <div 
            class="edificio"
            :style="{ 
              '--height': calcularAltura(tipo.cantidad) + 'px',
              '--color': obtenerColor(tipo.tipo)
            }"
          >
            <!-- Ventanas del edificio (efecto visual) -->
            <div class="edificio-ventanas"></div>
          </div>
          
          <!-- Etiqueta del tipo de archivo -->
          <div class="edificio-label">{{ tipo.tipo }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props para recibir datos desde el componente padre
const props = defineProps({
  tiposArchivo: {
    type: Array,
    required: true
  },
  totalArchivos: {
    type: Number,
    required: true
  }
})

// Colores para cada tipo de archivo
const colores = {
  'PDF': '#ef4444',
  'XLSX': '#22c55e',
  'DOCX': '#3b82f6',
  'DOC': '#3b82f6',
  'XLS': '#22c55e',
  'ZIP': '#f59e0b',
  'RAR': '#f59e0b',
  'JPG': '#a855f7',
  'JPEG': '#a855f7',
  'PNG': '#a855f7',
  'TXT': '#6b7280'
}

// Función para obtener el color según el tipo de archivo
function obtenerColor(tipo) {
  return colores[tipo] || '#6b7280'
}

// Función para calcular el porcentaje exacto con 1 decimal
function calcularPorcentaje(cantidad) {
  if (props.totalArchivos === 0) return '0.0%'
  const porcentaje = (cantidad / props.totalArchivos) * 100
  return porcentaje.toFixed(1) + '%'
}

// Función para calcular la altura del edificio basada en el porcentaje real
function calcularAltura(cantidad) {
  const porcentaje = (cantidad / props.totalArchivos) * 100
  const alturaMaxima = 180 // altura máxima en píxeles para el 100%
  const alturaMinima = 20  // altura mínima para tipos con pocos archivos
  
  return Math.max((porcentaje / 100) * alturaMaxima, alturaMinima)
}
</script>

<style scoped>
/* Contenedor principal para los edificios */
.edificios-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 24px;
  justify-content: center;
  padding: 20px 0;
  margin-top: 20px;
}

/* Wrapper para cada edificio con animación */
.edificio-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.6s ease-out forwards;
  animation-delay: var(--delay);
  opacity: 0;
}

/* Animación de aparición */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Contenedor para mantener la alineación de los edificios */
.edificio-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 240px; /* Altura fija del contenedor */
  position: relative;
}

/* Estadísticas sobre el edificio */
.edificio-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
}

/* Cantidad de archivos */
.edificio-cantidad {
  font-weight: 700;
  font-size: 18px;
  color: #1f2937;
}

/* Porcentaje */
.edificio-porcentaje {
  font-weight: 500;
  font-size: 14px;
  color: #4b5563;
}

/* El edificio en sí */
.edificio {
  width: 60px;
  height: var(--height);
  background-color: var(--color);
  border-radius: 4px 4px 0 0;
  position: absolute;
  bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  animation: buildingGrow 1s ease-out forwards;
  animation-delay: calc(var(--delay) + 0.2s);
  transform-origin: bottom;
  transform: scaleY(0.1);
  opacity: 0.3;
}

/* Animación de crecimiento del edificio */
@keyframes buildingGrow {
  from { 
    transform: scaleY(0.1);
    opacity: 0.3; 
  }
  to { 
    transform: scaleY(1);
    opacity: 1; 
  }
}

/* Ventanas del edificio (efecto visual) */
.edificio-ventanas {
  background-image: 
    repeating-linear-gradient(
      to right,
      transparent,
      transparent 8px,
      rgba(255, 255, 255, 0.2) 8px,
      rgba(255, 255, 255, 0.2) 12px
    ),
    repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 8px,
      rgba(255, 255, 255, 0.1) 8px,
      rgba(255, 255, 255, 0.1) 12px
    );
  height: 100%;
  width: 100%;
}

/* Etiqueta del tipo de archivo */
.edificio-label {
  position: absolute;
  bottom: 0;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  text-align: center;
  width: 100%;
  padding: 5px 0;
}

/* Efecto hover para el edificio */
.edificio:hover {
  transform: scaleY(1.05);
  filter: brightness(1.1);
}

/* Responsividad para móviles */
@media (max-width: 640px) {
  .edificios-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .edificio {
    width: 50px;
  }
  
  .edificio-label {
    font-size: 12px;
  }
}
</style>
