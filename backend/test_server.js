const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

app.get('/test', async (req, res) => {
  try {
    console.log('=== TEST ENDPOINT ===');
    console.log('Query params:', req.query);
    
    const archivo_id = req.query.archivo_id ? parseInt(req.query.archivo_id) : null;
    console.log('archivo_id parsed:', archivo_id);
    
    if (archivo_id) {
      const query = `
        SELECT 
          h.id,
          h.archivo_id,
          h.usuario_id,
          h.accion,
          h.detalle
        FROM historiales h
        WHERE h.archivo_id = $1
        LIMIT $2 OFFSET $3
      `;
      
      const params = [archivo_id, 50, 0];
      console.log('Query:', query);
      console.log('Params:', params);
      
      const result = await pool.query(query, params);
      console.log('Result rows:', result.rows.length);
      
      res.json({ ok: true, data: result.rows, count: result.rows.length });
    } else {
      res.json({ ok: true, message: 'No filter provided' });
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ ok: false, error: error.message });
  }
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});
