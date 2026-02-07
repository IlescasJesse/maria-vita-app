/**
 * Rutas del Módulo de Especialistas
 * 
 * Define todos los endpoints relacionados con especialistas médicos
 */

import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validator';
import { authenticate, authorize } from '../middlewares/auth';
import {
  getSpecialists,
  getSpecialistById,
  createSpecialist,
  updateSpecialist,
  deleteSpecialist
} from '../controllers/specialistController';

const router = Router();

// ============================================
// VALIDACIONES
// ============================================

/**
 * Validación para crear especialista
 */
const createSpecialistValidation = [
  body('userId')
    .notEmpty().withMessage('El ID de usuario es requerido')
    .isUUID().withMessage('El ID de usuario debe ser válido'),
  body('fullName')
    .trim()
    .notEmpty().withMessage('El nombre completo es requerido')
    .isLength({ min: 3, max: 200 }).withMessage('El nombre debe tener entre 3 y 200 caracteres'),
  body('specialty')
    .trim()
    .notEmpty().withMessage('La especialidad es requerida')
    .isLength({ max: 100 }).withMessage('La especialidad no puede exceder 100 caracteres'),
  body('licenseNumber')
    .trim()
    .notEmpty().withMessage('El número de cédula es requerido')
    .isLength({ max: 20 }).withMessage('El número de cédula no puede exceder 20 caracteres'),
  body('assignedOffice')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('El consultorio no puede exceder 50 caracteres'),
  body('biography')
    .optional()
    .trim(),
  body('yearsOfExperience')
    .optional()
    .isInt({ min: 0, max: 70 }).withMessage('Los años de experiencia deben ser entre 0 y 70'),
  body('photoUrl')
    .optional()
    .isURL().withMessage('La URL de la foto debe ser válida'),
  body('consultationFee')
    .optional()
    .isFloat({ min: 0 }).withMessage('El precio de consulta debe ser mayor o igual a 0'),
  body('isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable debe ser un booleano'),
  validate
];

/**
 * Validación para actualizar especialista
 */
const updateSpecialistValidation = [
  param('id')
    .isUUID().withMessage('El ID del especialista debe ser válido'),
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('El nombre debe tener entre 3 y 200 caracteres'),
  body('specialty')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('La especialidad no puede exceder 100 caracteres'),
  body('licenseNumber')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('El número de cédula no puede exceder 20 caracteres'),
  body('assignedOffice')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('El consultorio no puede exceder 50 caracteres'),
  body('biography')
    .optional()
    .trim(),
  body('yearsOfExperience')
    .optional()
    .isInt({ min: 0, max: 70 }).withMessage('Los años de experiencia deben ser entre 0 y 70'),
  body('photoUrl')
    .optional()
    .isURL().withMessage('La URL de la foto debe ser válida'),
  body('consultationFee')
    .optional()
    .isFloat({ min: 0 }).withMessage('El precio de consulta debe ser mayor o igual a 0'),
  body('isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable debe ser un booleano'),
  validate
];

/**
 * Validación para parámetro ID
 */
const idParamValidation = [
  param('id')
    .isUUID().withMessage('El ID del especialista debe ser válido'),
  validate
];

// ============================================
// RUTAS DE ESPECIALISTAS
// ============================================

/**
 * GET /api/specialists
 * Lista todos los especialistas con filtros y paginación
 * 
 * Query params:
 * - page: número de página (default: 1)
 * - pageSize: tamaño de página (default: 25)
 * - specialty: filtrar por especialidad
 * - isAvailable: filtrar por disponibilidad
 * - search: búsqueda por nombre
 */
router.get('/', getSpecialists);

/**
 * GET /api/specialists/:id
 * Obtiene los detalles de un especialista específico
 * 
 * Params:
 * - id: ID del especialista
 */
router.get('/:id', idParamValidation, getSpecialistById);

/**
 * POST /api/specialists
 * Crea un nuevo especialista
 * Requiere autenticación y rol ADMIN
 * 
 * Body:
 * {
 *   userId: string,
 *   fullName: string,
 *   specialty: string,
 *   licenseNumber: string,
 *   assignedOffice?: string,
 *   biography?: string,
 *   yearsOfExperience?: number,
 *   photoUrl?: string,
 *   consultationFee?: number,
 *   isAvailable?: boolean
 * }
 */
router.post('/', 
  authenticate, 
  authorize('ADMIN'), 
  createSpecialistValidation, 
  createSpecialist
);

/**
 * PUT /api/specialists/:id
 * Actualiza un especialista existente
 * Requiere autenticación y rol ADMIN o SPECIALIST (propio perfil)
 * 
 * Params:
 * - id: ID del especialista
 * 
 * Body: Campos a actualizar (parciales)
 */
router.put('/:id', 
  authenticate, 
  authorize('ADMIN', 'SPECIALIST'), 
  updateSpecialistValidation, 
  updateSpecialist
);

/**
 * DELETE /api/specialists/:id
 * Elimina (desactiva) un especialista
 * Requiere autenticación y rol ADMIN
 * 
 * Params:
 * - id: ID del especialista
 */
router.delete('/:id', 
  authenticate, 
  authorize('ADMIN'), 
  idParamValidation, 
  deleteSpecialist
);

// ============================================
// RUTAS ADICIONALES (FUTURAS)
// ============================================

/**
 * GET /api/specialists/:id/availability
 * Obtiene la disponibilidad de un especialista
 * 
 * TODO: Implementar endpoint
 */
// router.get('/:id/availability', getSpecialistAvailability);

/**
 * POST /api/specialists/:id/availability
 * Configura la disponibilidad de un especialista
 * 
 * TODO: Implementar endpoint
 */
// router.post('/:id/availability', setSpecialistAvailability);

/**
 * GET /api/specialists/:id/appointments
 * Obtiene las citas de un especialista
 * 
 * TODO: Implementar endpoint
 */
// router.get('/:id/appointments', getSpecialistAppointments);

// ============================================
// EXPORTACIÓN
// ============================================

export default router;
