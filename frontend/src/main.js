import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Bootstrap Vue
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// FontAwesome
import '@fortawesome/fontawesome-free/css/all.css'

// Leaflet CSS
import 'leaflet/dist/leaflet.css'

// Vue Moment
import VueMoment from 'vue-moment'
import moment from 'moment'
import 'moment/locale/es'

// Configurar locale español
moment.locale('es')

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueMoment, { moment })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
