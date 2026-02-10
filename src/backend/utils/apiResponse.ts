import { Response } from 'express';
import { ApiResponse, ProcessState } from '@/types/processStates';

/**
 * Utilidades para respuestas estandarizadas de API con estados de procesos
 */

/**
 * Respuesta exitosa genérica
 */
export const successResponse = <T = any>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200,
  processState: ProcessState = 'success'
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    processState,
    timestamp: new Date(),
  };

  if (message) {
    response.error = { message };
  }

  return res.status(statusCode).json(response);
};

/**
 * Respuesta de error genérica
 */
export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 400,
  code?: string,
  details?: any
): Response => {
  const response: ApiResponse = {
    success: false,
    error: {
      message,
      code,
      details,
    },
    processState: 'error',
    timestamp: new Date(),
  };

  return res.status(statusCode).json(response);
};

/**
 * Respuesta para operación de creación
 */
export const createdResponse = <T = any>(
  res: Response,
  data: T,
  message: string = 'Registro creado exitosamente'
): Response => {
  return successResponse(res, data, message, 201, 'success');
};

/**
 * Respuesta para operación de actualización
 */
export const updatedResponse = <T = any>(
  res: Response,
  data: T,
  message: string = 'Registro actualizado exitosamente'
): Response => {
  return successResponse(res, data, message, 200, 'success');
};

/**
 * Respuesta para operación de eliminación
 */
export const deletedResponse = (
  res: Response,
  message: string = 'Registro eliminado exitosamente'
): Response => {
  return successResponse(res, null, message, 200, 'success');
};

/**
 * Respuesta para validación fallida
 */
export const validationErrorResponse = (
  res: Response,
  message: string = 'Error de validación',
  details?: any
): Response => {
  return errorResponse(res, message, 422, 'VALIDATION_ERROR', details);
};

/**
 * Respuesta para recurso no encontrado
 */
export const notFoundResponse = (
  res: Response,
  message: string = 'Recurso no encontrado'
): Response => {
  return errorResponse(res, message, 404, 'NOT_FOUND');
};

/**
 * Respuesta para error de autenticación
 */
export const unauthorizedResponse = (
  res: Response,
  message: string = 'No autorizado'
): Response => {
  return errorResponse(res, message, 401, 'UNAUTHORIZED');
};

/**
 * Respuesta para error de permisos
 */
export const forbiddenResponse = (
  res: Response,
  message: string = 'Acceso denegado'
): Response => {
  return errorResponse(res, message, 403, 'FORBIDDEN');
};

/**
 * Respuesta para conflicto (ej: duplicados)
 */
export const conflictResponse = (
  res: Response,
  message: string = 'Ya existe un registro con estos datos',
  details?: any
): Response => {
  return errorResponse(res, message, 409, 'CONFLICT', details);
};

/**
 * Respuesta para errores internos del servidor
 */
export const internalErrorResponse = (
  res: Response,
  message: string = 'Error interno del servidor',
  details?: any
): Response => {
  return errorResponse(res, message, 500, 'INTERNAL_ERROR', details);
};

/**
 * Middleware para capturar errores y responder con formato estándar
 */
export const errorHandlerMiddleware = (err: any, _req: any, res: Response, next: any) => {
  console.error('Error:', err);

  // Si ya se envió la respuesta, delegar al siguiente manejador
  if (res.headersSent) {
    return next(err);
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    return validationErrorResponse(res, 'Error de validación', err.errors);
  }

  // Error de duplicado en base de datos
  if (err.code === 11000) {
    return conflictResponse(res, 'Ya existe un registro con estos datos', err.keyValue);
  }

  // Error genérico
  return internalErrorResponse(
    res,
    process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message,
    process.env.NODE_ENV === 'production' ? undefined : err.stack
  );
};
