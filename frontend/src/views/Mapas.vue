<template>
  <div class="grid">
    <!-- Panel de capas -->
    <div class="col-12 lg:col-3">
      <div class="card">
        <h3>Capas disponibles</h3>
        <div class="field-checkbox" v-for="archivo in archivosShp" :key="archivo.id">
          <Checkbox :v-model="capasActivas[archivo.id]" :binary="true" @change="toggleCapa(archivo)" />
          <label>{{ archivo.nombre_archivo }}</label>
        </div>
      </div>
    </div>

    <!-- Mapa -->
    <div class="col-12 lg:col-9">
      <div class="card">
        <div id="map" style="height: 600px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Checkbox from 'primevue/checkbox'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'Mapas',
  components: {
    Checkbox
  },
  setup() {
    const archivosShp = ref([])
    const capasActivas = ref({})
    let map = null

    const cargarArchivosShp = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/archivos', {
          params: {
            tipo_archivo: 'SHP'
          }
        })
        archivosShp.value = response.data
      } catch (error) {
        console.error('Error al cargar archivos SHP:', error)
      }
    }

    const inicializarMapa = () => {
      map = L.map('map').setView([20.7504, -87.4454], 7) // Centrado en la península de Yucatán

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)
    }

    const toggleCapa = async (archivo) => {
      // Implementar lógica para mostrar/ocultar capa SHP
      console.log('Toggle capa:', archivo.nombre_archivo)
    }

    onMounted(() => {
      cargarArchivosShp()
      inicializarMapa()
    })

    return {
      archivosShp,
      capasActivas,
      toggleCapa
    }
  }
}
</script>

<style scoped>
.field-checkbox {
  margin-bottom: 1rem;
}
</style>
