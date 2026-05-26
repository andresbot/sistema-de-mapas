import { prisma } from '../config/prisma.js';

export const getPerfilPublico = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        avatar: true,
        createdAt: true,
        lugares: {
          where: { publicado: true },
          include: {
            categoria: { select: { nombre: true, icono: true, color: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    const lugares = usuario.lugares.map((lugar) => ({
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

    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      avatar: usuario.avatar || null,
      miembro: usuario.createdAt,
      lugares,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
