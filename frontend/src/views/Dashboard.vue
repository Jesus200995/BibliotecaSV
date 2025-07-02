<template>
  <div class="grid">
    <!-- Resumen de archivos -->
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Total Archivos</span>
            <div class="text-900 font-medium text-xl">{{ totalArchivos }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width:2.5rem;height:2.5rem">
            <i class="pi pi-file text-blue-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Tipos de archivos -->
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Tipos de Archivos</span>
            <div class="text-900 font-medium text-xl">{{ tiposArchivos }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width:2.5rem;height:2.5rem">
            <i class="pi pi-folder text-cyan-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Territorios -->
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Territorios</span>
            <div class="text-900 font-medium text-xl">{{ territorios }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width:2.5rem;height:2.5rem">
            <i class="pi pi-map-marker text-orange-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Temas -->
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Temas</span>
            <div class="text-900 font-medium text-xl">{{ temas }}</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width:2.5rem;height:2.5rem">
            <i class="pi pi-tag text-purple-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráfica de archivos por tipo -->
    <div class="col-12 lg:col-6">
      <div class="card">
        <h5>Archivos por Tipo</h5>
        <Chart type="pie" :data="archivosPorTipo" :options="chartOptions" />
      </div>
    </div>

    <!-- Últimos archivos actualizados -->
    <div class="col-12 lg:col-6">
      <div class="card">
        <h5>Últimas Actualizaciones</h5>
        <DataTable :value="ultimosArchivos" :rows="5" :paginator="true" responsiveLayout="scroll">
          <Column field="nombre_archivo" header="Nombre"></Column>
          <Column field="fecha_actualizacion" header="Actualizado"></Column>
          <Column field="tipo_archivo" header="Tipo"></Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Chart from 'primevue/chart'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import axios from 'axios'

export default {
  name: 'Dashboard',
  components: {
    Chart,
    DataTable,
    Column
  },
  setup() {
    const totalArchivos = ref(0)
    const tiposArchivos = ref(0)
    const territorios = ref(0)
    const temas = ref(0)
    const ultimosArchivos = ref([])

    const archivosPorTipo = ref({
      labels: ['CSV', 'SHP', 'XLSX', 'Otros'],
      datasets: [
        {
          data: [0, 0, 0, 0],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA']
        }
      ]
    })

    const chartOptions = {
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }

    onMounted(async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/archivos')
        const archivos = response.data

        totalArchivos.value = archivos.length
        tiposArchivos.value = new Set(archivos.map(a => a.tipo_archivo)).size
        territorios.value = new Set(archivos.map(a => a.territorio)).size
        temas.value = new Set(archivos.map(a => a.tema)).size

        // Ordenar por fecha y tomar los últimos 5
        ultimosArchivos.value = [...archivos]
          .sort((a, b) => new Date(b.fecha_actualizacion) - new Date(a.fecha_actualizacion))
          .slice(0, 5)

        // Actualizar datos del gráfico
        const tipos = archivos.reduce((acc, curr) => {
          acc[curr.tipo_archivo] = (acc[curr.tipo_archivo] || 0) + 1
          return acc
        }, {})

        archivosPorTipo.value.datasets[0].data = [
          tipos['CSV'] || 0,
          tipos['SHP'] || 0,
          tipos['XLSX'] || 0,
          Object.values(tipos).reduce((a, b) => a + b, 0) - (tipos['CSV'] || 0) - (tipos['SHP'] || 0) - (tipos['XLSX'] || 0)
        ]
      } catch (error) {
        console.error('Error al cargar datos:', error)
      }
    })

    return {
      totalArchivos,
      tiposArchivos,
      territorios,
      temas,
      ultimosArchivos,
      archivosPorTipo,
      chartOptions
    }
  }
}
</script>
