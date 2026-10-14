import { supabase } from '../config/supabase.js';

export const resenaController = {
  // Obtener todas las reseñas
  async getAll(req, res) {
    try {
      const { data, error } = await supabase
        .from('resenas_producto')
        .select(`
          *,
          producto:producto_id (id, nombre, marca),
          usuario_data:usuario_id (id, nombre, correo)
        `)
        .order('creado_el', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener reseña por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('resenas_producto')
        .select(`
          *,
          producto:producto_id (id, nombre, marca),
          usuario_data:usuario_id (id, nombre, correo)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ message: 'Reseña no encontrada' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener reseñas de un producto
  async getByProducto(req, res) {
    try {
      const { producto_id } = req.params;
      const { data, error } = await supabase
        .from('resenas_producto')
        .select(`
          *,
          usuario_data:usuario_id (id, nombre, correo)
        `)
        .eq('producto_id', producto_id)
        .order('creado_el', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener reseñas de un usuario
  async getByUsuario(req, res) {
    try {
      const { usuario_id } = req.params;
      const { data, error } = await supabase
        .from('resenas_producto')
        .select(`
          *,
          producto:producto_id (id, nombre, marca)
        `)
        .eq('usuario_id', usuario_id)
        .order('creado_el', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear reseña
  async create(req, res) {
    try {
      const { producto_id, usuario_id, calificacion, comentario } = req.body;

      if (!producto_id || !usuario_id || calificacion === undefined) {
        return res.status(400).json({
          error: 'producto_id, usuario_id y calificacion son requeridos'
        });
      }

      if (calificacion < 1 || calificacion > 5) {
        return res.status(400).json({
          error: 'La calificación debe estar entre 1 y 5'
        });
      }

      // Verificar que el producto existe
      const { data: producto, error: errorProducto } = await supabase
        .from('productos')
        .select('id')
        .eq('id', producto_id)
        .single();

      if (errorProducto || !producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Verificar que el usuario existe
      const { data: usuario, error: errorUsuario } = await supabase
        .from('usuario')
        .select('id, nombre')
        .eq('id', usuario_id)
        .single();

      if (errorUsuario || !usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Crear reseña
      const { data, error } = await supabase
        .from('resenas_producto')
        .insert({
          producto_id: producto_id,
          usuario_id: usuario_id,
          usuario: usuario.nombre,
          calificacion: calificacion,
          comentario: comentario || null,
          creado_el: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      res.status(201).json({
        message: 'Reseña creada con éxito',
        id: data[0].id,
        resena: data[0]
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar reseña
  async update(req, res) {
    try {
      const { id } = req.params;
      const { calificacion, comentario } = req.body;

      const updates = {};
      if (calificacion !== undefined) {
        if (calificacion < 1 || calificacion > 5) {
          return res.status(400).json({
            error: 'La calificación debe estar entre 1 y 5'
          });
        }
        updates.calificacion = calificacion;
      }
      if (comentario !== undefined) updates.comentario = comentario;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
      }

      const { data, error } = await supabase
        .from('resenas_producto')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      if (data.length === 0) {
        return res.status(404).json({ message: 'Reseña no encontrada' });
      }
      res.json({
        message: 'Reseña actualizada correctamente',
        resena: data[0]
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar reseña
  async delete(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('resenas_producto')
        .delete()
        .eq('id', id)
        .select();

      if (error) throw error;
      if (data.length === 0) {
        return res.status(404).json({ message: 'Reseña no encontrada' });
      }
      res.json({ message: 'Reseña eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener promedio de calificaciones de un producto
  async getPromedio(req, res) {
    try {
      const { producto_id } = req.params;

      const { data, error } = await supabase
        .from('resenas_producto')
        .select('calificacion')
        .eq('producto_id', producto_id);

      if (error) throw error;

      if (data.length === 0) {
        return res.json({
          promedio: 0,
          total: 0,
          message: 'No hay reseñas para este producto'
        });
      }

      const total = data.length;
      const suma = data.reduce((acc, curr) => acc + curr.calificacion, 0);
      const promedio = suma / total;

      res.json({
        promedio: Math.round(promedio * 10) / 10,
        total: total
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};