module.exports = {
  apps: [{
    name: 'biblioteca-backend',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 4000,
      HTTP_PORT: 80
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,  // Puerto interno para Nginx proxy
      HTTP_PORT: 80
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
