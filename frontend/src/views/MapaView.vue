<template>
  <div class="mapa-view">
    <div class="container-fluid p-0 h-100">
      <div class="row h-100 g-0">
        <!-- Map Container -->
        <div class="col-lg-9 position-relative">
          <div id="map" class="w-100 h-100"></div>

          <!-- Map Controls -->
          <div class="map-controls position-absolute top-0 end-0 m-3">
            <div class="btn-group-vertical" role="group">
              <button class="btn btn-light btn-sm" @click="centrarMapa" title="Centrar mapa">
                <i class="fas fa-crosshairs"></i>
              </button>
              <button class="btn btn-light btn-sm" @click="toggleFullscreen" title="Pantalla completa">
                <i class="fas fa-expand"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar Panel -->
        <div class="col-lg-3 bg-white border-start">
          <div class="h-100 d-flex flex-column">
            <!-- Header -->
            <div class="p-3 border-bottom">
              <h6 class="mb-0 font-weight-bold text-primary">
                <i class="fas fa-map me-2"></i>
                Visor de Mapas
              </h6>
            </div>

            <!-- Layers Panel -->
            <div class="flex-fill overflow-auto">
              <div class="p-3">
                <!-- Base Layers -->
                <div class="mb-4">
                  <h6 class="text-muted mb-3">
                    <i class="fas fa-layer-group me-2"></i>
                    Mapas Base
                  </h6>
                  <div class="form-check mb-2">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="basemap"
                      id="osm"
                      value="osm"
                      v-model="mapaBase"
                      @change="cambiarMapaBase"
                    >
                    <label class="form-check-label" for="osm">
                      OpenStreetMap
                    </label>
                  </div>
                  <div class="form-check mb-2">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="basemap"
                      id="satellite"
                      value="satellite"
                      v-model="mapaBase"
                      @change="cambiarMapaBase"
                    >
                    <label class="form-check-label" for="satellite">
                      Satelital
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="basemap"
                      id="terrain"
                      value="terrain"
                      v-model="mapaBase"
                      @change="cambiarMapaBase"
                    >
                    <label class="form-check-label" for="terrain">
                      Terreno
                    </label>
                  </div>
                </div>

                <!-- Data Layers -->
                <div class="mb-4">
                  <h6 class="text-muted mb-3">
                    <i class="fas fa-file-alt me-2"></i>
                    Capas de Datos
                  </h6>

                  <div v-if="archivosGeo.length === 0" class="text-center text-muted">
                    <i class="fas fa-info-circle mb-2"></i>
                    <p class="small">No hay archivos geoespaciales disponibles</p>
                  </div>

                  <div v-else>
                    <div
                      v-for="archivo in archivosGeo"
                      :key="archivo.id"
                      class="card mb-3 border-0 shadow-sm"
                    >
                      <div class="card-body p-3">
                        <div class="d-flex align-items-start">
                          <div class="form-check me-2">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              :id="`layer-${archivo.id}`"
                              v-model="capasActivas"
                              :value="archivo.id"
                              @change="toggleCapa(archivo)"
                            >
                          </div>
                          <div class="flex-fill">
                            <label
                              :for="`layer-${archivo.id}`"
                              class="form-check-label fw-bold mb-1 d-block"
                            >
                              {{ archivo.nombre_archivo }}
                            </label>
                            <small class="text-muted d-block mb-2">
                              {{ archivo.descripcion || 'Sin descripción' }}
                            </small>
                            <div class="d-flex justify-content-between align-items-center">
                              <span class="badge bg-primary">{{ archivo.tipo_archivo }}</span>
                              <div class="btn-group" role="group">
                                <button
                                  class="btn btn-sm btn-outline-secondary"
                                  @click="zoomToLayer(archivo)"
                                  :disabled="!capasActivas.includes(archivo.id)"
                                  title="Zoom a capa"
                                >
                                  <i class="fas fa-search-plus"></i>
                                </button>
                                <router-link
                                  :to="{ name: 'DetalleArchivo', params: { id: archivo.id } }"
                                  class="btn btn-sm btn-outline-primary"
                                  title="Ver detalles"
                                >
                                  <i class="fas fa-info"></i>
                                </router-link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Legend -->
                <div v-if="capasActivas.length > 0" class="mb-4">
                  <h6 class="text-muted mb-3">
                    <i class="fas fa-list me-2"></i>
                    Leyenda
                  </h6>
                  <div class="card border-0 bg-light">
                    <div class="card-body p-3">
                      <div
                        v-for="capaId in capasActivas"
                        :key="capaId"
                        class="d-flex align-items-center mb-2"
                      >
                        <div
                          class="legend-color me-2"
                          :style="{ backgroundColor: getLayerColor(capaId) }"
                        ></div>
                        <small>{{ getLayerName(capaId) }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="p-3 border-top bg-light">
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">
                  {{ capasActivas.length }} capa(s) activa(s)
                </small>
                <div class="btn-group" role="group">
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    @click="limpiarCapas"
                    :disabled="capasActivas.length === 0"
                  >
                    <i class="fas fa-eraser"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-primary"
                    @click="cargarTodas"
                    :disabled="capasActivas.length === archivosGeo.length"
                  >
                    <i class="fas fa-layer-group"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="text-center">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="text-white">Cargando mapa...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import L from 'leaflet'

export default {
  name: 'MapaView',

  data () {
    return {
      map: null,
      mapaBase: 'osm',
      capasActivas: [],
      capasPorId: new Map(),
      loading: true,
      colores: [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
      ]
    }
  },

  computed: {
    ...mapState('archivos', ['archivos']),
    ...mapGetters('archivos', ['archivosGeo'])
  },

  methods: {
    ...mapActions('archivos', ['cargarArchivos']),

    initMap () {
      // Inicializar mapa con centro en México
      this.map = L.map('map').setView([23.6345, -102.5528], 6)

      // Agregar mapa base
      this.cambiarMapaBase()

      // Configurar eventos
      this.map.on('click', this.onMapClick)

      this.loading = false
    },

    cambiarMapaBase () {
      if (!this.map) return

      // Remover capas base existentes
      this.map.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
          this.map.removeLayer(layer)
        }
      })

      // Agregar nueva capa base
      let tileLayer
      switch (this.mapaBase) {
        case 'satellite':
          tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
          })
          break
        case 'terrain':
          tileLayer = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
          })
          break
        default: // osm
          tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          })
      }

      tileLayer.addTo(this.map)
    },

    toggleCapa (archivo) {
      const isActive = this.capasActivas.includes(archivo.id)

      if (isActive) {
        this.removerCapa(archivo.id)
      } else {
        this.agregarCapa(archivo)
      }
    },

    agregarCapa (archivo) {
      if (!this.map) return

      // Simular carga de datos geoespaciales
      // En producción, aquí se cargarían los datos reales del archivo
      const mockData = this.generateMockGeoData(archivo)

      const color = this.getLayerColor(archivo.id)

      const layer = L.geoJSON(mockData, {
        style: {
          color: color,
          weight: 2,
          opacity: 1,
          fillOpacity: 0.6
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties) {
            layer.bindPopup(this.createPopupContent(feature.properties, archivo))
          }
        }
      })

      layer.addTo(this.map)
      this.capasPorId.set(archivo.id, layer)

      if (!this.capasActivas.includes(archivo.id)) {
        this.capasActivas.push(archivo.id)
      }
    },

    removerCapa (archivoId) {
      const layer = this.capasPorId.get(archivoId)
      if (layer && this.map) {
        this.map.removeLayer(layer)
        this.capasPorId.delete(archivoId)
        this.capasActivas = this.capasActivas.filter(id => id !== archivoId)
      }
    },

    zoomToLayer (archivo) {
      const layer = this.capasPorId.get(archivo.id)
      if (layer && this.map) {
        this.map.fitBounds(layer.getBounds())
      }
    },

    getLayerColor (archivoId) {
      const index = this.archivosGeo.findIndex(a => a.id === archivoId)
      return this.colores[index % this.colores.length]
    },

    getLayerName (archivoId) {
      const archivo = this.archivosGeo.find(a => a.id === archivoId)
      return archivo ? archivo.nombre_archivo : 'Desconocido'
    },

    limpiarCapas () {
      this.capasActivas.forEach(id => this.removerCapa(id))
      this.capasActivas = []
    },

    cargarTodas () {
      this.archivosGeo.forEach(archivo => {
        if (!this.capasActivas.includes(archivo.id)) {
          this.agregarCapa(archivo)
        }
      })
    },

    centrarMapa () {
      if (this.map) {
        this.map.setView([23.6345, -102.5528], 6)
      }
    },

    toggleFullscreen () {
      const mapContainer = document.getElementById('map')
      if (mapContainer.requestFullscreen) {
        mapContainer.requestFullscreen()
      }
    },

    onMapClick (e) {
      console.log('Clicked at:', e.latlng)
    },

    createPopupContent (properties, archivo) {
      return `
        <div class="popup-content">
          <h6>${archivo.nombre_archivo}</h6>
          <p class="small text-muted">${archivo.descripcion || 'Sin descripción'}</p>
          <div class="mt-2">
            ${Object.entries(properties).map(([key, value]) =>
              `<small><strong>${key}:</strong> ${value}</small>`
            ).join('<br>')}
          </div>
        </div>
      `
    },

    generateMockGeoData (archivo) {
      // Generar datos geográficos simulados para demostración
      const features = []
      const baseCoords = [23.6345, -102.5528]

      for (let i = 0; i < 3; i++) {
        features.push({
          type: 'Feature',
          properties: {
            id: i + 1,
            nombre: `${archivo.tema || 'Area'} ${i + 1}`,
            tipo: archivo.tipo_archivo,
            archivo: archivo.nombre_archivo
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [baseCoords[1] + (Math.random() - 0.5) * 10, baseCoords[0] + (Math.random() - 0.5) * 10],
              [baseCoords[1] + (Math.random() - 0.5) * 10, baseCoords[0] + (Math.random() - 0.5) * 10],
              [baseCoords[1] + (Math.random() - 0.5) * 10, baseCoords[0] + (Math.random() - 0.5) * 10],
              [baseCoords[1] + (Math.random() - 0.5) * 10, baseCoords[0] + (Math.random() - 0.5) * 10]
            ]]
          }
        })
      }

      return {
        type: 'FeatureCollection',
        features
      }
    }
  },

  async mounted () {
    await this.cargarArchivos()

    this.$nextTick(() => {
      this.initMap()

      // Cargar archivo específico si viene en query
      const archivoId = this.$route.query.archivo
      if (archivoId) {
        const archivo = this.archivosGeo.find(a => a.id === parseInt(archivoId))
        if (archivo) {
          this.agregarCapa(archivo)
        }
      }
    })
  },

  beforeDestroy () {
    if (this.map) {
      this.map.remove()
    }
  }
}
</script>

<style scoped>
.mapa-view {
  height: 100vh;
  overflow: hidden;
}

#map {
  height: 100vh;
}

.map-controls {
  z-index: 1000;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  border: 1px solid #dee2e6;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.card {
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Leaflet custom styles */
:deep(.leaflet-popup-content) {
  margin: 8px;
}

:deep(.leaflet-popup-content h6) {
  margin-bottom: 4px;
  color: #007bff;
}
</style>
