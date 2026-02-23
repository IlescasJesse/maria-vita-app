/**
 * Rutas de Autenticación
 * 
 * Define todos los endpoints relacionados con autenticación y gestión de usuarios
 */

import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middlewares/validator';
import { authenticate } from '../middlewares/auth';
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  completeProfile,
  completeAdminProfile
} from '../controllers/authController';

const router = Router();

// ============================================
// VALIDACIONES
// ============================================

/**
 * Validación para registro de usuario
 */
const registerValidation = [
  body('email')
    .trim()
    .custom((value) => {
      // Permitir formato JESSE@ADMIN para SUPERADMIN
      if (value === 'JESSE@ADMIN' || value === 'jesse@admin') {
        return true;
      }
      // Validar formato de email estándar para otros usuarios
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        throw new Error('Email no válido');
      }
      return true;
    })
    .normalizeEmail({ all_lowercase: false }), // No convertir a minúsculas
  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/\d/).withMessage('La contraseña debe contener al menos un número'),
  body('firstName')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-()]+$/).withMessage('Teléfono no válido'),
  body('role')
    .optional()
    .isIn(['SUPERADMIN', 'ADMIN', 'SPECIALIST', 'PATIENT', 'RECEPTIONIST']).withMessage('Rol no válido'),
  validate
];

/**
 * Validación para login
 */
const loginValidation = [
  body('email')
    .trim()
    .custom((value) => {
      // Permitir formato JESSE@ADMIN para SUPERADMIN
      if (value === 'JESSE@ADMIN' || value === 'jesse@admin') {
        return true;
      }
      // Validar formato de email estándar para otros usuarios
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        throw new Error('Email no válido');
      }
      return true;
    })
    .normalizeEmail({ all_lowercase: false }), // No convertir a minúsculas
  body('password')
    .notEmpty().withMessage('La contraseña es requerida'),
  validate
];

/**
 * Validación para actualización de perfil
 */
const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-()]+$/).withMessage('Teléfono no válido'),
  body('newPassword')
    .optional()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/\d/).withMessage('La contraseña debe contener al menos un número'),
  body('currentPassword')
    .if(body('newPassword').exists())
    .notEmpty().withMessage('Debes proporcionar la contraseña actual para cambiarla'),
  validate
];

// ============================================
// RUTAS PÚBLICAS
// ============================================

/**
 * POST /api/auth/register
 * Registra un nuevo usuario en el sistema
 * 
 * Body:
 * - email: string (requerido)
 * - password: string (requerido, min 6 caracteres)
 * - firstName: string (requerido)
 * - lastName: string (requerido)
 * - phone: string (opcional)
 * - role: UserRole (opcional, default: PATIENT)
 * 
 * Response:
 * - 201: Usuario creado exitosamente + token JWT
 * - 409: Email ya existe
 * - 400: Datos de validación inválidos
 */
router.post('/register', registerValidation, register);

/**
 * POST /api/auth/login
 * Inicia sesión con email y contraseña
 * 
 * Body:
 * - email: string (requerido)
 * - password: string (requerido)
 * 
 * Response:
 * - 200: Login exitoso + token JWT
 * - 401: Credenciales inválidas o cuenta inactiva
 * - 400: Datos de validación inválidos
 */
router.post('/login', loginValidation, login);

// ============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ============================================

/**
 * GET /api/auth/me
 * Obtiene los datos del usuario autenticado
 * 
 * Headers:
 * - Authorization: Bearer {token}
 * 
 * Response:
 * - 200: Datos del usuario
 * - 401: No autenticado o token inválido
 */
router.get('/me', authenticate, getProfile);

/**
 * PUT /api/auth/me
 * Actualiza los datos del usuario autenticado
 * 
 * Headers:
 * - Authorization: Bearer {token}
 * 
 * Body (todos opcionales):
 * - firstName: string
 * - lastName: string
 * - phone: string
 * - currentPassword: string (requerido si se cambia contraseña)
 * - newPassword: string
 * 
 * Response:
 * - 200: Perfil actualizado
 * - 401: No autenticado o contraseña actual incorrecta
 * - 400: Datos de validación inválidos
 */
router.put('/me', authenticate, updateProfileValidation, updateProfile);

/**
 * POST /api/auth/logout
 * Cierra la sesión del usuario (opcional - token se invalida en cliente)
 * 
 * Headers:
 * - Authorization: Bearer {token}
 * 
 * Response:
 * - 200: Logout exitoso
 */
router.post('/logout', authenticate, logout);

/**
 * POST /api/auth/complete-profile
 * Permite a usuarios nuevos completar su perfil por primera vez
 * Incluye establecer una nueva contraseña
 * 
 * Headers:
 * - Authorization: Bearer {token}
 * 
 * Body:
 * - suffix?: string
 * - firstName: string
 * - lastName: string
 * - dateOfBirth?: string
 * - phone?: string
 * - newPassword: string
 * - [campos de especialista si aplica]
 * 
 * Response:
 * - 200: Perfil completado exitosamente
 * - 401: No autenticado
 * - 400: Perfil ya completado o datos inválidos
 */
const completeProfileValidation = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('El nombre es requerido'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Los apellidos son requeridos'),
  body('newPassword')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una mayúscula')
    .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una minúscula')
    .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
    .matches(/[!@#$%^&*]/).withMessage('La contraseña debe contener al menos un carácter especial (!@#$%^&*)'),
  body('phone')
    .optional({ checkFalsy: true })
    .isNumeric().withMessage('El teléfono debe ser numérico'),
  validate
];

router.post('/complete-profile', authenticate, completeProfileValidation, completeProfile);

/**
 * POST /api/auth/complete-admin-profile
 * Permite a administradores completar su perfil
 * 
 * Headers:
 * - Authorization: Bearer {token}
 * 
 * Body:
 * - firstName: string
 * - lastName: string
 * - suffix?: string
 * - phone?: string
 * - photoUrl?: string
 * - newPassword: string (8+ caracteres, mayúsculas, minúsculas, números, símbolos)
 * 
 * Response:
 * - 200: Perfil de administrador completado
 * - 401: No autenticado
 * - 403: Usuario no es administrador
 */
const completeAdminProfileValidation = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Los apellidos son requeridos')
    .isLength({ min: 2, max: 100 }).withMessage('Los apellidos deben tener entre 2 y 100 caracteres'),
  body('suffix')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 }).withMessage('Sufijo muy largo'),
  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^\d{10}$/).withMessage('Teléfono debe tener exactamente 10 dígitos'),
  body('photoUrl')
    .optional({ checkFalsy: true })
    .isURL().withMessage('URL de foto inválida'),
  body('newPassword')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una mayúscula')
    .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una minúscula')
    .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
    .matches(/[!@#$%^&*]/).withMessage('La contraseña debe contener al menos un carácter especial (!@#$%^&*)'),
  validate
];

router.post('/complete-admin-profile', authenticate, completeAdminProfileValidation, completeAdminProfile);

// ============================================
// EXPORTACIÓN
// ============================================

export default router;
