<template>
  <div class="dashboard-view">
    <div class="container-fluid p-4">
      <!-- Welcome Section -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="welcome-card bg-gradient-primary text-white rounded-3 p-4">
            <div class="row align-items-center">
              <div class="col-md-8">
                <h1 class="display-6 fw-bold mb-2">
                  <i class="fas fa-seedling me-3"></i>
                  Biblioteca de Datos Web
                </h1>
                <p class="lead mb-0">
                  Catálogo de información del programa Sembrando Vida
                </p>
                <p class="mb-0 opacity-75">
                  Explora, filtra y descarga datos geoespaciales y estadísticos
                </p>
              </div>
              <div class="col-md-4 text-center">
                <i class="fas fa-database display-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4" v-if="estadisticas">
        <div class="col-xl-3 col-md-6 mb-3">
          <div class="card border-left-primary shadow-sm h-100">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total de Archivos
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">
                    {{ estadisticas.total_archivos.toLocaleString() }}
                  </div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-file-alt fa-2x text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-3">
          <div class="card border-left-success shadow-sm h-100">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Tamaño Total
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">
                    {{ estadisticas.tamano_total_mb.toFixed(1) }} MB
                  </div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-hdd fa-2x text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-3">
          <div class="card border-left-info shadow-sm h-100">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Tipos de Archivo
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">
                    {{ Object.keys(estadisticas.archivos_por_tipo).length }}
                  </div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-layer-group fa-2x text-info"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-3">
          <div class="card border-left-warning shadow-sm h-100">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Temas Disponibles
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">
                    {{ Object.keys(estadisticas.archivos_por_tema).length }}
                  </div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-tags fa-2x text-warning"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="row mb-4" v-if="estadisticas">
        <!-- Archivos por Tipo -->
        <div class="col-lg-6 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-primary text-white">
              <h6 class="m-0 font-weight-bold">
                <i class="fas fa-chart-pie me-2"></i>
                Archivos por Tipo
              </h6>
            </div>
            <div class="card-body">
              <div class="chart-container">
                <canvas id="tiposChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Archivos por Tema -->
        <div class="col-lg-6 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-success text-white">
              <h6 class="m-0 font-weight-bold">
                <i class="fas fa-chart-bar me-2"></i>
                Archivos por Tema
              </h6>
            </div>
            <div class="card-body">
              <div class="chart-container">
                <canvas id="temasChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header">
              <h6 class="m-0 font-weight-bold text-primary">
                <i class="fas fa-bolt me-2"></i>
                Acciones Rápidas
              </h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 mb-3">
                  <router-link :to="{ name: 'Archivos' }" class="btn btn-primary btn-lg w-100">
                    <i class="fas fa-folder-open me-2"></i>
                    Ver Catálogo
                  </router-link>
                </div>
                <div class="col-md-3 mb-3">
                  <router-link :to="{ name: 'Mapa' }" class="btn btn-success btn-lg w-100">
                    <i class="fas fa-map me-2"></i>
                    Visor de Mapas
                  </router-link>
                </div>
                <div class="col-md-3 mb-3">
                  <router-link :to="{ name: 'Estadisticas' }" class="btn btn-info btn-lg w-100">
                    <i class="fas fa-chart-bar me-2"></i>
                    Estadísticas
                  </router-link>
                </div>
                <div class="col-md-3 mb-3">
                  <button class="btn btn-warning btn-lg w-100" @click="buscarArchivos">
                    <i class="fas fa-search me-2"></i>
                    Buscar Datos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Files -->
      <div class="row" v-if="archivosRecientes.length > 0">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header">
              <h6 class="m-0 font-weight-bold text-primary">
                <i class="fas fa-clock me-2"></i>
                Archivos Recientes
              </h6>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Tema</th>
                      <th>Actualizado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="archivo in archivosRecientes" :key="archivo.id">
                      <td>
                        <i :class="getFileIcon(archivo.tipo_archivo)" class="me-2"></i>
                        {{ archivo.nombre_archivo }}
                      </td>
                      <td>
                        <span class="badge bg-secondary">{{ archivo.tipo_archivo }}</span>
                      </td>
                      <td>{{ archivo.tema || 'Sin tema' }}</td>
                      <td>{{ $moment(archivo.fecha_actualizacion).fromNow() }}</td>
                      <td>
                        <router-link
                          :to="{ name: 'DetalleArchivo', params: { id: archivo.id } }"
                          class="btn btn-sm btn-outline-primary"
                        >
                          Ver
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'DashboardView',

  computed: {
    ...mapState('archivos', ['estadisticas', 'archivos']),

    archivosRecientes () {
      return this.archivos.slice(0, 5)
    }
  },

  methods: {
    ...mapActions('archivos', ['cargarEstadisticas', 'cargarArchivos']),

    getFileIcon (tipo) {
      if (!tipo) return 'fas fa-file'

      const tipoLower = tipo.toLowerCase()
      if (tipoLower.includes('csv')) return 'fas fa-file-csv text-success'
      if (tipoLower.includes('excel') || tipoLower.includes('xlsx')) return 'fas fa-file-excel text-success'
      if (tipoLower.includes('shp') || tipoLower.includes('geojson')) return 'fas fa-map text-primary'
      if (tipoLower.includes('pdf')) return 'fas fa-file-pdf text-danger'
      if (tipoLower.includes('zip')) return 'fas fa-file-archive text-warning'
      return 'fas fa-file text-muted'
    },

    buscarArchivos () {
      this.$router.push({ name: 'Archivos' })
    },

    async loadData () {
      try {
        await Promise.all([
          this.cargarEstadisticas(),
          this.cargarArchivos()
        ])
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error)
      }
    }
  },

  async mounted () {
    await this.loadData()
  }
}
</script>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.welcome-card {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
}

.card {
  border: none;
  border-radius: 12px;
}

.card-header {
  border-radius: 12px 12px 0 0 !important;
  border-bottom: 1px solid rgba(0,0,0,0.125);
}

.btn-lg {
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-lg:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.chart-container {
  position: relative;
  height: 300px;
}

.table {
  margin-bottom: 0;
}

.table td {
  vertical-align: middle;
}

.badge {
  font-size: 0.75em;
}

.text-xs {
  font-size: 0.7rem;
}

.font-weight-bold {
  font-weight: 600 !important;
}

.text-gray-800 {
  color: #5a5c69 !important;
}

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeInUp 0.6s ease;
}

.card:nth-child(1) { animation-delay: 0.1s; }
.card:nth-child(2) { animation-delay: 0.2s; }
.card:nth-child(3) { animation-delay: 0.3s; }
.card:nth-child(4) { animation-delay: 0.4s; }
</style>
