import db from "../config/db.js";

// Listar todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await db
      .from("usuario")
      .select("id, num_identificacion, correo, num_celular, nombre, rol, suspendido")
      .order("creado_en", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: err.message });
  }
};

// Obtener un usuario por su ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await db
      .from("usuario")
      .select("id, num_identificacion, correo, num_celular, nombre, rol, suspendido")
      .eq("id", id)
      .single(); // Nos trae un objeto único en vez de un array

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(data);
  } catch (err) {
    console.error("Error al obtener usuario:", err);
    res.status(500).json({ error: err.message });
  }
};

// Actualizar campos dinámicos
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, num_identificacion, num_celular, rol, suspendido } = req.body;

  // Creamos el objeto de actualizaciones dinámicas
  const updates = {};
  if (nombre !== undefined) updates.nombre = nombre;
  if (num_identificacion !== undefined) updates.num_identificacion = num_identificacion;
  if (num_celular !== undefined) updates.num_celular = num_celular;
  if (rol !== undefined) updates.rol = rol;
  if (suspendido !== undefined) updates.suspendido = suspendido;
  
  // Añadimos la fecha de actualización manual si la necesitas, aunque Supabase puede hacerlo con un Trigger
  updates.actualizado_en = new Date().toISOString();

  if (Object.keys(updates).length === 1) { // Solo tiene actualizado_en
    return res.status(400).json({ error: "No se enviaron campos para actualizar" });
  }

  try {
    const { data, error } = await db
      .from("usuario")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ success: true, usuario: data[0] });
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    res.status(500).json({ error: err.message });
  }
};