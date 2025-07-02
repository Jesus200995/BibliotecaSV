<template>
  <div class="card">
    <!-- Filtros -->
    <div class="grid">
      <div class="col-12 mb-3">
        <span class="p-input-icon-left w-full">
          <i class="pi pi-search" />
          <InputText v-model="filters.search" placeholder="Buscar archivos..." class="w-full" />
        </span>
      </div>
      
      <div class="col-12 md:col-3">
        <Dropdown v-model="filters.tipo" :options="tiposArchivo" placeholder="Tipo de archivo" class="w-full" />
      </div>
      <div class="col-12 md:col-3">
        <Dropdown v-model="filters.tema" :options="temas" placeholder="Tema" class="w-full" />
      </div>
      <div class="col-12 md:col-3">
        <Dropdown v-model="filters.territorio" :options="territorios" placeholder="Territorio" class="w-full" />
      </div>
      <div class="col-12 md:col-3">
        <Button label="Limpiar filtros" icon="pi pi-times" class="p-button-outlined w-full" @click="limpiarFiltros" />
      </div>
    </div>

    <!-- Tabla de archivos -->
    <DataTable
      :value="archivos"
      :paginator="true"
      :rows="10"
      :loading="loading"
      responsiveLayout="scroll"
      class="mt-3"
    >
      <Column field="nombre_archivo" header="Nombre" sortable>
        <template #body="slotProps">
          <router-link :to="'/archivo/' + slotProps.data.id" class="text-primary">
            {{ slotProps.data.nombre_archivo }}
          </router-link>
        </template>
      </Column>
      <Column field="tipo_archivo" header="Tipo" sortable>
        <template #body="slotProps">
          <Tag :value="slotProps.data.tipo_archivo" :severity="getTipoSeverity(slotProps.data.tipo_archivo)" />
        </template>
      </Column>
      <Column field="tema" header="Tema" sortable />
      <Column field="territorio" header="Territorio" sortable />
      <Column field="fecha_actualizacion" header="Actualización" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.fecha_actualizacion) }}
        </template>
      </Column>
      <Column :exportable="false">
        <template #body="slotProps">
          <Button icon="pi pi-download" class="p-button-rounded p-button-text" @click="descargarArchivo(slotProps.data)" />
          <Button icon="pi pi-eye" class="p-button-rounded p-button-text" @click="verDetalles(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

export default {
  name: 'Archivos',
  components: {
    DataTable,
    Column,
    InputText,
    Dropdown,
    Button,
    Tag
  },
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const archivos = ref([])
    const filters = ref({
      search: '',
      tipo: null,
      tema: null,
      territorio: null
    })

    const tiposArchivo = ref([])
    const temas = ref([])
    const territorios = ref([])

    const cargarArchivos = async () => {
      loading.value = true
      try {
        const response = await axios.get('http://localhost:8000/api/v1/archivos', {
          params: {
            q: filters.value.search,
            tipo_archivo: filters.value.tipo,
            tema: filters.value.tema,
            territorio: filters.value.territorio
          }
        })
        archivos.value = response.data

        // Actualizar opciones de filtros
        tiposArchivo.value = [...new Set(archivos.value.map(a => a.tipo_archivo))].filter(Boolean)
        temas.value = [...new Set(archivos.value.map(a => a.tema))].filter(Boolean)
        territorios.value = [...new Set(archivos.value.map(a => a.territorio))].filter(Boolean)
      } catch (error) {
        console.error('Error al cargar archivos:', error)
      } finally {
        loading.value = false
      }
    }

    const limpiarFiltros = () => {
      filters.value = {
        search: '',
        tipo: null,
        tema: null,
        territorio: null
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

    const descargarArchivo = async (archivo) => {
      // Implementar lógica de descarga
      console.log('Descargando:', archivo.nombre_archivo)
    }

    const verDetalles = (archivo) => {
      router.push(`/archivo/${archivo.id}`)
    }

    watch(filters, () => {
      cargarArchivos()
    }, { deep: true })

    onMounted(() => {
      cargarArchivos()
    })

    return {
      loading,
      archivos,
      filters,
      tiposArchivo,
      temas,
      territorios,
      limpiarFiltros,
      getTipoSeverity,
      formatDate,
      descargarArchivo,
      verDetalles
    }
  }
}
</script>
