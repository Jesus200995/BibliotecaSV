import api from '@/services/api'

export default {
  namespaced: true,

  state: {
    archivos: [],
    archivoActual: null,
    estadisticas: null,
    filtros: {
      busqueda: '',
      tipo_archivo: '',
      tema: '',
      entidad: '',
      municipio: '',
      territorio: '',
      responsable: '',
      nivel_validacion: '',
      fecha_desde: null,
      fecha_hasta: null
    },
    paginacion: {
      pagina: 1,
      porPagina: 20,
      total: 0,
      totalPaginas: 0
    },
    valoresFiltros: {
      tipos_archivo: [],
      temas: [],
      entidades: [],
      municipios: [],
      territorios: [],
      responsables: [],
      niveles_validacion: []
    },
    loading: false,
    error: null
  },

  mutations: {
    SET_ARCHIVOS (state, { archivos, total, pagina, porPagina, totalPaginas }) {
      state.archivos = archivos
      state.paginacion = { total, pagina, porPagina, totalPaginas }
    },

    SET_ARCHIVO_ACTUAL (state, archivo) {
      state.archivoActual = archivo
    },

    SET_ESTADISTICAS (state, estadisticas) {
      state.estadisticas = estadisticas
    },

    SET_FILTROS (state, filtros) {
      state.filtros = { ...state.filtros, ...filtros }
    },

    SET_VALORES_FILTROS (state, valores) {
      state.valoresFiltros = valores
    },

    SET_LOADING (state, loading) {
      state.loading = loading
    },

    SET_ERROR (state, error) {
      state.error = error
    },

    CLEAR_ERROR (state) {
      state.error = null
    },

    RESET_FILTROS (state) {
      state.filtros = {
        busqueda: '',
        tipo_archivo: '',
        tema: '',
        entidad: '',
        municipio: '',
        territorio: '',
        responsable: '',
        nivel_validacion: '',
        fecha_desde: null,
        fecha_hasta: null
      }
      state.paginacion.pagina = 1
    }
  },

  actions: {
    async cargarArchivos ({ commit, state }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const params = {
          ...state.filtros,
          pagina: state.paginacion.pagina,
          porPagina: state.paginacion.porPagina
        }

        // Filtrar parámetros vacíos
        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key]
          }
        })

        const response = await api.get('/archivos/', { params })
        commit('SET_ARCHIVOS', response.data)
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.detail || 'Error al cargar archivos')
        console.error('Error cargando archivos:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async cargarArchivoDetalle ({ commit }, id) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await api.get(`/archivos/${id}`)
        commit('SET_ARCHIVO_ACTUAL', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.detail || 'Error al cargar archivo')
        console.error('Error cargando archivo:', error)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async cargarEstadisticas ({ commit }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await api.get('/archivos/estadisticas/resumen')
        commit('SET_ESTADISTICAS', response.data)
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.detail || 'Error al cargar estadísticas')
        console.error('Error cargando estadísticas:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async cargarValoresFiltros ({ commit }) {
      try {
        const response = await api.get('/archivos/filtros/valores')
        commit('SET_VALORES_FILTROS', response.data)
      } catch (error) {
        console.error('Error cargando valores de filtros:', error)
      }
    },

    aplicarFiltros ({ commit, dispatch }, filtros) {
      commit('SET_FILTROS', filtros)
      commit('SET_FILTROS', { pagina: 1 }) // Reset a página 1
      return dispatch('cargarArchivos')
    },

    cambiarPagina ({ commit, dispatch }, pagina) {
      commit('SET_FILTROS', { pagina })
      return dispatch('cargarArchivos')
    },

    limpiarFiltros ({ commit, dispatch }) {
      commit('RESET_FILTROS')
      return dispatch('cargarArchivos')
    }
  },

  getters: {
    archivosGeo: (state) => {
      return state.archivos.filter(archivo =>
        archivo.tipo_archivo &&
        (archivo.tipo_archivo.toLowerCase().includes('shp') ||
         archivo.tipo_archivo.toLowerCase().includes('geojson') ||
         archivo.tipo_archivo.toLowerCase().includes('kml'))
      )
    },

    tieneArchivosGeo: (state, getters) => {
      return getters.archivosGeo.length > 0
    },

    filtrosActivos: (state) => {
      const filtros = state.filtros
      return Object.keys(filtros).some(key => {
        const valor = filtros[key]
        return valor !== '' && valor !== null && valor !== undefined
      })
    }
  }
}
