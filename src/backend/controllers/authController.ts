/**
 * Controlador de Autenticación
 * 
 * Maneja el registro, login y gestión de sesiones de usuarios
 */

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { generateToken } from '../middlewares/auth';
import { ActivityLog } from '../database/mongodb/schemas';

// ============================================
// REGISTRO DE USUARIO
// ============================================

/**
 * Registra un nuevo usuario en el sistema
 * 
 * Body:
 * - email: string
 * - password: string
 * - firstName: string
 * - lastName: string
 * - phone?: string
 * - role?: UserRole (default: PATIENT)
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'El email ya está registrado'
        }
      });
      return;
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        role: role || 'PATIENT',
        isActive: true
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        createdAt: true
      }
    });

    // Generar token JWT
    const token = generateToken(user.id, user.email, user.role);

    // Registrar actividad en MongoDB
    await ActivityLog.create({
      userId: user.id,
      userEmail: user.email,
      action: 'REGISTER',
      module: 'AUTH',
      entityType: 'user',
      entityId: user.id,
      metadata: { role: user.role },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// LOGIN
// ============================================

/**
 * Inicia sesión con email y contraseña
 * 
 * Body:
 * - email: string
 * - password: string
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        isActive: true
      }
    });

    // Verificar que el usuario existe
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email o contraseña incorrectos'
        }
      });
      return;
    }

    // Verificar que el usuario está activo
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Tu cuenta está inactiva. Contacta al administrador'
        }
      });
      return;
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email o contraseña incorrectos'
        }
      });
      return;
    }

    // Generar token JWT
    const token = generateToken(user.id, user.email, user.role);

    // Registrar actividad en MongoDB
    await ActivityLog.create({
      userId: user.id,
      userEmail: user.email,
      action: 'LOGIN',
      module: 'AUTH',
      entityType: 'user',
      entityId: user.id,
      metadata: { role: user.role },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    // Responder con usuario y token (sin el hash de contraseña)
    const { passwordHash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// OBTENER PERFIL
// ============================================

/**
 * Obtiene los datos del usuario autenticado
 * Requiere autenticación (token JWT)
 */
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Usuario no autenticado'
        }
      });
      return;
    }

    // Obtener datos completos del usuario
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        specialist: {
          select: {
            id: true,
            fullName: true,
            specialty: true,
            licenseNumber: true,
            assignedOffice: true,
            photoUrl: true,
            consultationFee: true
          }
        }
      }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Usuario no encontrado'
        }
      });
      return;
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ACTUALIZAR PERFIL
// ============================================

/**
 * Actualiza los datos del usuario autenticado
 * 
 * Body (todos opcionales):
 * - firstName?: string
 * - lastName?: string
 * - phone?: string
 * - currentPassword?: string (requerido si se cambia contraseña)
 * - newPassword?: string
 */
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Usuario no autenticado'
        }
      });
      return;
    }

    const { firstName, lastName, phone, currentPassword, newPassword } = req.body;
    const updateData: any = {};

    // Campos básicos
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;

    // Cambio de contraseña
    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Debes proporcionar la contraseña actual para cambiarla'
          }
        });
        return;
      }

      // Verificar contraseña actual
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { passwordHash: true }
      });

      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'Usuario no encontrado'
          }
        });
        return;
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_PASSWORD',
            message: 'Contraseña actual incorrecta'
          }
        });
        return;
      }

      // Hash de la nueva contraseña
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        updatedAt: true
      }
    });

    // Registrar actividad
    await ActivityLog.create({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'UPDATE',
      module: 'AUTH',
      entityType: 'user',
      entityId: req.user.id,
      metadata: { updatedFields: Object.keys(updateData) },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// LOGOUT (opcional - manejo en cliente)
// ============================================

/**
 * Registra el logout del usuario
 * El token se invalida en el cliente
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user) {
      // Registrar actividad
      await ActivityLog.create({
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'LOGOUT',
        module: 'AUTH',
        entityType: 'user',
        entityId: req.user.id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });
    }

    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};
