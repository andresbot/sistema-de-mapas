import { Router } from 'express';
import { getMetricas, getReportes, updateReporteStatus } from '../controllers/adminController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = Router();

router.use(verifyToken, verifyAdmin);

router.get('/metricas', getMetricas);
router.get('/reportes',       getReportes);
router.patch('/reportes/:id', updateReporteStatus);

export default router;
