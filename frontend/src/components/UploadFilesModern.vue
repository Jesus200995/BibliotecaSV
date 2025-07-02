<template>
  <div class="upload-container">
    <!-- Sección principal con tarjeta de subida -->
    <div class="upload-main-section">
      <el-card class="upload-main-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <div class="header-icon">
              <el-icon :size="32"><FolderAdd /></el-icon>
            </div>
            <div class="header-text">
              <h2>Gestión de Archivos</h2>
              <p>Sube y organiza documentos en el sistema de biblioteca digital</p>
            </div>
          </div>
        </template>

        <div class="upload-content">
          <div class="upload-button-section">
            <el-button 
              type="primary" 
              size="large"
              @click="openModal"
              :icon="Upload"
              class="main-upload-btn"
            >
              Subir Nuevo Archivo
            </el-button>
            
            <div class="upload-specs">
              <div class="spec-item">
                <el-icon><Document /></el-icon>
                <span>Formatos: CSV, XLSX, SHP, PDF, DOC</span>
              </div>
              <div class="spec-item">
                <el-icon><Files /></el-icon>
                <span>Máximo: {{ maxSizeMB }}MB por archivo</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- Archivos recientes -->
      <el-card class="recent-files-card" shadow="hover" v-if="recentFiles.length > 0">
        <template #header>
          <div class="recent-header">
            <el-icon><Clock /></el-icon>
            <span>Archivos Recientes</span>
          </div>
        </template>
        
        <div class="recent-files-list">
          <div 
            v-for="file in recentFiles" 
            :key="file.id" 
            class="recent-file-item"
          >
            <div class="file-icon-container">
              <el-icon class="file-type-icon"><Document /></el-icon>
            </div>
            <div class="file-details">
              <div class="file-name">{{ file.nombre_archivo }}</div>
              <div class="file-meta">
                {{ formatFileSize(file.tamano_bytes) }} • {{ formatDate(file.fecha_actualizacion) }}
              </div>
            </div>
            <el-tag 
              :type="getValidationTagType(file.nivel_validacion)" 
              size="small"
              class="validation-tag"
            >
              {{ file.nivel_validacion }}
            </el-tag>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Modal mejorado y moderno -->
    <el-dialog 
      v-model="modalVisible" 
      title=""
      width="580px"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      destroy-on-close
      append-to-body
      :z-index="3000"
      class="modern-upload-dialog"
      :class="{ 'dialog-animate': modalVisible }"
    >
      <!-- Header personalizado del modal -->
      <div class="modal-header">
        <div class="modal-title-section">
          <div class="title-icon">
            <el-icon :size="24"><UploadFilled /></el-icon>
          </div>
          <div class="title-text">
            <h3>Subir Archivo</h3>
            <p>Completa la información del documento</p>
          </div>
        </div>
        <el-button 
          type="text" 
          @click="closeModal" 
          class="close-btn"
          :icon="Close"
          size="large"
        />
      </div>

      <!-- Contenido del formulario -->
      <div class="modal-content">
        <el-form 
          ref="formRef"
          :model="form" 
          :rules="rules"
          label-position="top"
          class="upload-form"
          size="default"
        >
          <!-- Zona de subida de archivo -->
          <div class="file-upload-section">
            <el-upload
              ref="uploadRef"
              :auto-upload="false"
              :limit="1"
              :on-change="handleFileChange"
              :on-remove="handleFileRemove"
              :before-upload="validateFile"
              drag
              class="file-uploader"
              :class="{ 'has-file': form.file }"
            >
              <div class="upload-content-area">
                <div v-if="!form.file" class="upload-placeholder">
                  <el-icon class="upload-icon" :size="40"><Upload /></el-icon>
                  <div class="upload-text">
                    <p><strong>Arrastra tu archivo aquí</strong></p>
                    <p>o <span class="click-text">haz clic para seleccionar</span></p>
                  </div>
                </div>
                <div v-else class="file-selected">
                  <el-icon class="file-icon" :size="32"><Document /></el-icon>
                  <div class="file-info">
                    <p class="file-name">{{ form.file.name }}</p>
                    <p class="file-size">{{ formatFileSize(form.file.size) }}</p>
                  </div>
                  <el-button 
                    type="text" 
                    @click.stop="removeFile"
                    class="remove-file"
                    :icon="Delete"
                    size="small"
                  />
                </div>
              </div>
              <template #tip>
                <div class="upload-tip">
                  {{ allowedExtensions.join(', ') }} • Máximo {{ maxSizeMB }}MB
                </div>
              </template>
            </el-upload>
          </div>

          <!-- Campos del formulario en grid compacto -->
          <div class="form-grid">
            <!-- Fila 1: Nombre y Tema -->
            <div class="form-row">
              <el-form-item label="Nombre del archivo" prop="nombre_archivo" class="form-col">
                <el-input 
                  v-model="form.nombre_archivo" 
                  placeholder="Nombre descriptivo"
                  :prefix-icon="Edit"
                  maxlength="255"
                  show-word-limit
                />
              </el-form-item>
              
              <el-form-item label="Tema" class="form-col">
                <el-select 
                  v-model="form.tema" 
                  placeholder="Seleccionar tema"
                  :prefix-icon="FolderOpened"
                  clearable
                  filterable
                  allow-create
                  class="theme-selector"
                >
                  <el-option 
                    v-for="tema in temasDisponibles" 
                    :key="tema" 
                    :label="tema" 
                    :value="tema"
                  >
                    <div class="option-content">
                      <el-icon><Collection /></el-icon>
                      <span>{{ tema }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

            <!-- Fila 2: Responsable y Nivel de Validación -->
            <div class="form-row">
              <el-form-item label="Responsable" prop="responsable" class="form-col">
                <el-input 
                  v-model="form.responsable" 
                  placeholder="Nombre del responsable"
                  :prefix-icon="User"
                  maxlength="100"
                />
              </el-form-item>
              
              <el-form-item label="Nivel de Validación" prop="nivel_validacion" class="form-col">
                <el-select 
                  v-model="form.nivel_validacion" 
                  placeholder="Seleccionar nivel"
                  :prefix-icon="CircleCheck"
                  class="validation-selector"
                >
                  <el-option 
                    v-for="nivel in nivelesValidacion" 
                    :key="nivel" 
                    :label="nivel" 
                    :value="nivel"
                  >
                    <div class="option-content">
                      <el-icon><CircleCheck /></el-icon>
                      <span>{{ nivel }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

            <!-- Descripción -->
            <el-form-item label="Descripción">
              <el-input 
                v-model="form.descripcion" 
                type="textarea" 
                :rows="2"
                placeholder="Descripción del contenido del archivo"
                maxlength="500"
                show-word-limit
                resize="none"
              />
            </el-form-item>

            <!-- Información geográfica (collapsible) -->
            <el-collapse v-model="activeCollapse" class="geo-collapse">
              <el-collapse-item title="Información Geográfica (Opcional)" name="geo">
                <template #title>
                  <div class="collapse-title">
                    <el-icon><MapLocation /></el-icon>
                    <span>Información Geográfica (Opcional)</span>
                  </div>
                </template>
                
                <div class="geo-grid">
                  <el-form-item label="Entidad" class="geo-item">
                    <el-input 
                      v-model="form.entidad" 
                      placeholder="Entidad responsable"
                      :prefix-icon="OfficeBuilding"
                      maxlength="100"
                    />
                  </el-form-item>
                  
                  <el-form-item label="Municipio" class="geo-item">
                    <el-input 
                      v-model="form.municipio" 
                      placeholder="Municipio"
                      :prefix-icon="Location"
                      maxlength="100"
                    />
                  </el-form-item>
                  
                  <el-form-item label="Territorio" class="geo-item">
                    <el-input 
                      v-model="form.territorio" 
                      placeholder="Territorio"
                      :prefix-icon="MapLocation"
                      maxlength="100"
                    />
                  </el-form-item>
                </div>
              </el-collapse-item>
            </el-collapse>

            <!-- Información adicional (collapsible) -->
            <el-collapse v-model="activeCollapse2" class="info-collapse">
              <el-collapse-item title="Información Adicional (Opcional)" name="info">
                <template #title>
                  <div class="collapse-title">
                    <el-icon><InfoFilled /></el-icon>
                    <span>Información Adicional (Opcional)</span>
                  </div>
                </template>
                
                <el-form-item label="Fuente de los datos">
                  <el-input 
                    v-model="form.fuente" 
                    placeholder="Fuente de los datos"
                    :prefix-icon="Link"
                    maxlength="255"
                  />
                </el-form-item>

                <!-- Etiquetas con diseño mejorado -->
                <el-form-item label="Etiquetas">
                  <div class="tags-container">
                    <div class="tags-list" v-if="form.etiquetas.length > 0">
                      <el-tag
                        v-for="tag in form.etiquetas"
                        :key="tag"
                        closable
                        @close="removeTag(tag)"
                        class="tag-item"
                        type="info"
                      >
                        {{ tag }}
                      </el-tag>
                    </div>
                    <div class="tag-input-area">
                      <el-input
                        v-if="tagInputVisible"
                        ref="tagInputRef"
                        v-model="tagInputValue"
                        size="small"
                        placeholder="Nueva etiqueta"
                        @keyup.enter="addTag"
                        @blur="addTag"
                        class="tag-input"
                      />
                      <el-button 
                        v-else 
                        size="small" 
                        @click="showTagInput"
                        class="add-tag-btn"
                        :icon="Plus"
                      >
                        Agregar etiqueta
                      </el-button>
                    </div>
                  </div>
                </el-form-item>

                <el-form-item label="Observaciones">
                  <el-input 
                    v-model="form.observaciones" 
                    type="textarea" 
                    :rows="2"
                    placeholder="Observaciones adicionales"
                    maxlength="500"
                    show-word-limit
                    resize="none"
                  />
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-form>
      </div>

      <!-- Footer con botones -->
      <div class="modal-footer">
        <el-button 
          @click="closeModal" 
          :disabled="uploading"
          class="cancel-btn"
          size="large"
        >
          Cancelar
        </el-button>
        <el-button 
          type="primary" 
          @click="submitUpload"
          :loading="uploading"
          :disabled="!form.file"
          class="submit-btn"
          size="large"
          :icon="uploading ? Loading : UploadFilled"
        >
          {{ uploading ? 'Subiendo...' : 'Subir Archivo' }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Upload, UploadFilled, Document, Files, Clock, FolderAdd, Close,
  Edit, FolderOpened, User, CircleCheck, MapLocation, OfficeBuilding,
  Location, InfoFilled, Link, Plus, Delete, Collection, Loading
} from '@element-plus/icons-vue'

// Referencias reactivas
const modalVisible = ref(false)
const uploading = ref(false)
const formRef = ref()
const uploadRef = ref()
const tagInputRef = ref()
const tagInputVisible = ref(false)
const tagInputValue = ref('')
const activeCollapse = ref([])
const activeCollapse2 = ref([])

// Configuración
const maxSizeMB = ref(50)
const allowedExtensions = ref(['.csv', '.xlsx', '.xls', '.shp', '.geojson', '.json', '.xml', '.pdf', '.doc', '.docx'])
const temasDisponibles = ref([
  'Cultivos', 'Unidades de Producción', 'Transformación', 
  'Comercialización', 'Territorio', 'Población', 'Infraestructura'
])
const nivelesValidacion = ref([
  'Borrador', 'En Revisión', 'Verificado', 'Preliminar', 'Validado'
])
const recentFiles = ref([])

// Formulario
const form = reactive({
  file: null,
  nombre_archivo: '',
  descripcion: '',
  tema: '',
  entidad: '',
  municipio: '',
  territorio: '',
  responsable: 'jesus',
  fuente: '',
  nivel_validacion: 'Borrador',
  observaciones: '',
  etiquetas: []
})

// Reglas de validación
const rules = {
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

// Métodos principales
const openModal = () => {
  modalVisible.value = true
  resetForm()
}

const closeModal = async () => {
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
      return
    }
  }
  modalVisible.value = false
}

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
  
  form.file = null
  form.nombre_archivo = ''
  form.descripcion = ''
  form.tema = ''
  form.entidad = ''
  form.municipio = ''
  form.territorio = ''
  form.responsable = 'jesus'
  form.fuente = ''
  form.nivel_validacion = 'Borrador'
  form.observaciones = ''
  form.etiquetas = []
  
  tagInputVisible.value = false
  tagInputValue.value = ''
  activeCollapse.value = []
  activeCollapse2.value = []
}

