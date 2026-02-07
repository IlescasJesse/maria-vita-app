/**
 * Middleware de Manejo Centralizado de Errores
 * 
 * Captura todos los errores de la aplicación y envía respuestas consistentes
 */

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

/**
 * Interfaz para errores personalizados
 */
interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

/**
 * Middleware principal de manejo de errores
 * Este debe ser el último middleware registrado en la aplicación
 */
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log del error en consola (en producción esto iría a un servicio de logging)
  console.error('❌ Error capturado:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // ============================================
  // ERRORES DE PRISMA (MySQL)
  // ============================================

  // Error de registro no encontrado
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'El registro solicitado no existe',
          details: process.env.NODE_ENV === 'development' ? err.meta : undefined
        }
      });
      return;
    }

    // Error de violación de constraint único
    if (err.code === 'P2002') {
      const field = (err.meta?.target as string[])?.join(', ') || 'campo';
      res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_ENTRY',
          message: `Ya existe un registro con este ${field}`,
          details: process.env.NODE_ENV === 'development' ? err.meta : undefined
        }
      });
      return;
    }

    // Error de violación de foreign key
    if (err.code === 'P2003') {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_REFERENCE',
          message: 'La referencia a otro registro no es válida',
          details: process.env.NODE_ENV === 'development' ? err.meta : undefined
        }
      });
      return;
    }

    // Error de validación de Prisma
    if (err.code === 'P2000') {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Los datos proporcionados no son válidos',
          details: process.env.NODE_ENV === 'development' ? err.meta : undefined
        }
      });
      return;
    }
  }

  // Error de validación de Prisma (campos requeridos, tipos, etc)
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Error de validación en los datos',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      }
    });
    return;
  }

  // Error de inicialización de Prisma
  if (err instanceof Prisma.PrismaClientInitializationError) {
    res.status(503).json({
      success: false,
      error: {
        code: 'DATABASE_CONNECTION_ERROR',
        message: 'Error al conectar con la base de datos',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      }
    });
    return;
  }

  // ============================================
  // ERRORES DE MONGOOSE (MongoDB)
  // ============================================

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Error de validación en los datos',
        details: process.env.NODE_ENV === 'development' ? err.details : undefined
      }
    });
    return;
  }

  // Error de cast de Mongoose (ej: ID inválido)
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_ID',
        message: 'El ID proporcionado no es válido',
        details: process.env.NODE_ENV === 'development' ? err.details : undefined
      }
    });
    return;
  }

  // ============================================
  // ERRORES PERSONALIZADOS
  // ============================================

  // Error con código de estado personalizado
  if (err.statusCode) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code || 'CUSTOM_ERROR',
        message: err.message,
        details: process.env.NODE_ENV === 'development' ? err.details : undefined
      }
    });
    return;
  }

  // ============================================
  // ERRORES HTTP ESTÁNDAR
  // ============================================

  // Error 401 - No autorizado
  if (err.name === 'UnauthorizedError' || err.message.includes('unauthorized')) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'No autorizado. Token inválido o expirado'
      }
    });
    return;
  }

  // Error 403 - Prohibido
  if (err.name === 'ForbiddenError' || err.message.includes('forbidden')) {
    res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'No tiene permisos para realizar esta acción'
      }
    });
    return;
  }

  // ============================================
  // ERROR GENÉRICO (500)
  // ============================================

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? {
        message: err.message,
        stack: err.stack
      } : undefined
    }
  });
};

/**
 * Middleware para capturar errores asíncronos
 * Envuelve controladores asíncronos para evitar try-catch repetitivos
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Función helper para crear errores personalizados
 */
export const createError = (
  statusCode: number,
  code: string,
  message: string,
  details?: any
): CustomError => {
  const error = new Error(message) as CustomError;
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
};
