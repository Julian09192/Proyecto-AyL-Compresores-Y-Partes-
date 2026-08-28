import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validación rápida para que te asegures en la consola de que Vite está leyendo bien el .env
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ ¡CRÍTICO!: No se cargaron las variables de entorno de Supabase en el Frontend. Verifica tu archivo .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const obtenerPerfilUsuario = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('usuario') 
      .select('*')
      .eq('id', userId)
      .maybeSingle(); 

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al obtener perfil:", error.message);
    return null;
  }
};

export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};