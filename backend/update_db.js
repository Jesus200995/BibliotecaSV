const { Pool } = require('pg');
require('dotenv').config();

// Si existe un archivo .env.local, cargar sus variables
try {
    require('dotenv').config({ path: '.env.local' });
    console.log('Cargando configuración desde .env.local');
} catch (error) {
    console.log('No se encontró .env.local, usando .env');
}

// Configuración de la conexión a PostgreSQL
const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

console.log('Configuración de base de datos:', {
    host: dbConfig.host,
    database: dbConfig.database,
    port: dbConfig.port,
    ssl: !!dbConfig.ssl
});

// Crear pool de conexiones
const pool = new Pool(dbConfig);

async function setupDb() {
    try {
        // Comprobar conexión
        console.log('Comprobando conexión a la base de datos...');
        await pool.query('SELECT NOW()');
        console.log('Conexión exitosa a PostgreSQL');
        
        console.log('Modificando tabla catalogo_archivos para almacenar contenido binario...');
        // Primero verificamos si la columna archivo_contenido ya existe
        const checkColumnResult = await pool.query(`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'catalogo_archivos' AND column_name = 'archivo_contenido';
        `);
        
        // Si la columna no existe, la agregamos
        if (checkColumnResult.rows.length === 0) {
            console.log('Agregando columna archivo_contenido a la tabla catalogo_archivos...');
            await pool.query(`
                ALTER TABLE catalogo_archivos
                ADD COLUMN archivo_contenido BYTEA;
            `);
            console.log('Columna archivo_contenido agregada correctamente');
        } else {
            console.log('La columna archivo_contenido ya existe en la tabla');
        }
        
        console.log('Actualización de base de datos completada correctamente');
    } catch (error) {
        console.error('Error al configurar la base de datos:', error);
    } finally {
        await pool.end();
    }
}

setupDb();
