import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const obtenerPerfilUsuario = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('id', userId)
      .maybeSingle(); // Usamos maybeSingle para evitar error 406 si no existe fila

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