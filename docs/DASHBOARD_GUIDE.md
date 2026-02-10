# Dashboard Maria Vita - Guía de Inicio Rápido

## 🚀 Inicio Rápido

### 1. Actualizar Base de Datos

```bash
# Generar cliente de Prisma con el nuevo schema
npx prisma generate

# Crear migración para agregar rol SUPERADMIN
npx prisma migrate dev --name add_superadmin_role

# Ejecutar seeder para crear usuario SUPERADMIN
npm run seed
```

### 2. Iniciar Servidor

```bash
# Desarrollo
npm run dev

# O si prefieres
npm start
```

### 3. Acceder al Dashboard

1. Ve a `http://localhost:3000/login`
2. Ingresa las credenciales del Super Administrador:
   - **Email:** `JESSE@ADMIN`
   - **Password:** `Ajetreo1512!`
3. Serás redirigido al dashboard completo

## 📋 Funcionalidades del Dashboard

### Panel de Super Administrador

Como SUPERADMIN tienes acceso a:

- ✅ **Overview** - Resumen general del sistema
- ✅ **Usuarios** - Gestión completa de usuarios
- ✅ **Especialistas** - Gestión de médicos y especialistas
- ✅ **Citas** - Administración de citas médicas
- ✅ **Estudios** - Gestión de estudios de laboratorio
- ✅ **Reportes** - Generación de reportes
- ✅ **Analíticas** - Dashboard de métricas avanzadas (Solo SUPERADMIN)
- ✅ **Facturación** - Gestión de ingresos (Solo SUPERADMIN)
- ✅ **Administradores** - Gestión de otros admins (Solo SUPERADMIN)
- ✅ **Base de Datos** - Operaciones de BD (Solo SUPERADMIN)
- ✅ **Configuración** - Ajustes del sistema

### Otros Usuarios de Prueba

Para probar diferentes niveles de acceso:

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

## 🎨 Características del Sistema

### Sistema de Permisos

- **Renderizado Condicional:** Los módulos se muestran según permisos
- **Roles Jerárquicos:** SUPERADMIN > ADMIN > SPECIALIST > RECEPTIONIST > PATIENT
- **Granularidad:** Control fino de funcionalidades por permiso
- **Seguridad:** Verificación en frontend y backend

### Navegación

- **Sidebar Fijo:** Navegación lateral con acceso rápido a todos los módulos
- **AppBar Superior:** Información del usuario y logout
- **Responsive:** Adaptable a diferentes tamaños de pantalla

### UI/UX

- **Material-UI:** Componentes modernos y consistentes
- **Tema Personalizado:** Colores corporativos de Maria Vita
- **Iconografía Clara:** Íconos intuitivos para cada módulo
- **Feedback Visual:** Estados de carga, errores y éxito

## 📁 Estructura de Archivos

```
mariavita-webapp/
├── src/
│   ├── app/
│   │   └── dashboard/
│   │       └── page.tsx           # Página principal del dashboard
│   ├── components/
│   │   └── dashboard/
│   │       ├── Sidebar.tsx        # Navegación lateral
│   │       └── modules/           # Todos los módulos del dashboard
│   ├── hooks/
│   │   └── useAuth.ts             # Hook de autenticación
│   ├── lib/
│   │   └── permissions.ts         # Sistema de permisos
│   └── types/
│       └── enums.ts               # Roles y permisos
├── prisma/
│   └── schema.prisma              # Schema actualizado con SUPERADMIN
└── docs/
    └── PERMISSIONS_SYSTEM.md      # Documentación completa de permisos
```

## 🔧 Configuración

### Variables de Entorno

Asegúrate de tener configuradas:

```env
DATABASE_URL="mysql://user:password@localhost:3306/mariavita_db"
MONGODB_URI="mongodb://localhost:27017/mariavita"
JWT_SECRET="tu_secret_key_aqui"
```

### Dependencias Principales

- Next.js 14
- React 18
- Material-UI (MUI) v5
- Prisma ORM
- TypeScript
- Zod (Validaciones)

## 🛠️ Personalización

### Agregar un Nuevo Módulo

1. Crea el componente en `src/components/dashboard/modules/TuModulo.tsx`
2. Agrega el item al menú en `Sidebar.tsx`
3. Define el permiso en `src/types/enums.ts`
4. Agrega el case en `page.tsx` del dashboard
5. Asigna el permiso a los roles correspondientes

### Modificar Permisos de un Rol

Edita `src/types/enums.ts`:

```typescript
export const ROLE_PERMISSIONS = {
  admin: [
    'manage_users',
    'nuevo_permiso',  // Agregar aquí
    // ...
  ],
  // ...
};
```

## 📚 Documentación Adicional

- **Sistema de Autenticación:** [AUTHENTICATION.md](./AUTHENTICATION.md)
- **Sistema de Permisos:** [PERMISSIONS_SYSTEM.md](./PERMISSIONS_SYSTEM.md)
- **Guía de Tema:** [THEME_GUIDE.md](./THEME_GUIDE.md)

## 🐛 Troubleshooting

### Error: "Prisma Client is not generated"

```bash
npx prisma generate
```

### Error: "Cannot find module '@/hooks/useAuth'"

Verifica que el archivo exista y que el tsconfig.json tenga configurado el alias `@`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Dashboard no carga después del login

1. Verifica que el token esté en localStorage
2. Verifica que el usuario tenga un rol válido
3. Revisa la consola del navegador para errores

## 📞 Soporte

Para más información o soporte, consulta la documentación completa en la carpeta `/docs`.

---

**Desarrollado para Maria Vita - Sistema de Gestión Médica**
