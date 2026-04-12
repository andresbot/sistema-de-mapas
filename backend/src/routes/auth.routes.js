import { Router } from 'express';
import { check } from 'express-validator';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = Router();

router.post(
  '/register',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'La contraseña debe tener mínimo 6 caracteres').isLength({ min: 6 }),
  ],
  registerUser
);

router.post(
  '/login',
  [
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
  ],
  loginUser
);

export default router;
