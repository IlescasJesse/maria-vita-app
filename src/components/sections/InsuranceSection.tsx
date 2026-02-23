'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  alpha
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

const insuranceProviders = [
  'Sindicatos de Medicos de Oaxaca',
  'STEPEIDICEO',
  'Gobierno de Oaxaca',
  'Hospital San Jose',
  'PENSIONES del Estado de Oaxaca',
  'SUTSPEO',
  'SUTCOBAO',
  'SUTIEMS Oaxaca',
  'Seccion 22 SNTE (Oaxaca)',
  'FOMENTO Oaxaca'
];

const benefits = [
  'Atencion preferente para afiliados y derechohabientes en convenio',
  'Procesos administrativos claros y orientacion personalizada',
  'Integracion entre diagnostico de laboratorio y atencion medica',
  'Red de especialistas certificados y seguimiento clinico continuo',
  'Beneficios institucionales para grupos y colectivos',
  'Convenios vigentes con instituciones y sindicatos locales'
];

export default function InsuranceSection() {
  return (
    <Box
      id="seguro"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <HealthAndSafetyIcon
            sx={{
              fontSize: 64,
              color: 'secondary.main',
              mb: 2
            }}
          />
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              fontSize: '0.875rem',
              letterSpacing: 1.5
            }}
          >
            CONVENIOS INSTITUCIONALES
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              mt: 1,
              mb: 2
            }}
          >
            Convenios para Atencion Medica y Laboratorio
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: '700px', mx: 'auto', fontSize: '1.1rem' }}
          >
            Trabajamos con instituciones y sindicatos para facilitar
            el acceso a servicios de salud y diagnostico con respaldo formal.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Benefits Card */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                bgcolor: alpha('#353080', 0.03),
                border: 1,
                borderColor: 'divider',
                borderRadius: 3
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: 'secondary.main'
                  }}
                >
                  Beneficios de Convenio
                </Typography>
                <Stack spacing={2}>
                  {benefits.map((benefit, index) => (
                    <Stack key={index} direction="row" spacing={2} alignItems="flex-start">
                      <CheckCircleIcon
                        sx={{
                          color: 'primary.main',
                          fontSize: 24,
                          mt: 0.2,
                          flexShrink: 0
                        }}
                      />
                      <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        {benefit}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Insurance Providers */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                bgcolor: alpha('#00875F', 0.03),
                border: 1,
                borderColor: 'divider',
                borderRadius: 3
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: 'primary.main'
                  }}
                >
                  Convenios Activos
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1.5
                  }}
                >
                  {insuranceProviders.map((provider, index) => (
                    <Chip
                      key={index}
                      label={provider}
                      sx={{
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        fontWeight: 500,
                        px: 1,
                        '&:hover': {
                          bgcolor: 'primary.main',
                          color: 'white',
                          borderColor: 'primary.main'
                        }
                      }}
                    />
                  ))}
                </Box>
                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: 1,
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Nota importante:</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Si tu institucion o sindicato no aparece en la lista, contactanos.
                    Estamos en constante expansion de convenios para brindar un mejor servicio.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
