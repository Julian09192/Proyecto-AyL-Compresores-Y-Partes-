import { supabase } from '../config/supabase.js';

export const reporteController = {
  // Reporte: Stock por bodega
  async stockPorBodega(req, res) {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select(`
          id,
          nombre,
          stock_total,
          marca,
          tipo,
          bodega_id,
          bodega:bodega_id (id_bodega, nombre)
        `)
        .eq('suspendido', false)
        .order('bodega_id')
        .order('nombre');

      if (error) throw error;
      
      // Agrupar por bodega
      const agrupado = data.reduce((acc, producto) => {
        const nombreBodega = producto.bodega?.nombre || 'Sin bodega';
        if (!acc[nombreBodega]) {
          acc[nombreBodega] = [];
        }
        acc[nombreBodega].push(producto);
        return acc;
      }, {});

      res.json(agrupado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Reporte: Movimientos por producto
  async movimientosPorProducto(req, res) {
    try {
      const { id_producto } = req.params;
      const { data, error } = await supabase
        .from('movimiento_de_stock')
        .select(`
          id_movimiento,
          cantidad,
          tipo_movimiento,
          fecha,
          nota,
          referencia
        `)
        .eq('producto_id', id_producto)
        .order('fecha', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Reporte: Stock crítico (stock < 10)
  async stockCritico(req, res) {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select(`
          id,
          nombre,
          stock_total,
          marca,
          codigo_interno,
          bodega_id,
          bodega:bodega_id (nombre)
        `)
        .lt('stock_total', 10)
        .eq('suspendido', false)
        .order('stock_total');

      if (error) throw error;
      res.json({
        total: data.length,
        productos: data
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Reporte: Auditoría de cambios
  async auditoria(req, res) {
    try {
      // Nota: Como Supabase no tiene una tabla de auditoría nativa,
      // podemos usar los movimientos de stock y logs de cambios
      const { data, error } = await supabase
        .from('movimiento_de_stock')
        .select(`
          *,
          producto:producto_id (id, nombre, codigo_interno)
        `)
        .order('fecha', { ascending: false })
        .limit(50);

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Reporte: Pedidos por cliente
  async pedidosPorCliente(req, res) {
    try {
      const { id_usuario } = req.params;
      const { data, error } = await supabase
        .from('orden')
        .select(`
          id_orden,
          numero_orden,
          fecha,
          total,
          estado,
          items:orden_item (
            id_item,
            cantidad,
            precio,
            subtotal,
            producto:producto_id (nombre, marca)
          )
        `)
        .eq('usuario_id', id_usuario)
        .order('fecha', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Reporte: Ventas por período
  async ventasPorPeriodo(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;

      if (!fecha_inicio || !fecha_fin) {
        return res.status(400).json({
          error: 'fecha_inicio y fecha_fin son requeridos'
        });
      }

      const { data, error } = await supabase
        .from('orden')
        .select(`
          id_orden,
          numero_orden,
          fecha,
          total,
          estado,
          usuario_id,
          usuario:usuario_id (usuario, correo)
        `)
        .gte('fecha', fecha_inicio)
        .lte('fecha', fecha_fin)
        .eq('estado', 'completada')
        .order('fecha', { ascending: false });

      if (error) throw error;

      const totalVentas = data.reduce((sum, orden) => sum + Number(orden.total), 0);
      const totalOrdenes = data.length;

      res.json({
        resumen: {
          total_ventas: totalVentas,
          total_ordenes: totalOrdenes,
          promedio_por_orden: totalOrdenes > 0 ? totalVentas / totalOrdenes : 0
        },
        ordenes: data
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Reporte: Productos más vendidos
  async productosMasVendidos(req, res) {
    try {
      const { limite = 10 } = req.query;

      const { data, error } = await supabase
        .from('orden_item')
        .select(`
          producto_id,
          cantidad,
          subtotal,
          producto:producto_id (nombre, marca, codigo_interno)
        `)
        .order('cantidad', { ascending: false })
        .limit(Number(limite));

      if (error) throw error;

      // Agrupar por producto
      const agrupado = data.reduce((acc, item) => {
        const id = item.producto_id;
        if (!acc[id]) {
          acc[id] = {
            producto: item.producto,
            total_vendido: 0,
            total_ingresos: 0
          };
        }
        acc[id].total_vendido += item.cantidad;
        acc[id].total_ingresos += Number(item.subtotal);
        return acc;
      }, {});

      const resultado = Object.values(agrupado)
        .sort((a, b) => b.total_vendido - a.total_vendido)
        .slice(0, Number(limite));

      res.json(resultado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Reporte: Resumen general del sistema
  async resumenGeneral(req, res) {
    try {
      // Total de productos
      const { count: totalProductos, error: error1 } = await supabase
        .from('productos')
        .select('*', { count: 'exact', head: true })
        .eq('suspendido', false);

      if (error1) throw error1;

      // Total de usuarios
      const { count: totalUsuarios, error: error2 } = await supabase
        .from('usuario')
        .select('*', { count: 'exact', head: true })
        .eq('suspendido', 0);

      if (error2) throw error2;

      // Total de órdenes completadas
      const { count: totalOrdenes, error: error3 } = await supabase
        .from('orden')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'completada');

      if (error3) throw error3;

      // Total de ingresos
      const { data: ordenes, error: error4 } = await supabase
        .from('orden')
        .select('total')
        .eq('estado', 'completada');

      if (error4) throw error4;

      const totalIngresos = ordenes.reduce((sum, orden) => sum + Number(orden.total), 0);

      // Stock total
      const { data: productos, error: error5 } = await supabase
        .from('productos')
        .select('stock_total')
        .eq('suspendido', false);

      if (error5) throw error5;

      const stockTotal = productos.reduce((sum, p) => sum + p.stock_total, 0);

      res.json({
        resumen: {
          total_productos: totalProductos,
          total_usuarios: totalUsuarios,
          total_ordenes_completadas: totalOrdenes,
          total_ingresos: totalIngresos,
          stock_total: stockTotal
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Reporte: Movimientos por mes
  async movimientosPorMes(req, res) {
    try {
      const { year = new Date().getFullYear() } = req.query;

      const fechaInicio = `${year}-01-01`;
      const fechaFin = `${year}-12-31`;

      const { data, error } = await supabase
        .from('movimiento_de_stock')
        .select('*')
        .gte('fecha', fechaInicio)
        .lte('fecha', fechaFin);

      if (error) throw error;

      // Agrupar por mes
      const meses = Array(12).fill(0).map((_, i) => ({
        mes: i + 1,
        entradas: 0,
        salidas: 0,
        total_movimientos: 0
      }));

      data.forEach(mov => {
        const mes = new Date(mov.fecha).getMonth();
        if (mov.tipo_movimiento === 'entrada') {
          meses[mes].entradas += mov.cantidad;
        } else {
          meses[mes].salidas += mov.cantidad;
        }
        meses[mes].total_movimientos += 1;
      });

      res.json({
        year: year,
        meses: meses
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Reporte configurable para la pantalla de reportes del admin
  async inventario(req, res) {
    try {
      const {
        tipo_reporte = 'stock',
        fecha_inicio,
        fecha_fin,
        categoria,
        proveedor
      } = req.query;

      let query = supabase
        .from('productos')
        .select('id, nombre, tipo, marca, stock_total, precio, codigo_interno, suspendido, creado_en')
        .order('nombre');

      if (categoria && categoria !== 'todas') query = query.eq('tipo', categoria);
      if (proveedor && proveedor !== 'todos') query = query.eq('marca', proveedor);
      if (fecha_inicio) query = query.gte('creado_en', fecha_inicio);
      if (fecha_fin) query = query.lte('creado_en', fecha_fin);

      const { data: productos, error } = await query;
      if (error) throw error;

      const productosReporte = productos || [];
      const productosActivos = productosReporte.filter((producto) => !producto.suspendido);
      const categorias = {};
      const proveedores = new Set();
      let valorTotal = 0;
      let stockTotal = 0;

      productosActivos.forEach((producto) => {
        const nombreCategoria = producto.tipo || 'Sin categoria';
        const stock = Number(producto.stock_total || 0);
        const precio = Number(producto.precio || 0);

        if (!categorias[nombreCategoria]) {
          categorias[nombreCategoria] = {
            categoria: nombreCategoria,
            productos: 0,
            stock_total: 0,
            valor_total: 0
          };
        }

        categorias[nombreCategoria].productos += 1;
        categorias[nombreCategoria].stock_total += stock;
        categorias[nombreCategoria].valor_total += stock * precio;
        stockTotal += stock;
        valorTotal += stock * precio;

        if (producto.marca) proveedores.add(producto.marca);
      });

      res.json({
        tipo_reporte,
        filtros: {
          fecha_inicio: fecha_inicio || null,
          fecha_fin: fecha_fin || null,
          categoria: categoria || 'todas',
          proveedor: proveedor || 'todos'
        },
        resumen: {
          total_productos: productosActivos.length,
          stock_total: stockTotal,
          valor_total: valorTotal
        },
        categorias: Object.values(categorias).sort((a, b) => b.stock_total - a.stock_total),
        proveedores: Array.from(proveedores).sort(),
        productos: productosReporte
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};