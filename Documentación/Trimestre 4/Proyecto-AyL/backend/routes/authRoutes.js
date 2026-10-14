// backend/routes/authRoutes.js
import express from 'express';
import { authController } from '../controllers/authController.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/reset-password', authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);

// Rutas protegidas
router.get('/me', verificarToken, authController.getCurrentUser);
router.get('/verificar', verificarToken, authController.verificarToken);
router.post('/logout', verificarToken, authController.logout);

export default router;