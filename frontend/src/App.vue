<template>
  <!-- Contenedor principal con diseño responsivo y gradiente de fondo -->
  <div id="app" class="app-container">
    <!-- Header con estilo institucional moderno -->
    <header class="app-header">
      <div class="header-content">
        <div class="header-title">
          <el-icon class="header-icon" :size="40">
            <Document />
          </el-icon>
          <div>
            <h1 class="main-title">BibliotecaSV</h1>
            <p class="subtitle">Sistema de Gestión de Archivos Institucional</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido principal con animación de entrada -->
    <main class="main-content animate__animated animate__fadeInUp">
      <div class="content-wrapper">
        <FileList />
      </div>
    </main>

    <!-- Footer opcional -->
    <footer class="app-footer">
      <p>&copy; 2025 BibliotecaSV - Sistema de Biblioteca Digital</p>
    </footer>
  </div>
</template>

<script setup>
import FileList from './components/FileList.vue'
import { Document } from '@element-plus/icons-vue'
import 'animate.css'
</script>

<style scoped>
/* Estilos globales para la aplicación con tema verde institucional moderno */
.app-container {
  min-height: 100vh;
  /* Degradado de verdes institucionales elegantes */
  background: linear-gradient(135deg, #3dbd6a 0%, #2d8f5a 50%, #245946 100%);
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: background 0.3s ease;
}

.app-header {
  /* Header con verde claro institucional para distinguir de fondo */
  background: rgba(230, 249, 239, 0.95); /* Verde pastel muy suave */
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(61, 189, 106, 0.2); /* Borde verde suave */
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  /* Icono con degradado de verdes institucionales */
  color: #245946;
  background: linear-gradient(135deg, #3dbd6a, #2d8f5a);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  /* Título con degradado de verdes institucionales oscuros para buen contraste */
  background: linear-gradient(135deg, #1f5738, #245946);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  letter-spacing: -0.02em;
}

.subtitle {
  /* Subtítulo en verde gris para mejor legibilidad sobre fondo claro */
  color: #4a5568;
  font-size: 1rem;
  margin: 0.25rem 0 0 0;
  font-weight: 500;
}

.main-content {
  flex: 1;
  padding: 2rem;
  animation-duration: 0.8s;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

.app-footer {
  /* Footer con fondo verde transparente */
  background: rgba(61, 189, 106, 0.15);
  backdrop-filter: blur(10px);
  text-align: center;
  padding: 1.5rem;
  color: rgba(255, 255, 255, 0.9); /* Texto blanco para contraste sobre verde */
  font-size: 0.9rem;
  border-top: 1px solid rgba(61, 189, 106, 0.2); /* Borde verde suave */
}

/* Responsive design */
@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
  }
  
  .header-title {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .subtitle {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 1.75rem;
  }
  
  .header-content {
    padding: 0.75rem;
  }
  
  .main-content {
    padding: 0.75rem;
  }
}
</style>
