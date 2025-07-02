<template>
  <div class="estadisticas-view">
    <div class="container-fluid p-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm border-left-primary">
            <div class="card-body">
              <h3 class="text-primary mb-2">
                <i class="fas fa-chart-bar me-3"></i>
                Estadísticas del Catálogo
              </h3>
              <p class="text-muted mb-0">
                Análisis completo de los datos disponibles en la Biblioteca de Sembrando Vida
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center p-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando estadísticas...</span>
        </div>
        <p class="mt-3 text-muted">Generando estadísticas...</p>
      </div>

      <!-- Content -->
      <div v-else-if="estadisticas">
        <!-- Summary Cards -->
        <div class="row mb-4">
          <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-primary shadow h-100">
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
                    <i class="fas fa-file-alt fa-2x text-primary opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-success shadow h-100">
              <div class="card-body">
                <div class="row no-gutters align-items-center">
                  <div class="col mr-2">
                    <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Tamaño Total (MB)
                    </div>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">
                      {{ estadisticas.tamano_total_mb.toLocaleString(undefined, { maximumFractionDigits: 1 }) }}
                    </div>
                  </div>
                  <div class="col-auto">
                    <i class="fas fa-hdd fa-2x text-success opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-info shadow h-100">
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
                    <i class="fas fa-layer-group fa-2x text-info opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-warning shadow h-100">
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
                    <i class="fas fa-tags fa-2x text-warning opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Row 1 -->
        <div class="row mb-4">
          <!-- Tipos de Archivo -->
          <div class="col-lg-6 mb-4">
            <div class="card shadow">
              <div class="card-header bg-primary text-white">
                <h6 class="m-0 font-weight-bold">
                  <i class="fas fa-chart-pie me-2"></i>
                  Distribución por Tipo de Archivo
                </h6>
              </div>
              <div class="card-body">
                <div class="chart-container mb-3">
                  <canvas ref="tiposChart"></canvas>
                </div>
                <div class="small text-muted">
                  <strong>{{ Object.values(estadisticas.archivos_por_tipo).reduce((a, b) => a + b, 0) }}</strong>
                  archivos en total
                </div>
              </div>
            </div>
          </div>

          <!-- Temas -->
          <div class="col-lg-6 mb-4">
            <div class="card shadow">
              <div class="card-header bg-success text-white">
                <h6 class="m-0 font-weight-bold">
                  <i class="fas fa-chart-bar me-2"></i>
                  Archivos por Tema
                </h6>
              </div>
              <div class="card-body">
                <div class="chart-container mb-3">
                  <canvas ref="temasChart"></canvas>
                </div>
                <div class="small text-muted">
                  <strong>{{ Object.keys(estadisticas.archivos_por_tema).length }}</strong>
                  temas diferentes
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Row 2 -->
        <div class="row mb-4">
          <!-- Entidades -->
          <div class="col-lg-8 mb-4">
            <div class="card shadow">
              <div class="card-header bg-info text-white">
                <h6 class="m-0 font-weight-bold">
                  <i class="fas fa-chart-line me-2"></i>
                  Archivos por Entidad
                </h6>
              </div>
              <div class="card-body">
                <div class="chart-container">
                  <canvas ref="entidadesChart"></canvas>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Municipios -->
          <div class="col-lg-4 mb-4">
            <div class="card shadow">
              <div class="card-header bg-warning text-white">
                <h6 class="m-0 font-weight-bold">
                  <i class="fas fa-list me-2"></i>
                  Top 10 Municipios
                </h6>
              </div>
              <div class="card-body p-0">
                <div class="list-group list-group-flush">
                  <div
                    v-for="(cantidad, municipio, index) in topMunicipios"
                    :key="municipio"
                    class="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div class="fw-bold">{{ municipio }}</div>
                      <small class="text-muted">Posición #{{ index + 1 }}</small>
                    </div>
                    <span class="badge bg-warning rounded-pill">{{ cantidad }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tables Row -->
        <div class="row">
          <!-- Detailed Statistics -->
          <div class="col-lg-6 mb-4">
            <div class="card shadow">
              <div class="card-header bg-dark text-white">
                <h6 class="m-0 font-weight-bold">
                  <i class="fas fa-table me-2"></i>
                  Detalle por Tipo de Archivo
                </h6>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-hover mb-0">
                    <thead class="table-light">
                      <tr>
                        <th>Tipo</th>
                        <th class="text-center">Cantidad</th>
                        <th class="text-center">Porcentaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(cantidad, tipo) in estadisticas.archivos_por_tipo" :key="tipo">
                        <td>
                          <i :class="getFileIcon(tipo)" class="me-2"></i>
                          <strong>{{ tipo }}</strong>
                        </td>
                        <td class="text-center">{{ cantidad }}</td>
                        <td class="text-center">
                          <div class="d-flex align-items-center">
                            <div class="progress flex-fill me-2" style="height: 6px;">
                              <div
                                class="progress-bar bg-primary"
                                :style="{ width: `${(cantidad / estadisticas.total_archivos * 100)}%` }"
                              ></div>
                            </div>
                            <small>{{ ((cantidad / estadisticas.total_archivos) * 100).toFixed(1) }}%</small>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Themes Statistics -->
          <div class="col-lg-6 mb-4">
            <div class="card shadow">
              <div class="card-header bg-secondary text-white">
                <h6 class="m-0 font-weight-bold">
                  <i class="fas fa-tags me-2"></i>
                  Detalle por Tema
                </h6>
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-hover mb-0">
                    <thead class="table-light">
                      <tr>
                        <th>Tema</th>
                        <th class="text-center">Cantidad</th>
                        <th class="text-center">Porcentaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(cantidad, tema) in estadisticas.archivos_por_tema" :key="tema">
                        <td><strong>{{ tema }}</strong></td>
                        <td class="text-center">{{ cantidad }}</td>
                        <td class="text-center">
                          <div class="d-flex align-items-center">
                            <div class="progress flex-fill me-2" style="height: 6px;">
                              <div
                                class="progress-bar bg-success"
                                :style="{ width: `${(cantidad / estadisticas.total_archivos * 100)}%` }"
                              ></div>
                            </div>
                            <small>{{ ((cantidad / estadisticas.total_archivos) * 100).toFixed(1) }}%</small>
                          </div>
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

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger">
        <h5>
          <i class="fas fa-exclamation-triangle me-2"></i>
          Error al cargar estadísticas
        </h5>
        <p class="mb-0">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Chart from 'chart.js/auto'

export default {
  name: 'EstadisticasView',

  data () {
    return {
      charts: {}
    }
  },

  computed: {
    ...mapState('archivos', ['estadisticas', 'loading', 'error']),

    topMunicipios () {
      if (!this.estadisticas?.archivos_por_entidad) return {}

      const entradas = Object.entries(this.estadisticas.archivos_por_entidad)
      return Object.fromEntries(
        entradas
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
      )
    }
  },

  methods: {
    ...mapActions('archivos', ['cargarEstadisticas']),

    getFileIcon (tipo) {
      if (!tipo) return 'fas fa-file text-muted'

      const tipoLower = tipo.toLowerCase()
      if (tipoLower.includes('csv')) return 'fas fa-file-csv text-success'
      if (tipoLower.includes('excel') || tipoLower.includes('xlsx')) return 'fas fa-file-excel text-success'
      if (tipoLower.includes('shp') || tipoLower.includes('geojson')) return 'fas fa-map text-primary'
      if (tipoLower.includes('pdf')) return 'fas fa-file-pdf text-danger'
      if (tipoLower.includes('zip')) return 'fas fa-file-archive text-warning'
      return 'fas fa-file text-muted'
    },

    createCharts () {
      this.$nextTick(() => {
        this.createTiposChart()
        this.createTemasChart()
        this.createEntidadesChart()
      })
    },

    createTiposChart () {
      const ctx = this.$refs.tiposChart?.getContext('2d')
      if (!ctx || !this.estadisticas?.archivos_por_tipo) return

      const data = this.estadisticas.archivos_por_tipo

      if (this.charts.tipos) {
        this.charts.tipos.destroy()
      }

      this.charts.tipos = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(data),
          datasets: [{
            data: Object.values(data),
            backgroundColor: [
              '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
              '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })
    },

    createTemasChart () {
      const ctx = this.$refs.temasChart?.getContext('2d')
      if (!ctx || !this.estadisticas?.archivos_por_tema) return

      const data = this.estadisticas.archivos_por_tema
      const entries = Object.entries(data).sort(([, a], [, b]) => b - a).slice(0, 8)

      if (this.charts.temas) {
        this.charts.temas.destroy()
      }

      this.charts.temas = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: entries.map(([tema]) => tema),
          datasets: [{
            label: 'Archivos',
            data: entries.map(([, cantidad]) => cantidad),
            backgroundColor: '#28a745',
            borderColor: '#28a745',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    },

    createEntidadesChart () {
      const ctx = this.$refs.entidadesChart?.getContext('2d')
      if (!ctx || !this.estadisticas?.archivos_por_entidad) return

      const data = this.estadisticas.archivos_por_entidad
      const entries = Object.entries(data).sort(([, a], [, b]) => b - a).slice(0, 15)

      if (this.charts.entidades) {
        this.charts.entidades.destroy()
      }

      this.charts.entidades = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
          labels: entries.map(([entidad]) => entidad),
          datasets: [{
            label: 'Archivos',
            data: entries.map(([, cantidad]) => cantidad),
            backgroundColor: '#17a2b8',
            borderColor: '#17a2b8',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              beginAtZero: true
            }
          }
        }
      })
    },

    destroyCharts () {
      Object.values(this.charts).forEach(chart => {
        if (chart) chart.destroy()
      })
      this.charts = {}
    }
  },

  async mounted () {
    await this.cargarEstadisticas()
    this.createCharts()
  },

  beforeDestroy () {
    this.destroyCharts()
  },

  watch: {
    estadisticas: {
      handler () {
        if (this.estadisticas) {
          this.createCharts()
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.estadisticas-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.chart-container {
  position: relative;
  height: 300px;
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

.opacity-75 {
  opacity: 0.75;
}

.progress {
  border-radius: 10px;
}

.progress-bar {
  border-radius: 10px;
}

.card {
  border: none;
  border-radius: 12px;
}

.card-header {
  border-radius: 12px 12px 0 0 !important;
  border-bottom: 1px solid rgba(255,255,255,0.125);
}

.list-group-item {
  border-left: none;
  border-right: none;
}

.list-group-item:first-child {
  border-top: none;
}

.list-group-item:last-child {
  border-bottom: none;
}

.table {
  margin-bottom: 0;
}

.table td, .table th {
  vertical-align: middle;
}
</style>
