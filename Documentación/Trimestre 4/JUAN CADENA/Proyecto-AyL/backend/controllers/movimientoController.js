import { supabase } from '../config/supabase.js';

export const movimientoController = {
  // Obtener todos los movimientos de stock
  async getAll(req, res) {
    try {
      const { data, error } = await supabase
        .from('stock_movimiento')
        .select(`
          *,
          producto:producto_id (id, nombre, codigo_interno, marca),
          bodega:bodega_id (id, nombre),
          usuario:usuario_id (id, nombre, correo)
        `)
        .order('creado_en', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener movimiento por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('stock_movimiento')
        .select(`
          *,
          producto:producto_id (id, nombre, codigo_interno, marca),
          bodega:bodega_id (id, nombre),
          usuario:usuario_id (id, nombre, correo)
        `)
        .eq('id_movimiento', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ message: 'Movimiento no encontrado' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener movimientos por producto
  async getByProducto(req, res) {
    try {
      const { producto_id } = req.params;
      const { data, error } = await supabase
        .from('stock_movimiento')
        .select(`
          *,
          bodega:bodega_id (id, nombre),
          usuario:usuario_id (id, nombre)
        `)
        .eq('producto_id', producto_id)
        .order('creado_en', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener movimientos por bodega
  async getByBodega(req, res) {
    try {
      const { bodega_id } = req.params;
      const { data, error } = await supabase
        .from('stock_movimiento')
        .select(`
          *,
          producto:producto_id (id, nombre, codigo_interno),
          usuario:usuario_id (id, nombre)
        `)
        .eq('bodega_id', bodega_id)
        .order('creado_en', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener movimientos por tipo
  async getByTipo(req, res) {
    try {
      const { tipo } = req.params;
      const { data, error } = await supabase
        .from('stock_movimiento')
        .select(`
          *,
          producto:producto_id (id, nombre, codigo_interno),
          bodega:bodega_id (id, nombre),
          usuario:usuario_id (id, nombre)
        `)
        .eq('tipo_movimiento', tipo)
        .order('creado_en', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear movimiento de stock
  async create(req, res) {
    try {
      const { 
        producto_id, 
        bodega_id, 
        cantidad, 
        tipo_movimiento, 
        referencia, 
        nota, 
        usuario_id 
      } = req.body;

      // Validaciones
      if (!producto_id || !cantidad || !tipo_movimiento || !usuario_id) {
        return res.status(400).json({ 
          error: 'producto_id, cantidad, tipo_movimiento y usuario_id son requeridos' 
        });
      }

      if (cantidad <= 0) {
        return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
      }

      // Verificar que el producto existe
      const { data: producto, error: errorProducto } = await supabase
        .from('productos')
        .select('id, stock_total')
        .eq('id', producto_id)
        .single();

      if (errorProducto || !producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Si se envía bodega_id, verificar que existe
      if (bodega_id) {
        const { data: bodega, error: errorBodega } = await supabase
          .from('bodega')
          .select('id')
          .eq('id', bodega_id)
          .single();

        if (errorBodega || !bodega) {
          return res.status(404).json({ error: 'Bodega no encontrada' });
        }
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

      // Verificar stock suficiente para salida
      if (tipo_movimiento === 'salida' && producto.stock_total < cantidad) {
        return res.status(400).json({ 
          error: 'Stock insuficiente para realizar la salida' 
        });
      }

      // Calcular nuevo stock
      const stockAnterior = producto.stock_total;
      const stockNuevo = tipo_movimiento === 'entrada' 
        ? producto.stock_total + cantidad 
        : producto.stock_total - cantidad;

      // Crear movimiento
      const { data: movimiento, error: errorMovimiento } = await supabase
        .from('stock_movimiento')
        .insert({
          producto_id,
          bodega_id: bodega_id || null,
          cantidad,
          tipo_movimiento,
          referencia: referencia || null,
          nota: nota || null,
          stock_anterior: stockAnterior,
          stock_nuevo: stockNuevo,
          usuario_id,
          creado_en: new Date().toISOString()
        })
        .select();

      if (errorMovimiento) {
        console.error('Error al crear movimiento:', errorMovimiento);
        return res.status(400).json({ 
          error: errorMovimiento.message,
          details: errorMovimiento.details 
        });
      }

      // Actualizar stock del producto
      await supabase
        .from('productos')
        .update({ 
          stock_total: stockNuevo,
          ultima_modificacion: Date.now()
        })
        .eq('id', producto_id);

      res.status(201).json({
        message: 'Movimiento registrado exitosamente',
        movimiento: movimiento[0],
        stock_anterior: stockAnterior,
        stock_nuevo: stockNuevo
      });
    } catch (error) {
      console.error('Error en create movimiento:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        details: error.message 
      });
    }
  },

  // Actualizar movimiento (solo nota y referencia)
  async update(req, res) {
    try {
      const { id } = req.params;
      const { referencia, nota } = req.body;

      const updates = {};
      if (referencia !== undefined) updates.referencia = referencia;
      if (nota !== undefined) updates.nota = nota;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ 
          error: 'No se proporcionaron datos para actualizar' 
        });
      }

      const { data, error } = await supabase
        .from('stock_movimiento')
        .update(updates)
        .eq('id_movimiento', id)
        .select();

      if (error) throw error;
      if (data.length === 0) {
        return res.status(404).json({ message: 'Movimiento no encontrado' });
      }
      res.json({ 
        message: 'Movimiento actualizado correctamente',
        movimiento: data[0]
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar movimiento (solo si es necesario - revertir stock)
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Obtener el movimiento para revertir el stock
      const { data: movimiento, error: errorMovimiento } = await supabase
        .from('stock_movimiento')
        .select('*')
        .eq('id_movimiento', id)
        .single();

      if (errorMovimiento || !movimiento) {
        return res.status(404).json({ message: 'Movimiento no encontrado' });
      }

      // Revertir stock
      const { data: producto, error: errorProducto } = await supabase
        .from('productos')
        .select('stock_total')
        .eq('id', movimiento.producto_id)
        .single();

      if (errorProducto) throw errorProducto;

      const stockRevertido = movimiento.tipo_movimiento === 'entrada'
        ? producto.stock_total - movimiento.cantidad
        : producto.stock_total + movimiento.cantidad;

      // Eliminar movimiento
      const { error: errorDelete } = await supabase
        .from('stock_movimiento')
        .delete()
        .eq('id_movimiento', id);

      if (errorDelete) throw errorDelete;

      // Actualizar stock del producto
      await supabase
        .from('productos')
        .update({ 
          stock_total: stockRevertido,
          ultima_modificacion: Date.now()
        })
        .eq('id', movimiento.producto_id);

      res.json({ 
        message: 'Movimiento eliminado y stock revertido',
        stock_actual: stockRevertido
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener resumen de movimientos
  async getResumen(req, res) {
    try {
      // Total de entradas y salidas
      const { data: entradas, error: error1 } = await supabase
        .from('stock_movimiento')
        .select('cantidad')
        .eq('tipo_movimiento', 'entrada');

      if (error1) throw error1;

      const { data: salidas, error: error2 } = await supabase
        .from('stock_movimiento')
        .select('cantidad')
        .eq('tipo_movimiento', 'salida');

      if (error2) throw error2;

      const totalEntradas = entradas.reduce((sum, m) => sum + m.cantidad, 0);
      const totalSalidas = salidas.reduce((sum, m) => sum + m.cantidad, 0);

      // Movimientos del último mes
      const fechaLimite = new Date();
      fechaLimite.setMonth(fechaLimite.getMonth() - 1);

      const { data: ultimoMes, error: error3 } = await supabase
        .from('stock_movimiento')
        .select('*')
        .gte('creado_en', fechaLimite.toISOString());

      if (error3) throw error3;

      res.json({
        resumen: {
          total_entradas: totalEntradas,
          total_salidas: totalSalidas,
          balance: totalEntradas - totalSalidas
        },
        ultimo_mes: {
          total: ultimoMes.length,
          movimientos: ultimoMes
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};