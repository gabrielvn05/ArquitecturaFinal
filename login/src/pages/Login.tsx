import * as React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
  const res = await fetch('https://arquitecturafinal.onrender.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('Respuesta no válida del servidor');
  }

  if (res.ok && data.access_token) {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('userRole', data.user?.role || 'STUDENT');
    localStorage.setItem('userName', data.user?.name || email);
    navigate('/', { replace: true });
  } else {
    setError(data.message || `Error ${res.status}: ${res.statusText}`);
  }
} catch (err) {
  console.error('❌ Error de conexión:', err);
  setError('Error de conexión con el servidor');
}

  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Entrar'}
        </button>
        {error && <div className="login-error">{error}</div>}
        <Link to="/register" className="app-switch-btn">
          ¿No tienes cuenta? Regístrate
        </Link>
      </form>
    </div>
  );
};

export default Login;
