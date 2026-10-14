// backend/routes/userRoutes.js
import express from 'express';
import { userController } from '../controllers/userController.js';
import { verificarToken, verificarAdmin } from '../middleware/auth.js';

const router = express.Router();

// RUTAS PÚBLICAS
router.post('/sync-user', userController.syncUser);
router.post('/register', userController.create);

// RUTAS PROTEGIDAS (requieren autenticación)
router.get('/', verificarAdmin, userController.getAll);
router.get('/buscar', verificarAdmin, userController.buscar);
router.get('/:id/rol', verificarToken, userController.getRol);
router.get('/:id', verificarToken, userController.getById);
router.put('/:id', verificarToken, userController.update);
router.delete('/:id', verificarAdmin, userController.delete);

export default router;