const { Pool } = require('pg');

// Configuración de la base de datos usando las mismas variables
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || '31.97.8.51',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'sembrandodatos',
  user: process.env.DB_USER || 'jesus',
  password: process.env.DB_PASSWORD || '2025'
});

async function probarQuery() {
  try {
    console.log('=== PRUEBA DIRECTA DE QUERY ===');
    
    // 1. Obtener todos los historiales primero
    const todosQuery = `
      SELECT 
        h.id,
        h.archivo_id,
        ca.nombre as archivo_nombre,
        h.usuario_id,
        u.usuario as usuario,
        h.accion,
        h.detalle,
        h.ip,
        h.user_agent,
        h.creado_en
      FROM historiales h
      LEFT JOIN usuarios u ON h.usuario_id = u.id
      LEFT JOIN catalogo_archivos ca ON h.archivo_id = ca.id
      ORDER BY h.creado_en DESC
      LIMIT 50 OFFSET 0
    `;
    
    const todosResult = await pool.query(todosQuery, []);
    console.log('✅ Todos los historiales:', todosResult.rows.length);
    
    if (todosResult.rows.length > 0) {
      const primerRegistro = todosResult.rows[0];
      console.log('Primer registro:', primerRegistro);
      
      // 2. Probar query filtrada por usuario
      const usuarioId = primerRegistro.usuario_id;
      console.log('\\nProbando filtro por usuario_id:', usuarioId);
      
      const queryFiltrada = `
        SELECT 
          h.id,
          h.archivo_id,
          ca.nombre as archivo_nombre,
          h.usuario_id,
          u.usuario as usuario,
          h.accion,
          h.detalle,
          h.ip,
          h.user_agent,
          h.creado_en
        FROM historiales h
        LEFT JOIN usuarios u ON h.usuario_id = u.id
        LEFT JOIN catalogo_archivos ca ON h.archivo_id = ca.id
        WHERE h.usuario_id = $1
        ORDER BY h.creado_en DESC
        LIMIT $2 OFFSET $3
      `;
      
      const params = [usuarioId, 50, 0];
      console.log('Query:', queryFiltrada);
      console.log('Parámetros:', params);
      
      const resultadoFiltrado = await pool.query(queryFiltrada, params);
      console.log('✅ Query filtrada exitosa. Registros:', resultadoFiltrado.rows.length);
      
    } else {
      console.log('No hay historiales para probar');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

probarQuery();
