/**
 * Configuración de Rutas del Backend
 * 
 * Centraliza todas las rutas de la API
 */

import { Router } from 'express';
import authRoutes from './authRoutes';
import specialistRoutes from './specialistRoutes';
import studyRequestRoutes from './studyRequestRoutes';

const router = Router();

// ============================================
// INFORMACIÓN DE LA API
// ============================================

/**
 * Endpoint de información general de la API
 */
router.get('/', (req, res) => {
  res.json({
    message: 'API de Maria Vita',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      specialists: '/api/specialists',
      appointments: '/api/appointments',
      studyRequests: '/api/study-requests',
      studyCatalog: '/api/study-catalog',
      users: '/api/users'
    },
    documentation: 'https://docs.mariavita.com'
  });
});

// ============================================
// MONTAR RUTAS DE MÓDULOS
// ============================================

// Módulo de Autenticación
router.use('/auth', authRoutes);

// Módulo de Especialistas
router.use('/specialists', specialistRoutes);

// Módulo de Solicitudes de Estudios
router.use('/study-requests', studyRequestRoutes);

// Módulo de Agenda (placeholder para futura implementación)
// router.use('/appointments', appointmentRoutes);

// Módulo de Catálogo de Estudios (placeholder)
// router.use('/study-catalog', studyCatalogRoutes);

// Módulo de Autenticación (placeholder)
// router.use('/auth', authRoutes);

// Módulo de Usuarios (placeholder)
// router.use('/users', userRoutes);

// ============================================
// EXPORTACIÓN
// ============================================

export default router;
