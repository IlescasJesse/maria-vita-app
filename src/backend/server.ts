/**
 * Servidor Express para el Backend de Maria Vita
 * 
 * Configura y arranca el servidor backend con todas sus dependencias
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { connectDatabases, disconnectDatabases, checkDatabasesHealth } from './config/database';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

// Cargar variables de entorno
config();

// ============================================
// CONFIGURACIÓN DEL SERVIDOR
// ============================================

const app: Application = express();
const PORT = process.env.BACKEND_PORT || 5000;

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// Seguridad con Helmet
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production',
  crossOriginEmbedderPolicy: false
}));

// CORS para permitir requests desde el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parseo de JSON y URL-encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging de requests en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ============================================
// RUTAS DE SALUD Y ESTADO
// ============================================

/**
 * Endpoint de health check
 * Verifica que el servidor esté corriendo y las bases de datos conectadas
 */
app.get('/health', async (_req, res) => {
  try {
    const dbHealth = await checkDatabasesHealth();
    
    res.json({
      status: dbHealth.overall ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        api: 'online',
        mysql: dbHealth.mysql ? 'connected' : 'disconnected',
        mongodb: dbHealth.mongodb ? 'connected' : 'disconnected'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Error al verificar estado de servicios'
    });
  }
});

/**
 * Endpoint raíz
 */
app.get('/', (_req, res) => {
  res.json({
    message: 'API de Maria Vita - Sistema Médico Híbrido',
    version: '1.0.0',
    status: 'online',
    documentation: '/api/docs'
  });
});

// ============================================
// RUTAS DE LA API
// ============================================

// Montar todas las rutas bajo el prefijo /api
app.use('/api', routes);

// ============================================
// MANEJO DE ERRORES
// ============================================

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Ruta ${req.originalUrl} no encontrada`
    }
  });
});

// Middleware de manejo centralizado de errores
app.use(errorHandler);

// ============================================
// INICIALIZACIÓN DEL SERVIDOR
// ============================================

/**
 * Función para iniciar el servidor
 * Conecta las bases de datos antes de escuchar requests
 */
async function startServer(): Promise<void> {
  try {
    console.log('🚀 Iniciando servidor Maria Vita...');
    
    // Conectar bases de datos
    await connectDatabases();
    
    // Iniciar servidor HTTP
    app.listen(PORT, () => {
      console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📡 API base: http://localhost:${PORT}/api`);
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// ============================================
// MANEJO DE CIERRE GRACEFUL
// ============================================

/**
 * Función para cerrar el servidor de manera limpia
 */
async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`\n⚠️ Señal de cierre recibida (${signal})`);
  console.log('🔌 Cerrando conexiones...');
  
  try {
    await disconnectDatabases();
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al cerrar el servidor:', error);
    process.exit(1);
  }
}

// Escuchar señales de terminación
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Capturar errores no manejados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', promise);
  console.error('Razón:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error);
  gracefulShutdown('uncaughtException');
});

// ============================================
// INICIAR SERVIDOR
// ============================================

// Solo iniciar si este archivo se ejecuta directamente
if (require.main === module) {
  startServer();
}

// Exportar app para testing
export default app;
