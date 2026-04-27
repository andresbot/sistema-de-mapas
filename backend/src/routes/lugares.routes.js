import { Router } from 'express';
import { getLugares, crearLugar, eliminarLugar } from '../controllers/lugaresController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/lugares', getLugares);
router.post('/lugares', verifyToken, crearLugar);
router.delete('/lugares/:id', verifyToken, eliminarLugar);

export default router;
