<template>
  <div class="grid">
    <!-- Información del archivo -->
    <div class="col-12 lg:col-8">
      <div class="card">
        <div class="flex align-items-center justify-content-between mb-4">
          <h2>{{ archivo.nombre_archivo }}</h2>
          <Button icon="pi pi-download" label="Descargar" @click="descargarArchivo" />
        </div>

        <div class="grid">
          <!-- Metadatos principales -->
          <div class="col-12 md:col-6">
            <h3>Información General</h3>
            <div class="field">
              <label>Tipo de archivo</label>
              <Tag :value="archivo.tipo_archivo" :severity="getTipoSeverity(archivo.tipo_archivo)" />
            </div>
            <div class="field">
              <label>Tema</label>
              <div>{{ archivo.tema }}</div>
            </div>
            <div class="field">
              <label>Última actualización</label>
              <div>{{ formatDate(archivo.fecha_actualizacion) }}</div>
            </div>
            <div class="field">
              <label>Tamaño</label>
              <div>{{ formatSize(archivo.tamano_bytes) }}</div>
            </div>
          </div>

          <!-- Metadatos adicionales -->
          <div class="col-12 md:col-6">
            <h3>Ubicación</h3>
            <div class="field">
              <label>Territorio</label>
              <div>{{ archivo.territorio }}</div>
            </div>
            <div class="field">
              <label>Entidad</label>
              <div>{{ archivo.entidad }}</div>
            </div>
            <div class="field">
              <label>Municipio</label>
              <div>{{ archivo.municipio }}</div>
            </div>
          </div>

          <!-- Descripción -->
          <div class="col-12">
            <h3>Descripción</h3>
            <div class="text-justify">{{ archivo.descripcion }}</div>
          </div>

          <!-- Etiquetas -->
          <div class="col-12 mt-3">
            <h3>Etiquetas</h3>
            <div class="flex flex-wrap gap-2">
              <Tag v-for="etiqueta in archivo.etiquetas" :key="etiqueta" :value="etiqueta" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel lateral -->
    <div class="col-12 lg:col-4">
      <!-- Estructura de campos -->
      <div class="card">
        <h3>Estructura de datos</h3>
        <DataTable :value="archivo.campos" responsiveLayout="scroll">
          <Column field="nombre_campo" header="Campo"></Column>
          <Column field="tipo_campo" header="Tipo"></Column>
          <Column field="descripcion" header="Descripción"></Column>
        </DataTable>
      </div>

      <!-- Información adicional -->
      <div class="card mt-3">
        <h3>Información adicional</h3>
        <div class="field">
          <label>Responsable</label>
          <div>{{ archivo.responsable }}</div>
        </div>
        <div class="field">
          <label>Fuente</label>
          <div>{{ archivo.fuente }}</div>
        </div>
        <div class="field">
          <label>Nivel de validación</label>
          <div>{{ archivo.nivel_validacion }}</div>
        </div>
        <div class="field">
          <label>Observaciones</label>
          <div class="text-justify">{{ archivo.observaciones }}</div>
        </div>
      </div>
    </div>

    <!-- Vista previa del archivo si es tipo SHP -->
    <div v-if="archivo.tipo_archivo === 'SHP'" class="col-12">
      <div class="card">
        <h3>Vista previa del mapa</h3>
        <div id="preview-map" style="height: 400px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

export default {
  name: 'DetalleArchivo',
  components: {
    DataTable,
    Column,
    Button,
    Tag
  },
  setup() {
    const route = useRoute()
    const archivo = ref({
      campos: []
    })

    const cargarArchivo = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/archivos/${route.params.id}`)
        archivo.value = response.data
      } catch (error) {
        console.error('Error al cargar archivo:', error)
      }
    }

    const getTipoSeverity = (tipo) => {
      switch (tipo) {
        case 'CSV': return 'info'
        case 'SHP': return 'success'
        case 'XLSX': return 'warning'
        default: return null
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('es-MX')
    }

    const formatSize = (bytes) => {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return '0 Byte'
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
    }

    const descargarArchivo = async () => {
      // Implementar lógica de descarga
      console.log('Descargando archivo:', archivo.value.nombre_archivo)
    }

    onMounted(() => {
      cargarArchivo()
    })

    return {
      archivo,
      getTipoSeverity,
      formatDate,
      formatSize,
      descargarArchivo
    }
  }
}
</script>

<style scoped>
.field {
  margin-bottom: 1rem;
}

.field label {
  font-weight: 600;
  color: var(--text-color-secondary);
  margin-bottom: 0.5rem;
  display: block;
}
</style>
