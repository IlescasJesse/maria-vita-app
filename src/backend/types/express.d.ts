import { Request } from 'express';

/**
 * Extensión de Express Request para incluir propiedades de usuario autenticado
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
        role?: string;
      };
    }
  }
}

export {};
