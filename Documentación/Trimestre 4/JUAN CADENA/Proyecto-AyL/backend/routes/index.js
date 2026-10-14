import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import productoRoutes from './productoRoutes.js';
import bodegaRoutes from './bodegaRoutes.js';
import movimientoRoutes from './movimientoRoutes.js';
import ordenRoutes from './ordenRoutes.js';
import resenaRoutes from './resenaRoutes.js';
import carritoRoutes from './carritoRoutes.js';
import compraRoutes from './compraRoutes.js';
import reporteRoutes from './reporteRoutes.js';

const router = express.Router();

// Todas las rutas con prefijo /api
router.use('/auth', authRoutes);
router.use('/usuarios', userRoutes);
router.use('/productos', productoRoutes);
router.use('/bodegas', bodegaRoutes);
router.use('/movimientos-stock', movimientoRoutes);
router.use('/ordenes', ordenRoutes);
router.use('/resenas', resenaRoutes);
router.use('/carrito', carritoRoutes);
router.use('/compras', compraRoutes);
router.use('/queries', reporteRoutes);

export default router;