const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// URL del backend
const BACKEND_URL = 'http://localhost:4000';

async function testUpload() {
  try {
    console.log('=== PRUEBA DE SUBIDA DE ARCHIVO ===');
    
    // 1. Primero hacer login para obtener un token
    console.log('1. Haciendo login...');
    const loginResponse = await axios.post(`${BACKEND_URL}/api/login`, {
      usuario: 'admin', // Cambiar por un usuario válido
      contrasena: 'admin123' // Cambiar por la contraseña correcta
    });
    
    if (!loginResponse.data.success) {
      throw new Error('Login fallido');
    }
    
    const token = loginResponse.data.token;
    const usuario = loginResponse.data.usuario;
    console.log('✅ Login exitoso para usuario:', usuario.usuario, 'rol:', usuario.rol);
    
    // 2. Crear un archivo de prueba
    const testFileName = 'archivo_prueba.txt';
    const testFilePath = path.join(__dirname, testFileName);
    const testContent = `Este es un archivo de prueba creado el ${new Date().toISOString()}`;
    
    fs.writeFileSync(testFilePath, testContent);
    console.log('✅ Archivo de prueba creado:', testFilePath);
    
    // 3. Subir el archivo
    console.log('2. Subiendo archivo...');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath));
    formData.append('descripcion', 'Archivo de prueba para verificar historial');
    formData.append('etiquetas', 'prueba, historial, test');
    formData.append('responsable', 'Sistema de pruebas');
    formData.append('fuente', 'Script de prueba');
    formData.append('alcance', 'Prueba local');
    formData.append('validacion', 'No validado - solo prueba');
    formData.append('observaciones', 'Este es un archivo creado automáticamente para probar el sistema de historiales');
    
    const uploadResponse = await axios.post(`${BACKEND_URL}/archivos/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Archivo subido exitosamente:', uploadResponse.data.registro.nombre);
    console.log('ID del archivo:', uploadResponse.data.registro.id);
    
    // 4. Esperar un poco para que se procese
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 5. Verificar que se creó el registro en historial
    console.log('3. Verificando historial...');
    const historialResponse = await axios.get(`${BACKEND_URL}/api/historiales?limit=1&archivo_id=${uploadResponse.data.registro.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (historialResponse.data.ok && historialResponse.data.data.length > 0) {
      const registro = historialResponse.data.data[0];
      console.log('✅ Registro de historial encontrado:');
      console.log('  - ID:', registro.id);
      console.log('  - Usuario:', registro.usuario);
      console.log('  - Archivo:', registro.archivo_nombre);
      console.log('  - Acción:', registro.accion);
      console.log('  - Detalle:', registro.detalle);
      console.log('  - IP:', registro.ip);
      console.log('  - Fecha:', registro.creado_en);
    } else {
      console.log('❌ No se encontró registro de historial para el archivo');
    }
    
    // 6. Limpiar - eliminar archivo de prueba
    fs.unlinkSync(testFilePath);
    console.log('✅ Archivo de prueba eliminado');
    
    console.log('\\n🎉 Prueba completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.status, error.response.data);
    }
  }
}

testUpload();
