# Sistema de Estados de Procesos

Este sistema proporciona una forma estandarizada de manejar estados de operaciones asíncronas tanto en frontend como en backend.

## 📦 Archivos Principales

### Frontend
- `/src/types/processStates.ts` - Definiciones de tipos y estados
- `/src/hooks/useProcessState.ts` - Hook para manejar estados en componentes

### Backend
- `/src/backend/utils/apiResponse.ts` - Utilidades para respuestas estandarizadas
- `/src/types/processStates.ts` - Tipos compartidos

## 🎨 Frontend - Hook de Estados

### Uso Básico

```tsx
import { useProcessState } from '@/hooks/useProcessState';

function MyComponent() {
  const process = useProcessState();

  const handleSave = async () => {
    process.setSaving();
    try {
      await api.save(data);
      process.setSuccess('Datos guardados correctamente');
    } catch (error) {
      process.setError('Error al guardar');
    }
  };

  return (
    <div>
      <Button disabled={process.isProcessing} onClick={handleSave}>
        {process.isProcessing ? process.message : 'Guardar'}
      </Button>
      
      <Backdrop open={process.isProcessing}>
        <CircularProgress />
        <Typography>{process.message}</Typography>
      </Backdrop>
      
      {process.isError && <Alert severity="error">{process.message}</Alert>}
      {process.isSuccess && <Alert severity="success">{process.message}</Alert>}
    </div>
  );
}
```

### Estados Disponibles

```tsx
process.state          // Estado actual: 'idle' | 'loading' | 'saving' | etc.
process.isLoading      // true si está en estado 'loading'
process.isProcessing   // true si está en cualquier estado activo
process.isSuccess      // true si terminó con éxito
process.isError        // true si hubo error
process.message        // Mensaje actual
```

### Métodos

```tsx
process.setLoading()           // Estado: cargando datos
process.setSaving()            // Estado: guardando cambios
process.setCreating()          // Estado: creando nuevo registro
process.setUpdating()          // Estado: actualizando registro
process.setDeleting()          // Estado: eliminando registro
process.setValidating()        // Estado: validando datos
process.setSuccess(mensaje?)   // Estado: operación exitosa
process.setError(mensaje?)     // Estado: error
process.reset()                // Reset a 'idle'
```

### Hook Simplificado para CRUD

```tsx
import { useCrudState } from '@/hooks/useProcessState';

function CrudComponent() {
  const crud = useCrudState();

  const handleCreate = async () => {
    crud.startCreate();  // Alias de setCreating()
    // ...
  };

  const handleUpdate = async () => {
    crud.startUpdate();  // Alias de setUpdating()
    // ...
  };

  const handleDelete = async () => {
    crud.startDelete();  // Alias de setDeleting()
    // ...
  };

  const handleLoad = async () => {
    crud.startLoad();    // Alias de setLoading()
    // ...
  };
}
```

## 🔧 Backend - Respuestas Estandarizadas

### Importación

```typescript
import {
  successResponse,
  errorResponse,
  createdResponse,
  updatedResponse,
  deletedResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  validationErrorResponse,
  conflictResponse,
} from '@/utils/apiResponse';
```

### Uso en Controladores

```typescript
export const getUsersController = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    
    // Respuesta exitosa genérica
    successResponse(res, users);
    
    // Con mensaje personalizado
    successResponse(res, users, 'Usuarios obtenidos correctamente');
  } catch (error) {
    // Error genérico
    errorResponse(res, 'Error al obtener usuarios');
  }
};

export const createUserController = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    
    // Respuesta de creación (201 Created)
    createdResponse(res, user, 'Usuario creado exitosamente');
  } catch (error) {
    conflictResponse(res, 'El email ya está registrado');
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    
    if (!user) {
      notFoundResponse(res, 'Usuario no encontrado');
      return;
    }
    
    // Respuesta de actualización (200 OK)
    updatedResponse(res, user, 'Usuario actualizado exitosamente');
  } catch (error) {
    errorResponse(res, 'Error al actualizar usuario');
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      notFoundResponse(res, 'Usuario no encontrado');
      return;
    }
    
    // Respuesta de eliminación (200 OK, sin data)
    deletedResponse(res, 'Usuario eliminado exitosamente');
  } catch (error) {
    errorResponse(res, 'Error al eliminar usuario');
  }
};
```

