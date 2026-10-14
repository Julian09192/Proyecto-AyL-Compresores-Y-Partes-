// backend/routes/ordenRoutes.js
import express from 'express';
import { ordenController } from '../controllers/ordenController.js';
import { verificarToken, verificarAdmin } from '../middleware/auth.js';

const router = express.Router();

// Ruta pública para crear orden (checkout)
router.post('/', ordenController.create);

// Rutas protegidas (requieren autenticación)
router.get('/', verificarAdmin, ordenController.getAll);
router.get('/resumen', verificarAdmin, ordenController.getResumen);
router.get('/usuario/:usuario_id', verificarToken, ordenController.getByUsuario);
router.get('/estado/:id', verificarToken, ordenController.getEstado);
router.get('/:id', verificarToken, ordenController.getById);
router.put('/:id', verificarToken, ordenController.update);
router.delete('/:id', verificarAdmin, ordenController.delete);

export default router;