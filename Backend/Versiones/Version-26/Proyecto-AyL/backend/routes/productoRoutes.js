import express from 'express';
import { productoController } from '../controllers/productoController.js';
import { verificarAdmin } from '../middleware/auth.js';

const router = express.Router();

// ✅ Rutas públicas (para pruebas)
router.get('/', productoController.getAll);
router.get('/:id', productoController.getById);
router.get('/:id/stock', productoController.getStock);

// ✅ Rutas protegidas (solo admin)
router.post('/', verificarAdmin, productoController.create);
router.put('/:id', verificarAdmin, productoController.update);
router.delete('/:id', verificarAdmin, productoController.delete);

export default router;