'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  alpha,
  Button
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ScienceIcon from '@mui/icons-material/Science';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import BiotechIcon from '@mui/icons-material/Biotech';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import Link from 'next/link';

const medicalServices = [
  { name: 'Cardiología', icon: FavoriteIcon },
  { name: 'Neurología', icon: PsychologyIcon },
  { name: 'Ortopedia', icon: AccessibilityNewIcon },
  { name: 'Oftalmología', icon: VisibilityIcon },
  { name: 'Pediatría', icon: ChildCareIcon },
  { name: 'Medicina General', icon: LocalPharmacyIcon }
];

const laboratoryServices = [
  { name: 'Química Sanguínea', icon: BloodtypeIcon },
  { name: 'Hematología', icon: BiotechIcon },
  { name: 'Microbiología', icon: VaccinesIcon },
  { name: 'Serología', icon: ScienceIcon },
  { name: 'Inmunología', icon: LocalHospitalIcon },
  { name: 'Hormonas', icon: ScienceIcon }
];

export default function ServicesCardsSection() {
  return (
    <Box
      id="servicios"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              fontSize: '0.875rem',
              letterSpacing: 1.5
            }}
          >
            NUESTROS SERVICIOS
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mt: 1,
              mb: 2
            }}
          >
            Atención Médica Integral
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: '700px', mx: 'auto', fontSize: '1.1rem' }}
          >
            Descubre nuestros servicios médicos especializados y nuestro laboratorio clínico de vanguardia.
          </Typography>
        </Box>

        {/* Services Cards Grid */}
        <Grid container spacing={4}>
          {/* Servicios Médicos Card */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: '100%',
                position: 'relative',
                '&:hover .slide-overlay-medical': {
                  left: '0',
                },
                '&:hover .main-content-medical': {
                  opacity: 0,
                }
              }}
            >
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  minHeight: 500,
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: '#2E7D5E',
                  color: 'white',
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(46, 125, 94, 0.3)',
                  }
                }}
              >
                {/* Contenido Principal */}
                <CardContent 
                  className="main-content-medical"
                  sx={{ 
                    flexGrow: 1, 
                    p: 4, 
                    position: 'relative', 
                    zIndex: 2,
                    transition: 'opacity 0.4s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                <Box>
                  <LocalHospitalIcon
                    sx={{
                      fontSize: 80,
                      mb: 3,
                      filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))'
                    }}
                  />
                  <Typography
                    variant="h4"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 700, mb: 2 }}
                  >
                    Servicios Médicos
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.6,
                      color: alpha('#FFFFFF', 0.95)
                    }}
                  >
                    Especialistas certificados en diversas áreas de la medicina para brindarte la mejor atención.
                  </Typography>
                </Box>
                
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Ver servicios
                  </Typography>
                  <ArrowForwardIcon sx={{ fontSize: 28 }} />
                </Stack>
              </CardContent>

              {/* Overlay con servicios - se desliza desde la derecha */}
              <Box
                className="slide-overlay-medical"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: '100%',
                  width: '100%',
                  height: '100%',
                  bgcolor: alpha('#FFFFFF', 0.75),
                  backdropFilter: 'blur(10px)',
                  transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '-4px 0 20px rgba(0,0,0,0.15)'
                }}
              >
                <Box sx={{ p: { xs: 3, md: 5 }, width: '100%', maxWidth: '500px', mx: 'auto' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      color: '#2E7D5E',
                      textAlign: 'center'
                    }}
                  >
                    Especialidades
                  </Typography>
                  <Stack spacing={2}>
                    {medicalServices.map((service, index) => {
                      const ServiceIcon = service.icon;
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: alpha('#2E7D5E', 0.1),
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: alpha('#2E7D5E', 0.2),
                              transform: 'translateX(4px)'
                            }
                          }}
                        >
                          <ServiceIcon sx={{ fontSize: 24, color: '#2E7D5E' }} />
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: '#2E7D5E'
                            }}
                          >
                            {service.name}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                  <Button
                    component={Link}
                    href="/servicios/servicios-medicos"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      bgcolor: '#2E7D5E',
                      color: 'white',
                      fontWeight: 600,
                      py: 1.5,
                      '&:hover': {
                        bgcolor: '#25664D'
                      }
                    }}
                  >
                    Ver todos los servicios
                  </Button>
                </Box>
              </Box>
            </Card>
          </Box>
          </Grid>

          {/* Laboratorios Card */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: '100%',
                position: 'relative',
                '&:hover .slide-overlay-lab': {
                  right: '0',
                },
                '&:hover .main-content-lab': {
                  opacity: 0,
                }
              }}
            >
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  minHeight: 500,
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: '#353080',
                  color: 'white',
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(53, 48, 128, 0.3)',
                  }
                }}
              >
                {/* Contenido Principal */}
                <CardContent 
                  className="main-content-lab"
                  sx={{ 
                    flexGrow: 1, 
                    p: 4, 
                    position: 'relative', 
                    zIndex: 2,
                    transition: 'opacity 0.4s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                <Box>
                  <ScienceIcon
                    sx={{
                      fontSize: 80,
                      mb: 3,
                      filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))'
                    }}
                  />
                  <Typography
                    variant="h4"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 700, mb: 2 }}
                  >
                    Laboratorios
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.6,
                      color: alpha('#FFFFFF', 0.95)
                    }}
                  >
                    Tecnología de vanguardia para análisis clínicos precisos y confiables.
                  </Typography>
                </Box>
                
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Ver servicios
                  </Typography>
                  <ArrowForwardIcon sx={{ fontSize: 28 }} />
                </Stack>
              </CardContent>

              {/* Overlay con servicios - se desliza desde la izquierda */}
              <Box
                className="slide-overlay-lab"
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: '100%',
                  width: '100%',
                  height: '100%',
                  bgcolor: alpha('#FFFFFF', 0.75),
                  backdropFilter: 'blur(10px)',
                  transition: 'right 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '4px 0 20px rgba(0,0,0,0.15)'
                }}
              >
                <Box sx={{ p: { xs: 3, md: 5 }, width: '100%', maxWidth: '500px', mx: 'auto' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      color: '#353080',
                      textAlign: 'center'
                    }}
                  >
                    Estudios Disponibles
                  </Typography>
                  <Stack spacing={2}>
                    {laboratoryServices.map((service, index) => {
                      const ServiceIcon = service.icon;
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: alpha('#353080', 0.1),
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: alpha('#353080', 0.2),
                              transform: 'translateX(-4px)'
                            }
                          }}
                        >
                          <ServiceIcon sx={{ fontSize: 24, color: '#353080' }} />
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: '#353080'
                            }}
                          >
                            {service.name}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                  <Button
                    component={Link}
                    href="/servicios/laboratorios"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      bgcolor: '#353080',
                      color: 'white',
                      fontWeight: 600,
                      py: 1.5,
                      '&:hover': {
                        bgcolor: '#2A2666'
                      }
                    }}
                  >
                    Ver todos los estudios
                  </Button>
                </Box>
              </Box>
            </Card>
          </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
