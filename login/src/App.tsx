import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Home from './Home';

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const token = localStorage.getItem('token');

  if (token) {
    return <Home />;
  }

  return (
    <>
      {showRegister ? (
        <Register onSwitch={() => setShowRegister(false)} />
      ) : (
        <Login onSwitch={() => setShowRegister(true)} />
      )}
    </>
  );
}

export default App;