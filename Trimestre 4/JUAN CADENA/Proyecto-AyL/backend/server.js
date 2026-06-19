import express from "express";
import cors from "cors";
import 'dotenv/config';
import usuariosRoutes from "./config/usuarios.js";
import productosRoutes from "./config/productos.js";
import pedidosRoutes from "./config/pedidos.js";

const app = express();

/*
  =========================
  MIDDLEWARES
  =========================
*/
app.use(cors());
app.use(express.json());

/*
  =========================
  RUTA PRINCIPAL
  =========================
*/
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "🚀 Servidor A&L Compresores operativo",
    endpoints: ["/usuarios", "/auth", "/productos", "/api/pedidos"]
  });
});

/*
  =========================
  REGISTRO DE RUTAS
  =========================
*/

// Rutas de autenticación (check-email, sync-user, reset-password, update-password)
app.use("/auth", usuariosRoutes);

// CRUD de usuarios (listar, obtener, actualizar)
app.use("/usuarios", usuariosRoutes);

// CRUD de productos
app.use("/productos", productosRoutes);

// CRUD de pedidos
app.use("/api/pedidos", pedidosRoutes);

/*
  =========================
  PUERTO Y ARRANQUE
  =========================
*/
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📦 Rutas activas:`);
  console.log(`   GET/POST  /auth/check-email`);
  console.log(`   GET/POST  /auth/sync-user`);
  console.log(`   POST      /auth/reset-password`);
  console.log(`   GET       /usuarios`);
  console.log(`   GET/PUT   /usuarios/:id`);
  console.log(`   GET/POST  /productos`);
  console.log(`   GET/PUT/DELETE /productos/:id`);
  console.log(`   GET/POST  /api/pedidos`);
  console.log(`   GET/PUT   /api/pedidos/:id`);
});