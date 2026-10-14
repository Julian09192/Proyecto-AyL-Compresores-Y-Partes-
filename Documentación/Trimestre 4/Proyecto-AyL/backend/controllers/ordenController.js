// backend/controllers/ordenController.js
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
            producto:producto_id (id, nombre, marca, codigo_interno, imagen_url)
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
            producto:producto_id (id, nombre, marca, codigo_interno, imagen_url)
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
            producto:producto_id (id, nombre, marca, imagen_url)
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

  // ✅ CREAR ORDEN CON DESCUENTO DE STOCK
  async create(req, res) {
    try {
      const { 
        usuario_id,
        cliente_nombre,
        cliente_direccion,
        cliente_ciudad,
        cliente_telefono,
        productos,
        total,
        metodo_pago = 'Efectivo',
        costo_envio = 0
      } = req.body;

      // Validaciones
      if (!usuario_id) {
        return res.status(400).json({ error: 'usuario_id es requerido' });
      }

      if (!productos || productos.length === 0) {
        return res.status(400).json({ error: 'Se requiere al menos un producto' });
      }

      // Verificar que el usuario existe
      const { data: usuario, error: errorUsuario } = await supabase
        .from('usuario')
        .select('id, nombre, correo')
        .eq('id', usuario_id)
        .single();

      if (errorUsuario || !usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // ✅ 1. VALIDAR STOCK ANTES DE PROCESAR
      for (const item of productos) {
        const { data: producto, error: errorProducto } = await supabase
          .from('productos')
          .select('stock, nombre')
          .eq('id', item.producto_id)
          .single();

        if (errorProducto) {
          return res.status(500).json({ 
            error: `Error al verificar stock del producto ${item.producto_id}` 
          });
        }

        if (!producto) {
          return res.status(404).json({ 
            error: `Producto no encontrado: ${item.producto_id}` 
          });
        }

        if (producto.stock === null || producto.stock === undefined) {
          return res.status(400).json({ 
            error: `Producto ${producto.nombre} no tiene stock configurado` 
          });
        }

        if (producto.stock < item.cantidad) {
          return res.status(400).json({ 
            error: `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}, Solicitado: ${item.cantidad}` 
          });
        }
      }

      // Calcular total si no se proporciona
      let totalCalculado = total || 0;
      if (!total) {
        for (const item of productos) {
          totalCalculado += (item.precio * item.cantidad);
        }
        totalCalculado += costo_envio;
      }

      // Generar número de orden
      const { count, error: countError } = await supabase
        .from('orden')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      const fecha = new Date();
      const año = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const numeroOrden = `ORD-${año}${mes}-${String((count || 0) + 1).padStart(4, '0')}`;

      // ✅ 2. CREAR LA ORDEN
      const { data: orden, error: errorOrden } = await supabase
        .from('orden')
        .insert({
          usuario_id,
          total: totalCalculado,
          estado: 'Pendiente',
          metodo_pago: metodo_pago,
          pago_confirmado: false,
          numero_orden: numeroOrden,
          fecha: new Date().toISOString()
        })
        .select()
        .single();

      if (errorOrden) throw errorOrden;

      // ✅ 3. CREAR ITEMS DE LA ORDEN
      const ordenItems = productos.map(item => ({
        orden_id: orden.id_orden,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        subtotal: item.precio * item.cantidad
      }));

      const { error: errorItems } = await supabase
        .from('orden_item')
        .insert(ordenItems);

      if (errorItems) throw errorItems;

      // ✅ 4. DESCONTAR STOCK Y REGISTRAR MOVIMIENTOS
      for (const item of productos) {
        // Obtener stock actual
        const { data: producto, error: errorProducto } = await supabase
          .from('productos')
          .select('stock')
          .eq('id', item.producto_id)
          .single();

        if (errorProducto) throw errorProducto;

        const nuevoStock = producto.stock - item.cantidad;
        
        // Actualizar stock
        const { error: updateError } = await supabase
          .from('productos')
          .update({ stock: nuevoStock })
          .eq('id', item.producto_id);

        if (updateError) throw updateError;

        // ✅ 5. REGISTRAR MOVIMIENTO DE STOCK
        await supabase
          .from('stock_movimiento')
          .insert({
            producto_id: item.producto_id,
            cantidad: item.cantidad,
            tipo: 'salida',
            motivo: `Venta - Orden #${numeroOrden}`,
            referencia: orden.id_orden,
            fecha: new Date().toISOString()
          });
      }

      res.status(201).json({ 
        message: "Orden creada con éxito",
        id_orden: orden.id_orden,
        numero_orden: numeroOrden,
        orden: orden,
        items: ordenItems
      });

    } catch (error) {
      console.error('Error al crear orden:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // ✅ ACTUALIZAR ESTADO DE ORDEN (con reversión de stock si se cancela)
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

      // Si se cancela, revertir stock
      if (estado === 'Cancelada') {
        const { data: items, error: errorItems } = await supabase
          .from('orden_item')
          .select('producto_id, cantidad')
          .eq('orden_id', id);

        if (errorItems) throw errorItems;

        for (const item of items) {
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

          await supabase
            .from('stock_movimiento')
            .insert({
              producto_id: item.producto_id,
              cantidad: item.cantidad,
              tipo: 'entrada',
              motivo: `Cancelación de orden`,
              referencia: id,
              fecha: new Date().toISOString()
            });
        }
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

      // Total de ingresos (órdenes pagadas)
      const { data: pagadas, error: error2 } = await supabase
        .from('orden')
        .select('total')
        .eq('pago_confirmado', true);

      if (error2) throw error2;

      const totalIngresos = pagadas.reduce((sum, orden) => sum + Number(orden.total), 0);

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