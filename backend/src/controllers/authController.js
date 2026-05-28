import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { prisma } from '../config/prisma.js';
import { sendPasswordResetEmail } from '../services/emailService.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key', {
    expiresIn: '24h',
  });
};

const PASSWORD_RESET_RESPONSE =
  'Si el correo existe, enviaremos instrucciones para recuperar la contraseña.';

const hashResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const getResetExpirationMinutes = () => {
  const value = Number(process.env.PASSWORD_RESET_EXPIRES_MINUTES || 30);
  return Number.isFinite(value) && value > 0 ? value : 30;
};

const buildResetUrl = (token) => {
  const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
  return `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;
};

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { nombre, email, password } = req.body;

  try {
    const userExists = await prisma.usuario.findUnique({ where: { email } });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'El email ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.usuario.create({
      data: { nombre, email, password: hashedPassword },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          avatar: user.avatar,
          rol: user.rol,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          avatar: user.avatar,
          rol: user.rol,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const email = req.body.email?.trim();

  try {
    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user) {
      return res.json({ success: true, message: PASSWORD_RESET_RESPONSE });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashResetToken(rawToken);
    const expiresMinutes = getResetExpirationMinutes();
    const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);
    const resetUrl = buildResetUrl(rawToken);

    await prisma.$transaction([
      prisma.passwordResetToken.updateMany({
        where: { usuarioId: user.id, usedAt: null },
        data: { usedAt: new Date() },
      }),
      prisma.passwordResetToken.create({
        data: {
          usuarioId: user.id,
          tokenHash,
          expiresAt,
        },
      }),
    ]);

    await sendPasswordResetEmail({
      to: user.email,
      name: user.nombre,
      resetUrl,
      expiresMinutes,
    });

    res.json({ success: true, message: PASSWORD_RESET_RESPONSE });
  } catch (error) {
    console.error('Error solicitando recuperación de contraseña:', error);
    res.status(500).json({ success: false, message: 'No se pudo enviar el correo de recuperación' });
  }
};

export const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { token, password } = req.body;
  const tokenHash = hashResetToken(token);

  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { usuario: true },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'El enlace es inválido o expiró' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const usedAt = new Date();

    await prisma.$transaction([
      prisma.usuario.update({
        where: { id: resetToken.usuarioId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.updateMany({
        where: { usuarioId: resetToken.usuarioId, usedAt: null },
        data: { usedAt },
      }),
    ]);

    res.json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error restableciendo contraseña:', error);
    res.status(500).json({ success: false, message: 'No se pudo actualizar la contraseña' });
  }
};
