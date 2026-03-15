#!/bin/bash

set -euo pipefail

# ============================================
# Script para Reiniciar Maria Vita
# Para Ubuntu Server
# ============================================

PROJECT_DIR="/var/www/maria-vita-app"
ENV_FILE=".env.production"
BACKEND_PORT_DEFAULT=5000
FRONTEND_PORT_DEFAULT=3000

echo "🔄 Reiniciando servicios de Maria Vita..."
echo ""

cd "$PROJECT_DIR" || { echo "❌ Error: No se encuentra el directorio del proyecto"; exit 1; }

BACKEND_PORT=$(grep -E '^BACKEND_PORT=' "$ENV_FILE" 2>/dev/null | tail -n 1 | cut -d '=' -f2- | tr -d '"' | tr -d "'" | xargs)
FRONTEND_PORT=$(grep -E '^PORT=' "$ENV_FILE" 2>/dev/null | tail -n 1 | cut -d '=' -f2- | tr -d '"' | tr -d "'" | xargs)

BACKEND_PORT=${BACKEND_PORT:-$BACKEND_PORT_DEFAULT}
FRONTEND_PORT=${FRONTEND_PORT:-$FRONTEND_PORT_DEFAULT}

# Detener servicios
./stop.sh

echo ""
echo "⏳ Esperando 2 segundos..."
sleep 2
echo ""

# Iniciar servicios sin rebuild
echo "▶️  Iniciando servicios..."

# Iniciar backend
nohup env NODE_ENV=production npm run backend:start > /var/log/mariavita-backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend iniciado (PID: $BACKEND_PID)"
echo $BACKEND_PID > /var/run/mariavita-backend.pid

sleep 3

# Iniciar frontend
nohup env NODE_ENV=production PORT=$FRONTEND_PORT npm start > /var/log/mariavita-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"
echo $FRONTEND_PID > /var/run/mariavita-frontend.pid

echo ""
echo "✅ Servicios reiniciados exitosamente"
echo ""
echo "📊 Estado:"
echo "   Frontend: http://localhost:$FRONTEND_PORT (PID: $FRONTEND_PID)"
echo "   Backend:  http://localhost:$BACKEND_PORT (PID: $BACKEND_PID)"
echo ""
