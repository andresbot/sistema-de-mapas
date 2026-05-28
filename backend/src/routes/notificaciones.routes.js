import { Router } from 'express';
import { getNotificaciones } from '../controllers/notificacionesController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/notificaciones', verifyToken, getNotificaciones);

export default router;
