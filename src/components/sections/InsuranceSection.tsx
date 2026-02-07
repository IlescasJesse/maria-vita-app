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
  'IMSS',
  'ISSSTE',
  'Seguros Monterrey',
  'GNP Seguros',
  'AXA',
  'Metlife',
  'Allianz',
  'Banorte Seguros',
  'MAPFRE',
  'Zurich',
  'Plan Seguro',
  'Seguros Atlas'
];

const benefits = [
  'Atención sin costo adicional con tu seguro',
  'Procesos de facturación simplificados',
  'Asesoría en trámites de reembolso',
  'Cobertura para consultas y procedimientos',
  'Red de especialistas certificados',
  'Convenios con principales aseguradoras'
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
            SEGUROS MÉDICOS
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
            Aceptamos Principales Aseguradoras
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: '700px', mx: 'auto', fontSize: '1.1rem' }}
          >
            Trabajamos con las principales compañías de seguros para facilitar
            tu atención médica sin complicaciones.
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
                  Beneficios con tu Seguro
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
                  Aseguradoras Afiliadas
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
                    Si tu aseguradora no aparece en la lista, contáctanos.
                    Estamos en constante expansión de convenios para brindarte
                    mejor servicio.
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
