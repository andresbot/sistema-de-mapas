import React from 'react';

const Navbar = ({ onFilter, onSearch, categoriaActiva }) => {
  const categorias = ['Todos', 'Restaurante', 'Parque', 'Cultura', 'Tienda'];

  return (
    <header className="main-header">
      <div className="search-box">
        <input 
          type="text" 
          placeholder="¿A dónde vamos en Zarzal?" 
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="category-scroll">
        {categorias.map(cat => (
          <button 
            key={cat}
            className={`pill ${categoriaActiva === cat ? 'active-pill' : ''}`}
            onClick={() => onFilter(cat)}
          >
            {cat === 'Restaurante' && '🍴 '}
            {cat === 'Parque' && '🌳 '}
            {cat === 'Cultura' && '🎭 '}
            {cat === 'Tienda' && '🛍️ '}
            {cat}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Navbar;