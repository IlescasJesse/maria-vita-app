# Maria Vita - Sistema Médico Híbrido

Sistema médico integral que combina una Landing Page pública con una aplicación web privada para gestión de especialistas, agenda médica y solicitudes de estudios de laboratorio.

## 📋 Índice

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Módulos del Sistema](#módulos-del-sistema)
- [API Documentation](#api-documentation)

---

## ✨ Características

### Landing Page (Pública)
- Información institucional
- SEO optimizado con Next.js SSR
- Diseño responsive con Material UI

### Web App (Privada - Dashboard)
- **Catálogo de Especialistas**: Gestión completa (CRUD) de perfiles médicos
- **Agenda Médica**: Sistema de disponibilidad y reserva de citas
- **Solicitud de Estudios**: Órdenes de laboratorio antes de resultados

---

## 🛠 Stack Tecnológico

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript (Interfaces estrictas)
- **UI Library**: Material UI (MUI) v5
  - DataGrid para catálogos
  - DatePicker para gestión de agenda
- **Gestión de Estado**: React Hooks / Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Lenguaje**: TypeScript

### Base de Datos Híbrida
- **MySQL**: Datos relacionales (Usuarios, Agenda, Catálogos)
  - ORM: Prisma
- **MongoDB**: Datos no estructurados (Logs, Resultados técnicos futuros)
  - ODM: Mongoose

### Utilidades
- **Validación**: Zod
- **Fechas**: date-fns
- **Logging**: Morgan
- **Seguridad**: Helmet, bcryptjs, JWT

---

## 📁 Estructura del Proyecto

\`\`\`
mariavita-webapp/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # Rutas públicas (Landing)
│   │   └── (dashboard)/        # Rutas privadas (Dashboard)
│   │       ├── especialistas/  # Módulo de Especialistas
│   │       ├── agenda/         # Módulo de Agenda Médica
│   │       └── solicitudes/    # Módulo de Solicitudes de Estudios
│   │
│   ├── components/             # Componentes reutilizables
│   │   ├── ui/                 # Componentes base
│   │   ├── layout/             # Layouts (Sidebar, Header)
│   │   └── modules/            # Componentes específicos por módulo
│   │
│   ├── types/                  # Definiciones TypeScript
│   │   ├── models.ts           # Interfaces de modelos
│   │   └── enums.ts            # Enumeraciones y constantes
│   │
│   ├── lib/                    # Utilidades del frontend
│   │
│   └── backend/                # Backend Express
│       ├── server.ts           # Punto de entrada
│       ├── config/             # Configuraciones
│       │   └── database.ts     # Conexiones MySQL + MongoDB
│       ├── controllers/        # Lógica de endpoints
│       ├── routes/             # Definición de rutas
│       ├── middlewares/        # Middlewares (auth, errors)
│       └── database/
│           ├── mysql/          # Prisma (MySQL)
│           └── mongodb/        # Mongoose (MongoDB)
│
├── prisma/
│   └── schema.prisma           # Esquema de base de datos MySQL
│
├── public/                     # Archivos estáticos
├── .env.example                # Plantilla de variables de entorno
├── package.json
├── tsconfig.json
└── next.config.js
\`\`\`

Ver [ESTRUCTURA.md](./ESTRUCTURA.md) para detalles completos.

---

## 📦 Requisitos Previos

- **Node.js**: v18+ (recomendado v20 LTS)
- **MySQL**: v8.0+
- **MongoDB**: v6.0+
- **npm** o **yarn**

---

## 🚀 Instalación

### 1. Clonar el repositorio e instalar dependencias

\`\`\`bash
# Instalar todas las dependencias
npm install
\`\`\`

### 2. Configurar variables de entorno

\`\`\`bash
# Copiar el archivo de ejemplo
cp .env.example .env.local
\`\`\`

Editar \`.env.local\` con tus credenciales:

\`\`\`env
# MySQL
DATABASE_URL="mysql://usuario:password@localhost:3306/mariavita"

# MongoDB
MONGODB_URI="mongodb://localhost:27017/mariavita"

# Backend
BACKEND_PORT=5000
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=tu_secret_super_seguro_cambiar_en_produccion
\`\`\`

### 3. Configurar base de datos MySQL

\`\`\`bash
# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run migrate

# (Opcional) Poblar con datos de prueba
npm run seed
\`\`\`

---

## ⚙️ Configuración

### Estructura de Base de Datos

#### MySQL (Tablas Relacionales)

**Módulo de Especialistas:**
- \`users\`: Usuarios del sistema (pacientes, especialistas, admin)
- \`specialists\`: Perfil de especialistas médicos
- \`availability\`: Disponibilidad recurrente semanal
- \`appointments\`: Citas médicas agendadas

**Módulo de Estudios:**
- \`study_catalog\`: Catálogo de estudios disponibles
- \`study_requests\`: Solicitudes de estudios de laboratorio

#### MongoDB (Colecciones Flexibles)

- \`activity_logs\`: Auditoría y trazabilidad
- \`study_results\`: Resultados de estudios (futuro)
- \`notifications\`: Sistema de notificaciones

---

## ▶️ Ejecución

### Modo Desarrollo

\`\`\`bash
# Opción 1: Iniciar frontend y backend por separado
npm run dev          # Frontend (Next.js) en puerto 3000
npm run backend      # Backend (Express) en puerto 5000

# Opción 2: Iniciar ambos simultáneamente
npm run dev:all
\`\`\`

### Acceso a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

### 🔑 Credenciales de Acceso

Después de ejecutar `npm run seed`, puedes acceder al dashboard con estas credenciales:

#### Super Administrador
- **Email**: `JESSE@ADMIN`
- **Password**: `Ajetreo1512!`
- **Rol**: SUPERADMIN (Acceso completo al sistema)

#### Otros Usuarios de Prueba
```
ADMIN:
Email: admin@mariavita.com
Password: Admin2026!

ESPECIALISTA:
Email: doctor@mariavita.com
Password: Doctor2026!

PACIENTE:
Email: paciente1@example.com
Password: Patient2026!
```

**Nota**: El usuario `JESSE@ADMIN` tiene permisos especiales y no requiere validación de formato de email estándar.

### Modo Producción

\`\`\`bash
# Build del frontend
npm run build

# Iniciar frontend en producción
npm start

# Backend (separado)
npm run backend
\`\`\`

---

## 🎯 Módulos del Sistema

### 1. Catálogo de Especialistas

**Funcionalidades:**
- Listar especialistas con filtros (especialidad, disponibilidad)
- Ver perfil completo del especialista
- Crear/Editar/Eliminar especialistas (CRUD)
- Gestión de cédula profesional y datos profesionales

**Endpoints:**
- \`GET /api/specialists\` - Listar con paginación
- \`GET /api/specialists/:id\` - Obtener detalle
- \`POST /api/specialists\` - Crear nuevo
- \`PUT /api/specialists/:id\` - Actualizar
- \`DELETE /api/specialists/:id\` - Eliminar (soft delete)

### 2. Agenda Médica

**Funcionalidades:**
- Configurar disponibilidad recurrente por día de la semana
- Vista de calendario con citas
- Agendar nuevas citas
- Gestionar estados de citas (confirmada, cancelada, completada)

**Estados de Cita:**
- \`PENDING\`: Pendiente de confirmación
- \`CONFIRMED\`: Confirmada
- \`IN_PROGRESS\`: En curso
- \`COMPLETED\`: Completada
- \`CANCELLED\`: Cancelada
- \`NO_SHOW\`: Paciente no asistió

### 3. Solicitud de Estudios

**Funcionalidades:**
- Catálogo de estudios disponibles con precios
- Crear solicitudes con múltiples estudios
- Gestión de estados de pago
- Programar fecha de realización

**Estados de Solicitud:**
- \`DRAFT\`: Borrador
- \`PENDING_PAYMENT\`: Pendiente de pago
- \`PAID\`: Pagada
- \`IN_PROGRESS\`: En proceso
- \`COMPLETED\`: Completada con resultados
- \`CANCELLED\`: Cancelada

**Endpoints:**
- \`GET /api/study-requests\` - Listar solicitudes
- \`GET /api/study-requests/:id\` - Obtener detalle
- \`POST /api/study-requests\` - Crear solicitud
- \`PATCH /api/study-requests/:id/status\` - Actualizar estado
- \`POST /api/study-requests/:id/cancel\` - Cancelar

---

## 📚 API Documentation

### Estructura de Respuesta Estándar

\`\`\`json
{
  "success": true,
  "data": { /* datos solicitados */ },
  "meta": {
    "page": 1,
    "pageSize": 25,
    "totalCount": 100,
    "totalPages": 4
  }
}
\`\`\`

### Manejo de Errores

\`\`\`json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "El registro solicitado no existe",
    "details": { /* detalles adicionales en desarrollo */ }
  }
}
\`\`\`

### Códigos de Error Comunes

- \`NOT_FOUND\`: Recurso no encontrado (404)
- \`VALIDATION_ERROR\`: Error de validación (400)
- \`UNAUTHORIZED\`: No autorizado (401)
- \`FORBIDDEN\`: Sin permisos (403)
- \`DUPLICATE_ENTRY\`: Registro duplicado (409)
- \`INTERNAL_SERVER_ERROR\`: Error del servidor (500)

---

## 🔒 Convenciones de Código

### Nomenclatura

- **Variables y funciones**: Inglés (camelCase)
  \`\`\`typescript
  const getSpecialists = async () => { /* ... */ }
  \`\`\`

- **Interfaces TypeScript**: PascalCase
  \`\`\`typescript
  interface Specialist { /* ... */ }
  \`\`\`

- **Comentarios y documentación**: Español
  \`\`\`typescript
  /**
   * Obtiene la lista de especialistas con filtros y paginación
   * @param filters - Filtros de búsqueda
   */
  \`\`\`

### Estructura de Archivos

- Un componente por archivo
- Nombres de archivos en PascalCase para componentes
- Nombres en camelCase para utilidades
- Índices (\`index.ts\`) para exportaciones centralizadas

---

## 🧪 Testing (Futuro)

\`\`\`bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
\`\`\`

---

## 📝 Scripts Disponibles

\`\`\`bash
npm run dev              # Iniciar Next.js en desarrollo
npm run backend          # Iniciar backend Express
npm run dev:all          # Iniciar frontend + backend
npm run build            # Build de producción
npm run start            # Iniciar Next.js en producción
npm run lint             # Ejecutar ESLint
npm run typecheck        # Verificar tipos TypeScript
npm run migrate          # Ejecutar migraciones de Prisma
npm run prisma:generate  # Generar cliente de Prisma
npm run seed             # Poblar base de datos
\`\`\`

---

## 🤝 Contribuciones

Este proyecto sigue convenciones estrictas de código. Por favor, asegúrate de:

1. Usar TypeScript con interfaces estrictas
2. Escribir comentarios en español
3. Seguir las convenciones de nomenclatura
4. Agregar validaciones con Zod
5. Documentar endpoints de API

---

## 📄 Licencia

ISC

---

## 👥 Equipo

**Maria Vita Team** - Sistema Médico Híbrido

---

## 🚧 Próximos Pasos

- [ ] Implementar autenticación JWT completa
- [ ] Agregar módulo de resultados de estudios
- [ ] Sistema de notificaciones en tiempo real
- [ ] Integración con pasarela de pago
- [ ] Dashboard de reportes y estadísticas
- [ ] Módulo de telemedicina (videollamadas)
- [ ] App móvil con React Native
# maria-vita-app
