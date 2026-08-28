import express from 'express';
import { carritoController } from '../controllers/carritoController.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas de carrito requieren autenticación
router.get('/usuario/:usuario_id', verificarToken, carritoController.getByUsuario);
router.post('/item', verificarToken, carritoController.addItem);
router.put('/item/:id', verificarToken, carritoController.updateItem);
router.delete('/item/:id', verificarToken, carritoController.deleteItem);
router.delete('/vaciar/:usuario_id', verificarToken, carritoController.vaciar);

export default router;