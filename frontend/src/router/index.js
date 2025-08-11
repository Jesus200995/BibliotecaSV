import { createRouter, createWebHistory } from 'vue-router'
import ArchivosView from '../components/ArchivosView.vue'
import MapaView from '../components/MapaView.vue'
import EstadisticasView from '../components/EstadisticasView.vue'
import LoginView from '../components/LoginView.vue'
import UsuariosView from '../components/UsuariosView.vue'
import HistorialesView from '../components/HistorialesView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/ArchivoTable.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/archivos',
    name: 'Archivos',
    component: ArchivosView,
    meta: { requiresAuth: true }
  },
  {
    path: '/mapa',
    name: 'Mapa',
    component: MapaView,
    meta: { requiresAuth: true }
  },
  {
    path: '/estadisticas',
    name: 'Estadisticas',
    component: EstadisticasView,
    meta: { requiresAuth: true }
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: UsuariosView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/historiales',
    name: 'Historiales',
    component: HistorialesView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegación global
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (to.meta?.requiresAuth && !token) return next('/login')
  if (to.meta?.requiresAdmin && user?.rol !== 'admin') return next('/')

  next()
})

export default router
