# LearnPro 

LearnPro es una aplicación fullstack de gestión de cursos y suscripciones compuesta por un **backend con NestJS + Prisma** y un **frontend con React + TypeScript (Vite)**. La aplicación incluye autenticación JWT, gestión de usuarios, catálogo de cursos, sistema de suscripciones y pasarelas de pago integradas (PayPal y Stripe).

## Estructura del Proyecto

```
ArquitecturaFinal/
├── learnpro-backend/          # Backend con NestJS y Prisma
│   ├── src/
│   │   ├── auth/              # Módulo de autenticación JWT
│   │   ├── users/             # Gestión de usuarios
│   │   ├── courses/           # Gestión de cursos
│   │   └── subscriptions/     # Sistema de suscripciones
│   ├── prisma/                # Esquemas de base de datos
│   └── .env                   # Variables de entorno del backend
└── login/                     # Frontend con React + Vite + TypeScript
    ├── src/
    │   ├── components/        # Componentes reutilizables
    │   │   ├── PayPalComponent.tsx
    │   │   ├── PayPalModal.tsx
    │   │   ├── StripeComponent.tsx
    │   │   ├── StripeModal.tsx
    │   │   └── PaymentModal.tsx
    │   ├── pages/             # Páginas principales
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── Home.tsx
    │   │   ├── CourseCatalog.tsx
    │   │   └── AdminUsers.tsx
    │   └── styles/            # Estilos CSS
    └── .env                   # Variables de entorno del frontend
```

## Características Principales

### Backend (NestJS + Prisma)
- **Autenticación JWT**: Login y registro de usuarios con roles (ADMIN, INSTRUCTOR, STUDENT)
- **Gestión de Usuarios**: CRUD completo con diferentes niveles de acceso
- **Catálogo de Cursos**: Creación, edición y gestión de cursos con niveles y categorías
- **Sistema de Suscripciones**: Planes FREE, MONTHLY y ANNUAL con diferentes beneficios
- **API REST**: Endpoints documentados con Swagger
- **Base de Datos**: PostgreSQL con migraciones automáticas

### Frontend (React + TypeScript)
- **Interfaz Responsive**: Diseño moderno y adaptativo
- **Autenticación**: Login/registro con manejo de sesiones
- **Dashboard Admin**: Panel de administración para gestión completa
- **Catálogo de Cursos**: Visualización de cursos por planes de suscripción
- **Pasarelas de Pago**: 
  - **PayPal**: Integración completa con SDK oficial
  - **Stripe**: Procesamiento de pagos con tarjeta de crédito
- **Modales Minimalistas**: Diseño compacto para experiencia de pago optimizada

## Requisitos Previos

Asegúrate de tener instalados:
- Node.js (v16 o superior)
- npm o yarn
- Base de datos PostgreSQL (recomendado) o SQLite para desarrollo

## Configuración del Backend

### 1. Instalación de dependencias

```bash
cd learnpro-backend
npm install
```

### 2. Configuración de variables de entorno

Crea un archivo `.env` en la raíz del backend:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/learnpro?schema=public"

# JWT
JWT_SECRET="tu_clave_secreta_super_segura_aqui"

# Configuración del servidor
PORT=3000
NODE_ENV=development
```

### 3. Configuración de la base de datos

```bash
# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# (Opcional) Poblar con datos de prueba
npx prisma db seed
```

### 4. Ejecutar el servidor

```bash
npm run start:dev
```

El backend estará disponible en `http://localhost:3000`

### 5. Documentación API

Swagger UI: `http://localhost:3000/api`

## Configuración del Frontend

### 1. Instalación de dependencias

```bash
cd login
npm install
```

### 2. Configuración de variables de entorno

Crea un archivo `.env` en la raíz del frontend:

```env
# PayPal (Sandbox)
VITE_PAYPAL_CLIENT_ID=tu_paypal_client_id_aqui

# Stripe (Test)
VITE_STRIPE_PUBLIC_KEY=pk_test_tu_stripe_public_key_aqui
```

### 3. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## Dependencias Principales

### Backend
- **@nestjs/core**: Framework principal
- **@nestjs/jwt**: Autenticación JWT
- **@nestjs/passport**: Estrategias de autenticación
- **@prisma/client**: ORM para base de datos
- **bcrypt**: Encriptación de contraseñas
- **@nestjs/swagger**: Documentación automática

### Frontend
- **react**: Biblioteca principal
- **react-router-dom**: Enrutamiento
- **@paypal/react-paypal-js**: SDK de PayPal
- **@stripe/stripe-js**: SDK de Stripe
- **@stripe/react-stripe-js**: Componentes React de Stripe
- **typescript**: Tipado estático

## Integración de Pasarelas de Pago

### PayPal
- Configuración con credenciales de sandbox
- Modal minimalista para experiencia de usuario optimizada
- Procesamiento directo sin pasos intermedios
- Manejo de callbacks de éxito y error

### Stripe
- Integración con Elements para formularios seguros
- Validación en tiempo real de tarjetas
- Diseño consistente con el modal de PayPal
- Preparado para integración con backend

## Estructura de la Base de Datos

### Modelos principales:
- **User**: Usuarios con roles y autenticación
- **Course**: Cursos con niveles, instructores y contenido
- **Subscription**: Planes de suscripción con precios y beneficios
- **UserSubscription**: Relación usuarios-suscripciones

## Scripts Disponibles

### Backend
```bash
npm run start:dev      # Desarrollo con hot-reload
npm run build          # Compilar para producción
npm run start:prod     # Ejecutar en producción
npm run test           # Ejecutar tests
npm run prisma:studio  # Abrir Prisma Studio
```

### Frontend
```bash
npm run dev           # Servidor de desarrollo
npm run build         # Compilar para producción
npm run preview       # Vista previa de producción
npm run lint          # Análisis de código
```

## Deployment

### Backend
1. Configurar variables de entorno de producción
2. Ejecutar migraciones: `npx prisma migrate deploy`
3. Compilar: `npm run build`
4. Ejecutar: `npm run start:prod`

### Frontend
1. Configurar variables de entorno de producción
2. Compilar: `npm run build`
3. Servir archivos estáticos desde `dist/`

## Contribución

1. Fork el repositorio
2. Crea una rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit tus cambios: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## Licencia



