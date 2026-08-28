import express from 'express';
import { userController } from '../controllers/userController.js';
import { verificarToken, verificarAdmin } from '../middleware/auth.js';

const router = express.Router();

// ✅ Rutas públicas (para pruebas)
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.get('/:id/rol', userController.getRol);

// ✅ Rutas protegidas (solo admin)
router.post('/', verificarAdmin, userController.create);
router.put('/:id', verificarAdmin, userController.update);
router.delete('/:id', verificarAdmin, userController.delete);

export default router;