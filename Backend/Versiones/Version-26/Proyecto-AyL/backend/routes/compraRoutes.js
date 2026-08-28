import express from 'express';
import { compraController } from '../controllers/compraController.js';
import { verificarAdmin, verificarToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/resumen', verificarAdmin, compraController.getResumen);
router.get('/', verificarAdmin, compraController.getAll);
router.get('/:id', verificarAdmin, compraController.getById);
router.get('/proveedor/:proveedor_id', verificarAdmin, compraController.getByProveedor);
router.post('/', verificarAdmin, compraController.create);
router.put('/:id', verificarAdmin, compraController.update);
router.delete('/:id', verificarAdmin, compraController.delete);

export default router;