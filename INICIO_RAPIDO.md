# 🚀 Guía de Inicio Rápido - Maria Vita

Esta guía te llevará desde la instalación hasta tener el sistema corriendo en menos de 10 minutos.

OBEJETIVO LITERAL: Sistema integral de gestión médica que combina tecnología moderna con atención personalizada para brindar el mejor servicio a nuestros pacientes.

## ✅ Checklist Pre-instalación

Antes de comenzar, asegúrate de tener:

- [ ] Node.js v18+ instalado
- [ ] MySQL v8.0+ corriendo
- [ ] MongoDB v6.0+ corriendo
- [ ] Un editor de código (VS Code recomendado)

## 📝 Pasos de Instalación

### Paso 1: Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

**Tiempo estimado**: 2-3 minutos
3
### Paso 2: Configurar Variables de Entorno

\`\`\`bash
# Copiar plantilla
cp .env.example .env.local

# Editar con tus credenciales
# En Windows: notepad .env.local
# En Mac/Linux: nano .env.local
\`\`\`

**Variables críticas a configurar:**

\`\`\`env
DATABASE_URL="mysql://root:tupassword@localhost:3306/mariavita"
MONGODB_URI="mongodb://localhost:27017/mariavita"
JWT_SECRET=genera_un_secret_aleatorio_aqui
\`\`\`

💡 **Tip**: Para generar un JWT_SECRET seguro, ejecuta:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

### Paso 3: Configurar Base de Datos MySQL

\`\`\`bash
# Generar cliente de Prisma
npm run prisma:generate

# Crear base de datos y tablas
npm run migrate
\`\`\`

**Tiempo estimado**: 1 minuto

### Paso 4: (Opcional) Poblar con Datos de Prueba

\`\`\`bash
npm run seed
\`\`\`

Esto creará:
- Usuarios de ejemplo
- Especialistas de prueba
- Catálogo de estudios base

### Paso 5: Iniciar la Aplicación

**Opción A - Todo en uno:**
\`\`\`bash
npm run dev:all
\`\`\`

**Opción B - Por separado (en diferentes terminales):**
\`\`\`bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run backend
\`\`\`

## 🎉 ¡Listo!

Accede a la aplicación:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 🧪 Verificar que Todo Funciona

### Test 1: Health Check del Backend

\`\`\`bash
curl http://localhost:5000/health
\`\`\`

**Respuesta esperada:**
\`\`\`json
{
  "status": "healthy",
  "services": {
    "api": "online",
    "mysql": "connected",
    "mongodb": "connected"
  }
}
\`\`\`

### Test 2: Listar Especialistas

\`\`\`bash
curl http://localhost:5000/api/specialists
\`\`\`

**Respuesta esperada:**
\`\`\`json
{
  "success": true,
  "data": [ /* array de especialistas */ ],
  "meta": { "page": 1, "pageSize": 25, "totalCount": 0 }
}
\`\`\`

## 🔧 Solución de Problemas Comunes

### Error: "Can't connect to MySQL server"

**Solución:**
1. Verifica que MySQL esté corriendo:
   \`\`\`bash
   # Windows
   net start MySQL80
   
   # Mac
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   \`\`\`

2. Verifica credenciales en `.env.local`

### Error: "MongoNetworkError"

**Solución:**
1. Verifica que MongoDB esté corriendo:
   \`\`\`bash
   # Windows
   net start MongoDB
   
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   \`\`\`

2. Verifica URI en `.env.local`

### Error: "Port 3000 is already in use"

**Solución:**
\`\`\`bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
\`\`\`

### Error de Prisma: "Migration failed"

**Solución:**
\`\`\`bash
# Resetear base de datos
npx prisma migrate reset

# Volver a ejecutar migraciones
npm run migrate
\`\`\`

## 📚 Siguientes Pasos

1. **Explora la API**: Abre http://localhost:5000/api
2. **Lee la documentación**: Consulta [README.md](./README.md)
3. **Revisa la estructura**: Consulta [ESTRUCTURA.md](./ESTRUCTURA.md)
4. **Crea tu primer especialista**: Usa Postman o curl para probar los endpoints

## 🎓 Recursos de Aprendizaje

- **Next.js 14 App Router**: https://nextjs.org/docs
- **Material UI**: https://mui.com/
- **Prisma**: https://www.prisma.io/docs
- **Express**: https://expressjs.com/

## 💬 Soporte

Si encuentras problemas:
1. Revisa los logs en la terminal
2. Verifica el estado de las bases de datos
3. Consulta la documentación completa
4. Contacta al equipo de desarrollo

---

**¡Feliz desarrollo! 🚀**
