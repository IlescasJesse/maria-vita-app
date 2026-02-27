/**
 * Esquemas de Validación con Zod
 * 
 * Define reglas de validación para los datos de entrada
 */

import { z } from 'zod';
import { VALIDATION_PATTERNS } from '../types/enums';

// ============================================
// ESQUEMA DE CONTRASEÑA FUERTE (reutilizable)
// ============================================

const strongPasswordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(100, 'La contraseña no puede ser muy larga')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula (A-Z)')
  .regex(/[a-z]/, 'Debe contener al menos una minúscula (a-z)')
  .regex(/\d/, 'Debe contener al menos un número (0-9)')
  .regex(/[!@#$%^&*]/, 'Debe contener al menos un carácter especial (!@#$%^&*)');

// ============================================
// VALIDACIONES DE AUTENTICACIÓN
// ============================================

/**
 * Validador de email personalizado que permite JESSE@ADMIN
 */
const customEmailValidation = z
  .string({ required_error: 'Email es requerido' })
  .min(1, 'El email no puede estar vacío')
  .max(255, 'Email muy largo')
  .refine(
    (email) => {
      // Permitir JESSE@ADMIN (case-insensitive)
      if (email.toUpperCase() === 'JESSE@ADMIN') {
        return true;
      }
      // Validar formato de email estándar con punto en dominio
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    { message: 'Formato de email inválido' }
  );

/**
 * Esquema para login
 */
export const loginSchema = z.object({
  email: customEmailValidation,
  password: z
    .string({ required_error: 'Contraseña es requerida' })
    .min(1, 'La contraseña no puede estar vacía')
});

/**
 * Esquema para crear un usuario
 */
export const createUserSchema = z.object({
  email: customEmailValidation,
  password: strongPasswordSchema,
  firstName: z
    .string({ required_error: 'Nombre es requerido' })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre muy largo'),
  lastName: z
    .string({ required_error: 'Apellido es requerido' })
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'Apellido muy largo'),
  phone: z
    .string()
    .regex(/^\d{10}$/, 'Teléfono debe tener exactamente 10 dígitos')
    .optional()
    .or(z.literal(''))
});

// ============================================
// VALIDACIONES DE COMPLETAR PERFIL
// ============================================

/**
 * Esquema para completar perfil de especialista
 */
export const completeSpecialistProfileSchema = z.object({
  suffix: z
    .string()
    .optional()
    .or(z.literal('')),
  firstName: z
    .string({ required_error: 'Nombre es requerido' })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre muy largo'),
  lastName: z
    .string({ required_error: 'Apellido es requerido' })
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'Apellido muy largo'),
  dateOfBirth: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), 'Fecha de nacimiento inválida'),
  phone: z
    .string()
    .regex(/^\d{10}$/, 'Teléfono debe tener exactamente 10 dígitos')
    .optional()
    .or(z.literal('')),
  newPassword: strongPasswordSchema,
  confirmPassword: z
    .string({ required_error: 'Confirmar contraseña es requerida' })
    .min(1, 'Debe confirmar la contraseña'),
  // Campos de especialista
  specialty: z
    .string({ required_error: 'Especialidad es requerida' })
    .min(2, 'Especialidad muy corta')
    .max(100, 'Especialidad muy larga'),
  licenseNumber: z
    .string({ required_error: 'Cédula profesional es requerida' })
    .regex(/^\d{7,10}$/, 'Cédula profesional debe tener 7-10 dígitos'),
  assignedOffice: z
    .string()
    .max(50, 'Consultorio muy largo')
    .optional()
    .or(z.literal('')),
  biography: z
    .string()
    .max(5000, 'Biografía muy larga')
    .optional()
    .or(z.literal('')),
  yearsOfExperience: z
    .number()
    .int('Años debe ser un número entero')
    .min(0, 'Años no puede ser negativo')
    .max(60, 'Años de experiencia inválido')
    .optional()
    .or(z.nan()),
  consultationFee: z
    .number()
    .min(0, 'Tarifa no puede ser negativa')
    .max(99999, 'Tarifa muy alta')
    .optional()
    .or(z.nan()),
  photoUrl: z
    .string()
    .url('URL de foto inválida')
    .optional()
    .or(z.literal('')),
  courses: z
    .array(z.object({
      title: z.string({ required_error: 'Título del curso requerido' }),
      institution: z.string({ required_error: 'Institución requerida' }),
      year: z.number().int('Año debe ser entero').min(1900, 'Año inválido').max(new Date().getFullYear(), 'Año no puede ser en el futuro')
    }))
    .optional(),
  certifications: z
    .array(z.object({
      title: z.string({ required_error: 'Título de certificación requerido' }),
      issuer: z.string({ required_error: 'Emisor requerido' }),
      year: z.number().int('Año debe ser entero').min(1900, 'Año inválido').max(new Date().getFullYear(), 'Año no puede ser futuro')
    }))
    .optional(),
  academicFormation: z
    .array(z.object({
      degree: z.string({ required_error: 'Título/Grado requerido' }),
      institution: z.string({ required_error: 'Institución requerida' }),
      year: z.number().int('Año debe ser entero').min(1900, 'Año inválido').max(new Date().getFullYear(), 'Año no puede ser futuro')
    }))
    .optional(),
  trajectory: z
    .array(z.object({
      position: z
        .string({ required_error: 'Puesto requerido' })
        .min(2, 'Puesto requerido'),
      institution: z
        .string({ required_error: 'Institución requerida' })
        .min(2, 'Institución requerida'),
      startYear: z.number().int('Año debe ser entero').min(1900, 'Año inválido'),
      endYear: z.number().int('Año debe ser entero').optional()
    }))
    .min(1, 'Debes agregar al menos una trayectoria profesional')
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  }
);

