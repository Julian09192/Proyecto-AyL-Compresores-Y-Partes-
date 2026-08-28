import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Importación de rutas modulares
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import db from "./config/db.js"; // Cliente oficial de Supabase

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MOVIMIENTOS_FILE = path.join(__dirname, "data", "movimientos.json");
const BITACORA_FILE = path.join(__dirname, "data", "bitacora.json");

// Helpers para persistencia local de respaldo
const readJson = (file) => {
  try {
    if (!fs.existsSync(file)) return [];
    const content = fs.readFileSync(file, "utf-8");
    return JSON.parse(content || "[]");
  } catch (err) {
    console.error(`Error al leer archivo ${file}:`, err);
    return [];
  }
};

const writeJson = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error al escribir archivo ${file}:`, err);
  }
};

/* =========================
   MIDDLEWARES
   ========================= */
app.use(cors());
app.use(express.json());

/* =========================
   RUTAS CENTRALES DE USUARIOS Y AUTENTICACIÓN
   ========================= */
app.get("/", (req, res) => {
  res.send("API A&L Compresores - Servidor Modularizado Correctamente");
});

// Enlazamos los enrutadores de usuarios con soporte singular y plural
app.use("/auth", authRoutes);       // Ej: http://localhost:3001/auth/sync-user
app.use("/usuario", userRoutes);   // Ej: http://localhost:3001/usuario
app.use("/usuarios", userRoutes);  // Ej: http://localhost:3001/usuarios

/* =========================
   ENDPOINTS ADICIONALES (PRODUCTOS, MOVIMIENTOS, BITÁCORA)
   ========================= */

// 1. Obtener productos de Supabase
app.get("/productos", async (req, res) => {
  try {
    const { data, error } = await db.from("productos").select("*");
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error("Error al obtener productos:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 2. Control de Stock (Movimientos) con persistencia híbrida
app.get("/movimientos-stock", async (req, res) => {
  try {
    const { data, error } = await db.from("movimientos_stock").select("*");
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.warn("Tabla 'movimientos_stock' no disponible en Supabase. Usando respaldo JSON:", err.message);
    res.json(readJson(MOVIMIENTOS_FILE));
  }
});

app.post("/movimientos-stock", async (req, res) => {
  const nuevo = req.body;
  const id = Date.now();
  const created_at = new Date().toISOString();
  
  // Estructura híbrida compatible con ambos Dashboards (Empleado y Administrador)
  const item = {
    id: id,
    id_movimiento: id,
    fecha: nuevo.fecha || new Date().toLocaleDateString('en-CA'),
    creado_en: created_at,
    producto: nuevo.producto || nuevo.nombre_producto || "",
    nombre_producto: nuevo.producto || nuevo.nombre_producto || "",
    tipo: nuevo.tipo || (nuevo.tipo_movimiento === 'entrada' ? 'Entrada' : 'Salida'),
    tipo_movimiento: nuevo.tipo_movimiento || (nuevo.tipo?.toLowerCase() === 'entrada' ? 'entrada' : 'salida'),
    cantidad: nuevo.cantidad !== undefined ? String(nuevo.cantidad) : "0",
    motivo: nuevo.motivo || nuevo.nota || "",
    nota: nuevo.motivo || nuevo.nota || "",
    detalleMotivo: nuevo.detalleMotivo || nuevo.detalle_motivo || "",
    detalle_motivo: nuevo.detalleMotivo || nuevo.detalle_motivo || "",
    usuario: nuevo.usuario || "Sistema"
  };

  try {
    const { data, error } = await db.from("movimientos_stock").insert([item]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    console.warn("Fallo inserción de movimientos en Supabase. Guardando localmente:", err.message);
    const list = readJson(MOVIMIENTOS_FILE);
    list.push(item);
    writeJson(MOVIMIENTOS_FILE, list);
    res.status(201).json(item);
  }
});

const updateMovimiento = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const { data, error } = await db
      .from("movimientos_stock")
      .update(body)
      .or(`id.eq.${id},id_movimiento.eq.${id}`)
      .select();
    if (error) throw error;
    if (data && data.length > 0) {
      return res.json(data[0]);
    }
  } catch (err) {
    console.warn("Fallo actualización de movimientos en Supabase. Modificando localmente:", err.message);
  }

  // Fallback JSON local
  const list = readJson(MOVIMIENTOS_FILE);
  const index = list.findIndex(m => String(m.id) === String(id) || String(m.id_movimiento) === String(id));
  if (index !== -1) {
    list[index] = { ...list[index], ...body };
    writeJson(MOVIMIENTOS_FILE, list);
    return res.json(list[index]);
  }
  res.status(404).json({ error: "Movimiento no encontrado" });
};

app.put("/movimientos-stock/:id", updateMovimiento);
app.patch("/movimientos-stock/:id", updateMovimiento);

app.delete("/movimientos-stock/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await db
      .from("movimientos_stock")
      .delete()
      .or(`id.eq.${id},id_movimiento.eq.${id}`);
    if (error) throw error;
  } catch (err) {
    console.warn("Fallo eliminación de movimientos en Supabase. Removiendo localmente:", err.message);
  }

  const list = readJson(MOVIMIENTOS_FILE);
  const filtered = list.filter(m => String(m.id) !== String(id) && String(m.id_movimiento) !== String(id));
  writeJson(MOVIMIENTOS_FILE, filtered);
  res.json({ success: true, message: "Movimiento eliminado exitosamente" });
});

// 3. Historial de Bitácora con persistencia híbrida
app.get("/bitacora", async (req, res) => {
  try {
    const { data, error } = await db.from("bitacora").select("*");
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.warn("Tabla 'bitacora' no disponible en Supabase. Usando respaldo JSON:", err.message);
    res.json(readJson(BITACORA_FILE));
  }
});

app.post("/bitacora", async (req, res) => {
  const body = req.body;
  const item = {
    id: Date.now(),
    creado_en: new Date().toISOString(),
    accion: body.accion || "UPDATE",
    detalles: body.detalles || "",
    usuario: body.usuario || "Sistema"
  };

  try {
    const { data, error } = await db.from("bitacora").insert([item]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    console.warn("Fallo inserción de bitácora en Supabase. Guardando localmente:", err.message);
    const list = readJson(BITACORA_FILE);
    list.push(item);
    writeJson(BITACORA_FILE, list);
    res.status(201).json(item);
  }
});

/* =========================
   PUERTO Y ARRANQUE
   ========================= */
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📂 Lógica separada por Controladores y Rutas de manera exitosa.`);
});