'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  alpha
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const features = [
  {
    icon: VerifiedIcon,
    title: 'Médicos Certificados',
    description: 'Personal médico con certificaciones nacionales e internacionales'
  },
  {
    icon: LocalHospitalIcon,
    title: 'Tecnología Avanzada',
    description: 'Equipos de última generación para diagnósticos precisos'
  },
  {
    icon: AccessTimeIcon,
    title: 'Disponibilidad 24/7',
    description: 'Servicio de urgencias disponible las 24 horas del día'
  },
  {
    icon: PeopleIcon,
    title: 'Atención Personalizada',
    description: 'Cuidado centrado en el paciente con seguimiento continuo'
  }
];

export default function AboutSection() {
  return (
    <Box
      id="acerca"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'grey.50'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="overline"
              sx={{
                color: 'success.main',
                fontWeight: 600,
                fontSize: '0.875rem',
                letterSpacing: 1.5
              }}
            >
              ACERCA DE NOSOTROS
            </Typography>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                mt: 1,
                mb: 3
              }}
            >
              Excelencia en Atención Médica
            </Typography>
            <Typography
              variant="body1"
              paragraph
              color="text.secondary"
              sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}
            >
              Con más de 25 años de experiencia, nuestra clínica se ha consolidado como
              un referente en atención médica de calidad. Nos comprometemos a ofrecer
              servicios de salud integrales con un enfoque humano y profesional.
            </Typography>
            <Typography
              variant="body1"
              paragraph
              color="text.secondary"
              sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}
            >
              Nuestro equipo multidisciplinario trabaja en conjunto para garantizar
              diagnósticos precisos y tratamientos efectivos, siempre poniendo la
              seguridad y bienestar del paciente en primer lugar.
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 1.5, color: 'primary.main' }}
              >
                Misión
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: '1.05rem', lineHeight: 1.8 }}
              >
                Cuidar la vida con ciencia, ética y humanidad, integrando el diagnóstico de laboratorio
                y la atención médica para ofrecer respuestas claras, oportunas y confiables a cada persona.
              </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 1.5, color: 'primary.main' }}
              >
                Visión
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: '1.05rem', lineHeight: 1.8 }}
              >
                Ser un referente de medicina integral, donde el conocimiento científico y el trato humano
                se unan para transformar la manera de diagnosticar y cuidar la salud.
              </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 1.5, color: 'primary.main' }}
              >
                Valores
              </Typography>
              <Stack spacing={1.5} sx={{ pl: 1 }}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  • Humanidad: Cada muestra y cada consulta pertenecen a una persona, no a un número.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  • Ética: Decidimos siempre pensando en el bien del paciente.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  • Excelencia: Precisión científica al servicio de la vida.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  • Compromiso: Acompañamos al paciente en cada etapa de su diagnóstico.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  • Respeto: A la dignidad, al tiempo y a la historia de cada persona.
                </Typography>
              </Stack>
            </Box>

            {/* Stats */}
            <Stack direction="row" spacing={4} sx={{ mt: 4 }}>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: 'secondary.main',
                    mb: 0.5
                  }}
                >
                  25+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Años de experiencia
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    mb: 0.5
                  }}
                >
                  50+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Especialistas
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: 'secondary.main',
                    mb: 0.5
                  }}
                >
                  10k+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pacientes atendidos
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Right Content - Features Grid */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: `0 4px 12px ${alpha('#00875F', 0.1)}`,
                          transform: 'translateY(-4px)',
                          '& .feature-icon': {
                            bgcolor: 'primary.main',
                            color: 'white'
                          }
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          className="feature-icon"
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            bgcolor: alpha('#00875F', 0.1),
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <IconComponent sx={{ fontSize: 28 }} />
                        </Box>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ fontWeight: 600 }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.6 }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
