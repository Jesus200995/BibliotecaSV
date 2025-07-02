import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Archivos from '@/views/Archivos.vue'
import DetalleArchivo from '@/views/DetalleArchivo.vue'
import Mapas from '@/views/Mapas.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/archivos',
    name: 'Archivos',
    component: Archivos
  },
  {
    path: '/archivo/:id',
    name: 'DetalleArchivo',
    component: DetalleArchivo,
    props: true
  },
  {
    path: '/mapas',
    name: 'Mapas',
    component: Mapas
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
