import { prisma } from '../config/prisma.js';

// Función auxiliar para recalcular el promedio y total de reseñas de un lugar
const actualizarEstadisticasLugar = async (lugarId) => {
  const agregaciones = await prisma.resena.aggregate({
    where: { lugarId },
    _count: { id: true },
    _avg: { puntuacion: true }
  });

  await prisma.lugar.update({
    where: { id: lugarId },
    data: {
      totalResenas: agregaciones._count.id,
      puntuacionPromedio: agregaciones._avg.puntuacion || 0
    }
  });
};

// ==========================================
// HS13: Crear reseña (Y HS14 implícito en backend)
// ==========================================
export const crearResena = async (req, res) => {
  try {
    const { lugarId, puntuacion, comentario, imagenes, fechaVisita } = req.body;
    const usuarioId = req.user.id; // Obtenido desde tu authMiddleware

    // Validar puntuación de estrellas (HS14)
    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({ message: "La calificación debe ser entre 1 y 5 estrellas." });
    }

    // Verificar si el lugar existe
    const lugarExiste = await prisma.lugar.findUnique({ where: { id: lugarId } });
    if (!lugarExiste) {
      return res.status(404).json({ message: "El lugar especificado no existe." });
    }

    // Comprobar si el usuario ya reseñó este sitio (controlar error del @@unique)
    const resenaExistente = await prisma.resena.findUnique({
      where: { lugarId_usuarioId: { lugarId, usuarioId } }
    });

    if (resenaExistente) {
      return res.status(400).json({ message: "Ya has dejado una reseña en este lugar." });
    }

    // Crear reseña
    const nuevaResena = await prisma.resena.create({
      data: {
        puntuacion,
        comentario,
        imagenes,
        fechaVisita: fechaVisita ? new Date(fechaVisita) : null,
        lugarId,
        usuarioId
      }
    });

    // Recalcular promedios en el lugar
    await actualizarEstadisticasLugar(lugarId);

    return res.status(201).json({ message: "Reseña creada con éxito", data: nuevaResena });
  } catch (error) {
    console.error("Error al crear reseña:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// ==========================================
// HS12: Ver reseñas
// ==========================================
export const obtenerResenasPorLugar = async (req, res) => {
  try {
    const { lugarId } = req.params;

    const resenas = await prisma.resena.findMany({
      where: { lugarId },
      include: {
        usuario: {
          select: { id: 'true', nombre: 'true', avatar: 'true' } // Traer datos básicos del autor
        }
      },
      orderBy: { createdAt: 'desc' } // Mostrar las más recientes primero
    });

    return res.status(200).json(resenas);
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// ==========================================
// HS15: Eliminar reseña
// ==========================================
export const eliminarResena = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;
    const usuarioRol = req.user.rol; // Por si tienes admin en el token

    // Buscar la reseña primero para saber a qué lugar pertenece
    const resena = await prisma.resena.findUnique({ where: { id } });

    if (!resena) {
      return res.status(404).json({ message: "Reseña no encontrada." });
    }

    // Validar propiedad: solo el creador o un admin puede eliminarla
    if (resena.usuarioId !== usuarioId && usuarioRol !== 'admin') {
      return res.status(403).json({ message: "No tienes permisos para eliminar esta reseña." });
    }

    // Eliminar
    await prisma.resena.delete({ where: { id } });

    // Recalcular promedios en el lugar tras borrarla
    await actualizarEstadisticasLugar(resena.lugarId);

    return res.status(200).json({ message: "Reseña eliminada con éxito." });
  } catch (error) {
    console.error("Error al eliminar reseña:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};