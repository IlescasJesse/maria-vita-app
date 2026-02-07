/**
 * Rutas de Contacto
 */

import { Router } from 'express';
import { sendContactMessage } from '../controllers/contactController';
import { validateRequest } from '../middlewares/validator';
import { z } from 'zod';

const router = Router();

// Schema de validación para mensaje de contacto
const contactMessageSchema = z.object({
  name: z.string().min(2, 'Nombre muy corto').max(100, 'Nombre muy largo'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Teléfono inválido'),
  subject: z.string().min(3, 'Asunto muy corto').max(200, 'Asunto muy largo'),
  message: z.string().min(10, 'Mensaje muy corto').max(5000, 'Mensaje muy largo')
});

/**
 * POST /api/contact/send
 * Envía un mensaje de contacto
 */
router.post('/send', validateRequest(contactMessageSchema), sendContactMessage);

export default router;
