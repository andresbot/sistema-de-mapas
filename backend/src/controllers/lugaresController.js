import { prisma } from '../config/prisma.js';

const CATEGORIAS_DEFAULT = {
  restaurante: { icono: '🍴', color: '#FF6B35' },
  cafeteria: { icono: '☕', color: '#7c3aed' },
  cafetería: { icono: '☕', color: '#7c3aed' },
  parque: { icono: '🌳', color: '#4CAF50' },
  cultura: { icono: '🎭', color: '#9C27B0' },
  turismo: { icono: '🏛️', color: '#00BCD4' },
  tienda: { icono: '🛍️', color: '#2196F3' },
  entretenimiento: { icono: '🎟️', color: '#a855f7' },
  hotel: { icono: '🏨', color: '#f59e0b' },
  hoteles: { icono: '🏨', color: '#f59e0b' },
  servicio: { icono: '🛠️', color: '#FF9800' },
  general: { icono: '📍', color: '#007AFF' },
};

const mapLugarResponse = (lugar) => ({
  id: lugar.id,
  nombre: lugar.nombre,
  descripcion: lugar.descripcion,
  latitud: lugar.latitud,
  longitud: lugar.longitud,
  direccion: lugar.direccion,
  horario: lugar.horario,
  telefono: lugar.telefono,
  sitioWeb: lugar.sitioWeb,
  imagenes: lugar.imagenes,
  puntuacionPromedio: lugar.puntuacionPromedio,
  totalResenas: lugar.totalResenas,
  categoria: lugar.categoria?.nombre || 'General',
  categoriaIcono: lugar.categoria?.icono || '📍',
  categoriaColor: lugar.categoria?.color || '#007AFF',
  creador: lugar.creador ? { id: lugar.creador.id, nombre: lugar.creador.nombre, avatar: lugar.creador.avatar } : null,
  resenas: lugar.resenas
    ? lugar.resenas.map((r) => ({
        id: r.id,
        puntuacion: r.puntuacion,
        comentario: r.comentario,
        createdAt: r.createdAt,
        usuario: r.usuario ? { nombre: r.usuario.nombre, avatar: r.usuario.avatar } : { nombre: 'Usuario' },
      }))
    : [],
  createdAt: lugar.createdAt,
  updatedAt: lugar.updatedAt,
});

