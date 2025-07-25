import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminSectionProps {
  userRole: string;
  userEmail: string;
}

interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  activeSubscriptions: number;
  totalRevenue: number;
}

const AdminSection: React.FC<AdminSectionProps> = ({ userRole, userEmail }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCourses: 0,
    activeSubscriptions: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchRealStats();
  }, []);

  const fetchRealStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Obtener estadísticas de usuarios
      const usersResponse = await fetch('http://localhost:3000/users/stats/overview', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Obtener total de cursos
      const coursesResponse = await fetch('http://localhost:3000/courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (usersResponse.ok && coursesResponse.ok) {
        const usersData = await usersResponse.json();
        const coursesData = await coursesResponse.json();

        setStats({
          totalUsers: usersData.totalUsers || 0,
          totalCourses: coursesData.length || 0,
          activeSubscriptions: usersData.usersBySubscription?.MONTHLY + usersData.usersBySubscription?.ANNUAL || 0,
          totalRevenue: calculateRevenue(usersData.usersBySubscription)
        });
      }
    } catch (error) {
      console.error('Error fetching real stats:', error);
      // Fallback a datos de ejemplo
      setStats({
        totalUsers: 127,
        totalCourses: 15,
        activeSubscriptions: 89,
        totalRevenue: 2450
      });
    }
  };

  const calculateRevenue = (subscriptions: any) => {
    if (!subscriptions) return 0;
    const monthly = (subscriptions.MONTHLY || 0) * 29.99;
    const annual = (subscriptions.ANNUAL || 0) * 299.99;
    return Math.round(monthly + annual);
  };

  const handleManageUsers = () => {
    navigate('/admin/users');
  };

  const handleManageCourses = () => {
    navigate('/admin/courses');
  };

  const handleViewCatalog = () => {
    navigate('/catalog');
  };

  const handleManageSubscriptions = () => {
    navigate('/admin/subscriptions');
  };

  const handleViewReports = () => {
    console.log('Ver reportes');
    // Implementar navegación a reportes
  };

  if (userRole !== 'ADMIN') {
    return null;
  }

  return (
    <div className="admin-section">
      <h3>Panel de Administración</h3>
      <p>Bienvenido, {userEmail}. Aquí tienes acceso completo al sistema.</p>
      
      <div className="admin-stats">
        <div className="stat-item">
          <p className="stat-number">{stats.totalUsers}</p>
          <p className="stat-label">Usuarios Totales</p>
        </div>
        <div className="stat-item">
          <p className="stat-number">{stats.totalCourses}</p>
          <p className="stat-label">Cursos Creados</p>
        </div>
        <div className="stat-item">
          <p className="stat-number">{stats.activeSubscriptions}</p>
          <p className="stat-label">Suscripciones Activas</p>
        </div>
        <div className="stat-item">
          <p className="stat-number">${stats.totalRevenue}</p>
          <p className="stat-label">Ingresos del Mes</p>
        </div>
      </div>

      <div className="admin-controls">
        <div className="admin-card">
          <h4>👥 Gestión de Usuarios</h4>
          <p>Administrar cuentas de usuarios, roles y permisos del sistema.</p>
          <button className="admin-btn" onClick={handleManageUsers}>
            Gestionar Usuarios
          </button>
        </div>

        <div className="admin-card">
          <h4>📚 Gestión de Cursos</h4>
          <p>Crear, editar y eliminar cursos. Gestionar contenido educativo.</p>
          <button className="admin-btn" onClick={handleManageCourses}>
            Gestionar Cursos
          </button>
        </div>

        <div className="admin-card">
          <h4>🎯 Catálogo de Cursos</h4>
          <p>Ver el catálogo completo y planes de suscripción disponibles.</p>
          <button className="admin-btn" onClick={handleViewCatalog}>
            Ver Catálogo
          </button>
        </div>

        <div className="admin-card">
          <h4>💳 Suscripciones</h4>
          <p>Administrar planes de suscripción y pagos de usuarios.</p>
          <button className="admin-btn" onClick={handleManageSubscriptions}>
            Gestionar Suscripciones
          </button>
        </div>

        <div className="admin-card">
          <h4>📊 Reportes y Análisis</h4>
          <p>Ver estadísticas detalladas y generar reportes del sistema.</p>
          <button className="admin-btn" onClick={handleViewReports}>
            Ver Reportes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSection;
