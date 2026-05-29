import { Router } from 'express';
import { toggleFavorito, getFavoritos } from '../controllers/favoritosController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/favoritos', verifyToken, getFavoritos);
router.post('/favoritos/:lugarId', verifyToken, toggleFavorito);

export default router;
