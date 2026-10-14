import express from 'express';
import { ordenController } from '../controllers/ordenController.js';
import { verificarAdmin, verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/:id/estado', ordenController.getEstado);

// Rutas protegidas
router.get('/', verificarToken, ordenController.getAll);
router.get('/resumen', verificarAdmin, ordenController.getResumen);
router.get('/:id', verificarToken, ordenController.getById);
router.get('/usuario/:usuario_id', verificarToken, ordenController.getByUsuario);
router.post('/', verificarToken, ordenController.create);
router.put('/:id', verificarAdmin, ordenController.update);
router.delete('/:id', verificarAdmin, ordenController.delete);

export default router;