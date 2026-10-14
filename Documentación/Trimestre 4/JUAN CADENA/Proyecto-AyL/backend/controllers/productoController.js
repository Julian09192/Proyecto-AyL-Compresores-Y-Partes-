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

  // Obtener producto por ID (público)
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

  // Obtener stock de un producto (público)
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

  // Filtrar productos por bodega, marca o tipo (público)
// Filtrar productos por bodega, marca, tipo o código interno (público)
  async filterByParams(req, res) {
    try {
      // Se agrega 'codigo_interno' a la desestructuración de la query
      const { id_bodega, marca, tipo, codigo_interno } = req.query;
      let query = supabase.from('productos').select('*');
      
      if (id_bodega) query = query.eq('bodega_id', id_bodega);
      if (marca) query = query.eq('marca', marca);
      if (tipo) query = query.eq('tipo', tipo);
      
      // Condición agregada para filtrar por código interno si se envía en los parámetros
      if (codigo_interno) query = query.eq('codigo_interno', codigo_interno);
      
      const { data, error } = await query;
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear producto (solo admin)
  async create(req, res) {
    try {
      const p = req.body;

      if (!p.tipo || !p.nombre || p.precio === undefined) {
        return res.status(400).json({ 
          error: 'Tipo, nombre y precio son requeridos' 
        });
      }

      // Mapeo seguro de las propiedades que manda la interfaz de React
      const finalStock = p.stock_total !== undefined ? p.stock_total : (p.stock !== undefined ? p.stock : 0);
      const finalPublicId = p.cloudinary_imagen_public_id || p.imagen_public_id || null;
      const finalBodegaId = p.bodega_id || p.id_bodega || null;

      const { data: producto, error: errorProducto } = await supabase
        .from('productos')
        .insert({
          tipo: p.tipo,
          nombre: p.nombre,
          marca: p.marca || null,
          caracteristicas: p.caracteristicas || null,
          precio: p.precio,
          stock_total: finalStock,
          codigo_interno: p.codigo_interno || null,
          categoria_vehiculo: p.categoria_vehiculo || null,
          imagen_url: p.imagen_url || null,
          cloudinary_imagen_public_id: finalPublicId,
          bodega_id: finalBodegaId,
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

      // Mapeo dinámico para interceptar variables del Front y pasarlas como columnas de Supabase
      const dataToUpdate = { ...updates };
      
      if (updates.stock !== undefined) {
        dataToUpdate.stock_total = Number(updates.stock);
        delete dataToUpdate.stock;
      }
      if (updates.id_bodega !== undefined) {
        dataToUpdate.bodega_id = updates.id_bodega ? Number(updates.id_bodega) : null;
        delete dataToUpdate.id_bodega;
      }
      if (updates.imagen_public_id !== undefined) {
        dataToUpdate.cloudinary_imagen_public_id = updates.imagen_public_id;
        delete dataToUpdate.imagen_public_id;
      }

      const { data, error } = await supabase
        .from('productos')
        .update(dataToUpdate)
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
  },

  // Alternar suspensión de producto (solo admin)
  async toggleSuspension(req, res) {
    try {
      const { id } = req.params;

      // 1. Conseguir el estado actual del producto
      const { data: current, error: fetchError } = await supabase
        .from('productos')
        .select('suspendido')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (!current) return res.status(404).json({ message: 'Producto no encontrado' });

      // 2. Actualizar al estado inverso
      const nuevoEstado = !current.suspendido;

      const { data, error } = await supabase
        .from('productos')
        .update({ suspendido: nuevoEstado })
        .eq('id', id)
        .select();

      if (error) throw error;

      res.json({ 
        message: nuevoEstado ? 'Producto suspendido correctamente' : 'Producto reactivado correctamente',
        producto: data[0]
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};