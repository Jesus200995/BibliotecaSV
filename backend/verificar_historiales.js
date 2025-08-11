const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function verificarHistoriales() {
  try {
    console.log('=== VERIFICANDO TABLA HISTORIALES ===');
    
    // 1. Verificar que la tabla existe
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'historiales'
      );
    `);
    
    console.log('¿Tabla historiales existe?', tableExists.rows[0].exists);
    
    if (!tableExists.rows[0].exists) {
      console.log('❌ La tabla historiales no existe! Creándola...');
      
      // Crear la tabla
      await pool.query(`
        CREATE TABLE historiales (
          id SERIAL PRIMARY KEY,
          archivo_id INTEGER NOT NULL REFERENCES catalogo_archivos(id) ON DELETE CASCADE,
          usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
          accion VARCHAR(50) NOT NULL DEFAULT 'subida',
          detalle TEXT,
          ip VARCHAR(45),
          user_agent TEXT,
          creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      
      // Crear índices
      await pool.query(`CREATE INDEX idx_historiales_archivo ON historiales (archivo_id);`);
      await pool.query(`CREATE INDEX idx_historiales_usuario ON historiales (usuario_id);`);
      await pool.query(`CREATE INDEX idx_historiales_creado_en ON historiales (creado_en DESC);`);
      
      console.log('✅ Tabla historiales creada exitosamente');
    }
    
    // 2. Verificar estructura de la tabla
    const tableStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'historiales' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\\n=== ESTRUCTURA DE LA TABLA HISTORIALES ===');
    tableStructure.rows.forEach(col => {
      console.log(`${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable}) default: ${col.column_default || 'none'}`);
    });
    
    // 3. Contar registros existentes
    const count = await pool.query('SELECT COUNT(*) FROM historiales');
    console.log('\\n=== DATOS EXISTENTES ===');
    console.log('Total de registros en historiales:', count.rows[0].count);
    
    // 4. Mostrar los últimos 5 registros
    const recent = await pool.query(`
      SELECT h.id, h.archivo_id, h.usuario_id, u.usuario, h.accion, h.detalle, h.creado_en
      FROM historiales h
      LEFT JOIN usuarios u ON h.usuario_id = u.id
      ORDER BY h.creado_en DESC
      LIMIT 5
    `);
    
    if (recent.rows.length > 0) {
      console.log('\\nÚltimos 5 registros:');
      recent.rows.forEach(row => {
        console.log(`ID: ${row.id}, Usuario: ${row.usuario || 'N/A'}, Archivo: ${row.archivo_id}, Acción: ${row.accion}, Fecha: ${row.creado_en}`);
      });
    } else {
      console.log('\\n⚠️  No hay registros en la tabla historiales');
    }
    
    // 5. Insertar un registro de prueba para verificar que funciona
    console.log('\\n=== PRUEBA DE INSERCIÓN ===');
    
    // Primero obtener un usuario y archivo de ejemplo
    const users = await pool.query('SELECT id, usuario FROM usuarios LIMIT 1');
    const files = await pool.query('SELECT id, nombre FROM catalogo_archivos LIMIT 1');
    
    if (users.rows.length > 0 && files.rows.length > 0) {
      const testInsert = await pool.query(`
        INSERT INTO historiales (archivo_id, usuario_id, accion, detalle, ip, user_agent)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, archivo_id, usuario_id, accion, detalle, creado_en
      `, [
        files.rows[0].id,
        users.rows[0].id,
        'test',
        'Registro de prueba para verificar funcionalidad',
        '127.0.0.1',
        'Test Script'
      ]);
      
      console.log('✅ Registro de prueba insertado:', testInsert.rows[0]);
      
      // Eliminar el registro de prueba
      await pool.query('DELETE FROM historiales WHERE id = $1', [testInsert.rows[0].id]);
      console.log('✅ Registro de prueba eliminado');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

verificarHistoriales();
