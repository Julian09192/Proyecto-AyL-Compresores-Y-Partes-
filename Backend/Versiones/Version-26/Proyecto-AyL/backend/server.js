import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

// Configuración
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando con Supabase');
});

// Usar todas las rutas
app.use('/api', routes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('📋 Endpoints disponibles:');
  console.log('  /api/auth/login - Login');
  console.log('  /api/usuarios - Usuarios');
  console.log('  /api/productos - Productos');
  console.log('  /api/bodegas - Bodegas');
  console.log('  /api/movimientos-stock - Movimientos de stock');
  console.log('  /api/ordenes - Órdenes');
  console.log('  /api/clientes - Clientes');
  console.log('  /api/proveedores - Proveedores');
  console.log('  /api/resenas - Reseñas');
  console.log('  /api/carrito - Carrito de compras');
  console.log('  /api/compras - Compras');
  console.log('  /api/queries - Reportes y análisis');
});