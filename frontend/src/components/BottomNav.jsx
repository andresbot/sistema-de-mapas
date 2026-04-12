import React from 'react';

const BottomNav = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${activeTab === 'mapa' ? 'active' : ''}`}
        onClick={() => setActiveTab('mapa')}
      >
        <span className="icon">📍</span>
        <p>Mapa</p>
      </button>
      <button 
        className={`nav-item ${activeTab === 'perfil' ? 'active' : ''}`}
        onClick={() => setActiveTab('perfil')}
      >
        <span className="icon">👤</span>
        <p>Perfil</p>
      </button>
    </nav>
  );
};

export default BottomNav;