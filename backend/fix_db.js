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

async function fixDb() {
    try {
        // Comprobar conexión
        console.log('Comprobando conexión a la base de datos...');
        await pool.query('SELECT NOW()');
        console.log('Conexión exitosa a PostgreSQL');
        
        console.log('Verificando la estructura de la tabla catalogo_archivos...');
        
        // Primero verificamos si la tabla catalogo_archivos existe
        const checkTableResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'catalogo_archivos';
        `);
        
        if (checkTableResult.rows.length === 0) {
            console.log('¡La tabla catalogo_archivos no existe! Creándola...');
            await pool.query(`
                CREATE TABLE catalogo_archivos (
                    id SERIAL PRIMARY KEY,
                    nombre VARCHAR(255) NOT NULL,
                    descripcion TEXT,
                    tipo VARCHAR(50),
                    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    tamano BIGINT,
                    etiquetas TEXT,
                    archivo_url TEXT,
                    fuente TEXT,
                    responsable TEXT,
                    alcance_geografico TEXT,
                    validacion TEXT,
                    observaciones TEXT,
                    archivo_contenido BYTEA
                );
            `);
            console.log('Tabla catalogo_archivos creada correctamente');
        } else {
            console.log('La tabla catalogo_archivos ya existe');
            
            // Verificamos si la columna archivo_contenido ya existe
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
        }
        
        console.log('Estructura de base de datos verificada y corregida correctamente');
        console.log('Puedes usar la aplicación normalmente ahora');
    } catch (error) {
        console.error('Error al configurar la base de datos:', error);
    } finally {
        await pool.end();
    }
}

fixDb();
