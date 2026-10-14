import { Router } from 'express';
import { notificacionController } from '../controllers/notificacionController.js';

const router = Router();

// 1. Rutas de operaciones fijas (SIEMPRE VAN PRIMERO)
router.get('/no-leidas', notificacionController.obtenerNotificacionesNoLeidas);
router.get('/conteo', notificacionController.obtenerConteoNoLeidas); // <-- NUEVA RUTA AGREGADA
router.put('/marcar-todas', notificacionController.marcarTodasComoLeidas);

// 2. Ruta base de la colección
router.get('/', notificacionController.obtenerNotificaciones);

// 3. Rutas con sub-rutas dinámicas
router.put('/:id/leer', notificacionController.marcarUnaComoLeida);

// 4. Rutas dinámicas por ID general (SIEMPRE AL FINAL)
router.delete('/:id', notificacionController.eliminarNotificacion);

export default router;