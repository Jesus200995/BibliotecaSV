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

    <!-- Modal moderno para subir archivos -->
    <el-dialog 
      v-model="uploadModalVisible" 
      width="90%"
      style="max-width: 580px; min-width: 320px;"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      :modal="true"
      :append-to-body="true"
      :lock-scroll="true"
      :z-index="3000"
      class="modern-upload-dialog"
      destroy-on-close
      center
    >
      <template #header>
        <div class="modern-modal-header">
          <el-icon class="header-icon" :size="24"><UploadFilled /></el-icon>
          <div class="header-text">
            <h3>Subir Archivo</h3>
            <p>Añadir documento al sistema</p>
          </div>
        </div>
      </template>

      <div class="modern-upload-content">
        <!-- Drag & Drop Area -->
        <div class="upload-zone">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :limit="1"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :before-upload="validateFile"
            drag
            class="modern-upload-dragger"
          >
            <div class="upload-content">
              <el-icon class="upload-icon" :size="40"><UploadFilled /></el-icon>
              <div class="upload-text">
                <p class="main-text">Arrastra tu archivo aquí</p>
                <p class="sub-text">o haz clic para seleccionar</p>
              </div>
            </div>
            <template #tip>
              <div class="upload-tip">
                <el-icon :size="14"><InfoFilled /></el-icon>
                <span>{{ allowedExtensions.join(', ') }} | Máx. {{ maxFileSizeMB }}MB</span>
              </div>
            </template>
          </el-upload>
        </div>

        <!-- Formulario compacto -->
        <el-form 
          ref="uploadFormRef"
          :model="uploadForm" 
          :rules="uploadRules"
          label-position="top"
          class="modern-upload-form"
        >
          <!-- Información básica en una sola fila -->
          <div class="form-row">
            <el-form-item label="Nombre del archivo" prop="nombre_archivo" class="form-item-flex">
              <el-input 
                v-model="uploadForm.nombre_archivo" 
                placeholder="Nombre descriptivo"
                :prefix-icon="Document"
                maxlength="100"
                size="default"
              />
            </el-form-item>
            
            <el-form-item label="Tema" prop="tema" class="form-item-flex">
              <el-select 
                v-model="uploadForm.tema" 
                placeholder="Seleccionar tema"
                :prefix-icon="FolderOpened"
                clearable
                size="default"
              >
                <el-option 
                  v-for="tema in temasDisponibles" 
                  :key="tema" 
                  :label="tema" 
                  :value="tema"
                />
              </el-select>
            </el-form-item>
          </div>

          <!-- Descripción -->
          <el-form-item label="Descripción" prop="descripcion">
            <el-input 
              v-model="uploadForm.descripcion" 
              type="textarea" 
              :rows="2"
              placeholder="Breve descripción del contenido"
              maxlength="200"
              show-word-limit
              resize="none"
            />
          </el-form-item>

          <!-- Información adicional en acordeón -->
          <el-collapse v-model="activeAccordion" class="info-accordion">
            <el-collapse-item name="additional" class="accordion-item">
              <template #title>
                <div class="accordion-title">
                  <el-icon :size="16"><Setting /></el-icon>
                  <span>Información adicional</span>
                  <el-tag size="small" type="info">Opcional</el-tag>
                </div>
              </template>
              
              <div class="accordion-content">
                <!-- Responsable y Validación -->
                <div class="form-row">
                  <el-form-item label="Responsable" prop="responsable" class="form-item-flex">
                    <el-input 
                      v-model="uploadForm.responsable" 
                      placeholder="Nombre del responsable"
                      :prefix-icon="User"
                      size="small"
                    />
                  </el-form-item>
                  
                  <el-form-item label="Nivel de validación" prop="nivel_validacion" class="form-item-flex">
                    <el-select 
                      v-model="uploadForm.nivel_validacion" 
                      placeholder="Nivel"
                      size="small"
                    >
                      <el-option 
                        v-for="nivel in nivelesValidacion" 
                        :key="nivel" 
                        :label="nivel" 
                        :value="nivel"
                      />
                    </el-select>
                  </el-form-item>
                </div>

                <!-- Ubicación -->
                <div class="form-row">
                  <el-form-item label="Entidad" class="form-item-flex">
                    <el-input 
                      v-model="uploadForm.entidad" 
                      placeholder="Entidad"
                      :prefix-icon="OfficeBuilding"
                      size="small"
                    />
                  </el-form-item>
                  
                  <el-form-item label="Municipio" class="form-item-flex">
                    <el-input 
                      v-model="uploadForm.municipio" 
                      placeholder="Municipio"
                      :prefix-icon="LocationInformation"
                      size="small"
                    />
                  </el-form-item>
                </div>

                <!-- Etiquetas -->
                <el-form-item label="Etiquetas">
                  <div class="tags-container">
                    <el-tag
                      v-for="tag in uploadForm.etiquetas"
                      :key="tag"
                      closable
                      @close="removeTag(tag)"
                      size="small"
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
                      style="width: 80px;"
                    />
                    <el-button 
                      v-else 
                      size="small" 
                      @click="showInput"
                      type="primary"
                      plain
                      :icon="Plus"
                    >
                      Etiqueta
                    </el-button>
                  </div>
                </el-form-item>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </div>

      <template #footer>
        <div class="modern-modal-footer">
          <el-button @click="cancelUpload" :disabled="uploading" size="default">
            Cancelar
          </el-button>
          <el-button 
            type="primary" 
            @click="submitUpload"
            :loading="uploading"
            :disabled="!uploadForm.file"
            size="default"
            :icon="uploading ? Loading : UploadFilled"
          >
            {{ uploading ? 'Subiendo...' : 'Subir Archivo' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Upload, 
  UploadFilled, 
  Document, 
  FolderOpened,
  User,
  Setting,
  Plus,
  Loading,
  InfoFilled,
  OfficeBuilding,
  LocationInformation
} from '@element-plus/icons-vue'

// Referencias reactivas
const uploadModalVisible = ref(false)
const uploading = ref(false)
const uploadFormRef = ref()
const uploadRef = ref()
const inputRef = ref()
const inputVisible = ref(false)
const inputValue = ref('')
const activeAccordion = ref([])

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
    { min: 3, max: 100, message: 'El nombre debe tener entre 3 y 100 caracteres', trigger: 'blur' }
  ],
  responsable: [
    { required: true, message: 'El responsable es requerido', trigger: 'blur' }
  ],
  nivel_validacion: [
    { required: true, message: 'El nivel de validación es requerido', trigger: 'change' }
  ]
}

