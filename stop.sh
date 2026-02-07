#!/bin/bash

# ============================================
# Script para Detener Maria Vita
# Para Ubuntu Server
# ============================================

echo "🛑 Deteniendo servicios de Maria Vita..."

# Leer PIDs guardados
if [ -f /var/run/mariavita-backend.pid ]; then
    BACKEND_PID=$(cat /var/run/mariavita-backend.pid)
    kill $BACKEND_PID 2>/dev/null && echo "✅ Backend detenido (PID: $BACKEND_PID)" || echo "⚠️  Backend no estaba corriendo"
    rm /var/run/mariavita-backend.pid
fi

if [ -f /var/run/mariavita-frontend.pid ]; then
    FRONTEND_PID=$(cat /var/run/mariavita-frontend.pid)
    kill $FRONTEND_PID 2>/dev/null && echo "✅ Frontend detenido (PID: $FRONTEND_PID)" || echo "⚠️  Frontend no estaba corriendo"
    rm /var/run/mariavita-frontend.pid
fi

# Forzar detención de cualquier proceso restante
pkill -f "next start" && echo "✅ Procesos Next.js detenidos"
pkill -f "node.*server.ts" && echo "✅ Procesos Node detenidos"
pkill -f "ts-node.*server.ts" && echo "✅ Procesos TS-Node detenidos"

echo ""
echo "✅ Todos los servicios han sido detenidos"
