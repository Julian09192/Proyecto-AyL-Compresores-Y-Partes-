import express from 'express';
import { userController } from '../controllers/userController.js';
import { verificarToken, verificarAdmin } from '../middleware/auth.js';

const router = express.Router();

// ✅ Rutas públicas / compartidas
router.get('/', userController.getAll);
router.get('/buscar', userController.buscar); // Aseguramos la ruta de búsquedas de la barra
router.get('/:id', userController.getById);
router.get('/:id/rol', userController.getRol);

// ✅ Rutas protegidas (solo admin)
router.post('/', verificarAdmin, userController.create); // 👈 Corregido a 'create' en inglés
router.delete('/:id', verificarAdmin, userController.delete);

// 🔴 LAS RUTAS CLAVE PARA LA SUSPENSIÓN Y RE-HABILITACIÓN
// Vinculamos tanto PUT como PATCH a 'update' para atrapar cualquier petición del Front
router.put('/:id', verificarAdmin, userController.update);
router.patch('/:id', verificarAdmin, userController.update);

// Por si tu Frontend le pega directamente al endpoint de toggle-suspension
router.put('/:id/toggle-suspension', verificarAdmin, userController.update);
router.patch('/:id/toggle-suspension', verificarAdmin, userController.update);

export default router;