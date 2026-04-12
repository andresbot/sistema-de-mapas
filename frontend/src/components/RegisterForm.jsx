import React, { useState } from 'react';
import axios from 'axios';

export const RegisterForm = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true); // Por defecto mostramos Login
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const endpoint = isLogin ? '/api/login' : '/api/register';
    try {
      const res = await axios.post(`http://localhost:3000${endpoint}`, formData);
      onAuthSuccess(res.data.user); // Pasa los datos del usuario a App.jsx
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Error de conexión");
    }
  };

  return (
    <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '320px' }}>
      <h2 style={{ textAlign: 'center', color: '#1d4ed8' }}>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {!isLogin && (
          <input placeholder="Nombre de usuario" onChange={e => setFormData({...formData, username: e.target.value})} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
        )}
        <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
        <input type="password" placeholder="Contraseña" onChange={e => setFormData({...formData, password: e.target.value})} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
        {errorMsg && <p style={{ color: 'red', fontSize: '13px', textAlign: 'center' }}>{errorMsg}</p>}
        <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          {isLogin ? 'Entrar' : 'Registrarme'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
        {isLogin ? "¿No tienes cuenta?" : "¿Ya estás registrado?"} 
        <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}>
          {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
        </span>
      </p>
    </div>
  );
};