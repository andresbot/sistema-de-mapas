import { Router } from 'express';
import { reportarResena } from '../controllers/reportesController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/lugares/:id/resenas/:resenaId/reportes', verifyToken, reportarResena);

export default router;
