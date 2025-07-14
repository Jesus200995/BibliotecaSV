import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Cargar variables de entorno según el modo
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue()],
    
    // Configuración del servidor de desarrollo
    server: {
      host: '0.0.0.0', // Permitir conexiones externas
      port: 5173,
      cors: true,
      // Proxy para desarrollo (solo en dev)
      proxy: mode === 'development' ? {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api')
        }
      } : undefined
    },
    
    // Configuración de build para producción
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'axios'],
          }
        }
      }
    },
    
    // Variables de entorno que se pasarán al cliente
    define: {
      __APP_ENV__: JSON.stringify(env.NODE_ENV)
    }
  }
})
