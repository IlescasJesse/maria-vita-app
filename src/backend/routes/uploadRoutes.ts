/**
 * Rutas para manejo de uploads y generación con IA
 */

import express from 'express';
import { generateProfilePhoto, uploadProfilePhoto, enhanceProfilePhoto } from '../controllers/uploadController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// Middleware de autenticación para todas las rutas
router.use(authenticate);

/**
 * POST /api/upload/generate-profile-photo
 * Genera una foto de perfil usando IA
 */
router.post('/generate-profile-photo', generateProfilePhoto);

/**
 * POST /api/upload/profile-photo
 * Sube una foto de perfil enviada por el usuario
 */
router.post('/profile-photo', uploadProfilePhoto);

/**
 * POST /api/upload/enhance-profile-photo
 * Mejora una foto de perfil usando IA
 */
router.post('/enhance-profile-photo', enhanceProfilePhoto);

export default router;
