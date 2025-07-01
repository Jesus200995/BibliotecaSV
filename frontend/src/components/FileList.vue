<template>
  <!-- Contenedor responsivo del catálogo de archivos -->
  <div class="file-list-container">
    <!-- Header con estadísticas responsivas -->
    <div class="section-header animate__animated animate__fadeInDown">
      <div class="stats-grid">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="28">
              <Document />
            </el-icon>
            <div class="stat-info">
              <div class="stat-number">{{ archivos.length }}</div>
              <div class="stat-label">Total Archivos</div>
            </div>
          </div>
        </el-card>
        
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="28">
              <Folder />
            </el-icon>
            <div class="stat-info">
              <div class="stat-number">{{ getUniqueTypes() }}</div>
              <div class="stat-label">Tipos de Archivo</div>
            </div>
          </div>
        </el-card>
        
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="28">
              <Monitor />
            </el-icon>
            <div class="stat-info">
              <div class="stat-number">{{ getTotalSize() }}</div>
              <div class="stat-label">Tamaño Total</div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- Tabla moderna con scroll horizontal responsivo -->
    <el-card class="table-card animate__animated animate__fadeInUp" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="card-title-section">
            <h3 class="card-title">
              <el-icon :size="20">
                <List />
              </el-icon>
              Lista de Documentos
            </h3>
            <p class="card-subtitle">{{ archivos.length }} archivos encontrados</p>
          </div>
          <div class="card-actions">
            <el-button 
              type="primary" 
              :icon="Refresh" 
              circle 
              @click="fetchArchivos" 
              :loading="loading" 
              class="refresh-btn"
              size="default"
            />
          </div>
        </div>
      </template>

      <!-- Contenedor de tabla con scroll horizontal SOLO en la tabla -->
      <div class="table-container">
        <el-table 
          :data="archivos" 
          v-loading="loading" 
          class="responsive-table"
          :default-sort="{prop: 'fecha_actualizacion', order: 'descending'}"
          @row-click="handleRowClick"
          stripe
          empty-text="No hay archivos disponibles"
          :row-class-name="getRowClassName"
        >
          <!-- Columna ID - Oculta en móvil pequeño -->
          <el-table-column 
            prop="id" 
            label="ID" 
            width="80" 
            align="center"
            class-name="id-column"
          >
            <template #default="scope">
              <el-tag type="info" size="small" class="id-tag">
                #{{ scope.row.id }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- Columna Nombre - Siempre visible, ancho mínimo -->
          <el-table-column 
            prop="nombre_archivo" 
            label="Archivo" 
            min-width="200"
            class-name="file-name-column"
          >
            <template #default="scope">
              <div class="file-name-cell">
                <el-icon class="file-icon" :size="18">
                  <Document />
                </el-icon>
                <div class="file-info">
                  <span class="file-name">{{ scope.row.nombre_archivo }}</span>
                  <!-- Mostrar tipo en móvil como subtítulo -->
                  <span class="file-type-mobile">{{ scope.row.tipo_archivo }}</span>
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- Columna Descripción - Oculta en móvil -->
          <el-table-column 
            prop="descripcion" 
            label="Descripción" 
            min-width="250" 
            show-overflow-tooltip
            class-name="description-column"
          >
            <template #default="scope">
              <span class="description-text">
                {{ scope.row.descripcion || 'Sin descripción' }}
              </span>
            </template>
          </el-table-column>

          <!-- Columna Tipo - Oculta en móvil (se muestra en file-name) -->
          <el-table-column 
            prop="tipo_archivo" 
            label="Tipo" 
            width="100" 
            align="center"
            class-name="type-column"
          >
            <template #default="scope">
              <el-tag :type="getFileTypeColor(scope.row.tipo_archivo)" size="small">
                {{ scope.row.tipo_archivo }}
              </el-tag>
            </template>
          </el-table-column>

          <!-- Columna Fecha - Ancho reducido en móvil -->
          <el-table-column 
            prop="fecha_actualizacion" 
            label="Actualización" 
            width="160" 
            sortable
            class-name="date-column"
          >
            <template #default="scope">
              <div class="date-cell">
                <el-icon class="date-icon" :size="14">
                  <Calendar />
                </el-icon>
                <span class="date-text">{{ formatDate(scope.row.fecha_actualizacion) }}</span>
              </div>
            </template>
          </el-table-column>

          <!-- Columna Tamaño - Compacta en móvil -->
          <el-table-column 
            prop="tamano_bytes" 
            label="Tamaño" 
            width="100" 
            sortable 
            align="right"
            class-name="size-column"
          >
            <template #default="scope">
              <span class="size-text">{{ formatFileSize(scope.row.tamano_bytes) }}</span>
            </template>
          </el-table-column>

          <!-- Columna Acciones - Siempre fija a la derecha -->
          <el-table-column 
            label="Acciones" 
            width="80" 
            align="center" 
            fixed="right"
            class-name="actions-column"
          >
            <template #default="scope">
              <el-tooltip content="Ver detalles" placement="top">
                <el-button 
                  type="primary" 
                  :icon="View" 
                  size="small" 
                  circle 
                  @click.stop="verDetalle(scope.row)"
                  class="action-btn"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- Modal moderno para detalles del archivo -->
    <el-dialog 
      v-model="showDetalle" 
      title="Detalles del Archivo"
      width="90%"
      :close-on-click-modal="false"
      class="detail-dialog"
      align-center
      append-to-body
      :z-index="3000"
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
        <!-- Información básica en tarjetas responsivas -->
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
import { ref, onMounted } from 'vue'
import axios from 'axios'
import 'element-plus/dist/index.css'
import 'animate.css'
import { 
  ElTable, ElTableColumn, ElButton, ElDialog, ElCard, ElTag, 
  ElIcon, ElTooltip, ElLoading, ElNotification 
} from 'element-plus'
import {
  Document, Folder, View, Calendar, InfoFilled, Monitor, List,
  Refresh, Close, Reading
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

// Función para obtener tipos únicos de archivos
const getUniqueTypes = () => {
  const types = new Set(archivos.value.map(archivo => archivo.tipo_archivo))
  return types.size
}

// Función para obtener el tamaño total de archivos
const getTotalSize = () => {
  const total = archivos.value.reduce((sum, archivo) => sum + (archivo.tamano_bytes || 0), 0)
  return formatFileSize(total)
}

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
  // Opcional: resaltar fila seleccionada
}

