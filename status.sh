#!/bin/bash

# ============================================
# Script para Ver Estado de Maria Vita
# Para Ubuntu Server
# ============================================

echo "📊 Estado de Servicios - Maria Vita"
echo "═══════════════════════════════════════════"
echo ""

# Verificar Frontend
if [ -f /var/run/mariavita-frontend.pid ]; then
    FRONTEND_PID=$(cat /var/run/mariavita-frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "✅ Frontend: ACTIVO (PID: $FRONTEND_PID)"
        echo "   URL: http://localhost:3000"
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
        echo "   URL: http://localhost:4000"
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
