import express from 'express';
import { resenaController } from '../controllers/resenaController.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas (solo lectura)
router.get('/producto/:producto_id', resenaController.getByProducto);
router.get('/producto/:producto_id/promedio', resenaController.getPromedio);

// Rutas protegidas
router.get('/', verificarToken, resenaController.getAll);
router.get('/:id', verificarToken, resenaController.getById);
router.get('/usuario/:usuario_id', verificarToken, resenaController.getByUsuario);
router.post('/', verificarToken, resenaController.create);
router.put('/:id', verificarToken, resenaController.update);
router.delete('/:id', verificarToken, resenaController.delete);

export default router;