// Función para clases de fila responsivas
const getRowClassName = ({ rowIndex }) => {
  return 'table-row'
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
    day: 'numeric'
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

// Cargar archivos al montar el componente
onMounted(() => {
  fetchArchivos()
})
</script>

<style scoped>
/* ====================================
   CONTENEDOR PRINCIPAL RESPONSIVO
   ==================================== */
.file-list-container {
  width: 100%;
  max-width: 100%;
  padding: 0;
}

/* ====================================
   HEADER CON ESTADÍSTICAS EN GRID
   ==================================== */
.section-header {
  margin-bottom: 2rem;
  animation-duration: 0.6s;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 0;
}

/* Tarjetas de estadísticas */
.stat-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 20px rgba(36, 89, 70, 0.15);
  transition: all 0.3s ease;
  background: #fff;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(36, 89, 70, 0.2);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
}

.stat-icon {
  color: #245946;
  background: linear-gradient(135deg, #6ee7b7, #3dbd6a);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding: 0.5rem;
  background-color: rgba(110, 231, 183, 0.1);
  border-radius: 10px;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #245946;
  margin: 0;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;
  font-weight: 500;
}

/* ====================================
   TARJETA DE TABLA RESPONSIVA
   ==================================== */
.table-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: #fff;
  animation-duration: 0.8s;
  overflow: hidden;
}

/* Header de la tarjeta */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  gap: 1rem;
}

