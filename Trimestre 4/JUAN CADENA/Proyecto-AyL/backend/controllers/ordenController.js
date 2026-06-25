import { supabase } from '../config/supabase.js';

export const ordenController = {
  // Obtener todas las órdenes
  async getAll(req, res) {
    try {
      const { data, error } = await supabase
        .from('orden')
        .select(`
          *,
          usuario:usuario_id (id, nombre, correo, num_celular),
          items:orden_item (
            *,
            producto:producto_id (id, nombre, marca, codigo_interno)
          )
        `)
        .order('fecha', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener orden por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('orden')
        .select(`
          *,
          usuario:usuario_id (id, nombre, correo, num_celular),
          items:orden_item (
            *,
            producto:producto_id (id, nombre, marca, codigo_interno)
          )
        `)
        .eq('id_orden', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ message: 'Orden no encontrada' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener órdenes de un usuario
  async getByUsuario(req, res) {
    try {
      const { usuario_id } = req.params;
      const { data, error } = await supabase
        .from('orden')
        .select(`
          *,
          items:orden_item (
            *,
            producto:producto_id (id, nombre, marca)
          )
        `)
        .eq('usuario_id', usuario_id)
        .order('fecha', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener estado de una orden
  async getEstado(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('orden')
        .select('numero_orden, estado, fecha, total')
        .eq('id_orden', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ message: 'Orden no encontrada' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear orden
  async create(req, res) {
    try {
      const { 
        usuario_id, 
        total, 
        estado, 
        metodo_pago, 
        pago_confirmado,
        numero_orden 
      } = req.body;

      // Validaciones
      if (!usuario_id || total === undefined) {
        return res.status(400).json({ 
          error: 'usuario_id y total son requeridos' 
        });
      }

      // Verificar que el usuario existe
      const { data: usuario, error: errorUsuario } = await supabase
        .from('usuario')
        .select('id')
        .eq('id', usuario_id)
        .single();

      if (errorUsuario || !usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Generar número de orden si no se proporciona
      const numeroOrden = numero_orden || `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const { data, error } = await supabase
        .from('orden')
        .insert({
          usuario_id,
          total,
          estado: estado || 'pendiente',
          metodo_pago: metodo_pago || null,
          pago_confirmado: pago_confirmado || false,
          numero_orden: numeroOrden,
          fecha: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      res.status(201).json({ 
        message: "Orden creada con éxito", 
        id_orden: data[0].id_orden,
        orden: data[0]
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar orden
  async update(req, res) {
    try {
      const { id } = req.params;
      const { estado, metodo_pago, pago_confirmado } = req.body;

      const updates = {};
      if (estado !== undefined) updates.estado = estado;
      if (metodo_pago !== undefined) updates.metodo_pago = metodo_pago;
      if (pago_confirmado !== undefined) updates.pago_confirmado = pago_confirmado;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
      }

      const { data, error } = await supabase
        .from('orden')
        .update(updates)
        .eq('id_orden', id)
        .select();

      if (error) throw error;
      if (data.length === 0) {
        return res.status(404).json({ message: 'Orden no encontrada' });
      }
      res.json({ 
        message: "Orden actualizada correctamente", 
        orden: data[0] 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar orden
  async delete(req, res) {
    try {
      const { id } = req.params;

      // Verificar si la orden existe
      const { data: existe, error: errorExiste } = await supabase
        .from('orden')
        .select('id_orden')
        .eq('id_orden', id)
        .single();

      if (errorExiste || !existe) {
        return res.status(404).json({ message: 'Orden no encontrada' });
      }

      // Eliminar items de la orden primero
      await supabase
        .from('orden_item')
        .delete()
        .eq('orden_id', id);

      // Eliminar la orden
      const { error } = await supabase
        .from('orden')
        .delete()
        .eq('id_orden', id);

      if (error) throw error;
      res.json({ message: "Orden eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener resumen de órdenes por estado
  async getResumen(req, res) {
    try {
      const { data, error } = await supabase
        .from('orden')
        .select('estado, count(*)');

      if (error) throw error;

      // Agrupar por estado
      const resumen = data.reduce((acc, item) => {
        acc[item.estado] = (acc[item.estado] || 0) + 1;
        return acc;
      }, {});

      // Total de órdenes
      const total = data.length;

      // Total de ingresos (órdenes completadas)
      const { data: completadas, error: error2 } = await supabase
        .from('orden')
        .select('total')
        .eq('estado', 'completada');

      if (error2) throw error2;

      const totalIngresos = completadas.reduce((sum, orden) => sum + Number(orden.total), 0);

      res.json({
        resumen: resumen,
        total_ordenes: total,
        total_ingresos: totalIngresos
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};