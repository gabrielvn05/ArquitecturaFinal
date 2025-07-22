import React, { useEffect, useState } from 'react';
import '../styles/Courses.css';

// Tipos de datos
interface Course {
  id: string;
  title: string;
  content: string;
  instructor?: {
    id: string;
    name: string;
    email: string;
  };
}

interface CourseForm {
  title: string;
  content: string;
  id: string | null;
}

const API_BASE = 'http://localhost:3000'; // Cambia según tu backend

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<CourseForm>({ title: '', content: '', id: null });
  const [editing, setEditing] = useState(false);
  const [role, setRole] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCourses();
    decodeToken();
  }, []);

  const decodeToken = () => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role || '');
      setUserEmail(payload.email || '');
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE}/courses`);
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error en la operación');
      }

      await fetchCourses();
      setForm({ title: '', content: '', id: null });
      setEditing(false);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleEdit = (course: Course) => {
    setForm({
      title: course.title,
      content: course.content,
      id: course.id,
    });
    setEditing(true);
  };

  return (
    <div className="courses-container">
      <h2>Lista de Cursos</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <h3>{course.title}</h3>
            <p>{course.content}</p>
            <small>Instructor: {course.instructor?.name}</small>
            {(role === 'ADMIN' || course.instructor?.email === userEmail) && (
              <button onClick={() => handleEdit(course)}>Editar</button>
            )}
          </li>
        ))}
      </ul>

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
          <button type="submit">{editing ? 'Actualizar' : 'Crear'}</button>
        </form>
      )}
    </div>
  );
};

export default Courses;
