import { Router } from 'express';
import { getReportes, updateReporteStatus } from '../controllers/adminController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = Router();

router.use(verifyToken, verifyAdmin);

router.get('/reportes',       getReportes);
router.patch('/reportes/:id', updateReporteStatus);

export default router;
