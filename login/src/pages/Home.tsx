import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // ← redirección sin recargar
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-navbar">
        <div className="brand">LearnPro</div>
        <nav className="nav-links">
          <Link to="/">Inicio</Link>

          <div className="dropdown">
            <span>Cursos ▾</span>
            <div className="dropdown-content">
              <Link to="/my-courses">Mis cursos</Link>
              <Link to="/explore">Explorar</Link>
              <Link to="/courses">Crear curso</Link>
            </div>
          </div>

          <div className="dropdown">
            <span>Suscripciones ▾</span>
            <div className="dropdown-content">
              <Link to="/subscription">Mi plan</Link>
              <Link to="/subscription/change">Cambiar</Link>
              <Link to="/billing">Facturación</Link>
            </div>
          </div>

          <button onClick={handleLogout}>Cerrar sesión</button>
        </nav>
      </header>

      <main className="dashboard-main">
        <h1>Bienvenido a LearnPro</h1>
        <p>Has iniciado sesión correctamente. Selecciona una opción del menú.</p>
      </main>
    </div>
  );
};

export default Home;
