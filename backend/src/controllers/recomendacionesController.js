import { prisma } from '../config/prisma.js';

const MAX_QUERY_LENGTH = 80;
const RECENT_DAYS = 30;

const normalizeText = (value = '') => {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

const tokenize = (value = '') => {
  return normalizeText(value)
    .split(/[^a-z0-9]+/i)
    .map((term) => term.trim())
    .filter((term) => term.length >= 3)
    .slice(0, 8);
};

const addCategoryWeight = (weights, lugar, amount) => {
  const category = lugar?.categoria?.nombre;
  if (!category) return;
  const key = normalizeText(category);
  const current = weights.get(key) || { label: category, score: 0 };
  current.score += amount;
  weights.set(key, current);
};

const serializeLugar = (lugar, score, reason, signal) => ({
  id: lugar.id,
  nombre: lugar.nombre,
  descripcion: lugar.descripcion,
  latitud: lugar.latitud,
  longitud: lugar.longitud,
  direccion: lugar.direccion,
  horario: lugar.horario,
  telefono: lugar.telefono,
  puntuacionPromedio: lugar.puntuacionPromedio,
  totalResenas: lugar.totalResenas,
  categoria: lugar.categoria?.nombre || 'General',
  categoriaIcono: lugar.categoria?.icono || '📍',
  categoriaColor: lugar.categoria?.color || '#007AFF',
  creadorId: lugar.creadorId,
  score: Number(score.toFixed(2)),
  reason,
  signal,
});

const buildPlaceText = (lugar) => {
  return normalizeText([
    lugar.nombre,
    lugar.descripcion,
    lugar.direccion,
    lugar.categoria?.nombre,
  ].filter(Boolean).join(' '));
};

export const registrarBusqueda = async (req, res) => {
  try {
    const query = String(req.body?.query || '').trim().slice(0, MAX_QUERY_LENGTH);

    if (query.length < 2) {
      return res.status(400).json({ success: false, message: 'La búsqueda debe tener al menos 2 caracteres' });
    }

    await prisma.busquedaLugar.create({
      data: {
        query,
        usuarioId: req.user.id,
      },
    });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecomendaciones = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const limit = Math.min(Math.max(Number(req.query.limit || 6), 1), 12);
    const since = new Date(Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000);

    const [favoritos, resenas, vistas, busquedas, lugares] = await Promise.all([
      prisma.favorito.findMany({
        where: { usuarioId, lugar: { publicado: true } },
        include: { lugar: { include: { categoria: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.resena.findMany({
        where: { usuarioId, lugar: { publicado: true } },
        include: { lugar: { include: { categoria: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lugarVista.findMany({
        where: { usuarioId, createdAt: { gte: since }, lugar: { publicado: true } },
        include: { lugar: { include: { categoria: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.busquedaLugar.findMany({
        where: { usuarioId, createdAt: { gte: since } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.lugar.findMany({
        where: { publicado: true },
        include: {
          categoria: true,
          _count: { select: { favoritos: true, resenas: true } },
        },
      }),
    ]);

    const categoryWeights = new Map();
    const interactedIds = new Set();
    const viewedIds = new Set();
    const searchTerms = new Set();

    favoritos.forEach(({ lugar }) => {
      interactedIds.add(lugar.id);
      addCategoryWeight(categoryWeights, lugar, 5);
    });

    resenas.forEach(({ lugar }) => {
      interactedIds.add(lugar.id);
      addCategoryWeight(categoryWeights, lugar, 4);
    });

    vistas.forEach(({ lugar }) => {
      viewedIds.add(lugar.id);
      addCategoryWeight(categoryWeights, lugar, 2);
    });

    busquedas.forEach((busqueda) => {
      tokenize(busqueda.query).forEach((term) => searchTerms.add(term));
    });

    const hasPersonalization = categoryWeights.size > 0 || searchTerms.size > 0 || viewedIds.size > 0;
    const scored = lugares.map((lugar) => {
      const categoryKey = normalizeText(lugar.categoria?.nombre || 'General');
      const categorySignal = categoryWeights.get(categoryKey);
      const placeText = buildPlaceText(lugar);
      const matchedTerms = [...searchTerms].filter((term) => placeText.includes(term));

      let score = Number(lugar.puntuacionPromedio || 0) * 1.5;
      score += Math.min(Number(lugar.totalResenas || 0), 20) * 0.35;
      score += Math.min(lugar._count?.favoritos || 0, 20) * 0.4;

      if (categorySignal) score += categorySignal.score * 10;
      if (matchedTerms.length) score += matchedTerms.length * 8;
      if (viewedIds.has(lugar.id)) score += 1;
      if (interactedIds.has(lugar.id)) score -= 8;

      const reason = matchedTerms.length
        ? 'Coincide con tus búsquedas recientes'
        : categorySignal
          ? `Porque interactuaste con ${categorySignal.label}`
          : viewedIds.has(lugar.id)
            ? 'Relacionado con lugares que abriste'
            : 'Popular en la comunidad';

      const signal = matchedTerms.length
        ? 'busqueda'
        : categorySignal
          ? 'categoria'
          : viewedIds.has(lugar.id)
            ? 'visita'
            : 'popularidad';

      return { lugar, score, reason, signal, interacted: interactedIds.has(lugar.id) };
    });

    const ranked = scored.sort((a, b) => {
      return (
        b.score - a.score ||
        b.lugar.puntuacionPromedio - a.lugar.puntuacionPromedio ||
        b.lugar.totalResenas - a.lugar.totalResenas ||
        a.lugar.nombre.localeCompare(b.lugar.nombre)
      );
    });

    const primary = ranked.filter((item) => !item.interacted);
    const ordered = primary.length >= Math.min(limit, 3)
      ? primary
      : [...primary, ...ranked.filter((item) => item.interacted)];

    const items = ordered
      .slice(0, limit)
      .map(({ lugar, score, reason, signal }) => serializeLugar(lugar, score, reason, signal));

    res.json({
      success: true,
      data: {
        hasPersonalization,
        rules: {
          categorias: [...categoryWeights.values()]
            .sort((a, b) => b.score - a.score)
            .map((item) => item.label),
          busquedas: [...searchTerms],
        },
        items,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
