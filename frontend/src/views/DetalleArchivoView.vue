<template>
  <div class="detalle-archivo-view">
    <div class="container-fluid p-4" v-if="archivo">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <div class="d-flex align-items-center mb-2">
                    <i :class="getFileIcon(archivo.tipo_archivo)" class="fa-3x me-3"></i>
                    <div>
                      <h3 class="mb-1">{{ archivo.nombre_archivo }}</h3>
                      <div class="d-flex gap-2 flex-wrap">
                        <span class="badge bg-primary">{{ archivo.tipo_archivo || 'Sin tipo' }}</span>
                        <span v-if="archivo.tema" class="badge bg-success">{{ archivo.tema }}</span>
                        <span v-if="archivo.nivel_validacion" class="badge bg-info">{{ archivo.nivel_validacion }}</span>
                      </div>
                    </div>
                  </div>
                  <p class="text-muted mb-0">{{ archivo.descripcion || 'Sin descripción disponible' }}</p>
                </div>
                <div class="col-md-4 text-end">
                  <div class="btn-group" role="group">
                    <button class="btn btn-success" @click="descargarArchivo">
                      <i class="fas fa-download me-2"></i>
                      Descargar
                    </button>
                    <button
                      v-if="esArchivoGeo"
                      class="btn btn-info"
                      @click="verEnMapa"
                    >
                      <i class="fas fa-map me-2"></i>
                      Ver en Mapa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="row">
        <!-- Left Column: Details -->
        <div class="col-lg-8 mb-4">
          <!-- Metadata -->
          <div class="card shadow-sm mb-4">
            <div class="card-header">
              <h6 class="m-0 font-weight-bold text-primary">
                <i class="fas fa-info-circle me-2"></i>
                Información General
              </h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <table class="table table-borderless">
                    <tr>
                      <td class="fw-bold text-muted">Tipo de archivo:</td>
                      <td>{{ archivo.tipo_archivo || 'No especificado' }}</td>
                    </tr>
                    <tr>
                      <td class="fw-bold text-muted">Tamaño:</td>
                      <td>{{ formatFileSize(archivo.tamano_bytes) }}</td>
                    </tr>
                    <tr>
                      <td class="fw-bold text-muted">Última actualización:</td>
                      <td>{{ $moment(archivo.fecha_actualizacion).format('DD/MM/YYYY HH:mm') }}</td>
                    </tr>
                    <tr>
                      <td class="fw-bold text-muted">Tema:</td>
                      <td>{{ archivo.tema || 'Sin tema' }}</td>
                    </tr>
                  </table>
                </div>
                <div class="col-md-6">
                  <table class="table table-borderless">
                    <tr>
                      <td class="fw-bold text-muted">Entidad:</td>
                      <td>{{ archivo.entidad || 'No especificada' }}</td>
                    </tr>
                    <tr>
                      <td class="fw-bold text-muted">Municipio:</td>
                      <td>{{ archivo.municipio || 'No especificado' }}</td>
                    </tr>
                    <tr>
                      <td class="fw-bold text-muted">Territorio:</td>
                      <td>{{ archivo.territorio || 'No especificado' }}</td>
                    </tr>
                    <tr>
                      <td class="fw-bold text-muted">Responsable:</td>
                      <td>{{ archivo.responsable || 'No especificado' }}</td>
                    </tr>
                  </table>
                </div>
              </div>

              <div v-if="archivo.fuente" class="mt-3">
                <h6 class="text-muted">Fuente:</h6>
                <p>{{ archivo.fuente }}</p>
              </div>

              <div v-if="archivo.observaciones" class="mt-3">
                <h6 class="text-muted">Observaciones:</h6>
                <p>{{ archivo.observaciones }}</p>
              </div>

              <div v-if="archivo.etiquetas && archivo.etiquetas.length > 0" class="mt-3">
                <h6 class="text-muted">Etiquetas:</h6>
                <div class="d-flex gap-2 flex-wrap">
                  <span
                    v-for="etiqueta in archivo.etiquetas"
                    :key="etiqueta"
                    class="badge bg-secondary"
                  >
                    {{ etiqueta }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Fields Structure -->
          <div v-if="archivo.campos && archivo.campos.length > 0" class="card shadow-sm">
            <div class="card-header">
              <h6 class="m-0 font-weight-bold text-primary">
                <i class="fas fa-table me-2"></i>
                Estructura de Campos ({{ archivo.campos.length }} campos)
              </h6>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Campo</th>
                      <th>Tipo</th>
                      <th>Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="campo in archivo.campos" :key="campo.id">
                      <td class="fw-bold">{{ campo.nombre_campo }}</td>
                      <td>
                        <span class="badge bg-info">
                          {{ campo.tipo_campo || 'Sin tipo' }}
                        </span>
                      </td>
                      <td class="text-muted">
                        {{ campo.descripcion || 'Sin descripción' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Actions and Info -->
        <div class="col-lg-4">
          <!-- Quick Actions -->
          <div class="card shadow-sm mb-4">
            <div class="card-header">
              <h6 class="m-0 font-weight-bold text-primary">
                <i class="fas fa-bolt me-2"></i>
                Acciones Rápidas
              </h6>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button class="btn btn-success" @click="descargarArchivo">
                  <i class="fas fa-download me-2"></i>
                  Descargar Archivo
                </button>

                <button
                  v-if="esArchivoGeo"
                  class="btn btn-info"
                  @click="verEnMapa"
                >
                  <i class="fas fa-map me-2"></i>
                  Visualizar en Mapa
                </button>

                <button class="btn btn-outline-primary" @click="copiarEnlace">
                  <i class="fas fa-link me-2"></i>
                  Copiar Enlace
                </button>

                <button class="btn btn-outline-secondary" @click="reportarProblema">
                  <i class="fas fa-exclamation-triangle me-2"></i>
                  Reportar Problema
                </button>
              </div>
            </div>
          </div>

          <!-- File Preview -->
          <div class="card shadow-sm mb-4">
            <div class="card-header">
              <h6 class="m-0 font-weight-bold text-primary">
                <i class="fas fa-eye me-2"></i>
                Vista Previa
              </h6>
            </div>
            <div class="card-body text-center">
              <div class="file-preview-container">
                <i :class="getFileIcon(archivo.tipo_archivo)" class="display-1 mb-3"></i>
                <h6>{{ archivo.tipo_archivo || 'Archivo' }}</h6>
                <p class="text-muted small">
                  Vista previa no disponible para este tipo de archivo
                </p>
              </div>
            </div>
          </div>

          <!-- Related Files -->
          <div class="card shadow-sm">
            <div class="card-header">
              <h6 class="m-0 font-weight-bold text-primary">
                <i class="fas fa-sitemap me-2"></i>
                Archivos Relacionados
              </h6>
            </div>
            <div class="card-body">
              <p class="text-muted text-center">
                <i class="fas fa-search me-2"></i>
                Buscando archivos relacionados...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="text-center p-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3 text-muted">Cargando detalles del archivo...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container-fluid p-4">
      <div class="alert alert-danger">
        <h5>
          <i class="fas fa-exclamation-triangle me-2"></i>
          Error al cargar el archivo
        </h5>
        <p class="mb-0">{{ error }}</p>
        <hr>
        <router-link :to="{ name: 'Archivos' }" class="btn btn-outline-primary">
          <i class="fas fa-arrow-left me-2"></i>
          Volver al Catálogo
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'DetalleArchivoView',

  computed: {
    ...mapState('archivos', ['archivoActual as archivo', 'loading', 'error']),

    esArchivoGeo () {
      if (!this.archivo || !this.archivo.tipo_archivo) return false
      const tipo = this.archivo.tipo_archivo.toLowerCase()
      return tipo.includes('shp') || tipo.includes('geojson') || tipo.includes('kml')
    }
  },

  methods: {
    ...mapActions('archivos', ['cargarArchivoDetalle']),

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

    descargarArchivo () {
      console.log('Descargar archivo:', this.archivo)
      // Implementar descarga
    },

    verEnMapa () {
      this.$router.push({
        name: 'Mapa',
        query: { archivo: this.archivo.id }
      })
    },

    copiarEnlace () {
      const url = window.location.href
      navigator.clipboard.writeText(url).then(() => {
        // Mostrar notificación de éxito
        console.log('Enlace copiado')
      })
    },

    reportarProblema () {
      // Implementar reporte de problemas
      console.log('Reportar problema con archivo:', this.archivo.id)
    }
  },

  async mounted () {
    const id = this.$route.params.id
    if (id) {
      try {
        await this.cargarArchivoDetalle(parseInt(id))
      } catch (error) {
        console.error('Error cargando archivo:', error)
      }
    }
  },

  watch: {
    '$route.params.id' (newId) {
      if (newId) {
        this.cargarArchivoDetalle(parseInt(newId))
      }
    }
  }
}
</script>

<style scoped>
.detalle-archivo-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.file-preview-container {
  padding: 2rem;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.table-borderless td {
  border: none;
  padding: 0.5rem 0;
}

.card {
  border: none;
  border-radius: 12px;
}

.card-header {
  border-radius: 12px 12px 0 0 !important;
  border-bottom: 1px solid rgba(0,0,0,0.125);
}

.badge {
  font-size: 0.75em;
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
</style>
