import React, { useState, useEffect } from 'react';
import '../styles/UserProfile.css';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  subscriptionType: string;
  joinDate: string;
  bio: string;
  avatar: string;
  stats: {
    coursesCompleted: number;
    totalHours: number;
    certificates: number;
    streak: number;
  };
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    publicProfile: boolean;
  };
}

const UserProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // Simular datos del perfil del usuario
      const mockProfile: UserProfile = {
        id: '1',
        name: 'Juan Estudiante',
        email: 'student@test.com',
        role: 'STUDENT',
        subscriptionType: 'MONTHLY',
        joinDate: '2025-01-01',
        bio: 'Estudiante apasionado por la tecnología y el aprendizaje continuo. Me interesa especialmente el desarrollo web y la inteligencia artificial.',
        avatar: 'https://via.placeholder.com/150',
        stats: {
          coursesCompleted: 8,
          totalHours: 120,
          certificates: 3,
          streak: 15
        },
        preferences: {
          notifications: true,
          emailUpdates: false,
          publicProfile: true
        }
      };
      setProfile(mockProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    try {
      console.log('Saving profile:', profile);
      // Implementar llamada a la API para guardar perfil
      setIsEditing(false);
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      alert('Error al actualizar el perfil');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (!profile) return;
    
    setProfile(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handlePreferenceChange = (field: string, value: boolean) => {
    if (!profile) return;
    
    setProfile(prev => prev ? {
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    } : null);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="error-container">
          <h2>Error al cargar el perfil</h2>
          <p>No se pudo cargar la información del usuario.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            <img 
              src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&size=150&background=667eea&color=white`} 
              alt={profile.name}
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${profile.name}&size=150&background=667eea&color=white`;
              }}
            />
          </div>
          <button className="change-avatar-btn">
            📷 Cambiar Foto
          </button>
        </div>
        
        <div className="profile-info">
          <div className="profile-name-section">
            {isEditing ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="profile-name-input"
              />
            ) : (
              <h1>{profile.name}</h1>
            )}
            <p className="profile-email">{profile.email}</p>
          </div>
          
          <div className="profile-badges">
            <span className={`role-badge ${profile.role.toLowerCase()}`}>
              {profile.role}
            </span>
            <span className={`subscription-badge ${profile.subscriptionType.toLowerCase()}`}>
              {profile.subscriptionType}
            </span>
          </div>
          
          <div className="profile-actions">
            {isEditing ? (
              <div className="editing-actions">
                <button className="save-btn" onClick={handleSaveProfile}>
                  💾 Guardar
                </button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                  ❌ Cancelar
                </button>
              </div>
            ) : (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                ✏️ Editar Perfil
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>📈 Estadísticas de Aprendizaje</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎓</div>
              <div className="stat-info">
                <h4>{profile.stats.coursesCompleted}</h4>
                <p>Cursos Completados</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏰</div>
              <div className="stat-info">
                <h4>{profile.stats.totalHours}h</h4>
                <p>Horas de Estudio</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-info">
                <h4>{profile.stats.certificates}</h4>
                <p>Certificados</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-info">
                <h4>{profile.stats.streak}</h4>
                <p>Días Consecutivos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>📝 Biografía</h3>
          {isEditing ? (
            <textarea
              value={profile.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="bio-textarea"
              rows={4}
              placeholder="Cuéntanos sobre ti..."
            />
          ) : (
            <p className="bio-text">{profile.bio}</p>
          )}
        </div>

        <div className="profile-section">
          <h3>⚙️ Preferencias</h3>
          <div className="preferences-grid">
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={profile.preferences.notifications}
                  onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                  disabled={!isEditing}
                />
                <span>Recibir notificaciones</span>
              </label>
            </div>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={profile.preferences.emailUpdates}
                  onChange={(e) => handlePreferenceChange('emailUpdates', e.target.checked)}
                  disabled={!isEditing}
                />
                <span>Actualizaciones por email</span>
              </label>
            </div>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={profile.preferences.publicProfile}
                  onChange={(e) => handlePreferenceChange('publicProfile', e.target.checked)}
                  disabled={!isEditing}
                />
                <span>Perfil público</span>
              </label>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>📅 Información de Cuenta</h3>
          <div className="account-info">
            <div className="info-item">
              <strong>Fecha de registro:</strong>
              <span>{new Date(profile.joinDate).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="info-item">
              <strong>ID de usuario:</strong>
              <span>{profile.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
