/**
 * Esquemas de MongoDB usando Mongoose
 * 
 * Estos esquemas se utilizarán para almacenar datos no estructurados
 * y registros de auditoría que no requieren relaciones estrictas
 */

import mongoose, { Schema, Document } from 'mongoose';

// ============================================
// ESQUEMA DE LOGS Y AUDITORÍA
// ============================================

/**
 * Interfaz para el documento de log
 */
export interface IActivityLog extends Document {
  userId: string;
  userEmail: string;
  action: string;
  module: string;
  entityType: string;
  entityId?: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

/**
 * Esquema para registrar actividades del sistema
 * Útil para auditoría y trazabilidad
 */
const ActivityLogSchema = new Schema<IActivityLog>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LIST', 'LOGIN', 'LOGOUT', 'EXPORT', 'COMPLETE_PROFILE', 'COMPLETE_ADMIN_PROFILE'],
    index: true
  },
  module: {
    type: String,
    required: true,
    enum: ['SPECIALISTS', 'APPOINTMENTS', 'STUDIES', 'USERS', 'AUTH', 'SETTINGS'],
    index: true
  },
  entityType: {
    type: String,
    required: true
  },
  entityId: {
    type: String
  },
  changes: {
    type: Schema.Types.Mixed,
    default: {}
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  collection: 'activity_logs',
  timestamps: false
});

// Índices compuestos para consultas frecuentes
ActivityLogSchema.index({ userId: 1, timestamp: -1 });
ActivityLogSchema.index({ module: 1, timestamp: -1 });
ActivityLogSchema.index({ action: 1, module: 1 });

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

// ============================================
// ESQUEMA DE RESULTADOS DE ESTUDIOS (FUTUROS)
// ============================================

/**
 * Interfaz para resultados de estudios médicos
 * Estructura flexible para diferentes tipos de análisis
 */
export interface IStudyResult extends Document {
  studyRequestId: string;
  studyId: string;
  studyName: string;
  patientId: string;
  performedDate: Date;
  results: {
    parameters: Array<{
      name: string;
      value: string | number;
      unit?: string;
      referenceRange?: string;
      isAbnormal?: boolean;
    }>;
    observations?: string;
    conclusion?: string;
  };
  attachments?: Array<{
    filename: string;
    url: string;
    type: string;
    uploadedAt: Date;
  }>;
  reviewedBy?: string;
  reviewedAt?: Date;
  status: 'PENDING' | 'PRELIMINARY' | 'FINAL' | 'CORRECTED';
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Esquema para almacenar resultados de estudios de laboratorio
 * MongoDB permite flexibilidad en la estructura de diferentes tipos de análisis
 */
const StudyResultSchema = new Schema<IStudyResult>({
  studyRequestId: {
    type: String,
    required: true,
    index: true
  },
  studyId: {
    type: String,
    required: true
  },
  studyName: {
    type: String,
    required: true
  },
  patientId: {
    type: String,
    required: true,
    index: true
  },
  performedDate: {
    type: Date,
    required: true,
    index: true
  },
  results: {
    parameters: [{
      name: String,
      value: Schema.Types.Mixed,
      unit: String,
      referenceRange: String,
      isAbnormal: Boolean
    }],
    observations: String,
    conclusion: String
  },
  attachments: [{
    filename: String,
    url: String,
    type: String,
    uploadedAt: Date
  }],
  reviewedBy: String,
  reviewedAt: Date,
  status: {
    type: String,
    enum: ['PENDING', 'PRELIMINARY', 'FINAL', 'CORRECTED'],
    default: 'PENDING'
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  collection: 'study_results',
  timestamps: true
});

// Índices para búsquedas eficientes
StudyResultSchema.index({ patientId: 1, performedDate: -1 });
StudyResultSchema.index({ status: 1, performedDate: -1 });

export const StudyResult = mongoose.model<IStudyResult>('StudyResult', StudyResultSchema);

// ============================================
// ESQUEMA DE NOTIFICACIONES
// ============================================

/**
 * Interfaz para notificaciones del sistema
 */
export interface INotification extends Document {
  userId: string;
  type: string;
  title: string;
  message: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  isRead: boolean;
  readAt?: Date;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  expiresAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * Esquema para gestionar notificaciones de usuarios
 * Permite notificaciones en tiempo real y persistentes
 */
const NotificationSchema = new Schema<INotification>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'APPOINTMENT_REMINDER',
      'APPOINTMENT_CONFIRMED',
      'APPOINTMENT_CANCELLED',
      'STUDY_READY',
      'PAYMENT_RECEIVED',
      'SYSTEM_UPDATE',
      'MESSAGE'
    ]
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedEntityType: String,
  relatedEntityId: String,
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: Date,
  priority: {
    type: String,
    enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'],
    default: 'NORMAL'
  },
  expiresAt: Date,
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  collection: 'notifications',
  timestamps: true
});

// Índices compuestos
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, type: 1 });

// TTL index para auto-eliminar notificaciones expiradas
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

// ============================================
// ESQUEMA DE REQUISICIONES SITUACIONALES
// ============================================

export interface IRequisicion extends Document {
  folio: string;
  fecha_creacion: Date;
  solicitante: {
    nombre: string;
    perfil: string;
    area: string;
    userId: string;
  };
  tipo: 'nueva_funcion' | 'mejora' | 'error' | 'comportamiento';
  modulo_afectado: string;
  respuestas_usuario: Record<string, any>;
  respuestas_admin?: Record<string, any>;
  prioridad_usuario: number;
  prioridad_tecnica?: 'baja' | 'media' | 'alta' | 'epica';
  estado: 'nuevo' | 'en_revision' | 'en_desarrollo' | 'completado' | 'rechazado' | 'pausado';
  sprint_asignado?: string;
  notas_dev?: string;
  adjuntos?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const RequisicionSchema = new Schema<IRequisicion>({
  folio: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fecha_creacion: {
    type: Date,
    default: Date.now,
    index: true
  },
  solicitante: {
    nombre: { type: String, required: true },
    perfil: { type: String, required: true },
    area: { type: String, required: true },
    userId: { type: String, required: true, index: true }
  },
  tipo: {
    type: String,
    required: true,
    enum: ['nueva_funcion', 'mejora', 'error', 'comportamiento']
  },
  modulo_afectado: {
    type: String,
    required: true,
    index: true
  },
  respuestas_usuario: {
    type: Schema.Types.Mixed,
    default: {}
  },
  respuestas_admin: {
    type: Schema.Types.Mixed,
    default: {}
  },
  prioridad_usuario: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  prioridad_tecnica: {
    type: String,
    enum: ['baja', 'media', 'alta', 'epica']
  },
  estado: {
    type: String,
    enum: ['nuevo', 'en_revision', 'en_desarrollo', 'completado', 'rechazado', 'pausado'],
    default: 'nuevo',
    index: true
  },
  sprint_asignado: String,
  notas_dev: String,
  adjuntos: [String]
}, {
  collection: 'requisiciones',
  timestamps: true
});

RequisicionSchema.index({ 'solicitante.userId': 1, fecha_creacion: -1 });
RequisicionSchema.index({ estado: 1, modulo_afectado: 1 });

export const Requisicion = mongoose.model<IRequisicion>('Requisicion', RequisicionSchema);

// ============================================
// EXPORTACIONES
// ============================================

export default {
  ActivityLog,
  StudyResult,
  Notification,
  Requisicion
};
