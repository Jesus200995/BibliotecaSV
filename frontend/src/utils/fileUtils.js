/**
 * Funciones utilitarias centralizadas para manejo de archivos
 */

/**
 * Formatea el tamaño de archivo en bytes a una representación legible
 * @param {number} bytes - Tamaño en bytes
 * @returns {string} - Tamaño formateado (ej: "1.5 MB")
 */
export function formatFileSize(bytes) {
  // Debug: log del valor recibido
  console.log('formatFileSize recibió:', bytes, typeof bytes)
  
  // Convertir a número si es string
  const numBytes = Number(bytes)
  
  if (!numBytes || numBytes === 0 || isNaN(numBytes)) {
    console.log('formatFileSize: valor inválido, retornando "0 Bytes"')
    return '0 Bytes'
  }
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(numBytes) / Math.log(k))
  
  const result = parseFloat((numBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  console.log('formatFileSize resultado:', result)
  return result
}

/**
 * Calcula el tamaño total de una lista de archivos
 * @param {Array} archivos - Array de objetos archivo con propiedad 'tamano'
 * @returns {number} - Tamaño total en bytes
 */
export function calculateTotalSize(archivos) {
  console.log('calculateTotalSize recibió:', archivos?.length, 'archivos')
  
  if (!Array.isArray(archivos)) {
    console.log('calculateTotalSize: no es array, retornando 0')
    return 0
  }
  
  const total = archivos.reduce((total, archivo) => {
    // Buscar el tamaño en diferentes propiedades posibles
    const tamano = archivo.tamano || archivo.size || archivo.fileSize || 0
    const tamanoNum = Number(tamano)
    
    console.log(`Archivo ${archivo.nombre || 'sin_nombre'}: tamano=${tamano}, convertido=${tamanoNum}`)
    
    return total + (isNaN(tamanoNum) ? 0 : tamanoNum)
  }, 0)
  
  console.log('calculateTotalSize resultado:', total)
  return total
}

/**
 * Convierte bytes a megabytes
 * @param {number} bytes - Tamaño en bytes
 * @returns {number} - Tamaño en MB
 */
export function bytesToMB(bytes) {
  if (bytes === 0 || !bytes) return 0
  return bytes / (1024 * 1024)
}

/**
 * Valida si el tamaño de archivo está dentro del límite permitido
 * @param {number} fileSize - Tamaño del archivo en bytes
 * @param {number} maxSizeMB - Tamaño máximo permitido en MB
 * @returns {boolean} - true si el archivo es válido
 */
export function validateFileSize(fileSize, maxSizeMB = 50) {
  if (!fileSize || typeof fileSize !== 'number') return false
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return fileSize <= maxSizeBytes
}

/**
 * Obtiene la extensión de un archivo
 * @param {string} filename - Nombre del archivo
 * @returns {string} - Extensión del archivo (sin punto)
 */
export function getFileExtension(filename) {
  if (!filename || typeof filename !== 'string') return ''
  
  const lastDot = filename.lastIndexOf('.')
  if (lastDot === -1 || lastDot === filename.length - 1) return ''
  
  return filename.substring(lastDot + 1).toUpperCase()
}

/**
 * Determina el tipo MIME basado en la extensión del archivo
 * @param {string} extension - Extensión del archivo
 * @returns {string} - Tipo MIME
 */
export function getMimeType(extension) {
  if (!extension) return 'application/octet-stream'
  
  const mimeTypes = {
    'PDF': 'application/pdf',
    'JPG': 'image/jpeg',
    'JPEG': 'image/jpeg',
    'PNG': 'image/png',
    'GIF': 'image/gif',
    'DOC': 'application/msword',
    'DOCX': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'XLS': 'application/vnd.ms-excel',
    'XLSX': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'PPT': 'application/vnd.ms-powerpoint',
    'PPTX': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'TXT': 'text/plain',
    'CSV': 'text/csv',
    'ZIP': 'application/zip'
  }
  
  return mimeTypes[extension.toUpperCase()] || 'application/octet-stream'
}

/**
 * Valida si un archivo es de imagen
 * @param {string} filename - Nombre del archivo
 * @returns {boolean} - true si es imagen
 */
export function isImageFile(filename) {
  const extension = getFileExtension(filename)
  const imageExtensions = ['JPG', 'JPEG', 'PNG', 'GIF', 'BMP', 'WEBP', 'SVG']
  return imageExtensions.includes(extension)
}

/**
 * Valida si un archivo es de documento
 * @param {string} filename - Nombre del archivo
 * @returns {boolean} - true si es documento
 */
export function isDocumentFile(filename) {
  const extension = getFileExtension(filename)
  const documentExtensions = ['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 'TXT', 'CSV']
  return documentExtensions.includes(extension)
}

/**
 * Calcula estadísticas básicas de una lista de archivos
 * @param {Array} archivos - Array de archivos
 * @returns {Object} - Objeto con estadísticas
 */
export function calculateFileStats(archivos) {
  if (!Array.isArray(archivos)) {
    return {
      totalFiles: 0,
      totalSize: 0,
      averageSize: 0,
      fileTypes: {},
      largestFile: null,
      smallestFile: null
    }
  }
  
  const stats = {
    totalFiles: archivos.length,
    totalSize: calculateTotalSize(archivos),
    averageSize: 0,
    fileTypes: {},
    largestFile: null,
    smallestFile: null
  }
  
  if (archivos.length === 0) return stats
  
  // Calcular tamaño promedio
  stats.averageSize = stats.totalSize / archivos.length
  
  // Contar tipos de archivo
  archivos.forEach(archivo => {
    const tipo = archivo.tipo || getFileExtension(archivo.nombre) || 'Sin tipo'
    stats.fileTypes[tipo] = (stats.fileTypes[tipo] || 0) + 1
    
    // Encontrar archivo más grande y más pequeño
    const tamano = archivo.tamano || 0
    if (!stats.largestFile || tamano > (stats.largestFile.tamano || 0)) {
      stats.largestFile = archivo
    }
    if (!stats.smallestFile || tamano < (stats.smallestFile.tamano || Infinity)) {
      stats.smallestFile = archivo
    }
  })
  
  return stats
}
