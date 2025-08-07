<template>
  <div class="reloj-cristal">
    <div class="cristal-container">
      <div class="cristal-bg"></div>
      <div class="cristal-content">
        <div class="ciudad-label">CDMX</div>
        <div class="hora-digital">{{ horaFormateada }}</div>
        <div class="fecha-label">{{ fechaFormateada }}</div>
      </div>
      <div class="cristal-shine"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const horaFormateada = ref('')
const fechaFormateada = ref('')
let intervalo = null

const actualizarHora = () => {
  // Crear fecha en zona horaria de México (CDMX)
  const ahora = new Date()
  const opciones = {
    timeZone: 'America/Mexico_City',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }
  
  const opcionesFecha = {
    timeZone: 'America/Mexico_City',
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }
  
  horaFormateada.value = ahora.toLocaleTimeString('es-MX', opciones)
  fechaFormateada.value = ahora.toLocaleDateString('es-MX', opcionesFecha)
}

onMounted(() => {
  actualizarHora()
  // Actualizar cada segundo
  intervalo = setInterval(actualizarHora, 1000)
})

onUnmounted(() => {
  if (intervalo) {
    clearInterval(intervalo)
  }
})
</script>

<style scoped>
.reloj-cristal {
  position: fixed;
  top: 5rem;
  right: 1rem;
  z-index: 30;
}

.cristal-container {
  position: relative;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px) saturate(200%);
  -webkit-backdrop-filter: blur(12px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 0.75rem 1rem;
  min-width: 140px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.cristal-container:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    inset 0 -1px 0 rgba(255, 255, 255, 0.15);
}

.cristal-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(255, 255, 255, 0.05) 50%, 
    rgba(255, 255, 255, 0.02) 100%);
  border-radius: 16px;
}

.cristal-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, 
    transparent 30%, 
    rgba(255, 255, 255, 0.1) 50%, 
    transparent 70%);
  transform: rotate(45deg);
  animation: shine 6s ease-in-out infinite;
}

.cristal-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #374151;
}

.ciudad-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.5px;
  margin-bottom: 0.125rem;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.hora-digital {
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.9);
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.fecha-label {
  font-size: 0.6rem;
  font-weight: 500;
  color: #6b7280;
  margin-top: 0.125rem;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
  text-transform: capitalize;
}

@keyframes shine {
  0% {
    opacity: 0;
    transform: rotate(45deg) translateX(-100%);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(45deg) translateX(100%);
  }
}

/* Responsivo para pantallas pequeñas */
@media (max-width: 768px) {
  .reloj-cristal {
    top: 4.5rem;
    right: 0.5rem;
  }
  
  .cristal-container {
    padding: 0.5rem 0.75rem;
    min-width: 120px;
    border-radius: 12px;
  }
  
  .ciudad-label {
    font-size: 0.6rem;
  }
  
  .hora-digital {
    font-size: 0.9rem;
  }
  
  .fecha-label {
    font-size: 0.55rem;
  }
}

/* Responsivo para pantallas muy pequeñas */
@media (max-width: 480px) {
  .cristal-container {
    padding: 0.4rem 0.6rem;
    min-width: 110px;
    border-radius: 10px;
  }
  
  .ciudad-label {
    font-size: 0.55rem;
  }
  
  .hora-digital {
    font-size: 0.8rem;
  }
  
  .fecha-label {
    font-size: 0.5rem;
  }
}

/* Para pantallas grandes */
@media (min-width: 1200px) {
  .cristal-container {
    padding: 1rem 1.25rem;
    min-width: 160px;
  }
  
  .ciudad-label {
    font-size: 0.7rem;
  }
  
  .hora-digital {
    font-size: 1.1rem;
  }
  
  .fecha-label {
    font-size: 0.65rem;
  }
}
</style>