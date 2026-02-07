/**
 * Rutas del Módulo de Solicitudes de Estudios
 * 
 * Define todos los endpoints relacionados con órdenes de laboratorio
 */

import { Router } from 'express';
import {
  getStudyRequests,
  getStudyRequestById,
  createStudyRequest,
  updateStudyRequestStatus,
  cancelStudyRequest
} from '../controllers/studyRequestController';

const router = Router();

// ============================================
// RUTAS DE SOLICITUDES DE ESTUDIOS
// ============================================

/**
 * GET /api/study-requests
 * Lista todas las solicitudes de estudios con filtros
 * 
 * Query params:
 * - page: número de página (default: 1)
 * - pageSize: tamaño de página (default: 25)
 * - patientId: filtrar por paciente
 * - status: filtrar por estado
 * - dateFrom: fecha inicio
 * - dateTo: fecha fin
 */
router.get('/', getStudyRequests);

/**
 * GET /api/study-requests/:id
 * Obtiene los detalles de una solicitud específica
 * 
 * Params:
 * - id: ID de la solicitud
 */
router.get('/:id', getStudyRequestById);

/**
 * POST /api/study-requests
 * Crea una nueva solicitud de estudios
 * 
 * Body:
 * {
 *   patientId: string,
 *   referringDoctorId?: string,
 *   studies: [
 *     { studyId: string, quantity: number }
 *   ],
 *   scheduledDate?: Date,
 *   notes?: string
 * }
 * 
 * TODO: Agregar middleware de autenticación
 * TODO: Agregar validación con Zod o express-validator
 */
router.post('/', createStudyRequest);

/**
 * PATCH /api/study-requests/:id/status
 * Actualiza el estado de una solicitud
 * 
 * Params:
 * - id: ID de la solicitud
 * 
 * Body:
 * {
 *   status: StudyRequestStatus,
 *   paymentMethod?: string,
 *   paymentDate?: Date
 * }
 * 
 * TODO: Agregar middleware de autenticación
 * TODO: Validar transiciones de estado permitidas
 */
router.patch('/:id/status', updateStudyRequestStatus);

/**
 * POST /api/study-requests/:id/cancel
 * Cancela una solicitud de estudio
 * 
 * Params:
 * - id: ID de la solicitud
 * 
 * Body:
 * {
 *   reason?: string
 * }
 * 
 * TODO: Agregar middleware de autenticación
 */
router.post('/:id/cancel', cancelStudyRequest);

// ============================================
// RUTAS ADICIONALES (FUTURAS)
// ============================================

/**
 * GET /api/study-requests/:id/invoice
 * Genera la factura de una solicitud
 * 
 * TODO: Implementar endpoint
 */
// router.get('/:id/invoice', generateInvoice);

/**
 * POST /api/study-requests/:id/payment
 * Registra un pago para una solicitud
 * 
 * TODO: Implementar endpoint con integración de pasarela de pago
 */
// router.post('/:id/payment', processPayment);

/**
 * GET /api/study-requests/:id/results
 * Obtiene los resultados de los estudios (desde MongoDB)
 * 
 * TODO: Implementar endpoint que consulte StudyResult
 */
// router.get('/:id/results', getStudyResults);

/**
 * POST /api/study-requests/:id/results
 * Sube los resultados de estudios
 * 
 * TODO: Implementar endpoint con upload de archivos
 */
// router.post('/:id/results', uploadStudyResults);

// ============================================
// EXPORTACIÓN
// ============================================

export default router;
