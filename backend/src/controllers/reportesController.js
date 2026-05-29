import { prisma } from '../config/prisma.js';

const MOTIVOS_VALIDOS = ['spam', 'ofensivo', 'falso', 'otro'];

export const reportarResena = async (req, res) => {
  try {
    const { id: lugarId, resenaId } = req.params;
    const { motivo } = req.body;
    const reportadoPor = req.user.id;

    if (!MOTIVOS_VALIDOS.includes(motivo)) {
      return res.status(400).json({ success: false, message: 'Motivo inválido' });
    }

    const resena = await prisma.resena.findUnique({ where: { id: resenaId } });
    if (!resena) return res.status(404).json({ success: false, message: 'Reseña no encontrada' });
    if (resena.lugarId !== lugarId) return res.status(400).json({ success: false, message: 'La reseña no pertenece a este lugar' });
    if (resena.usuarioId === reportadoPor) return res.status(400).json({ success: false, message: 'No puedes reportar tu propia reseña' });

    const existing = await prisma.reporte.findUnique({
      where: { resenaId_reportadoPor: { resenaId, reportadoPor } },
    });
    if (existing) return res.status(409).json({ success: false, message: 'Ya reportaste esta reseña' });

    await prisma.reporte.create({ data: { motivo, resenaId, lugarId, reportadoPor } });
    res.status(201).json({ success: true, message: 'Reseña reportada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
