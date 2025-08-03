# LearnPro - Sistema de Gestión de Aprendizaje

LearnPro es una aplicación fullstack de gestión de aprendizaje con **backend en NestJS + Prisma** y **frontend en React + TypeScript (Vite)**. Incluye un sistema completo de administración con gestión de usuarios, cursos y suscripciones.

## 🚀 Características Principales

### Sistema de Autenticación
- ✅ Registro y login de usuarios
- ✅ Autenticación JWT con roles (ADMIN, INSTRUCTOR, STUDENT)
- ✅ Rutas protegidas por rol
- ✅ Middleware de autorización

### Panel de Administración
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión completa de usuarios (CRUD)
- ✅ Gestión de cursos con asignación de instructores
- ✅ Sistema de suscripciones con patrón Strategy
- ✅ Análisis y métricas del sistema

### Gestión de Usuarios
- ✅ Crear, editar y eliminar usuarios
- ✅ Asignación de roles (Admin, Instructor, Estudiante)
- ✅ Activar/desactivar usuarios
- ✅ Filtrado por rol y estado

### Gestión de Cursos
- ✅ Crear cursos con contenido completo
- ✅ Asignar instructores a cursos
- ✅ Configurar requerimientos de suscripción
- ✅ Gestión de estudiantes inscritos

### Sistema de Suscripciones
- ✅ Tipos: FREE, MONTHLY, ANNUAL
- ✅ Patrón Strategy para diferentes planes
- ✅ Gestión de estados activos/inactivos
- ✅ Análisis de suscripciones por tipo

## Estructura del Proyecto

```
learnpro/
├── learnpro-backend/          # Backend NestJS + Prisma
│   ├── src/
│   │   ├── auth/              # Módulo de autenticación
│   │   ├── users/             # Gestión de usuarios
│   │   ├── courses/           # Gestión de cursos
│   │   ├── subscriptions/     # Sistema de suscripciones
│   │   └── prisma/            # Configuración Prisma
│   └── prisma/
│       ├── schema.prisma      # Esquema de base de datos
│       └── migrations/        # Migraciones
└── login/                     # Frontend React + TypeScript
    ├── src/
    │   ├── components/        # Componentes reutilizables
    │   ├── pages/            # Páginas de la aplicación
    │   │   ├── AdminUsers.tsx    # Panel admin usuarios
    │   │   ├── AdminCourses.tsx  # Panel admin cursos
    │   │   └── AdminSubscriptions.tsx # Panel admin suscripciones
    │   └── styles/           # Estilos CSS
    └── public/
```


## 📋 Requisitos Previos

Asegúrate de tener instalados:

- **Node.js** (v16 o superior)
- **npm** o **yarn**
- **PostgreSQL** (recomendado) o base de datos compatible
- **Git** para control de versiones

## 🛠️ Instalación y Configuración

### 1. Backend (NestJS + Prisma)

```bash
# Navegar al directorio del backend
cd learnpro-backend

# Instalar dependencias principales
npm install

# Instalar dependencias específicas de autenticación
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install --save-dev @types/passport-jwt @types/bcrypt

# Instalar Swagger para documentación API
npm install @nestjs/swagger swagger-ui-express

# Instalar Prisma
npm install prisma @prisma/client
```

### 2. Configuración de Base de Datos

#### Opción A: PostgreSQL (Recomendado - Neon)
```bash
# Crear archivo .env en learnpro-backend/
DATABASE_URL="postgresql://usuario:password@host:5432/learnpro"
JWT_SECRET="tu_clave_secreta_muy_segura"
```

#### Opción B: SQLite (Desarrollo local)
```bash
# En .env
DATABASE_URL="file:./dev.db"
JWT_SECRET="tu_clave_secreta_muy_segura"
```

### 3. Configurar y Ejecutar Backend

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# Poblar base de datos con datos iniciales (opcional)
npx prisma db seed

# Iniciar servidor de desarrollo
npm run start:dev
```

El backend estará disponible en: `http://localhost:3000`

**Documentación API Swagger:** `http://localhost:3000/api`

### 4. Frontend (React + TypeScript)

```bash
# Navegar al directorio del frontend
cd ../login

# Instalar dependencias
npm install

# Instalar React Router para navegación
npm install react-router-dom
npm install --save-dev @types/react-router-dom

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 🚀 Ejecución Rápida

### Terminal 1 - Backend
```bash
cd learnpro-backend
npm run start:dev
```

### Terminal 2 - Frontend
```bash
cd login
npm run dev
```

## 📚 Uso del Sistema

### Acceso Inicial
1. Navega a `http://localhost:5173`
2. Registra un nuevo usuario o usa credenciales de demo
3. Los usuarios ADMIN tienen acceso completo al panel de administración

