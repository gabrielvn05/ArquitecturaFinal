import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserSectionProps {
  userRole: string;
  userEmail: string;
  userName: string;
  userSubscription: any;
}

interface UserProgress {
  coursesEnrolled: number;
  coursesCompleted: number;
  totalHours: number;
  achievements: string[];
}

const UserSection: React.FC<UserSectionProps> = ({ 
  userRole, 
  userEmail, 
  userName, 
  userSubscription 
}) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<UserProgress>({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    totalHours: 0,
    achievements: []
  });

  useEffect(() => {
    // Simular datos de progreso del usuario (en producción, esto vendría de la API)
    setProgress({
      coursesEnrolled: 5,
      coursesCompleted: 2,
      totalHours: 24,
      achievements: ['Primera Lección', 'Curso Completado', 'Estudiante Activo']
    });
  }, []);

  const getSubscriptionStatus = () => {
    if (!userSubscription) {
      return { type: 'FREE', status: 'Gratuita', color: '#68D391' };
    }
    
    switch (userSubscription.type) {
      case 'MONTHLY':
        return { type: 'MONTHLY', status: 'Premium Mensual', color: '#4299E1' };
      case 'ANNUAL':
        return { type: 'ANNUAL', status: 'Premium Anual', color: '#9F7AEA' };
      default:
        return { type: 'FREE', status: 'Gratuita', color: '#68D391' };
    }
  };

  const subscriptionInfo = getSubscriptionStatus();
  const progressPercentage = (progress.coursesCompleted / progress.coursesEnrolled) * 100 || 0;

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const handleViewCertificates = () => {
    console.log('Ver certificados');
    // Implementar navegación a certificados
  };

  const handleUpgradeSubscription = () => {
    console.log('Actualizar suscripción');
    // Implementar modal de actualización de suscripción
  };

  const handleViewCatalog = () => {
    navigate('/catalog');
  };

  return (
    <div className="user-section">
      <h3>Mi Dashboard</h3>
      <p>¡Hola {userName}! Aquí está tu progreso de aprendizaje.</p>
      
      <div className="user-dashboard">
        <div className="user-info">
          <h4>📋 Información Personal</h4>
          <div className="user-detail">
            <span>Nombre:</span>
            <span>{userName}</span>
          </div>
          <div className="user-detail">
            <span>Email:</span>
            <span>{userEmail}</span>
          </div>
          <div className="user-detail">
            <span>Rol:</span>
            <span>{userRole}</span>
          </div>
          <div className="user-detail">
            <span>Suscripción:</span>
            <span style={{ color: subscriptionInfo.color }}>
              {subscriptionInfo.status}
            </span>
          </div>
          <div className="user-detail">
            <span>Miembro desde:</span>
            <span>Enero 2025</span>
          </div>
        </div>

        <div className="user-progress">
          <h4>📈 Mi Progreso</h4>
          <div className="user-detail">
            <span>Cursos Inscritos:</span>
            <span>{progress.coursesEnrolled}</span>
          </div>
          <div className="user-detail">
            <span>Cursos Completados:</span>
            <span>{progress.coursesCompleted}</span>
          </div>
          <div className="user-detail">
            <span>Horas de Estudio:</span>
            <span>{progress.totalHours}h</span>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <div className="user-detail">
              <span>Progreso General:</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <strong>🏆 Logros:</strong>
            <div style={{ marginTop: '0.5rem' }}>
              {progress.achievements.map((achievement, index) => (
                <span key={index} className="achievement-badge">
                  {achievement}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <button className="quick-action-btn" onClick={handleViewProfile}>
          👤 Ver Perfil Completo
        </button>
        <button className="quick-action-btn" onClick={handleViewCatalog}>
          📚 Explorar Catálogo
        </button>
        <button className="quick-action-btn" onClick={handleViewCertificates}>
          🎓 Mis Certificados
        </button>
        {subscriptionInfo.type === 'FREE' && (
          <button className="quick-action-btn" onClick={handleUpgradeSubscription}>
            ⭐ Mejorar Suscripción
          </button>
        )}
      </div>
    </div>
  );
};

export default UserSection;
