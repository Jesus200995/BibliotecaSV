<template>
  <div class="upload-modal-container">
    <!-- Componente principal que reemplaza el placeholder de "Subir Archivos" -->
    <div class="upload-section">
      <el-card shadow="hover" class="upload-card">
        <template #header>
          <div class="card-header">
            <h3>Gestión de Archivos</h3>
            <p>Subir nuevos documentos al sistema de biblioteca</p>
          </div>
        </template>

        <div class="upload-actions">
          <el-button 
            type="primary" 
            size="large" 
            @click="openUploadModal"
            :icon="Upload"
            class="upload-button"
          >
            Subir Nuevo Archivo
          </el-button>
          
          <div class="upload-info">
            <p>Tipos de archivo permitidos: CSV, XLSX, SHP, GeoJSON, JSON, XML, PDF, DOC, DOCX</p>
            <p>Tamaño máximo: {{ maxFileSizeMB }}MB</p>
          </div>
        </div>
      </el-card>

      <!-- Lista de archivos recientes (opcional) -->
      <el-card shadow="hover" class="recent-files-card" style="margin-top: 20px;">
        <template #header>
          <h4>Archivos Subidos Recientemente</h4>
        </template>
        
        <div v-if="recentFiles.length === 0" class="no-files">
          <p>No hay archivos subidos recientemente</p>
        </div>
        
        <div v-else class="recent-files-list">
          <div 
            v-for="file in recentFiles" 
            :key="file.id" 
            class="recent-file-item"
          >
            <el-icon class="file-icon"><Document /></el-icon>
            <div class="file-info">
              <span class="file-name">{{ file.nombre_archivo }}</span>
              <span class="file-meta">{{ formatFileSize(file.tamano_bytes) }} - {{ formatDate(file.fecha_actualizacion) }}</span>
            </div>
            <el-tag size="small" :type="getValidationTagType(file.nivel_validacion)">
              {{ file.nivel_validacion }}
            </el-tag>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Modal para subir archivos -->
    <el-dialog 
      v-model="uploadModalVisible" 
      title="Subir Nuevo Archivo"
      width="90%"
      max-width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal="true"
      :append-to-body="true"
      :lock-scroll="true"
      :z-index="3000"
      class="upload-dialog"
      destroy-on-close
      center
    >
      <el-form 
        ref="uploadFormRef"
        :model="uploadForm" 
        :rules="uploadRules"
        label-width="140px"
        class="upload-form"
      >
        <!-- Selector de archivo -->
        <el-form-item label="Archivo" prop="file" class="file-upload-item">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :limit="1"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :before-upload="validateFile"
            drag
            class="upload-dragger"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              Arrastra el archivo aquí o <em>haz clic para seleccionar</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                Archivos permitidos: {{ allowedExtensions.join(', ') }}<br>
                Tamaño máximo: {{ maxFileSizeMB }}MB
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <!-- Información básica del archivo -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Nombre" prop="nombre_archivo">
              <el-input 
                v-model="uploadForm.nombre_archivo" 
                placeholder="Nombre descriptivo del archivo"
                maxlength="255"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Tema" prop="tema">
              <el-select 
                v-model="uploadForm.tema" 
                placeholder="Seleccionar tema"
                clearable
                filterable
                allow-create
              >
                <el-option 
                  v-for="tema in temasDisponibles" 
                  :key="tema" 
                  :label="tema" 
                  :value="tema"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Descripción" prop="descripcion">
          <el-input 
            v-model="uploadForm.descripcion" 
            type="textarea" 
            :rows="3"
            placeholder="Descripción detallada del contenido del archivo"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>

        <!-- Información geográfica y administrativa -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Entidad">
              <el-input 
                v-model="uploadForm.entidad" 
                placeholder="Entidad responsable"
                maxlength="100"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Municipio">
              <el-input 
                v-model="uploadForm.municipio" 
                placeholder="Municipio"
                maxlength="100"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Territorio">
              <el-input 
                v-model="uploadForm.territorio" 
                placeholder="Territorio"
                maxlength="100"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Información de validación y responsabilidad -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Responsable" prop="responsable">
              <el-input 
                v-model="uploadForm.responsable" 
                placeholder="Nombre del responsable"
                maxlength="100"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Nivel de Validación" prop="nivel_validacion">
              <el-select 
                v-model="uploadForm.nivel_validacion" 
                placeholder="Seleccionar nivel"
              >
                <el-option 
                  v-for="nivel in nivelesValidacion" 
                  :key="nivel" 
                  :label="nivel" 
                  :value="nivel"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Fuente">
          <el-input 
            v-model="uploadForm.fuente" 
            placeholder="Fuente de los datos"
            maxlength="255"
          />
        </el-form-item>

        <!-- Etiquetas -->
        <el-form-item label="Etiquetas">
          <div class="tags-input-container">
            <el-tag
              v-for="tag in uploadForm.etiquetas"
              :key="tag"
              closable
              @close="removeTag(tag)"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="inputRef"
              v-model="inputValue"
              size="small"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
              class="tag-input"
            />
            <el-button 
              v-else 
              size="small" 
              @click="showInput"
              class="add-tag-button"
            >
              + Nueva Etiqueta
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="Observaciones">
          <el-input 
            v-model="uploadForm.observaciones" 
            type="textarea" 
            :rows="3"
            placeholder="Observaciones adicionales"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelUpload" :disabled="uploading">
            Cancelar
          </el-button>
          <el-button 
            type="primary" 
            @click="submitUpload"
            :loading="uploading"
            :disabled="!uploadForm.file"
          >
            {{ uploading ? 'Subiendo...' : 'Subir Archivo' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, UploadFilled, Document } from '@element-plus/icons-vue'

// Referencias reactivas
const uploadModalVisible = ref(false)
const uploading = ref(false)
const uploadFormRef = ref()
const uploadRef = ref()
const inputRef = ref()
const inputVisible = ref(false)
const inputValue = ref('')

// Configuración
const maxFileSizeMB = ref(50)
const allowedExtensions = ref(['.csv', '.xlsx', '.xls', '.shp', '.geojson', '.json', '.xml', '.pdf', '.doc', '.docx'])
const temasDisponibles = ref([])
const nivelesValidacion = ref([])
const recentFiles = ref([])

// Formulario de subida
const uploadForm = reactive({
  file: null,
  nombre_archivo: '',
  descripcion: '',
  tema: '',
  entidad: '',
  municipio: '',
  territorio: '',
  responsable: 'jesus', // Usuario por defecto
  fuente: '',
  nivel_validacion: 'Borrador',
  observaciones: '',
  etiquetas: []
})

// Reglas de validación
const uploadRules = {
  file: [
    { required: true, message: 'Por favor selecciona un archivo', trigger: 'change' }
  ],
  nombre_archivo: [
    { required: true, message: 'El nombre del archivo es requerido', trigger: 'blur' },
    { min: 3, max: 255, message: 'El nombre debe tener entre 3 y 255 caracteres', trigger: 'blur' }
  ],
  responsable: [
    { required: true, message: 'El responsable es requerido', trigger: 'blur' }
  ],
  nivel_validacion: [
    { required: true, message: 'El nivel de validación es requerido', trigger: 'change' }
  ]
}

// Métodos
const openUploadModal = () => {
  uploadModalVisible.value = true
  resetForm()
}

const resetForm = () => {
  if (uploadFormRef.value) {
    uploadFormRef.value.resetFields()
  }
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
  uploadForm.file = null
  uploadForm.nombre_archivo = ''
  uploadForm.descripcion = ''
  uploadForm.tema = ''
  uploadForm.entidad = ''
  uploadForm.municipio = ''
  uploadForm.territorio = ''
  uploadForm.responsable = 'jesus'
  uploadForm.fuente = ''
  uploadForm.nivel_validacion = 'Borrador'
  uploadForm.observaciones = ''
  uploadForm.etiquetas = []
}

const handleFileChange = (file) => {
  uploadForm.file = file.raw
  // Auto-rellenar nombre del archivo si está vacío
  if (!uploadForm.nombre_archivo) {
    uploadForm.nombre_archivo = file.name
  }
}

const handleFileRemove = () => {
  uploadForm.file = null
}

const validateFile = (file) => {
  const isValidType = allowedExtensions.value.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  )
  
  if (!isValidType) {
    ElMessage.error(`Tipo de archivo no permitido. Solo se permiten: ${allowedExtensions.value.join(', ')}`)
    return false
  }

  const isValidSize = file.size / 1024 / 1024 < maxFileSizeMB.value
  if (!isValidSize) {
    ElMessage.error(`El archivo es demasiado grande. Máximo ${maxFileSizeMB.value}MB`)
    return false
  }

  return true
}

