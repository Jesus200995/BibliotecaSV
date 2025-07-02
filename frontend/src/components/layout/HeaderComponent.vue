<template>
  <header class="header bg-white border-bottom shadow-sm">
    <div class="container-fluid">
      <div class="row align-items-center py-3">
        <!-- Left: Breadcrumbs and Page Title -->
        <div class="col-md-8">
          <div class="d-flex align-items-center">
            <!-- Mobile Menu Toggle -->
            <button
              class="btn btn-outline-secondary btn-sm me-3 d-md-none"
              @click="toggleSidebar"
            >
              <i class="fas fa-bars"></i>
            </button>

            <!-- Breadcrumbs -->
            <nav aria-label="breadcrumb" v-if="breadcrumbs.length > 0">
              <ol class="breadcrumb mb-0">
                <li
                  class="breadcrumb-item"
                  v-for="(item, index) in breadcrumbs"
                  :key="index"
                  :class="{ active: index === breadcrumbs.length - 1 }"
                >
                  <router-link
                    v-if="item.to && index !== breadcrumbs.length - 1"
                    :to="item.to"
                    class="text-decoration-none"
                  >
                    <i v-if="item.icon" :class="item.icon" class="me-1"></i>
                    {{ item.text }}
                  </router-link>
                  <span v-else>
                    <i v-if="item.icon" :class="item.icon" class="me-1"></i>
                    {{ item.text }}
                  </span>
                </li>
              </ol>
            </nav>

            <!-- Page Title if no breadcrumbs -->
            <h4 v-else class="mb-0 text-dark">
              <i v-if="currentRoute.meta.icon" :class="currentRoute.meta.icon" class="me-2 text-primary"></i>
              {{ currentRoute.meta.title || 'Biblioteca de Datos Web' }}
            </h4>
          </div>
        </div>

        <!-- Right: Actions and Info -->
        <div class="col-md-4">
          <div class="d-flex align-items-center justify-content-end">
            <!-- Search Button (Mobile) -->
            <button
              class="btn btn-outline-primary btn-sm me-2 d-md-none"
              @click="showMobileSearch = !showMobileSearch"
            >
              <i class="fas fa-search"></i>
            </button>

            <!-- Connection Status -->
            <div class="d-flex align-items-center me-3">
              <div
                class="status-indicator me-2"
                :class="connectionStatusDisplay.class"
                :title="connectionStatusDisplay.title"
              ></div>
              <small class="text-muted d-none d-lg-inline">
                {{ connectionStatusDisplay.text }}
              </small>
            </div>

            <!-- Current Time -->
            <div class="text-muted d-none d-xl-block">
              <small>
                <i class="fas fa-clock me-1"></i>
                {{ currentTime }}
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Search Bar -->
      <div v-if="showMobileSearch" class="row mt-2 d-md-none">
        <div class="col-12">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="Buscar archivos..."
              v-model="mobileSearchQuery"
              @keyup.enter="handleMobileSearch"
            >
            <button
              class="btn btn-primary"
              type="button"
              @click="handleMobileSearch"
            >
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'HeaderComponent',

  data () {
    return {
      currentTime: '',
      timeInterval: null,
      showMobileSearch: false,
      mobileSearchQuery: '',
      connectionStatus: {
        connected: true,
        lastCheck: new Date()
      }
    }
  },

  computed: {
    ...mapState('ui', ['breadcrumbs']),

    currentRoute () {
      return this.$route
    },

    connectionStatusDisplay () {
      if (this.connectionStatus.connected) {
        return {
          class: 'bg-success',
          title: 'Conectado al servidor',
          text: 'En línea'
        }
      } else {
        return {
          class: 'bg-danger',
          title: 'Sin conexión al servidor',
          text: 'Sin conexión'
        }
      }
    }
  },

  methods: {
    ...mapActions('ui', ['toggleSidebar', 'setBreadcrumbs']),
    ...mapActions('archivos', ['aplicarFiltros']),

    updateTime () {
      const now = new Date()
      this.currentTime = now.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    handleMobileSearch () {
      if (this.mobileSearchQuery.trim()) {
        this.aplicarFiltros({ busqueda: this.mobileSearchQuery.trim() })

        // Navegar a archivos si no estamos ahí
        if (this.$route.name !== 'Archivos') {
          this.$router.push({ name: 'Archivos' })
        }
      }

      this.showMobileSearch = false
    },

    checkConnection () {
      // Aquí se puede implementar un ping al servidor
      // Por ahora simulamos que está conectado
      this.connectionStatus.connected = true
      this.connectionStatus.lastCheck = new Date()
    },

    generateBreadcrumbs () {
      const breadcrumbs = []

      // Home
      breadcrumbs.push({
        text: 'Inicio',
        icon: 'fas fa-home',
        to: { name: 'Dashboard' }
      })

      // Current page
      if (this.$route.name !== 'Dashboard') {
        if (this.$route.name === 'DetalleArchivo') {
          breadcrumbs.push({
            text: 'Catálogo',
            icon: 'fas fa-folder-open',
            to: { name: 'Archivos' }
          })
          breadcrumbs.push({
            text: 'Detalle del Archivo',
            icon: 'fas fa-file-alt'
          })
        } else {
          breadcrumbs.push({
            text: this.$route.meta.title,
            icon: this.$route.meta.icon
          })
        }
      }

      this.setBreadcrumbs(breadcrumbs)
    }
  },

  mounted () {
    this.updateTime()
    this.timeInterval = setInterval(this.updateTime, 60000) // Actualizar cada minuto

    // Check connection every 30 seconds
    setInterval(this.checkConnection, 30000)
    this.checkConnection()
  },

  beforeDestroy () {
    if (this.timeInterval) {
      clearInterval(this.timeInterval)
    }
  },

  watch: {
    '$route' () {
      // Cerrar búsqueda móvil al cambiar de ruta
      this.showMobileSearch = false

      // Auto-generar breadcrumbs basado en la ruta
      this.generateBreadcrumbs()
    }
  },

  created () {
    this.generateBreadcrumbs()
  }

}
</script>

<style scoped>
.header {
  min-height: 70px;
  z-index: 1000;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.breadcrumb {
  background: none;
  padding: 0;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: "›";
  font-weight: bold;
  color: #6c757d;
}

.breadcrumb-item.active {
  color: #6c757d;
}

.breadcrumb-item a {
  color: #007bff;
}

.breadcrumb-item a:hover {
  color: #0056b3;
  text-decoration: underline !important;
}

@media (max-width: 768px) {
  .header {
    position: sticky;
    top: 0;
    z-index: 1040;
  }
}
</style>
