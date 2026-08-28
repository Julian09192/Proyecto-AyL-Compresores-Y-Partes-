// src/lib/api.js
import { supabase } from './client';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Función para decodificar y validar token JWT
const isValidToken = (token) => {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp * 1000;
    // Margen de 5 segundos
    return Date.now() < (exp + 5000);
  } catch {
    return false;
  }
};

// Obtener token del localStorage (donde guardamos nuestro JWT personalizado)
const getStoredToken = () => {
  return localStorage.getItem('auth_token');
};

// Guardar token en localStorage
const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

// Función para refrescar el token personalizado
const refreshCustomToken = async () => {
  try {
    // Primero intentamos obtener una nueva sesión de Supabase
    const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError || !session) {
      console.warn('No se pudo refrescar la sesión de Supabase');
      return null;
    }

    // Luego intentamos obtener el token personalizado del backend
    const response = await fetch(`${API_BASE}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      }
    });

    if (!response.ok) {
      console.warn('Error al refrescar token personalizado');
      return null;
    }

    const data = await response.json();
    if (data.token) {
      setStoredToken(data.token);
      return data.token;
    }
    return null;
  } catch (error) {
    console.error('Error en refreshCustomToken:', error);
    return null;
  }
};

export const apiFetch = async (path, options = {}) => {
  try {
    // Obtener token personalizado del localStorage
    let token = getStoredToken();
    const headers = new Headers(options.headers || {});
    
    // Configurar Content-Type por defecto
    if (!headers.has('Content-Type') && options.body && typeof options.body === 'object') {
      headers.set('Content-Type', 'application/json');
    }

    // Función para hacer la petición
    const makeRequest = async (headersToUse) => {
      return fetch(`${API_BASE}${path}`, {
        ...options,
        headers: headersToUse,
        ...(options.method === 'GET' ? { body: undefined } : {})
      });
    };

    // Agregar token si existe y es válido
    if (token && isValidToken(token)) {
      headers.set('Authorization', `Bearer ${token}`);
    } else if (token && !isValidToken(token)) {
      console.warn('Token inválido o expirado, intentando refrescar...');
      token = await refreshCustomToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    let response = await makeRequest(headers);

    // Si recibimos 401 y tenemos token, intentar refrescar
    if (response.status === 401) {
      console.warn('Token expirado (401), intentando refrescar...');
      
      // Intentar refrescar el token personalizado
      const newToken = await refreshCustomToken();
      
      if (newToken) {
        // Actualizar headers con el nuevo token
        headers.set('Authorization', `Bearer ${newToken}`);
        console.log('Token refrescado exitosamente');
        
        // Reintentar la petición
        response = await makeRequest(headers);
      } else {
        // Si no se pudo refrescar, limpiar sesión
        console.warn('No se pudo refrescar el token, cerrando sesión...');
        localStorage.removeItem('auth_token');
        await supabase.auth.signOut();
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
    }

    // Procesar respuesta
    const contentType = response.headers.get('content-type') || '';
    let payload;
    
    if (contentType.includes('application/json')) {
      payload = await response.json();
    } else {
      const text = await response.text();
      try {
        payload = JSON.parse(text);
      } catch {
        payload = text;
      }
    }

    if (!response.ok) {
      // Si aún es 401, lanzar error específico
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        await supabase.auth.signOut();
        throw new Error('Sesión expirada');
      }
      throw new Error(payload?.error || payload?.message || `Error ${response.status}`);
    }

    return payload;

  } catch (error) {
    console.error('Error en apiFetch:', error);
    throw error;
  }
};

// Funciones específicas para cada método HTTP
export const apiGet = (path, options = {}) => {
  return apiFetch(path, { ...options, method: 'GET' });
};

export const apiPost = (path, body, options = {}) => {
  return apiFetch(path, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body)
  });
};

export const apiPut = (path, body, options = {}) => {
  return apiFetch(path, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body)
  });
};

export const apiDelete = (path, options = {}) => {
  return apiFetch(path, { ...options, method: 'DELETE' });
};

// Función para login que guarda el token
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en el login');
    }

    if (data.token) {
      setStoredToken(data.token);
    }

    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

// Función para logout
export const logout = async () => {
  try {
    setStoredToken(null);
    await supabase.auth.signOut();
    return true;
  } catch (error) {
    console.error('Error en logout:', error);
    return false;
  }
};

// Función para verificar autenticación
export const checkAuth = () => {
  const token = getStoredToken();
  return token && isValidToken(token);
};

// Función para obtener el usuario actual
export const getCurrentUser = async () => {
  try {
    const token = getStoredToken();
    if (!token || !isValidToken(token)) {
      return null;
    }

    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.usuario || null;
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error);
    return null;
  }
};