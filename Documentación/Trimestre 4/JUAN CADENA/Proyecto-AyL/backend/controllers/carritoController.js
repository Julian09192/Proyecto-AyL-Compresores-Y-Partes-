import { supabase } from '../config/supabase.js';

export const carritoController = {
  // Obtener carrito de un usuario
  async getByUsuario(req, res) {
    try {
      const { usuario_id } = req.params;

      if (!usuario_id) {
        return res.status(400).json({ error: 'usuario_id es requerido' });
      }

      // Obtener carrito del usuario
      const { data: carrito, error: errorCarrito } = await supabase
        .from('carrito')
        .select('*')
        .eq('usuario_id', usuario_id)
        .eq('estado', 'activo')
        .single();

      // Si no hay carrito activo, devolver vacío
      if (errorCarrito && errorCarrito.code === 'PGRST116') {
        return res.json({
          carrito: null,
          items: [],
          total: 0,
          message: 'Carrito vacío'
        });
      }

      if (errorCarrito) throw errorCarrito;

      // Obtener items del carrito
      const { data: items, error: errorItems } = await supabase
        .from('carrito_item')
        .select(`
          *,
          producto:producto_id (id, nombre, precio, stock_total, imagen_url)
        `)
        .eq('carrito_id', carrito.id_carrito);

      if (errorItems) throw errorItems;

      // Calcular total
      const total = items.reduce((sum, item) => {
        return sum + (Number(item.precio) * item.cantidad);
      }, 0);

      res.json({
        carrito: carrito,
        items: items || [],
        total: total,
        cantidad_items: items ? items.length : 0
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Agregar item al carrito
  async addItem(req, res) {
    try {
      const { usuario_id, producto_id, cantidad } = req.body;

      if (!usuario_id || !producto_id || !cantidad) {
        return res.status(400).json({
          error: 'usuario_id, producto_id y cantidad son requeridos'
        });
      }

      if (cantidad <= 0) {
        return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
      }

      // Verificar que el producto existe y tiene stock
      const { data: producto, error: errorProducto } = await supabase
        .from('productos')
        .select('id, precio, stock_total, suspendido')
        .eq('id', producto_id)
        .single();

      if (errorProducto || !producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      if (producto.suspendido) {
        return res.status(400).json({ error: 'Producto no disponible' });
      }

      if (producto.stock_total < cantidad) {
        return res.status(400).json({ error: 'Stock insuficiente' });
      }

      // Buscar o crear carrito
      let { data: carrito, error: errorCarrito } = await supabase
        .from('carrito')
        .select('*')
        .eq('usuario_id', usuario_id)
        .eq('estado', 'activo')
        .single();

      if (errorCarrito && errorCarrito.code === 'PGRST116') {
        // Crear carrito si no existe
        const { data: newCarrito, error: errorNew } = await supabase
          .from('carrito')
          .insert({
            usuario_id: usuario_id,
            estado: 'activo',
            creado_en: new Date().toISOString(),
            actualizado_en: new Date().toISOString()
          })
          .select();

        if (errorNew) throw errorNew;
        carrito = newCarrito[0];
      } else if (errorCarrito) {
        throw errorCarrito;
      }

      // Verificar si el producto ya está en el carrito
      const { data: itemExistente, error: errorExistente } = await supabase
        .from('carrito_item')
        .select('*')
        .eq('carrito_id', carrito.id_carrito)
        .eq('producto_id', producto_id)
        .single();

      if (itemExistente) {
        // Actualizar cantidad
        const nuevaCantidad = itemExistente.cantidad + cantidad;
        if (producto.stock_total < nuevaCantidad) {
          return res.status(400).json({ error: 'Stock insuficiente' });
        }

        const { data: updated, error: errorUpdate } = await supabase
          .from('carrito_item')
          .update({
            cantidad: nuevaCantidad,
            precio: producto.precio,
            actualizado_en: new Date().toISOString()
          })
          .eq('id_carrito_item', itemExistente.id_carrito_item)
          .select();

        if (errorUpdate) throw errorUpdate;
        res.json({
          message: 'Producto actualizado en el carrito',
          item: updated[0]
        });
      } else {
        // Agregar nuevo item
        const { data: newItem, error: errorInsert } = await supabase
          .from('carrito_item')
          .insert({
            carrito_id: carrito.id_carrito,
            producto_id: producto_id,
            cantidad: cantidad,
            precio: producto.precio,
            creado_en: new Date().toISOString()
          })
          .select();

        if (errorInsert) throw errorInsert;
        res.json({
          message: 'Producto agregado al carrito',
          item: newItem[0]
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar cantidad de un item
  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const { cantidad } = req.body;

      if (!cantidad || cantidad < 0) {
        return res.status(400).json({
          error: 'Cantidad debe ser mayor a 0'
        });
      }

      if (cantidad === 0) {
        // Si cantidad es 0, eliminar el item
        const { error } = await supabase
          .from('carrito_item')
          .delete()
          .eq('id_carrito_item', id);

        if (error) throw error;
        return res.json({ message: 'Producto eliminado del carrito' });
      }

      // Obtener item para verificar stock
      const { data: item, error: errorItem } = await supabase
        .from('carrito_item')
        .select('producto_id')
        .eq('id_carrito_item', id)
        .single();

      if (errorItem || !item) {
        return res.status(404).json({ error: 'Item no encontrado' });
      }

      // Verificar stock
      const { data: producto, error: errorProducto } = await supabase
        .from('productos')
        .select('stock_total')
        .eq('id', item.producto_id)
        .single();

      if (errorProducto || !producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      if (producto.stock_total < cantidad) {
        return res.status(400).json({ error: 'Stock insuficiente' });
      }

      const { data: updated, error: errorUpdate } = await supabase
        .from('carrito_item')
        .update({
          cantidad: cantidad,
          actualizado_en: new Date().toISOString()
        })
        .eq('id_carrito_item', id)
        .select();

      if (errorUpdate) throw errorUpdate;
      res.json({
        message: 'Cantidad actualizada',
        item: updated[0]
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar item del carrito
  async deleteItem(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('carrito_item')
        .delete()
        .eq('id_carrito_item', id)
        .select();

      if (error) throw error;
      if (data.length === 0) {
        return res.status(404).json({ message: 'Item no encontrado' });
      }
      res.json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Vaciar carrito
  async vaciar(req, res) {
    try {
      const { usuario_id } = req.params;

      const { data: carrito, error: errorCarrito } = await supabase
        .from('carrito')
        .select('id_carrito')
        .eq('usuario_id', usuario_id)
        .eq('estado', 'activo')
        .single();

      if (errorCarrito || !carrito) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }

      const { error } = await supabase
        .from('carrito_item')
        .delete()
        .eq('carrito_id', carrito.id_carrito);

      if (error) throw error;

      // Actualizar estado del carrito
      await supabase
        .from('carrito')
        .update({
          estado: 'finalizado',
          actualizado_en: new Date().toISOString()
        })
        .eq('id_carrito', carrito.id_carrito);

      res.json({ message: 'Carrito vaciado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};