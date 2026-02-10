/**
 * Módulo de Analíticas Avanzadas (Solo SUPERADMIN)
 */

'use client';

import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TimelineIcon from '@mui/icons-material/Timeline';

export default function AnalyticsModule() {
  const metrics = [
    { 
      title: 'Tasa de Crecimiento',
      value: '+24.5%',
      subtitle: 'Últimos 3 meses',
      icon: <TrendingUpIcon />,
      color: '#2e7d32'
    },
    { 
      title: 'Usuarios Activos',
      value: '1,248',
      subtitle: 'En el sistema',
      icon: <PeopleIcon />,
      color: '#1976d2'
    },
    { 
      title: 'Ingresos Totales',
      value: '$124,500',
      subtitle: 'Este mes',
      icon: <AttachMoneyIcon />,
      color: '#ed6c02'
    },
    { 
      title: 'Tasa de Ocupación',
      value: '87%',
      subtitle: 'Promedio semanal',
      icon: <TimelineIcon />,
      color: '#9c27b0'
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Analíticas Avanzadas
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Panel de métricas y analíticas del sistema (Solo Super Admin)
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: `${metric.color}15`,
                    color: metric.color,
                    display: 'inline-flex',
                    mb: 2,
                  }}
                >
                  {metric.icon}
                </Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metric.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {metric.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Paper sx={{ p: 3, minHeight: 400 }}>
            <Typography variant="h6" gutterBottom>
              Tendencias del Sistema
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
                Gráficas de tendencias y análisis avanzado (próximamente)
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
