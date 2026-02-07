# 🎨 Guía del Sistema de Diseño - Maria Vita

## Tema Personalizado Completo

El sistema de diseño Maria Vita está optimizado para aplicaciones médicas con un enfoque en accesibilidad, profesionalismo y facilidad de uso.

---

## 📋 Tabla de Contenidos

1. [Paleta de Colores](#paleta-de-colores)
2. [Tipografía](#tipografía)
3. [Componentes](#componentes)
4. [Espaciado y Layout](#espaciado-y-layout)
5. [Tema Oscuro](#tema-oscuro)
6. [Colores de Utilidad](#colores-de-utilidad)

---

## 🎨 Paleta de Colores

### Colores Principales

```typescript
// Primario - Azul Médico Profesional
primary: '#0D47A1'  // main
         '#5472D3'  // light
         '#002171'  // dark

// Secundario - Turquesa Médico
secondary: '#00ACC1'  // main
           '#5DDEF4'  // light
           '#007C91'  // dark
```

### Colores de Estado

```typescript
success:  '#388E3C'  // Verde - Operaciones exitosas
error:    '#D32F2F'  // Rojo - Errores y urgencias
warning:  '#F57C00'  // Naranja - Advertencias
info:     '#0288D1'  // Azul - Información
```

### Uso en Componentes

```tsx
// Usando colores del tema
<Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
  Contenido
</Box>

<Button color="primary">Botón Primario</Button>
<Button color="secondary">Botón Secundario</Button>
```

---

## 📝 Tipografía

### Jerarquía de Texto

| Variante | Tamaño | Peso | Uso |
|----------|--------|------|-----|
| h1 | 40px (2.5rem) | 700 | Títulos principales de página |
| h2 | 32px (2rem) | 700 | Secciones principales |
| h3 | 28px (1.75rem) | 600 | Subsecciones |
| h4 | 24px (1.5rem) | 600 | Títulos de tarjetas |
| h5 | 20px (1.25rem) | 600 | Títulos pequeños |
| h6 | 18px (1.125rem) | 600 | Subtítulos |
| body1 | 16px (1rem) | 400 | Texto principal |
| body2 | 14px (0.875rem) | 400 | Texto secundario |
| caption | 12px (0.75rem) | 400 | Notas y metadatos |

### Ejemplos de Uso

```tsx
// Encabezados
<Typography variant="h1">Título Principal</Typography>
<Typography variant="h2">Sección</Typography>
<Typography variant="h4">Título de Tarjeta</Typography>

// Texto de cuerpo
<Typography variant="body1">Texto principal del contenido</Typography>
<Typography variant="body2" color="text.secondary">
  Texto secundario o descripción
</Typography>

// Subtítulos y captiones
<Typography variant="subtitle1">Subtítulo importante</Typography>
<Typography variant="caption" color="text.secondary">
  Nota: Texto pequeño explicativo
</Typography>
```

---

## 🧩 Componentes

### Botones

```tsx
// Variantes
<Button variant="contained">Contained</Button>
<Button variant="outlined">Outlined</Button>
<Button variant="text">Text</Button>

// Colores
<Button variant="contained" color="primary">Primario</Button>
<Button variant="contained" color="secondary">Secundario</Button>
<Button variant="contained" color="success">Éxito</Button>
<Button variant="contained" color="error">Error</Button>

// Tamaños
<Button size="small">Pequeño</Button>
<Button size="medium">Mediano</Button>
<Button size="large">Grande</Button>

// Con iconos
<Button startIcon={<SaveIcon />}>Guardar</Button>
<Button endIcon={<ArrowForwardIcon />}>Continuar</Button>
```

### Tarjetas

```tsx
<Card>
  <CardHeader 
    title="Título de Tarjeta"
    subheader="Subtítulo opcional"
    avatar={<Avatar>MV</Avatar>}
  />
  <CardContent>
    <Typography variant="body2">
      Contenido de la tarjeta
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Ver Más</Button>
  </CardActions>
</Card>
```

### Campos de Formulario

```tsx
// Input básico
<TextField 
  label="Nombre del Paciente"
  fullWidth
  placeholder="Ingrese el nombre"
/>

// Input con validación
<TextField 
  label="Email"
  type="email"
  fullWidth
  error={hasError}
  helperText={hasError ? "Email inválido" : ""}
/>

// Textarea
<TextField 
  label="Notas"
  multiline
  rows={4}
  fullWidth
/>

// Select
<TextField
  select
  label="Especialidad"
  fullWidth
>
  <MenuItem value="cardio">Cardiología</MenuItem>
  <MenuItem value="neuro">Neurología</MenuItem>
</TextField>
```

### Alertas

```tsx
<Alert severity="success">Operación exitosa</Alert>
<Alert severity="error">Error en la operación</Alert>
<Alert severity="warning">Advertencia importante</Alert>
<Alert severity="info">Información relevante</Alert>

// Con acción
<Alert 
  severity="info"
  action={
    <Button color="inherit" size="small">
      DESHACER
    </Button>
  }
>
  Cambios guardados
</Alert>
```

### Diálogos (Modales)

```tsx
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Confirmar Acción</DialogTitle>
  <DialogContent>
    <Typography>
      ¿Está seguro de que desea continuar?
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancelar</Button>
    <Button onClick={handleConfirm} variant="contained">
      Confirmar
    </Button>
  </DialogActions>
</Dialog>
```

### DataGrid

```tsx
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'paciente', headerName: 'Paciente', width: 200 },
  { field: 'fecha', headerName: 'Fecha', width: 150 },
  { field: 'estado', headerName: 'Estado', width: 130 },
];

<DataGrid
  rows={rows}
  columns={columns}
  pageSize={10}
  checkboxSelection
  disableSelectionOnClick
/>
```

---

## 📐 Espaciado y Layout

### Sistema de Espaciado

El tema usa un sistema de espaciado base de **8px**. Multiplica por el factor deseado:

```tsx
<Box sx={{ 
  p: 2,   // padding: 16px (2 * 8px)
  m: 3,   // margin: 24px (3 * 8px)
  mt: 4,  // margin-top: 32px
  px: 5,  // padding-left y padding-right: 40px
}}>
```

### Grid System

```tsx
<Grid container spacing={3}>
  <Grid item xs={12} md={6}>
    {/* 100% en móvil, 50% en desktop */}
  </Grid>
  <Grid item xs={12} md={6}>
    {/* 100% en móvil, 50% en desktop */}
  </Grid>
</Grid>
```

### Container

```tsx
// Contenedor con ancho máximo
<Container maxWidth="lg">  {/* lg = 1280px */}
  <Typography>Contenido centrado</Typography>
</Container>

// Opciones: xs, sm, md, lg, xl
```

### Stack (Flex Layout Simplificado)

```tsx
// Vertical (por defecto)
<Stack spacing={2}>
  <Item>1</Item>
  <Item>2</Item>
</Stack>

// Horizontal
<Stack direction="row" spacing={2}>
  <Item>1</Item>
  <Item>2</Item>
</Stack>

// Con alineación
<Stack 
  direction="row" 
  spacing={2}
  justifyContent="space-between"
  alignItems="center"
>
  <Item>Izquierda</Item>
  <Item>Derecha</Item>
</Stack>
```

---

## 🌙 Tema Oscuro

Para implementar el tema oscuro:

```tsx
import { darkTheme } from '@/styles/theme';

// En tu ThemeRegistry o provider
<ThemeProvider theme={isDark ? darkTheme : theme}>
  {children}
</ThemeProvider>
```

**Colores del Tema Oscuro:**
- Background default: `#0A1929` (Azul oscuro profundo)
- Background paper: `#1A2332` (Tarjetas)
- Primary: `#5472D3` (Azul más claro)
- Secondary: `#26C6DA` (Cyan brillante)

---

## 🎯 Colores de Utilidad

### Estados de Citas

```tsx
import { statusColors } from '@/styles/theme';

<Chip 
  label="Pendiente" 
  sx={{ bgcolor: statusColors.pending, color: 'white' }}
/>
<Chip 
  label="Confirmada" 
  sx={{ bgcolor: statusColors.confirmed, color: 'white' }}
/>
<Chip 
  label="Urgente" 
  sx={{ bgcolor: statusColors.urgent, color: 'white' }}
/>
```

**Colores Disponibles:**
- `pending`: `#FF9800` (Naranja)
- `inProgress`: `#2196F3` (Azul)
- `completed`: `#4CAF50` (Verde)
- `cancelled`: `#F44336` (Rojo)
- `urgent`: `#D32F2F` (Rojo oscuro)

### Especialidades Médicas

```tsx
import { specialtyColors } from '@/styles/theme';

<Chip 
  label="Cardiología" 
  sx={{ bgcolor: specialtyColors.cardiology, color: 'white' }}
/>
```

**Especialidades Disponibles:**
- `cardiology`: Rosa
- `neurology`: Púrpura
- `pediatrics`: Azul claro
- `orthopedics`: Naranja rojizo
- `dermatology`: Marrón
- `ophthalmology`: Cyan
- `laboratory`: Verde
- `radiology`: Índigo
- `emergency`: Rojo

---

## 🎨 Función Helper para Opacidad

```tsx
import { getColorWithOpacity } from '@/styles/theme';

// Usar color con opacidad
<Box sx={{ 
  bgcolor: getColorWithOpacity('#0D47A1', 0.1),  // 10% opacidad
  border: `1px solid ${getColorWithOpacity('#0D47A1', 0.3)}`
}}>
```

---

## 🔧 Personalización de Componentes

### Usando el sistema SX

```tsx
<Button
  sx={{
    bgcolor: 'primary.main',
    color: 'white',
    borderRadius: 2,
    px: 4,
    py: 1.5,
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: 2,
    '&:hover': {
      bgcolor: 'primary.dark',
      boxShadow: 4,
      transform: 'translateY(-2px)'
    },
    transition: 'all 0.3s ease-in-out'
  }}
>
  Botón Personalizado
</Button>
```

---

## 📱 Breakpoints

```tsx
// Valores de breakpoints
xs: 0px
sm: 600px
md: 960px
lg: 1280px
xl: 1920px

// Uso con sx
<Box sx={{
  display: { xs: 'block', md: 'flex' },
  fontSize: { xs: '14px', sm: '16px', md: '18px' }
}}>
```

---

## 🚀 Componente de Showcase

Para ver todos los componentes del tema en acción:

```tsx
import ThemeShowcase from '@/components/examples/ThemeShowcase';

// Usar en una página
<ThemeShowcase />
```

---

## 📚 Recursos Adicionales

- [Material UI Documentation](https://mui.com/)
- [Material Design Guidelines](https://material.io/)
- [Archivo de tema](../styles/theme.ts)
- [Ejemplos de componentes](../components/examples/MUIExamples.tsx)
- [Showcase completo](../components/examples/ThemeShowcase.tsx)

---

## ✨ Mejores Prácticas

1. **Usa el sistema de colores del tema** en lugar de valores hardcodeados
2. **Aprovecha el sistema de espaciado** (múltiplos de 8px)
3. **Mantén la consistencia** usando variantes de tipografía definidas
4. **Optimiza para accesibilidad** usando contraste adecuado
5. **Implementa responsive design** con breakpoints del tema
6. **Usa transiciones suaves** para mejorar la experiencia

---

**Sistema de Diseño Maria Vita v1.0**  
*Sistema Médico Híbrido - Profesional y Accesible*