const submitUpload = async () => {
  if (!uploadFormRef.value) return

  try {
    await uploadFormRef.value.validate()
    
    uploading.value = true
    
    const formData = new FormData()
    formData.append('file', uploadForm.file)
    formData.append('nombre_archivo', uploadForm.nombre_archivo)
    formData.append('descripcion', uploadForm.descripcion || '')
    formData.append('tema', uploadForm.tema || '')
    formData.append('entidad', uploadForm.entidad || '')
    formData.append('municipio', uploadForm.municipio || '')
    formData.append('territorio', uploadForm.territorio || '')
    formData.append('responsable', uploadForm.responsable)
    formData.append('fuente', uploadForm.fuente || '')
    formData.append('nivel_validacion', uploadForm.nivel_validacion)
    formData.append('observaciones', uploadForm.observaciones || '')
    
    if (uploadForm.etiquetas.length > 0) {
      formData.append('etiquetas', JSON.stringify(uploadForm.etiquetas))
    }

    const response = await fetch('http://localhost:8000/api/archivos/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Error al subir el archivo')
    }

    const result = await response.json()
    
    ElMessage.success('Archivo subido exitosamente')
    uploadModalVisible.value = false
    
    // Actualizar lista de archivos recientes
    await loadRecentFiles()
    
  } catch (error) {
    console.error('Error al subir archivo:', error)
    ElMessage.error(error.message || 'Error al subir el archivo')
  } finally {
    uploading.value = false
  }
}

