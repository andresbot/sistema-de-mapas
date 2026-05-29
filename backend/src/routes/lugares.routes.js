import { Router } from 'express';
import {
  getLugares,
  crearLugar,
  eliminarLugar,
  agregarResena,
  eliminarResena,
  registrarVistaLugar,
} from '../controllers/lugaresController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/lugares', getLugares);
router.post('/lugares', verifyToken, crearLugar);
router.post('/lugares/:id/visitas', registrarVistaLugar);
router.delete('/lugares/:id', verifyToken, eliminarLugar);
router.post('/lugares/:id/resenas', verifyToken, agregarResena);
router.delete('/lugares/:id/resenas/:resenaId', verifyToken, eliminarResena);

export default router;
