// backend/middleware/auth.js
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || "A&L_SECRET_KEY_2024";

export const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    // ✅ CORREGIDO: Verificar si NO hay token
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: "Token requerido" 
      });
    }

    // Intentar verificar con JWT personalizado
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Verificar que el usuario existe en la base de datos
      const { data: usuario, error } = await supabase
        .from('usuario')
        .select('id, rol, nombre, correo, suspendido')
        .eq('id', decoded.id)
        .single();

      if (error || !usuario) {
        return res.status(401).json({ 
          success: false,
          error: 'Usuario no encontrado' 
        });
      }

      // Verificar si el usuario está suspendido
      if (usuario.suspendido === true) {
        return res.status(403).json({ 
          success: false,
          error: 'Usuario suspendido' 
        });
      }

      req.usuario = usuario;
      return next();
      
    } catch (jwtError) {
      // Si falla el JWT personalizado, intentar con Supabase
      try {
        const { data: { user }, error: supabaseError } = await supabase.auth.getUser(token);
        
        if (supabaseError || !user) {
          return res.status(401).json({ 
            success: false,
            error: 'Token inválido o expirado' 
          });
        }

        // Obtener datos del usuario de nuestra tabla
        const { data: usuario, error: userError } = await supabase
          .from('usuario')
          .select('id, rol, nombre, correo, suspendido')
          .eq('id', user.id)
          .single();

        if (userError || !usuario) {
          return res.status(401).json({ 
            success: false,
            error: 'Usuario no encontrado' 
          });
        }

        if (usuario.suspendido === true) {
          return res.status(403).json({ 
            success: false,
            error: 'Usuario suspendido' 
          });
        }

        req.usuario = usuario;
        return next();
        
      } catch (supabaseError) {
        return res.status(401).json({ 
          success: false,
          error: 'Token inválido o expirado' 
        });
      }
    }
  } catch (error) {
    console.error('Error en verificarToken:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Error al verificar token' 
    });
  }
};

export const verificarAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    // ✅ CORREGIDO: Verificar si NO hay token
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: "Token requerido" 
      });
    }

    // Verificar token
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Verificar si es admin
      if (decoded.rol !== "admin") {
        return res.status(403).json({ 
          success: false,
          error: "Solo el administrador puede realizar esta acción" 
        });
      }

      // Verificar que el usuario existe
      const { data: usuario, error } = await supabase
        .from('usuario')
        .select('id, rol, nombre, correo, suspendido')
        .eq('id', decoded.id)
        .single();

      if (error || !usuario) {
        return res.status(401).json({ 
          success: false,
          error: 'Usuario no encontrado' 
        });
      }

      if (usuario.suspendido === true) {
        return res.status(403).json({ 
          success: false,
          error: 'Usuario suspendido' 
        });
      }

      req.usuario = usuario;
      next();
      
    } catch (jwtError) {
      // Intentar con Supabase
      try {
        const { data: { user }, error: supabaseError } = await supabase.auth.getUser(token);
        
        if (supabaseError || !user) {
          return res.status(401).json({ 
            success: false,
            error: 'Token inválido o expirado' 
          });
        }

        const { data: usuario, error: userError } = await supabase
          .from('usuario')
          .select('id, rol, nombre, correo, suspendido')
          .eq('id', user.id)
          .single();

        if (userError || !usuario) {
          return res.status(401).json({ 
            success: false,
            error: 'Usuario no encontrado' 
          });
        }

        if (usuario.rol !== "admin") {
          return res.status(403).json({ 
            success: false,
            error: "Solo el administrador puede realizar esta acción" 
          });
        }

        if (usuario.suspendido === true) {
          return res.status(403).json({ 
            success: false,
            error: 'Usuario suspendido' 
          });
        }

        req.usuario = usuario;
        next();
        
      } catch (supabaseError) {
        return res.status(401).json({ 
          success: false,
          error: 'Token inválido o expirado' 
        });
      }
    }
  } catch (error) {
    console.error('Error en verificarAdmin:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Error al verificar permisos' 
    });
  }
};

// Middleware para verificar permisos específicos
export const verificarPermisos = (rolesPermitidos) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

      if (!token) {
        return res.status(401).json({ 
          success: false,
          error: "Token requerido" 
        });
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (!rolesPermitidos.includes(decoded.rol)) {
          return res.status(403).json({ 
            success: false,
            error: 'Acceso denegado. No tienes los permisos necesarios.' 
          });
        }

        const { data: usuario, error } = await supabase
          .from('usuario')
          .select('id, rol, nombre, correo, suspendido')
          .eq('id', decoded.id)
          .single();

        if (error || !usuario) {
          return res.status(401).json({ 
            success: false,
            error: 'Usuario no encontrado' 
          });
        }

        if (usuario.suspendido === true) {
          return res.status(403).json({ 
            success: false,
            error: 'Usuario suspendido' 
          });
        }

        req.usuario = usuario;
        next();
        
      } catch (jwtError) {
        return res.status(401).json({ 
          success: false,
          error: 'Token inválido o expirado' 
        });
      }
    } catch (error) {
      console.error('Error en verificarPermisos:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Error al verificar permisos' 
      });
    }
  };
};