// Manejo de archivos
const handleFileChange = (file) => {
  form.file = file.raw
  if (!form.nombre_archivo) {
    form.nombre_archivo = file.name
  }
}

const handleFileRemove = () => {
  form.file = null
}

const removeFile = () => {
  uploadRef.value.clearFiles()
  form.file = null
}

const validateFile = (file) => {
  const isValidType = allowedExtensions.value.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  )
  
  if (!isValidType) {
    ElMessage.error(`Tipo de archivo no permitido. Solo se permiten: ${allowedExtensions.value.join(', ')}`)
    return false
  }

  const isValidSize = file.size / 1024 / 1024 < maxSizeMB.value
  if (!isValidSize) {
    ElMessage.error(`El archivo es demasiado grande. Máximo ${maxSizeMB.value}MB`)
    return false
  }

  return true
}

// Manejo de etiquetas
const removeTag = (tag) => {
  const index = form.etiquetas.indexOf(tag)
  if (index > -1) {
    form.etiquetas.splice(index, 1)
  }
}

const showTagInput = () => {
  tagInputVisible.value = true
  nextTick(() => {
    tagInputRef.value?.focus()
  })
}

const addTag = () => {
  if (tagInputValue.value && !form.etiquetas.includes(tagInputValue.value)) {
    form.etiquetas.push(tagInputValue.value)
  }
  tagInputVisible.value = false
  tagInputValue.value = ''
}