export const getLugares = async (req, res) => {
  try {
    const { categoria, busqueda } = req.query;

    const where = {};
    if (categoria && categoria !== 'Todos') {
      where.categoria = { nombre: categoria };
    }
    if (busqueda) {
      where.OR = [
        { nombre: { contains: busqueda } },
        { descripcion: { contains: busqueda } },
        { direccion: { contains: busqueda } },
      ];
    }

    const lugares = await prisma.lugar.findMany({
      where,
      include: {
        categoria: { select: { nombre: true, icono: true, color: true } },
        creador: { select: { id: true, nombre: true, avatar: true } },
        resenas: {
          include: { usuario: { select: { nombre: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(lugares.map(mapLugarResponse));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLugar = async (req, res) => {
  try {
    const lugar = await prisma.lugar.findUnique({
      where: { id: req.params.id },
      include: {
        categoria: { select: { nombre: true, icono: true, color: true } },
        creador: { select: { id: true, nombre: true, avatar: true } },
        resenas: {
          include: { usuario: { select: { nombre: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!lugar) {
      return res.status(404).json({ success: false, message: 'Lugar no encontrado' });
    }

    res.json({ success: true, data: mapLugarResponse(lugar) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const crearLugar = async (req, res) => {
  try {
    const {
      nombre, descripcion, latitud, longitud,
      categoria = 'General',
      direccion, horario, telefono, sitioWeb,
      puntuacion, comentario,
    } = req.body;
    const creadorId = req.user.id;

    if (!nombre || latitud === undefined || longitud === undefined) {
      return res.status(400).json({ success: false, message: 'nombre, latitud y longitud son requeridos' });
    }

    const slug = categoria.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const defaults = CATEGORIAS_DEFAULT[slug] || CATEGORIAS_DEFAULT.general;

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
        direccion: direccion || null,
        horario: horario || null,
        telefono: telefono || null,
        sitioWeb: sitioWeb || null,
        categoriaId: cat.id,
        creadorId,
      },
      include: {
        categoria: { select: { nombre: true, icono: true, color: true } },
        creador: { select: { id: true, nombre: true, avatar: true } },
      },
    });

    if (puntuacion && puntuacion >= 1 && puntuacion <= 5) {
      await prisma.resena.create({
        data: {
          puntuacion: parseInt(puntuacion),
          comentario: comentario || null,
          lugarId: lugar.id,
          usuarioId: creadorId,
        },
      });

      await prisma.lugar.update({
        where: { id: lugar.id },
        data: {
          puntuacionPromedio: puntuacion,
          totalResenas: 1,
        },
      });
    }

    const lugarCompleto = await prisma.lugar.findUnique({
      where: { id: lugar.id },
      include: {
        categoria: { select: { nombre: true, icono: true, color: true } },
        creador: { select: { id: true, nombre: true, avatar: true } },
      },
    });

    res.status(201).json({ success: true, data: mapLugarResponse(lugarCompleto) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const actualizarLugar = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;
    const rol = req.user.rol;

    const lugar = await prisma.lugar.findUnique({ where: { id } });
    if (!lugar) {
      return res.status(404).json({ success: false, message: 'Lugar no encontrado' });
    }

    if (lugar.creadorId !== usuarioId && rol !== 'admin') {
      return res.status(403).json({ success: false, message: 'No tienes permiso para editar este lugar' });
    }

    const {
      nombre, descripcion, latitud, longitud,
      categoria, direccion, horario, telefono, sitioWeb,
    } = req.body;

    const data = {};
    if (nombre !== undefined) data.nombre = nombre;
    if (descripcion !== undefined) data.descripcion = descripcion;
    if (latitud !== undefined) data.latitud = parseFloat(latitud);
    if (longitud !== undefined) data.longitud = parseFloat(longitud);
    if (direccion !== undefined) data.direccion = direccion;
    if (horario !== undefined) data.horario = horario;
    if (telefono !== undefined) data.telefono = telefono;
    if (sitioWeb !== undefined) data.sitioWeb = sitioWeb;

    if (categoria) {
      const slug = categoria.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const defaults = CATEGORIAS_DEFAULT[slug] || CATEGORIAS_DEFAULT.general;
      let cat = await prisma.categoria.findUnique({ where: { slug } });
      if (!cat) {
        cat = await prisma.categoria.create({
          data: { nombre: categoria, slug, icono: defaults.icono, color: defaults.color },
        });
      }
      data.categoriaId = cat.id;
    }

    const updated = await prisma.lugar.update({
      where: { id },
      data,
      include: {
        categoria: { select: { nombre: true, icono: true, color: true } },
        creador: { select: { id: true, nombre: true, avatar: true } },
        resenas: {
          include: { usuario: { select: { nombre: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    res.json({ success: true, data: mapLugarResponse(updated) });
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

    await prisma.resena.deleteMany({ where: { lugarId: id } });
    await prisma.lugar.delete({ where: { id } });
    res.json({ success: true, message: 'Lugar eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const agregarResena = async (req, res) => {
  try {
    const { id } = req.params;
    const { puntuacion, comentario } = req.body;
    const usuarioId = req.user.id;

    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({ success: false, message: 'La puntuación debe ser entre 1 y 5' });
    }

    const resenaExistente = await prisma.resena.findUnique({
      where: { lugarId_usuarioId: { lugarId: id, usuarioId } },
    });

    if (resenaExistente) {
      return res.status(400).json({ success: false, message: 'Ya has reseñado este lugar' });
    }

    const nuevaResena = await prisma.resena.create({
      data: { puntuacion, comentario, lugarId: id, usuarioId },
      include: { usuario: { select: { nombre: true, avatar: true } } },
    });

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

    res.status(201).json({ success: true, data: nuevaResena });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
