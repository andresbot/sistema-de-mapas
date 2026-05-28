import { prisma } from '../config/prisma.js';

const VALID_STATUSES = ['resuelto', 'descartado'];

export const getReportes = async (req, res) => {
  try {
    const { status = 'pendiente', page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [reportes, total] = await Promise.all([
      prisma.reporte.findMany({
        where: { status },
        include: {
          resena: {
            include: {
              usuario: { select: { id: true, nombre: true } },
              lugar:   { select: { id: true, nombre: true } },
            },
          },
          usuario: { select: { id: true, nombre: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.reporte.count({ where: { status } }),
    ]);

    res.json({ success: true, data: reportes, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReporteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: `Status debe ser: ${VALID_STATUSES.join(', ')}` });
    }

    const reporte = await prisma.reporte.findUnique({ where: { id } });
    if (!reporte) return res.status(404).json({ success: false, message: 'Reporte no encontrado' });

    const updated = await prisma.reporte.update({
      where: { id },
      data: { status },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
