import express from 'express';
import { 
  obtenerUsuarios, 
  obtenerRolUsuario, 
  registrarUsuario, 
  actualizarUsuario, 
  suspenderUsuario 
} from '../controllers/userController.js';

const router = express.Router();

// Nota que en server.js prefijaremos esto con /usuario o /usuarios
router.get('/', obtenerUsuarios);
router.get('/:id/rol', obtenerRolUsuario);
router.post('/register', registrarUsuario); // Cambiado para coincidir con tu fetch de la consola: /usuario/register
router.post('/', registrarUsuario);         // Mantiene compatibilidad por si usas /usuarios
router.put('/:id', actualizarUsuario);
router.delete('/:id', suspenderUsuario);

export default router;