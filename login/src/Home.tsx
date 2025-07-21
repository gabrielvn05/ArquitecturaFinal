import React from 'react';
function Home() {
  const token = localStorage.getItem('token');

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>¡Bienvenido!</h2>
        <p>Has iniciado sesión correctamente.</p>
        <p>
          <strong>Token:</strong> <br />
          <span style={{ wordBreak: 'break-all', fontSize: '0.9em' }}>{token}</span>
        </p>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.reload();
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Home;