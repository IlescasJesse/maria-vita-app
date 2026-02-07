#!/bin/bash

# ============================================
# Script para Reiniciar Maria Vita
# Para Ubuntu Server
# ============================================

echo "🔄 Reiniciando servicios de Maria Vita..."
echo ""

# Detener servicios
./stop.sh

echo ""
echo "⏳ Esperando 2 segundos..."
sleep 2
echo ""

# Iniciar servicios sin rebuild
echo "▶️  Iniciando servicios..."

# Iniciar backend
nohup npm run backend > /var/log/mariavita-backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend iniciado (PID: $BACKEND_PID)"
echo $BACKEND_PID > /var/run/mariavita-backend.pid

sleep 3

# Iniciar frontend
nohup npm start > /var/log/mariavita-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"
echo $FRONTEND_PID > /var/run/mariavita-frontend.pid

echo ""
echo "✅ Servicios reiniciados exitosamente"
echo ""
echo "📊 Estado:"
echo "   Frontend: http://localhost:3000 (PID: $FRONTEND_PID)"
echo "   Backend:  http://localhost:4000 (PID: $BACKEND_PID)"
echo ""
