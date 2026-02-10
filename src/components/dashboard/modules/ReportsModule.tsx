/**
 * Módulo de Reportes y Estadísticas
 */

'use client';

import { Box, Typography, Grid, Card, CardContent, Stack, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';

export default function ReportsModule() {
  const reports = [
    { title: 'Reporte de Citas Mensuales', description: 'Resumen de todas las citas del mes' },
    { title: 'Reporte de Ingresos', description: 'Análisis financiero del periodo' },
    { title: 'Reporte de Especialistas', description: 'Desempeño y disponibilidad' },
    { title: 'Reporte de Pacientes', description: 'Estadísticas de pacientes atendidos' },
    { title: 'Reporte de Estudios', description: 'Estudios realizados y pendientes' },
    { title: 'Reporte de Ocupación', description: 'Uso de consultorios y recursos' },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Reportes y Estadísticas
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Genera y descarga reportes del sistema
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {reports.map((report, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {report.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {report.description}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<DownloadIcon />}
                  >
                    Descargar PDF
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PrintIcon />}
                  >
                    Imprimir
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
