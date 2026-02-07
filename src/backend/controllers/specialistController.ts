/**
 * Controlador de Especialistas
 * 
 * Maneja todas las operaciones CRUD relacionadas con especialistas médicos
 */

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { CreateSpecialistDTO, UpdateSpecialistDTO } from '../../types/models';
import { ActivityLog } from '../database/mongodb/schemas';

// ============================================
// LISTAR ESPECIALISTAS
// ============================================

/**
 * Obtiene la lista de especialistas con filtros y paginación
 * 
 * Query params:
 * - page: número de página (default: 1)
 * - pageSize: tamaño de página (default: 25)
 * - specialty: filtrar por especialidad
 * - isAvailable: filtrar por disponibilidad (true/false)
 * - search: búsqueda por nombre
 */
export const getSpecialists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = 1,
      pageSize = 25,
      specialty,
      isAvailable,
      search
    } = req.query;

    // Convertir parámetros a números
    const pageNum = parseInt(page as string);
    const pageSizeNum = parseInt(pageSize as string);
    const skip = (pageNum - 1) * pageSizeNum;

    // Construir filtros dinámicos
    const where: any = {};

    if (specialty) {
      where.specialty = specialty as string;
    }

    if (isAvailable !== undefined) {
      where.isAvailable = isAvailable === 'true';
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search as string } },
        { specialty: { contains: search as string } }
      ];
    }

    // Ejecutar consulta con paginación
    const [specialists, totalCount] = await Promise.all([
      prisma.specialist.findMany({
        where,
        skip,
        take: pageSizeNum,
        include: {
          user: {
            select: {
              email: true,
              phone: true,
              isActive: true
            }
          }
        },
        orderBy: {
          fullName: 'asc'
        }
      }),
      prisma.specialist.count({ where })
    ]);

    // Registrar actividad en MongoDB
    await ActivityLog.create({
      userId: req.user?.id || 'system',
      userEmail: req.user?.email || 'system',
      action: 'VIEW',
      module: 'SPECIALISTS',
      entityType: 'specialist',
      metadata: { filters: where, page: pageNum, pageSize: pageSizeNum },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    // Responder con datos paginados
    res.json({
      success: true,
      data: specialists,
      meta: {
        page: pageNum,
        pageSize: pageSizeNum,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSizeNum)
      }
    });

  } catch (error) {
    next(error);
  }
};

// ============================================
// OBTENER ESPECIALISTA POR ID
// ============================================

/**
 * Obtiene los detalles completos de un especialista específico
 */
export const getSpecialistById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const specialist = await prisma.specialist.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
            isActive: true
          }
        },
        availability: {
          where: { isActive: true },
          orderBy: { dayOfWeek: 'asc' }
        }
      }
    });

    if (!specialist) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Especialista no encontrado'
        }
      });
      return;
    }

    res.json({
      success: true,
      data: specialist
    });

  } catch (error) {
    next(error);
  }
};

// ============================================
// CREAR ESPECIALISTA
// ============================================

/**
 * Crea un nuevo especialista en el sistema
 * Requiere que el usuario asociado ya exista
 */
export const createSpecialist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data: CreateSpecialistDTO = req.body;

    // Verificar que el usuario existe y no tiene especialista asignado
    const userExists = await prisma.user.findUnique({
      where: { id: data.userId },
      include: { specialist: true }
    });

    if (!userExists) {
      res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'El usuario especificado no existe'
        }
      });
      return;
    }

    if (userExists.specialist) {
      res.status(400).json({
        success: false,
        error: {
          code: 'SPECIALIST_EXISTS',
          message: 'Este usuario ya tiene un perfil de especialista'
        }
      });
      return;
    }

    // Verificar que la cédula no esté duplicada
    const licenseExists = await prisma.specialist.findUnique({
      where: { licenseNumber: data.licenseNumber }
    });

    if (licenseExists) {
      res.status(400).json({
        success: false,
        error: {
          code: 'DUPLICATE_LICENSE',
          message: 'Ya existe un especialista con esta cédula profesional'
        }
      });
      return;
    }

    // Crear el especialista
    const specialist = await prisma.specialist.create({
      data,
      include: {
        user: {
          select: {
            email: true,
            phone: true
          }
        }
      }
    });

    // Registrar la creación en MongoDB
    await ActivityLog.create({
      userId: req.user?.id || 'system',
      userEmail: req.user?.email || 'system',
      action: 'CREATE',
      module: 'SPECIALISTS',
      entityType: 'specialist',
      entityId: specialist.id,
      metadata: { specialistData: data },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(201).json({
      success: true,
      data: specialist,
      message: 'Especialista creado exitosamente'
    });

  } catch (error) {
    next(error);
  }
};

// ============================================
// ACTUALIZAR ESPECIALISTA
// ============================================

/**
 * Actualiza los datos de un especialista existente
 */
export const updateSpecialist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const data: Partial<UpdateSpecialistDTO> = req.body;

    // Verificar que el especialista existe
    const existingSpecialist = await prisma.specialist.findUnique({
      where: { id }
    });

    if (!existingSpecialist) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Especialista no encontrado'
        }
      });
      return;
    }

    // Actualizar el especialista
    const updatedSpecialist = await prisma.specialist.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            email: true,
            phone: true
          }
        }
      }
    });

    // Registrar la actualización
    await ActivityLog.create({
      userId: req.user?.id || 'system',
      userEmail: req.user?.email || 'system',
      action: 'UPDATE',
      module: 'SPECIALISTS',
      entityType: 'specialist',
      entityId: id,
      changes: { before: existingSpecialist, after: data },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      data: updatedSpecialist,
      message: 'Especialista actualizado exitosamente'
    });

  } catch (error) {
    next(error);
  }
};

// ============================================
// ELIMINAR ESPECIALISTA
// ============================================

/**
 * Elimina un especialista del sistema (soft delete recomendado)
 */
export const deleteSpecialist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Verificar que el especialista existe
    const specialist = await prisma.specialist.findUnique({
      where: { id }
    });

    if (!specialist) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Especialista no encontrado'
        }
      });
      return;
    }

    // En lugar de eliminar, marcar como no disponible (soft delete)
    await prisma.specialist.update({
      where: { id },
      data: { isAvailable: false }
    });

    // Registrar la eliminación
    await ActivityLog.create({
      userId: req.user?.id || 'system',
      userEmail: req.user?.email || 'system',
      action: 'DELETE',
      module: 'SPECIALISTS',
      entityType: 'specialist',
      entityId: id,
      metadata: { specialist },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Especialista eliminado exitosamente'
    });

  } catch (error) {
    next(error);
  }
};
