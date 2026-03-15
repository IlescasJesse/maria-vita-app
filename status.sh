#!/bin/bash

# ============================================
# Script para Ver Estado de Maria Vita
# Para Ubuntu Server
# ============================================

PROJECT_DIR="/var/www/maria-vita-app"
ENV_FILE="$PROJECT_DIR/.env.production"
BACKEND_PORT_DEFAULT=5000
FRONTEND_PORT_DEFAULT=3000

BACKEND_PORT=$(grep -E '^BACKEND_PORT=' "$ENV_FILE" 2>/dev/null | tail -n 1 | cut -d '=' -f2- | tr -d '"' | tr -d "'" | xargs)
FRONTEND_PORT=$(grep -E '^PORT=' "$ENV_FILE" 2>/dev/null | tail -n 1 | cut -d '=' -f2- | tr -d '"' | tr -d "'" | xargs)

BACKEND_PORT=${BACKEND_PORT:-$BACKEND_PORT_DEFAULT}
FRONTEND_PORT=${FRONTEND_PORT:-$FRONTEND_PORT_DEFAULT}

echo "📊 Estado de Servicios - Maria Vita"
echo "═══════════════════════════════════════════"
echo ""

if command -v pm2 >/dev/null 2>&1; then
    if pm2 describe maria-vita-frontend >/dev/null 2>&1; then
        FRONTEND_PM2_PID=$(pm2 pid maria-vita-frontend)
        echo "✅ Frontend (PM2): ACTIVO (PID: $FRONTEND_PM2_PID)"
        echo "   URL: http://localhost:$FRONTEND_PORT"
    else
        echo "❌ Frontend (PM2): INACTIVO"
    fi

    echo ""

    if pm2 describe maria-vita-backend >/dev/null 2>&1; then
        BACKEND_PM2_PID=$(pm2 pid maria-vita-backend)
        echo "✅ Backend (PM2): ACTIVO (PID: $BACKEND_PM2_PID)"
        echo "   URL: http://localhost:$BACKEND_PORT"
    else
        echo "❌ Backend (PM2): INACTIVO"
    fi

    echo ""
    echo "═══════════════════════════════════════════"
    echo ""
    echo "🔍 Estado PM2:" 
    pm2 status | head -20
    echo ""
    echo "📝 Últimas líneas de logs (PM2):"
    echo ""
    echo "Frontend (últimas 3 líneas):"
    pm2 logs maria-vita-frontend --lines 3 --nostream 2>/dev/null || echo "   No hay logs disponibles"
    echo ""
    echo "Backend (últimas 3 líneas):"
    pm2 logs maria-vita-backend --lines 3 --nostream 2>/dev/null || echo "   No hay logs disponibles"
    echo ""
    exit 0
fi

# Verificar Frontend
if [ -f /var/run/mariavita-frontend.pid ]; then
    FRONTEND_PID=$(cat /var/run/mariavita-frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "✅ Frontend: ACTIVO (PID: $FRONTEND_PID)"
        echo "   URL: http://localhost:$FRONTEND_PORT"
    else
        echo "❌ Frontend: INACTIVO (PID guardado: $FRONTEND_PID no existe)"
    fi
else
    echo "❌ Frontend: INACTIVO (no hay PID guardado)"
fi

echo ""

# Verificar Backend
if [ -f /var/run/mariavita-backend.pid ]; then
    BACKEND_PID=$(cat /var/run/mariavita-backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "✅ Backend: ACTIVO (PID: $BACKEND_PID)"
        echo "   URL: http://localhost:$BACKEND_PORT"
    else
        echo "❌ Backend: INACTIVO (PID guardado: $BACKEND_PID no existe)"
    fi
else
    echo "❌ Backend: INACTIVO (no hay PID guardado)"
fi

echo ""
echo "═══════════════════════════════════════════"
echo ""

# Mostrar procesos relacionados
echo "🔍 Procesos Node.js activos:"
ps aux | grep -E "node|next|ts-node" | grep -v grep | head -5 || echo "   No se encontraron procesos"

echo ""
echo "📝 Últimas líneas de logs:"
echo ""
echo "Frontend (últimas 3 líneas):"
tail -n 3 /var/log/mariavita-frontend.log 2>/dev/null || echo "   No hay logs disponibles"
echo ""
echo "Backend (últimas 3 líneas):"
tail -n 3 /var/log/mariavita-backend.log 2>/dev/null || echo "   No hay logs disponibles"
echo ""
