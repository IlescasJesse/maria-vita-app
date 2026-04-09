# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos principales

```bash
# Desarrollo (ambos servicios simultáneamente)
npm run dev:all

# Solo frontend (Next.js en puerto 3000)
npm run dev

# Solo backend (Express en puerto 5000)
npm run backend

# Build de producción
npm run build

# Lint
npm run lint

# Type checking
npm run typecheck

# Base de datos
npm run migrate          # Ejecutar migraciones Prisma
npm run prisma:generate  # Regenerar cliente Prisma tras cambios en schema.prisma
npm run seed             # Poblar BD con datos de prueba
```

## Arquitectura general

Monorepo con **frontend Next.js 16** y **backend Express** en el mismo repositorio, separados físicamente en `src/app/` y `src/backend/` respectivamente.

### Comunicación frontend ↔ backend

El frontend **nunca accede a la base de datos directamente**. Toda comunicación pasa por la API Express:

- Las peticiones del cliente a `/api/*` son reescritas por Next.js hacia `http://127.0.0.1:5000/api/*` (configurado en `next.config.js`)
- Variable para el cliente: `NEXT_PUBLIC_API_URL=/api`
- Variable para SSR: `BACKEND_INTERNAL_URL=http://127.0.0.1:5000/api`
- Autenticación: token JWT en header `Authorization: Bearer <token>`

### Base de datos híbrida

- **MySQL** (vía Prisma): datos relacionales principales — usuarios, especialistas, citas, estudios
  - Schema: `prisma/schema.prisma`
  - Conexión: `DATABASE_URL` en `.env`
- **MongoDB** (vía Mongoose): logs de actividad, notificaciones, resultados de estudios (futuros)
  - Schemas en: `src/backend/database/mongodb/`
  - Conexión: `MONGODB_URI` en `.env`

Ambas conexiones se inicializan y monitorizan en `src/backend/config/database.ts`.

### Roles de usuario

`SUPERADMIN` > `ADMIN` > `SPECIALIST` / `RECEPTIONIST` / `PATIENT`

Los permisos se definen en `src/lib/permissions.ts` y se validan en `src/backend/middlewares/auth.ts`.

## Estructura clave

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/           # Rutas públicas (landing, servicios, contacto)
│   ├── dashboard/          # Rutas privadas (requieren auth)
│   │   └── especialista/   # Módulo de especialistas
│   └── api/                # API routes de Next.js (uso limitado, preferir Express)
│
├── backend/                # API Express
│   ├── server.ts           # Entry point del servidor (puerto 5000)
│   ├── config/database.ts  # Conexiones MySQL + MongoDB
│   ├── controllers/        # Lógica de negocio por módulo
│   ├── routes/             # Definición de endpoints (index.ts los agrega todos)
│   ├── middlewares/        # auth.ts (JWT), errorHandler.ts, validator.ts
│   ├── database/
│   │   ├── mysql/          # Configuración extra de Prisma
│   │   ├── mongodb/        # Schemas de Mongoose
│   │   └── seeders/        # seed.ts para poblar la BD
│   └── utils/
│       ├── apiResponse.ts  # Helpers: successResponse(), errorResponse()
│       └── logger.ts       # Winston logger
│
├── components/
│   ├── ui/                 # Componentes base reutilizables
│   ├── layout/             # Sidebar, Header, Footer
│   └── dashboard/modules/  # Componentes de feature (Analytics, Appointments, etc.)
│
├── types/
│   ├── models.ts           # Interfaces de datos principales
│   ├── enums.ts            # Constantes y enumeraciones del sistema
│   └── processStates.ts    # Estados de procesos
│
└── lib/
    ├── validations.ts      # Schemas Zod compartidos
    └── permissions.ts      # Utilidades de permisos por rol
```

## Convenciones importantes

**Formato de respuestas API** — siempre usar los helpers de `src/backend/utils/apiResponse.ts`:
```typescript
// Éxito
res.json(successResponse(data, meta))
// Error
res.status(400).json(errorResponse('VALIDATION_ERROR', 'Mensaje'))
```

**Aliases de TypeScript** (tsconfig.json):
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@types/*` → `src/types/*`
- `@lib/*` → `src/lib/*`
- `@backend/*` → `src/backend/*`

**Al modificar el schema de Prisma**, siempre ejecutar:
```bash
npm run migrate && npm run prisma:generate
```

## Variables de entorno requeridas

Copiar `.env.example` como `.env.local` para desarrollo. Las críticas son:

```env
DATABASE_URL=mysql://usuario:password@localhost:3306/mariavita
MONGODB_URI=mongodb://localhost:27017/mariavita
JWT_SECRET=...
BACKEND_PORT=5000
NEXT_PUBLIC_API_URL=/api
BACKEND_INTERNAL_URL=http://127.0.0.1:5000/api
```

`REPLICATE_API_TOKEN` es opcional (solo para mejora de fotos de especialistas con IA).

## Health checks

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000/health` (retorna estado de MySQL y MongoDB)
- API base: `http://localhost:5000/api`

## Credenciales de prueba (tras `npm run seed`)

| Rol | Email | Contraseña |
|-----|-------|------------|
| SUPERADMIN | JESSE@ADMIN | Ajetreo1512! |
| ADMIN | admin@mariavita.com | Admin2026! |
| SPECIALIST | doctor@mariavita.com | Doctor2026! |
| PATIENT | paciente1@example.com | Patient2026! |

## Deploy

El deploy al VPS se gestiona con `deploy.sh`. Ver `DEPLOY_VPS.md` para instrucciones completas. En producción se usa `.env.production` (separado de `.env.local`).
