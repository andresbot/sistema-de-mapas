import { Router } from 'express';
import { check } from 'express-validator';
import { register, login } from '../controllers/authController.js';
import { verifyToken, getCurrentUser } from '../middleware/auth.js';

const router = Router();

router.post(
  '/register',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'La contraseña debe tener mínimo 6 caracteres').isLength({ min: 6 }),
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
  ],
  login
);

router.get('/me', verifyToken, getCurrentUser);

export default router;
