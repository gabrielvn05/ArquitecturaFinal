import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminSection from '../components/AdminSection';
import UserSection from '../components/UserSection';
import '../styles/Courses.css';

// Tipos de datos
interface Course {
  id: string;
  title: string;
  content: string;
  subscriptionRequired: 'FREE' | 'MONTHLY' | 'ANNUAL';
  hasAccess?: boolean;
  accessLevel?: {
    level: string;
    description: string;
    icon: string;
  };
  userSubscriptionRequired?: boolean;
  instructor?: {
    id: string;
    name: string;
    email: string;
  };
}

interface CourseForm {
  title: string;
  content: string;
  subscriptionRequired: 'FREE' | 'MONTHLY' | 'ANNUAL';
  id: string | null;
}

interface Subscription {
  id: string;
  type: 'FREE' | 'MONTHLY' | 'ANNUAL';
  active: boolean;
  endDate: string;
}

interface SubscriptionPlan {
  type: 'free' | 'monthly' | 'annual';
  price: number;
  features: string[];
}

const API_BASE = 'https://arquitecturafinal.onrender.com'; // Cambia según tu backend

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<CourseForm>({ 
    title: '', 
    content: '', 
    subscriptionRequired: 'FREE',
    id: null 
  });
  const [editing, setEditing] = useState(false);
  const [role, setRole] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userSubscription, setUserSubscription] = useState<Subscription | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchCourses();
    decodeToken();
    fetchSubscriptionPlans();
  }, []);

  const decodeToken = () => {
    if (!token) return;
    
    // Primero intentar obtener de localStorage (más confiable para demo)
    const storedRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');
    
    if (storedRole) {
      setRole(storedRole);
      setUserEmail(storedUserName || '');
      
      // Si tenemos un userId simulado, obtener suscripción
      const currentUserId = storedRole === 'ADMIN' ? 'admin-1' : 'student-1';
      fetchUserSubscription(currentUserId);
      return;
    }
    
    // Fallback: decodificar token JWT
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role || '');
      setUserEmail(payload.email || '');
      const currentUserId = payload.sub || payload.userId || '';
      
      // Obtener suscripción del usuario si existe
      if (currentUserId) {
        fetchUserSubscription(currentUserId);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const fetchUserSubscription = async (userId: string) => {
    try {
      const res = await fetch(`${API_BASE}/subscriptions/user/${userId}/active`);
      if (res.ok) {
        const subscription = await res.json();
        setUserSubscription(subscription);
      }
    } catch (err) {
      console.log('Usuario sin suscripción activa', err);
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      const res = await fetch(`${API_BASE}/subscriptions/plans`);
      const data = await res.json();
      setSubscriptionPlans(data.plans || []);
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
    }
  };

  const fetchCourses = async () => {
    try {
      const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
      const currentUserId = payload?.sub || payload?.userId;
      
      const url = currentUserId 
        ? `${API_BASE}/courses?userId=${currentUserId}`
        : `${API_BASE}/courses`;
        
      const res = await fetch(url);
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `${API_BASE}/courses/${form.id}`
      : `${API_BASE}/courses`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          subscriptionRequired: form.subscriptionRequired,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error en la operación');
      }

      await fetchCourses();
      setForm({ title: '', content: '', subscriptionRequired: 'FREE', id: null });
      setEditing(false);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleEdit = (course: Course) => {
    setForm({
      title: course.title,
      content: course.content,
      subscriptionRequired: course.subscriptionRequired,
      id: course.id,
    });
    setEditing(true);
  };

  const handleSubscribe = async (planType: 'free' | 'monthly' | 'annual') => {
    try {
      const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
      const currentUserId = payload?.sub || payload?.userId;
      
      if (!currentUserId) {
        alert('Debes estar logueado para suscribirte');
        return;
      }

      const res = await fetch(`${API_BASE}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: planType,
          userId: currentUserId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error al suscribirse');
      }

      const subscription = await res.json();
      setUserSubscription(subscription);
      setShowSubscriptionModal(false);
      await fetchCourses(); // Refrescar cursos con nuevo acceso
      alert(`¡Suscripción ${planType} activada exitosamente!`);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="dashboard-page">
      {/* Navbar del Dashboard */}
      <header className="dashboard-navbar">
        <div className="brand">LearnPro</div>
        <nav className="nav-links">
          <Link to="/">Inicio</Link>

          <div className="dropdown">
            <span>Cursos ▾</span>
            <div className="dropdown-content">
              <Link to="/catalog">📚 Catálogo</Link>
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

          <div className="dropdown">
            <span>
              {role === 'ADMIN' ? '👑' : '👤'} {localStorage.getItem('userName') || userEmail} ▾
            </span>
            <div className="dropdown-content">
              <Link to="/profile">Mi perfil</Link>
              <Link to="/settings">Configuración</Link>
              <span style={{padding: '1rem 1.5rem', color: '#666', fontSize: '0.8rem'}}>
                Rol: {role === 'ADMIN' ? 'Administrador' : 'Estudiante'}
              </span>
            </div>
          </div>

          <button onClick={handleLogout}>Cerrar sesión</button>
        </nav>
      </header>

      <div className="courses-container">
        <h2>Lista de Cursos</h2>
      
      {/* Mostrar sección según el rol del usuario */}
      {role === 'ADMIN' && (
        <AdminSection 
          userRole={role} 
          userEmail={userEmail} 
        />
      )}
      
      {/* Sección específica para Usuario */}
      {role === 'STUDENT' && (
        <UserSection 
          userRole={role}
          userEmail={userEmail}
          userName={userEmail.split('@')[0]} // Extraer nombre del email como ejemplo
          userSubscription={userSubscription}
        />
      )}
      
      {/* Información de suscripción del usuario */}
      {userSubscription && (
        <div className="subscription-info">
          <p>🎉 Suscripción activa: <strong>{userSubscription.type}</strong></p>
        </div>
      )}
      
      <ul className="courses-list">
        {courses.map((course: Course) => (
          <li key={course.id} className={`course-item ${!course.hasAccess ? 'restricted' : ''}`}>
            <div className="course-header">
              <h3>{course.title}</h3>
              {course.accessLevel && (
                <span className="access-badge">
                  {course.accessLevel.icon} {course.accessLevel.level}
                </span>
              )}
            </div>
            
            <p className="course-content">
              {course.hasAccess ? course.content : 'Contenido restringido - Se requiere suscripción'}
            </p>
            
            <div className="course-meta">
              <small>Instructor: {course.instructor?.name}</small>
              <small>Nivel requerido: {course.subscriptionRequired}</small>
            </div>
            
            {course.userSubscriptionRequired && (
              <div className="upgrade-section">
                <p className="upgrade-message">
                  {course.accessLevel?.description}
                </p>
                <button 
                  className="upgrade-btn"
                  onClick={() => setShowSubscriptionModal(true)}
                >
                  Actualizar Suscripción
                </button>
              </div>
            )}
            
            {/* Botón de editar solo para instructores/admins */}
            {(role === 'ADMIN' || course.instructor?.email === userEmail) && (
              <button 
                className="edit-btn"
                onClick={() => handleEdit(course)}
              >
                Editar
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Formulario para crear/editar cursos */}
      {(role === 'INSTRUCTOR' || role === 'ADMIN') && (
        <form onSubmit={handleSubmit} className="course-form">
          <h3>{editing ? 'Editar Curso' : 'Agregar Curso'}</h3>
          
          <input
            type="text"
            name="title"
            placeholder="Título del curso"
            value={form.title}
            onChange={handleChange}
            required
          />
          
          <textarea
            name="content"
            placeholder="Contenido del curso"
            value={form.content}
            onChange={handleChange}
            required
          />
          
          <select
            name="subscriptionRequired"
            value={form.subscriptionRequired}
            onChange={handleChange}
            required
          >
            <option value="FREE">🆓 Gratuito</option>
            <option value="MONTHLY">⭐ Premium (Mensual)</option>
            <option value="ANNUAL">💎 Premium Plus (Anual)</option>
          </select>
          
          <button type="submit">
            {editing ? 'Actualizar' : 'Crear'}
          </button>
        </form>
      )}

      {/* Modal de suscripciones */}
      {showSubscriptionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Planes de Suscripción</h3>
              <button 
                className="close-btn"
                onClick={() => setShowSubscriptionModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="subscription-plans">
              {subscriptionPlans.map((plan) => (
                <div key={plan.type} className="plan-card">
                  <h4>
                    {plan.type === 'free' && '🆓 Gratuito'}
                    {plan.type === 'monthly' && '⭐ Premium'}
                    {plan.type === 'annual' && '💎 Premium Plus'}
                  </h4>
                  <p className="plan-price">
                    ${plan.price}{plan.type !== 'free' ? `/${plan.type === 'monthly' ? 'mes' : 'año'}` : ''}
                  </p>
                  <ul className="plan-features">
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <button
                    className="subscribe-btn"
                    onClick={() => handleSubscribe(plan.type)}
                    disabled={userSubscription?.type === plan.type.toUpperCase()}
                  >
                    {userSubscription?.type === plan.type.toUpperCase() 
                      ? 'Plan Actual' 
                      : 'Seleccionar Plan'
                    }
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Courses;
