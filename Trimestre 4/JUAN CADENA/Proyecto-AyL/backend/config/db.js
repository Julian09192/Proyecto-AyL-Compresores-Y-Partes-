import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Subimos dos niveles para encontrar el archivo .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Error Crítico: Faltan las variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el .env");
}

// Creamos el cliente oficial de Supabase
const db = createClient(supabaseUrl, supabaseAnonKey);

console.log('🚀 ¡Cliente de Supabase inicializado correctamente en el Backend!');

export default db;