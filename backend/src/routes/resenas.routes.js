import { Router } from 'express';
import { crearResena, obtenerResenasPorLugar, eliminarResena } from '../controllers/resenasController.js';
import { verifyToken } from '../middleware/auth.js'; // <-- Nombre corregido aquí

const router = Router();

// HS12: Ver reseñas de un lugar específico (Público)
router.get('/lugar/:lugarId', obtenerResenasPorLugar);

// HS13: Crear reseña (Protegido - Requiere token válido)
router.post('/', verifyToken, crearResena);

// HS15: Eliminar reseña (Protegido - Requiere token válido)
router.delete('/:id', verifyToken, eliminarResena);

export default router;