import { Router } from 'express';
import { check } from 'express-validator';
import { register, login, forgotPassword, resetPassword } from '../controllers/authController.js';
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

router.post(
  '/forgot-password',
  [
    check('email', 'Agrega un email válido').isEmail(),
  ],
  forgotPassword
);

router.post(
  '/reset-password',
  [
    check('token', 'El token es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener mínimo 6 caracteres').isLength({ min: 6 }),
  ],
  resetPassword
);

router.get('/me', verifyToken, getCurrentUser);

export default router;
