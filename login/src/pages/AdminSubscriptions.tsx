import React, { useState, useEffect } from 'react';
import '../styles/Admin.css';

interface Subscription {
  id: string;
  subscriptionType: 'FREE' | 'MONTHLY' | 'ANNUAL';
  user: {
    id: string;
    name: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  byType: {
    FREE: number;
    MONTHLY: number;
    ANNUAL: number;
  };
}

const AdminSubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats>({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    byType: { FREE: 0, MONTHLY: 0, ANNUAL: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'FREE' | 'MONTHLY' | 'ANNUAL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/subscriptions/plans', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar suscripciones');
      }

      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
      calculateStats(data.subscriptions || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      alert('Error al cargar suscripciones');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (subs: Subscription[]) => {
    const total = subs.length;
    const active = subs.filter(s => s.isActive).length;
    const byType = subs.reduce((acc, sub) => {
      acc[sub.subscriptionType] = (acc[sub.subscriptionType] || 0) + 1;
      return acc;
    }, { FREE: 0, MONTHLY: 0, ANNUAL: 0 });

    const monthlyRevenue = byType.MONTHLY * 29.99;
    const yearlyRevenue = byType.ANNUAL * 299.99;

    setStats({
      totalSubscriptions: total,
      activeSubscriptions: active,
      monthlyRevenue: Math.round(monthlyRevenue),
      yearlyRevenue: Math.round(yearlyRevenue),
      byType
    });
  };

  const handleToggleSubscription = async (subscriptionId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/subscriptions/${subscriptionId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cambiar estado de suscripción');
      }

      alert('Estado de suscripción actualizado');
      fetchSubscriptions(); // Recargar lista
    } catch (error) {
      console.error('Error toggling subscription:', error);
      alert('Error al cambiar estado de suscripción');
    }
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    switch (filter) {
      case 'ACTIVE':
        return subscription.isActive;
      case 'INACTIVE':
        return !subscription.isActive;
      case 'ALL':
        return true;
      default:
        return subscription.subscriptionType === filter;
    }
  });

  const getSubscriptionColor = (type: string) => {
    switch (type) {
      case 'FREE': return '#68d391';
      case 'MONTHLY': return '#4299e1';
      case 'ANNUAL': return '#9f7aea';
      default: return '#a0aec0';
    }
  };

  const getSubscriptionLabel = (type: string) => {
    switch (type) {
      case 'FREE': return 'Gratuito';
      case 'MONTHLY': return 'Mensual';
      case 'ANNUAL': return 'Anual';
      default: return type;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>💳 Gestión de Suscripciones</h1>
          <p>Administra suscripciones, ingresos y estados de pago</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.totalSubscriptions}</h3>
            <p>Total Suscripciones</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.activeSubscriptions}</h3>
            <p>Activas</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.monthlyRevenue)}</h3>
            <p>Ingresos Mensuales</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.yearlyRevenue)}</h3>
            <p>Ingresos Anuales</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="admin-filters">
        <button 
          className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          Todas ({stats.totalSubscriptions})
        </button>
        <button 
          className={`filter-btn ${filter === 'ACTIVE' ? 'active' : ''}`}
          onClick={() => setFilter('ACTIVE')}
        >
          Activas ({stats.activeSubscriptions})
        </button>
        <button 
          className={`filter-btn ${filter === 'INACTIVE' ? 'active' : ''}`}
          onClick={() => setFilter('INACTIVE')}
        >
          Inactivas ({stats.totalSubscriptions - stats.activeSubscriptions})
        </button>
        <button 
          className={`filter-btn ${filter === 'FREE' ? 'active' : ''}`}
          onClick={() => setFilter('FREE')}
        >
          Gratuitas ({stats.byType.FREE})
        </button>
        <button 
          className={`filter-btn ${filter === 'MONTHLY' ? 'active' : ''}`}
          onClick={() => setFilter('MONTHLY')}
        >
          Mensuales ({stats.byType.MONTHLY})
        </button>
        <button 
          className={`filter-btn ${filter === 'ANNUAL' ? 'active' : ''}`}
          onClick={() => setFilter('ANNUAL')}
        >
          Anuales ({stats.byType.ANNUAL})
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando suscripciones...</p>
        </div>
      ) : (
        <div className="subscriptions-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map(subscription => (
                <tr key={subscription.id} className={!subscription.isActive ? 'inactive' : ''}>
                  <td className="user-info">
                    <div className="user-avatar">
                      {subscription.user.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{subscription.user.name}</span>
                  </td>
                  <td>{subscription.user.email}</td>
                  <td>
                    <span 
                      className="subscription-badge"
                      style={{ backgroundColor: getSubscriptionColor(subscription.subscriptionType) }}
                    >
                      {getSubscriptionLabel(subscription.subscriptionType)}
                    </span>
                  </td>
                  <td>{new Date(subscription.startDate).toLocaleDateString()}</td>
                  <td>{new Date(subscription.endDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${subscription.isActive ? 'active' : 'inactive'}`}>
                      {subscription.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className={`action-btn ${subscription.isActive ? 'deactivate' : 'activate'}`}
                        onClick={() => handleToggleSubscription(subscription.id)}
                        disabled={subscription.subscriptionType === 'FREE'}
                      >
                        {subscription.isActive ? '⏸️' : '▶️'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptionsPage;
