@echo off
REM ============================================
REM Script de Deployment a VPS - Maria Vita
REM Para Windows (CMD/PowerShell)
REM ============================================

setlocal enabledelayedexpansion

REM ========== CONFIGURACIÓN ==========
set VPS_USER=tu_usuario
set VPS_HOST=tu_vps_ip
set VPS_PORT=22
set VPS_PATH=/var/www/maria-vita-app
set SSH_KEY=

REM ========== VALIDACIÓN ==========
if "%VPS_USER%"=="tu_usuario" (
    echo.
    echo ❌ ERROR: Debes configurar VPS_USER en el script
    echo.
    echo Edita las líneas de configuración con tu información:
    echo   - VPS_USER: usuario SSH del VPS
    echo   - VPS_HOST: IP o dominio del VPS
    echo   - VPS_PATH: ruta del proyecto en el VPS
    echo   - SSH_KEY: (opcional) ruta a clave privada
    echo.
    pause
    exit /b 1
)

if "%VPS_HOST%"=="tu_vps_ip" (
    echo.
    echo ❌ ERROR: Debes configurar VPS_HOST en el script
    echo.
    pause
    exit /b 1
)

echo.
echo 🚀 Iniciando deployment a VPS...
echo    Usuario:  %VPS_USER%
echo    Host:     %VPS_HOST%
echo    Puerto:   %VPS_PORT%
echo    Ruta:     %VPS_PATH%
echo.
echo 📡 Ejecutando en el servidor remoto...
echo.

REM ========== CONSTRUIR Y EJECUTAR SSH ==========
if "%SSH_KEY%"=="" (
    ssh -p %VPS_PORT% %VPS_USER%@%VPS_HOST% "cd %VPS_PATH% && bash deploy.sh"
) else (
    ssh -i "%SSH_KEY%" -p %VPS_PORT% %VPS_USER%@%VPS_HOST% "cd %VPS_PATH% && bash deploy.sh"
)

if %errorlevel% equ 0 (
    echo.
    echo ═════════════════════════════════════════
    echo ✅ Deployment completado exitosamente!
    echo ═════════════════════════════════════════
    echo.
    echo 🌐 Acceso:
    echo    Frontend: http://%VPS_HOST%:3000
    echo    Backend:  http://%VPS_HOST%:5000
    echo.
) else (
    echo.
    echo ❌ El deployment falló con código: %errorlevel%
    echo.
    echo 💡 Verifica:
    echo    - SSH esté disponible en tu system
    echo    - Las credenciales SSH sean correctas
    echo    - El host sea accesible
    echo.
    pause
    exit /b %errorlevel%
)

pause
