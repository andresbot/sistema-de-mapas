import { prisma } from '../config/prisma.js';

export const getLugares = async (req, res) => {
  try {
    const lugares = await prisma.lugar.findMany({
      include: {
        categoria: {
          select: { nombre: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const response = lugares.map((lugar) => ({
      id: lugar.id,
      nombre: lugar.nombre,
      descripcion: lugar.descripcion,
      latitud: lugar.latitud,
      longitud: lugar.longitud,
      categoria: lugar.categoria?.nombre || 'General',
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
