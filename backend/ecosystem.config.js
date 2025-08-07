module.exports = {
  apps: [{
    name: 'biblioteca-backend',
    script: './index.js',
    cwd: '/var/www/biblioteca-api/backend',
    
    // Configuración de entorno
    env: {
      NODE_ENV: 'development',
      PORT: 4000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    
    // Configuración del proceso
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    
    // Configuración de logs
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Configuración de red
    listen_timeout: 10000,
    kill_timeout: 5000,
    
    // Variables específicas para producción
    env_production: {
      NODE_ENV: 'production',
      PORT: 4000,
      // Estas serán sobrescritas por el archivo .env.production
    },
    
    // Configuración avanzada
    node_args: '--max-old-space-size=256',
    
    // Configuración de restart
    min_uptime: '10s',
    max_restarts: 10,
    
    // Configuración de monitoreo
    pmx: true,
    
    // Script de pre-deploy (opcional)
    // pre_deploy: 'npm install --production',
    
    // Script post-deploy (opcional)  
    // post_deploy: 'echo "Deployment completed"'
  }]
}
