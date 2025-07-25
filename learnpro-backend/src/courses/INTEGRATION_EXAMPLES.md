# Integración Cursos y Suscripciones - Ejemplos de Uso

## 🔗 Conexión entre Módulos

La integración entre cursos y suscripciones permite que el sistema determine qué cursos puede acceder un usuario basándose en su tipo de suscripción actual.

### 📊 Niveles de Acceso

| Suscripción | Cursos FREE | Cursos MONTHLY | Cursos ANNUAL |
|-------------|-------------|----------------|---------------|
| **FREE** | ✅ Sí | ❌ No | ❌ No |
| **MONTHLY** | ✅ Sí | ✅ Sí | ❌ No |
| **ANNUAL** | ✅ Sí | ✅ Sí | ✅ Sí |

## 🛠️ Ejemplos de API

### 1. Crear un curso con nivel de suscripción

```http
POST http://localhost:3000/courses
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "title": "Curso Avanzado de NestJS",
  "content": "Contenido premium del curso...",
  "subscriptionRequired": "MONTHLY"
}
```

**Respuesta:**
```json
{
  "id": "course-uuid-here",
  "title": "Curso Avanzado de NestJS",
  "content": "Contenido premium del curso...",
  "subscriptionRequired": "MONTHLY",
  "createdAt": "2025-01-27T16:00:00.000Z",
  "instructorId": "instructor-uuid"
}
```

### 2. Obtener todos los cursos con información de acceso

```http
GET http://localhost:3000/courses?userId=user-123
```

**Respuesta para usuario con suscripción FREE:**
```json
[
  {
    "id": "course-1",
    "title": "Introducción a JavaScript",
    "subscriptionRequired": "FREE",
    "hasAccess": true,
    "accessLevel": {
      "level": "Gratuito",
      "description": "Acceso libre",
      "icon": "🆓"
    },
    "userSubscriptionRequired": false,
    "instructor": {
      "id": "instructor-1",
      "name": "Juan Pérez",
      "email": "juan@example.com"
    }
  },
  {
    "id": "course-2",
    "title": "Curso Avanzado de NestJS",
    "subscriptionRequired": "MONTHLY",
    "hasAccess": false,
    "accessLevel": {
      "level": "Premium",
      "description": "Requiere suscripción mensual o anual",
      "icon": "⭐"
    },
    "userSubscriptionRequired": true,
    "instructor": {
      "id": "instructor-2",
      "name": "María García",
      "email": "maria@example.com"
    }
  }
]
```

### 3. Obtener un curso específico con verificación de acceso

```http
GET http://localhost:3000/courses/course-2?userId=user-with-free-subscription
```

**Respuesta para usuario FREE intentando acceder a curso MONTHLY:**
```json
{
  "id": "course-2",
  "title": "Curso Avanzado de NestJS",
  "content": "Contenido restringido - Se requiere suscripción",
  "subscriptionRequired": "MONTHLY",
  "hasAccess": false,
  "accessLevel": {
    "level": "Premium",
    "description": "Requiere suscripción mensual o anual",
    "icon": "⭐"
  },
  "userSubscriptionRequired": true,
  "instructor": {
    "id": "instructor-2",
    "name": "María García",
    "email": "maria@example.com"
  }
}
```

### 4. Obtener cursos disponibles para un usuario específico

```http
GET http://localhost:3000/courses/available/user-with-monthly-subscription
```

**Respuesta (solo cursos FREE y MONTHLY):**
```json
[
  {
    "id": "course-1",
    "title": "Introducción a JavaScript",
    "subscriptionRequired": "FREE",
    "instructor": {
      "id": "instructor-1",
      "name": "Juan Pérez",
      "email": "juan@example.com"
    }
  },
  {
    "id": "course-2",
    "title": "Curso Avanzado de NestJS",
    "subscriptionRequired": "MONTHLY",
    "instructor": {
      "id": "instructor-2",
      "name": "María García",
      "email": "maria@example.com"
    }
  }
]
```

## 🔄 Flujo de Trabajo Completo

### Escenario 1: Usuario sin suscripción quiere acceso premium

1. **Usuario consulta curso premium:**
```http
GET http://localhost:3000/courses/premium-course-id?userId=free-user-id
```

2. **Sistema responde con acceso restringido:**
```json
{
  "hasAccess": false,
  "content": "Contenido restringido - Se requiere suscripción",
  "userSubscriptionRequired": true
}
```

3. **Usuario consulta planes disponibles:**
```http
GET http://localhost:3000/subscriptions/plans
```

4. **Usuario se suscribe:**
```http
POST http://localhost:3000/subscriptions
{
  "type": "monthly",
  "userId": "free-user-id"
}
```

5. **Usuario ahora puede acceder al curso:**
```http
GET http://localhost:3000/courses/premium-course-id?userId=free-user-id
```

### Escenario 2: Instructor crea curso con nivel específico

