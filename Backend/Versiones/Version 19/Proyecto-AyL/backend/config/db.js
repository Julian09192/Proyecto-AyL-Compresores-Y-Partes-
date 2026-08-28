/* global process */
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenemos la ruta absoluta de este archivo (db.js)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Subimos dos niveles desde 'backend/config/' para llegar a la raíz principal donde está el .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = pg;

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error al conectar con la base de datos:', err.stack);
  }
  console.log('🚀 ¡Conexión exitosa a la base de datos!');
  release();
});

export default db;