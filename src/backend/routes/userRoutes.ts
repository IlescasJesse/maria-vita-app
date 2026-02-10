/**
 * Rutas de Usuarios
 * 
 * Define todos los endpoints relacionados con la gestión de usuarios
 */

import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middlewares/validator';
import { authenticate } from '../middlewares/auth';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController';

const router = Router();

// ============================================
// VALIDACIONES
// ============================================

/**
 * Validación para creación de usuario
 */
const createUserValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .custom((value) => {
      // Permitir formato JESSE@ADMIN o emails normales
      if (value.includes('@ADMIN') || value.includes('@admin')) {
        return true;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        throw new Error('Email no válido');
      }
      return true;
    }),
  body('role')
    .isIn(['SUPERADMIN', 'ADMIN', 'SPECIALIST', 'PATIENT', 'RECEPTIONIST'])
    .withMessage('Rol no válido'),
  body('firstName')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Los apellidos no pueden superar 100 caracteres'),
  body('phone')
    .optional()
    .isNumeric().withMessage('El teléfono debe ser numérico'),
  body('tempPassword')
    .optional()
    .isLength({ min: 6 }).withMessage('La contraseña temporal debe tener al menos 6 caracteres'),
  validate
];

/**
 * Validación para actualización de usuario
 */
const updateUserValidation = [
  body('email')
    .optional()
    .trim()
    .custom((value) => {
      if (value.includes('@ADMIN') || value.includes('@admin')) {
        return true;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        throw new Error('Email no válido');
      }
      return true;
    }),
  body('role')
    .optional()
    .isIn(['SUPERADMIN', 'ADMIN', 'SPECIALIST', 'PATIENT', 'RECEPTIONIST'])
    .withMessage('Rol no válido'),
  body('firstName')
    .optional({ checkFalsy: false })
    .trim()
    .custom((value) => {
      // Permite vacío o strings con 2+ caracteres
      if (value === null || value === undefined || value === '') {
        return true;
      }
      if (typeof value === 'string' && value.length >= 2 && value.length <= 100) {
        return true;
      }
      throw new Error('El nombre debe tener entre 2 y 100 caracteres');
    }),
  body('lastName')
    .optional({ checkFalsy: false })
    .trim()
    .custom((value) => {
      // Permite vacío o strings hasta 100 caracteres
      if (value === null || value === undefined || value === '') {
        return true;
      }
      if (typeof value === 'string' && value.length <= 100) {
        return true;
      }
      throw new Error('Los apellidos no pueden superar 100 caracteres');
    }),
  body('phone')
    .optional({ checkFalsy: true })
    .custom((value) => {
      // Permite vacío o números
      if (value === null || value === undefined || value === '') {
        return true;
      }
      if (/^\d+$/.test(String(value))) {
        return true;
      }
      throw new Error('El teléfono debe ser numérico');
    }),
  validate
];

// ============================================
// RUTAS
// ============================================

/**
 * GET /api/users
 * Obtiene todos los usuarios del sistema
 * 
 * Headers:
 * - Authorization: Bearer {token}
 * 
 * Permisos: SUPERADMIN, ADMIN
 * 
 * Response:
 * - 200: Lista de usuarios
 * - 401: No autenticado
 * - 403: Sin permisos
 */
router.get('/', authenticate, getAllUsers);

/**
 * POST /api/users/create
 * Crea un nuevo usuario en el sistema
 * 
 * Headers:
 * - Authorization: Bearer {token}
 * 
 * Body:
 * - email: string (requerido)
 * - role: string (requerido)
 * - firstName: string (requerido)
 * - lastName?: string
 * - suffix?: string
 * - phone?: string
 * - dateOfBirth?: string
 * - tempPassword?: string
 * - isActive?: boolean
 * 
 * Permisos: SUPERADMIN, ADMIN
 * 
 * Response:
 * - 201: Usuario creado
 * - 400: Email ya existe o datos inválidos
 * - 401: No autenticado
 * - 403: Sin permisos
 */
router.post('/create', authenticate, createUserValidation, createUser);

/**
 * PUT /api/users/:id
 * Actualiza un usuario existente
 * 
 * Headers:
 * - Authorization: Bearer {token}
 * 
 * Params:
 * - id: string (ID del usuario)
 * 
 * Body:
 * - email?: string
 * - role?: string
 * - firstName?: string
 * - lastName?: string
 * - suffix?: string
 * - phone?: string
 * - dateOfBirth?: string
 * - isActive?: boolean
 * 
 * Permisos: SUPERADMIN, ADMIN
 * 
 * Response:
 * - 200: Usuario actualizado
 * - 400: Email ya existe o datos inválidos
 * - 401: No autenticado
 * - 403: Sin permisos
 * - 404: Usuario no encontrado
 */
router.put('/:id', authenticate, updateUserValidation, updateUser);

/**
 * DELETE /api/users/:id
 * Elimina un usuario del sistema
 * 
 * Headers:
 * - Authorization: Bearer {token}
 * 
 * Params:
 * - id: string (ID del usuario)
 * 
 * Permisos: SUPERADMIN
 * 
 * Response:
 * - 200: Usuario eliminado
 * - 400: No se puede eliminar a sí mismo
 * - 401: No autenticado
 * - 403: Sin permisos (solo SUPERADMIN)
 * - 404: Usuario no encontrado
 */
router.delete('/:id', authenticate, deleteUser);

// ============================================
// EXPORTACIÓN
// ============================================

export default router;
