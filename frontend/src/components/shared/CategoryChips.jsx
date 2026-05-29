import React from 'react';

const CATEGORIES = ['Todos', 'Restaurante', 'Parque', 'Cultura', 'Tienda', 'Servicio', 'Turismo'];

export default function CategoryChips({ selected, onSelect }) {
  return (
    <div className="chips-float">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          type="button"
          className={`chip${selected === cat ? ' is-active' : ''}`}
          onClick={() => onSelect(cat === selected ? 'Todos' : cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
