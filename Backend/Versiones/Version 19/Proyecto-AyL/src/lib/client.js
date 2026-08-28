// src/lib/client.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Función para sincronizar usuario de Supabase con tu backend
export const syncSupabaseUser = async (supabaseUser) => {
  if (!supabaseUser) return null;
  
  try {
    const response = await fetch("http://localhost:3001/auth/sync-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: supabaseUser.email,
        nombre: supabaseUser.user_metadata?.full_name || supabaseUser.email.split('@')[0],
        supabase_id: supabaseUser.id,
        avatar_url: supabaseUser.user_metadata?.avatar_url || null
      })
    });
    
    const data = await response.json();
    if (response.ok && data.success) {
      return {
        id: data.usuario.id,
        nombre: data.usuario.nombre,
        email: data.usuario.email,
        rol: data.usuario.rol,
        avatar_url: data.usuario.avatar_url
      };
    }
    return null;
  } catch (error) {
    console.error("Error sincronizando usuario:", error);
    return null;
  }
};

// Función para escuchar cambios en autenticación
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};