const cancelUpload = async () => {
  if (uploading.value) {
    try {
      await ElMessageBox.confirm(
        'Hay una subida en progreso. ¿Estás seguro de que quieres cancelar?',
        'Confirmar cancelación',
        {
          confirmButtonText: 'Sí, cancelar',
          cancelButtonText: 'No, continuar',
          type: 'warning'
        }
      )
    } catch {
      return // Usuario decidió no cancelar
    }
  }
  
  uploadModalVisible.value = false
  resetForm()
}

// Manejo de etiquetas
const removeTag = (tag) => {
  const index = uploadForm.etiquetas.indexOf(tag)
  if (index > -1) {
    uploadForm.etiquetas.splice(index, 1)
  }
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value && !uploadForm.etiquetas.includes(inputValue.value)) {
    uploadForm.etiquetas.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

// Utilidades
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getValidationTagType = (nivel) => {
  const types = {
    'Borrador': 'info',
    'En Revisión': 'warning',
    'Verificado': 'success',
    'Preliminar': 'warning',
    'Validado': 'success'
  }
  return types[nivel] || 'info'
}

// Cargar configuración y datos
const loadConfig = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/archivos/config')
    const config = await response.json()
    
    maxFileSizeMB.value = config.max_file_size_mb
    allowedExtensions.value = config.allowed_extensions.map(ext => '.' + ext.toLowerCase())
    temasDisponibles.value = config.temas_disponibles
    nivelesValidacion.value = config.niveles_validacion
  } catch (error) {
    console.error('Error al cargar configuración:', error)
  }
}

const loadRecentFiles = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/archivos?limit=5')
    const files = await response.json()
    recentFiles.value = files
  } catch (error) {
    console.error('Error al cargar archivos recientes:', error)
  }
}

// Watcher para el modal
watch(uploadModalVisible, (newValue) => {
  if (newValue) {
    // Modal abierto
    document.body.style.overflow = 'hidden'
    document.body.classList.add('modal-open')
  } else {
    // Modal cerrado
    document.body.style.overflow = ''
    document.body.classList.remove('modal-open')
  }
})

// Ciclo de vida
onMounted(() => {
  loadConfig()
  loadRecentFiles()
})
</script>

