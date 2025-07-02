<template>
  <div id="app">
    <div class="d-flex" style="height: 100vh;">
      <!-- Sidebar -->
      <SidebarComponent />

      <!-- Main Content -->
      <div class="flex-fill d-flex flex-column overflow-hidden">
        <!-- Header -->
        <HeaderComponent />

        <!-- Content Area -->
        <main class="flex-fill overflow-auto bg-light">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from '@/components/layout/SidebarComponent.vue'
import HeaderComponent from '@/components/layout/HeaderComponent.vue'

export default {
  name: 'App',
  components: {
    SidebarComponent,
    HeaderComponent
  }
}
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Estilos globales */
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.shadow-sm-custom {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}

.border-left-primary {
  border-left: 4px solid #007bff !important;
}

.border-left-success {
  border-left: 4px solid #28a745 !important;
}

.border-left-warning {
  border-left: 4px solid #ffc107 !important;
}

.border-left-danger {
  border-left: 4px solid #dc3545 !important;
}

.border-left-info {
  border-left: 4px solid #17a2b8 !important;
}
</style>
