import { supabase } from '../config/supabase.js';

export const userController = {
  // Obtener todos los usuarios
  async getAll(req, res) {
    try {
      const { data, error } = await supabase
        .from('usuario')
        .select('id, nombre, num_identificacion, correo, num_celular, rol, creado_en, actualizado_en')
        .order('nombre');

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener usuario por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('usuario')
        .select('id, nombre, num_identificacion, correo, num_celular, rol, creado_en, actualizado_en')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener rol de usuario
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
      res.status(500).json({ error: error.message });
    }
  },

  // Crear usuario (solo admin) - Sin password porque usa Supabase Auth
  async create(req, res) {
    try {
      const { nombre, num_identificacion, correo, num_celular, rol } = req.body;

      if (!nombre || !correo || !rol) {
        return res.status(400).json({ 
          error: 'nombre, correo y rol son requeridos' 
        });
      }

      // Verificar si el correo ya existe
      const { data: existe, error: errorExiste } = await supabase
        .from('usuario')
        .select('correo')
        .eq('correo', correo)
        .single();

      if (existe) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
      }

      // Crear usuario en Supabase Auth (con contraseña temporal)
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

      // Crear usuario en tu tabla
      const { data, error } = await supabase
        .from('usuario')
        .insert({
          id: authData.user.id,
          nombre,
          num_identificacion: num_identificacion || null,
          correo,
          num_celular: num_celular || null,
          rol: rol || 'cliente',
          creado_en: new Date().toISOString(),
          actualizado_en: new Date().toISOString()
        })
        .select();

      if (error) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        return res.status(400).json({ error: error.message });
      }

      res.status(201).json({ 
        message: "Usuario creado con éxito", 
        id: data[0].id,
        usuario: data[0]
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar usuario
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nombre, num_identificacion, correo, num_celular, rol } = req.body;

      const updates = {};
      if (nombre !== undefined) updates.nombre = nombre;
      if (num_identificacion !== undefined) updates.num_identificacion = num_identificacion;
      if (correo !== undefined) updates.correo = correo;
      if (num_celular !== undefined) updates.num_celular = num_celular;
      if (rol !== undefined) updates.rol = rol;
      
      updates.actualizado_en = new Date().toISOString();

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
      }

      const { data, error } = await supabase
        .from('usuario')
        .update(updates)
        .eq('id', id)
        .select('id, nombre, num_identificacion, correo, num_celular, rol, creado_en, actualizado_en');

      if (error) throw error;
      if (data.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json({ 
        message: "Usuario actualizado correctamente",
        usuario: data[0]
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar usuario
  async delete(req, res) {
    try {
      const { id } = req.params;

      // Verificar si el usuario existe
      const { data: existe, error: errorExiste } = await supabase
        .from('usuario')
        .select('id')
        .eq('id', id)
        .single();

      if (errorExiste || !existe) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Eliminar de Supabase Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      if (authError) {
        return res.status(400).json({ error: authError.message });
      }

      // Eliminar de tu tabla
      const { error } = await supabase
        .from('usuario')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Buscar usuarios
  async buscar(req, res) {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
      }

      const { data, error } = await supabase
        .from('usuario')
        .select('id, nombre, num_identificacion, correo, num_celular, rol')
        .or(`nombre.ilike.%${query}%,correo.ilike.%${query}%`)
        .order('nombre');

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};