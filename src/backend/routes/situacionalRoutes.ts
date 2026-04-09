/**
 * Rutas del Módulo Situacional
 */

import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import {
  crearRequisicion,
  actualizarRespuestasAdmin,
  listarRequisiciones,
  misRequisiciones,
  obtenerRequisicion,
  cambiarEstado,
  contextoDev
} from '../controllers/situacionalController';

const router = Router();

// Contexto dev (antes de /:id para evitar conflicto de rutas)
router.get('/contexto-dev', authenticate, authorize('SUPERADMIN'), contextoDev);

// Mis requerimientos
router.get('/mis-requisiciones', authenticate, misRequisiciones);

// Lista completa (solo superadmin)
router.get('/requisiciones', authenticate, authorize('SUPERADMIN'), listarRequisiciones);

// Crear requerimiento (todos excepto superadmin, validado en controller)
router.post('/requisicion', authenticate, crearRequisicion);

// Detalle
router.get('/requisicion/:id', authenticate, obtenerRequisicion);

// Respuestas técnicas del admin
router.put('/requisicion/:id/admin', authenticate, authorize('SUPERADMIN'), actualizarRespuestasAdmin);

// Cambiar estado
router.patch('/requisicion/:id/estado', authenticate, authorize('SUPERADMIN'), cambiarEstado);

export default router;
