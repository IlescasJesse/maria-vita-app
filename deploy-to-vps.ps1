#!/usr/bin/env pwsh
# ============================================
# Script de Deployment a VPS - Maria Vita
# Ejecuta el deploy.sh en el servidor remoto
# ============================================

# ========== CONFIGURACIÓN ==========
$VPS_USER = "root"           # Cambiar: usuario SSH del VPS
$VPS_HOST = "74.208.250.52"            # Cambiar: IP o dominio del VPS
$VPS_PORT = 22                     # Cambiar si usas puerto diferente
$VPS_PATH = "/var/www/maria-vita-app"  # Ruta del proyecto en VPS
$SSH_KEY = $null              # Cambiar: ruta a clave privada, o dejar $null para contraseña

# ========== VALIDACIÓN ==========
if ($VPS_USER -eq "tu_usuario" -or $VPS_HOST -eq "tu_vps_ip") {
    Write-Host "❌ ERROR: Debes configurar VPS_USER y VPS_HOST en el script" -ForegroundColor Red
    Write-Host ""
    Write-Host "Edita las líneas de configuración arriba con tu información del VPS:"
    Write-Host "  - VPS_USER: usuario SSH (ej: root, ubuntu, deploy)"
    Write-Host "  - VPS_HOST: IP o dominio (ej: 192.168.1.100, tu-vps.com)"
    Write-Host "  - VPS_PATH: ruta del proyecto (ej: /var/www/maria-vita-app)"
    Write-Host "  - SSH_KEY: ruta a clave privada (ej: C:\Users\tu_usuario\.ssh\id_rsa)"
    exit 1
}

Write-Host "🚀 Iniciando deployment a VPS..." -ForegroundColor Green
Write-Host "   Usuario:  $VPS_USER"
Write-Host "   Host:     $VPS_HOST"
Write-Host "   Puerto:   $VPS_PORT"
Write-Host "   Ruta:     $VPS_PATH"
Write-Host ""

# ========== CONSTRUIR COMANDO SSH ==========
$SSH_CMD = "ssh"
if ($SSH_KEY -and (Test-Path $SSH_KEY)) {
    $SSH_CMD = "$SSH_CMD -i `"$SSH_KEY`""
}
if ($VPS_PORT -ne 22) {
    $SSH_CMD = "$SSH_CMD -p $VPS_PORT"
}

$REMOTE_CMD = "cd $VPS_PATH && bash deploy.sh"
$FULL_CMD = "$SSH_CMD $VPS_USER@$VPS_HOST `"$REMOTE_CMD`""

Write-Host "📡 Ejecutando en el servidor remoto..." -ForegroundColor Cyan
Write-Host ""

# ========== EJECUTAR DEPLOY ==========
try {
    if ($SSH_KEY -and (Test-Path $SSH_KEY)) {
        Invoke-Expression $FULL_CMD
    } else {
        # Sin clave SSH, asked contraseña
        Write-Host "🔑 Se solicitará contraseña SSH..." -ForegroundColor Yellow
        Invoke-Expression $FULL_CMD
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "═════════════════════════════════════════" -ForegroundColor Green
        Write-Host "✅ Deployment completado exitosamente!" -ForegroundColor Green
        Write-Host "═════════════════════════════════════════" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Acceso:"
        Write-Host "   Frontend: http://$VPS_HOST:3000"
        Write-Host "   Backend:  http://$VPS_HOST:5000"
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ El deployment falló con código de error: $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}
catch {
    Write-Host ""
    Write-Host "❌ Error al conectar con el VPS:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Verifica:"
    Write-Host "   - SSH esté habilitado en el VPS"
    Write-Host "   - Credenciales SSH sean correctas"
    Write-Host "   - El host sea accesible: try 'ssh $VPS_USER@$VPS_HOST -p $VPS_PORT'"
    exit 1
}
