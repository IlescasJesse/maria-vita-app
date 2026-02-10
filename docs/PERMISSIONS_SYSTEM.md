# Sistema de Permisos y Dashboard - Maria Vita

## Descripción General

Sistema completo de dashboard con gestión de permisos basado en roles (RBAC - Role-Based Access Control). Los componentes y módulos se renderizan condicionalmente según los permisos del usuario.

## Jerarquía de Roles

### SUPERADMIN (Super Administrador)
**Nivel más alto de acceso al sistema**

- Acceso completo e irrestricto a todas las funcionalidades
- Puede gestionar otros administradores
- Acceso a configuración de base de datos
- Acceso a analíticas avanzadas
- Gestión de facturación
- Configuración del sistema

**Permisos:**
- `full_system_access`
- `manage_admins`
- `manage_users`
- `manage_specialists`
- `manage_appointments`
- `manage_studies`
- `view_reports`
- `manage_settings`
- `manage_database`
- `view_analytics`
- `manage_billing`
- `system_configuration`

### ADMIN (Administrador)
**Administración general del sistema**

- Gestión de usuarios
- Gestión de especialistas
- Gestión de citas
- Gestión de estudios
- Visualización de reportes
- Configuración general

**Permisos:**
- `manage_users`
- `manage_specialists`
- `manage_appointments`
- `manage_studies`
- `view_reports`
- `manage_settings`

### SPECIALIST (Especialista Médico)
**Personal médico del sistema**

- Ver sus propias citas
- Gestionar su disponibilidad
- Ver información de pacientes
- Ver solicitudes de estudios

**Permisos:**
- `view_appointments`
- `manage_own_appointments`
- `view_patients`
- `manage_availability`
- `view_study_requests`

### PATIENT (Paciente)
**Usuarios finales del sistema**

- Ver sus propias citas
- Agendar citas
- Ver sus propios estudios
- Solicitar estudios

**Permisos:**
- `view_own_appointments`
- `book_appointments`
- `view_own_studies`
- `request_studies`

### RECEPTIONIST (Recepcionista)
**Personal administrativo**

- Gestión de citas
- Ver especialistas
- Gestión de solicitudes de estudios
- Ver información de pacientes

**Permisos:**
- `manage_appointments`
- `view_specialists`
- `manage_study_requests`
- `view_patients`

## Módulos del Dashboard

### 1. Overview (Resumen)
- **Acceso:** Todos los roles
- **Descripción:** Vista general del sistema con estadísticas relevantes según el rol

### 2. Users (Usuarios)
- **Permiso requerido:** `manage_users`
- **Roles con acceso:** SUPERADMIN, ADMIN
- **Descripción:** Gestión completa de usuarios del sistema

### 3. Specialists (Especialistas)
- **Permiso requerido:** `manage_specialists`
- **Roles con acceso:** SUPERADMIN, ADMIN
- **Descripción:** Gestión de especialistas médicos

### 4. Appointments (Citas)
- **Permiso requerido:** `manage_appointments`
- **Roles con acceso:** SUPERADMIN, ADMIN, RECEPTIONIST
- **Descripción:** Gestión de citas médicas

### 5. Studies (Estudios)
- **Permiso requerido:** `manage_studies`
- **Roles con acceso:** SUPERADMIN, ADMIN
- **Descripción:** Gestión de estudios de laboratorio

### 6. Reports (Reportes)
- **Permiso requerido:** `view_reports`
- **Roles con acceso:** SUPERADMIN, ADMIN
- **Descripción:** Reportes y estadísticas del sistema

### 7. Analytics (Analíticas)
- **Permiso requerido:** `view_analytics`
- **Roles con acceso:** SUPERADMIN únicamente
- **Descripción:** Analíticas avanzadas del sistema

### 8. Billing (Facturación)
- **Permiso requerido:** `manage_billing`
- **Roles con acceso:** SUPERADMIN únicamente
- **Descripción:** Gestión de facturación e ingresos

### 9. Admins (Administradores)
- **Permiso requerido:** `manage_admins`
- **Roles con acceso:** SUPERADMIN únicamente
- **Descripción:** Gestión de usuarios administradores

### 10. Database (Base de Datos)
- **Permiso requerido:** `manage_database`
- **Roles con acceso:** SUPERADMIN únicamente
- **Descripción:** Operaciones de base de datos (backup, restore, etc.)

