/**
 * Controlador del Módulo Situacional
 * Gestión de requerimientos y mejoras del sistema
 */

import { Request, Response } from 'express';
import { Requisicion } from '../database/mongodb/schemas';
import {
  successResponse,
  createdResponse,
  updatedResponse,
  errorResponse,
  notFoundResponse,
  forbiddenResponse,
  internalErrorResponse,
  validationErrorResponse
} from '../utils/apiResponse';

// ─── Helpers ────────────────────────────────────────────────────────────────

const generateFolio = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const count = await Requisicion.countDocuments({
    folio: { $regex: `^MV-${year}-` }
  });
  const num = String(count + 1).padStart(4, '0');
  return `MV-${year}-${num}`;
};

// ─── POST /api/situacional/requisicion ──────────────────────────────────────
// Todos los roles excepto SUPERADMIN

export const crearRequisicion = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user!;

    if (user.role === 'SUPERADMIN') {
      forbiddenResponse(res, 'El super administrador no puede crear requerimientos clínicos');
      return;
    }

    const {
      area,
      tipo,
      modulo_afectado,
      respuestas_usuario,
      prioridad_usuario
    } = req.body;

    if (!area || !tipo || !modulo_afectado || !respuestas_usuario || !prioridad_usuario) {
      validationErrorResponse(res, 'Faltan campos requeridos: area, tipo, modulo_afectado, respuestas_usuario, prioridad_usuario');
      return;
    }

    const tiposValidos = ['nueva_funcion', 'mejora', 'error', 'comportamiento'];
    if (!tiposValidos.includes(tipo)) {
      validationErrorResponse(res, `Tipo inválido. Valores aceptados: ${tiposValidos.join(', ')}`);
      return;
    }

    if (prioridad_usuario < 1 || prioridad_usuario > 5) {
      validationErrorResponse(res, 'prioridad_usuario debe ser un número entre 1 y 5');
      return;
    }

    const folio = await generateFolio();

    const requisicion = await Requisicion.create({
      folio,
      solicitante: {
        nombre: user.name,
        perfil: user.role,
        area,
        userId: user.id
      },
      tipo,
      modulo_afectado,
      respuestas_usuario,
      prioridad_usuario: Number(prioridad_usuario),
      estado: 'nuevo',
      adjuntos: req.body.adjuntos || []
    });

    createdResponse(res, { requisicion }, `Requerimiento ${folio} creado exitosamente`);
  } catch (error) {
    console.error('[situacionalController.crearRequisicion]', error);
    internalErrorResponse(res, 'Error al crear el requerimiento');
  }
};

// ─── PUT /api/situacional/requisicion/:id/admin ──────────────────────────────
// Solo SUPERADMIN

export const actualizarRespuestasAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      respuestas_admin,
      prioridad_tecnica,
      sprint_asignado,
      notas_dev
    } = req.body;

    const requisicion = await Requisicion.findById(id);
    if (!requisicion) {
      notFoundResponse(res, 'Requerimiento no encontrado');
      return;
    }

    if (respuestas_admin) requisicion.respuestas_admin = respuestas_admin;
    if (prioridad_tecnica) requisicion.prioridad_tecnica = prioridad_tecnica;
    if (sprint_asignado !== undefined) requisicion.sprint_asignado = sprint_asignado;
    if (notas_dev !== undefined) requisicion.notas_dev = notas_dev;

    await requisicion.save();

    updatedResponse(res, { requisicion }, 'Respuestas técnicas guardadas');
  } catch (error) {
    console.error('[situacionalController.actualizarRespuestasAdmin]', error);
    internalErrorResponse(res, 'Error al actualizar respuestas técnicas');
  }
};

// ─── GET /api/situacional/requisiciones ──────────────────────────────────────
// Solo SUPERADMIN — lista con filtros ?estado=&modulo=&sprint=

export const listarRequisiciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const { estado, modulo, sprint } = req.query;

    const filtro: Record<string, any> = {};
    if (estado) filtro.estado = estado;
    if (modulo) filtro.modulo_afectado = modulo;
    if (sprint) filtro.sprint_asignado = sprint;

    const requisiciones = await Requisicion.find(filtro)
      .sort({ fecha_creacion: -1 })
      .limit(200);

    successResponse(res, { requisiciones, total: requisiciones.length });
  } catch (error) {
    console.error('[situacionalController.listarRequisiciones]', error);
    internalErrorResponse(res, 'Error al listar requerimientos');
  }
};

