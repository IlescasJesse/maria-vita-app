# Servidor

## Conexión SSH

```
ssh root@74.208.250.52
```

**Contraseña:** `3ocyIh5civyE`

## Repositorio Git
   ┌────────────────────────────────────────┐
   │ ADMINISTRADOR                          │
   ├────────────────────────────────────────┤
   │ Email: admin@mariavita.com             │
   │ Password: Admin2026!                   │
   ├────────────────────────────────────────┤
   │ ESPECIALISTAS                          │
   ├────────────────────────────────────────┤
   │ Email: doctor@mariavita.com            │
   │ Password: Doctor2026!                  │
   ├────────────────────────────────────────┤
   │ PACIENTES                              │
   ├────────────────────────────────────────┤
   │ Email: paciente1@example.com           │
   │ Password: Patient2026!                 │
   ├────────────────────────────────────────┤
   │ USUARIOS DE PRUEBA                     │
   ├────────────────────────────────────────┤
   │ Email: prueba1@mariavita.com           │
   │ Password: Usuario1Test!                │
   ├────────────────────────────────────────┤
   │ Email: prueba2@mariavita.com           │
   │ Password: Usuario2Test!                │
   └────────────────────────────────────────┘

```
git clone https://IlescasJesse:11B3OMCVQ054AmEeEyHyoC_DACvwX24n9eIFP8tcFQ04POEdZoHy4MN2ytjzBO0hkLIZ7IMKP3fawEz5Gz@github.com/IlescasJesse/maria-vita-app.git
```
cd /var/www/maria-vita-app
DATABASE_URL="mysql://root:@localhost:3306/mariavita_db"
MONGODB_URI="mongodb://localhost:27017/mariavita"
NEXT_PUBLIC_API_URL="https://maria-vita.mx/api"
NODE_ENV="production"
PORT=3000
BACKEND_PORT=4000
┌────────────────────────────────────────┐
│ USUARIOS DE PRUEBA                     │
├────────────────────────────────────────┤
│ Email: prueba1@mariavita.com           │
│ Password: Usuario1Test!                │
├────────────────────────────────────────┤
│ Email: prueba2@mariavita.com           │
│ Password: Usuario2Test!                │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ OTROS USUARIOS DEL SISTEMA             │
├────────────────────────────────────────┤
│ ADMIN                                  │
│ Email: admin@mariavita.com             │
│ Password: Admin2026!                   │
├────────────────────────────────────────┤
│ ESPECIALISTA                           │
│ Email: doctor@mariavita.com            │
│ Password: Doctor2026!                  │
├────────────────────────────────────────┤
│ PACIENTE                               │
│ Email: paciente1@example.com           │
│ Password: Patient2026!                 │
└────────────────────────────────────────┘