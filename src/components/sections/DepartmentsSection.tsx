'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  alpha
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const departments = [
  {
    title: 'Cardiología',
    description: 'Especialistas en el diagnóstico y tratamiento de enfermedades del corazón y sistema cardiovascular.',
    icon: FavoriteIcon,
    color: '#2E7D5E' // Verde oscuro como en la imagen
  },
  {
    title: 'Neurología',
    description: 'Atención especializada para trastornos del sistema nervioso, cerebro y médula espinal.',
    icon: PsychologyIcon,
    color: '#3A9B7A' // Verde medio
  },
  {
    title: 'Ortopedia',
    description: 'Tratamiento de lesiones y enfermedades del sistema musculoesquelético y articulaciones.',
    icon: AccessibilityNewIcon,
    color: '#46B88E' // Verde más claro
  },
  {
    title: 'Oftalmología',
    description: 'Cuidado integral de la salud visual con equipos de última generación.',
    icon: VisibilityIcon,
    color: '#2E7D5E'
  },
  {
    title: 'Pediatría',
    description: 'Atención médica especializada para bebés, niños y adolescentes.',
    icon: ChildCareIcon,
    color: '#3A9B7A'
  },
  {
    title: 'Medicina General',
    description: 'Consulta general para prevención, diagnóstico y tratamiento de enfermedades comunes.',
    icon: LocalPharmacyIcon,
    color: '#46B88E'
  }
];

export default function DepartmentsSection() {
  return (
    <Box
      id="departamentos"
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
            Departamentos Médicos
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: '700px', mx: 'auto', fontSize: '1.1rem' }}
          >
            Contamos con especialistas certificados en diversas áreas de la medicina
            para brindarte la mejor atención médica.
          </Typography>
        </Box>

        {/* Departments Grid */}
        <Grid container spacing={3}>
          {departments.map((dept, index) => {
            const IconComponent = dept.icon;
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: dept.color,
                    color: 'white',
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      '& .dept-icon': {
                        transform: 'scale(1.1) rotate(5deg)'
                      },
                      '& .learn-more-btn': {
                        bgcolor: alpha('#FFFFFF', 0.2)
                      }
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '150px',
                      height: '150px',
                      background: `radial-gradient(circle, ${alpha('#FFFFFF', 0.1)} 0%, transparent 70%)`,
                      borderRadius: '50%',
                      transform: 'translate(50%, -50%)'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 4, position: 'relative', zIndex: 1 }}>
                    {/* Icon */}
                    <Box
                      className="dept-icon"
                      sx={{
                        mb: 3,
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <IconComponent
                        sx={{
                          fontSize: 56,
                          color: 'white',
                          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))'
                        }}
                      />
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                        mb: 2
                      }}
                    >
                      {dept.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 3,
                        lineHeight: 1.6,
                        color: alpha('#FFFFFF', 0.95)
                      }}
                    >
                      {dept.description}
                    </Typography>

                    {/* Learn More Button */}
                    <Button
                      className="learn-more-btn"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        textTransform: 'none',
                        p: 0,
                        '&:hover': {
                          bgcolor: 'transparent'
                        }
                      }}
                    >
                      Leer más
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* CTA Section */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            ¿Necesitas información sobre otros servicios?
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'primary.main',
              px: 5,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
          >
            Ver Todos los Servicios
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
