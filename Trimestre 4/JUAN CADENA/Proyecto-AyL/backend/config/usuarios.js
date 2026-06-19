import express from "express";
import db from "../db.js";
import { supabaseAdmin } from "../supabaseClient.js"; 

const router = express.Router();

// 1. Verificar email
router.post("/check-email", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ exists: false, error: "Email requerido" });

  try {
    const { data, error } = await db
      .from("usuarios")
      .select("id, correo")
      .eq("correo", email);

    if (error) throw error;
    const exists = (data || []).length > 0;
    res.json({ exists, email, message: exists ? "Email encontrado" : "Email no registrado" });
  } catch (err) {
    res.status(500).json({ exists: false, error: err.message });
  }
});

// 2. Sincronizar usuario
router.post("/sync-user", async (req, res) => {
  const { email, nombre, id } = req.body;
  if (!email || !id) return res.status(400).json({ success: false, error: "Email e ID son requeridos" });

  try {
    const { data: searchData, error: searchError } = await db
      .from("usuarios")
      .select("id, nombre, correo, rol")
      .or(`id.eq.${id},correo.eq.${email}`);

    if (searchError) throw searchError;

    if (!searchData || searchData.length === 0) {
      const { data: insertData, error: insertError } = await db
        .from("usuarios")
        .insert({
          id,
          nombre: nombre || email.split('@')[0],
          correo: email,
          rol: 'cliente'
        })
        .select("id, nombre, correo, rol")
        .single();

      if (insertError) throw insertError;
      res.json({ success: true, usuario: insertData });
    } else {
      res.json({ success: true, usuario: searchData[0] });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Listar usuarios
router.get("/", async (req, res) => {
  try {
    const { data, error } = await db
      .from("usuarios")
      .select("id, num_identificacion, correo, num_celular, nombre, rol, creado_en, actualizado_en")
      .order("creado_en", { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Obtener usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const { data, error } = await db
      .from("usuarios")
      .select("id, num_identificacion, correo, num_celular, nombre, rol, creado_en, actualizado_en")
      .eq("id", req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Actualizar usuario (Lógica detallada de campos)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, num_identificacion, num_celular, rol } = req.body;

  try {
    const updateFields = {};
    if (nombre !== undefined) updateFields.nombre = nombre;
    if (num_identificacion !== undefined) updateFields.num_identificacion = num_identificacion;
    if (num_celular !== undefined) updateFields.num_celular = num_celular;
    if (rol !== undefined) updateFields.rol = rol;
    updateFields.actualizado_en = new Date();

    const { data, error } = await db
      .from("usuarios")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, usuario: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Reset Password (Supabase)
router.post("/reset-password", async (req, res) => {
  const { email, redirectTo } = req.body;
  try {
    const { error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: { redirectTo }
    });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true, message: "Correo de recuperación enviado" });
  } catch (err) {
    console.error("Error en reset-password:", err);
    res.status(500).json({ error: "Error en el servidor al enviar el correo" });
  }
});

// 7. Update Password (Supabase)
router.post("/update-password", async (req, res) => {
  try {
    const { password } = req.body;
    const { error } = await supabaseAdmin.auth.updateUser({ password });
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;