// Subida de archivo
const submitUpload = async () => {
  if (!formRef.value || !form.file) return

  try {
    await formRef.value.validate()
    
    uploading.value = true
    
    const formData = new FormData()
    formData.append('file', form.file)
    formData.append('nombre_archivo', form.nombre_archivo)
    formData.append('descripcion', form.descripcion || '')
    formData.append('tema', form.tema || '')
    formData.append('entidad', form.entidad || '')
    formData.append('municipio', form.municipio || '')
    formData.append('territorio', form.territorio || '')
    formData.append('responsable', form.responsable)
    formData.append('fuente', form.fuente || '')
    formData.append('nivel_validacion', form.nivel_validacion)
    formData.append('observaciones', form.observaciones || '')
    
    if (form.etiquetas.length > 0) {
      formData.append('etiquetas', JSON.stringify(form.etiquetas))
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
    
    ElMessage.success({
      message: 'Archivo subido exitosamente',
      type: 'success',
      duration: 3000
    })
    
    modalVisible.value = false
    await loadRecentFiles()
    
  } catch (error) {
    console.error('Error al subir archivo:', error)
    ElMessage.error({
      message: error.message || 'Error al subir el archivo',
      duration: 5000
    })
  } finally {
    uploading.value = false
  }
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

// Cargar datos
const loadRecentFiles = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/archivos?limit=5')
    if (response.ok) {
      const files = await response.json()
      recentFiles.value = files
    }
  } catch (error) {
    console.error('Error al cargar archivos recientes:', error)
  }
}

