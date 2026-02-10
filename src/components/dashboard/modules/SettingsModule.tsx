/**
 * Módulo de Configuración del Sistema
 */

'use client';

import { Box, Typography, Paper, Stack, Switch, FormControlLabel, Button, TextField } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';

export default function SettingsModule() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Configuración del Sistema
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Configura las opciones generales del sistema
      </Typography>

      <Stack spacing={3} sx={{ mt: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Configuración General
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Nombre del Sistema"
              defaultValue="Maria Vita"
              fullWidth
            />
            <TextField
              label="Email de Contacto"
              defaultValue="contacto@mariavita.com"
              fullWidth
            />
            <TextField
              label="Teléfono"
              defaultValue="+52 951 123 4567"
              fullWidth
            />
          </Stack>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Notificaciones
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Notificaciones por Email"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Recordatorios de Citas"
            />
            <FormControlLabel
              control={<Switch />}
              label="Alertas de Sistema"
            />
          </Stack>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Seguridad
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Autenticación de Dos Factores"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Registro de Actividad"
            />
            <TextField
              label="Tiempo de Sesión (minutos)"
              type="number"
              defaultValue={60}
              sx={{ maxWidth: 300 }}
            />
          </Stack>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Citas y Agenda
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Duración de Cita por Defecto (minutos)"
              type="number"
              defaultValue={30}
              sx={{ maxWidth: 300 }}
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Permitir Cancelación de Citas"
            />
            <TextField
              label="Horas de Anticipación para Cancelar"
              type="number"
              defaultValue={24}
              sx={{ maxWidth: 300 }}
            />
          </Stack>
        </Paper>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" size="large">
            Cancelar
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
          >
            Guardar Cambios
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
