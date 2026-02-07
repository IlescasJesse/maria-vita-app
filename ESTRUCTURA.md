# Estructura del Proyecto Maria Vita

```
mariavita-webapp/
│
├── src/
│   ├── app/                          # App Router de Next.js 14+
│   │   ├── (public)/                 # Grupo de rutas públicas (sin autenticación)
│   │   │   ├── page.tsx              # Landing page principal
│   │   │   ├── servicios/            # Página de servicios públicos
│   │   │   └── contacto/             # Página de contacto
│   │   │
│   │   ├── (dashboard)/              # Grupo de rutas privadas (requiere autenticación)
│   │   │   ├── layout.tsx            # Layout principal del dashboard con sidebar
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   │
│   │   │   ├── especialistas/        # Módulo de catálogo de especialistas
│   │   │   │   ├── page.tsx          # Lista de especialistas (DataGrid)
│   │   │   │   ├── nuevo/            
│   │   │   │   │   └── page.tsx      # Formulario para crear especialista
│   │   │   │   └── [id]/             
│   │   │   │       ├── page.tsx      # Vista de detalle del especialista
│   │   │   │       └── editar/       
│   │   │   │           └── page.tsx  # Formulario de edición
│   │   │   │
│   │   │   ├── agenda/               # Módulo de gestión de agenda médica
│   │   │   │   ├── page.tsx          # Vista de calendario con citas
│   │   │   │   ├── disponibilidad/   
│   │   │   │   │   └── page.tsx      # Gestión de horarios disponibles
│   │   │   │   └── nueva-cita/       
│   │   │   │       └── page.tsx      # Formulario para agendar cita
│   │   │   │
│   │   │   └── solicitudes/          # Módulo de solicitudes de estudios
│   │   │       ├── page.tsx          # Lista de solicitudes (DataGrid)
│   │   │       ├── nueva/            
│   │   │       │   └── page.tsx      # Formulario para crear solicitud
│   │   │       └── [id]/             
│   │   │           └── page.tsx      # Detalle de la solicitud
│   │   │
│   │   ├── api/                      # API Routes de Next.js (opcional, para frontend)
│   │   │   └── auth/                 # Endpoints de autenticación
│   │   │
│   │   ├── layout.tsx                # Root layout (providers, fonts)
│   │   └── globals.css               # Estilos globales
│   │
│   ├── components/                   # Componentes reutilizables
│   │   ├── ui/                       # Componentes de UI base
│   │   │   ├── DataTable.tsx         # Wrapper del MUI DataGrid
│   │   │   ├── DatePicker.tsx        # Wrapper del MUI DatePicker
│   │   │   └── FormField.tsx         # Componentes de formulario
│   │   │
│   │   ├── layout/                   # Componentes de layout
│   │   │   ├── Sidebar.tsx           # Sidebar del dashboard
│   │   │   ├── Header.tsx            # Header con usuario y notificaciones
│   │   │   └── Footer.tsx            # Footer
│   │   │
│   │   └── modules/                  # Componentes específicos por módulo
│   │       ├── especialistas/        
│   │       │   ├── SpecialistCard.tsx
│   │       │   └── SpecialistForm.tsx
│   │       ├── agenda/               
│   │       │   ├── CalendarView.tsx  
│   │       │   └── AppointmentModal.tsx
│   │       └── solicitudes/          
│   │           ├── StudySelector.tsx 
│   │           └── RequestSummary.tsx
│   │
│   ├── types/                        # Definiciones de TypeScript
│   │   ├── models.ts                 # Interfaces de modelos de datos
│   │   ├── api.ts                    # Tipos para requests/responses
│   │   └── enums.ts                  # Enums del sistema
│   │
│   ├── lib/                          # Utilidades y helpers
│   │   ├── validations.ts            # Esquemas de validación con Zod
│   │   ├── formatters.ts             # Funciones para formatear datos
│   │   └── constants.ts              # Constantes del sistema
│   │
│   ├── backend/                      # Backend Express (API independiente)
│   │   ├── server.ts                 # Punto de entrada del servidor
│   │   │
│   │   ├── config/                   # Configuraciones
│   │   │   ├── database.ts           # Configuración de conexiones
│   │   │   └── env.ts                # Variables de entorno
│   │   │
│   │   ├── database/                 # Capa de datos
│   │   │   ├── mysql/                # Configuración MySQL + Prisma
│   │   │   │   ├── client.ts         # Cliente Prisma
│   │   │   │   └── schema.prisma     # Esquema de base de datos
│   │   │   │
│   │   │   ├── mongodb/              # Configuración MongoDB + Mongoose
│   │   │   │   ├── connection.ts     # Conexión a MongoDB
│   │   │   │   └── schemas/          # Schemas de Mongoose
│   │   │   │
│   │   │   └── seeders/              # Datos iniciales
│   │   │       └── seed.ts           # Script de seeding
│   │   │
│   │   ├── controllers/              # Controladores (lógica de endpoints)
│   │   │   ├── specialistController.ts
│   │   │   ├── appointmentController.ts
│   │   │   └── studyRequestController.ts
│   │   │
│   │   ├── services/                 # Lógica de negocio
│   │   │   ├── specialistService.ts  
│   │   │   ├── appointmentService.ts 
│   │   │   └── studyRequestService.ts
│   │   │
│   │   ├── routes/                   # Definición de rutas
│   │   │   ├── index.ts              # Router principal
│   │   │   ├── specialistRoutes.ts   
│   │   │   ├── appointmentRoutes.ts  
│   │   │   └── studyRequestRoutes.ts
│   │   │
│   │   ├── middlewares/              # Middlewares de Express
│   │   │   ├── auth.ts               # Verificación de JWT
│   │   │   ├── errorHandler.ts       # Manejo centralizado de errores
│   │   │   └── validation.ts         # Validación de requests
│   │   │
│   │   └── utils/                    # Utilidades del backend
│   │       ├── logger.ts             # Sistema de logs
│   │       └── responses.ts          # Helpers para respuestas HTTP
│   │
│   └── styles/                       # Estilos adicionales
│       └── theme.ts                  # Tema personalizado de MUI
│
├── public/                           # Archivos estáticos
│   ├── images/                       # Imágenes del sitio
│   └── icons/                        # Íconos
│
├── .env.local                        # Variables de entorno (desarrollo)
├── .env.example                      # Plantilla de variables de entorno
├── next.config.js                    # Configuración de Next.js
├── tsconfig.json                     # Configuración de TypeScript
├── package.json                      # Dependencias del proyecto
└── README.md                         # Documentación del proyecto
```

## Notas de Arquitectura

### Separación de Responsabilidades
- **Frontend (Next.js)**: Se encarga únicamente de la presentación y experiencia de usuario
- **Backend (Express)**: Maneja toda la lógica de negocio y acceso a datos
- **Base de Datos Híbrida**: MySQL para datos estructurados, MongoDB para datos flexibles

### Convenciones de Código
- Variables y funciones: Inglés (camelCase)
- Comentarios y documentación: Español
- Interfaces TypeScript: PascalCase con prefijo `I` opcional
