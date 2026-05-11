import { Router } from 'express';
import {
  getLugares, getLugar, crearLugar, actualizarLugar, eliminarLugar, agregarResena,
} from '../controllers/lugaresController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/lugares', getLugares);
router.get('/lugares/:id', getLugar);
router.post('/lugares', verifyToken, crearLugar);
router.put('/lugares/:id', verifyToken, actualizarLugar);
router.delete('/lugares/:id', verifyToken, eliminarLugar);
router.post('/lugares/:id/resenas', verifyToken, agregarResena);

export default router;