// Watcher para manejar el modal
watch(uploadModalVisible, (newVal) => {
  if (newVal) {
    document.body.classList.add('modal-open')
  } else {
    document.body.classList.remove('modal-open')
  }
})

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
  activeAccordion.value = []
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

// Ciclo de vida
onMounted(() => {
  loadConfig()
  loadRecentFiles()
})
</script>

<style scoped>
/* ====================================
   ESTILOS GENERALES DEL COMPONENTE
   ==================================== */
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

/* ====================================
   ARCHIVOS RECIENTES
   ==================================== */
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

/* ====================================
   MODAL MODERNO
   ==================================== */
.modern-upload-dialog {
  border-radius: 16px !important;
}

.modern-upload-dialog :deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
  margin: 5vh auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.modern-upload-dialog :deep(.el-dialog__header) {
  padding: 0;
  margin: 0;
}

.modern-upload-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.modern-upload-dialog :deep(.el-dialog__footer) {
  padding: 0;
}

.modern-modal-header {
  background: linear-gradient(135deg, #245946 0%, #2d8f5a 100%);
  color: white;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px;
  border-radius: 12px;
  color: #6ee7b7;
}

.header-text h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

.header-text p {
  margin: 4px 0 0 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

/* ====================================
   CONTENIDO DEL MODAL
   ==================================== */
.modern-upload-content {
  padding: 24px;
}

.upload-zone {
  margin-bottom: 24px;
}

.modern-upload-dragger :deep(.el-upload-dragger) {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  transition: all 0.3s ease;
  height: 120px;
  position: relative;
  overflow: hidden;
}

.modern-upload-dragger :deep(.el-upload-dragger:hover) {
  border-color: #245946;
  background: linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(36, 89, 70, 0.1);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
}

.upload-icon {
  color: #245946;
  opacity: 0.8;
}

.upload-text {
  text-align: center;
}

.main-text {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.sub-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 4px 0 0 0;
}

.upload-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  padding: 8px 12px;
  background: #f3f4f6;
  border-radius: 8px;
  color: #6b7280;
  font-size: 0.8rem;
}

/* ====================================
   FORMULARIO MODERNO
   ==================================== */
.modern-upload-form {
  margin-top: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-item-flex {
  margin-bottom: 0 !important;
}

.modern-upload-form :deep(.el-form-item__label) {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  margin-bottom: 6px;
}

.modern-upload-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.modern-upload-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 2px 8px rgba(36, 89, 70, 0.1);
}

.modern-upload-form :deep(.el-textarea__inner) {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.modern-upload-form :deep(.el-textarea__inner:hover) {
  box-shadow: 0 2px 8px rgba(36, 89, 70, 0.1);
}

/* ====================================
   ACORDEÓN DE INFORMACIÓN ADICIONAL
   ==================================== */
.info-accordion {
  margin-top: 16px;
  border: none;
}

.info-accordion :deep(.el-collapse-item__header) {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
  font-weight: 500;
}

.info-accordion :deep(.el-collapse-item__content) {
  padding: 16px 0 0 0;
  border: none;
}

.accordion-title {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.accordion-title span {
  flex: 1;
}

.accordion-content {
  padding: 16px;
  background: #fbfcfd;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

/* ====================================
   ETIQUETAS
   ==================================== */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  min-height: 32px;
}

.tag-item {
  margin: 0;
  background: #245946;
  color: white;
  border: none;
}

.tag-input {
  width: 80px;
}

/* ====================================
   FOOTER DEL MODAL
   ==================================== */
.modern-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.modern-modal-footer .el-button {
  border-radius: 8px;
  font-weight: 500;
}

/* ====================================
   CLASES GLOBALES
   ==================================== */
:global(.modal-open) {
  overflow: hidden !important;
}

/* ====================================
   RESPONSIVO
   ==================================== */
@media (max-width: 768px) {
  .modern-upload-dialog :deep(.el-dialog) {
    width: 95vw !important;
    margin: 2vh auto;
    max-width: none;
  }
  
  .modern-upload-content {
    padding: 16px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .upload-actions {
    padding: 1rem;
  }
  
  .upload-button {
    padding: 12px 24px;
    font-size: 1rem;
  }
  
  .modern-modal-header {
    padding: 16px 20px;
  }
  
  .modern-modal-footer {
    padding: 16px 20px;
  }
  
  .accordion-content {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .modern-upload-dragger :deep(.el-upload-dragger) {
    height: 100px;
  }
  
  .upload-icon {
    font-size: 32px !important;
  }
  
  .main-text {
    font-size: 0.9rem;
  }
  
  .sub-text {
    font-size: 0.8rem;
  }
  
  .header-text h3 {
    font-size: 1.1rem;
  }
  
  .header-text p {
    font-size: 0.8rem;
  }
}
</style>
