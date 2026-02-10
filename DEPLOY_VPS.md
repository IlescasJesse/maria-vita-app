# 🚀 Deploy a VPS - Maria Vita

Hay dos scripts disponibles para hacer deploy desde tu máquina local al VPS:

## 📋 Scripts Disponibles

### 1. **PowerShell** (`deploy-to-vps.ps1`) ✅ Recomendado
```powershell
.\deploy-to-vps.ps1
```

### 2. **Batch** (`deploy-to-vps.bat`)
```cmd
deploy-to-vps.bat
```

## ⚙️ Configuración Requerida

Ambos scripts necesitan que configures estos valores:

### **deploy-to-vps.ps1** (líneas 7-11)
```powershell
$VPS_USER = "tu_usuario"           # Cambiar: usuario SSH (ej: root, ubuntu)
$VPS_HOST = "tu_vps_ip"            # Cambiar: IP o dominio (ej: 192.168.1.100)
$VPS_PORT = 22                     # Puerto SSH (22 es default)
$VPS_PATH = "/var/www/maria-vita-app"  # Ruta del proyecto
$SSH_KEY = $null                   # (Opcional) Ruta a clave privada
```

### **deploy-to-vps.bat** (líneas 7-11)
```batch
set VPS_USER=tu_usuario
set VPS_HOST=tu_vps_ip
set VPS_PORT=22
set VPS_PATH=/var/www/maria-vita-app
set SSH_KEY=
```

## 🔐 Opciones de Autenticación

### Opción A: Contraseña SSH (más fácil)
1. Edita el script y deja `SSH_KEY` vacío
2. Ejecuta el script
3. Se te pedirá contraseña SSH

```powershell
# En deploy-to-vps.ps1
$SSH_KEY = $null    # ← Dejar así
```

### Opción B: Clave SSH (más seguro)
1. Genera una clave SSH si no tienes:
   ```bash
   ssh-keygen -t rsa -b 4096 -f "$HOME\.ssh\id_rsa"
   ```

2. Copia la clave pública al VPS:
   ```bash
   ssh-copy-id -i $HOME\.ssh\id_rsa.pub usuario@vps_ip
   ```

3. Configura la ruta en el script:
   ```powershell
   # En deploy-to-vps.ps1
   $SSH_KEY = "$HOME\.ssh\id_rsa"
   ```

## 📝 Ejemplo de Configuración Completa

### Caso 1: VPS con usuario `root` y IP `192.168.1.100`
```powershell
$VPS_USER = "root"
$VPS_HOST = "192.168.1.100"
$VPS_PORT = 22
$VPS_PATH = "/var/www/maria-vita-app"
$SSH_KEY = "$HOME\.ssh\mi_clave_vps"
```

### Caso 2: VPS con dominio y usuario `ubuntu`
```powershell
$VPS_USER = "ubuntu"
$VPS_HOST = "mariavita.com"
$VPS_PORT = 2222  # Puerto SSH custom
$VPS_PATH = "/home/ubuntu/maria-vita-app"
$SSH_KEY = $null  # Usar contraseña
```

## ✅ Qué hace el script

El script ejecuta automáticamente en el VPS:

1. ✅ Descarga últimos cambios (`git pull origin main`)
2. ✅ Instala dependencias (`npm install`)
3. ✅ Regenera cliente Prisma
4. ✅ Ejecuta migraciones de BD
5. ✅ Pregunta si ejecutar seeder (datos de prueba)
6. ✅ Construye Next.js para producción
7. ✅ Detiene servicios anteriores
8. ✅ Inicia Frontend + Backend en background
9. ✅ Guarda logs en `/var/log/`

## 📊 Acceso Después del Deploy

Después de ejecutar, accede a:
- **Frontend**: http://tu_vps_ip:3000
- **Backend**: http://tu_vps_ip:5000

## 📝 Ver Logs

En el VPS, puedes ver los logs en tiempo real:

```bash
# Frontend
tail -f /var/log/mariavita-frontend.log

# Backend
tail -f /var/log/mariavita-backend.log

# Ambos
tail -f /var/log/mariavita-*.log
```

## 🐛 Troubleshooting

### "ssh: command not found"
- **Windows**: Instala OpenSSH o usa WSL2
- **Mac/Linux**: Generalmente ya incluido

### "Permission denied (publickey, password)"
Verifica:
```bash
# Test SSH connection
ssh -p 22 usuario@vps_ip "echo 'SSH funciona'"
```

### "Deployment failed"
Revisa los logs en el VPS:
```bash
cat /var/log/mariavita-backend.log
cat /var/log/mariavita-frontend.log
```

## 🚀 Uso Rápido

### PowerShell
```powershell
# 1. Edita el script con tus datos
code .\deploy-to-vps.ps1

# 2. Ejecuta
.\deploy-to-vps.ps1
```

### CMD/Batch
```cmd
# 1. Edita el script
notepad deploy-to-vps.bat

# 2. Ejecuta
deploy-to-vps.bat
```

---

**¿Necesitas ayuda con la configuración? Dame:**
- Usuario SSH del VPS
- IP o dominio
- Puerto SSH (si es diferente a 22)
- Ruta del proyecto en el VPS
