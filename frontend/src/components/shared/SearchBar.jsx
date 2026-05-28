import React from 'react';
import { Home, Search } from 'lucide-react';

export default function SearchBar({ value, onChange, onAvatarClick, onHomeClick, userInitials }) {
  return (
    <div className="search-float">
      {onHomeClick && (
        <button type="button" className="search-float__home" onClick={onHomeClick} title="Volver al inicio">
          <Home size={15} strokeWidth={1.8} />
        </button>
      )}
      <Search size={16} color="var(--amber)" strokeWidth={1.5} />
      <input
        className="search-float__input"
        type="text"
        placeholder="Buscar lugares..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {userInitials && (
        <div className="search-float__avatar" onClick={onAvatarClick} title="Mi perfil">
          {userInitials}
        </div>
      )}
    </div>
  );
}
