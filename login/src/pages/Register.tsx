import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://arquitecturafinal.onrender.com/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await response.json();

      if (data.access_token) {
        setSuccess('¡Registro exitoso! Redirigiendo al login...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(data.message || 'Error en el registro');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Registrarse</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Registrarse</button>
        {error && <div className="login-error">{error}</div>}
        {success && <div style={{ color: 'green', textAlign: 'center' }}>{success}</div>}
        <Link to="/login" className="app-switch-btn">
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </form>
    </div>
  );
};

export default Register;
