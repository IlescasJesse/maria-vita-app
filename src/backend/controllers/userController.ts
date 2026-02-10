/**
 * Controlador de Usuarios
 * 
 * Maneja operaciones CRUD para usuarios del sistema
 */

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { ActivityLog } from '../database/mongodb/schemas';
import {
  successResponse,
  errorResponse,
  createdResponse,
  updatedResponse,
  deletedResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
} from '../utils/apiResponse';

const prisma = new PrismaClient();

// ============================================
// LISTAR USUARIOS
// ============================================

/**
 * Obtiene todos los usuarios del sistema
 * Requiere autenticación con rol SUPERADMIN o ADMIN
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      unauthorizedResponse(res, 'Usuario no autenticado');
      return;
    }

    // Verificar permisos
    if (!['SUPERADMIN', 'ADMIN'].includes(req.user.role)) {
      forbiddenResponse(res, 'No tienes permisos para listar usuarios');
      return;
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        suffix: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        dateOfBirth: true,
        isActive: true,
        isNew: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    // Registrar actividad
    await ActivityLog.create({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'LIST',
      module: 'USERS',
      entityType: 'user',
      metadata: { count: users.length },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    successResponse(res, users);
  } catch (error) {
    next(error);
  }
};

// ============================================
// CREAR USUARIO
// ============================================

/**
 * Crea un nuevo usuario en el sistema
 * Requiere autenticación con rol SUPERADMIN o ADMIN
 */
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      unauthorizedResponse(res, 'Usuario no autenticado');
      return;
    }

    // Verificar permisos
    if (!['SUPERADMIN', 'ADMIN'].includes(req.user.role)) {
      forbiddenResponse(res, 'No tienes permisos para crear usuarios');
      return;
    }

    const {
      email,
      role,
      suffix,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      tempPassword,
      isActive = true
    } = req.body;

    const normalizedEmail = typeof email === 'string' ? email.trim() : email;

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      errorResponse(res, 'El email ya está registrado', 409, 'EMAIL_EXISTS');
      return;
    }

    // Generar contraseña temporal si no se proporciona
    const passwordToHash = tempPassword || 'MV2026!Temp';
    const passwordHash = await bcrypt.hash(passwordToHash, 10);

    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        role,
        suffix: suffix || null,
        firstName,
        lastName: lastName?.trim() || '',
        phone: phone || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        isActive,
        isNew: true, // Todos los usuarios nuevos deben completar perfil
      },
      select: {
        id: true,
        email: true,
        suffix: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        dateOfBirth: true,
        isActive: true,
        isNew: true,
        createdAt: true,
      }
    });

    // Si es especialista, crear registro en Specialist
    if (role === 'SPECIALIST') {
      await prisma.specialist.create({
        data: {
          userId: newUser.id,
          fullName: `${firstName} ${lastName || ''}`.trim(),
          specialty: 'Por definir',
          licenseNumber: 'Pendiente',
          isAvailable: true,
        }
      });
    }

    // Registrar actividad
    await ActivityLog.create({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'CREATE',
      module: 'USERS',
      entityType: 'user',
      entityId: newUser.id,
      metadata: { 
        email: newUser.email, 
        role: newUser.role,
        createdBy: req.user.email 
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    createdResponse(res, newUser, 'Usuario creado exitosamente');
  } catch (error) {
    next(error);
  }
};

// ============================================
// ACTUALIZAR USUARIO
// ============================================

/**
 * Actualiza un usuario existente
 * Requiere autenticación con rol SUPERADMIN o ADMIN
 */
export const updateUser = async (
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

    // Verificar permisos
    if (!['SUPERADMIN', 'ADMIN'].includes(req.user.role)) {
      forbiddenResponse(res, 'No tienes permisos para actualizar usuarios');
      return;
    }

    const { id } = req.params;
    const {
      role,
      suffix,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      isActive
    } = req.body;

    // NOTE: Email NO se puede actualizar (ya viene de HTTP, es ignorado a propósito)

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      notFoundResponse(res, 'Usuario no encontrado');
      return;
    }

    const updateData: any = {};
    // NO actualizar email en PUT (email no se puede cambiar después de creación)
    if (role) updateData.role = role;
    if (suffix !== undefined) updateData.suffix = suffix || null;
    if (firstName !== undefined && firstName !== '') updateData.firstName = firstName;
    if (lastName !== undefined && lastName !== '') updateData.lastName = lastName || null;
    if (phone !== undefined && phone !== '') updateData.phone = phone || null;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        suffix: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        dateOfBirth: true,
        isActive: true,
        isNew: true,
        updatedAt: true,
      }
    });

    // Registrar actividad
    await ActivityLog.create({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'UPDATE',
      module: 'USERS',
      entityType: 'user',
      entityId: id,
      metadata: { 
        updatedFields: Object.keys(updateData),
        updatedBy: req.user.email 
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    updatedResponse(res, updatedUser, 'Usuario actualizado exitosamente');
  } catch (error) {
    next(error);
  }
};

// ============================================
// ELIMINAR USUARIO
// ============================================

/**
 * Elimina un usuario del sistema
 * Requiere autenticación con rol SUPERADMIN
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      unauthorizedResponse(res, 'Usuario no autenticado');
      return;
    }

    // Solo SUPERADMIN puede eliminar usuarios
    if (req.user.role !== 'SUPERADMIN') {
      forbiddenResponse(res, 'Solo SUPERADMIN puede eliminar usuarios');
      return;
    }

    const { id } = req.params;

    // No se puede eliminar a sí mismo
    if (id === req.user.id) {
      errorResponse(res, 'No puedes eliminar tu propio usuario', 400, 'CANNOT_DELETE_SELF');
      return;
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      notFoundResponse(res, 'Usuario no encontrado');
      return;
    }

    // Si es especialista, eliminar también el registro de specialist
    if (user.role === 'SPECIALIST') {
      await prisma.specialist.deleteMany({
        where: { userId: id }
      });
    }

    // Eliminar usuario
    await prisma.user.delete({
      where: { id }
    });

    // Registrar actividad
    await ActivityLog.create({
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'DELETE',
      module: 'USERS',
      entityType: 'user',
      entityId: id,
      metadata: { 
        deletedUser: user.email,
        deletedBy: req.user.email 
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    deletedResponse(res, 'Usuario eliminado exitosamente');
  } catch (error) {
    next(error);
  }
};
