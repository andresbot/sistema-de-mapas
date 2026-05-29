import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { deleteCloudinaryImage, REVIEW_IMAGE_FOLDER } from '../config/cloudinary.js';

export const getLugares = async (req, res) => {
  try {
    const lugares = await prisma.lugar.findMany({
      where: { publicado: true },
      include: {
        categoria: {
          select: { nombre: true, icono: true, color: true },
        },
        resenas: {
          include: {
            usuario: { select: { nombre: true, avatar: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    const response = lugares.map((lugar) => ({
      id: lugar.id,
      nombre: lugar.nombre,
      descripcion: lugar.descripcion,
      latitud: lugar.latitud,
      longitud: lugar.longitud,
      direccion: lugar.direccion,
      horario: lugar.horario,
      telefono: lugar.telefono,
      sitioWeb: lugar.sitioWeb,
      puntuacionPromedio: lugar.puntuacionPromedio,
      totalResenas: lugar.totalResenas,
      categoria: lugar.categoria?.nombre || 'General',
      categoriaIcono: lugar.categoria?.icono || '📍',
      categoriaColor: lugar.categoria?.color || '#007AFF',
      creadorId: lugar.creadorId,
      resenas: lugar.resenas || [],
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mapa de categorías con icono y color por defecto
const CATEGORIAS_DEFAULT = {
  restaurante: { icono: '🍴', color: '#FF6B35' },
  parque:      { icono: '🌳', color: '#4CAF50' },
  cultura:     { icono: '🎭', color: '#9C27B0' },
  tienda:      { icono: '🛍️', color: '#2196F3' },
  servicio:    { icono: '🛠️', color: '#FF9800' },
  turismo:     { icono: '🏛️', color: '#00BCD4' },
  general:     { icono: '📍', color: '#007AFF' },
};

const optionalText = (value) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
};

const optionalShortText = (value) => {
  const text = optionalText(value);
  return text ? text.slice(0, 191) : null;
};

const MAX_REVIEW_IMAGES = 3;
const MAX_REVIEW_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_REVIEW_IMAGE_FORMATS = new Set(['jpg', 'jpeg', 'png', 'webp']);

const compactText = (value, maxLength) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
};

const isValidHttpsUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
};

const normalizeReviewImages = (imagenes) => {
  if (imagenes === undefined || imagenes === null) {
    return { images: [], error: null };
  }

  if (!Array.isArray(imagenes)) {
    return { images: [], error: 'imagenes debe ser una lista' };
  }

  if (imagenes.length > MAX_REVIEW_IMAGES) {
    return { images: [], error: `Solo puedes subir hasta ${MAX_REVIEW_IMAGES} imagenes por resena` };
  }

  const expectedPrefix = `${REVIEW_IMAGE_FOLDER}/`;
  const images = [];

  for (const item of imagenes) {
    if (!item || typeof item !== 'object') {
      return { images: [], error: 'Cada imagen debe tener metadatos validos' };
    }

    const publicId = compactText(item.publicId, 255);
    const secureUrl = compactText(item.secureUrl, 1000);
    const format = compactText(item.format, 16).toLowerCase();
    const normalizedFormat = format === 'jpeg' ? 'jpg' : format;
    const width = Number(item.width);
    const height = Number(item.height);
    const bytes = Number(item.bytes);

    if (!publicId || !publicId.startsWith(expectedPrefix)) {
      return { images: [], error: 'La imagen no pertenece a la carpeta permitida' };
    }

    if (!secureUrl || !isValidHttpsUrl(secureUrl)) {
      return { images: [], error: 'La URL de imagen no es valida' };
    }

    if (!ALLOWED_REVIEW_IMAGE_FORMATS.has(normalizedFormat)) {
      return { images: [], error: 'Formato de imagen no permitido' };
    }

    if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
      return { images: [], error: 'Dimensiones de imagen invalidas' };
    }

    if (!Number.isFinite(bytes) || bytes <= 0 || bytes > MAX_REVIEW_IMAGE_BYTES) {
      return { images: [], error: 'Cada imagen debe pesar maximo 5 MB' };
    }

    images.push({
      publicId,
      secureUrl,
      width: Math.round(width),
      height: Math.round(height),
      format: normalizedFormat,
      bytes: Math.round(bytes),
    });
  }

  return { images, error: null };
};

const cleanupReviewImages = async (imagenes) => {
  if (!Array.isArray(imagenes) || imagenes.length === 0) return;

  const results = await Promise.allSettled(
    imagenes
      .map((image) => image?.publicId)
      .filter(Boolean)
      .map((publicId) => deleteCloudinaryImage(publicId))
  );

  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.warn('No se pudo eliminar una imagen de Cloudinary:', result.reason?.message || result.reason);
    }
  });
};

const getOptionalUsuarioId = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    if (!decoded?.id) return null;

    const user = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: { id: true },
    });

    return user?.id || null;
  } catch {
    return null;
  }
};

export const registrarVistaLugar = async (req, res) => {
  try {
    const { id } = req.params;
    const lugar = await prisma.lugar.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!lugar) {
      return res.status(404).json({ success: false, message: 'Lugar no encontrado' });
    }

    const usuarioId = await getOptionalUsuarioId(req);

    await prisma.lugarVista.create({
      data: {
        lugarId: id,
        usuarioId,
        visitorId: optionalShortText(req.body?.visitorId),
      },
    });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const crearLugar = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      latitud,
      longitud,
      categoria = 'General',
      direccion,
      horario,
      telefono,
    } = req.body;
    const creadorId = req.user.id;

    if (!nombre || latitud === undefined || longitud === undefined) {
      return res.status(400).json({ success: false, message: 'nombre, latitud y longitud son requeridos' });
    }

    const slug = categoria.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const defaults = CATEGORIAS_DEFAULT[slug] || CATEGORIAS_DEFAULT.general;

    // Busca o crea la categoría
    let cat = await prisma.categoria.findUnique({ where: { slug } });
    if (!cat) {
      cat = await prisma.categoria.create({
        data: { nombre: categoria, slug, icono: defaults.icono, color: defaults.color },
      });
    }

    const lugar = await prisma.lugar.create({
      data: {
        nombre: nombre.trim(),
        descripcion: optionalText(descripcion),
        direccion: optionalText(direccion),
        horario: optionalText(horario),
        telefono: optionalText(telefono),
        latitud: parseFloat(latitud),
        longitud: parseFloat(longitud),
        categoriaId: cat.id,
        creadorId,
      },
      include: { categoria: { select: { nombre: true, icono: true, color: true } } },
    });

    res.status(201).json({
      success: true,
      data: {
        id: lugar.id,
        nombre: lugar.nombre,
        descripcion: lugar.descripcion,
        latitud: lugar.latitud,
        longitud: lugar.longitud,
        direccion: lugar.direccion,
        horario: lugar.horario,
        telefono: lugar.telefono,
        categoria: lugar.categoria.nombre,
        categoriaIcono: lugar.categoria.icono,
        categoriaColor: lugar.categoria.color,
        puntuacionPromedio: lugar.puntuacionPromedio,
        totalResenas: lugar.totalResenas,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const eliminarLugar = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;
    const rol = req.user.rol;

    const lugar = await prisma.lugar.findUnique({ where: { id } });
    if (!lugar) return res.status(404).json({ success: false, message: 'Lugar no encontrado' });

    if (lugar.creadorId !== usuarioId && rol !== 'admin') {
      return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar este lugar' });
    }

    await prisma.lugar.delete({ where: { id } });
    res.json({ success: true, message: 'Lugar eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const eliminarResena = async (req, res) => {
  try {
    const { id, resenaId } = req.params;
    const usuarioId = req.user.id;
    const rol = req.user.rol;

    const resena = await prisma.resena.findUnique({ where: { id: resenaId } });
    if (!resena) return res.status(404).json({ success: false, message: 'Reseña no encontrada' });
    if (resena.lugarId !== id) return res.status(400).json({ success: false, message: 'La reseña no pertenece a este lugar' });
    if (resena.usuarioId !== usuarioId && rol !== 'admin') {
      return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar esta reseña' });
    }

    await prisma.resena.delete({ where: { id: resenaId } });

    const agregados = await prisma.resena.aggregate({
      where: { lugarId: id },
      _avg: { puntuacion: true },
      _count: { _all: true },
    });

    await prisma.lugar.update({
      where: { id },
      data: {
        puntuacionPromedio: agregados._avg.puntuacion || 0,
        totalResenas: agregados._count._all,
      },
    });

    await cleanupReviewImages(resena.imagenes);

    res.json({ success: true, message: 'Reseña eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const agregarResena = async (req, res) => {
  try {
    const { id } = req.params; // id del lugar
    const { puntuacion, comentario, imagenes } = req.body;
    const usuarioId = req.user.id;
    const score = Number(puntuacion);
    const { images: reviewImages, error: imageError } = normalizeReviewImages(imagenes);

    if (!Number.isInteger(score) || score < 1 || score > 5) {
      return res.status(400).json({ success: false, message: 'La puntuación debe ser entre 1 y 5' });
    }

    if (imageError) {
      return res.status(400).json({ success: false, message: imageError });
    }

    // Verificar si el usuario ya reseñó este lugar
    const resenaExistente = await prisma.resena.findUnique({
      where: {
        lugarId_usuarioId: {
          lugarId: id,
          usuarioId: usuarioId,
        }
      }
    });

    if (resenaExistente) {
      return res.status(400).json({ success: false, message: 'Ya has reseñado este lugar' });
    }

    // Crear la reseña
    const nuevaResena = await prisma.resena.create({
      data: {
        puntuacion: score,
        comentario: optionalText(comentario),
        imagenes: reviewImages.length > 0 ? reviewImages : null,
        lugarId: id,
        usuarioId
      },
      include: {
        usuario: { select: { nombre: true, avatar: true } }
      }
    });

    // Actualizar los agregados del lugar
    const agregados = await prisma.resena.aggregate({
      where: { lugarId: id },
      _avg: { puntuacion: true },
      _count: { _all: true }
    });

    await prisma.lugar.update({
      where: { id },
      data: {
        puntuacionPromedio: agregados._avg.puntuacion || 0,
        totalResenas: agregados._count._all
      }
    });

    res.status(201).json({ success: true, data: nuevaResena });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
