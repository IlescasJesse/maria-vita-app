/**
 * Enumeraciones y constantes del Sistema Maria Vita
 * 
 * Define valores constantes utilizados en todo el sistema
 */

// ============================================
// ROLES Y PERMISOS
// ============================================

/**
 * Roles de usuario disponibles en el sistema
 */
export const USER_ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  SPECIALIST: 'specialist',
  PATIENT: 'patient',
  RECEPTIONIST: 'receptionist'
} as const;

/**
 * Permisos por rol
 * Define qué acciones puede realizar cada tipo de usuario
 */
export const ROLE_PERMISSIONS = {
  superadmin: [
    'full_system_access',
    'manage_admins',
    'manage_users',
    'manage_specialists',
    'manage_appointments',
    'manage_studies',
    'view_reports',
    'manage_settings',
    'manage_database',
    'view_analytics',
    'manage_billing',
    'system_configuration'
  ],
  admin: [
    'manage_users',
    'manage_specialists',
    'manage_appointments',
    'manage_studies',
    'view_reports',
    'manage_settings'
  ],
  specialist: [
    'view_appointments',
    'manage_own_appointments',
    'view_patients',
    'manage_availability',
    'view_study_requests'
  ],
  patient: [
    'view_own_appointments',
    'book_appointments',
    'view_own_studies',
    'request_studies'
  ],
  receptionist: [
    'manage_appointments',
    'view_specialists',
    'manage_study_requests',
    'view_patients'
  ]
} as const;

// ============================================
// ESPECIALIDADES MÉDICAS
// ============================================

/**
 * Catálogo de especialidades médicas disponibles
 */
export const MEDICAL_SPECIALTIES = [
  { value: 'cardiologia', label: 'Cardiología' },
  { value: 'dermatologia', label: 'Dermatología' },
  { value: 'endocrinologia', label: 'Endocrinología' },
  { value: 'gastroenterologia', label: 'Gastroenterología' },
  { value: 'medicina_general', label: 'Medicina General' },
  { value: 'neurologia', label: 'Neurología' },
  { value: 'oftalmologia', label: 'Oftalmología' },
  { value: 'pediatria', label: 'Pediatría' },
  { value: 'psiquiatria', label: 'Psiquiatría' },
  { value: 'traumatologia', label: 'Traumatología' }
] as const;

// ============================================
// CONFIGURACIÓN DE AGENDA
// ============================================

/**
 * Días de la semana en español
 */
export const DAYS_OF_WEEK = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo'
} as const;

/**
 * Duraciones de cita disponibles (en minutos)
 */
export const APPOINTMENT_DURATIONS = [
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1 hora 30 minutos' },
  { value: 120, label: '2 horas' }
] as const;

/**
 * Estados de citas con sus etiquetas en español
 */
export const APPOINTMENT_STATUS_LABELS = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  in_progress: 'En Curso',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No Asistió'
} as const;

/**
 * Colores para cada estado de cita (uso en calendarios)
 */
export const APPOINTMENT_STATUS_COLORS = {
  pending: '#FFA726',      // Naranja
  confirmed: '#66BB6A',    // Verde
  in_progress: '#42A5F5',  // Azul
  completed: '#9E9E9E',    // Gris
  cancelled: '#EF5350',    // Rojo
  no_show: '#BDBDBD'       // Gris claro
} as const;

// ============================================
// CATEGORÍAS DE ESTUDIOS
// ============================================

/**
 * Categorías de estudios de laboratorio
 */
export const STUDY_CATEGORIES = [
  { value: 'hematologia', label: 'Hematología' },
  { value: 'quimica_sanguinea', label: 'Química Sanguínea' },
  { value: 'inmunologia', label: 'Inmunología' },
  { value: 'microbiologia', label: 'Microbiología' },
  { value: 'urologia', label: 'Urología' },
  { value: 'hormonas', label: 'Perfil Hormonal' },
  { value: 'cardiologia', label: 'Perfil Cardiológico' },
  { value: 'imagenologia', label: 'Imagenología' },
  { value: 'otros', label: 'Otros' }
] as const;

/**
 * Estados de solicitudes de estudios con etiquetas
 */
export const STUDY_REQUEST_STATUS_LABELS = {
  draft: 'Borrador',
  pending_payment: 'Pendiente de Pago',
  paid: 'Pagada',
  in_progress: 'En Proceso',
  completed: 'Completada',
  cancelled: 'Cancelada'
} as const;

/**
 * Métodos de pago disponibles
 */
export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'credit_card', label: 'Tarjeta de Crédito' },
  { value: 'debit_card', label: 'Tarjeta de Débito' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'insurance', label: 'Seguro Médico' }
] as const;

// ============================================
// CONFIGURACIÓN DE UI
// ============================================

/**
 * Tamaños de página para paginación
 */
export const PAGE_SIZES = [10, 25, 50, 100] as const;

/**
 * Tamaño por defecto de página
 */
export const DEFAULT_PAGE_SIZE = 25;

/**
 * Formato de fecha para mostrar al usuario
 */
export const DATE_FORMAT = 'dd/MM/yyyy';

/**
 * Formato de fecha y hora
 */
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';

/**
 * Formato de hora
 */
export const TIME_FORMAT = 'HH:mm';

// ============================================
// LÍMITES Y VALIDACIONES
// ============================================

/**
 * Configuración de límites del sistema
 */
export const SYSTEM_LIMITS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 100,
  MIN_APPOINTMENT_DURATION: 15,
  MAX_APPOINTMENT_DURATION: 180,
  MAX_UPLOAD_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_STUDIES_PER_REQUEST: 20,
  MIN_CONSULTATION_FEE: 0,
  MAX_CONSULTATION_FEE: 10000
} as const;

/**
 * Expresiones regulares para validaciones
 */
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  LICENSE_NUMBER: /^[0-9]{7,10}$/,
  TIME_24H: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
} as const;

// ============================================
// MENSAJES DEL SISTEMA
// ============================================

/**
 * Mensajes de éxito comunes
 */
export const SUCCESS_MESSAGES = {
  CREATED: 'Registro creado exitosamente',
  UPDATED: 'Registro actualizado exitosamente',
  DELETED: 'Registro eliminado exitosamente',
  APPOINTMENT_BOOKED: 'Cita agendada exitosamente',
  APPOINTMENT_CANCELLED: 'Cita cancelada exitosamente',
  STUDY_REQUESTED: 'Solicitud de estudio creada exitosamente'
} as const;

/**
 * Mensajes de error comunes
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'No autorizado',
  FORBIDDEN: 'No tiene permisos para realizar esta acción',
  NOT_FOUND: 'Registro no encontrado',
  VALIDATION_ERROR: 'Error de validación',
  SERVER_ERROR: 'Error interno del servidor',
  DUPLICATE_ENTRY: 'El registro ya existe',
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  TIME_SLOT_NOT_AVAILABLE: 'El horario seleccionado no está disponible',
  SPECIALIST_NOT_AVAILABLE: 'El especialista no está disponible'
} as const;
