# Implementación del Patrón Strategy para Suscripciones

## Descripción

Este proyecto implementa el **Patrón Strategy** para manejar diferentes tipos de suscripciones en la plataforma LearnPro. El patrón Strategy permite definir una familia de algoritmos (en este caso, estrategias de suscripción), encapsularlos y hacerlos intercambiables.

## Estructura del Patrón Strategy

### 1. Interfaz Strategy (`SubscriptionStrategy`)

Define la interfaz común que deben implementar todas las estrategias de suscripción:

```typescript
export interface SubscriptionStrategy {
  createSubscription(data: SubscriptionStrategyData): Promise<any>;
  calculatePrice(): number;
  calculateEndDate(startDate: Date): Date;
  getFeatures(): string[];
}
```

### 2. Estrategias Concretas

#### FreeSubscriptionStrategy
- **Precio**: $0
- **Duración**: Nunca expira
- **Características**: Acceso limitado a cursos básicos

#### MonthlySubscriptionStrategy
- **Precio**: $9.99/mes
- **Duración**: 1 mes
- **Características**: Acceso a todos los cursos básicos

#### AnnualSubscriptionStrategy
- **Precio**: $99.99/año
- **Duración**: 1 año
- **Características**: Acceso premium completo

### 3. Contexto (`SubscriptionContext`)

Mantiene una referencia a una estrategia y delega las operaciones a ella:

```typescript
export class SubscriptionContext {
  private strategy: SubscriptionStrategy;

  constructor(strategy: SubscriptionStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: SubscriptionStrategy) {
    this.strategy = strategy;
  }

  async create(data: SubscriptionStrategyData) {
    return this.strategy.createSubscription(data);
  }
}
```

## Ventajas del Patrón Strategy

1. **Flexibilidad**: Fácil agregar nuevos tipos de suscripción
2. **Mantenibilidad**: Cada estrategia está encapsulada
3. **Reutilización**: Las estrategias pueden reutilizarse en diferentes contextos
4. **Principio Abierto/Cerrado**: Abierto para extensión, cerrado para modificación

## Uso del Patrón

### Crear una suscripción mensual:
```typescript
const monthlyStrategy = new MonthlySubscriptionStrategy(prismaService);
const context = new SubscriptionContext(monthlyStrategy);
const subscription = await context.create({ userId: 'user-123' });
```

### Cambiar estrategia en tiempo de ejecución:
```typescript
const annualStrategy = new AnnualSubscriptionStrategy(prismaService);
context.setStrategy(annualStrategy);
const annualSubscription = await context.create({ userId: 'user-123' });
```

## API Endpoints

### Crear Suscripción
```
POST /subscriptions
{
  "type": "monthly|annual|free",
  "userId": "uuid",
  "startDate": "2025-01-01T00:00:00Z" // opcional
}
```

### Obtener Planes Disponibles
```
GET /subscriptions/plans
```

### Obtener Información de un Plan
```
GET /subscriptions/info?type=monthly
```

### Obtener Suscripciones de Usuario
```
GET /subscriptions/user/:userId
```

### Cancelar Suscripción
```
PATCH /subscriptions/:id/cancel
```

## Características de Cada Plan

### Plan Gratuito
- ✅ Acceso a cursos básicos limitados
- ✅ Soporte por comunidad
- ❌ Sin certificados
- ❌ Contenido limitado

### Plan Mensual
- ✅ Acceso a todos los cursos básicos
- ✅ Soporte por email
- ✅ Certificados de finalización

### Plan Anual
- ✅ Acceso a todos los cursos premium
- ✅ Soporte prioritario 24/7
- ✅ Certificados de finalización
- ✅ Acceso a contenido exclusivo
- ✅ Mentorías personalizadas
- ✅ Descuentos en cursos adicionales

## Extensibilidad

Para agregar un nuevo tipo de suscripción (ej: Premium):

1. Crear nueva estrategia:
```typescript
export class PremiumSubscriptionStrategy implements SubscriptionStrategy {
  calculatePrice(): number { return 199.99; }
  // ... implementar otros métodos
}
```

2. Actualizar el servicio para incluir la nueva estrategia
3. Actualizar el DTO y enum en la base de datos
4. No se requiere modificar código existente

## Testing

El proyecto incluye tests unitarios que verifican:
- Funcionamiento correcto de cada estrategia
- Intercambiabilidad de estrategias
- Manejo de errores
- Validación de datos

Ejecutar tests:
```bash
npm run test
```

## Base de Datos

El esquema de Prisma incluye:

```prisma
model Subscription {
  id          String           @id @default(uuid())
  type        SubscriptionType
  user        User             @relation(fields: [userId], references: [id])
  userId      String
  startDate   DateTime         @default(now())
  endDate     DateTime
  active      Boolean          @default(true)
  createdAt   DateTime         @default(now())
}

enum SubscriptionType {
  FREE
  MONTHLY
  ANNUAL
}
```

Esto demuestra una implementación completa y robusta del patrón Strategy aplicado a un sistema de suscripciones real.
