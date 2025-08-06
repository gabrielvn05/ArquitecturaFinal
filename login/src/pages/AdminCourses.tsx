import React, { useState, useEffect } from 'react';
import '../styles/Admin.css';

interface Course {
  id: string;
  title: string;
  content: string;
  subscriptionRequired: 'FREE' | 'MONTHLY' | 'ANNUAL';
  instructor: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface Instructor {
  id: string;
  name: string;
  email: string;
}

const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    content: '',
    subscriptionRequired: 'FREE' as Course['subscriptionRequired'],
    instructorId: ''
  });

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://arquitecturafinal.onrender.com/courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar cursos');
      }

      const coursesData = await response.json();
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Error al cargar cursos');
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://arquitecturafinal.onrender.com/users?role=INSTRUCTOR', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar instructores');
      }

      const instructorsData = await response.json();
      setInstructors(instructorsData);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const handleCreateCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://arquitecturafinal.onrender.com/courses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCourse)
      });

      if (!response.ok) {
        throw new Error('Error al crear curso');
      }

      alert('Curso creado exitosamente');
      setShowCreateModal(false);
      setNewCourse({ title: '', content: '', subscriptionRequired: 'FREE', instructorId: '' });
      fetchCourses(); // Recargar lista
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error al crear curso');
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setNewCourse({
      title: course.title,
      content: course.content,
      subscriptionRequired: course.subscriptionRequired,
      instructorId: course.instructor.id
    });
    setShowEditModal(true);
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://arquitecturafinal.onrender.com/courses/${editingCourse.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCourse)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar curso');
      }

      alert('Curso actualizado exitosamente');
      setShowEditModal(false);
      setEditingCourse(null);
      setNewCourse({ title: '', content: '', subscriptionRequired: 'FREE', instructorId: '' });
      fetchCourses(); // Recargar lista
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Error al actualizar curso');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://arquitecturafinal.onrender.com/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar curso');
      }

      alert('Curso eliminado exitosamente');
      fetchCourses(); // Recargar lista
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Error al eliminar curso');
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

  const getSubscriptionLabel = (subscription: string) => {
    switch (subscription) {
      case 'FREE': return 'Gratuito';
      case 'MONTHLY': return 'Mensual';
      case 'ANNUAL': return 'Anual';
      default: return subscription;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>📚 Gestión de Cursos</h1>
          <p>Administra cursos, contenido y niveles de acceso</p>
        </div>
        <button 
          className="create-user-btn"
          onClick={() => setShowCreateModal(true)}
        >
          ➕ Crear Curso
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando cursos...</p>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-header">
                <h3>{course.title}</h3>
                <span 
                  className="subscription-badge"
                  style={{ backgroundColor: getSubscriptionColor(course.subscriptionRequired) }}
                >
                  {getSubscriptionLabel(course.subscriptionRequired)}
                </span>
              </div>
              <div className="course-content">
                <p>{course.content.substring(0, 150)}...</p>
              </div>
              <div className="course-footer">
                <div className="instructor-info">
                  <span className="instructor-label">Instructor:</span>
                  <span className="instructor-name">{course.instructor.name}</span>
                </div>
                <div className="course-actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEditCourse(course)}
                  >
                    ✏️
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="course-date">
                Creado: {new Date(course.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear curso */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>📚 Crear Nuevo Curso</h3>
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
                placeholder="Título del curso"
                value={newCourse.title}
                onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
              />
              <textarea
                placeholder="Contenido del curso"
                value={newCourse.content}
                onChange={(e) => setNewCourse({...newCourse, content: e.target.value})}
                rows={4}
              />
              <select
                value={newCourse.subscriptionRequired}
                onChange={(e) => setNewCourse({...newCourse, subscriptionRequired: e.target.value as Course['subscriptionRequired']})}
              >
                <option value="FREE">Gratuito</option>
                <option value="MONTHLY">Suscripción Mensual</option>
                <option value="ANNUAL">Suscripción Anual</option>
              </select>
              <select
                value={newCourse.instructorId}
                onChange={(e) => setNewCourse({...newCourse, instructorId: e.target.value})}
              >
                <option value="">Seleccionar instructor</option>
                {instructors.map(instructor => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name} ({instructor.email})
                  </option>
                ))}
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
                onClick={handleCreateCourse}
                disabled={!newCourse.title || !newCourse.content || !newCourse.instructorId}
              >
                Crear Curso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar curso */}
      {showEditModal && editingCourse && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>✏️ Editar Curso</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCourse(null);
                  setNewCourse({ title: '', content: '', subscriptionRequired: 'FREE', instructorId: '' });
                }}
              >
                ✖️
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Título del curso"
                value={newCourse.title}
                onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
              />
              <textarea
                placeholder="Contenido del curso"
                value={newCourse.content}
                onChange={(e) => setNewCourse({...newCourse, content: e.target.value})}
                rows={4}
              />
              <select
                value={newCourse.subscriptionRequired}
                onChange={(e) => setNewCourse({...newCourse, subscriptionRequired: e.target.value as Course['subscriptionRequired']})}
              >
                <option value="FREE">Gratuito</option>
                <option value="MONTHLY">Suscripción Mensual</option>
                <option value="ANNUAL">Suscripción Anual</option>
              </select>
              <select
                value={newCourse.instructorId}
                onChange={(e) => setNewCourse({...newCourse, instructorId: e.target.value})}
              >
                <option value="">Seleccionar instructor</option>
                {instructors.map(instructor => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name} ({instructor.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCourse(null);
                  setNewCourse({ title: '', content: '', subscriptionRequired: 'FREE', instructorId: '' });
                }}
              >
                Cancelar
              </button>
              <button 
                className="btn-create"
                onClick={handleUpdateCourse}
                disabled={!newCourse.title || !newCourse.content || !newCourse.instructorId}
              >
                Actualizar Curso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoursesPage;
