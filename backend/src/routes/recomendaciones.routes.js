import { Router } from 'express';
import { getRecomendaciones, registrarBusqueda } from '../controllers/recomendacionesController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.use(verifyToken);

router.get('/recomendaciones', getRecomendaciones);
router.post('/recomendaciones/busquedas', registrarBusqueda);

export default router;
