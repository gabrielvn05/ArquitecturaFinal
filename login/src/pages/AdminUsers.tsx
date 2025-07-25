import React, { useState, useEffect } from 'react';
import '../styles/Admin.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
  subscriptionType: 'FREE' | 'MONTHLY' | 'ANNUAL';
  createdAt: string;
  isActive: boolean;
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'ADMIN' | 'INSTRUCTOR' | 'STUDENT'>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT' as User['role']
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }

      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar rol');
      }

      const updatedUser = await response.json();
      const updatedUsers = users.map(user => 
        user.id === userId ? updatedUser : user
      );
      setUsers(updatedUsers);
      alert('Rol actualizado exitosamente');
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Error al actualizar el rol');
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al actualizar estado');
      }

      const updatedUser = await response.json();
      const updatedUsers = users.map(user => 
        user.id === userId ? updatedUser : user
      );
      setUsers(updatedUsers);
      alert('Estado de usuario actualizado');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al actualizar el estado del usuario');
    }
  };

  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) {
        throw new Error('Error al crear usuario');
      }

      alert('Usuario creado exitosamente');
      setShowCreateModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'STUDENT' });
      fetchUsers(); // Recargar lista
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error al crear usuario');
    }
  };

  const filteredUsers = users.filter(user => 
    filter === 'ALL' || user.role === filter
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return '#e53e3e';
      case 'INSTRUCTOR': return '#3182ce';
      case 'STUDENT': return '#38a169';
      default: return '#718096';
    }
  };

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case 'FREE': return '#68d391';
      case 'MONTHLY': return '#4299e1';
      case 'ANNUAL': return '#9f7aea';
      default: return '#a0aec0';
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>👥 Gestión de Usuarios</h1>
          <p>Administra usuarios, roles y permisos del sistema</p>
        </div>
        <button 
          className="create-user-btn"
          onClick={() => setShowCreateModal(true)}
        >
          ➕ Crear Usuario
        </button>
      </div>

      <div className="admin-filters">
        <button 
          className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          Todos ({users.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'STUDENT' ? 'active' : ''}`}
          onClick={() => setFilter('STUDENT')}
        >
          Estudiantes ({users.filter(u => u.role === 'STUDENT').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'INSTRUCTOR' ? 'active' : ''}`}
          onClick={() => setFilter('INSTRUCTOR')}
        >
          Instructores ({users.filter(u => u.role === 'INSTRUCTOR').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'ADMIN' ? 'active' : ''}`}
          onClick={() => setFilter('ADMIN')}
        >
          Admins ({users.filter(u => u.role === 'ADMIN').length})
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Suscripción</th>
                <th>Fecha de Registro</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className={!user.isActive ? 'inactive' : ''}>
                  <td className="user-info">
                    <div className="user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.name}</span>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <select 
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="role-select"
                      style={{ color: getRoleColor(user.role) }}
                    >
                      <option value="STUDENT">Estudiante</option>
                      <option value="INSTRUCTOR">Instructor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span 
                      className="subscription-badge"
                      style={{ backgroundColor: getSubscriptionColor(user.subscriptionType) }}
                    >
                      {user.subscriptionType}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className={`action-btn ${user.isActive ? 'deactivate' : 'activate'}`}
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.isActive ? '⏸️' : '▶️'}
                      </button>
                      <button className="action-btn edit">
                        ✏️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Modal para crear usuario */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>➕ Crear Nuevo Usuario</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ✖️
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Nombre completo"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value as User['role']})}
              >
                <option value="STUDENT">Estudiante</option>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-create"
                onClick={handleCreateUser}
              >
                Crear Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
