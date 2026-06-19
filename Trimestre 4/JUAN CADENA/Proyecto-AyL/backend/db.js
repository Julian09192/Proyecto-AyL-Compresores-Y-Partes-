import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error Crítico: Faltan las variables SUPABASE_URL o SUPABASE_SERVICE_KEY en el .env");
  process.exit(1);
}

// Cliente único con la Service Key (omite RLS, ideal para el backend)
const db = createClient(supabaseUrl, supabaseKey);

console.log('🚀 ¡Cliente de Supabase (Service Role) inicializado correctamente en el Backend!');

export default db;