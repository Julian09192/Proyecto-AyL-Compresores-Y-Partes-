import { supabase } from './client';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiFetch = async (path, options = {}) => {
  try {
    // Obtener sesión actual
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.warn('Error al obtener sesión:', sessionError);
    }

    const token = sessionData?.session?.access_token;
    const headers = new Headers(options.headers || {});

    if (!headers.has('Content-Type') && options.body) {
      headers.set('Content-Type', 'application/json');
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('No hay token de autenticación disponible');
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      // Si es 401, intentar refrescar el token
      if (response.status === 401) {
        console.warn('Token expirado, intentando refrescar...');
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (!refreshError && refreshData?.session?.access_token) {
          // Reintentar con el nuevo token
          headers.set('Authorization', `Bearer ${refreshData.session.access_token}`);
          const retryResponse = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers
          });
          
          if (retryResponse.ok) {
            const retryPayload = retryResponse.headers.get('content-type')?.includes('application/json')
              ? await retryResponse.json()
              : await retryResponse.text();
            return retryPayload;
          }
        }
      }
      
      throw new Error(payload?.error || payload?.message || `Error ${response.status}`);
    }

    return payload;
  } catch (error) {
    console.error('Error en apiFetch:', error);
    throw error;
  }
};