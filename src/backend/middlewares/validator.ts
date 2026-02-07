/**
 * Middleware de Validación con Zod
 * 
 * Maneja las validaciones y retorna errores formateados
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware que verifica los resultados de validación de express-validator
 * Si hay errores, retorna una respuesta 400 con los detalles
 */
export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Formatear errores para una respuesta más limpia
    const formattedErrors = errors.array().map((error: ValidationError) => ({
      field: 'path' in error ? error.path : 'unknown',
      message: error.msg,
      value: 'value' in error ? error.value : undefined
    }));

    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Errores de validación en los datos proporcionados',
        details: formattedErrors
      }
    });
    return;
  }

  next();
};

/**
 * Middleware de validación con Zod
 * Valida el body de la request contra un schema de Zod
 */
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Errores de validación en los datos proporcionados',
            details: formattedErrors
          }
        });
        return;
      }
      next(error);
    }
  };
};
