// backend/controllers/authController.js
import { supabase } from '../config/supabase.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "A&L_SECRET_KEY_2024";

export const authController = {
  // Registrar usuario
  async register(req, res) {
    try {
      const { nombre, correo, password, num_identificacion, num_celular, rol } = req.body;

      if (!nombre || !correo || !password) {
        return res.status(400).json({ 
          success: false,
          error: 'nombre, correo y password son requeridos' 
        });
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: correo,
        password: password,
        options: {
          data: {
            nombre: nombre,
            rol: rol || 'cliente'
          }
        }
      });

      if (authError) {
        return res.status(400).json({ 
          success: false,
          error: authError.message 
        });
      }

      const { data: usuario, error: userError } = await supabase
        .from('usuario')
        .insert({
          id: authData.user.id,
          nombre: nombre,
          num_identificacion: num_identificacion || null,
          correo: correo,
          num_celular: num_celular || null,
          rol: rol || 'cliente',
          creado_en: new Date().toISOString(),
          actualizado_en: new Date().toISOString()
        })
        .select();

      if (userError) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        return res.status(400).json({ 
          success: false,
          error: userError.message 
        });
      }

      const token = jwt.sign(
        { 
          id: usuario[0].id, 
          rol: usuario[0].rol, 
          nombre: usuario[0].nombre,
          email: usuario[0].correo
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        message: "Usuario registrado con éxito",
        token: token,
        usuario: {
          id: usuario[0].id,
          nombre: usuario[0].nombre,
          email: usuario[0].correo,
          rol: usuario[0].rol
        }
      });

    } catch (error) {
      console.error('Error en register:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  // Iniciar sesión
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: "Email y contraseña son requeridos" 
        });
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (authError) {
        return res.status(401).json({ 
          success: false, 
          message: "Credenciales incorrectas" 
        });
      }

      const { data: usuario, error: userError } = await supabase
        .from('usuario')
        .select('*')
        .eq('correo', email)
        .single();

      if (userError || !usuario) {
        return res.status(404).json({ 
          success: false, 
          message: "Usuario no encontrado en la base de datos" 
        });
      }

      const token = jwt.sign(
        { 
          id: usuario.id, 
          rol: usuario.rol, 
          nombre: usuario.nombre,
          email: usuario.correo
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        message: "Login exitoso",
        token: token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.correo,
          rol: usuario.rol,
          num_celular: usuario.num_celular
        },
        supabase_session: authData.session
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  // Refrescar token personalizado
  async refreshToken(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          success: false,
          error: 'Token de autenticación requerido' 
        });
      }

      const supabaseToken = authHeader.split(' ')[1];
      
      // Verificar token con Supabase
      const { data: { user }, error } = await supabase.auth.getUser(supabaseToken);
      
      if (error || !user) {
        return res.status(401).json({ 
          success: false,
          error: 'Token inválido o expirado' 
        });
      }

      // Obtener datos del usuario
      const { data: usuario, error: userError } = await supabase
        .from('usuario')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError || !usuario) {
        return res.status(404).json({ 
          success: false,
          error: 'Usuario no encontrado' 
        });
      }

      // Generar nuevo token personalizado
      const newToken = jwt.sign(
        { 
          id: usuario.id, 
          rol: usuario.rol, 
          nombre: usuario.nombre,
          email: usuario.correo
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token: newToken,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.correo,
          rol: usuario.rol
        }
      });

    } catch (error) {
      console.error('Error en refreshToken:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  // Verificar token personalizado
  async verificarToken(req, res) {
    try {
      if (!req.usuario) {
        return res.status(401).json({ 
          valido: false, 
          message: "Token inválido" 
        });
      }

      res.json({ 
        valido: true, 
        usuario: req.usuario 
      });
    } catch (error) {
      res.status(500).json({ 
        valido: false,
        error: error.message 
      });
    }
  },

  // Obtener usuario actual (desde token personalizado)
  async getCurrentUser(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          success: false,
          error: 'Token no proporcionado' 
        });
      }

      const token = authHeader.split(' ')[1];
      
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const { data: usuario, error } = await supabase
          .from('usuario')
          .select('*')
          .eq('id', decoded.id)
          .single();

        if (error || !usuario) {
          return res.status(404).json({ 
            success: false,
            error: 'Usuario no encontrado' 
          });
        }

        res.json({
          success: true,
          usuario: usuario
        });
      } catch (jwtError) {
        return res.status(401).json({ 
          success: false,
          error: 'Token inválido o expirado' 
        });
      }
    } catch (error) {
      console.error('Error en getCurrentUser:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  // Cerrar sesión
  async logout(req, res) {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      res.json({ 
        success: true, 
        message: "Sesión cerrada exitosamente" 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  // Recuperar contraseña
  async resetPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ 
          success: false,
          error: "Email es requerido" 
        });
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: process.env.FRONTEND_URL || 'http://localhost:5173/recuperar-password'
      });

      if (error) throw error;

      res.json({ 
        success: true, 
        message: "Correo de recuperación enviado" 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }
};