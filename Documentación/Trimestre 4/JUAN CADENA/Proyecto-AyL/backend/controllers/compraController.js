import { supabase } from '../config/supabase.js';

export const compraController = {
  // Obtener todas las compras
  async getAll(req, res) {
    try {
      const { data, error } = await supabase
        .from('compra')
        .select(`
          *,
          proveedor:proveedor_id (nombre),
          items:compra_item (
            *,
            producto:producto_id (nombre, marca)
          )
        `)
        .order('fecha', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener compra por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('compra')
        .select(`
          *,
          proveedor:proveedor_id (nombre, telefono, email),
          items:compra_item (
            *,
            producto:producto_id (nombre, marca, codigo_interno)
          )
        `)
        .eq('id_compra', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ message: 'Compra no encontrada' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener compras por proveedor
  async getByProveedor(req, res) {
    try {
      const { proveedor_id } = req.params;
      const { data, error } = await supabase
        .from('compra')
        .select(`
          *,
          items:compra_item (
            *,
            producto:producto_id (nombre, marca)
          )
        `)
        .eq('proveedor_id', proveedor_id)
        .order('fecha', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear compra
  async create(req, res) {
    try {
      const { proveedor_id, productos, total, nota } = req.body;

      if (!proveedor_id || !productos || productos.length === 0) {
        return res.status(400).json({ 
          error: 'Proveedor y productos son requeridos' 
        });
      }

      // Calcular total si no se proporciona
      let totalCompra = total || 0;
      if (!total) {
        for (const item of productos) {
          totalCompra += (item.precio * item.cantidad);
        }
      }

      // Crear compra
      const { data: compra, error: errorCompra } = await supabase
        .from('compra')
        .insert({
          proveedor_id,
          total: totalCompra,
          nota: nota || null,
          fecha: new Date().toISOString()
        })
        .select();

      if (errorCompra) throw errorCompra;

      // Crear items de compra
      const compraItems = productos.map(item => ({
        compra_id: compra[0].id_compra,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio: item.precio,
        subtotal: item.precio * item.cantidad
      }));

      const { error: errorItems } = await supabase
        .from('compra_item')
        .insert(compraItems);

      if (errorItems) throw errorItems;

      // Actualizar stock de productos
      for (const item of productos) {
        // Obtener stock actual
        const { data: producto, error: errorProducto } = await supabase
          .from('productos')
          .select('stock')
          .eq('id', item.producto_id)
          .single();

        if (errorProducto) throw errorProducto;

        const nuevoStock = producto.stock + item.cantidad;
        await supabase
          .from('productos')
          .update({ stock: nuevoStock })
          .eq('id', item.producto_id);

        // Registrar movimiento de stock
        await supabase
          .from('movimiento_de_stock')
          .insert({
            producto_id: item.producto_id,
            cantidad: item.cantidad,
            tipo_movimiento: 'entrada',
            nota: `Compra - Proveedor ${proveedor_id}`,
            referencia: `COMPRA-${compra[0].id_compra}`
          });
      }

      res.json({
        message: "Compra creada con éxito",
        id_compra: compra[0].id_compra,
        compra: compra[0],
        items: compraItems
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar compra
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nota } = req.body;

      const { data, error } = await supabase
        .from('compra')
        .update({ nota })
        .eq('id_compra', id)
        .select();

      if (error) throw error;
      if (data.length === 0) {
        return res.status(404).json({ message: 'Compra no encontrada' });
      }
      res.json({ message: "Compra actualizada correctamente", compra: data[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar compra
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Obtener items de compra para revertir stock
      const { data: items, error: errorItems } = await supabase
        .from('compra_item')
        .select('producto_id, cantidad')
        .eq('compra_id', id);

      if (errorItems) throw errorItems;

      // Revertir stock
      for (const item of items) {
        const { data: producto, error: errorProducto } = await supabase
          .from('productos')
          .select('stock')
          .eq('id', item.producto_id)
          .single();

        if (errorProducto) throw errorProducto;

        const nuevoStock = producto.stock - item.cantidad;
        await supabase
          .from('productos')
          .update({ stock: nuevoStock })
          .eq('id', item.producto_id);
      }

      // Eliminar items de compra
      await supabase
        .from('compra_item')
        .delete()
        .eq('compra_id', id);

      // Eliminar compra
      const { data, error } = await supabase
        .from('compra')
        .delete()
        .eq('id_compra', id)
        .select();

      if (error) throw error;
      if (data.length === 0) {
        return res.status(404).json({ message: 'Compra no encontrada' });
      }
      res.json({ message: "Compra eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener resumen de compras
  async getResumen(req, res) {
    try {
      // Total de compras por proveedor
      const { data: porProveedor, error: error1 } = await supabase
        .from('compra')
        .select('proveedor_id, count(*), total')
        .group('proveedor_id');

      if (error1) throw error1;

      // Compras del último mes
      const fechaLimite = new Date();
      fechaLimite.setMonth(fechaLimite.getMonth() - 1);

      const { data: ultimoMes, error: error2 } = await supabase
        .from('compra')
        .select('*')
        .gte('fecha', fechaLimite.toISOString());

      if (error2) throw error2;

      res.json({
        por_proveedor: porProveedor,
        ultimo_mes: {
          total: ultimoMes.length,
          items: ultimoMes
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};