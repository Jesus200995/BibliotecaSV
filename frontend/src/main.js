import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// Importar los iconos de Element Plus globalmente
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// Registrar todos los iconos de Element Plus
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus).mount('#app')
