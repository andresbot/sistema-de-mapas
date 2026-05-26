import { prisma } from '../config/prisma.js';

export const toggleFavorito = async (req, res) => {
  try {
    const { lugarId } = req.params;
    const usuarioId = req.user.id;

    const lugar = await prisma.lugar.findUnique({ where: { id: lugarId } });
    if (!lugar) return res.status(404).json({ success: false, message: 'Lugar no encontrado' });

    const existing = await prisma.favorito.findUnique({
      where: { lugarId_usuarioId: { lugarId, usuarioId } },
    });

    if (existing) {
      try {
        await prisma.favorito.delete({ where: { id: existing.id } });
      } catch (e) {
        if (e.code !== 'P2025') throw e; // already deleted by concurrent request
      }
      return res.json({ success: true, favorito: false });
    }

    try {
      await prisma.favorito.create({ data: { lugarId, usuarioId } });
    } catch (e) {
      if (e.code !== 'P2002') throw e; // already created by concurrent request
    }
    res.status(201).json({ success: true, favorito: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFavoritos = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const favoritos = await prisma.favorito.findMany({
      where: { usuarioId },
      include: {
        lugar: {
          include: {
            categoria: { select: { nombre: true, icono: true, color: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const lugares = favoritos.map(({ lugar }) => ({
      id: lugar.id,
      nombre: lugar.nombre,
      descripcion: lugar.descripcion,
      latitud: lugar.latitud,
      longitud: lugar.longitud,
      direccion: lugar.direccion,
      puntuacionPromedio: lugar.puntuacionPromedio,
      totalResenas: lugar.totalResenas,
      categoria: lugar.categoria?.nombre || 'General',
      categoriaIcono: lugar.categoria?.icono || '📍',
      categoriaColor: lugar.categoria?.color || '#007AFF',
    }));

    res.json(lugares);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
