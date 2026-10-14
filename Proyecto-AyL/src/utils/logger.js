import { supabase } from '../config/supabase.js';

/**
 * Registra un evento en la bitácora del sistema
 * @param {Object} opciones
 * @param {string} opciones.accion - 'INSERT', 'UPDATE', 'SUSPENDIDO' o 'REACTIVADO'
 * @param {string} opciones.modulo - 'Productos', 'Usuarios', 'Stock', etc.
 * @param {string} opciones.detalles - Descripción textual de lo que cambió
 * @param {string} opciones.usuario_email - Correo del administrador que opera, o 'Sistema'
 */
export const registrarBitacora = async ({ accion, modulo, detalles, usuario_email }) => {
  try {
    // 1. Intentamos insertar en la tabla principal 'bitacora' si llegara a existir en el futuro
    const { error: errorBitacora } = await supabase
      .from('bitacora')
      .insert([{
        accion,
        modulo,
        detalles,
        usuario_email: usuario_email || 'Sistema',
        created_at: new Date().toISOString()
      }]);

    // 2. Si da error porque la tabla 'bitacora' no existe, usamos tu respaldo 'stock_movimiento'
    if (errorBitacora) {
      // Mapeamos los campos para que quepan en 'stock_movimiento' sin romper restricciones de tipo
      await supabase
        .from('stock_movimiento')
        .insert([{
          tipo_movimiento: accion,         // Guardamos 'INSERT', 'UPDATE', etc.
          referencia: modulo,              // Usamos la referencia para el Módulo ('Productos' / 'Usuarios')
          nota: detalles,                  // Los detalles del cambio van en la nota
          cantidad: 0,                     // Valor por defecto para no romper la estructura de stock
          stock_anterior: 0,
          stock_nuevo: 0
        }]);
    }
  } catch (err) {
    console.error('Error crítico al escribir en la bitácora de auditoría:', err.message);
  }
};