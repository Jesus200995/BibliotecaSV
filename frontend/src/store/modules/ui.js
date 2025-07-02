export default {
  namespaced: true,

  state: {
    sidebarCollapsed: false,
    breadcrumbs: [],
    notifications: [],
    theme: 'light'
  },

  mutations: {
    TOGGLE_SIDEBAR (state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },

    SET_SIDEBAR_COLLAPSED (state, collapsed) {
      state.sidebarCollapsed = collapsed
    },

    SET_BREADCRUMBS (state, breadcrumbs) {
      state.breadcrumbs = breadcrumbs
    },

    ADD_NOTIFICATION (state, notification) {
      const id = Date.now() + Math.random()
      state.notifications.push({
        id,
        type: 'info',
        autoClose: true,
        duration: 5000,
        ...notification
      })
    },

    REMOVE_NOTIFICATION (state, id) {
      state.notifications = state.notifications.filter(n => n.id !== id)
    },

    SET_THEME (state, theme) {
      state.theme = theme
    }
  },

  actions: {
    toggleSidebar ({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },

    setSidebarCollapsed ({ commit }, collapsed) {
      commit('SET_SIDEBAR_COLLAPSED', collapsed)
    },

    setBreadcrumbs ({ commit }, breadcrumbs) {
      commit('SET_BREADCRUMBS', breadcrumbs)
    },

    showNotification ({ commit }, notification) {
      commit('ADD_NOTIFICATION', notification)

      if (notification.autoClose !== false) {
        setTimeout(() => {
          commit('REMOVE_NOTIFICATION', notification.id)
        }, notification.duration || 5000)
      }
    },

    removeNotification ({ commit }, id) {
      commit('REMOVE_NOTIFICATION', id)
    },

    setTheme ({ commit }, theme) {
      commit('SET_THEME', theme)
      localStorage.setItem('biblioteca-theme', theme)
    }
  }
}
