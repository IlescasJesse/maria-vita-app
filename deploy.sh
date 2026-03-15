#!/bin/bash

set -euo pipefail

# ============================================
# Script de Deployment - Maria Vita
# Para Ubuntu Server
# ============================================

PROJECT_DIR="/var/www/maria-vita-app"
ENV_FILE=".env.production"
BACKEND_PORT_DEFAULT=5000
FRONTEND_PORT_DEFAULT=3000

echo "🚀 Iniciando deployment de Maria Vita..."
echo ""

# 1. Ir al directorio del proyecto
echo "📁 Navegando al directorio del proyecto..."
cd "$PROJECT_DIR" || { echo "❌ Error: No se encuentra el directorio del proyecto"; exit 1; }

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Falta $ENV_FILE en $PROJECT_DIR"
    echo "   Crea el archivo a partir de .env.production.example antes de ejecutar el deploy."
    exit 1
fi

# 2. Pull de los últimos cambios
echo "⬇️  Descargando últimos cambios de GitHub..."
git pull origin main

# 3. Instalar/actualizar dependencias
echo "📦 Instalando dependencias..."
npm ci || { echo "❌ Error instalando dependencias"; exit 1; }

# 4. Regenerar cliente de Prisma
echo "🔧 Regenerando cliente de Prisma..."
npx prisma generate || { echo "❌ Error generando cliente de Prisma"; exit 1; }

# 5. Ejecutar migraciones de base de datos
echo "🗄️  Aplicando migraciones de base de datos..."
npx prisma migrate deploy || { echo "❌ Error aplicando migraciones"; exit 1; }

# 6. Poblar base de datos solo si se solicita explícitamente
if [ "${RUN_SEEDER:-false}" = "true" ]; then
    echo "🌱 Poblando base de datos..."
    npx prisma db seed
else
    echo "⏭️  Seeder omitido (usa RUN_SEEDER=true ./deploy.sh si lo necesitas)"
fi

# 7. Construir el proyecto Next.js para producción
echo "🏗️  Construyendo aplicación Next.js..."
npm run build || { echo "❌ Error construyendo la aplicación"; exit 1; }

# 8. Detener procesos existentes
echo "🛑 Deteniendo procesos existentes..."

# Detener por PID si existen archivos
if [ -f /var/run/mariavita-backend.pid ]; then
    BACKEND_OLD_PID=$(cat /var/run/mariavita-backend.pid)
    kill $BACKEND_OLD_PID 2>/dev/null && echo "   Backend detenido (PID: $BACKEND_OLD_PID)" || true
    rm /var/run/mariavita-backend.pid
fi

if [ -f /var/run/mariavita-frontend.pid ]; then
    FRONTEND_OLD_PID=$(cat /var/run/mariavita-frontend.pid)
    kill $FRONTEND_OLD_PID 2>/dev/null && echo "   Frontend detenido (PID: $FRONTEND_OLD_PID)" || true
    rm /var/run/mariavita-frontend.pid
fi

# Forzar detención de cualquier proceso que quede
pkill -f "next start" 2>/dev/null || true
pkill -f "next-server" 2>/dev/null || true
pkill -f "npm run backend:start" 2>/dev/null || true
pkill -f "ts-node.*server.ts" 2>/dev/null || true

# Esperar a que los procesos terminen
sleep 2

BACKEND_PORT=$(grep -E '^BACKEND_PORT=' "$ENV_FILE" | tail -n 1 | cut -d '=' -f2- | tr -d '"' | tr -d "'" | xargs)
FRONTEND_PORT=$(grep -E '^PORT=' "$ENV_FILE" | tail -n 1 | cut -d '=' -f2- | tr -d '"' | tr -d "'" | xargs)

BACKEND_PORT=${BACKEND_PORT:-$BACKEND_PORT_DEFAULT}
FRONTEND_PORT=${FRONTEND_PORT:-$FRONTEND_PORT_DEFAULT}

# 9. Iniciar servicios en background
echo "▶️  Iniciando servicios..."
echo ""

# Iniciar backend en background
echo "   Iniciando backend..."
nohup env NODE_ENV=production npm run backend:start > /var/log/mariavita-backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > /var/run/mariavita-backend.pid
echo "   ✅ Backend iniciado (PID: $BACKEND_PID)"

# Esperar a que el backend esté listo
echo "   ⏳ Esperando a que el backend inicie..."
sleep 5

# Iniciar frontend en background
echo "   Iniciando frontend..."
nohup env NODE_ENV=production PORT=$FRONTEND_PORT npm start > /var/log/mariavita-frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > /var/run/mariavita-frontend.pid
echo "   ✅ Frontend iniciado (PID: $FRONTEND_PID)"

# Esperar a que el frontend compile
echo "   ⏳ Esperando a que el frontend compile..."
sleep 5

# 10. Verificar que los servicios están corriendo
echo ""
echo "🔍 Verificando servicios..."
if ps -p $BACKEND_PID > /dev/null 2>&1; then
    echo "   ✅ Backend corriendo correctamente"
else
    echo "   ⚠️  Advertencia: Backend podría no estar corriendo. Revisa los logs."
fi

if ps -p $FRONTEND_PID > /dev/null 2>&1; then
    echo "   ✅ Frontend corriendo correctamente"
else
    echo "   ⚠️  Advertencia: Frontend podría no estar corriendo. Revisa los logs."
fi

echo ""
echo "═════════════════════════════════════════"
echo "✅ Deployment completado exitosamente!"
echo "═════════════════════════════════════════"
echo ""
echo "📊 Estado de los servicios:"
echo "   Frontend (Next.js): http://localhost:$FRONTEND_PORT (PID: $FRONTEND_PID)"
echo "   Backend (Express):  http://localhost:$BACKEND_PORT (PID: $BACKEND_PID)"
echo ""
echo "📝 Logs disponibles en:"
echo "   Frontend: /var/log/mariavita-frontend.log"
echo "   Backend:  /var/log/mariavita-backend.log"
echo ""
echo "🔍 Para ver logs en tiempo real:"
echo "   tail -f /var/log/mariavita-frontend.log"
echo "   tail -f /var/log/mariavita-backend.log"
echo ""
echo "📌 Comandos útiles:"
echo "   ./stop.sh    - Detener servicios"
echo "   ./restart.sh - Reiniciar servicios"
echo "   ./status.sh  - Ver estado de servicios"
echo ""
