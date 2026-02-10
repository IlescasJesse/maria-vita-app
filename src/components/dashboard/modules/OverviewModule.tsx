/**
 * Módulo de Resumen - Dashboard Overview
 */

'use client';

import { Grid, Paper, Box, Typography, Card, CardContent, Stack } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScienceIcon from '@mui/icons-material/Science';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useAuth } from '@/hooks/useAuth';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
            {trend && (
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                <TrendingUpIcon fontSize="small" color="success" />
                <Typography variant="caption" color="success.main">
                  {trend}
                </Typography>
              </Stack>
            )}
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: `${color}15`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function OverviewModule() {
  const { isSuperAdmin, isAdmin } = useAuth();

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Resumen General
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Vista general del sistema Maria Vita
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Estadísticas principales */}
        {(isSuperAdmin || isAdmin) && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Usuarios"
                value="1,248"
                icon={<PeopleIcon fontSize="large" />}
                color="#1976d2"
                trend="+12% este mes"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Especialistas"
                value="48"
                icon={<LocalHospitalIcon fontSize="large" />}
                color="#2e7d32"
                trend="+3 nuevos"
              />
            </Grid>
          </>
        )}
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Citas Hoy"
            value="24"
            icon={<CalendarMonthIcon fontSize="large" />}
            color="#ed6c02"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Estudios Pendientes"
            value="16"
            icon={<ScienceIcon fontSize="large" />}
            color="#9c27b0"
          />
        </Grid>

        {/* Gráficas y estadísticas adicionales */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Citas por Mes
            </Typography>
            <Box 
              sx={{ 
                height: 300, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: 'grey.50',
                borderRadius: 1
              }}
            >
              <Typography color="text.secondary">
                Gráfica de citas mensuales (próximamente)
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Actividad Reciente
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Nueva cita creada
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Hace 5 minutos
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Estudio completado
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Hace 15 minutos
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Nuevo paciente registrado
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Hace 1 hora
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {isSuperAdmin && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, backgroundColor: 'error.light', color: 'error.contrastText' }}>
              <Typography variant="h6" gutterBottom>
                Panel de Super Administrador
              </Typography>
              <Typography variant="body2">
                Tienes acceso completo a todas las funcionalidades del sistema incluyendo 
                gestión de administradores, configuración de base de datos y analíticas avanzadas.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
