'use client';

import { Box, Container, Typography, Button, Stack, alpha, IconButton, keyframes } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PhoneIcon from '@mui/icons-material/Phone';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { smoothScrollTo } from '@/lib/smoothScroll';

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

export default function HeroSection() {
  return (
    <Box
      id="inicio"
      sx={{
        position: 'relative',
        minHeight: { xs: '500px', md: '600px' },
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/hero-section.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0,135,95,0.2) 0%, rgba(53,48,128,0.2) 100%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ maxWidth: '700px' }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' },
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              mb: 2
            }}
          >
            Atención Médica de Calidad
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              lineHeight: 1.6,
              textShadow: '0 1px 5px rgba(0,0,0,0.3)',
              color: 'rgba(255,255,255,0.95)'
            }}
          >
            Servicios médicos especializados con tecnología de vanguardia y personal altamente calificado.
            Tu salud es nuestra prioridad.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              size="large"
              startIcon={<CalendarMonthIcon />}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 600,
                
                '&:hover': {
                  bgcolor: 'primary.dark',
                  boxShadow: '0 6px 20px rgba(0,135,95,0.6)'
                }
              }}
            >
              Agendar Cita
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PhoneIcon />}
              sx={{
                borderColor: 'primary.light',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  borderColor: 'primary.main',
                  bgcolor: alpha('#00875F', 0.1)
                }
              }}
            >
              Contactar
            </Button>
          </Stack>
        </Box>
      </Container>

      {/* Scroll Down Indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2
        }}
      >
        <IconButton
          onClick={() => smoothScrollTo('acerca', 1200)}
          sx={{
            color: 'white',
            animation: `${bounce} 2s infinite`,
            '&:hover': {
              bgcolor: alpha('#FFFFFF', 0.1)
            }
          }}
          aria-label="Scroll abajo"
        >
          <KeyboardArrowDownIcon sx={{ fontSize: 48 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