### Respuestas de Error Especializadas

```typescript
// Autenticación fallida (401)
unauthorizedResponse(res, 'Token inválido o expirado');

// Permisos insuficientes (403)
forbiddenResponse(res, 'No tienes permisos para esta acción');

// Recurso no encontrado (404)
notFoundResponse(res, 'Usuario no encontrado');

// Conflicto - duplicados (409)
conflictResponse(res, 'El email ya está registrado', { email: 'user@example.com' });

// Validación fallida (422)
validationErrorResponse(res, 'Datos inválidos', validationErrors);

// Error genérico con código custom
errorResponse(res, 'Error personalizado', 400, 'CUSTOM_ERROR', details);
```

## 📋 Formato de Respuesta API

Todas las respuestas siguen este formato estandarizado:

```typescript
{
  success: boolean,           // true/false
  data?: any,                 // Datos de respuesta (si success)
  error?: {                   // Información de error (si !success)
    message: string,
    code?: string,
    details?: any
  },
  processState?: ProcessState, // Estado del proceso
  timestamp: Date              // Timestamp de la respuesta
}
```

### Ejemplos de Respuestas

**Éxito:**
```json
{
  "success": true,
  "data": { "id": "123", "name": "Juan" },
  "processState": "success",
  "timestamp": "2026-02-10T12:00:00.000Z"
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "message": "El email ya está registrado",
    "code": "EMAIL_EXISTS",
    "details": { "email": "juan@example.com" }
  },
  "processState": "error",
  "timestamp": "2026-02-10T12:00:00.000Z"
}
```

## 🎯 Mejores Prácticas

### Frontend

1. **Usa `process.isProcessing`** para deshabilitar botones durante operaciones
2. **Muestra `process.message`** para feedback claro al usuario
3. **Usa Backdrop** para prevenir clicks durante operaciones críticas
4. **Resetea el estado** cuando sea apropiado con `process.reset()`

### Backend

1. **Usa respuestas especializadas** en lugar de `res.json()` directo
2. **Incluye códigos de error descriptivos** para facilitar debugging
3. **Agrega detalles en errores de validación** para ayudar al frontend
4. **Mantén consistencia** en todos los controladores

## 🔄 Estados del Proceso

| Estado | Descripción | Uso |
|--------|-------------|-----|
| `idle` | Sin actividad | Estado inicial/final |
| `loading` | Cargando datos | Fetch inicial de datos |
| `saving` | Guardando | Operación save genérica |
| `creating` | Creando | CREATE en CRUD |
| `updating` | Actualizando | UPDATE en CRUD |
| `deleting` | Eliminando | DELETE en CRUD |
| `validating` | Validando | Validación de formularios |
| `processing` | Procesando | Operación genérica |
| `success` | Exitoso | Operación completada |
| `error` | Error | Operación fallida |

## 📚 Ejemplo Completo - UsersModule

Ver: `/src/components/dashboard/modules/UsersModule.tsx`

Este módulo demuestra el uso completo del sistema:
- ✅ Skeletons durante carga
- ✅ Backdrop durante operaciones
- ✅ Dialog de confirmación
- ✅ Mensajes de éxito/error
- ✅ Botones deshabilitados durante procesos
- ✅ Estados independientes (loading, saving, deleting)

## 🚀 Beneficios

✅ **Consistencia**: Mismo formato en toda la aplicación
✅ **Type-Safety**: TypeScript completo
✅ **Reutilizable**: Funciona en cualquier componente/controlador
✅ **Mantenible**: Código centralizado
✅ **Escalable**: Fácil agregar nuevos estados
✅ **UX Mejorada**: Feedback claro al usuario
✅ **Debugging**: Códigos de error descriptivos
