import express from 'express';
import { bitacoraController } from '../controllers/bitacoraController.js';

const router = express.Router();

router.get('/', bitacoraController.getAll);

export default router;