### Panel de Administración
- **Dashboard:** Estadísticas generales del sistema
- **Usuarios:** Gestión completa de usuarios y roles
- **Cursos:** Creación y gestión de contenido educativo
- **Suscripciones:** Administración de planes y estados

### Roles del Sistema
- **ADMIN:** Acceso completo a todas las funcionalidades
- **INSTRUCTOR:** Gestión de sus cursos asignados
- **STUDENT:** Acceso a cursos según suscripción

## 🔧 Comandos Útiles

### Backend
```bash
# Regenerar cliente Prisma después de cambios en schema
npx prisma generate

# Ver base de datos en navegador
npx prisma studio

# Reiniciar base de datos
npx prisma migrate reset

# Compilar para producción
npm run build
```

### Frontend
```bash
# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview

# Linting
npm run lint
```

## 🧪 Testing

### Backend
```bash
# Tests unitarios
npm run test

# Tests de integración
npm run test:e2e

# Coverage
npm run test:cov
```

## 📁 Estructura de Archivos Clave

### Backend
- `src/auth/` - Sistema de autenticación JWT
- `src/users/` - Gestión de usuarios y roles
- `src/courses/` - CRUD de cursos
- `src/subscriptions/` - Sistema de suscripciones con Strategy pattern
- `prisma/schema.prisma` - Esquema de base de datos

### Frontend
- `src/pages/AdminUsers.tsx` - Panel de gestión de usuarios
- `src/pages/AdminCourses.tsx` - Panel de gestión de cursos
- `src/pages/AdminSubscriptions.tsx` - Panel de gestión de suscripciones
- `src/components/AdminSection.tsx` - Dashboard principal
- `src/PrivateRoute.tsx` - Protección de rutas

## 🗄️ Base de Datos

### Modelo de Datos
```prisma
model User {
  id            String         @id @default(uuid())
  email         String         @unique
  password      String
  name          String
  role          Role           @default(STUDENT)
  isActive      Boolean        @default(true)
  subscriptions Subscription[]
  taughtCourses Course[]       @relation("UserInstructor")
  courses       Course[]       @relation("UserCourses")
}

model Course {
  id                   String           @id @default(uuid())
  title                String
  content              String
  subscriptionRequired SubscriptionType @default(FREE)
  instructor           User             @relation("UserInstructor")
  students             User[]           @relation("UserCourses")
}

model Subscription {
  id        String           @id @default(uuid())
  type      SubscriptionType
  userId    String
  active    Boolean          @default(true)
  startDate DateTime         @default(now())
  endDate   DateTime
  user      User             @relation(fields: [userId], references: [id])
}
```

## 🔐 Seguridad

- **JWT Tokens:** Autenticación segura con tokens de acceso
- **Bcrypt:** Hash de contraseñas con salt
- **Guards:** Protección de rutas por roles
- **Validación:** DTOs con class-validator
- **CORS:** Configurado para desarrollo y producción

## 🚀 Despliegue

### Backend (Recomendado: Railway/Heroku)
1. Configurar variables de entorno
2. Ejecutar migraciones en producción
3. Configurar SSL para PostgreSQL

### Frontend (Recomendado: Vercel/Netlify)
1. Configurar variables de entorno de API
2. Build optimizado para producción
3. Configurar rutas para SPA

## 🐛 Solución de Problemas

### Errores Comunes

**Error de conexión a BD:**
```bash
# Verificar que PostgreSQL esté corriendo
npx prisma studio

# Regenerar cliente Prisma
npx prisma generate
```

**Errores de TypeScript:**
```bash
# Limpiar cache de TypeScript en VS Code
# Ctrl+Shift+P -> "TypeScript: Restart TS Server"

# Verificar tipos de Prisma
npx prisma generate
```

**Puerto ocupado:**
```bash
# Backend (puerto 3000)
npx kill-port 3000

# Frontend (puerto 5173)
npx kill-port 5173
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo de Desarrollo

- **Backend:** NestJS + Prisma + PostgreSQL
- **Frontend:** React + TypeScript + Vite
- **Autenticación:** JWT + Bcrypt
- **Base de Datos:** PostgreSQL (Neon) / SQLite
- **Documentación:** Swagger/OpenAPI

---

**Desarrollado con ❤️ para la gestión educativa moderna**

