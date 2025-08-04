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
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userRole', data.user?.role || 'STUDENT');
        localStorage.setItem('userName', data.user?.name || email);
        navigate('/'); // redirige al dashboard
      } else {
        setError(data.error || 'Error de autenticación');
      }
    } catch (err) {
      setError('Error de conexión con el servidor', err);
    } finally {
      setLoading(false);
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
