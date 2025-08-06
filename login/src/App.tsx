import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseCatalog from './pages/CourseCatalog';
import AdminUsers from './pages/AdminUsers';
import AdminCourses from './pages/AdminCourses';
import AdminSubscriptions from './pages/AdminSubscriptions';
import UserProfile from './pages/UserProfile';
import PrivateRoute from './PrivateRoute';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // 🔹 Escucha cambios en el token de localStorage
  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Si hay token, renderiza las rutas privadas */}
        {token ? (
          <>
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
            <Route path="/admin/users" element={<PrivateRoute><AdminUsers /></PrivateRoute>} />
            <Route path="/admin/courses" element={<PrivateRoute><AdminCourses /></PrivateRoute>} />
            <Route path="/admin/subscriptions" element={<PrivateRoute><AdminSubscriptions /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            <Route path="/catalog" element={<PrivateRoute><CourseCatalog /></PrivateRoute>} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

        {/* Redirección catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
