import api from './api.js';

/**
 * Obtiene todos los lugares publicados desde el backend.
 * @returns {Promise<Array>} Lista de lugares con sus datos básicos.
 */
export const getLugares = async () => {
  const response = await api.get('/lugares');
  return response.data;
};

/**
 * HS12: Obtiene las reseñas asociadas a un lugar específico.
 */
export const getResenasPorLugar = async (lugarId) => {
  const response = await api.get(`/resenas/lugar/${lugarId}`);
  return response.data;
};

/**
 * HS13 & HS14: Envía una nueva reseña al backend.
 */
export const crearResena = async (resenaData) => {
  // resenaData debe ser un objeto: { lugarId, puntuacion, comentario }
  const response = await api.post('/resenas', resenaData);
  return response.data;
};

/**
 * HS15: Elimina una reseña mediante su ID único.
 */
export const eliminarResena = async (resenaId) => {
  const response = await api.delete(`/resenas/${resenaId}`);
  return response.data;
};