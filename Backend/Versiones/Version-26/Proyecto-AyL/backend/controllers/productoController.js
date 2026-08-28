import { supabase } from '../config/supabase.js';

export const productoController = {
  // Obtener todos los productos (público)
  async getAll(req, res) {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener producto por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener stock de un producto
  async getStock(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('productos')
        .select('nombre, stock_total, marca')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear producto (solo admin)
  async create(req, res) {
    try {
      const p = req.body;

      if (!p.tipo || !p.nombre || p.precio === undefined || p.stock_total === undefined) {
        return res.status(400).json({ 
          error: 'Tipo, nombre, precio y stock_total son requeridos' 
        });
      }

      const { data: producto, error: errorProducto } = await supabase
        .from('productos')
        .insert({
          tipo: p.tipo,
          nombre: p.nombre,
          marca: p.marca || null,
          caracteristicas: p.caracteristicas || null,
          precio: p.precio,
          stock_total: p.stock_total,
          codigo_interno: p.codigo_interno || null,
          categoria_vehiculo: p.categoria_vehiculo || null,
          imagen_url: p.imagen_url || null,
          cloudinary_imagen_public_id: p.cloudinary_imagen_public_id || null,
          bodega_id: p.bodega_id || null,
          suspendido: p.suspendido || false,
          creado_en: new Date().toISOString()
        })
        .select();

      if (errorProducto) throw errorProducto;

      res.json({ 
        message: 'Producto creado exitosamente', 
        id: producto[0].id,
        producto: producto[0]
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar producto (solo admin)
  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
      }

      const { data, error } = await supabase
        .from('productos')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      if (data.length === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      res.json({ 
        message: 'Producto actualizado correctamente',
        producto: data[0]
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar producto (solo admin)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id)
        .select();

      if (error) throw error;
      if (data.length === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};