// ─── GET /api/situacional/mis-requisiciones ───────────────────────────────────
// Usuario autenticado — ve solo los suyos

export const misRequisiciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const requisiciones = await Requisicion.find({ 'solicitante.userId': userId })
      .sort({ fecha_creacion: -1 })
      .limit(100);

    successResponse(res, { requisiciones, total: requisiciones.length });
  } catch (error) {
    console.error('[situacionalController.misRequisiciones]', error);
    internalErrorResponse(res, 'Error al obtener tus requerimientos');
  }
};

// ─── GET /api/situacional/requisicion/:id ────────────────────────────────────
// Detalle completo — usuario solo ve la suya, SUPERADMIN ve todas

export const obtenerRequisicion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const requisicion = await Requisicion.findById(id);
    if (!requisicion) {
      notFoundResponse(res, 'Requerimiento no encontrado');
      return;
    }

    if (user.role !== 'SUPERADMIN' && requisicion.solicitante.userId !== user.id) {
      forbiddenResponse(res, 'No tienes permiso para ver este requerimiento');
      return;
    }

    successResponse(res, { requisicion });
  } catch (error) {
    console.error('[situacionalController.obtenerRequisicion]', error);
    internalErrorResponse(res, 'Error al obtener el requerimiento');
  }
};

// ─── PATCH /api/situacional/requisicion/:id/estado ────────────────────────────
// Solo SUPERADMIN

export const cambiarEstado = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['nuevo', 'en_revision', 'en_desarrollo', 'completado', 'rechazado', 'pausado'];
    if (!estado || !estadosValidos.includes(estado)) {
      validationErrorResponse(res, `Estado inválido. Valores aceptados: ${estadosValidos.join(', ')}`);
      return;
    }

    const requisicion = await Requisicion.findById(id);
    if (!requisicion) {
      notFoundResponse(res, 'Requerimiento no encontrado');
      return;
    }

    // Regla: no puede pasar a en_desarrollo sin respuestas_admin
    if (estado === 'en_desarrollo') {
      const admin = requisicion.respuestas_admin;
      if (!admin || Object.keys(admin).length === 0) {
        errorResponse(
          res,
          'No se puede mover a "en desarrollo" sin completar las respuestas técnicas',
          400,
          'MISSING_ADMIN_RESPONSES'
        );
        return;
      }
    }

    requisicion.estado = estado as any;
    await requisicion.save();

    updatedResponse(res, { requisicion }, `Estado actualizado a: ${estado}`);
  } catch (error) {
    console.error('[situacionalController.cambiarEstado]', error);
    internalErrorResponse(res, 'Error al cambiar estado');
  }
};

// ─── GET /api/situacional/contexto-dev ────────────────────────────────────────
// Solo SUPERADMIN — resumen JSON de tickets activos para contexto de desarrollo

export const contextoDev = async (_req: Request, res: Response): Promise<void> => {
  try {
    const activos = await Requisicion.find({
      estado: { $in: ['nuevo', 'en_revision', 'en_desarrollo'] }
    })
      .sort({ prioridad_usuario: -1, fecha_creacion: -1 })
      .limit(50);

    const resumen = {
      generado_en: new Date().toISOString(),
      total_activos: activos.length,
      por_estado: {
        nuevo: activos.filter(r => r.estado === 'nuevo').length,
        en_revision: activos.filter(r => r.estado === 'en_revision').length,
        en_desarrollo: activos.filter(r => r.estado === 'en_desarrollo').length
      },
      tickets: activos.map(r => ({
        folio: r.folio,
        tipo: r.tipo,
        modulo: r.modulo_afectado,
        estado: r.estado,
        prioridad_usuario: r.prioridad_usuario,
        prioridad_tecnica: r.prioridad_tecnica,
        sprint: r.sprint_asignado,
        resumen: r.respuestas_usuario?.descripcion?.slice(0, 120) || '',
        notas_dev: r.notas_dev
      }))
    };

    successResponse(res, resumen);
  } catch (error) {
    console.error('[situacionalController.contextoDev]', error);
    internalErrorResponse(res, 'Error al generar contexto de desarrollo');
  }
};
