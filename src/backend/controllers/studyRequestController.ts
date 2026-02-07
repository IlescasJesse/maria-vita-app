/**
 * Controlador de Solicitudes de Estudios
 * 
 * Maneja la creación y gestión de órdenes de laboratorio
 */

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { CreateStudyRequestDTO, StudyRequestStatus } from '../../types/models';
import { ActivityLog } from '../database/mongodb/schemas';

// ============================================
// LISTAR SOLICITUDES DE ESTUDIOS
// ============================================

/**
 * Obtiene la lista de solicitudes de estudios con filtros
 * 
 * Query params:
 * - page: número de página
 * - pageSize: tamaño de página
 * - patientId: filtrar por paciente
 * - status: filtrar por estado
 * - dateFrom: fecha inicio
 * - dateTo: fecha fin
 */
export const getStudyRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = 1,
      pageSize = 25,
      patientId,
      status,
      dateFrom,
      dateTo
    } = req.query;

    const pageNum = parseInt(page as string);
    const pageSizeNum = parseInt(pageSize as string);
    const skip = (pageNum - 1) * pageSizeNum;

    // Construir filtros
    const where: any = {};

    if (patientId) {
      where.patientId = patientId as string;
    }

    if (status) {
      where.status = status as StudyRequestStatus;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom as string);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo as string);
      }
    }

    // Ejecutar consulta
    const [requests, totalCount] = await Promise.all([
      prisma.studyRequest.findMany({
        where,
        skip,
        take: pageSizeNum,
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.studyRequest.count({ where })
    ]);

    // Registrar actividad
    await ActivityLog.create({
      userId: req.user?.id || 'system',
      userEmail: req.user?.email || 'system',
      action: 'VIEW',
      module: 'STUDIES',
      entityType: 'study_request',
      metadata: { filters: where },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      data: requests,
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
// OBTENER SOLICITUD POR ID
// ============================================

/**
 * Obtiene los detalles completos de una solicitud específica
 */
export const getStudyRequestById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const request = await prisma.studyRequest.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!request) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Solicitud de estudio no encontrada'
        }
      });
      return;
    }

    res.json({
      success: true,
      data: request
    });

  } catch (error) {
    next(error);
  }
};

// ============================================
// CREAR SOLICITUD DE ESTUDIO
// ============================================

/**
 * Crea una nueva solicitud de estudios de laboratorio
 * 
 * Body esperado:
 * {
 *   patientId: string,
 *   referringDoctorId?: string,
 *   studies: [{ studyId: string, quantity: number }],
 *   scheduledDate?: Date,
 *   notes?: string
 * }
 */
