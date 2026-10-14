import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://adaiklmjaoajsyixpvgc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYWlrbG1qYW9hanN5aXhwdmdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MzkyMDAsImV4cCI6MjA5MzUxNTIwMH0.XG_N9KAcm0q4QjPl_LzEpRqL4wjyLP2vtklaA5PFvDk';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn("⚠️ Las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY no se detectaron directamente en Vite. Se está usando la configuración de respaldo.");
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