### 11. Settings (Configuración)
- **Permiso requerido:** `manage_settings`
- **Roles con acceso:** SUPERADMIN, ADMIN
- **Descripción:** Configuración general del sistema

## Uso del Sistema de Permisos

### Hook useAuth

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    hasPermission,
    hasAnyPermission,
    isAdmin,
    isSuperAdmin,
    logout 
  } = useAuth();

  // Verificar un permiso específico
  if (hasPermission('manage_users')) {
    // Mostrar contenido
  }

  // Verificar múltiples permisos (al menos uno)
  if (hasAnyPermission(['view_reports', 'view_analytics'])) {
    // Mostrar contenido
  }

  // Verificar si es admin
  if (isAdmin) {
    // Mostrar contenido para admins
  }

  // Verificar si es super admin
  if (isSuperAdmin) {
    // Mostrar contenido solo para super admin
  }
}
```

### Funciones de Permisos

```typescript
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  isAdmin,
  isSuperAdmin,
  getRoleLabel,
  getRoleColor
} from '@/lib/permissions';

// Verificar un permiso
hasPermission('SUPERADMIN', 'manage_database'); // true

// Verificar múltiples permisos (al menos uno)
hasAnyPermission('ADMIN', ['manage_users', 'manage_specialists']); // true

// Verificar todos los permisos
hasAllPermissions('ADMIN', ['manage_users', 'manage_specialists']); // true

// Verificar si es admin (SUPERADMIN o ADMIN)
isAdmin('ADMIN'); // true
isAdmin('SUPERADMIN'); // true

// Verificar si es super admin
isSuperAdmin('SUPERADMIN'); // true

// Obtener label del rol
getRoleLabel('SUPERADMIN'); // "Super Administrador"

// Obtener color del rol para UI
getRoleColor('SUPERADMIN'); // "error"
```

## Usuario Super Administrador

### Credenciales por Defecto

```
Email: JESSE@ADMIN
Password: Ajetreo1512!
```

Este usuario tiene acceso completo a todas las funcionalidades del sistema.

## Renderizado Condicional

El dashboard renderiza los módulos de forma condicional:

1. **Sidebar:** Solo muestra los items de menú para los que el usuario tiene permisos
2. **Módulos:** Solo se renderizan si el usuario tiene el permiso requerido
3. **Funcionalidades:** Dentro de cada módulo, ciertas funcionalidades pueden estar restringidas

## Estructura de Archivos

```
src/
├── hooks/
│   └── useAuth.ts                 # Hook de autenticación
├── lib/
│   └── permissions.ts             # Sistema de permisos
├── components/
│   └── dashboard/
│       ├── Sidebar.tsx            # Navegación lateral
│       └── modules/
│           ├── OverviewModule.tsx
│           ├── UsersModule.tsx
│           ├── SpecialistsModule.tsx
│           ├── AppointmentsModule.tsx
│           ├── StudiesModule.tsx
│           ├── ReportsModule.tsx
│           ├── AnalyticsModule.tsx
│           ├── BillingModule.tsx
│           ├── AdminsModule.tsx
│           ├── DatabaseModule.tsx
│           └── SettingsModule.tsx
├── app/
│   └── dashboard/
│       └── page.tsx               # Página principal del dashboard
├── types/
│   └── enums.ts                   # Definición de roles y permisos
└── backend/
    └── database/
        └── seeders/
            └── seed.ts            # Incluye usuario SUPERADMIN
```

## Migración de Base de Datos

Después de actualizar el schema, ejecuta:

```bash
# Generar cliente de Prisma
npx prisma generate

# Crear migración
npx prisma migrate dev --name add_superadmin_role

# Ejecutar seeder
npm run seed
```

## Seguridad

- Los permisos se verifican tanto en el frontend como en el backend
- SUPERADMIN es un rol especial que no puede ser asignado desde el registro normal
- Solo SUPERADMIN puede crear otros administradores
- Todas las acciones sensibles requieren confirmación adicional

## Próximos Pasos

1. Implementar validación de permisos en el backend para cada endpoint
2. Agregar logs de auditoría para acciones de SUPERADMIN
3. Implementar autenticación de dos factores para roles administrativos
4. Agregar funcionalidades específicas a cada módulo
5. Conectar con APIs reales para datos dinámicos
