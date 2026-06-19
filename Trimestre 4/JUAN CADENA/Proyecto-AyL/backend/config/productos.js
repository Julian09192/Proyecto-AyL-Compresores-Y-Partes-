import express from "express";
import db from "../db.js"; 

const router = express.Router();

// 1. Listar todos los productos
router.get("/", async (req, res) => {
  const { data, error } = await db.from("productos").select("*").order("creado_en", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 2. Obtener un producto por ID con sus imágenes asociadas
router.get("/:id", async (req, res) => {
  // Nota: Asegúrate de que el nombre de la relación en Supabase sea 'producto_imagenes'
  const { data, error } = await db
    .from("productos")
    .select("*, producto_imagenes(*)") 
    .eq("id", req.params.id)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Producto no encontrado" });
  
  res.json(data);
});

// 3. Crear un nuevo producto
router.post("/", async (req, res) => {
  const { data, error } = await db.from("productos").insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// 4. Actualizar un producto
router.put("/:id", async (req, res) => {
  const { data, error } = await db.from("productos").update(req.body).eq("id", req.params.id).select();
  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
  res.json({ success: true, producto: data[0] });
});

// 5. Eliminar un producto
router.delete("/:id", async (req, res) => {
  const { error } = await db.from("productos").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, message: "Producto eliminado correctamente" });
});

export default router;