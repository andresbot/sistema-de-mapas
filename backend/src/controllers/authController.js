import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { validationResult } from 'express-validator';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key', {
    expiresIn: '24h',
  });
};

export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', errors: errors.array() });
  }

  const { nombre, email, password } = req.body;

  try {
    const userExists = await prisma.usuario.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ status: 'error', message: 'El email ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      status: 'success',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
    }

    const token = generateToken(user.id);

    res.json({
      status: 'success',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