1. **Instructor crea curso premium:**
```http
POST http://localhost:3000/courses
{
  "title": "Machine Learning Avanzado",
  "content": "Contenido del curso...",
  "subscriptionRequired": "ANNUAL"
}
```

2. **Solo usuarios con suscripción anual pueden acceder**

## 💻 Implementación en Frontend

### React/JavaScript Example

```javascript
// Función para verificar acceso a curso
async function checkCourseAccess(courseId, userId) {
  const response = await fetch(`/courses/${courseId}?userId=${userId}`);
  const course = await response.json();
  
  if (!course.hasAccess) {
    // Mostrar modal de suscripción
    showSubscriptionModal(course.accessLevel);
    return false;
  }
  
  // Usuario tiene acceso, mostrar contenido
  displayCourseContent(course);
  return true;
}

// Función para mostrar cursos disponibles
async function loadAvailableCourses(userId) {
  const response = await fetch(`/courses/available/${userId}`);
  const courses = await response.json();
  
  // Renderizar solo cursos disponibles
  renderCoursesList(courses);
}

// Función para obtener todos los cursos con información de acceso
async function loadAllCoursesWithAccess(userId) {
  const response = await fetch(`/courses?userId=${userId}`);
  const courses = await response.json();
  
  courses.forEach(course => {
    if (course.hasAccess) {
      // Mostrar como disponible
      renderAvailableCourse(course);
    } else {
      // Mostrar con botón de suscripción
      renderRestrictedCourse(course);
    }
  });
}
```

## 🧪 Testing de la Integración

### Test de Acceso por Suscripción

```javascript
describe('Course Access Integration', () => {
  it('should allow FREE user to access FREE courses only', async () => {
    const freeUser = await createUserWithSubscription('FREE');
    const freeCourse = await createCourse('FREE');
    const premiumCourse = await createCourse('MONTHLY');
    
    // Acceso permitido
    const freeAccess = await coursesService.findOne(freeCourse.id, freeUser.id);
    expect(freeAccess.hasAccess).toBe(true);
    
    // Acceso denegado
    const premiumAccess = await coursesService.findOne(premiumCourse.id, freeUser.id);
    expect(premiumAccess.hasAccess).toBe(false);
    expect(premiumAccess.content).toBe('Contenido restringido - Se requiere suscripción');
  });
  
  it('should allow MONTHLY user to access FREE and MONTHLY courses', async () => {
    const monthlyUser = await createUserWithSubscription('MONTHLY');
    const freeCourse = await createCourse('FREE');
    const monthlyCourse = await createCourse('MONTHLY');
    const annualCourse = await createCourse('ANNUAL');
    
    // Acceso permitido
    expect((await coursesService.findOne(freeCourse.id, monthlyUser.id)).hasAccess).toBe(true);
    expect((await coursesService.findOne(monthlyCourse.id, monthlyUser.id)).hasAccess).toBe(true);
    
    // Acceso denegado
    expect((await coursesService.findOne(annualCourse.id, monthlyUser.id)).hasAccess).toBe(false);
  });
});
```

## 📈 Beneficios de esta Integración

1. **Control de Acceso Automático**: El sistema verifica automáticamente si el usuario puede acceder al contenido
2. **Experiencia de Usuario Mejorada**: Los usuarios ven claramente qué contenido está disponible
3. **Monetización Efectiva**: Impulsa las suscripciones al mostrar contenido premium
4. **Flexibilidad**: Los instructores pueden asignar diferentes niveles a sus cursos
5. **Escalabilidad**: Fácil agregar nuevos niveles de suscripción

## 🔧 Configuración de Base de Datos

Para probar con datos reales, necesitas:

1. **Configurar PostgreSQL**
2. **Ejecutar migración:**
```bash
npx prisma migrate dev --name add_subscription_required_to_courses
```

3. **Poblar con datos de prueba:**
```sql
-- Insertar usuarios de prueba
INSERT INTO "User" (id, email, password, name, role) VALUES 
('user-free', 'free@test.com', '$2b$10$hash', 'Usuario Free', 'STUDENT'),
('user-monthly', 'monthly@test.com', '$2b$10$hash', 'Usuario Monthly', 'STUDENT'),
('instructor-1', 'instructor@test.com', '$2b$10$hash', 'Instructor', 'INSTRUCTOR');

-- Insertar suscripciones
INSERT INTO "Subscription" (id, type, "userId", "startDate", "endDate", active) VALUES
('sub-monthly', 'MONTHLY', 'user-monthly', NOW(), NOW() + INTERVAL '1 month', true);

-- Insertar cursos con diferentes niveles
INSERT INTO "Course" (id, title, content, "subscriptionRequired", "instructorId") VALUES
('course-free', 'Curso Gratuito', 'Contenido libre', 'FREE', 'instructor-1'),
('course-monthly', 'Curso Premium', 'Contenido premium', 'MONTHLY', 'instructor-1'),
('course-annual', 'Curso Elite', 'Contenido elite', 'ANNUAL', 'instructor-1');
```

¡La integración entre cursos y suscripciones está completamente implementada y funcional! 🚀
