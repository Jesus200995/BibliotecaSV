<template>
  <!-- Layout principal con sidebar fijo y contenido responsivo -->
  <div id="app" class="app-layout">
    <!-- Botón hamburguesa para móvil/tablet -->
    <button 
      class="hamburger-btn" 
      @click="toggleSidebar"
      :class="{ active: sidebarOpen }"
      aria-label="Toggle menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Overlay para cerrar sidebar en móvil -->
    <div 
      v-if="sidebarOpen && isMobile" 
      class="sidebar-overlay" 
      @click="closeSidebar"
    ></div>

    <!-- Sidebar fijo y adaptativo -->
    <nav 
      class="sidebar" 
      :class="{ 
        open: sidebarOpen,
        'mobile-mode': isMobile 
      }"
    >
      <!-- Logotipo y título del sistema -->
      <div class="sidebar-header">
        <div class="logo-container">
          <el-icon class="logo-icon" :size="32">
            <Document />
          </el-icon>
          <div class="logo-text">
            <h1 class="app-title">BibliotecaSV</h1>
            <p class="app-subtitle">Sistema Institucional</p>
          </div>
        </div>
      </div>

      <!-- Menú de navegación vertical -->
      <div class="sidebar-menu">
        <ul class="menu-list">
          <li class="menu-item">
            <a href="#" class="menu-link active" @click="setActiveMenu('archivos')">
              <el-icon class="menu-icon" :size="20">
                <Folder />
              </el-icon>
              <span class="menu-text">Catálogo de Archivos</span>
            </a>
          </li>
          <li class="menu-item">
            <a href="#" class="menu-link" @click="setActiveMenu('subir')">
              <el-icon class="menu-icon" :size="20">
                <Upload />
              </el-icon>
              <span class="menu-text">Subir Archivos</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Información del usuario en la parte inferior -->
      <div class="sidebar-footer">
        <div class="user-info">
          <el-icon class="user-icon" :size="20">
            <User />
          </el-icon>
          <span class="user-text">Administrador</span>
        </div>
      </div>
    </nav>

    <!-- Contenido principal que se adapta al sidebar -->
    <main class="main-content" :class="{ 'sidebar-open': !isMobile }">
      <!-- Header del contenido con breadcrumb -->
      <header class="content-header">
        <div class="header-info">
          <h2 class="page-title">{{ getPageTitle() }}</h2>
          <p class="page-description">{{ getPageDescription() }}</p>
        </div>
        <div class="header-actions">
          <!-- Botones adicionales pueden ir aquí -->
        </div>
      </header>

      <!-- Contenido dinámico con animación -->
      <div class="content-wrapper animate__animated animate__fadeInUp">
        <FileList v-if="activeMenu === 'archivos'" />
        <!-- Componente futuro para subir archivos -->
        <div v-else-if="activeMenu === 'subir'" class="placeholder-content">
          <el-card shadow="hover">
            <h3>Subir Archivos</h3>
            <p>Panel para subir archivos en desarrollo...</p>
          </el-card>
        </div>
      </div>
    </main>

    <!-- Footer siempre visible -->
    <footer class="app-footer" :class="{ 'sidebar-open': !isMobile }">
      <p>&copy; 2025 BibliotecaSV - Sistema de Biblioteca Digital Institucional</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import FileList from './components/FileList.vue'
import { 
  Document, 
  Folder, 
  Upload, 
  User 
} from '@element-plus/icons-vue'
import 'animate.css'

// Estado reactivo del sidebar y navegación
const sidebarOpen = ref(false)
const isMobile = ref(false)
const activeMenu = ref('archivos')

// Función para detectar si estamos en móvil/tablet
const checkMobileView = () => {
  isMobile.value = window.innerWidth <= 900
  // En desktop/tablet, sidebar siempre abierto por defecto
  if (!isMobile.value) {
    sidebarOpen.value = true
  } else {
    sidebarOpen.value = false
  }
}

// Toggle del sidebar
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// Cerrar sidebar (principalmente para móvil)
const closeSidebar = () => {
  if (isMobile.value) {
    sidebarOpen.value = false
  }
}

// Establecer menú activo
const setActiveMenu = (menu) => {
  activeMenu.value = menu
  // En móvil, cerrar sidebar después de seleccionar
  if (isMobile.value) {
    closeSidebar()
  }
}

// Obtener título de página basado en menú activo
const getPageTitle = () => {
  const titles = {
    archivos: 'Catálogo de Archivos',
    subir: 'Subir Archivos'
  }
  return titles[activeMenu.value] || 'BibliotecaSV'
}

// Obtener descripción de página basado en menú activo
const getPageDescription = () => {
  const descriptions = {
    archivos: 'Gestión centralizada de documentos y archivos institucionales',
    subir: 'Carga y gestión de nuevos documentos al sistema'
  }
  return descriptions[activeMenu.value] || ''
}

// Lifecycle hooks
onMounted(() => {
  checkMobileView()
  window.addEventListener('resize', checkMobileView)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobileView)
})
</script>

<style scoped>
/* ====================================
   LAYOUT PRINCIPAL Y VARIABLES CSS
   ==================================== */
.app-layout {
  min-height: 100vh;
  background: #f5f6fa; /* Fondo gris claro profesional */
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow-x: hidden; /* Evita scroll horizontal innecesario */
}

/* ====================================
   BOTÓN HAMBURGUESA (SOLO MÓVIL/TABLET)
   ==================================== */
