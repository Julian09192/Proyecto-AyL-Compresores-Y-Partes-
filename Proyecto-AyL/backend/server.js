// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

// Configuración
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Middlewares mejorados
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger de peticiones (para debugging)
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  next();
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'Servidor funcionando con Supabase',
    version: '1.0.0',
    endpoints: [
      '/api/auth/*',
      '/api/usuarios/*',
      '/api/productos/*',
      '/api/bodegas/*',
      '/api/movimientos-stock/*',
      '/api/ordenes/*',
      '/api/clientes/*',
      '/api/proveedores/*',
      '/api/resenas/*',
      '/api/carrito/*',
      '/api/compras/*',
      '/api/queries/*',
      '/api/notificaciones/*'
    ]
  });
});

// Usar todas las rutas
app.use('/api', routes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Ruta no encontrada' 
  });
});

// ✅ Manejo de errores global mejorado
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  // Si es error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      success: false,
      error: 'Token inválido' 
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      success: false,
      error: 'Token expirado' 
    });
  }

  res.status(err.status || 500).json({ 
    success: false,
    error: err.message || 'Error interno del servidor' 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log('📋 Endpoints disponibles:');
  console.log('  🔐 /api/auth/login - Login');
  console.log('  🔐 /api/auth/register - Registro');
  console.log('  🔐 /api/auth/refresh-token - Refrescar token');
  console.log('  👤 /api/usuarios - Usuarios');
  console.log('  📦 /api/productos - Productos');
  console.log('  🏪 /api/bodegas - Bodegas');
  console.log('  📊 /api/movimientos-stock - Movimientos de stock');
  console.log('  📋 /api/ordenes - Órdenes');
  console.log('  👥 /api/clientes - Clientes');
  console.log('  🏭 /api/proveedores - Proveedores');
  console.log('  ⭐ /api/resenas - Reseñas');
  console.log('  🛒 /api/carrito - Carrito de compras');
  console.log('  🛍️ /api/compras - Compras');
  console.log('  📈 /api/queries - Reportes y análisis');
  console.log('  🔔 /api/notificaciones - Notificaciones');
  console.log('\n✨ Servidor listo para recibir peticiones\n');
});