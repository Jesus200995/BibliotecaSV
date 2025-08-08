<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Gestión de Usuarios</h1>
      <div class="flex space-x-2">
        <button 
          @click="cargar" 
          class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refrescar
        </button>
      </div>
    </div>
    
    <section class="card">
      <header class="card-header">
        <h2>Usuarios del Sistema</h2>
      </header>
      <div class="card-body">
        <div v-if="loading" class="flex justify-center py-8">
          <svg class="animate-spin h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

        <table v-else class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usuarios" :key="u.id">
              <td>{{ u.id }}</td>
              <td>{{ u.usuario }}</td>
              <td>
                <span 
                  :class="[
                    'badge', 
                    u.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 
                    u.rol === 'editor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  ]"
                >
                  {{ u.rol }}
                </span>
              </td>
              <td>
                <span :class="['pill', u.activo ? 'pill--green' : 'pill--gray']">
                  {{ u.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Usar la misma URL base que en el resto de la aplicación
const BACKEND_URL = import.meta.env.DEV 
  ? 'http://localhost:4000/api' 
  : 'https://api.biblioteca.sembrandodatos.com/api'
const usuarios = ref([])
const loading = ref(true)
const error = ref('')

async function cargar() {
  console.log('UsuariosView - Intentando cargar usuarios desde:', BACKEND_URL)
  loading.value = true
  error.value = ''
  try {
    const token = localStorage.getItem('authToken')
    console.log('UsuariosView - Token encontrado:', token ? 'Sí' : 'No')
    const res = await fetch(`${BACKEND_URL}/usuarios`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log('UsuariosView - Respuesta recibida:', res.status)
    if (!res.ok) {
      console.error('UsuariosView - Error en la respuesta:', res.status)
      throw new Error(`HTTP ${res.status}`)
    }
    const json = await res.json()
    console.log('UsuariosView - Datos recibidos:', json)
    if (!json.ok) throw new Error(json.error || 'Error')
    usuarios.value = json.data
  } catch (e) {
    error.value = `No se pudo cargar: ${e.message}`
  } finally {
    loading.value = false
  }
}
onMounted(cargar)
</script>

<style scoped>
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-header {
  background-color: #f9fafb;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.card-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #4b5563;
}

.card-body {
  padding: 1rem 1.5rem;
}

.alert {
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.alert-danger {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.table th {
  text-align: left;
  padding: 0.75rem 1rem;
  background-color: #f3f4f6;
  font-weight: 600;
  color: #4b5563;
  border-bottom: 2px solid #e5e7eb;
}

.table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.table tr:hover {
  background-color: #f9fafb;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: #ede9fe;
  color: #5b21b6;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.pill {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.pill--green {
  background-color: #dcfce7;
  color: #166534;
}

.pill--gray {
  background-color: #f3f4f6;
  color: #4b5563;
}
</style>
