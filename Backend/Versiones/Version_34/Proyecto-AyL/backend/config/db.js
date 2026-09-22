import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Le dice a dotenv que busque el .env un nivel hacia arriba (en la raíz)
dotenv.config({ path: path.resolve('../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("⚠️ Falta configurar las variables de entorno de Supabase en el .env de la raíz");
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "");
export default supabase;