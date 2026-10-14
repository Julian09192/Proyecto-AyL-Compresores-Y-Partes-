import { Router } from 'express';
import { productoController } from '../controllers/productoController.js';

const router = Router();

// 1. Rutas de filtrado u operaciones fijas (Van primero)
router.get('/filtrar', productoController.filterByParams);

// 2. Rutas base de la colección
router.get('/', productoController.getAll);
router.post('/', productoController.create);

// 3. Rutas específicas con sub-rutas dinámicas
router.get('/:id/stock', productoController.getStock);
router.put('/:id/suspender', productoController.toggleSuspension); // <-- Línea clave para tu vista de React

// 4. Rutas dinámicas por ID general (Van SIEMPRE al final)
router.get('/:id', productoController.getById);
router.put('/:id', productoController.update);
router.delete('/:id', productoController.delete);

export default router;