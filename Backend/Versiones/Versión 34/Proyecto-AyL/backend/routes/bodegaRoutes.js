import express from 'express';
import { bodegaController } from '../controllers/bodegaController.js';
import { verificarAdmin, verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas (solo lectura)
router.get('/', bodegaController.getAll);
router.get('/:id', bodegaController.getById);

// Rutas protegidas (solo admin)
router.post('/', verificarAdmin, bodegaController.create);
router.put('/:id', verificarAdmin, bodegaController.update);
router.delete('/:id', verificarAdmin, bodegaController.delete);

export default router;