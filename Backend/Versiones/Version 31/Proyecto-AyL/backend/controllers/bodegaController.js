import { supabase } from '../config/supabase.js';

export const bodegaController = {
  // Obtener todas las bodegas
  async getAll(req, res) {
    try {
      const { data, error } = await supabase
        .from('bodega')
        .select('*')
        .order('nombre');
      
      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener bodega por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('bodega')
        .select('*')
        .eq('id_bodega', id)
        .single();
      
      if (error) throw error;
      if (!data) return res.status(404).json({ message: 'Bodega no encontrada' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear bodega
  async create(req, res) {
    try {
      const { nombre, direccion, telefono } = req.body;
      
      if (!nombre) {
        return res.status(400).json({ error: 'El nombre de la bodega es requerido' });
      }
      
      const { data, error } = await supabase
        .from('bodega')
        .insert({
          nombre,
          direccion: direccion || null,
          telefono: telefono || null
        })
        .select();
      
      if (error) throw error;
      res.json({ 
        message: 'Bodega creada con éxito', 
        id_bodega: data[0].id_bodega 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar bodega
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nombre, direccion, telefono } = req.body;
      
      const { data, error } = await supabase
        .from('bodega')
        .update({
          nombre,
          direccion,
          telefono
        })
        .eq('id_bodega', id)
        .select();
      
      if (error) throw error;
      if (data.length === 0) {
        return res.status(404).json({ message: 'Bodega no encontrada' });
      }
      res.json({ message: 'Bodega actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar bodega
  async delete(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('bodega')
        .delete()
        .eq('id_bodega', id)
        .select();
      
      if (error) throw error;
      if (data.length === 0) {
        return res.status(404).json({ message: 'La bodega no existe' });
      }
      res.json({ message: 'Bodega eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};