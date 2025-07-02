<template>
  <div class="archivos-view">
    <div class="container-fluid p-4">
      <!-- Search and Filters -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header">
              <h6 class="m-0 font-weight-bold text-primary">
                <i class="fas fa-search me-2"></i>
                Búsqueda y Filtros
              </h6>
            </div>
            <div class="card-body">
              <!-- Search Bar -->
              <div class="row mb-3">
                <div class="col-md-8">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Buscar por nombre, descripción o tema..."
                      v-model="filtrosLocales.busqueda"
                      @keyup.enter="aplicarFiltros"
                    >
                    <button
                      class="btn btn-primary"
                      type="button"
                      @click="aplicarFiltros"
                    >
                      <i class="fas fa-search"></i>
                    </button>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="d-flex gap-2">
                    <button
                      class="btn btn-outline-secondary"
                      @click="limpiarFiltros"
                    >
                      <i class="fas fa-eraser me-1"></i>
                      Limpiar
                    </button>
                    <button
                      class="btn btn-outline-info"
                      @click="toggleFiltrosAvanzados"
                    >
                      <i class="fas fa-sliders-h me-1"></i>
                      Filtros
                    </button>
                  </div>
                </div>
              </div>

              <!-- Advanced Filters -->
              <div v-show="mostrarFiltrosAvanzados" class="border-top pt-3">
                <div class="row">
                  <div class="col-md-3 mb-3">
                    <label class="form-label">Tipo de Archivo</label>
                    <select
                      class="form-select"
                      v-model="filtrosLocales.tipo_archivo"
                      @change="aplicarFiltros"
                    >
                      <option value="">Todos</option>
                      <option
                        v-for="tipo in valoresFiltros.tipos_archivo"
                        :key="tipo"
                        :value="tipo"
                      >
                        {{ tipo }}
                      </option>
                    </select>
                  </div>

                  <div class="col-md-3 mb-3">
                    <label class="form-label">Tema</label>
                    <select
                      class="form-select"
                      v-model="filtrosLocales.tema"
                      @change="aplicarFiltros"
                    >
                      <option value="">Todos</option>
                      <option
                        v-for="tema in valoresFiltros.temas"
                        :key="tema"
                        :value="tema"
                      >
                        {{ tema }}
                      </option>
                    </select>
                  </div>

                  <div class="col-md-3 mb-3">
                    <label class="form-label">Entidad</label>
                    <select
                      class="form-select"
                      v-model="filtrosLocales.entidad"
                      @change="aplicarFiltros"
                    >
                      <option value="">Todas</option>
                      <option
                        v-for="entidad in valoresFiltros.entidades"
                        :key="entidad"
                        :value="entidad"
                      >
                        {{ entidad }}
                      </option>
                    </select>
                  </div>

                  <div class="col-md-3 mb-3">
                    <label class="form-label">Municipio</label>
                    <select
                      class="form-select"
                      v-model="filtrosLocales.municipio"
                      @change="aplicarFiltros"
                    >
                      <option value="">Todos</option>
                      <option
                        v-for="municipio in valoresFiltros.municipios"
                        :key="municipio"
                        :value="municipio"
                      >
                        {{ municipio }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h6 class="m-0 font-weight-bold text-primary">
                <i class="fas fa-folder-open me-2"></i>
                Catálogo de Archivos
              </h6>
              <div class="d-flex align-items-center">
                <span class="text-muted me-3">
                  {{ paginacion.total }} archivos encontrados
                </span>
                <div class="btn-group" role="group">
                  <button
                    type="button"
                    class="btn btn-sm"
                    :class="vistaActual === 'table' ? 'btn-primary' : 'btn-outline-primary'"
                    @click="vistaActual = 'table'"
                  >
                    <i class="fas fa-list"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm"
                    :class="vistaActual === 'cards' ? 'btn-primary' : 'btn-outline-primary'"
                    @click="vistaActual = 'cards'"
                  >
                    <i class="fas fa-th"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="card-body p-0">
              <!-- Loading -->
              <div v-if="loading" class="text-center p-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2 text-muted">Cargando archivos...</p>
              </div>

              <!-- Error -->
              <div v-else-if="error" class="alert alert-danger m-3">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <!-- No Results -->
              <div v-else-if="archivos.length === 0" class="text-center p-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No se encontraron archivos</h5>
                <p class="text-muted">Intenta ajustar los filtros de búsqueda</p>
              </div>

              <!-- Table View -->
              <div v-else-if="vistaActual === 'table'" class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Archivo</th>
                      <th>Tipo</th>
                      <th>Tema</th>
                      <th>Entidad</th>
                      <th>Actualizado</th>
                      <th>Tamaño</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="archivo in archivos" :key="archivo.id">
                      <td>
                        <div class="d-flex align-items-center">
                          <i :class="getFileIcon(archivo.tipo_archivo)" class="me-2"></i>
                          <div>
                            <div class="fw-bold">{{ archivo.nombre_archivo }}</div>
                            <small class="text-muted text-truncate" style="max-width: 300px;">
                              {{ archivo.descripcion || 'Sin descripción' }}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="badge bg-secondary">
                          {{ archivo.tipo_archivo || 'N/A' }}
                        </span>
                      </td>
                      <td>{{ archivo.tema || 'Sin tema' }}</td>
                      <td>{{ archivo.entidad || 'N/A' }}</td>
                      <td>{{ $moment(archivo.fecha_actualizacion).fromNow() }}</td>
                      <td>{{ formatFileSize(archivo.tamano_bytes) }}</td>
                      <td>
                        <div class="btn-group" role="group">
                          <router-link
                            :to="{ name: 'DetalleArchivo', params: { id: archivo.id } }"
                            class="btn btn-sm btn-outline-primary"
                            title="Ver detalles"
                          >
                            <i class="fas fa-eye"></i>
                          </router-link>
                          <button
                            class="btn btn-sm btn-outline-success"
                            @click="descargarArchivo(archivo)"
                            title="Descargar"
                          >
                            <i class="fas fa-download"></i>
                          </button>
                          <button
                            v-if="esArchivoGeo(archivo)"
                            class="btn btn-sm btn-outline-info"
                            @click="verEnMapa(archivo)"
                            title="Ver en mapa"
                          >
                            <i class="fas fa-map"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Cards View -->
              <div v-else class="p-3">
                <div class="row">
                  <div
                    v-for="archivo in archivos"
                    :key="archivo.id"
                    class="col-lg-4 col-md-6 mb-4"
                  >
                    <div class="card h-100 border-0 shadow-sm archivo-card">
                      <div class="card-body">
                        <div class="d-flex align-items-start mb-3">
                          <i :class="getFileIcon(archivo.tipo_archivo)" class="fa-2x me-3"></i>
                          <div class="flex-fill">
                            <h6 class="card-title mb-1">{{ archivo.nombre_archivo }}</h6>
                            <span class="badge bg-secondary">{{ archivo.tipo_archivo || 'N/A' }}</span>
                          </div>
                        </div>

                        <p class="card-text text-muted small text-truncate-3">
                          {{ archivo.descripcion || 'Sin descripción disponible' }}
                        </p>

                        <div class="row text-center small text-muted mb-3">
                          <div class="col-4">
                            <div>{{ archivo.tema || 'Sin tema' }}</div>
                            <small>Tema</small>
                          </div>
                          <div class="col-4">
                            <div>{{ formatFileSize(archivo.tamano_bytes) }}</div>
                            <small>Tamaño</small>
                          </div>
                          <div class="col-4">
                            <div>{{ $moment(archivo.fecha_actualizacion).format('DD/MM/YY') }}</div>
                            <small>Actualizado</small>
                          </div>
                        </div>
                      </div>

                      <div class="card-footer bg-transparent border-top-0">
                        <div class="d-flex gap-2">
                          <router-link
                            :to="{ name: 'DetalleArchivo', params: { id: archivo.id } }"
                            class="btn btn-sm btn-primary flex-fill"
                          >
                            <i class="fas fa-eye me-1"></i>
                            Ver
                          </router-link>
                          <button
                            class="btn btn-sm btn-success"
                            @click="descargarArchivo(archivo)"
                          >
                            <i class="fas fa-download"></i>
                          </button>
                          <button
                            v-if="esArchivoGeo(archivo)"
                            class="btn btn-sm btn-info"
                            @click="verEnMapa(archivo)"
                          >
                            <i class="fas fa-map"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="paginacion.total_paginas > 1" class="card-footer">
              <nav>
                <ul class="pagination justify-content-center mb-0">
                  <li class="page-item" :class="{ disabled: paginacion.pagina === 1 }">
                    <button
                      class="page-link"
                      @click="cambiarPagina(paginacion.pagina - 1)"
                      :disabled="paginacion.pagina === 1"
                    >
                      <i class="fas fa-chevron-left"></i>
                    </button>
                  </li>

                  <li
                    v-for="pagina in paginasVisibles"
                    :key="pagina"
                    class="page-item"
                    :class="{ active: pagina === paginacion.pagina }"
                  >
                    <button
                      class="page-link"
                      @click="cambiarPagina(pagina)"
                    >
                      {{ pagina }}
                    </button>
                  </li>

                  <li class="page-item" :class="{ disabled: paginacion.pagina === paginacion.total_paginas }">
                    <button
                      class="page-link"
                      @click="cambiarPagina(paginacion.pagina + 1)"
                      :disabled="paginacion.pagina === paginacion.total_paginas"
                    >
                      <i class="fas fa-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
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
  name: 'ArchivosView',

  data () {
    return {
      filtrosLocales: {
        busqueda: '',
        tipo_archivo: '',
        tema: '',
        entidad: '',
        municipio: '',
        territorio: '',
        responsable: '',
        nivel_validacion: ''
      },
      mostrarFiltrosAvanzados: false,
      vistaActual: 'table' // 'table' o 'cards'
    }
  },

  computed: {
    ...mapState('archivos', [
      'archivos',
      'paginacion',
      'valoresFiltros',
      'loading',
      'error'
    ]),

    paginasVisibles () {
      const total = this.paginacion.total_paginas
      const actual = this.paginacion.pagina
      const paginas = []

      const inicio = Math.max(1, actual - 2)
      const fin = Math.min(total, actual + 2)

      for (let i = inicio; i <= fin; i++) {
        paginas.push(i)
      }

      return paginas
    }
  },

  methods: {
    ...mapActions('archivos', [
      'cargarArchivos',
      'cargarValoresFiltros',
      'aplicarFiltros as aplicarFiltrosStore',
      'cambiarPagina as cambiarPaginaStore',
      'limpiarFiltros as limpiarFiltrosStore'
    ]),

    async aplicarFiltros () {
      await this.aplicarFiltrosStore(this.filtrosLocales)
    },

    async limpiarFiltros () {
      this.filtrosLocales = {
        busqueda: '',
        tipo_archivo: '',
        tema: '',
        entidad: '',
        municipio: '',
        territorio: '',
        responsable: '',
        nivel_validacion: ''
      }
      await this.limpiarFiltrosStore()
    },

    async cambiarPagina (pagina) {
      if (pagina >= 1 && pagina <= this.paginacion.total_paginas) {
        await this.cambiarPaginaStore(pagina)
      }
    },

    toggleFiltrosAvanzados () {
      this.mostrarFiltrosAvanzados = !this.mostrarFiltrosAvanzados
    },

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

    formatFileSize (bytes) {
      if (!bytes) return 'N/A'

      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      if (bytes === 0) return '0 Bytes'

      const i = Math.floor(Math.log(bytes) / Math.log(1024))
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
    },

    esArchivoGeo (archivo) {
      const tipo = archivo.tipo_archivo || ''
      return tipo.toLowerCase().includes('shp') ||
             tipo.toLowerCase().includes('geojson') ||
             tipo.toLowerCase().includes('kml')
    },

    descargarArchivo (archivo) {
      // Implementar descarga
      console.log('Descargar archivo:', archivo)
      // window.open(archivo.ruta_archivo)
    },

    verEnMapa (archivo) {
      this.$router.push({
        name: 'Mapa',
        query: { archivo: archivo.id }
      })
    }
  },

  async mounted () {
    await Promise.all([
      this.cargarArchivos(),
      this.cargarValoresFiltros()
    ])
  }
}
</script>

<style scoped>
.archivos-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.archivo-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.archivo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
}

.btn-group .btn {
  border-radius: 0;
}

.btn-group .btn:first-child {
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
}

.btn-group .btn:last-child {
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.table td {
  vertical-align: middle;
}

.pagination .page-link {
  border-radius: 0.375rem;
  margin: 0 2px;
  border: 1px solid #dee2e6;
}

.pagination .page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}

.card {
  border-radius: 12px;
}

.card-header {
  border-radius: 12px 12px 0 0 !important;
}
</style>
