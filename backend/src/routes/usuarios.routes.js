import { Router } from 'express';
import { getPerfilPublico } from '../controllers/usuariosController.js';

const router = Router();

router.get('/usuarios/:id/perfil', getPerfilPublico);

export default router;
