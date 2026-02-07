/**
 * Rutas del Módulo de Especialistas
 * 
 * Define todos los endpoints relacionados con especialistas médicos
 */

import { Router } from 'express';
import {
  getSpecialists,
  getSpecialistById,
  createSpecialist,
  updateSpecialist,
  deleteSpecialist
} from '../controllers/specialistController';

const router = Router();

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
router.get('/:id', getSpecialistById);

/**
 * POST /api/specialists
 * Crea un nuevo especialista
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
 * 
 * TODO: Agregar middleware de autenticación
 * TODO: Agregar validación con express-validator
 */
router.post('/', createSpecialist);

/**
 * PUT /api/specialists/:id
 * Actualiza un especialista existente
 * 
 * Params:
 * - id: ID del especialista
 * 
 * Body: Campos a actualizar (parciales)
 * 
 * TODO: Agregar middleware de autenticación
 * TODO: Verificar permisos del usuario
 */
router.put('/:id', updateSpecialist);

/**
 * DELETE /api/specialists/:id
 * Elimina (desactiva) un especialista
 * 
 * Params:
 * - id: ID del especialista
 * 
 * TODO: Agregar middleware de autenticación
 * TODO: Verificar permisos de administrador
 */
router.delete('/:id', deleteSpecialist);

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
