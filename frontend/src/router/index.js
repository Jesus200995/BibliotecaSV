import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import DetalleArchivo from '../views/DetalleArchivo.vue'

const routes = [
  { 
    path: '/', 
    name: 'Dashboard',
    component: Dashboard 
  },
  { 
    path: '/archivo/:id', 
    name: 'DetalleArchivo',
    component: DetalleArchivo,
    props: true
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
