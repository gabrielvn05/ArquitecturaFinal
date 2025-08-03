import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPaypal, FaStripe } from 'react-icons/fa';
import ProgramacionBasica from '../assets/ProgramacionBasica.jpg';
import JavaScriptAvanzado from '../assets/JavaScript-Avanzado.png';
import Empresarial from '../assets/Empresarial.png';
import FullStack from '../assets/FullStack.jpg';
import Machine from '../assets/Machine.png';
import Diseno from '../assets/Diseno.jpg';
import '../styles/CourseCatalog.css';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  subscriptionRequired: 'FREE' | 'MONTHLY' | 'ANNUAL';
  price: number;
  rating: number;
  studentsCount: number;
  image: string;
  features: string[];
  whatYouLearn: string[];
}

interface SubscriptionPlan {
  type: 'FREE' | 'MONTHLY' | 'ANNUAL';
  name: string;
  price: number;
  duration: string;
  features: string[];
  coursesIncluded: string[];
  recommended?: boolean;
}

const CourseCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('STUDENT'); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchCoursesAndPlans();
  }, []);

  const fetchCoursesAndPlans = async () => {
    setLoading(true);
    try {
      // Simular datos de cursos
      const mockCourses: Course[] = [
        {
          id: '1',
          title: 'Introducción a la Programación',
          description: 'Aprende los fundamentos de la programación desde cero con ejemplos prácticos.',
          instructor: 'Carlos Mendoza',
          duration: '4 semanas',
          level: 'Principiante',
          subscriptionRequired: 'FREE',
          price: 0,
          rating: 4.5,
          studentsCount: 1250,
          image: ProgramacionBasica,
          features: ['Videos HD', 'Ejercicios prácticos', 'Certificado gratuito'],
          whatYouLearn: ['Conceptos básicos de programación', 'Variables y funciones', 'Estructuras de control', 'Debugging básico']
        },
        {
          id: '2',
          title: 'JavaScript Avanzado y Frameworks',
          description: 'Domina JavaScript moderno, React, Node.js y las mejores prácticas de desarrollo.',
          instructor: 'Ana García',
          duration: '8 semanas',
          level: 'Intermedio',
          subscriptionRequired: 'MONTHLY',
          price: 9.99,
          rating: 4.8,
          studentsCount: 856,
          image: JavaScriptAvanzado,
          features: ['Proyectos reales', 'Mentoría 1:1', 'Acceso a comunidad', 'Certificado verificado'],
          whatYouLearn: ['ES6+ y características modernas', 'React y hooks', 'Node.js y APIs', 'Testing y deployment']
        },
        {
          id: '3',
          title: 'Arquitectura de Software Empresarial',
          description: 'Diseña sistemas escalables y robustos utilizando patrones de diseño avanzados.',
          instructor: 'Roberto Silva',
          duration: '12 semanas',
          level: 'Avanzado',
          subscriptionRequired: 'ANNUAL',
          price: 99.99,
          rating: 4.9,
          studentsCount: 324,
          image: Empresarial,
          features: ['Masterclasses exclusivas', 'Proyecto final personalizado', 'Revisión de código 1:1', 'Certificado profesional'],
          whatYouLearn: ['Patrones de diseño enterprise', 'Microservicios y escalabilidad', 'Clean Architecture', 'DevOps y CI/CD']
        },
        {
          id: '4',
          title: 'Desarrollo Web Full Stack',
          description: 'Conviértete en desarrollador full stack con tecnologías modernas.',
          instructor: 'María López',
          duration: '10 semanas',
          level: 'Intermedio',
          subscriptionRequired: 'MONTHLY',
          price: 9.99,
          rating: 4.7,
          studentsCount: 642,
          image: FullStack,
          features: ['Stack completo MERN', 'Deployment en producción', 'Portfolio de proyectos'],
          whatYouLearn: ['Frontend con React', 'Backend con Node.js', 'Bases de datos', 'Deployment y hosting']
        },
        {
          id: '5',
          title: 'Machine Learning con Python',
          description: 'Implementa algoritmos de ML y construye modelos predictivos.',
          instructor: 'Dr. Luis Hernández',
          duration: '16 semanas',
          level: 'Avanzado',
          subscriptionRequired: 'ANNUAL',
          price: 99.99,
          rating: 4.9,
          studentsCount: 187,
          image: Machine,
          features: ['Datasets reales', 'GPU Cloud incluido', 'Mentoría con PhD', 'Certificado universitario'],
          whatYouLearn: ['Algoritmos de ML', 'Deep Learning', 'TensorFlow y PyTorch', 'Proyectos industriales']
        },
        {
          id: '6',
          title: 'Diseño UX/UI Profesional',
          description: 'Crea interfaces intuitivas y experiencias de usuario excepcionales.',
          instructor: 'Sofia Martínez',
          duration: '6 semanas',
          level: 'Principiante',
          subscriptionRequired: 'FREE',
          price: 0,
          rating: 4.4,
          studentsCount: 934,
          image: Diseno,
          features: ['Herramientas profesionales', 'Portfolio incluido', 'Feedback de expertos'],
          whatYouLearn: ['Principios de UX', 'Prototipado con Figma', 'Research de usuarios', 'Testing de usabilidad']
        }
      ];

      // Simular planes de suscripción
      const mockPlans: SubscriptionPlan[] = [
        {
          type: 'FREE',
          name: 'Plan Gratuito',
          price: 0,
          duration: 'Siempre gratis',
          features: [
            'Acceso a cursos básicos',
            'Videos en calidad estándar',
            'Certificados básicos',
            'Comunidad general'
          ],
          coursesIncluded: ['Cursos introductorios', 'Tutoriales básicos', 'Fundamentos']
        },
        {
          type: 'MONTHLY',
          name: 'Plan Premium Mensual',
          price: 9.99,
          duration: 'por mes',
          recommended: true,
          features: [
            'Acceso a todos los cursos intermedios',
            'Videos HD y material descargable',
            'Certificados verificados',
            'Mentoría grupal',
            'Proyectos prácticos',
            'Acceso a comunidad premium'
          ],
          coursesIncluded: ['Todos los cursos FREE', 'Cursos intermedios', 'Proyectos guiados']
        },
        {
          type: 'ANNUAL',
          name: 'Plan Premium Anual',
          price: 99.99,
          duration: 'por año (2 meses gratis)',
          features: [
            'Acceso completo a todos los cursos',
            'Contenido exclusivo y masterclasses',
            'Mentoría 1:1 personalizada',
            'Revisión de proyectos',
            'Certificados profesionales',
            'Acceso prioritario a nuevos cursos',
            'GPU Cloud para ML/AI',
            'Networking con profesionales'
          ],
          coursesIncluded: ['Todos los cursos', 'Contenido exclusivo', 'Masterclasses', 'Especialización avanzada']
        }
      ];

      setCourses(mockCourses);
      setSubscriptionPlans(mockPlans);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCourses = () => {
    if (selectedPlan === 'ALL') return courses;
    return courses.filter(course => course.subscriptionRequired === selectedPlan);
  };

  const handleChangePlan = (planType: string) => {
    setSelectedPlan(planType);
  };

  const handlePayment = (method: string) => {
    // Aquí puedes agregar lógica para redirigir al usuario al método de pago
    alert(`Método de pago seleccionado: ${method}`);
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'FREE': return '#68d391';
      case 'MONTHLY': return '#4299e1';
      case 'ANNUAL': return '#9f7aea';
      default: return '#a0aec0';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Principiante': return '#68d391';
      case 'Intermedio': return '#f6ad55';
      case 'Avanzado': return '#fc8181';
      default: return '#a0aec0';
    }
  };

  if (loading) {
    return (
      <div className="catalog-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando catálogo de cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-page">
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

          <button onClick={handleLogout}>Cerrar sesión</button>
        </nav>
      </header>

      <div className="catalog-header">
        <h1>📚 Catálogo de Cursos</h1>
        <p>Descubre qué plan necesitas para acceder a cada curso</p>
      </div>

      {/* Sección de Planes de Suscripción */}
      <div className="plans-showcase">
        <h2>💎 Planes de Suscripción</h2>
        <div className="plans-grid">
          {subscriptionPlans.map(plan => (
            <div 
              key={plan.type} 
              className={`plan-showcase-card ${plan.recommended ? 'recommended' : ''}`}
            >
              {plan.recommended && <div className="recommended-badge">Recomendado</div>}
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <span className="price">${plan.price}</span>
                  <span className="duration">{plan.duration}</span>
                </div>
              </div>
              <div className="plan-features">
                <h4>✨ Características:</h4>
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="plan-courses">
                <h4>📚 Cursos incluidos:</h4>
                <ul>
                  {plan.coursesIncluded.map((course, index) => (
                    <li key={index}>{course}</li>
                  ))}
                </ul>
                </div>
               <div className="plan-actions">
                {plan.type !== 'FREE' && (
                  <div className="plan-action-buttons">
                    <span>Actualizar a {plan.name}</span> {/* Leyenda para actualizar */}
                    <button className="select-plan-btn" onClick={() => handlePayment('PayPal')}><FaPaypal className="payment-logo" /> Pagar con PayPal</button> 
                    
                    <button className="select-plan-btn" onClick={() => handlePayment('Stripe')}><FaStripe className="payment-logo" /> Pagar con Stripe</button>
                  </div>
                )}
                {userRole === 'ADMIN' && (
                  <button className="change-image-btn">📷 Cambiar imagen</button>  // Solo visible para admin
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtros de Cursos */}
      <div className="catalog-filters">
        <h2>🎯 Explora Cursos por Plan</h2>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${selectedPlan === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedPlan('ALL')}
          >
            Todos los Cursos
          </button>
          <button 
            className={`filter-btn ${selectedPlan === 'FREE' ? 'active' : ''}`}
            onClick={() => setSelectedPlan('FREE')}
          >
            Cursos Gratuitos
          </button>
          <button 
            className={`filter-btn ${selectedPlan === 'MONTHLY' ? 'active' : ''}`}
            onClick={() => setSelectedPlan('MONTHLY')}
          >
            Plan Mensual
          </button>
          <button 
            className={`filter-btn ${selectedPlan === 'ANNUAL' ? 'active' : ''}`}
            onClick={() => setSelectedPlan('ANNUAL')}
          >
            Plan Anual
          </button>
        </div>
      </div>

      {/* Grid de Cursos */}
      <div className="courses-grid">
        {getFilteredCourses().map(course => (
          <div key={course.id} className="course-showcase-card">
            <div className="course-image">
              <img src={course.image} alt={course.title} />
              <div className="course-badges">
                <span 
                  className="level-badge"
                  style={{ backgroundColor: getLevelColor(course.level) }}
                >
                  {course.level}
                </span>
                <span 
                  className="subscription-badge"
                  style={{ backgroundColor: getPlanColor(course.subscriptionRequired) }}
                >
                  {course.subscriptionRequired === 'FREE' ? 'Gratis' : 
                   course.subscriptionRequired === 'MONTHLY' ? 'Premium' : 'Exclusivo'}
                </span>
              </div>
            </div>

            <div className="course-info">
              <h3>{course.title}</h3>
              <p className="course-description">{course.description}</p>
              
              <div className="course-meta">
                <div className="instructor">👨‍🏫 {course.instructor}</div>
                <div className="duration">⏱️ {course.duration}</div>
                <div className="rating">
                  ⭐ {course.rating} ({course.studentsCount} estudiantes)
                </div>
              </div>

              <div className="course-features">
                <h4>📋 Incluye:</h4>
                <ul>
                  {course.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="what-you-learn">
                <h4>🎯 Aprenderás:</h4>
                <ul>
                  {course.whatYouLearn.slice(0, 3).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                  {course.whatYouLearn.length > 3 && (
                    <li className="more-items">+{course.whatYouLearn.length - 3} temas más</li>
                  )}
                </ul>
              </div>

              <div className="course-pricing">
                {course.price === 0 ? (
                  <div className="free-course">
                    <span className="price">Gratis</span>
                    <button className="enroll-btn free">Inscribirse Ahora</button>
                  </div>
                ) : (
                  <div className="premium-course">
                    <div className="subscription-required">
                      <span className="required-plan">
                        Requiere plan {course.subscriptionRequired === 'MONTHLY' ? 'Premium Mensual' : 'Premium Anual'}
                      </span>
                      <span className="plan-price">${course.price}/mes</span>
                    </div>
                    <button 
          className="upgrade-btn premium"
          style={{ backgroundColor: getPlanColor(course.subscriptionRequired) }}
        >
          <FaPaypal className="payment-icon" /> Pagar con Paypal
        </button>
        <button 
          className="upgrade-btn premium"
          style={{ backgroundColor: getPlanColor(course.subscriptionRequired) }}
        >
          <FaStripe className="payment-icon" /> Pagar con Stripe
        </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {getFilteredCourses().length === 0 && (
        <div className="no-courses">
          <h3>No hay cursos disponibles para este filtro</h3>
          <p>Selecciona otro plan para ver más cursos.</p>
        </div>
      )}
    </div>
  );
};

export default CourseCatalogPage;
