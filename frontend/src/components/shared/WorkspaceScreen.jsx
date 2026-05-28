import React from 'react';
import { Home } from 'lucide-react';
import PanelNav from './PanelNav';

export default function WorkspaceScreen({
  activeView,
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  onNavigate,
  notifCount = 0,
  actions = null,
  children,
}) {
  return (
    <div className="workspace-screen">
      <div className="workspace-shell">
        <header className="workspace-topbar">
          <button
            type="button"
            className="workspace-brand"
            onClick={() => onNavigate('landing')}
            title="Volver al inicio"
          >
            <span>Mapa</span>
            <small>de Reseñas</small>
          </button>

          <div className="workspace-nav">
            <PanelNav activeView={activeView} onNavigate={onNavigate} notifCount={notifCount} />
          </div>

          <button
            type="button"
            className="btn btn--ghost btn--sm workspace-home"
            onClick={() => onNavigate('landing')}
          >
            <Home size={14} strokeWidth={1.8} /> Inicio
          </button>
        </header>

        <section className="workspace-hero">
          {Icon && (
            <span className="workspace-hero__icon">
              <Icon size={20} strokeWidth={1.8} />
            </span>
          )}
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {actions && <div className="workspace-hero__actions">{actions}</div>}
        </section>

        <main className="workspace-main">
          {children}
        </main>
      </div>
    </div>
  );
}
