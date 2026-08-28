import express from 'express';
// Importamos directamente la función por su nombre para asegurar que nunca llegue undefined
import { obtenerMovimientosStock } from '../controllers/bitacoraController.js'; 

const router = express.Router();

// Línea 6 corregida: Pasamos la función directamente como callback
router.get('/', obtenerMovimientosStock);

export default router;