/**
 * Esquema para completar perfil de administrador
 */
export const completeAdminProfileSchema = z.object({
  suffix: z
    .string()
    .optional()
    .or(z.literal('')),
  firstName: z
    .string({ required_error: 'Nombre es requerido' })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre muy largo'),
  lastName: z
    .string({ required_error: 'Apellido es requerido' })
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'Apellido muy largo'),
  phone: z
    .string()
    .regex(/^\d{10}$/, 'Teléfono debe tener exactamente 10 dígitos')
    .optional()
    .or(z.literal('')),
  newPassword: strongPasswordSchema,
  confirmPassword: z
    .string({ required_error: 'Confirmar contraseña es requerida' })
    .min(1, 'Debe confirmar la contraseña'),
  photoUrl: z
    .string()
    .url('URL de foto inválida')
    .optional()
    .or(z.literal(''))
}).refine(
  (data) => data.confirmPassword === data.newPassword,
  {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  }
);

// ============================================
// VALIDACIONES DE FORMULARIOS
// ============================================

/**
 * Esquema para formulario de contacto
 */
export const contactFormSchema = z.object({
  name: z
    .string({ required_error: 'Nombre es requerido' })
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'Nombre muy largo'),
  phone: z
    .string()
    .regex(/^\d{10}$/, 'Teléfono debe tener exactamente 10 dígitos')
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || val.length === 10, 'Teléfono debe tener 10 dígitos'),
  email: z
    .string({ required_error: 'Email es requerido' })
    .email('Formato de email inválido'),
  subject: z
    .string({ required_error: 'Asunto es requerido' })
    .min(5, 'El asunto debe tener al menos 5 caracteres')
    .max(200, 'Asunto muy largo'),
  message: z
    .string({ required_error: 'Mensaje es requerido' })
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(5000, 'Mensaje muy largo')
});

// ============================================
// VALIDACIONES DE ESPECIALISTA
// ============================================

/**
 * Esquema para crear un especialista
 */
export const createSpecialistSchema = z.object({
  userId: z.string().uuid('ID de usuario inválido'),
  fullName: z
    .string()
    .min(5, 'Nombre completo muy corto')
    .max(200, 'Nombre completo muy largo'),
  specialty: z
    .string()
    .min(3, 'Especialidad inválida')
    .max(100, 'Especialidad muy larga'),
  licenseNumber: z
    .string()
    .regex(VALIDATION_PATTERNS.LICENSE_NUMBER, 'Cédula profesional inválida (7-10 dígitos)'),
  assignedOffice: z
    .string()
    .max(50, 'Consultorio muy largo')
    .optional(),
  biography: z
    .string()
    .max(5000, 'Biografía muy larga')
    .optional(),
  yearsOfExperience: z
    .number()
    .int('Años de experiencia debe ser entero')
    .min(0, 'Años de experiencia no puede ser negativo')
    .max(60, 'Años de experiencia muy alto')
    .optional(),
  photoUrl: z
    .string()
    .url('URL de foto inválida')
    .max(500, 'URL muy larga')
    .optional(),
  consultationFee: z
    .number()
    .min(0, 'Precio no puede ser negativo')
    .max(10000, 'Precio muy alto')
    .optional(),
  isAvailable: z.boolean().optional().default(true)
});

