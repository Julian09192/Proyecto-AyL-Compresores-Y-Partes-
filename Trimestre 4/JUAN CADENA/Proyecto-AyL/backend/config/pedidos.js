import express from "express";
import db from "../db.js";

const router = express.Router();

// Crear un nuevo pedido con sus productos
router.post("/", async (req, res) => {
  const { nombre, direccion, ciudad, telefono, subtotal, envio, total, carrito } = req.body;
  
  try {
    const { data: pedido, error } = await db
      .from("pedidos")
      .insert({ 
        cliente_nombre: nombre, 
        direccion_envio: direccion, 
        ciudad, 
        telefono, 
        subtotal, 
        costo_envio: envio, 
        total, 
        estado: "Pendiente" 
      })
      .select()
      .single();

    if (error) throw error;

    const items = carrito.map(item => ({
      pedido_id: pedido.id,
      producto_id: item.id,
      cantidad: item.cantidad,
      precio_unitario: item.precio
    }));

    const { error: itemsError } = await db.from("pedido_productos").insert(items);
    if (itemsError) throw itemsError;

    res.json({ success: true, id: pedido.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todos los pedidos
router.get("/", async (req, res) => {
  try {
    const { data, error } = await db
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un pedido por ID con sus productos
router.get("/:id", async (req, res) => {
  try {
    const { data, error } = await db
      .from("pedidos")
      .select("*, pedido_productos(*)")
      .eq("id", req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar estado de un pedido
router.put("/:id", async (req, res) => {
  try {
    const { estado } = req.body;
    const { data, error } = await db
      .from("pedidos")
      .update({ estado })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, pedido: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;