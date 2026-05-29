import { prisma } from '../config/prisma.js';

export const getNotificaciones = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    // Obtener los lugares del usuario
    const lugares = await prisma.lugar.findMany({
      where: { creadorId: usuarioId },
      select: { id: true, nombre: true },
    });

    if (lugares.length === 0) {
      return res.json({ success: true, data: [], total: 0 });
    }

    const lugarIds = lugares.map(l => l.id);
    const lugarMap = Object.fromEntries(lugares.map(l => [l.id, l.nombre]));

    // Reseñas recientes en los lugares del usuario (últimos 30 días, no propias)
    const hace30Dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const resenas = await prisma.resena.findMany({
      where: {
        lugarId: { in: lugarIds },
        usuarioId: { not: usuarioId },
        createdAt: { gte: hace30Dias },
      },
      include: {
        usuario: { select: { nombre: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const notificaciones = resenas.map(r => ({
      id: r.id,
      tipo: 'nueva_resena',
      lugarNombre: lugarMap[r.lugarId] || 'Lugar',
      lugarId: r.lugarId,
      autor: r.usuario?.nombre || 'Alguien',
      puntuacion: r.puntuacion,
      comentario: r.comentario,
      createdAt: r.createdAt,
    }));

    res.json({ success: true, data: notificaciones, total: notificaciones.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
