# 🎨 Paleta de Colores Maria Vita de Antequera

## Colores Corporativos

Basados en el logo oficial de Maria Vita de Antequera Consultorios.

---

## 🔵 Primario - Azul Púrpura Corporativo

**Color principal de la marca**

```
Main:  #353080  ███████  RGB(53, 48, 128)
Light: #5D57B3  ███████  RGB(93, 87, 179)
Dark:  #252159  ███████  RGB(37, 33, 89)
```

**Uso:**
- Encabezados principales
- Botones primarios
- Navegación
- Elementos destacados
- Texto de títulos

---

## 🟢 Secundario - Verde Corporativo

**Color de acento del logo "de Antequera"**

```
Main:  #2D9F6F  ███████  RGB(45, 159, 111)
Light: #5BB88F  ███████  RGB(91, 184, 143)
Dark:  #1F7050  ███████  RGB(31, 112, 80)
```

**Uso:**
- Botones secundarios
- Elementos de éxito
- Confirmaciones
- Indicadores positivos
- Acentos complementarios

---

## 🔵 Info - Azul Celeste

**Color del texto "CONSULTORIOS" del logo**

```
Main:  #7CB8E8  ███████  RGB(124, 184, 232)
Light: #A3CFF2  ███████  RGB(163, 207, 242)
Dark:  #5899D1  ███████  RGB(88, 153, 209)
```

**Uso:**
- Información general
- Notificaciones informativas
- Enlaces complementarios
- Elementos de soporte

---

## ⚪ Fondos

**Esquema limpio y profesional**

```
Background Default: #FFFFFF  ███████  (Blanco Puro)
Background Paper:   #FFFFFF  ███████  (Blanco Puro)
```

**Características:**
- Interfaz completamente blanca
- Limpia y profesional
- Máximo contraste para legibilidad
- Elegancia médica

---

## 📝 Textos

```
Primary:   #1A1A1A  ███████  (Casi Negro)
Secondary: #666666  ███████  (Gris Medio)
Disabled:  #BDBDBD  ███████  (Gris Claro)
```

---

## 🎯 Colores de Estado

### Success (Éxito)
```
Main: #2D9F6F  ███████  (Verde Corporativo)
```

### Error (Error/Urgencia)
```
Main: #D32F2F  ███████  (Rojo Médico)
```

### Warning (Advertencia)
```
Main: #F57C00  ███████  (Naranja)
```

### Info (Información)
```
Main: #7CB8E8  ███████  (Azul Celeste)
```

---

## 🎨 Gradientes Corporativos

### Gradiente Principal (Azul Púrpura)
```css
background: linear-gradient(135deg, #353080 0%, #5D57B3 100%);
```

### Gradiente Secundario (Verde)
```css
background: linear-gradient(135deg, #2D9F6F 0%, #5BB88F 100%);
```

### Gradiente Hero
```css
background: linear-gradient(135deg, #353080 0%, #5D57B3 50%, #7CB8E8 100%);
```

---

## 💡 Guía de Uso

### ✅ HACER

- Usar **#353080** como color principal en elementos importantes
- Usar **#2D9F6F** para confirmaciones y éxitos
- Mantener fondos **blancos (#FFFFFF)** para elegancia
- Usar gradientes suaves para iconos destacados
- Aplicar sombras sutiles con el color corporativo

### ❌ NO HACER

- No usar fondos de colores para el área principal
- No mezclar el azul púrpura con colores brillantes no corporativos
- No usar más de 2 colores corporativos en un mismo elemento
- No aplicar el color secundario (verde) en exceso

---

## 🖼️ Aplicaciones Visuales

### Botones Primarios
```tsx
// Con gradiente corporativo
background: linear-gradient(135deg, #353080 0%, #5D57B3 100%);
color: #FFFFFF;
```

### Tarjetas Destacadas
```tsx
border: 1px solid rgba(53, 48, 128, 0.2);
boxShadow: 0 12px 32px rgba(53, 48, 128, 0.15);
```

### Iconos con Gradiente
```tsx
// Primario
background: linear-gradient(135deg, #353080 0%, #5D57B3 100%);

// Secundario
background: linear-gradient(135deg, #2D9F6F 0%, #5BB88F 100%);

// Info
background: linear-gradient(135deg, #7CB8E8 0%, #A3CFF2 100%);
```

---

## 📊 Accesibilidad

### Contraste de Textos

| Combinación | Ratio | Estado |
|-------------|-------|--------|
| #353080 en #FFFFFF | 8.59:1 | ✅ AAA |
| #2D9F6F en #FFFFFF | 3.16:1 | ✅ AA |
| #7CB8E8 en #FFFFFF | 2.18:1 | ⚠️ Grande solamente |
| #1A1A1A en #FFFFFF | 16.1:1 | ✅ AAA |

---

## 🎭 Variaciones por Contexto

### Landing Page
- Hero con gradiente: `#353080 → #5D57B3 → #7CB8E8`
- Fondo: Blanco puro `#FFFFFF`
- Tarjetas: Blanco con borde sutil y sombra

### Dashboard
- Sidebar: `#353080` o `#FAFAFA` (claro)
- AppBar: Blanco con borde inferior `rgba(53, 48, 128, 0.08)`
- Cards: Blanco con sombra suave

### Formularios
- Inputs: Fondo `#FAFAFA`, hover `#F5F5F5`
- Focus: Border `#353080` de 2px
- Labels: Color `#666666`

---

## 🌙 Modo Oscuro (Opcional)

```
Background Default: #0F0E1E  ███████  (Azul Oscuro Profundo)
Background Paper:   #1A1830  ███████  (Azul Oscuro Medio)

Primary Main:   #7B75D0  ███████  (Azul Púrpura Claro)
Secondary Main: #5BB88F  ███████  (Verde Claro)
```

---

## 📦 Exportación de Colores

### CSS Variables
```css
:root {
  --primary-main: #353080;
  --primary-light: #5D57B3;
  --primary-dark: #252159;
  
  --secondary-main: #2D9F6F;
  --secondary-light: #5BB88F;
  --secondary-dark: #1F7050;
  
  --info-main: #7CB8E8;
  
  --bg-default: #FFFFFF;
  --text-primary: #1A1A1A;
  --text-secondary: #666666;
}
```

### Tailwind Config
```js
colors: {
  primary: {
    DEFAULT: '#353080',
    light: '#5D57B3',
    dark: '#252159',
  },
  secondary: {
    DEFAULT: '#2D9F6F',
    light: '#5BB88F',
    dark: '#1F7050',
  }
}
```

---

## 🎨 Paleta Completa en Figma

```
Primario:   #353080, #5D57B3, #252159
Secundario: #2D9F6F, #5BB88F, #1F7050
Info:       #7CB8E8, #A3CFF2, #5899D1
Success:    #2D9F6F
Error:      #D32F2F
Warning:    #F57C00
```

---

**Maria Vita de Antequera - Consultorios**  
*Elegante • Profesional • Limpio*
