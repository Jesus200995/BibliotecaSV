/**
 * Utilidades para manejo de archivos y tamaños
 * Funciones centralizadas para evitar duplicación de código
 */

/**
 * Convierte bytes a formato legible (MB, GB, etc.)
 * Función unificada para Dashboard, Archivos y Estadísticas
 * @param {number} bytes - Tamaño en bytes
 * @returns {string} - Tamaño formateado (ej: "18.62 MB")
 */
export function formatFileSize(bytes) {
  // Si no hay bytes o es 0, mostrar "0.00 MB" consistentemente
  if (!bytes || bytes === 0) return '0.00 MB'
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  
  // Asegurar que siempre muestre 2 decimales para MB y superior
  const formattedSize = (bytes / Math.pow(1024, i)).toFixed(2)
  
  return parseFloat(formattedSize) + ' ' + sizes[i]
}

/**
 * Calcula el tamaño total de un array de archivos
 * Suma segura que maneja diferentes formatos de datos
 * @param {Array} archivos - Array de archivos con propiedad 'tamano'
 * @returns {number} - Total en bytes
 */
export function calculateTotalSize(archivos) {
  if (!Array.isArray(archivos)) return 0
  
  return archivos.reduce((total, archivo) => {
    let tamano = 0
    
    if (archivo.tamano) {
      // Si ya es un número
      if (typeof archivo.tamano === 'number') {
        tamano = archivo.tamano
      } else if (typeof archivo.tamano === 'string') {
        // Si es string, intentar parsearlo (remover caracteres no numéricos)
        const num = parseInt(archivo.tamano.replace(/[^\d]/g, ''))
        tamano = isNaN(num) ? 0 : num
      }
    }
    
    return total + tamano
  }, 0)
}

/**
 * Convierte bytes específicamente a MB con formato consistente
 * Usado para mostrar siempre en MB en las estadísticas principales
 * @param {number} bytes - Tamaño en bytes
 * @returns {string} - Formato "XX.XX MB"
 */
export function bytesToMB(bytes) {
  if (!bytes || bytes === 0) return '0.00 MB'
  
  const totalMB = bytes / (1024 * 1024)
  return totalMB.toFixed(2) + ' MB'
}

/**
 * Valida el tamaño máximo permitido para subida de archivos
 * @param {number} bytes - Tamaño del archivo en bytes
 * @param {number} maxMB - Tamaño máximo permitido en MB (default: 50)
 * @returns {boolean} - true si el archivo es válido
 */
export function validateFileSize(bytes, maxMB = 50) {
  const maxBytes = maxMB * 1024 * 1024
  return bytes <= maxBytes
}
