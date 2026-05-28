import React from 'react';
import { Map, Bookmark, PlusCircle, User } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'mapa',      icon: Map,        label: 'Explorar'  },
  { id: 'guardados', icon: Bookmark,   label: 'Guardados' },
  { id: 'añadir',   icon: PlusCircle, label: 'Agregar'   },
  { id: 'perfil',   icon: User,       label: 'Perfil'    },
];

export default function PanelNav({ activeView, onNavigate, notifCount = 0 }) {
  return (
    <div className="panel-nav">
      {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          className={`panel-nav__item${activeView === id ? ' is-active' : ''}`}
          onClick={() => onNavigate(id)}
        >
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <Icon size={18} strokeWidth={activeView === id ? 2 : 1.5} />
            {id === 'perfil' && notifCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -5,
                width: 14, height: 14, borderRadius: '50%',
                background: '#EF4444', color: '#fff',
                fontSize: '0.5rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                lineHeight: 1,
              }}>
                {notifCount > 9 ? '9+' : notifCount}
              </span>
            )}
          </span>
          {label}
        </button>
      ))}
    </div>
  );
}
