# Ejemplos de Uso - API de Suscripciones

## Configuración del Servidor

Para probar la API localmente:

```bash
# Instalar dependencias
npm install

# Iniciar el servidor en modo desarrollo
npm run start:dev
```

El servidor estará disponible en `http://localhost:3000`

## Ejemplos de Peticiones HTTP

### 1. Obtener todos los planes disponibles

```http
GET http://localhost:3000/subscriptions/plans
```

**Respuesta esperada:**
```json
{
  "plans": [
    {
      "type": "free",
      "price": 0,
      "features": [
        "Acceso a cursos básicos limitados",
        "Soporte por comunidad",
        "Sin certificados",
        "Contenido limitado"
      ]
    },
    {
      "type": "monthly",
      "price": 9.99,
      "features": [
        "Acceso a todos los cursos básicos",
        "Soporte por email",
        "Certificados de finalización"
      ]
    },
    {
      "type": "annual",
      "price": 99.99,
      "features": [
        "Acceso a todos los cursos premium",
        "Soporte prioritario 24/7",
        "Certificados de finalización",
        "Acceso a contenido exclusivo",
        "Mentorías personalizadas",
        "Descuentos en cursos adicionales"
      ]
    }
  ]
}
```

### 2. Obtener información de un plan específico

```http
GET http://localhost:3000/subscriptions/info?type=monthly
```

**Respuesta esperada:**
```json
{
  "type": "monthly",
  "price": 9.99,
  "features": [
    "Acceso a todos los cursos básicos",
    "Soporte por email",
    "Certificados de finalización"
  ]
}
```

### 3. Crear una suscripción gratuita

```http
POST http://localhost:3000/subscriptions
Content-Type: application/json

{
  "type": "free",
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Respuesta esperada:**
```json
{
  "id": "sub-uuid-here",
  "type": "FREE",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "startDate": "2025-01-27T15:30:00.000Z",
  "endDate": "2125-01-27T15:30:00.000Z",
  "active": true,
  "createdAt": "2025-01-27T15:30:00.000Z",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Usuario Test",
    "email": "test@example.com"
  },
  "price": 0,
  "features": [
    "Acceso a cursos básicos limitados",
    "Soporte por comunidad",
    "Sin certificados",
    "Contenido limitado"
  ]
}
```

### 4. Crear una suscripción mensual

```http
POST http://localhost:3000/subscriptions
Content-Type: application/json

{
  "type": "monthly",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "startDate": "2025-02-01T00:00:00Z"
}
```

### 5. Crear una suscripción anual

```http
POST http://localhost:3000/subscriptions
Content-Type: application/json

{
  "type": "annual",
  "userId": "456e7890-e89b-12d3-a456-426614174111"
}
```

### 6. Obtener suscripciones de un usuario

```http
GET http://localhost:3000/subscriptions/user/123e4567-e89b-12d3-a456-426614174000
```

### 7. Obtener suscripción activa de un usuario

```http
GET http://localhost:3000/subscriptions/user/123e4567-e89b-12d3-a456-426614174000/active
```

### 8. Cancelar una suscripción

```http
PATCH http://localhost:3000/subscriptions/sub-uuid-here/cancel
```

## Ejemplos con cURL

### Obtener todos los planes:
```bash
curl -X GET http://localhost:3000/subscriptions/plans
```

### Crear suscripción mensual:
```bash
curl -X POST http://localhost:3000/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "monthly",
    "userId": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

### Cancelar suscripción:
```bash
curl -X PATCH http://localhost:3000/subscriptions/sub-uuid-here/cancel
```

## Ejemplos con JavaScript/Fetch

### Obtener planes disponibles:
```javascript
async function getPlans() {
  const response = await fetch('http://localhost:3000/subscriptions/plans');
  const data = await response.json();
  console.log('Planes disponibles:', data);
  return data;
}
```

### Crear suscripción:
```javascript
async function createSubscription(type, userId) {
  const response = await fetch('http://localhost:3000/subscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: type,
      userId: userId
    })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('Suscripción creada:', data);
  return data;
}

// Uso
createSubscription('monthly', '123e4567-e89b-12d3-a456-426614174000')
  .then(subscription => console.log(subscription))
  .catch(error => console.error('Error:', error));
```

## Casos de Error

### 1. Usuario no encontrado:
```http
POST http://localhost:3000/subscriptions
Content-Type: application/json

{
  "type": "monthly",
  "userId": "invalid-uuid"
}
```

**Respuesta (404):**
```json
{
  "statusCode": 404,
  "message": "Usuario no encontrado",
  "error": "Not Found"
}
```

### 2. Usuario ya tiene suscripción activa:
```json
{
  "statusCode": 400,
  "message": "El usuario ya tiene una suscripción activa",
  "error": "Bad Request"
}
```

### 3. Tipo de suscripción inválido:
```json
{
  "statusCode": 400,
  "message": [
    "type must be one of the following values: free, monthly, annual"
  ],
  "error": "Bad Request"
}
```

## Documentación Swagger

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

```
http://localhost:3000/api
```

Esto te permitirá probar todos los endpoints directamente desde el navegador.

## Demostración del Patrón Strategy

Este sistema demuestra el patrón Strategy de las siguientes maneras:

1. **Intercambiabilidad**: Puedes cambiar entre estrategias de suscripción sin modificar el código cliente
2. **Extensibilidad**: Agregar nuevos tipos de suscripción es simple
3. **Encapsulación**: Cada estrategia maneja su propia lógica de negocio
4. **Flexibilidad**: El contexto puede cambiar estrategias en tiempo de ejecución

### Ejemplo de cambio de estrategia en tiempo de ejecución:
```typescript
// En el servicio
let context: SubscriptionContext;

// Cambiar estrategia basada en el tipo
if (type === 'free') {
  context = new SubscriptionContext(this.freeStrategy);
} else if (type === 'monthly') {
  context = new SubscriptionContext(this.monthlyStrategy);
} else if (type === 'annual') {
  context = new SubscriptionContext(this.annualStrategy);
}

// Usar la estrategia seleccionada
const result = await context.create(data);
```
