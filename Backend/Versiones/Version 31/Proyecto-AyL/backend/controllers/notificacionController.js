import { supabase } from '../config/supabase.js';

// GET /api/notificaciones - Historial Completo
const obtenerNotificaciones = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notificaciones_stock')
      .select('*')
      .order('creado_en', { ascending: false });

    if (error) throw error;
    
    // Forzamos el envío de datos limpios
    return res.status(200).json(data || []);
  } catch (error) {
    console.error("Error en obtenerNotificaciones:", error.message);
    return res.status(500).json({ error: "Error al obtener el historial de notificaciones" });
  }
};

// GET /api/notificaciones/no-leidas - Trae los registros donde leido es FALSE
const obtenerNotificacionesNoLeidas = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notificaciones_stock')
      .select('*')
      .eq('leido', false)
      .order('creado_en', { ascending: false });

    if (error) throw error;
    return res.status(200).json(data || []);
  } catch (error) {
    console.error("Error en obtenerNotificacionesNoLeidas:", error.message);
    return res.status(500).json({ error: "Error al obtener las notificaciones no leídas" });
  }
};

// PUT /api/notificaciones/marcar-todas - Cambia 'leido' a true de los que estén en false
const marcarTodasComoLeidas = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notificaciones_stock')
      .update({ leido: true })
      .eq('leido', false)
      .select(); // Asegura la ejecución del comando en Supabase

    if (error) throw error;
    return res.status(200).json({ msg: "Todas las notificaciones se marcaron como leídas" });
  } catch (error) {
    console.error("Error en marcarTodasComoLeidas:", error.message);
    return res.status(500).json({ error: "Error al actualizar las notificaciones" });
  }
};

// PUT /api/notificaciones/:id/leer - Cambia 'leido' a true de un id específico
const marcarUnaComoLeida = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('notificaciones_stock')
      .update({ leido: true })
      .eq('id', id)
      .select();

    if (error) throw error;
    return res.status(200).json({ msg: `Notificación ${id} marcada como leída` });
  } catch (error) {
    console.error("Error en marcarUnaComoLeida:", error.message);
    return res.status(500).json({ error: "Error al marcar la notificación como leída" });
  }
};

// DELETE /api/notificaciones/:id - Elimina el registro por id físico (int8)
const eliminarNotificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('notificaciones_stock')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;
    return res.status(200).json({ msg: `Notificación ${id} eliminada correctamente` });
  } catch (error) {
    console.error("Error en eliminarNotificacion:", error.message);
    return res.status(500).json({ error: "Error al eliminar la notificación de la base de datos" });
  }
};

// Exportación del objeto para hacer juego con el router
export const notificacionController = {
  obtenerNotificaciones,
  obtenerNotificacionesNoLeidas,
  marcarTodasComoLeidas,
  marcarUnaComoLeida,
  eliminarNotificacion
};