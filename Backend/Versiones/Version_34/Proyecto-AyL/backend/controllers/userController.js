// backend/controllers/userController.js
import { supabase } from '../config/supabase.js';
import { describirCambios, registrarBitacora } from '../utils/bitacora.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "A&L_SECRET_KEY_2024";
const columnasUsuario = 'id, nombre, num_identificacion, correo, num_celular, rol, creado_en, actualizado_en, suspendido';

const estaUsuarioSuspendido = (usuario = {}) => {
  if (usuario.suspendido === true || usuario.suspendido === 1 || usuario.suspendido === 'true' || usuario.suspendido === '1') {
    return true;
  }
  if (usuario.rol === 'deshabilitado') {
    return true;
  }
  return false;
};

const normalizarUsuarios = (usuarios = []) => {
  return usuarios.map((usuario) => ({
    ...usuario,
    suspendido: estaUsuarioSuspendido(usuario)
  }));
};

const consultarUsuarios = async () => {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select(columnasUsuario)
      .order('nombre');

    if (error) throw error;
    return normalizarUsuarios(data || []);
  } catch (error) {
    console.error('Error al consultar usuarios:', error);
    throw error;
  }
};

const consultarUsuarioPorId = async (id) => {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select(columnasUsuario)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (data) {
      return { ...data, suspendido: estaUsuarioSuspendido(data) };
    }
    return null;
  } catch (error) {
    console.error('Error al consultar usuario por ID:', error);
    throw error;
  }
};

export const userController = {

  async syncUser(req, res) {
    try {
      const { id, email, usuario } = req.body;

      if (!id || !email) {
        return res.status(400).json({
          success: false,
          error: 'id y email son requeridos'
        });
      }

      const { data: existe, error: errorExiste } = await supabase
        .from('usuario')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (errorExiste) throw errorExiste;

      let usuarioData;

      if (existe) {
        usuarioData = {
          ...existe,
          suspendido: estaUsuarioSuspendido(existe)
        };
      } else {
        const nombreUsuario = usuario || email.split('@')[0];

        const { data: nuevo, error: errorNuevo } = await supabase
          .from('usuario')
          .insert({
            id: id,
            correo: email,
            nombre: nombreUsuario,
            usuario: nombreUsuario,
            rol: 'cliente',
            suspendido: false,
            creado_en: new Date().toISOString(),
            actualizado_en: new Date().toISOString()
          })
          .select()
          .single();

        if (errorNuevo) throw errorNuevo;

        usuarioData = {
          ...nuevo,
          suspendido: false
        };
      }

      res.json({
        success: true,
        usuario: usuarioData
      });

    } catch (error) {
      console.error('Error en syncUser:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  async getAll(req, res) {
    try {
      const data = await consultarUsuarios();
      res.json(data);
    } catch (error) {
      console.error('Error en getAll:', error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await consultarUsuarioPorId(id);
      if (!data) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(data);
    } catch (error) {
      console.error('Error en getById:', error);
      res.status(500).json({ error: 'Error al obtener usuario' });
    }
  },

  async getRol(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('usuario')
        .select('nombre, rol')
        .eq('id', id)
        .single();

      if (error) throw error;
      res.json(data || { message: "Usuario no encontrado" });
    } catch (error) {
      console.error('Error en getRol:', error);
      res.status(500).json({ error: 'Error al obtener rol' });
    }
  },

  async create(req, res) {
    try {
      const { nombre, num_identificacion, correo, num_celular, rol } = req.body;

      if (!nombre || !correo || !rol) {
        return res.status(400).json({
          error: 'nombre, correo y rol son requeridos'
        });
      }

      const { data: existe, error: errorExiste } = await supabase
        .from('usuario')
        .select('correo')
        .eq('correo', correo)
        .maybeSingle();

      if (existe) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
      }

      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: correo,
        password: 'temporal123',
        email_confirm: true,
        user_metadata: {
          nombre: nombre,
          rol: rol
        }
      });

      if (authError) {
        return res.status(400).json({ error: authError.message });
      }

      const { data, error } = await supabase
        .from('usuario')
        .insert({
          id: authData.user.id,
          nombre,
          num_identificacion: num_identificacion || null,
          correo,
          num_celular: num_celular || null,
          rol: rol || 'cliente',
          suspendido: false,
          creado_en: new Date().toISOString(),
          actualizado_en: new Date().toISOString()
        })
        .select();

      if (error) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        return res.status(400).json({ error: error.message });
      }

      await registrarBitacora({
        accion: 'INSERT',
        modulo: 'Usuarios',
        detalles: `Usuario ${data[0].correo} creado con rol ${data[0].rol}`,
        usuario: req.usuario
      });

      res.status(201).json({
        message: "Usuario creado con éxito",
        id: data[0].id,
        usuario: data[0]
      });
    } catch (error) {
      console.error('Error en create:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nombre, num_identificacion, correo, num_celular, rol, suspendido } = req.body;

      const usuarioActual = await consultarUsuarioPorId(id);
      if (!usuarioActual) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const updates = {};
      if (nombre !== undefined) updates.nombre = nombre;
      if (num_identificacion !== undefined) updates.num_identificacion = num_identificacion;
      if (correo !== undefined) updates.correo = correo;
      if (num_celular !== undefined) updates.num_celular = num_celular;

      if (rol !== undefined && rol !== 'deshabilitado') {
        updates.rol = rol;
      }

      if (suspendido !== undefined) {
        updates.suspendido = suspendido === true || suspendido === 'true' || suspendido === 1 || suspendido === '1';
      } else if (rol === 'deshabilitado') {
        updates.suspendido = true;
      }

      updates.actualizado_en = new Date().toISOString();

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
      }

      const { data, error } = await supabase
        .from('usuario')
        .update(updates)
        .eq('id', id)
        .select(columnasUsuario);

      if (error) {
        console.error("Error en update de Supabase:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const usuarioActualizado = {
        ...data[0],
        suspendido: data[0].suspendido === true
      };

      await registrarBitacora({
        accion: 'UPDATE',
        modulo: 'Usuarios',
        detalles: `Usuario ${usuarioActualizado.correo} actualizado`,
        usuario: req.usuario
      });

      res.json({
        message: 'Usuario actualizado con éxito',
        usuario: usuarioActualizado
      });

    } catch (error) {
      console.error('Error en update usuario:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const { data: existe, error: errorExiste } = await supabase
        .from('usuario')
        .select('id')
        .eq('id', id)
        .single();

      if (errorExiste || !existe) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      if (authError) {
        return res.status(400).json({ error: authError.message });
      }

      const { error } = await supabase
        .from('usuario')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await registrarBitacora({
        accion: 'DELETE',
        modulo: 'Usuarios',
        detalles: `Usuario ${id} eliminado`,
        usuario: req.usuario
      });

      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      console.error('Error en delete:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async buscar(req, res) {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
      }

      const { data, error } = await supabase
        .from('usuario')
        .select('id, nombre, num_identificacion, correo, num_celular, rol, suspendido')
        .or(`nombre.ilike.%${query}%,correo.ilike.%${query}%`)
        .order('nombre');

      if (error) throw error;

      const usuariosNormalizados = normalizarUsuarios(data || []);
      res.json(usuariosNormalizados);
    } catch (error) {
      console.error('Error en buscar:', error);
      res.status(500).json({ error: 'Error al buscar usuarios' });
    }
  }
};