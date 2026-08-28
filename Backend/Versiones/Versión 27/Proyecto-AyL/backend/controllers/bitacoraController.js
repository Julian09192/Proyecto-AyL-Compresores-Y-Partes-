import { supabase } from '../config/supabase.js';
import { createClient } from '@supabase/supabase-js';

const crearClienteConSesion = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return supabase;

  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: authHeader
      }
    }
  });
};

const obtenerMovimientosStock = async (cliente, filtros) => {
  const {
    accion,
    modulo,
    usuario_email,
    limit = 100
  } = filtros;

  const { data, error } = await cliente
    .from('stock_movimiento')
    .select('*')
    .order('creado_en', { ascending: false })
    .limit(Math.min(Number(limit) || 100, 500));

  if (error) throw error;

  const movimientos = (data || []).map((movimiento) => {
    const tipo = String(movimiento.tipo_movimiento || 'movimiento').toUpperCase();
    const referencia = movimiento.referencia ? ` Ref: ${movimiento.referencia}.` : '';
    const nota = movimiento.nota ? ` ${movimiento.nota}.` : '';
    const productoId = movimiento.id_producto || movimiento.producto_id || 'N/D';

    return {
      id: movimiento.id_movimiento || movimiento.id,
      accion: 'INSERT',
      modulo: 'Stock',
      detalles: `${tipo} de ${movimiento.cantidad || 0} unidades para producto ${productoId}.${referencia}${nota} Stock: ${movimiento.stock_anterior ?? 0} -> ${movimiento.stock_nuevo ?? 0}`,
      usuario_email: movimiento.usuario_id || 'Sistema',
      created_at: movimiento.creado_en || movimiento.fecha || movimiento.created_at
    };
  });

  let resultado = movimientos;

  if (accion) {
    const acciones = String(accion).split(',').map((item) => item.trim()).filter(Boolean);
    resultado = resultado.filter((item) => acciones.includes(item.accion));
  }

  if (modulo) resultado = resultado.filter((item) => item.modulo === modulo);
  if (usuario_email) resultado = resultado.filter((item) => item.usuario_email === usuario_email);

  return resultado;
};

export const bitacoraController = {
  async getAll(req, res) {
    try {
      const {
        accion,
        modulo,
        usuario_email,
        limit = 100
      } = req.query;

      const cliente = crearClienteConSesion(req);

      let query = cliente
        .from('bitacora')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(Math.min(Number(limit) || 100, 500));

      if (accion) {
        const acciones = String(accion).split(',').map((item) => item.trim()).filter(Boolean);
        if (acciones.length === 1) query = query.eq('accion', acciones[0]);
        if (acciones.length > 1) query = query.in('accion', acciones);
      }

      if (modulo) query = query.eq('modulo', modulo);
      if (usuario_email) query = query.eq('usuario_email', usuario_email);

      const { data, error } = await query;

      if (error) {
        const fallback = await obtenerMovimientosStock(cliente, req.query);
        return res.json(fallback);
      }

      res.json(data || []);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};