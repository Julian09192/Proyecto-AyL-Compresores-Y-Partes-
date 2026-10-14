import express from 'express';
import { movimientoController } from '../controllers/movimientoController.js';
import { verificarAdmin, verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas (solo lectura)
router.get('/resumen', movimientoController.getResumen);

// Rutas protegidas
router.get('/', verificarToken, movimientoController.getAll);
router.get('/:id', verificarToken, movimientoController.getById);
router.get('/producto/:producto_id', verificarToken, movimientoController.getByProducto);
router.get('/bodega/:bodega_id', verificarToken, movimientoController.getByBodega);
router.get('/tipo/:tipo', verificarToken, movimientoController.getByTipo);
router.post('/', verificarAdmin, movimientoController.create);
router.put('/:id', verificarAdmin, movimientoController.update);
router.delete('/:id', verificarAdmin, movimientoController.delete);

export default router;