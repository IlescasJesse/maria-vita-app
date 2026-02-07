'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Chip,
  Alert,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
  Stack
} from '@mui/material';
import {
  LocalHospital,
  Person,
  CalendarMonth,
  Science,
  CheckCircle,
  Warning,
  Error,
  Info
} from '@mui/icons-material';
import { statusColors, specialtyColors } from '@/styles/theme';

/**
 * Componente de demostración del tema Maria Vita
 * Muestra todos los elementos del sistema de diseño
 */
export default function ThemeShowcase() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Encabezado */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <LocalHospital sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h2" gutterBottom>
          Sistema de Diseño Maria Vita
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Componentes y estilos del sistema médico
        </Typography>
      </Box>

      {/* Paleta de Colores */}
      <Card sx={{ mb: 4 }}>
        <CardHeader title="Paleta de Colores" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Colores Principales
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 60, height: 60, bgcolor: 'primary.main', borderRadius: 2 }} />
                  <Box>
                    <Typography variant="subtitle2">Primario</Typography>
                    <Typography variant="caption" color="text.secondary">
                      #0D47A1
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 60, height: 60, bgcolor: 'secondary.main', borderRadius: 2 }} />
                  <Box>
                    <Typography variant="subtitle2">Secundario</Typography>
                    <Typography variant="caption" color="text.secondary">
                      #00ACC1
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Colores de Estado
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 60, height: 60, bgcolor: 'success.main', borderRadius: 2 }} />
                  <Typography variant="subtitle2">Éxito</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 60, height: 60, bgcolor: 'error.main', borderRadius: 2 }} />
                  <Typography variant="subtitle2">Error</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 60, height: 60, bgcolor: 'warning.main', borderRadius: 2 }} />
                  <Typography variant="subtitle2">Advertencia</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 60, height: 60, bgcolor: 'info.main', borderRadius: 2 }} />
                  <Typography variant="subtitle2">Información</Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tipografía */}
      <Card sx={{ mb: 4 }}>
        <CardHeader title="Tipografía" />
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h1">Heading 1 - 40px</Typography>
            <Typography variant="h2">Heading 2 - 32px</Typography>
            <Typography variant="h3">Heading 3 - 28px</Typography>
            <Typography variant="h4">Heading 4 - 24px</Typography>
            <Typography variant="h5">Heading 5 - 20px</Typography>
            <Typography variant="h6">Heading 6 - 18px</Typography>
            <Divider />
            <Typography variant="body1">Body 1 - Texto principal del sistema (16px)</Typography>
            <Typography variant="body2">Body 2 - Texto secundario del sistema (14px)</Typography>
            <Typography variant="subtitle1">Subtitle 1 - Subtítulo principal</Typography>
            <Typography variant="subtitle2">Subtitle 2 - Subtítulo secundario</Typography>
            <Typography variant="caption">Caption - Texto pequeño (12px)</Typography>
            <Typography variant="overline">Overline - Texto en mayúsculas</Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Botones */}
      <Card sx={{ mb: 4 }}>
        <CardHeader title="Botones" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Variantes
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Button variant="contained">Contained</Button>
                <Button variant="outlined">Outlined</Button>
                <Button variant="text">Text</Button>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Colores
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Button variant="contained" color="primary">
                  Primary
                </Button>
                <Button variant="contained" color="secondary">
                  Secondary
                </Button>
                <Button variant="contained" color="success">
                  Success
                </Button>
                <Button variant="contained" color="error">
                  Error
                </Button>
                <Button variant="contained" color="warning">
                  Warning
                </Button>
                <Button variant="contained" color="info">
                  Info
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Tamaños
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="contained" size="small">
                  Small
                </Button>
                <Button variant="contained" size="medium">
                  Medium
                </Button>
                <Button variant="contained" size="large">
                  Large
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Formularios */}
      <Card sx={{ mb: 4 }}>
        <CardHeader title="Campos de Formulario" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField label="Nombre del Paciente" fullWidth placeholder="Ingrese el nombre" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Correo Electrónico"
                type="email"
                fullWidth
                placeholder="correo@ejemplo.com"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Teléfono" fullWidth placeholder="555-1234" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Campo Deshabilitado"
                fullWidth
                disabled
                value="No editable"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Comentarios"
                fullWidth
                multiline
                rows={3}
                placeholder="Escriba sus comentarios aquí..."
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Alertas */}
      <Card sx={{ mb: 4 }}>
        <CardHeader title="Alertas y Notificaciones" />
        <CardContent>
          <Stack spacing={2}>
            <Alert severity="success" icon={<CheckCircle />}>
              ¡Operación completada exitosamente!
            </Alert>
            <Alert severity="info" icon={<Info />}>
              Información importante para el usuario.
            </Alert>
            <Alert severity="warning" icon={<Warning />}>
              Advertencia: Revise los datos antes de continuar.
            </Alert>
            <Alert severity="error" icon={<Error />}>
              Error: No se pudo completar la operación.
            </Alert>
          </Stack>
        </CardContent>
      </Card>

      {/* Chips */}
      <Card sx={{ mb: 4 }}>
        <CardHeader title="Chips y Badges" />
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Estados de Citas
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
            <Chip label="Pendiente" sx={{ bgcolor: statusColors.pending, color: 'white' }} />
            <Chip label="Confirmada" sx={{ bgcolor: statusColors.confirmed, color: 'white' }} />
            <Chip label="En Progreso" sx={{ bgcolor: statusColors.inProgress, color: 'white' }} />
            <Chip label="Completada" sx={{ bgcolor: statusColors.completed, color: 'white' }} />
            <Chip label="Cancelada" sx={{ bgcolor: statusColors.cancelled, color: 'white' }} />
            <Chip label="Urgente" sx={{ bgcolor: statusColors.urgent, color: 'white' }} />
          </Stack>

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Especialidades Médicas
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Chip
              label="Cardiología"
              sx={{ bgcolor: specialtyColors.cardiology, color: 'white' }}
            />
            <Chip
              label="Neurología"
              sx={{ bgcolor: specialtyColors.neurology, color: 'white' }}
            />
            <Chip
              label="Pediatría"
              sx={{ bgcolor: specialtyColors.pediatrics, color: 'white' }}
            />
            <Chip
              label="Ortopedia"
              sx={{ bgcolor: specialtyColors.orthopedics, color: 'white' }}
            />
            <Chip
              label="Dermatología"
              sx={{ bgcolor: specialtyColors.dermatology, color: 'white' }}
            />
            <Chip
              label="Laboratorio"
              sx={{ bgcolor: specialtyColors.laboratory, color: 'white' }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Tarjetas de Módulos */}
      <Card sx={{ mb: 4 }}>
        <CardHeader title="Tarjetas de Módulos" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  },
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                <Person sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Pacientes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gestión de pacientes
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  },
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                <CalendarMonth sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Citas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Agendamiento
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  },
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                <Science sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Laboratorio
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Análisis y estudios
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  },
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                <LocalHospital sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Consultas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Historial médico
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Controles */}
      <Card>
        <CardHeader title="Controles e Interacciones" />
        <CardContent>
          <Stack spacing={2}>
            <FormControlLabel control={<Switch defaultChecked />} label="Notificaciones activas" />
            <FormControlLabel control={<Switch />} label="Modo oscuro" />
            <FormControlLabel control={<Switch disabled />} label="Opción deshabilitada" />
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