// Watcher para manejo del modal
watch(modalVisible, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Ciclo de vida
onMounted(() => {
  loadRecentFiles()
})
</script>

<style scoped>
/* Variables CSS */
:root {
  --primary-color: #245946;
  --primary-light: #2d8f5a;
  --primary-gradient: linear-gradient(135deg, #245946 0%, #2d8f5a 100%);
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
  --info-color: #909399;
  --border-radius: 12px;
  --shadow-light: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.15);
  --shadow-heavy: 0 8px 32px rgba(0, 0, 0, 0.2);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Contenedor principal */
.upload-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0;
}

/* Tarjeta principal */
.upload-main-card {
  border-radius: var(--border-radius);
  border: none;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0;
}

.header-icon {
  background: var(--primary-gradient);
  color: white;
  padding: 12px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-text h2 {
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.header-text p {
  color: #64748b;
  margin: 0;
  font-size: 1rem;
}

/* Contenido de subida */
.upload-content {
  padding: 32px;
}

.upload-button-section {
  text-align: center;
}

.main-upload-btn {
  background: var(--primary-gradient);
  border: none;
  border-radius: var(--border-radius);
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: var(--shadow-medium);
  transition: var(--transition);
  min-width: 200px;
}

.main-upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-heavy);
}

.upload-specs {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 0.9rem;
}

.spec-item .el-icon {
  color: var(--primary-color);
}

/* Archivos recientes */
.recent-files-card {
  border-radius: var(--border-radius);
  border: none;
}

.recent-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color);
  font-weight: 600;
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
  transition: var(--transition);
}

