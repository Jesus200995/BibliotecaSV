<template>
  <!-- Contenedor principal con tarjeta moderna -->
  <div class="file-list-container">
    <!-- Header de la sección con estadísticas -->
    <div class="section-header animate__animated animate__fadeInDown">
      <div class="header-info">
        <h2 class="section-title">
          <el-icon class="title-icon" :size="24">
            <Folder />
          </el-icon>
          Catálogo de Archivos
        </h2>
        <p class="section-description">
          Gestión centralizada de documentos y archivos institucionales
        </p>
      </div>
      <div class="stats-container">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="20">
              <Document />
            </el-icon>
            <div>
              <div class="stat-number">{{ archivos.length }}</div>
              <div class="stat-label">Archivos</div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- Tabla moderna con animaciones y diseño responsivo -->
    <el-card class="table-card animate__animated animate__fadeInUp" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">Lista de Documentos</span>
          <el-button type="primary" :icon="Refresh" circle @click="fetchArchivos" 
                     :loading="loading" class="refresh-btn" />
        </div>
      </template>

      <!-- Tabla responsiva con hover effects -->
      <el-table 
        :data="archivos" 
        v-loading="loading" 
        style="width: 100%"
        class="modern-table"
        :default-sort="{prop: 'fecha_actualizacion', order: 'descending'}"
        @row-click="handleRowClick"
        stripe
        empty-text="No hay archivos disponibles"
      >
        <el-table-column prop="id" label="ID" width="70" align="center">
          <template #default="scope">
            <el-tag type="info" size="small" class="id-tag">
              #{{ scope.row.id }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="nombre_archivo" label="Nombre del Archivo" min-width="200">
          <template #default="scope">
            <div class="file-name-cell">
              <el-icon class="file-icon" :size="18">
                <Document />
              </el-icon>
              <span class="file-name">{{ scope.row.nombre_archivo }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="descripcion" label="Descripción" min-width="250" show-overflow-tooltip>
          <template #default="scope">
            <span class="description-text">
              {{ scope.row.descripcion || 'Sin descripción' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="tipo_archivo" label="Tipo" width="100" align="center">
          <template #default="scope">
            <el-tag :type="getFileTypeColor(scope.row.tipo_archivo)" size="small">
              {{ scope.row.tipo_archivo }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="fecha_actualizacion" label="Última Actualización" width="180" sortable>
          <template #default="scope">
            <div class="date-cell">
              <el-icon class="date-icon" :size="14">
                <Calendar />
              </el-icon>
              <span>{{ formatDate(scope.row.fecha_actualizacion) }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="tamano_bytes" label="Tamaño" width="120" sortable align="right">
          <template #default="scope">
            <span class="size-text">{{ formatFileSize(scope.row.tamano_bytes) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Acciones" width="120" align="center" fixed="right">
          <template #default="scope">
            <div class="action-buttons">
              <el-tooltip content="Ver detalles" placement="top">
                <el-button 
                  type="primary" 
                  :icon="View" 
                  size="small" 
                  circle 
                  @click.stop="verDetalle(scope.row)"
                  class="action-btn view-btn"
                />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Modal moderno para detalles del archivo -->
    <el-dialog 
      v-model="showDetalle" 
      title="Detalles del Archivo"
      width="80%"
      :close-on-click-modal="false"
      class="detail-dialog"
      align-center
    >
      <template #header>
        <div class="dialog-header">
          <el-icon class="dialog-icon" :size="24">
            <InfoFilled />
          </el-icon>
          <span class="dialog-title">Información Detallada del Archivo</span>
        </div>
      </template>

      <div v-if="detalle" class="detail-content">
        <!-- Información básica en tarjetas -->
        <div class="detail-grid">
          <el-card class="detail-card" shadow="hover">
            <template #header>
              <div class="detail-card-header">
                <el-icon :size="20"><Document /></el-icon>
                <span>Información General</span>
              </div>
            </template>
            <div class="detail-item">
              <span class="detail-label">ID:</span>
              <span class="detail-value">{{ detalle.id }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Nombre:</span>
              <span class="detail-value">{{ detalle.nombre_archivo }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tipo:</span>
              <el-tag :type="getFileTypeColor(detalle.tipo_archivo)">
                {{ detalle.tipo_archivo }}
              </el-tag>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tamaño:</span>
              <span class="detail-value">{{ formatFileSize(detalle.tamano_bytes) }}</span>
            </div>
          </el-card>

          <el-card class="detail-card" shadow="hover">
            <template #header>
              <div class="detail-card-header">
                <el-icon :size="20"><Calendar /></el-icon>
                <span>Fechas</span>
              </div>
            </template>
            <div class="detail-item">
              <span class="detail-label">Fecha de Actualización:</span>
              <span class="detail-value">{{ formatDate(detalle.fecha_actualizacion) }}</span>
            </div>
          </el-card>
        </div>

        <!-- Descripción completa -->
        <el-card class="detail-card description-card" shadow="hover" v-if="detalle.descripcion">
          <template #header>
            <div class="detail-card-header">
              <el-icon :size="20"><Reading /></el-icon>
              <span>Descripción</span>
            </div>
          </template>
          <p class="description-full">{{ detalle.descripcion }}</p>
        </el-card>

        <!-- Datos adicionales en formato JSON (si hay más información) -->
        <el-card class="detail-card" shadow="hover" v-if="hasAdditionalData">
          <template #header>
            <div class="detail-card-header">
              <el-icon :size="20"><DataBoard /></el-icon>
              <span>Datos Adicionales</span>
            </div>
          </template>
          <pre class="json-content">{{ JSON.stringify(detalle, null, 2) }}</pre>
        </el-card>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showDetalle = false" class="close-btn">
            <el-icon><Close /></el-icon>
            Cerrar
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import 'element-plus/dist/index.css'
import 'animate.css'
import { 
  ElTable, ElTableColumn, ElButton, ElDialog, ElCard, ElTag, 
  ElIcon, ElTooltip, ElLoading, ElNotification 
} from 'element-plus'
import {
  Document, Folder, View, Calendar, InfoFilled, 
  Refresh, Close, Reading, DataBoard
} from '@element-plus/icons-vue'

// Estado de la aplicación
const archivos = ref([])
const loading = ref(false)
const showDetalle = ref(false)
const detalle = ref(null)

// Configuración de la API
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api'
})

// Computed para verificar si hay datos adicionales
const hasAdditionalData = computed(() => {
  if (!detalle.value) return false
  const basicFields = ['id', 'nombre_archivo', 'tipo_archivo', 'tamano_bytes', 'fecha_actualizacion', 'descripcion']
  return Object.keys(detalle.value).some(key => !basicFields.includes(key))
})

// Función para obtener la lista de archivos
const fetchArchivos = async () => {
  loading.value = true
  try {
    const res = await api.get('/archivos/')
    archivos.value = res.data
  } catch (e) {
    console.error('Error cargando archivos:', e)
    ElNotification({
      title: 'Error',
      message: 'No se pudieron cargar los archivos',
      type: 'error',
      duration: 3000
    })
  }
  loading.value = false
}

// Función para ver el detalle de un archivo
const verDetalle = async (archivo) => {
  try {
    const res = await api.get(`/archivos/${archivo.id}`)
    detalle.value = res.data
    showDetalle.value = true
  } catch (e) {
    console.error('Error al obtener detalle:', e)
    ElNotification({
      title: 'Error',
      message: 'No se pudo obtener el detalle del archivo',
      type: 'error',
      duration: 3000
    })
  }
}

// Función para manejar el clic en una fila
const handleRowClick = (row) => {
  // Opcional: hacer algo cuando se hace clic en una fila
}

// Función para formatear el tamaño de archivo
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Función para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return 'No disponible'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Función para obtener el color del tipo de archivo
const getFileTypeColor = (tipo) => {
  const colors = {
    'pdf': 'danger',
    'doc': 'primary',
    'docx': 'primary',
    'xls': 'success',
    'xlsx': 'success',
    'txt': 'info',
    'jpg': 'warning',
    'jpeg': 'warning',
    'png': 'warning',
    'gif': 'warning'
  }
  return colors[tipo?.toLowerCase()] || 'info'
}

// Cargar datos al montar el componente
onMounted(fetchArchivos)
</script>

<style scoped>
/* Estilos principales del componente */
.file-list-container {
  width: 100%;
  max-width: 100%;
}

/* Header de la sección */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.header-info {
  flex: 1;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.title-icon {
  /* Icono dorado que contrasta bien con el fondo verde */
  color: #fbbf24;
}

.section-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin: 0;
  font-weight: 400;
}

.stats-container {
  display: flex;
  gap: 1rem;
}

.stat-card {
  min-width: 140px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-icon {
  /* Icono verde institucional para estadísticas */
  color: #3dbd6a;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  /* Número en verde oscuro institucional */
  color: #245946;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

/* Tarjeta de la tabla */
.table-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  animation-delay: 0.2s;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  /* Título en verde institucional oscuro */
  color: #245946;
}

.refresh-btn {
  /* Botón de actualizar con degradado verde institucional */
  background: linear-gradient(135deg, #3dbd6a, #2d8f5a);
  border: none;
  box-shadow: 0 4px 12px rgba(61, 189, 106, 0.3);
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(61, 189, 106, 0.4);
}

/* Estilos de la tabla */
.modern-table {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.el-table) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.el-table__header) {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
}

:deep(.el-table__header th) {
  background: transparent;
  color: #374151;
  font-weight: 600;
  border-bottom: 2px solid #e5e7eb;
  padding: 16px 12px;
}

:deep(.el-table__row) {
  transition: all 0.3s ease;
  cursor: pointer;
}

:deep(.el-table__row:hover) {
  background-color: #f8fafc !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

:deep(.el-table td) {
  border-bottom: 1px solid #f1f5f9;
  padding: 16px 12px;
}

/* Celdas específicas */
.file-name-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.file-icon {
  /* Icono de archivo en verde institucional */
  color: #3dbd6a;
}

.file-name {
  font-weight: 500;
  /* Nombre de archivo en verde oscuro */
  color: #245946;
}

.description-text {
  color: #64748b;
  line-height: 1.4;
}

.date-cell {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
}

.date-icon {
  color: #64748b;
}

.size-text {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.875rem;
  /* Tamaño en verde institucional más claro */
  color: #52c41a;
  font-weight: 500;
}

.id-tag {
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: 600;
}

/* Botones de acción */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.action-btn {
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.view-btn {
  /* Botón de ver con degradado verde-azul moderno */
  background: linear-gradient(135deg, #3dbd6a, #06b6d4);
  border: none;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Modal de detalles */
.detail-dialog {
  border-radius: 16px;
}

:deep(.el-dialog) {
  border-radius: 16px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 16px 16px 0 0;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dialog-icon {
  /* Icono del modal en verde institucional */
  color: #3dbd6a;
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  /* Título del modal en verde oscuro */
  color: #245946;
}

/* Contenido del modal */
.detail-content {
  padding: 1rem 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.detail-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.detail-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.detail-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  /* Header de tarjetas de detalle en verde institucional */
  color: #245946;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 500;
  color: #64748b;
}

.detail-value {
  font-weight: 600;
  color: #1e40af;
}

.description-card {
  grid-column: 1 / -1;
}

.description-full {
  margin: 0;
  color: #374151;
  line-height: 1.6;
  font-size: 1rem;
}

.json-content {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.875rem;
  color: #374151;
  overflow-x: auto;
  margin: 0;
}

/* Footer del modal */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0 0 0;
  border-top: 1px solid #e5e7eb;
}

.close-btn {
  background: #6b7280;
  border: none;
  color: white;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

/* Responsive design */
@media (max-width: 1024px) {
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .stats-container {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.75rem;
  }
  
  .section-description {
    font-size: 1rem;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  :deep(.el-dialog) {
    width: 95% !important;
    margin: 0 auto;
  }
  
  :deep(.el-table__fixed-right) {
    display: none;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.5rem;
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  :deep(.el-table) {
    font-size: 0.875rem;
  }
  
  :deep(.el-table td), :deep(.el-table th) {
    padding: 12px 8px;
  }
}

/* Animaciones personalizadas */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.table-card {
  animation: fadeInScale 0.6s ease-out;
}
</style>
