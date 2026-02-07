/**
 * Configuración de Base de Datos Híbrida para Maria Vita
 * 
 * Este archivo maneja las conexiones a MySQL (Prisma) y MongoDB (Mongoose)
 * de manera simultánea para soportar el modelo híbrido del sistema
 */

import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

// ============================================
// CONFIGURACIÓN DE MYSQL CON PRISMA
// ============================================

/**
 * Cliente de Prisma para interactuar con MySQL
 * Singleton para evitar múltiples instancias en desarrollo
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/**
 * Conecta a la base de datos MySQL usando Prisma
 * Maneja la conexión y muestra logs informativos
 */
export async function connectMySQL(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('✅ Conexión exitosa a MySQL (Prisma)');
    
    // Verificar que la conexión esté activa
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ MySQL está respondiendo correctamente');
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error);
    throw error;
  }
}

/**
 * Desconecta de MySQL de manera limpia
 * Debe llamarse al cerrar la aplicación
 */
export async function disconnectMySQL(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('🔌 Desconectado de MySQL');
  } catch (error) {
    console.error('❌ Error al desconectar de MySQL:', error);
    throw error;
  }
}

// ============================================
// CONFIGURACIÓN DE MONGODB CON MONGOOSE
// ============================================

/**
 * URI de conexión a MongoDB desde variables de entorno
 */
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mariavita';

/**
 * Opciones de configuración para Mongoose
 */
const mongooseOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

/**
 * Conecta a MongoDB usando Mongoose
 * Incluye manejo de eventos y reconexión automática
 */
export async function connectMongoDB(): Promise<void> {
  try {
    // Evitar múltiples conexiones en desarrollo (Next.js Hot Reload)
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB ya está conectado');
      return;
    }

    await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log('✅ Conexión exitosa a MongoDB');

    // Eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error en conexión de MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB desconectado');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
    });

  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error);
    throw error;
  }
}

/**
 * Desconecta de MongoDB de manera limpia
 */
export async function disconnectMongoDB(): Promise<void> {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('🔌 Desconectado de MongoDB');
    }
  } catch (error) {
    console.error('❌ Error al desconectar de MongoDB:', error);
    throw error;
  }
}

// ============================================
// FUNCIÓN PRINCIPAL DE CONEXIÓN
// ============================================

/**
 * Conecta ambas bases de datos (MySQL y MongoDB)
 * Esta es la función principal que debe llamarse al iniciar el servidor
 */
export async function connectDatabases(): Promise<void> {
  console.log('🔌 Iniciando conexiones a bases de datos...');
  
  try {
    // Conectar en paralelo para mejor rendimiento
    await Promise.all([
      connectMySQL(),
      connectMongoDB()
    ]);
    
    console.log('✅ Todas las bases de datos conectadas exitosamente');
  } catch (error) {
    console.error('❌ Error al conectar bases de datos:', error);
    throw error;
  }
}

/**
 * Desconecta ambas bases de datos de manera limpia
 * Debe llamarse al cerrar la aplicación
 */
export async function disconnectDatabases(): Promise<void> {
  console.log('🔌 Cerrando conexiones a bases de datos...');
  
  try {
    await Promise.all([
      disconnectMySQL(),
      disconnectMongoDB()
    ]);
    
    console.log('✅ Todas las conexiones cerradas correctamente');
  } catch (error) {
    console.error('❌ Error al cerrar conexiones:', error);
    throw error;
  }
}

/**
 * Verifica el estado de salud de ambas bases de datos
 * Útil para health checks y monitoreo
 */
export async function checkDatabasesHealth(): Promise<{
  mysql: boolean;
  mongodb: boolean;
  overall: boolean;
}> {
  const health = {
    mysql: false,
    mongodb: false,
    overall: false
  };

  // Verificar MySQL
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.mysql = true;
  } catch (error) {
    console.error('MySQL health check falló:', error);
  }

  // Verificar MongoDB
  try {
    health.mongodb = mongoose.connection.readyState === 1;
  } catch (error) {
    console.error('MongoDB health check falló:', error);
  }

  health.overall = health.mysql && health.mongodb;
  return health;
}

// ============================================
// MANEJO DE CIERRE GRACEFUL
// ============================================

/**
 * Configura el cierre limpio de conexiones al terminar el proceso
 * Importante para evitar conexiones colgadas
 */
process.on('SIGINT', async () => {
  console.log('\n⚠️ Señal de cierre recibida (SIGINT)');
  await disconnectDatabases();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️ Señal de cierre recibida (SIGTERM)');
  await disconnectDatabases();
  process.exit(0);
});