.recent-file-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.file-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
}

.file-details {
  flex: 1;
}

.file-name {
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.file-meta {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

.validation-tag {
  border-radius: 6px;
}

/* Modal moderno */
.modern-upload-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.modern-upload-dialog :deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin: 5vh auto;
}

.modern-upload-dialog :deep(.el-dialog__body) {
  padding: 0;
}

/* Animación del modal */
.dialog-animate {
  animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Header del modal */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: var(--primary-gradient);
  color: white;
}

.modal-title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
}

.title-text h3 {
  margin: 0 0 4px 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.title-text p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.close-btn {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  padding: 8px;
  transition: var(--transition);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Contenido del modal */
.modal-content {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

/* Formulario */
.upload-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Zona de subida de archivo */
.file-upload-section {
  margin-bottom: 24px;
}

.file-uploader {
  width: 100%;
}

.file-uploader :deep(.el-upload-dragger) {
  border: 2px dashed #d1d5db;
  border-radius: var(--border-radius);
  background: #f9fafb;
  transition: var(--transition);
  height: auto;
  min-height: 120px;
  padding: 20px;
}

.file-uploader:hover :deep(.el-upload-dragger) {
  border-color: var(--primary-color);
  background: #f0fdf4;
}

.file-uploader.has-file :deep(.el-upload-dragger) {
  border-color: var(--success-color);
  background: #f0f9ff;
}

.upload-content-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}

.upload-placeholder {
  text-align: center;
}

.upload-icon {
  color: var(--primary-color);
  margin-bottom: 12px;
}

.upload-text p {
  margin: 4px 0;
  color: #374151;
}

.upload-text strong {
  font-weight: 600;
}

.click-text {
  color: var(--primary-color);
  font-weight: 500;
}

.file-selected {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  width: 100%;
}

.file-icon {
  color: var(--success-color);
}

.file-info {
  flex: 1;
}

.file-info .file-name {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.file-info .file-size {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
}

.remove-file {
  color: var(--danger-color);
  padding: 4px;
}

.upload-tip {
  color: #6b7280;
  font-size: 0.8rem;
  text-align: center;
  margin-top: 8px;
}

/* Grid del formulario */
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-col {
  margin-bottom: 0;
}

/* Selectores personalizados */
.theme-selector,
.validation-selector {
  width: 100%;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Colapsos */
.geo-collapse,
.info-collapse {
  border: 1px solid #e5e7eb;
  border-radius: var(--border-radius);
  overflow: hidden;
}

.collapse-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color);
  font-weight: 500;
}

.geo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.geo-item {
  margin-bottom: 0;
}

/* Etiquetas */
.tags-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  margin: 0;
  border-radius: 6px;
}

.tag-input-area {
  display: flex;
  align-items: center;
}

.tag-input {
  max-width: 150px;
}

.add-tag-btn {
  border: 1px dashed #d1d5db;
  color: #6b7280;
  background: transparent;
}

.add-tag-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* Footer del modal */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn,
.submit-btn {
  min-width: 120px;
}

.submit-btn {
  background: var(--primary-gradient);
  border: none;
}

/* Responsivo */
@media (max-width: 768px) {
  .modern-upload-dialog {
    width: 95% !important;
    margin: 10px;
  }
  
  .modern-upload-dialog :deep(.el-dialog) {
    margin: 2vh auto;
  }
  
  .modal-content {
    padding: 16px;
    max-height: 70vh;
  }
  
  .modal-header {
    padding: 16px;
  }
  
  .modal-footer {
    padding: 16px;
    flex-direction: column;
  }
  
  .cancel-btn,
  .submit-btn {
    width: 100%;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .geo-grid {
    grid-template-columns: 1fr;
  }
  
  .upload-specs {
    flex-direction: column;
    gap: 12px;
  }
  
  .recent-file-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .upload-content {
    padding: 20px;
  }
  
  .main-upload-btn {
    width: 100%;
    padding: 14px 24px;
  }
  
  .card-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
}

/* Mejoras en la accesibilidad */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus visible para navegación por teclado */
.main-upload-btn:focus-visible,
.submit-btn:focus-visible,
.cancel-btn:focus-visible,
.close-btn:focus-visible {
  outline: 2px solid #6ee7b7;
  outline-offset: 2px;
}
</style>