.card-title-section {
  flex: 1;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #245946;
  margin: 0 0 0.25rem 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.refresh-btn {
  background: linear-gradient(135deg, #245946, #2d8f5a);
  border: none;
  box-shadow: 0 4px 12px rgba(36, 89, 70, 0.3);
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(36, 89, 70, 0.4);
}

/* ====================================
   CONTENEDOR DE TABLA CON SCROLL HORIZONTAL
   ==================================== */
.table-container {
  /* Solo la tabla tiene scroll horizontal, nunca el body/html */
  overflow-x: auto;
  border-radius: 8px;
}

/* Tabla responsiva personalizada */
.responsive-table {
  width: 100%;
  min-width: 800px; /* Ancho mínimo para mantener legibilidad */
}

/* ====================================
   CELDAS Y CONTENIDO DE TABLA
   ==================================== */
/* Celda del nombre de archivo */
.file-name-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.file-icon {
  color: #245946;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0; /* Permite que el texto se trunque */
}

.file-name {
  font-weight: 600;
  color: #1e293b;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-type-mobile {
  display: none; /* Se muestra solo en móvil */
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
}

/* Celda de fecha */
.date-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-icon {
  color: #64748b;
  flex-shrink: 0;
}

.date-text {
  font-size: 0.875rem;
  color: #475569;
}

/* Celda de tamaño */
.size-text {
  font-weight: 500;
  color: #475569;
  font-size: 0.875rem;
}

/* Celda de descripción */
.description-text {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.4;
}

/* Tags de ID */
.id-tag {
  font-weight: 600;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

/* Botón de acción */
.action-btn {
  background: linear-gradient(135deg, #245946, #2d8f5a);
  border: none;
  box-shadow: 0 2px 8px rgba(36, 89, 70, 0.3);
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(36, 89, 70, 0.4);
}

/* ====================================
   MODAL DE DETALLES RESPONSIVO
   ==================================== */
.detail-dialog {
  border-radius: 16px;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #245946;
}

.dialog-icon {
  color: #6ee7b7;
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
}

/* Grid de detalles */
.detail-content {
  padding: 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.detail-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.detail-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #245946;
  font-weight: 600;
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
  margin-right: 1rem;
}

.detail-value {
  font-weight: 600;
  color: #1e293b;
  text-align: right;
}

.description-full {
  margin: 0;
  line-height: 1.6;
  color: #475569;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
}

.close-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* ====================================
   RESPONSIVO - TABLET (≤900px)
   ==================================== */
@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
  }
  
  .table-container {
    /* En tablet, mantener scroll horizontal */
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .card-actions {
    align-self: flex-end;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* ====================================
   RESPONSIVO - MÓVIL (≤600px)
   ==================================== */
@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stat-content {
    padding: 1rem;
  }
  
  .stat-number {
    font-size: 1.75rem;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .card-subtitle {
    font-size: 0.8rem;
  }
  
  /* Ocultar columnas menos importantes en móvil */
  .responsive-table :deep(.id-column),
  .responsive-table :deep(.description-column),
  .responsive-table :deep(.type-column) {
    display: none;
  }
  
  /* Mostrar tipo de archivo bajo el nombre en móvil */
  .file-type-mobile {
    display: block;
  }
  
  /* Ajustar anchos de columnas en móvil */
  .responsive-table :deep(.file-name-column) {
    min-width: 180px;
  }
  
  .responsive-table :deep(.date-column) {
    width: 120px;
    min-width: 120px;
  }
  
  .responsive-table :deep(.size-column) {
    width: 80px;
    min-width: 80px;
  }
  
  .responsive-table :deep(.actions-column) {
    width: 60px;
    min-width: 60px;
  }
  
  /* Compactar fecha en móvil */
  .date-text {
    font-size: 0.75rem;
  }
  
  /* Compactar tamaño en móvil */
  .size-text {
    font-size: 0.75rem;
  }
  
  /* Modal de detalles más compacto */
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 1rem 0;
  }
  
  .detail-value {
    text-align: left;
  }
}

/* ====================================
   RESPONSIVO - MÓVIL PEQUEÑO (≤480px)
   ==================================== */
@media (max-width: 480px) {
  .section-header {
    margin-bottom: 1.5rem;
  }
  
  .stats-grid {
    gap: 0.75rem;
  }
  
  .stat-content {
    padding: 0.75rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .table-container {
    /* En móvil pequeño, permitir scroll muy suave */
    scrollbar-width: thin;
  }
  
  .table-container::-webkit-scrollbar {
    height: 4px;
  }
  
  .table-container::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 2px;
  }
  
  .table-container::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
  }
  
  .table-container::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  
  /* Tabla aún más compacta */
  .responsive-table :deep(.file-name-column) {
    min-width: 140px;
  }
  
  .responsive-table :deep(.date-column) {
    width: 100px;
    min-width: 100px;
  }
  
  .responsive-table :deep(.size-column) {
    width: 70px;
    min-width: 70px;
  }
  
  .file-name {
    font-size: 0.875rem;
  }
  
  .file-type-mobile {
    font-size: 0.7rem;
  }
  
  .date-text {
    font-size: 0.7rem;
  }
  
  .size-text {
    font-size: 0.7rem;
  }
}

/* ====================================
   ANIMACIONES Y TRANSICIONES
   ==================================== */
.table-row {
  transition: all 0.2s ease;
}

.table-row:hover {
  background-color: rgba(110, 231, 183, 0.05);
}

/* ====================================
   UTILIDADES PARA ACCESIBILIDAD
   ==================================== */
@media (prefers-reduced-motion: reduce) {
  .stat-card,
  .refresh-btn,
  .action-btn {
    transition: none;
  }
  
  .stat-card:hover,
  .refresh-btn:hover,
  .action-btn:hover {
    transform: none;
  }
}

/* Focus visible para navegación por teclado */
.action-btn:focus-visible,
.refresh-btn:focus-visible {
  outline: 2px solid #6ee7b7;
  outline-offset: 2px;
}
</style>
