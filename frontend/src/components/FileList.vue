<template>
  <div>
    <h2>Catálogo de Archivos</h2>
    <el-table :data="archivos" v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="50" />
      <el-table-column prop="nombre_archivo" label="Nombre" />
      <el-table-column prop="descripcion" label="Descripción" />
      <el-table-column prop="tipo_archivo" label="Tipo" width="80"/>
      <el-table-column prop="fecha_actualizacion" label="Fecha actualización" width="180"/>
      <el-table-column prop="tamano_bytes" label="Tamaño (bytes)" width="120"/>
      <el-table-column label="Acciones" width="100">
        <template #default="scope">
          <el-button size="small" @click="verDetalle(scope.row)">Ver</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="showDetalle" title="Detalle de Archivo" width="50%">
      <pre v-if="detalle">{{ detalle }}</pre>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import 'element-plus/dist/index.css'
import { ElTable, ElTableColumn, ElButton, ElDialog } from 'element-plus'

const archivos = ref([])
const loading = ref(false)
const showDetalle = ref(false)
const detalle = ref(null)

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api'
})

const fetchArchivos = async () => {
  loading.value = true
  try {
    const res = await api.get('/archivos/')
    archivos.value = res.data
  } catch (e) {
    alert('Error cargando archivos')
  }
  loading.value = false
}

const verDetalle = async (archivo) => {
  try {
    const res = await api.get(`/archivos/${archivo.id}`)
    detalle.value = res.data
    showDetalle.value = true
  } catch (e) {
    alert('Error al obtener detalle')
  }
}

onMounted(fetchArchivos)
</script>
