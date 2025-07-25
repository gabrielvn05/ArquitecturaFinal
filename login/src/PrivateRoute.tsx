import React from 'react';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