export const createStudyRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requestData: CreateStudyRequestDTO = req.body;

    // Validar que el paciente existe
    const patient = await prisma.user.findUnique({
      where: { id: requestData.patientId }
    });

    if (!patient) {
      res.status(404).json({
        success: false,
        error: {
          code: 'PATIENT_NOT_FOUND',
          message: 'El paciente especificado no existe'
        }
      });
      return;
    }

    // Obtener información de los estudios del catálogo
    const studyIds = requestData.studies.map(s => s.studyId);
    const studiesFromCatalog = await prisma.studyCatalog.findMany({
      where: {
        id: { in: studyIds },
        isActive: true
      }
    });

    if (studiesFromCatalog.length !== studyIds.length) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STUDIES',
          message: 'Uno o más estudios no existen o no están disponibles'
        }
      });
      return;
    }

    // Construir el array de estudios con precios
    const studyItems = requestData.studies.map(studyReq => {
      const catalogStudy = studiesFromCatalog.find(s => s.id === studyReq.studyId);
      return {
        studyId: studyReq.studyId,
        studyName: catalogStudy!.name,
        price: Number(catalogStudy!.price),
        quantity: studyReq.quantity
      };
    });

    // Calcular el monto total
    const totalAmount = studyItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    // Crear la solicitud
    const studyRequest = await prisma.studyRequest.create({
      data: {
        patientId: requestData.patientId,
        referringDoctorId: requestData.referringDoctorId,
        studies: studyItems,
        totalAmount,
        scheduledDate: requestData.scheduledDate,
        notes: requestData.notes,
        status: 'PENDING_PAYMENT'
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Registrar la creación en MongoDB
    await ActivityLog.create({
      userId: req.user?.id || 'system',
      userEmail: req.user?.email || 'system',
      action: 'CREATE',
      module: 'STUDIES',
      entityType: 'study_request',
      entityId: studyRequest.id,
      metadata: {
        patientId: requestData.patientId,
        studyCount: studyItems.length,
        totalAmount
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(201).json({
      success: true,
      data: studyRequest,
      message: 'Solicitud de estudio creada exitosamente'
    });

  } catch (error) {
    next(error);
  }
};

// ============================================
// ACTUALIZAR ESTADO DE SOLICITUD
// ============================================

/**
 * Actualiza el estado de una solicitud (ej: marcar como pagada)
 * 
 * Body esperado:
 * {
 *   status: StudyRequestStatus,
 *   paymentMethod?: string,
 *   paymentDate?: Date
 * }
 */
export const updateStudyRequestStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, paymentMethod, paymentDate } = req.body;

    // Verificar que la solicitud existe
    const existingRequest = await prisma.studyRequest.findUnique({
      where: { id }
    });

    if (!existingRequest) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Solicitud no encontrada'
        }
      });
      return;
    }

    // Validar transiciones de estado permitidas
    const validTransitions: Record<string, string[]> = {
      DRAFT: ['PENDING_PAYMENT', 'CANCELLED'],
      PENDING_PAYMENT: ['PAID', 'CANCELLED'],
      PAID: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: []
    };

    const allowedStatuses = validTransitions[existingRequest.status];
    if (!allowedStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TRANSITION',
          message: `No se puede cambiar de ${existingRequest.status} a ${status}`
        }
      });
      return;
    }

    // Actualizar la solicitud
    const updatedRequest = await prisma.studyRequest.update({
      where: { id },
      data: {
        status,
        paymentMethod,
        paymentDate: paymentDate ? new Date(paymentDate) : undefined
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Registrar la actualización
    await ActivityLog.create({
      userId: req.user?.id || 'system',
      userEmail: req.user?.email || 'system',
      action: 'UPDATE',
      module: 'STUDIES',
      entityType: 'study_request',
      entityId: id,
      changes: {
        statusFrom: existingRequest.status,
        statusTo: status
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      data: updatedRequest,
      message: 'Estado actualizado exitosamente'
    });

  } catch (error) {
    next(error);
  }
};

// ============================================
// CANCELAR SOLICITUD
// ============================================

/**
 * Cancela una solicitud de estudio
 */
export const cancelStudyRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const request = await prisma.studyRequest.findUnique({
      where: { id }
    });

    if (!request) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Solicitud no encontrada'
        }
      });
      return;
    }

    // No permitir cancelación si ya está completada
    if (request.status === 'COMPLETED') {
      res.status(400).json({
        success: false,
        error: {
          code: 'CANNOT_CANCEL',
          message: 'No se puede cancelar una solicitud completada'
        }
      });
      return;
    }

    const updatedRequest = await prisma.studyRequest.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        notes: reason ? `${request.notes}\nMotivo de cancelación: ${reason}` : request.notes
      }
    });

    // Registrar cancelación
    await ActivityLog.create({
      userId: req.user?.id || 'system',
      userEmail: req.user?.email || 'system',
      action: 'UPDATE',
      module: 'STUDIES',
      entityType: 'study_request',
      entityId: id,
      metadata: { action: 'CANCELLED', reason },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      data: updatedRequest,
      message: 'Solicitud cancelada exitosamente'
    });

  } catch (error) {
    next(error);
  }
};
