import { Router } from 'express';
import { getLugares } from '../controllers/lugaresController.js';

const router = Router();

router.get('/lugares', getLugares);

export default router;
