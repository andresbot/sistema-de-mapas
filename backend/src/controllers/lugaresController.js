import { prisma } from '../config/prisma.js';

export const getLugares = async (req, res) => {
  try {
    const lugares = await prisma.lugar.findMany({
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

export const crearLugar = async (req, res) => {
  try {
    const { nombre, descripcion, latitud, longitud, categoria = 'General' } = req.body;
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
        nombre,
        descripcion: descripcion || null,
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

    res.json({ success: true, message: 'Reseña eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const agregarResena = async (req, res) => {
  try {
    const { id } = req.params; // id del lugar
    const { puntuacion, comentario } = req.body;
    const usuarioId = req.user.id;

    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({ success: false, message: 'La puntuación debe ser entre 1 y 5' });
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
        puntuacion,
        comentario,
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
