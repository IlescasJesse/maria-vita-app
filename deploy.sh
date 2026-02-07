#!/bin/bash

# ============================================
# Script de Deployment - Maria Vita
# Para Ubuntu Server
# ============================================

set -e  # Detener si hay error

echo "🚀 Iniciando deployment de Maria Vita..."
echo ""

# 1. Ir al directorio del proyecto
echo "📁 Navegando al directorio del proyecto..."
cd /var/www/maria-vita-app

# 2. Pull de los últimos cambios
echo "⬇️  Descargando últimos cambios de GitHub..."
git pull origin main

# 3. Instalar/actualizar dependencias
echo "📦 Instalando dependencias..."
npm install --legacy-peer-deps

# 4. Regenerar cliente de Prisma
echo "🔧 Regenerando cliente de Prisma..."
npx prisma generate

# 5. Ejecutar migraciones de base de datos
echo "🗄️  Aplicando migraciones de base de datos..."
npx prisma migrate deploy

# 6. Poblar base de datos con usuarios de prueba (opcional)
read -p "¿Deseas ejecutar el seeder? (s/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]
then
    echo "🌱 Poblando base de datos..."
    npx prisma db seed
fi

# 7. Construir el proyecto Next.js para producción
echo "🏗️  Construyendo aplicación Next.js..."
npm run build

# 8. Detener procesos existentes
echo "🛑 Deteniendo procesos existentes..."
pkill -f "next start" || true
pkill -f "node.*server.ts" || true
pkill -f "ts-node.*server.ts" || true

# 9. Iniciar servicios en background
echo "▶️  Iniciando servicios..."

# Iniciar backend en background
nohup npm run backend > /var/log/mariavita-backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend iniciado (PID: $BACKEND_PID)"

# Esperar 3 segundos para que el backend inicie
sleep 3

# Iniciar frontend en background
nohup npm start > /var/log/mariavita-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"

# Guardar PIDs para futuras referencias
echo $BACKEND_PID > /var/run/mariavita-backend.pid
echo $FRONTEND_PID > /var/run/mariavita-frontend.pid

echo ""
echo "═════════════════════════════════════════"
echo "✅ Deployment completado exitosamente!"
echo "═════════════════════════════════════════"
echo ""
echo "📊 Estado de los servicios:"
echo "   Frontend (Next.js): http://localhost:3000 (PID: $FRONTEND_PID)"
echo "   Backend (Express):  http://localhost:4000 (PID: $BACKEND_PID)"
echo ""
echo "📝 Logs disponibles en:"
echo "   Frontend: /var/log/mariavita-frontend.log"
echo "   Backend:  /var/log/mariavita-backend.log"
echo ""
echo "🔍 Para ver logs en tiempo real:"
echo "   tail -f /var/log/mariavita-frontend.log"
echo "   tail -f /var/log/mariavita-backend.log"
echo ""
