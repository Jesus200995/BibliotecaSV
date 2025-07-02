import Vue from 'vue'
import VueRouter from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      title: 'Dashboard',
      icon: 'fas fa-tachometer-alt'
    }
  },
  {
    path: '/archivos',
    name: 'Archivos',
    component: () => import('../views/ArchivosView.vue'),
    meta: {
      title: 'Catálogo de Archivos',
      icon: 'fas fa-folder-open'
    }
  },
  {
    path: '/archivos/:id',
    name: 'DetalleArchivo',
    component: () => import('../views/DetalleArchivoView.vue'),
    meta: {
      title: 'Detalle del Archivo',
      icon: 'fas fa-file-alt'
    }
  },
  {
    path: '/mapa',
    name: 'Mapa',
    component: () => import('../views/MapaView.vue'),
    meta: {
      title: 'Visor de Mapas',
      icon: 'fas fa-map'
    }
  },
  {
    path: '/estadisticas',
    name: 'Estadisticas',
    component: () => import('../views/EstadisticasView.vue'),
    meta: {
      title: 'Estadísticas',
      icon: 'fas fa-chart-bar'
    }
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      title: 'Página no encontrada'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // Actualizar título de la página
  if (to.meta.title) {
    document.title = `${to.meta.title} - Biblioteca de Datos Web`
  } else {
    document.title = 'Biblioteca de Datos Web - Sembrando Vida'
  }
  next()
})

export default router
