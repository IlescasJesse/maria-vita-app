# 🎨 Tema Maria Vita - Resumen Visual

## 🎯 Colores Principales

### Primario - Azul Médico Profesional
```
Main:  ██████ #0D47A1
Light: ██████ #5472D3
Dark:  ██████ #002171
```

### Secundario - Turquesa Médico
```
Main:  ██████ #00ACC1
Light: ██████ #5DDEF4
Dark:  ██████ #007C91
```

### Estados
```
Success: ██████ #388E3C (Verde)
Error:   ██████ #D32F2F (Rojo)
Warning: ██████ #F57C00 (Naranja)
Info:    ██████ #0288D1 (Azul)
```

---

## 📝 Jerarquía Tipográfica

```
H1: 40px / 2.5rem  - Bold 700
H2: 32px / 2rem    - Bold 700
H3: 28px / 1.75rem - SemiBold 600
H4: 24px / 1.5rem  - SemiBold 600
H5: 20px / 1.25rem - SemiBold 600
H6: 18px / 1.125rem - SemiBold 600

Body1: 16px / 1rem     - Regular 400
Body2: 14px / 0.875rem - Regular 400
Caption: 12px / 0.75rem - Regular 400
```

---

## 🧱 Componentes Principales

### ✅ Personalizados:
- **Botones** - Bordes redondeados (8px), transiciones suaves, sin sombra base
- **Tarjetas** - Bordes redondeados (16px), sombras sutiles, hover elevado
- **Inputs** - Bordes redondeados (8px), hover en azul, focus con borde de 2px
- **Diálogos** - Bordes redondeados (16px), sombra pronunciada
- **DataGrid** - Sin bordes, header con fondo azul claro, hover en filas
- **Alertas** - Bordes redondeados (12px), fondos con 10% opacidad
- **Chips** - Bordes redondeados (8px), peso 500

---

## 📐 Sistema de Espaciado

Base: **8px**

```
spacing(1) = 8px
spacing(2) = 16px
spacing(3) = 24px
spacing(4) = 32px
spacing(5) = 40px
spacing(6) = 48px
spacing(8) = 64px
```

---

## 📱 Breakpoints

```
xs: 0px     (móvil)
sm: 600px   (tablet pequeña)
md: 960px   (tablet)
lg: 1280px  (desktop)
xl: 1920px  (desktop grande)
```

---

## 🎨 Colores de Utilidad

### Estados de Citas
```
Pendiente:    #FF9800 (Naranja)
En Progreso:  #2196F3 (Azul)
Completada:   #4CAF50 (Verde)
Cancelada:    #F44336 (Rojo)
Confirmada:   #4CAF50 (Verde)
Urgente:      #D32F2F (Rojo Oscuro)
```

### Especialidades Médicas
```
Cardiología:   #E91E63 (Rosa)
Neurología:    #9C27B0 (Púrpura)
Pediatría:     #03A9F4 (Azul Claro)
Ortopedia:     #FF5722 (Naranja Rojizo)
Dermatología:  #795548 (Marrón)
Oftalmología:  #00BCD4 (Cyan)
Laboratorio:   #4CAF50 (Verde)
Radiología:    #3F51B5 (Índigo)
Emergencias:   #F44336 (Rojo)
```

---

## 🌙 Tema Oscuro

```
Background Default: #0A1929 (Azul Profundo)
Background Paper:   #1A2332 (Azul Medio)
Primary:            #5472D3 (Azul Claro)
Secondary:          #26C6DA (Cyan Brillante)
```

---

## ⚡ Transiciones

```
Shortest: 150ms
Shorter:  200ms
Short:    250ms
Standard: 300ms
Complex:  375ms
```

---

## 📦 Archivos del Tema

```
src/
├── styles/
│   └── theme.ts                    # Configuración principal del tema
├── components/
│   ├── ThemeRegistry.tsx           # Provider del tema
│   └── examples/
│       ├── MUIExamples.tsx         # Ejemplos básicos
│       └── ThemeShowcase.tsx       # Showcase completo
└── app/
    ├── layout.tsx                  # Layout con tema aplicado
    └── page.tsx                    # Página principal mejorada
```

---

## 🚀 Cómo Usar

### Importar componentes
```tsx
import { Button, Card, Typography } from '@mui/material';
```

### Usar colores del tema
```tsx
<Box sx={{ bgcolor: 'primary.main', color: 'white' }}>
```

### Usar colores de utilidad
```tsx
import { statusColors, specialtyColors } from '@/styles/theme';

<Chip sx={{ bgcolor: statusColors.pending }} />
```

### Usar spacing
```tsx
<Box sx={{ p: 3, m: 2, mt: 4 }}>
```

---

## 📚 Documentación

- [Guía Completa del Tema](./THEME_GUIDE.md)
- [Guía Material UI](./MATERIAL_UI_GUIDE.md)

---

**Sistema de Diseño Maria Vita v1.0**  
*Profesional • Accesible • Moderno*
