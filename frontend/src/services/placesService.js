import api from './api.js';

const VISITOR_ID_KEY = 'mapas_visitor_id';

const createVisitorId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const getVisitorId = () => {
  if (typeof window === 'undefined') return null;

  const existing = window.localStorage.getItem(VISITOR_ID_KEY);
  if (existing) return existing;

  const visitorId = createVisitorId();
  window.localStorage.setItem(VISITOR_ID_KEY, visitorId);
  return visitorId;
};

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

export const recordPlaceVisit = async (lugarId) => {
  const response = await api.post(`/lugares/${lugarId}/visitas`, {
    visitorId: getVisitorId(),
  });
  return response.data;
};

export const getRecommendations = async (limit = 6) => {
  const response = await api.get(`/recomendaciones?limit=${limit}`);
  return response.data?.data || { items: [], hasPersonalization: false, rules: {} };
};

export const recordSearchBehavior = async (query) => {
  const response = await api.post('/recomendaciones/busquedas', { query });
  return response.data;
};
