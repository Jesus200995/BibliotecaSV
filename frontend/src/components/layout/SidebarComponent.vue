<template>
  <div
    class="sidebar bg-dark text-white d-flex flex-column"
    :class="{ 'collapsed': collapsed }"
  >
    <!-- Logo/Header -->
    <div class="sidebar-header p-3 border-bottom border-secondary">
      <div class="d-flex align-items-center">
        <img
          src="/logo-sembrando-vida.png"
          alt="Sembrando Vida"
          class="sidebar-logo me-3"
          v-if="!collapsed"
        >
        <div v-if="!collapsed">
          <h5 class="mb-0 text-success">Biblioteca</h5>
          <small class="text-muted">Sembrando Vida</small>
        </div>
        <i v-else class="fas fa-seedling text-success fs-4"></i>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav flex-fill py-2">
      <ul class="nav flex-column">
        <li class="nav-item" v-for="item in navigationItems" :key="item.name">
          <router-link
            :to="{ name: item.name }"
            class="nav-link d-flex align-items-center py-3 px-3"
            :class="{ 'active': $route.name === item.name }"
            @click="handleNavClick"
          >
            <i :class="item.icon" class="sidebar-icon"></i>
            <span v-if="!collapsed" class="ms-3">{{ item.title }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer p-3 border-top border-secondary">
      <div v-if="!collapsed" class="text-center">
        <small class="text-muted">
          &copy; 2025 Sembrando Vida<br>
          Versión 1.0.0
        </small>
      </div>
      <div v-else class="text-center">
        <i class="fas fa-info-circle text-muted"></i>
      </div>
    </div>

    <!-- Toggle Button -->
    <button
      class="sidebar-toggle btn btn-outline-light btn-sm"
      @click="toggleSidebar"
      :title="collapsed ? 'Expandir menú' : 'Contraer menú'"
    >
      <i :class="collapsed ? 'fas fa-angle-right' : 'fas fa-angle-left'"></i>
    </button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'SidebarComponent',

  computed: {
    ...mapState('ui', ['sidebarCollapsed']),

    collapsed () {
      return this.sidebarCollapsed
    },

    navigationItems () {
      return [
        {
          name: 'Dashboard',
          title: 'Dashboard',
          icon: 'fas fa-tachometer-alt'
        },
        {
          name: 'Archivos',
          title: 'Catálogo',
          icon: 'fas fa-folder-open'
        },
        {
          name: 'Mapa',
          title: 'Visor de Mapas',
          icon: 'fas fa-map'
        },
        {
          name: 'Estadisticas',
          title: 'Estadísticas',
          icon: 'fas fa-chart-bar'
        }
      ]
    }
  },

  methods: {
    ...mapActions('ui', ['toggleSidebar']),

    handleNavClick () {
      // En móviles, colapsar sidebar al navegar
      if (window.innerWidth <= 768) {
        this.toggleSidebar()
      }
    }
  },

  mounted () {
    // Manejar resize de ventana
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768 && !this.collapsed) {
        this.toggleSidebar()
      }
    })
  }
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  min-height: 100vh;
  transition: all 0.3s ease;
  position: relative;
  background: linear-gradient(180deg, #212529 0%, #343a40 100%) !important;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  min-height: 70px;
}

.sidebar-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.nav-link {
  color: #adb5bd !important;
  border-radius: 8px;
  margin: 2px 8px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff !important;
  transform: translateX(4px);
}

.nav-link.active {
  background-color: #28a745;
  color: #fff !important;
  box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
}

.nav-link.active::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 70%;
  background-color: #20c997;
  border-radius: 2px;
}

.sidebar-icon {
  width: 20px;
  text-align: center;
  font-size: 16px;
}

.sidebar-toggle {
  position: absolute;
  top: 50%;
  right: -12px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #6c757d;
  background-color: #343a40;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.sidebar-toggle:hover {
  background-color: #495057;
  border-color: #adb5bd;
}

.sidebar-footer {
  min-height: 60px;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 1050;
    height: 100vh;
  }

  .sidebar.collapsed {
    transform: translateX(-100%);
    width: 280px;
  }
}

/* Animaciones */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.nav-link span {
  animation: slideIn 0.3s ease;
}
</style>
