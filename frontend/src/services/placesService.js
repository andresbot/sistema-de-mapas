import api from './api.js';

/**
 * Obtiene todos los lugares publicados desde el backend.
 * @returns {Promise<Array>} Lista de lugares con sus datos básicos.
 */
export const getLugares = async () => {
  const response = await api.get('/lugares');
  return response.data;
};

export const getFavoritos = async () => {
  const response = await api.get('/favoritos');
  return response.data;
};

export const toggleFavorito = async (lugarId) => {
  const response = await api.post(`/favoritos/${lugarId}`);
  return response.data;
};