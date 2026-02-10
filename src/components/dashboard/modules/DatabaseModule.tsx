/**
 * Módulo de Base de Datos (Solo SUPERADMIN)
 */

'use client';

import { Box, Typography, Paper, Grid, Card, CardContent, Button, Stack, Alert, AlertTitle } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import BackupIcon from '@mui/icons-material/Backup';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SyncIcon from '@mui/icons-material/Sync';

export default function DatabaseModule() {
  const dbStats = [
    { label: 'Total Usuarios', value: '1,248' },
    { label: 'Total Citas', value: '5,432' },
    { label: 'Total Estudios', value: '3,215' },
    { label: 'Especialistas', value: '48' },
    { label: 'Tamaño BD', value: '2.4 GB' },
    { label: 'Última Copia', value: 'Hace 2 horas' },
  ];

  return (
    <Box>
      <Alert severity="error" sx={{ mb: 3 }}>
        <AlertTitle>⚠️ Área Crítica del Sistema</AlertTitle>
        Este módulo permite operaciones sensibles en la base de datos. Solo usuarios con rol 
        SUPERADMIN pueden acceder. Ten precaución al realizar operaciones.
      </Alert>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        <StorageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Gestión de Base de Datos
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Administración y mantenimiento de la base de datos del sistema
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Estadísticas */}
        {dbStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Operaciones */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Operaciones de Base de Datos
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<BackupIcon />}
                color="primary"
              >
                Crear Backup
              </Button>
              <Button
                variant="outlined"
                startIcon={<RestoreIcon />}
                color="info"
              >
                Restaurar BD
              </Button>
              <Button
                variant="outlined"
                startIcon={<SyncIcon />}
                color="success"
              >
                Sincronizar
              </Button>
              <Button
                variant="outlined"
                startIcon={<DeleteForeverIcon />}
                color="error"
              >
                Limpiar Datos
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Log de operaciones */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Registro de Operaciones Recientes
            </Typography>
            <Stack spacing={1} sx={{ mt: 2 }}>
              <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Backup automático</strong> - Completado exitosamente
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  10/02/2026 08:00 AM
                </Typography>
              </Box>
              <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Sincronización</strong> - Base de datos sincronizada
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  09/02/2026 11:30 PM
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
