import React from 'react';
import { Map, Bookmark, PlusCircle, User } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'mapa',      icon: Map,        label: 'Explorar'  },
  { id: 'guardados', icon: Bookmark,   label: 'Guardados' },
  { id: 'añadir',   icon: PlusCircle, label: 'Agregar'   },
  { id: 'perfil',   icon: User,       label: 'Perfil'    },
];

export default function PanelNav({ activeView, onNavigate }) {
  return (
    <div className="panel-nav">
      {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          className={`panel-nav__item${activeView === id ? ' is-active' : ''}`}
          onClick={() => onNavigate(id)}
        >
          <Icon size={18} strokeWidth={activeView === id ? 2 : 1.5} />
          {label}
        </button>
      ))}
    </div>
  );
}
