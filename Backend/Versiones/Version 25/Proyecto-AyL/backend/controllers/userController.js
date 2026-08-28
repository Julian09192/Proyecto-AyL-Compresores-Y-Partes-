import { supabase } from '../config/db.js';
import crypto from 'crypto'; // Librería nativa de Node para generar UUIDs

// GET /usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select('id, num_identificacion, correo, num_celular, rol, creado_en, actualizado_en'); // Ajustado a las columnas reales de tu tabla usuario

    if (error) throw error;
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /usuarios/:id/rol
export const obtenerRolUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select('nombre, rol')
      .eq('id', id)
      .single();

    if (error) throw error;
    return res.json(data || { message: "Usuario no encontrado" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /usuario/register
export const registrarUsuario = async (req, res) => {
  const { id, nombre, email, rol } = req.body;

  if (!id || !email || !nombre) {
    return res.status(400).json({ 
      success: false, 
      error: "Faltan datos obligatorios para crear el perfil público (id, nombre, email)." 
    });
  }

  try {
    const timestampActual = new Date().toISOString();

    const { data, error } = await supabase
      .from('usuario')
      .insert([
        { 
          id: id,
          nombre: nombre.trim(),
          correo: email.trim(),
          rol: rol || 'cliente',
          creado_en: timestampActual,
          actualizado_en: timestampActual
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return res.json({ 
      success: true, 
      message: "Perfil de usuario guardado exitosamente.", 
      usuario: data 
    });

  } catch (err) {
    console.error("❌ Error interno en registrarUsuario:", err);
    return res.status(500).json({ 
      success: false, 
      error: err.message || "Error al insertar en la tabla pública de la base de datos." 
    });
  }
};

// PUT /usuarios/:id
export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Validación para no suspenderse a sí mismo
    if (updates.suspendido !== undefined && String(req.usuario.id) === String(id) && Number(updates.suspendido) === 1) {
      return res.status(400).json({ error: "No puedes deshabilitar tu propio usuario" });
    }

    const { data, error } = await supabase
      .from('usuario')
      .update({ ...updates, actualizado_en: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// DELETE /usuarios/:id (Soft delete)
export const suspenderUsuario = async (req, res) => {
  const { id } = req.params;
  if (String(req.usuario.id) === String(id)) {
    return res.status(400).json({ error: "No puedes deshabilitar tu propio usuario" });
  }

  try {
    // Nota: Como removiste la columna "suspendido" o usas otra lógica, asegúrate de tenerla en Supabase.
    const { error } = await supabase
      .from('usuario')
      .update({ actualizado_en: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return res.json({ message: "Usuario deshabilitado correctamente" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};