<template>
  <div class="layout-wrapper">
    <!-- Sidebar -->
    <Sidebar :visible="sidebarVisible" @update:visible="sidebarVisible = $event">
      <div class="sidebar-header">
        <h2>Biblioteca de Datos</h2>
      </div>
      <div class="sidebar-content">
        <Menu :model="menuItems" />
      </div>
    </Sidebar>

    <!-- Main Content -->
    <div class="layout-main">
      <!-- Topbar -->
      <div class="topbar">
        <Button icon="pi pi-bars" @click="toggleSidebar" class="p-button-text" />
        <div class="topbar-title">Sembrando Vida</div>
      </div>

      <!-- Content -->
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import Sidebar from 'primevue/sidebar'
import Menu from 'primevue/menu'
import Button from 'primevue/button'

export default {
  name: 'App',
  components: {
    Sidebar,
    Menu,
    Button
  },
  setup() {
    const sidebarVisible = ref(false)
    const menuItems = ref([
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        to: '/'
      },
      {
        label: 'Catálogo de Archivos',
        icon: 'pi pi-folder',
        to: '/archivos'
      },
      {
        label: 'Visualizador de Mapas',
        icon: 'pi pi-map',
        to: '/mapas'
      }
    ])

    const toggleSidebar = () => {
      sidebarVisible.value = !sidebarVisible.value
    }

    return {
      sidebarVisible,
      menuItems,
      toggleSidebar
    }
  }
}
</script>

<style lang="scss">
.layout-wrapper {
  min-height: 100vh;
  background-color: var(--surface-ground);

  .layout-main {
    padding-top: 4rem;
    
    .topbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      background: var(--surface-card);
      display: flex;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,.1);
      z-index: 999;

      .topbar-title {
        margin-left: 1rem;
        font-size: 1.2rem;
        font-weight: 600;
      }
    }

    .main-content {
      padding: 2rem;
    }
  }
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
  
  h2 {
    margin: 0;
    color: var(--primary-color);
  }
}

.sidebar-content {
  padding: 1rem;
}
</style>
