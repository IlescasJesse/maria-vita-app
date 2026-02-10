# Sistema de Autenticación - Maria Vita

## Descripción General

Sistema completo de autenticación basado en JWT (JSON Web Tokens) que permite registro, login, gestión de sesiones y protección de rutas.

## Características

- ✅ Registro de usuarios con validación
- ✅ Login con email y contraseña
- ✅ Tokens JWT con expiración configurable
- ✅ Protección de rutas por autenticación
- ✅ Autorización por roles (ADMIN, SPECIALIST, PATIENT, RECEPTIONIST)
- ✅ Actualización de perfil de usuario
- ✅ Cambio de contraseña
- ✅ Validación de datos con express-validator
- ✅ Registro de actividad en MongoDB
- ✅ Hash de contraseñas con bcrypt

## Endpoints de Autenticación

### POST `/api/auth/register`
Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+52 951 123 4567",
  "role": "PATIENT"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "uuid-del-usuario",
      "email": "usuario@ejemplo.com",  
      "firstName": "Juan",
      "lastName": "Pérez",
      "role": "PATIENT",
      "phone": "+52 951 123 4567",
      "createdAt": "2026-02-07T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validaciones:**
- Email válido y único
- Contraseña mínimo 6 caracteres con al menos 1 número
- Nombre y apellido entre 2-100 caracteres
- Teléfono con formato válido (opcional)
- Rol debe ser: SUPERADMIN, ADMIN, SPECIALIST, PATIENT o RECEPTIONIST

---

### POST `/api/auth/login`
Inicia sesión con credenciales.

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": "uuid-del-usuario",
      "email": "usuario@ejemplo.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "role": "PATIENT",
      "phone": "+52 951 123 4567",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores:**
- `401 INVALID_CREDENTIALS`: Email o contraseña incorrectos
- `401 ACCOUNT_INACTIVE`: Cuenta desactivada

---

### GET `/api/auth/me`
Obtiene el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "SPECIALIST",
    "phone": "+52 951 123 4567",
    "isActive": true,
    "createdAt": "2026-02-07T...",
    "updatedAt": "2026-02-07T...",
    "specialist": {
      "id": "uuid-del-especialista",
      "fullName": "Dr. Juan Pérez",
      "specialty": "Cardiología",
      "licenseNumber": "12345678",
      "assignedOffice": "Consultorio 3A",
      "photoUrl": "https://...",
      "consultationFee": 800.00
    }
  }
}
```

---

### PUT `/api/auth/me`
Actualiza el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body (todos opcionales):**
```json
{
  "firstName": "Juan Carlos",
  "lastName": "Pérez López",
  "phone": "+52 951 987 6543",
  "currentPassword": "contraseña123",
  "newPassword": "nuevaContraseña456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan Carlos",
    "lastName": "Pérez López",
    "role": "PATIENT",
    "phone": "+52 951 987 6543",
    "updatedAt": "2026-02-07T..."
  }
}
```

**Validaciones:**
- Para cambiar contraseña, `currentPassword` es requerida
- Nueva contraseña mínimo 6 caracteres con al menos 1 número

---

### POST `/api/auth/logout`
Cierra la sesión del usuario (registra actividad).

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

**Nota:** El token se debe eliminar del lado del cliente (localStorage/sessionStorage).

---

## Uso en el Frontend

### 1. Registro de Usuario

```typescript
async function register(userData: RegisterData) {
  const response = await fetch('https://maria-vita.mx/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  const data = await response.json();
  
  if (data.success) {
    // Guardar token
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    
    // Redirigir al dashboard
    window.location.href = '/dashboard';
  }
  
  return data;
}
```

### 2. Login

```typescript
async function login(email: string, password: string) {
  const response = await fetch('https://maria-vita.mx/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    window.location.href = '/dashboard';
  }
  
  return data;
}
```

### 3. Hacer Peticiones Autenticadas

```typescript
async function fetchProtectedData() {
  const token = localStorage.getItem('token');

  const response = await fetch('https://maria-vita.mx/api/specialists', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return response.json();
}
```

### 4. Logout

```typescript
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

---

## Protección de Rutas en Backend

### Solo Autenticación

```typescript
import { authenticate } from '../middlewares/auth';

router.get('/ruta-protegida', authenticate, controlador);
```

### Autenticación + Autorización por Rol

```typescript
import { authenticate, authorize } from '../middlewares/auth';

// Solo ADMIN puede acceder
router.post('/admin-only', authenticate, authorize('ADMIN'), controlador);

// ADMIN y SPECIALIST pueden acceder
router.put('/specialists/:id', authenticate, authorize('ADMIN', 'SPECIALIST'), controlador);
```

---

## Variables de Entorno Requeridas

```env
# JWT
JWT_SECRET="tu-secreto-super-seguro-cambiar-en-produccion"
JWT_EXPIRES_IN="7d"

# Base de datos
DATABASE_URL="mysql://user:password@localhost:3306/mariavita_db"
MONGODB_URI="mongodb://localhost:27017/mariavita"

# URLs
FRONTEND_URL="https://maria-vita.mx"
NEXT_PUBLIC_API_URL="https://maria-vita.mx/api"
```

---

## Roles y Permisos

### ADMIN
- Acceso total al sistema
- Crear/editar/eliminar especialistas
- Gestionar usuarios
- Ver todos los reportes

### SPECIALIST
- Ver y actualizar su propio perfil
- Gestionar su agenda
- Ver sus pacientes
- Registrar consultas

### PATIENT
- Ver su perfil
- Agendar citas
- Ver sus estudios
- Ver resultados

### RECEPTIONIST
- Agendar citas para pacientes
- Registrar pagos
- Ver catálogo de servicios

---

## Seguridad

1. **Contraseñas:**
   - Hash con bcrypt (salt rounds: 10)
   - Validación de fortaleza en registro

2. **Tokens JWT:**
   - Firmados con secreto seguro
   - Expiración configurable (default: 7 días)
   - Incluyen: userId, email, role

3. **Validación:**
   - express-validator en todas las rutas
   - Sanitización de inputs

4. **Logging:**
   - Registro de actividad en MongoDB
   - Tracking de IP y User-Agent

5. **CORS:**
   - Configurado solo para el frontend oficial

---

## Testing con Postman/Thunder Client

### 1. Registrar Usuario
```http
POST https://maria-vita.mx/api/auth/register
Content-Type: application/json

{
  "email": "admin@maria-vita.mx",
  "password": "Admin123",
  "firstName": "Admin",
  "lastName": "Sistema",
  "role": "ADMIN"
}
```

### 2. Login
```http
POST https://maria-vita.mx/api/auth/login
Content-Type: application/json

{
  "email": "admin@maria-vita.mx",
  "password": "Admin123"
}
```

### 3. Usar Token
```http
GET https://maria-vita.mx/api/auth/me
Authorization: Bearer TU_TOKEN_AQUI
```

---

## Manejo de Errores

### 401 Unauthorized
- Token no proporcionado
- Token inválido o expirado
- Usuario inactivo

### 403 Forbidden
- Usuario no tiene permisos para la acción

### 400 Bad Request
- Datos de validación incorrectos

### 409 Conflict
- Email ya registrado

---

## Próximas Mejoras

- [ ] Refresh tokens
- [ ] Recuperación de contraseña por email
- [ ] Verificación de email
- [ ] Autenticación de 2 factores (2FA)
- [ ] OAuth (Google, Facebook)
- [ ] Rate limiting por usuario
- [ ] Bloqueo de cuenta tras intentos fallidos
- [ ] Lista negra de tokens (revocación)
