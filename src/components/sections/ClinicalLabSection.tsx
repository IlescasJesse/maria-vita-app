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
import ScienceIcon from '@mui/icons-material/Science';
import BiotechIcon from '@mui/icons-material/Biotech';

const clinicalStudies = [
  'Química Sanguínea',
  'Hematología Completa',
  'Perfil Lipídico',
  'Pruebas de Función Hepática',
  'Pruebas de Función Renal',
  'Hormonas Tiroideas',
  'Marcadores Tumorales',
  'Pruebas de Coagulación',
  'Electrolitos Séricos',
  'Examen General de Orina',
  'Cultivos Microbiológicos',
  'Serología e Inmunología',
  'HbA1c (Diabetes)',
  'PCR y Marcadores Inflamatorios',
  'Vitaminas y Minerales',
  'Pruebas de Embarazo',
  'Perfil Hormonal',
  'Toxicología'
];

const labBenefits = [
  'Tecnología de última generación y equipos automatizados',
  'Resultados precisos y confiables certificados',
  'Personal altamente calificado y especializado',
  'Entrega de resultados en tiempo récord',
  'Más de 500 estudios disponibles',
  'Convenios con empresas e instituciones'
];

const agreements = [
  'IMSS - Instituto Mexicano del Seguro Social',
  'ISSSTE - Instituto de Seguridad y Servicios Sociales',
  'Sindicato Nacional de Trabajadores',
  'PEMEX - Petróleos Mexicanos',
  'CFE - Comisión Federal de Electricidad',
  'Hospital Regional de Oaxaca',
  'Clínica Santa María',
  'Secretaría de Salud',
  'Universidad Autónoma de Oaxaca',
  'Grupo Industrial del Sur',
  'Cámara de Comercio de Oaxaca',
  'Gobierno del Estado de Oaxaca'
];

export default function ClinicalLabSection() {
  return (
    <Box
      id="laboratorio"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
            <BiotechIcon
              sx={{
                fontSize: 64,
                color: 'secondary.main'
              }}
            />
            <ScienceIcon
              sx={{
                fontSize: 64,
                color: 'primary.main'
              }}
            />
          </Stack>
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              fontSize: '0.875rem',
              letterSpacing: 1.5
            }}
          >
            LABORATORIO CLÍNICO
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
            Tecnología de Vanguardia y Precisión Absoluta
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: '800px', mx: 'auto', fontSize: '1.1rem' }}
          >
            Nuestro laboratorio clínico cuenta con tecnología de última generación
            para realizar estudios de laboratorio de distinto índole, garantizando
            resultados exactos y confiables para un diagnóstico preciso.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Lab Capabilities */}
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
                  Capacidad y Ventajas
                </Typography>
                <Stack spacing={2}>
                  {labBenefits.map((benefit, index) => (
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

                {/* Studies Examples */}
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: 'text.primary'
                    }}
                  >
                    Estudios Disponibles
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1
                    }}
                  >
                    {clinicalStudies.slice(0, 12).map((study, index) => (
                      <Chip
                        key={index}
                        label={study}
                        size="small"
                        sx={{
                          bgcolor: 'background.paper',
                          border: 1,
                          borderColor: 'divider',
                          fontSize: '0.75rem',
                          '&:hover': {
                            bgcolor: 'secondary.main',
                            color: 'white',
                            borderColor: 'secondary.main'
                          }
                        }}
                      />
                    ))}
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2, fontStyle: 'italic' }}
                  >
                    ... y más de 500 estudios especializados
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Agreements */}
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
                  Convenios Institucionales
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, lineHeight: 1.6 }}
                >
                  Contamos con convenios estratégicos con empresas, organizaciones,
                  clínicas y sindicatos para el beneficio de la comunidad, ofreciendo
                  precios preferenciales y servicios exclusivos.
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1.5
                  }}
                >
                  {agreements.map((agreement, index) => (
                    <Chip
                      key={index}
                      label={agreement}
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
                    ¿Tu organización o empresa no tiene convenio con nosotros?
                    Contáctanos para establecer un convenio nuevo. Ofrecemos opciones
                    flexibles y competitivas adaptadas a las necesidades de cada institución,
                    garantizando el mejor servicio para tu equipo o comunidad.
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
