import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import supabase from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const JWT_SECRET = "A&L_SECRET_KEY_2024";

app.use(cors());
app.use(express.json());

// Middleware de autenticación
const verificarAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.rol !== "admin") {
      return res.status(403).json({ error: "Solo el administrador puede realizar esta accion" });
    }
    req.usuario = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token invalido" });
  }
};

/* Enrutamiento modular */
app.use("/usuario", userRoutes);
app.use("/usuarios", userRoutes);

/* Autenticación Local */
app.post("/login-local", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data: usuario, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('correo', email)
      .maybeSingle();

    if (error) throw error;
    if (!usuario) return res.status(401).json({ success: false, message: "Correo o contraseña incorrectos" });

    if (Number(usuario.suspendido) === 1) {
      return res.status(403).json({ success: false, message: "Usuario deshabilitado" });
    }

    if (usuario.password_hash === password) {
      const token = jwt.sign(
        { id: usuario.id_usuario, rol: usuario.rol, nombre: usuario.usuario },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        token,
        usuario: {
          id: usuario.id_usuario,
          nombre: usuario.usuario,
          email: usuario.correo,
          rol: usuario.rol 
        }
      });
    }
    res.status(401).json({ success: false, message: "Correo o contraseña incorrectos" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Para mantener tu servidor 100% operativo, puedes mudar los controladores de 
   Productos, Bodegas y Movimientos de Stock a sus respectivos archivos de igual forma.
*/

// Ejemplo rápido de Productos adaptado a Supabase:
app.get("/productos", async (req, res) => {
  const { data, error } = await supabase.from('productos').select('*').order('id', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Ejemplo rápido de Movimientos de Stock adaptado (con tus cambios de bodegas salida/destino):
app.post("/movimientos-stock", async (req, res) => {
  const { id_producto, cantidad, tipo_movimiento, id_usuario, nota, id_bodega_salida, id_bodega_destino } = req.body;
  const { data, error } = await supabase.from('stock_movimiento').insert([
    { id_producto, cantidad, tipo_movimiento, id_usuario, nota, id_bodega_salida, id_bodega_destino }
  ]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Movimiento registrado en el historial" });
});

// Endpoint Bodegas adaptado a Supabase
app.post("/bodegas", async (req, res) => {
  const { nombre, direccion, telefono } = req.body;
  if (!nombre) return res.status(400).json({ error: "El nombre de la bodega es requerido" });

  const { data, error } = await supabase.from('bodega').insert([{ nombre, direccion, telefono }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Bodega creada con éxito", id_bodega: data.id_bodega });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});