<style scoped>
.upload-modal-container {
  max-width: 1200px;
  margin: 0 auto;
}

.upload-card {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border: none;
  border-radius: 16px;
  overflow: hidden;
}

.card-header h3 {
  color: #245946;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.card-header p {
  color: #64748b;
  margin: 0;
  font-size: 1rem;
}

.upload-actions {
  text-align: center;
  padding: 2rem;
}

.upload-button {
  background: linear-gradient(135deg, #245946 0%, #2d8f5a 100%);
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(36, 89, 70, 0.3);
  transition: all 0.3s ease;
}

.upload-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(36, 89, 70, 0.4);
}

.upload-info {
  margin-top: 1.5rem;
  color: #64748b;
  font-size: 0.9rem;
}

.upload-info p {
  margin: 0.25rem 0;
}

.recent-files-card {
  border-radius: 12px;
}

.no-files {
  text-align: center;
  color: #94a3b8;
  padding: 2rem;
}

.recent-files-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recent-file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.recent-file-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.file-icon {
  color: #245946;
  font-size: 1.5rem;
}

.file-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.file-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
}

.file-meta {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 2px;
}

.upload-dialog {
  border-radius: 16px;
  z-index: 3000 !important;
}

.upload-dialog :deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
  z-index: 3000 !important;
}

.upload-dialog :deep(.el-overlay) {
  z-index: 2999 !important;
}

.upload-dialog :deep(.el-overlay-dialog) {
  z-index: 3000 !important;
}

.upload-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #245946 0%, #2d8f5a 100%);
  color: white;
  padding: 20px 24px;
}

.upload-dialog :deep(.el-dialog__title) {
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
}

.upload-form {
  padding: 24px;
}

.file-upload-item :deep(.el-upload-dragger) {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  width: 100%;
  height: 160px;
  background: #f9fafb;
  transition: all 0.3s ease;
}

.file-upload-item :deep(.el-upload-dragger:hover) {
  border-color: #245946;
  background: #f0fdf4;
}

.file-upload-item :deep(.el-icon--upload) {
  font-size: 3rem;
  color: #245946;
  margin-bottom: 16px;
}

.file-upload-item :deep(.el-upload__text) {
  color: #374151;
  font-size: 1rem;
}

.file-upload-item :deep(.el-upload__tip) {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 8px;
  line-height: 1.4;
}

.tags-input-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  min-height: 32px;
}

.tag-item {
  margin: 0;
}

.tag-input {
  width: 120px;
}

.add-tag-button {
  border-style: dashed;
  border-color: #d1d5db;
  color: #6b7280;
}

.add-tag-button:hover {
  border-color: #245946;
  color: #245946;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

/* Estilos globales para asegurar que el modal siempre esté encima */
:global(.el-overlay) {
  z-index: 2999 !important;
}

:global(.el-dialog__wrapper) {
  z-index: 3000 !important;
}

:global(.el-dialog) {
  z-index: 3001 !important;
}

:global(.upload-dialog .el-dialog) {
  z-index: 3001 !important;
  position: relative !important;
}

:global(.upload-dialog .el-overlay) {
  z-index: 2999 !important;
  background-color: rgba(0, 0, 0, 0.5) !important;
}

/* Estilos para cuando el modal está abierto */
:global(body.modal-open) {
  overflow: hidden !important;
  padding-right: 17px; /* Compensar por la barra de scroll */
}

:global(.modal-open .app-layout) {
  filter: none !important;
  transform: none !important;
}

/* Asegurar que el modal tenga la máxima prioridad visual */
:global(.upload-dialog .el-dialog__wrapper) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 3000 !important;
}

:global(.upload-dialog .el-dialog) {
  margin: 0 auto !important;
  margin-top: 50px !important;
  max-height: calc(100vh - 100px) !important;
  overflow-y: auto !important;
}

/* Responsivo */
@media (max-width: 768px) {
  .upload-dialog {
    width: 95% !important;
    margin: 10px;
  }
  
  .upload-form {
    padding: 16px;
  }
  
  .upload-actions {
    padding: 1rem;
  }
  
  .upload-button {
    padding: 12px 24px;
    font-size: 1rem;
  }
  
  .recent-file-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
