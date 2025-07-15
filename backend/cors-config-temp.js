// Configuración CORS más permisiva para debugging (TEMPORAL)
const corsOptions = {
  origin: function (origin, callback) {
    console.log(`🌐 CORS: Origen solicitado: ${origin || 'Sin origen'}`);
    
    if (process.env.NODE_ENV === 'production') {
      // En producción, temporalmente permitir todos los orígenes para debugging
      // TODO: Restringir a dominios específicos después de confirmar funcionamiento
      callback(null, true);
    } else {
      // En desarrollo, permitir todos
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'Origin',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 horas para preflight cache
};

// Aplicar CORS
app.use(cors(corsOptions));

// Middleware adicional para manejar preflight requests manualmente
app.use((req, res, next) => {
  // Agregar headers CORS manualmente como backup
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    console.log('🔄 Handling preflight request');
    res.status(204).send();
    return;
  }
  
  next();
});

// Middleware de parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de logging mejorado
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const clientIP = req.headers['x-forwarded-for'] || 
                   req.headers['x-real-ip'] || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress ||
                   'unknown';
  
  console.log(`${timestamp} - ${req.method} ${req.originalUrl} - IP: ${clientIP}`);
  console.log('User-Agent:', req.headers['user-agent'] || 'unknown');
  console.log('Origin:', req.headers.origin || 'no-origin');
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  
  next();
});

// Middleware para establecer headers de seguridad pero permitir acceso externo
app.use((req, res, next) => {
  // Headers de seguridad básicos
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('X-Frame-Options', 'SAMEORIGIN'); // Más permisivo que DENY
  
  next();
});
