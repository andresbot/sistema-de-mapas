import React from 'react';
import { Star } from 'lucide-react';

const CATEGORY_ICONS = {
  restaurante: '🍴', parque: '🌳', cultura: '🎭', tienda: '🛍️',
  servicio: '🛠️', turismo: '🏛️', general: '📍',
};

function getCategoryIcon(categoria = '') {
  return CATEGORY_ICONS[categoria.toLowerCase()] || '📍';
}

export default function PlaceCard({ place, onClick }) {
  if (!place) return null;

  const icon = place.categoriaIcono || getCategoryIcon(place.categoria);
  const rating = Number(place.puntuacionPromedio || 0).toFixed(1);

  return (
    <div
      className="place-card-item"
      onClick={() => onClick?.(place)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick?.(place)}
    >
      <div className="place-card-item__icon">{icon}</div>
      <div className="place-card-item__body">
        <div className="place-card-item__name">{place.nombre}</div>
        <div className="place-card-item__meta">
          {place.categoria}{place.direccion ? ` · ${place.direccion}` : ''}
        </div>
      </div>
      {place.totalResenas > 0 && (
        <div className="place-card-item__rating">
          <Star size={11} fill="currentColor" strokeWidth={0} />
          {rating}
        </div>
      )}
    </div>
  );
}
