/**
 * Definiciones de TypeScript para el Sistema Maria Vita
 * 
 * Este archivo contiene todas las interfaces y tipos principales
 * organizados por módulo de negocio
 */

// ============================================
// MÓDULO DE USUARIOS Y AUTENTICACIÓN
// ============================================

/**
 * Representa un usuario del sistema
 * Puede ser: paciente, especialista, administrador
 */
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export enum UserRole {
  ADMIN = 'admin',
  SPECIALIST = 'specialist',
  PATIENT = 'patient',
  RECEPTIONIST = 'receptionist'
}

// ============================================
// MÓDULO DE ESPECIALISTAS
// ============================================

/**
 * Representa un especialista médico en el sistema
 * Incluye información profesional y ubicación física
 */
export interface Specialist {
  id: string;
  userId: string; // Relación con tabla User
  fullName: string; // Nombre completo del especialista
  specialty: string; // Especialidad médica (ej: Cardiología, Pediatría)
  licenseNumber: string; // Cédula profesional
  assignedOffice?: string; // Consultorio asignado (ej: "Consultorio 3A")
  biography?: string; // Descripción profesional
  yearsOfExperience?: number; // Años de experiencia
  photoUrl?: string; // URL de la foto de perfil
  consultationFee?: number; // Precio de consulta
  isAvailable: boolean; // Si está aceptando citas actualmente
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Datos para crear un nuevo especialista
 * Omite campos autogenerados como id y timestamps
 */
export type CreateSpecialistDTO = Omit<Specialist, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Datos para actualizar un especialista existente
 * Todos los campos son opcionales excepto el id
 */
export type UpdateSpecialistDTO = Partial<CreateSpecialistDTO> & { id: string };

// ============================================
// MÓDULO DE AGENDA Y DISPONIBILIDAD
// ============================================

/**
 * Días de la semana para configurar disponibilidad
 */
export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday'
}

/**
 * Representa la disponibilidad base de un especialista
 * Define los horarios recurrentes semana a semana
 */
export interface Availability {
  id: string;
  specialistId: string; // Relación con Specialist
  dayOfWeek: DayOfWeek; // Día de la semana
  startTime: string; // Hora de inicio (formato HH:mm, ej: "09:00")
  endTime: string; // Hora de fin (formato HH:mm, ej: "13:00")
  slotDuration: number; // Duración de cada cita en minutos (ej: 30)
  isActive: boolean; // Si esta disponibilidad está activa
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Estados posibles de una cita médica
 */
export enum AppointmentStatus {
  PENDING = 'pending', // Pendiente de confirmación
  CONFIRMED = 'confirmed', // Confirmada
  IN_PROGRESS = 'in_progress', // En curso
  COMPLETED = 'completed', // Completada
  CANCELLED = 'cancelled', // Cancelada
  NO_SHOW = 'no_show' // Paciente no asistió
}

/**
 * Representa una cita médica agendada
 */
export interface Appointment {
  id: string;
  patientId: string; // Relación con User (paciente)
  specialistId: string; // Relación con Specialist
  scheduledDate: Date; // Fecha y hora programada de la cita
  durationMinutes: number; // Duración estimada en minutos
  status: AppointmentStatus; // Estado actual de la cita
  reason?: string; // Motivo de la consulta
  notes?: string; // Notas adicionales del especialista
  cancelReason?: string; // Razón de cancelación (si aplica)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para crear una nueva cita
 */
export type CreateAppointmentDTO = {
  patientId: string;
  specialistId: string;
  scheduledDate: Date;
  durationMinutes: number;
  reason?: string;
};

// ============================================
// MÓDULO DE ESTUDIOS Y LABORATORIO
// ============================================

/**
 * Representa un tipo de estudio médico disponible
 * Catálogo de estudios que se pueden solicitar
 */
export interface StudyCatalog {
  id: string;
  name: string; // Nombre del estudio (ej: "Biometría Hemática")
  description?: string; // Descripción detallada del estudio
  category: string; // Categoría (ej: "Hematología", "Química Sanguínea")
  price: number; // Precio del estudio
  preparationInstructions?: string; // Instrucciones de preparación (ej: "8 horas de ayuno")
  estimatedDuration?: number; // Tiempo estimado de entrega en horas
  requiresFasting: boolean; // Si requiere ayuno
  isActive: boolean; // Si está disponible para solicitar
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Estados posibles de una solicitud de estudio
 */
export enum StudyRequestStatus {
  DRAFT = 'draft', // Borrador
  PENDING_PAYMENT = 'pending_payment', // Pendiente de pago
  PAID = 'paid', // Pagada
  IN_PROGRESS = 'in_progress', // Estudio en proceso
  COMPLETED = 'completed', // Completada con resultados
  CANCELLED = 'cancelled' // Cancelada
}

/**
 * Representa un estudio individual dentro de una solicitud
 */
export interface StudyRequestItem {
  studyId: string; // ID del estudio del catálogo
  studyName: string; // Nombre del estudio (desnormalizado)
  price: number; // Precio al momento de la solicitud
  quantity: number; // Cantidad de estudios (generalmente 1)
}

/**
 * Representa una solicitud completa de estudios de laboratorio
 * Una solicitud puede incluir múltiples estudios
 */
export interface StudyRequest {
  id: string;
  patientId: string; // Relación con User (paciente)
  referringDoctorId?: string; // Médico que ordena el estudio (opcional)
  studies: StudyRequestItem[]; // Lista de estudios solicitados
  totalAmount: number; // Monto total de la solicitud
  status: StudyRequestStatus; // Estado de la solicitud
  paymentMethod?: string; // Método de pago utilizado
  paymentDate?: Date; // Fecha de pago
  scheduledDate?: Date; // Fecha programada para realizar el estudio
  notes?: string; // Notas adicionales
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para crear una nueva solicitud de estudios
 */
export type CreateStudyRequestDTO = {
  patientId: string;
  referringDoctorId?: string;
  studies: Array<{
    studyId: string;
    quantity: number;
  }>;
  scheduledDate?: Date;
  notes?: string;
};

/**
 * DTO para actualizar el estado de una solicitud
 */
export type UpdateStudyRequestStatusDTO = {
  status: StudyRequestStatus;
  paymentMethod?: string;
  paymentDate?: Date;
};

// ============================================
// TIPOS AUXILIARES Y RESPUESTAS API
// ============================================

/**
 * Estructura estándar de respuesta de la API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    totalCount?: number;
  };
}

/**
 * Parámetros para paginación
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filtros para búsqueda de especialistas
 */
export interface SpecialistFilters {
  specialty?: string;
  isAvailable?: boolean;
  search?: string; // Búsqueda por nombre
}

/**
 * Filtros para búsqueda de citas
 */
export interface AppointmentFilters {
  specialistId?: string;
  patientId?: string;
  status?: AppointmentStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * Filtros para búsqueda de solicitudes de estudios
 */
export interface StudyRequestFilters {
  patientId?: string;
  status?: StudyRequestStatus;
  dateFrom?: Date;
  dateTo?: Date;
}
