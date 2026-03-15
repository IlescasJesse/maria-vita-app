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
import path from 'path';
import fs from 'fs';
import { connectDatabases, disconnectDatabases, checkDatabasesHealth } from './config/database';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

const environment = process.env.NODE_ENV || 'development';

// Cargar variables de entorno en un orden compatible con desarrollo y producción.
const candidateEnvFiles = [
  `.env.${environment}.local`,
  '.env.local',
  `.env.${environment}`,
  '.env'
];

const possiblePaths = candidateEnvFiles.flatMap((fileName) => ([
  path.join(__dirname, `../../${fileName}`),
  path.join(__dirname, `../../../${fileName}`),
  path.resolve(fileName),
  path.resolve(process.cwd(), fileName)
]));

let envLoaded = false;
for (const envPath of possiblePaths) {
  if (fs.existsSync(envPath)) {
    console.log(`[ENV] Loading from: ${envPath}`);
    config({ path: envPath, override: false });
    envLoaded = true;
  }
}

if (!envLoaded) {
  console.warn(`[ENV] ⚠ No se encontró archivo .env para entorno ${environment}`);
  config(); // Fallback to default behavior
}

console.log(`[ENV] REPLICATE_API_TOKEN: ${process.env.REPLICATE_API_TOKEN ? '✓ configured' : '✗ NOT configured'}`);

// ============================================
// CONFIGURACIÓN DEL SERVIDOR
// ============================================

const app: Application = express();
const PORT = process.env.BACKEND_PORT || 5000;
const HOST = process.env.BACKEND_HOST || '0.0.0.0';
const isDevelopment = environment === 'development';

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  allowedOrigins.push(
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://0.0.0.0:3000'
  );
}

const isPrivateIpv4Host = (host: string) => {
  if (/^10\./.test(host)) return true;
  if (/^192\.168\./.test(host)) return true;

  const match = host.match(/^172\.(\d{1,3})\./);
  if (!match) return false;

  const secondOctet = Number(match[1]);
  return secondOctet >= 16 && secondOctet <= 31;
};

const isDevelopmentOriginAllowed = (origin: string) => {
  if (!isDevelopment) {
    return false;
  }

  try {
    const parsedOrigin = new URL(origin);
    const { hostname, port, protocol } = parsedOrigin;

    const isHttpProtocol = protocol === 'http:' || protocol === 'https:';
    const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
    const isLanHost = isPrivateIpv4Host(hostname);
    const isCommonDevPort = port === '' || port === '3000' || port === '3001';

    return isHttpProtocol && isCommonDevPort && (isLocalHost || isLanHost);
  } catch {
    return false;
  }
};

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
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    if (isDevelopmentOriginAllowed(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
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
    app.listen(Number(PORT), HOST, () => {
      console.log(`✅ Servidor backend corriendo en http://${HOST}:${PORT}`);
      console.log(`📊 Environment: ${environment}`);
      console.log(`🌐 Orígenes permitidos: ${allowedOrigins.join(', ')}`);
      console.log(`🔗 Health check: http://${HOST}:${PORT}/health`);
      console.log(`📡 API base: http://${HOST}:${PORT}/api`);
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
