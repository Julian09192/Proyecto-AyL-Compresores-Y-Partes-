import { supabase } from '../config/supabase.js';

export const obtenerMovimientosStock = async (req, res) => {
  const {
    accion,
    modulo,
    usuario_email,
    limit = 100
  } = req?.query || {};

  try {
    // Traemos los movimientos ordenados por fecha
    const { data, error } = await supabase
      .from('stock_movimiento')
      .select('*')
      .order('creado_en', { ascending: false })
      .limit(Math.min(Number(limit) || 100, 500));

    if (error) throw error;

    const movimientos = (data || []).map((movimiento) => {
      const notaTexto = movimiento.nota || '';
      
      // 1. Detectar la Acción Real desde la etiqueta de la nota
      let accionReal = 'INSERT'; 
      if (notaTexto.includes('[ACCION: UPDATE]')) {
        accionReal = 'UPDATE';
      } else if (notaTexto.includes('[ACCION: INSERT]')) {
        accionReal = 'INSERT';
      } else if (notaTexto.includes('[ACCION: SUSPENDIDO]')) {
        accionReal = 'SUSPENDIDO';
      } else if (notaTexto.includes('[ACCION: REACTIVADO]')) {
        accionReal = 'REACTIVADO';
      } else if (notaTexto.includes('[ACCION: DELETE]')) {
        accionReal = 'DELETE';
      } else if (movimiento.tipo_movimiento) {
        accionReal = String(movimiento.tipo_movimiento).toUpperCase();
      }

      // 2. Limpiar los prefijos de control de la nota para la interfaz
      const detallesLimpios = notaTexto
        .replace(/\[ACCION:.*?\]\s*-\s*/, '')
        .replace(/\[Operador:.*?\]\s*-\s*/, '');

      // 3. Extraer el operador que ejecutó la acción
      let emailDetectado = 'Sistema';
      const coincidenciaEmail = notaTexto.match(/\[Operador:\s*([^\]]+)\]/);
      if (coincidenciaEmail && coincidenciaEmail[1]) {
        emailDetectado = coincidenciaEmail[1];
      }

      return {
        id: movimiento.id_movimiento || movimiento.id,
        accion: accionReal, 
        modulo: movimiento.referencia || 'Stock', 
        detalles: detallesLimpios || `Movimiento de ${movimiento.cantidad || 0} unidades.`,
        usuario_email: emailDetectado,
        created_at: movimiento.creado_en || movimiento.created_at
      };
    });

    // 4. Filtrado Dinámico en memoria
    let resultado = movimientos;

    if (accion && String(accion).trim() !== '') {
      const acciones = String(accion).split(',').map((item) => item.trim()).filter(Boolean);
      resultado = resultado.filter((item) => acciones.includes(item.accion));
    }

    if (modulo && String(modulo).trim() !== '') {
      resultado = resultado.filter((item) => item.modulo.toLowerCase() === modulo.toLowerCase());
    }

    // Enviamos el arreglo final mapeado al Frontend
    return res.json(resultado);

  } catch (err) {
    console.error("❌ Error crítico en obtenerMovimientosStock:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const bitacoraController = {
  obtenerMovimientosStock
};

export default bitacoraController;