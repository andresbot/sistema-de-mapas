import { prisma } from '../config/prisma.js';

const VALID_STATUSES = ['resuelto', 'descartado'];
const VALID_RANGES = [7, 30];

const parseRangeDays = (range) => {
  const value = Number(range || 30);
  return VALID_RANGES.includes(value) ? value : null;
};

const toCountMap = (items) => {
  return new Map(items.map((item) => [item.lugarId, item._count._all]));
};

const roundRating = (value) => {
  return Number((value || 0).toFixed(1));
};

export const getMetricas = async (req, res) => {
  try {
    const rangeDays = parseRangeDays(req.query.range);

    if (!rangeDays) {
      return res.status(400).json({ success: false, message: 'range debe ser 7 o 30' });
    }

    const to = new Date();
    const from = new Date(to.getTime() - rangeDays * 24 * 60 * 60 * 1000);
    const periodWhere = { createdAt: { gte: from, lte: to } };

    const [
      lugares,
      vistasPorLugar,
      resenasPorLugar,
      favoritosPorLugar,
      promedioCalificacion,
      totalFavoritos,
    ] = await Promise.all([
      prisma.lugar.findMany({
        include: {
          categoria: { select: { nombre: true } },
        },
      }),
      prisma.lugarVista.groupBy({
        by: ['lugarId'],
        where: periodWhere,
        _count: { _all: true },
      }),
      prisma.resena.groupBy({
        by: ['lugarId'],
        where: periodWhere,
        _count: { _all: true },
      }),
      prisma.favorito.groupBy({
        by: ['lugarId'],
        _count: { _all: true },
      }),
      prisma.resena.aggregate({
        _avg: { puntuacion: true },
      }),
      prisma.favorito.count(),
    ]);

    const vistasMap = toCountMap(vistasPorLugar);
    const resenasMap = toCountMap(resenasPorLugar);
    const favoritosMap = toCountMap(favoritosPorLugar);

    const lugaresMetricas = lugares
      .map((lugar) => ({
        id: lugar.id,
        nombre: lugar.nombre,
        categoria: lugar.categoria?.nombre || 'General',
        visitasPerfil: vistasMap.get(lugar.id) || 0,
        resenas: resenasMap.get(lugar.id) || 0,
        promedioCalificacion: roundRating(lugar.puntuacionPromedio),
        favoritos: favoritosMap.get(lugar.id) || 0,
      }))
      .sort((a, b) => {
        return (
          b.visitasPerfil - a.visitasPerfil ||
          b.resenas - a.resenas ||
          b.favoritos - a.favoritos ||
          a.nombre.localeCompare(b.nombre)
        );
      });

    const totals = lugaresMetricas.reduce(
      (acc, lugar) => ({
        visitasPerfil: acc.visitasPerfil + lugar.visitasPerfil,
        resenas: acc.resenas + lugar.resenas,
      }),
      { visitasPerfil: 0, resenas: 0 }
    );

    res.json({
      success: true,
      data: {
        rangeDays,
        from: from.toISOString(),
        to: to.toISOString(),
        totals: {
          visitasPerfil: totals.visitasPerfil,
          resenas: totals.resenas,
          promedioCalificacion: roundRating(promedioCalificacion._avg.puntuacion),
          favoritos: totalFavoritos,
        },
        lugares: lugaresMetricas,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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