/**
 * Esquema para actualizar un especialista
 */
export const updateSpecialistSchema = createSpecialistSchema.partial();

// ============================================
// VALIDACIONES DE CITA
// ============================================

/**
 * Esquema para crear una cita
 */
export const createAppointmentSchema = z.object({
  patientId: z.string().uuid('ID de paciente inválido'),
  specialistId: z.string().uuid('ID de especialista inválido'),
  scheduledDate: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  durationMinutes: z
    .number()
    .int('Duración debe ser entero')
    .min(15, 'Duración mínima 15 minutos')
    .max(180, 'Duración máxima 180 minutos'),
  reason: z
    .string()
    .max(1000, 'Motivo muy largo')
    .optional()
});

/**
 * Esquema para actualizar estado de cita
 */
export const updateAppointmentStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW'
  ]),
  notes: z.string().max(2000, 'Notas muy largas').optional(),
  cancelReason: z.string().max(500, 'Razón muy larga').optional()
});

// ============================================
// VALIDACIONES DE SOLICITUD DE ESTUDIOS
// ============================================

/**
 * Esquema para crear una solicitud de estudio
 */
export const createStudyRequestSchema = z.object({
  patientId: z.string().uuid('ID de paciente inválido'),
  referringDoctorId: z
    .string()
    .uuid('ID de médico inválido')
    .optional(),
  studies: z
    .array(
      z.object({
        studyId: z.string().uuid('ID de estudio inválido'),
        quantity: z
          .number()
          .int('Cantidad debe ser entero')
          .min(1, 'Cantidad mínima 1')
          .max(10, 'Cantidad máxima 10 por estudio')
      })
    )
    .min(1, 'Debe incluir al menos un estudio')
    .max(20, 'Máximo 20 estudios por solicitud'),
  scheduledDate: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val))
    .optional(),
  notes: z
    .string()
    .max(2000, 'Notas muy largas')
    .optional()
});

/**
 * Esquema para actualizar estado de solicitud
 */
export const updateStudyRequestStatusSchema = z.object({
  status: z.enum([
    'DRAFT',
    'PENDING_PAYMENT',
    'PAID',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
  ]),
  paymentMethod: z
    .enum(['cash', 'credit_card', 'debit_card', 'transfer', 'insurance'])
    .optional(),
  paymentDate: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val))
    .optional()
});

// ============================================
// VALIDACIONES DE DISPONIBILIDAD
// ============================================

/**
 * Esquema para configurar disponibilidad
 */
export const createAvailabilitySchema = z.object({
  specialistId: z.string().uuid('ID de especialista inválido'),
  dayOfWeek: z.enum([
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
  ]),
  startTime: z
    .string()
    .regex(VALIDATION_PATTERNS.TIME_24H, 'Hora inicio inválida (formato HH:mm)'),
  endTime: z
    .string()
    .regex(VALIDATION_PATTERNS.TIME_24H, 'Hora fin inválida (formato HH:mm)'),
  slotDuration: z
    .number()
    .int('Duración debe ser entero')
    .min(15, 'Duración mínima 15 minutos')
    .max(180, 'Duración máxima 180 minutos')
}).refine(
  (data) => {
    // Validar que hora fin sea mayor a hora inicio
    const [startHour = 0, startMin = 0] = data.startTime.split(':').map(Number);
    const [endHour = 0, endMin = 0] = data.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return endMinutes > startMinutes;
  },
  {
    message: 'La hora de fin debe ser posterior a la hora de inicio'
  }
);

// ============================================
// VALIDACIONES DE PAGINACIÓN
// ============================================

/**
 * Esquema para parámetros de paginación
 */
export const paginationSchema = z.object({
  page: z
    .string()
    .or(z.number())
    .transform((val) => parseInt(String(val)))
    .pipe(z.number().int().min(1, 'Página debe ser mayor a 0'))
    .optional()
    .default('1'),
  pageSize: z
    .string()
    .or(z.number())
    .transform((val) => parseInt(String(val)))
    .pipe(z.number().int().min(1).max(100, 'Tamaño de página máximo 100'))
    .optional()
    .default('25')
});

// ============================================
// HELPER: VALIDAR CON ZOD
// ============================================

/**
 * Helper para validar datos con un esquema Zod
 * Retorna un objeto con success y data/error
 */
export const validate = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
};
