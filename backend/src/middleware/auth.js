import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');

      req.usuario = await prisma.usuario.findUnique({
        where: { id: decoded.id },
        select: { id: true, nombre: true, email: true, rol: true },
      });

      next();
    } catch (error) {
      return res.status(401).json({ status: 'error', message: 'No autorizado, token falló' });
    }
  }

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'No autorizado, no hay token' });
  }
};