.hamburger-btn {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  background: #245946;
  border: none;
  border-radius: 8px;
  width: 48px;
  height: 48px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(36, 89, 70, 0.3);
  display: none; /* Oculto por defecto en desktop */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.hamburger-btn span {
  width: 20px;
  height: 2px;
  background: #fff;
  transition: all 0.3s ease;
  border-radius: 1px;
}

.hamburger-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger-btn.active span:nth-child(2) {
  opacity: 0;
}

.hamburger-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

.hamburger-btn:hover {
  background: #2d8f5a;
  transform: scale(1.05);
}

/* ====================================
   OVERLAY PARA MÓVIL
   ==================================== */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(36, 89, 70, 0.4);
  z-index: 15;
  backdrop-filter: blur(4px);
  display: none; /* Se muestra solo en móvil cuando sidebar está abierto */
}

/* ====================================
   SIDEBAR FIJO Y ADAPTATIVO
   ==================================== */
.sidebar {
  width: 240px;
  min-width: 220px;
  background: #245946; /* Verde oscuro institucional */
  color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  height: 100vh;
  z-index: 20;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
}

/* Header del sidebar con logo y título */
.sidebar-header {
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, #245946 0%, #1f4a3a 100%);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  color: #6ee7b7; /* Verde claro para destacar */
  background: rgba(110, 231, 183, 0.1);
  padding: 0.5rem;
  border-radius: 12px;
}

.logo-text {
  flex: 1;
}

.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: #fff;
  letter-spacing: -0.02em;
}

.app-subtitle {
  font-size: 0.75rem;
  margin: 0.25rem 0 0 0;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
}

/* Menú de navegación */
.sidebar-menu {
  flex: 1;
  padding: 1rem 0;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin: 0.25rem 0;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 0;
  position: relative;
}

.menu-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transform: translateX(4px);
}

.menu-link.active {
  background: #6ee7b7; /* Verde claro para resaltar activo */
  color: #245946; /* Texto oscuro sobre fondo claro */
  font-weight: 600;
}

.menu-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #245946;
}

.menu-icon {
  flex-shrink: 0;
}

.menu-text {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Footer del sidebar */
.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
}

.user-icon {
  color: #6ee7b7;
}

/* ====================================
   CONTENIDO PRINCIPAL
   ==================================== */
.main-content {
  margin-left: 240px; /* Espacio para sidebar en desktop */
  width: calc(100% - 240px);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  padding-bottom: 80px; /* Espacio para footer */
}

/* Header del contenido */
.content-header {
  background: #fff;
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-info {
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #245946;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.page-description {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
}

/* Wrapper del contenido con animación */
.content-wrapper {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  animation-duration: 0.6s;
}

.placeholder-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

/* ====================================
   FOOTER
   ==================================== */
.app-footer {
  background: #fff;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  padding: 1.5rem 2rem;
  color: #64748b;
  font-size: 0.9rem;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 240px; /* Alineado con contenido principal */
  z-index: 5;
  transition: all 0.3s ease;
}

/* ====================================
   RESPONSIVO - TABLET (901px - 1200px)
   ==================================== */
@media (max-width: 1200px) {
  .content-wrapper {
    padding: 1.5rem;
  }
  
  .content-header {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
}

/* ====================================
   RESPONSIVO - MÓVIL Y TABLET (≤900px)
   ==================================== */
@media (max-width: 900px) {
  /* Mostrar botón hamburguesa */
  .hamburger-btn {
    display: flex;
  }
  
  /* Mostrar overlay cuando sidebar está abierto */
  .sidebar-overlay {
    display: block;
  }
  
  /* Sidebar como overlay en móvil */
  .sidebar {
    left: -100vw; /* Oculto fuera de pantalla por defecto */
    width: 75vw;
    min-width: 280px;
    max-width: 320px;
  }
  
  .sidebar.open {
    left: 0; /* Aparece deslizando desde la izquierda */
  }
  
  /* Contenido ocupa toda la pantalla */
  .main-content {
    margin-left: 0;
    width: 100vw;
    padding-bottom: 60px; /* Menos espacio para footer */
  }
  
  /* Footer ocupa toda la pantalla */
  .app-footer {
    left: 0;
    right: 0;
    padding: 1rem;
  }
  
  /* Header más compacto en móvil */
  .content-header {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .page-description {
    font-size: 0.9rem;
  }
  
  /* Contenido más compacto */
  .content-wrapper {
    padding: 1rem;
  }
  
  /* Ajustes del sidebar header en móvil */
  .sidebar-header {
    padding: 1.5rem 1rem 1rem;
  }
  
  .app-title {
    font-size: 1.1rem;
  }
  
  .app-subtitle {
    font-size: 0.7rem;
  }
}

/* ====================================
   RESPONSIVO - MÓVIL PEQUEÑO (≤480px)
   ==================================== */
@media (max-width: 480px) {
  .hamburger-btn {
    top: 0.75rem;
    left: 0.75rem;
    width: 42px;
    height: 42px;
  }
  
  .sidebar {
    width: 85vw;
    min-width: 260px;
  }
  
  .content-header {
    padding: 0.75rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .page-description {
    font-size: 0.85rem;
  }
  
  .content-wrapper {
    padding: 0.75rem;
  }
  
  .app-footer {
    padding: 0.75rem;
    font-size: 0.8rem;
  }
  
  .sidebar-header {
    padding: 1rem 0.75rem 0.75rem;
  }
  
  .menu-link {
    padding: 0.75rem 1rem;
  }
  
  .menu-text {
    font-size: 0.85rem;
  }
}

/* ====================================
   ANIMACIONES Y TRANSICIONES SUAVES
   ==================================== */
@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.sidebar.open.mobile-mode {
  animation: slideInLeft 0.3s ease-out;
}

/* ====================================
   UTILIDADES PARA ACCESIBILIDAD
   ==================================== */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus visible para navegación por teclado */
.menu-link:focus-visible,
.hamburger-btn:focus-visible {
  outline: 2px solid #6ee7b7;
  outline-offset: 2px;
}
</style>
