/**
 * Extensión de Express Request para incluir propiedades de usuario autenticado
 */
declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email: string;
      name?: string;
      role: string; // role es requerido cuando user existe
    };
  }
}
