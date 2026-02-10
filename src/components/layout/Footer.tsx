'use client';

import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  IconButton,
  Link,
  Divider,
  alpha
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const quickLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Acerca de', href: '/#acerca' },
  { label: 'Servicios Médicos', href: '/servicios/servicios-medicos' },
  { label: 'Laboratorios', href: '/servicios/laboratorios' },
  { label: 'Seguros', href: '/#seguro' },
  { label: 'Contacto', href: '/#contacto' }
];

const services = [
  { label: 'Cardiología', href: '/servicios/servicios-medicos' },
  { label: 'Neurología', href: '/servicios/servicios-medicos' },
  { label: 'Ortopedia', href: '/servicios/servicios-medicos' },
  { label: 'Laboratorio Clínico', href: '/servicios/laboratorios' },
  { label: 'Estudios Especializados', href: '/servicios/laboratorios' },
  { label: 'Consulta General', href: '/servicios/servicios-medicos' }
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'white',
        pt: 8,
        pb: 3
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Column */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Box
                component="a"
                href="/"
                sx={{
                  mb: 1,
                  display: 'block',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: 'white',
                    letterSpacing: 0.5,
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                >
                  MARIA VITA
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'grey.400',
                    letterSpacing: 2,
                    fontWeight: 500,
                    display: 'block',
                    mt: 0.5
                  }}
                >
                  DE ANTEQUERA
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'grey.400', lineHeight: 1.7 }}>
                Dedicados a proporcionar servicios de salud de la más alta calidad
                con un enfoque humano y profesional. Tu bienestar es nuestra misión.
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: alpha('#FFFFFF', 0.1),
                    color: 'white',
                    '&:hover': { bgcolor: 'success.main' }
                  }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: alpha('#FFFFFF', 0.1),
                    color: 'white',
                    '&:hover': { bgcolor: 'success.main' }
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: alpha('#FFFFFF', 0.1),
                    color: 'white',
                    '&:hover': { bgcolor: 'success.main' }
                  }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: alpha('#FFFFFF', 0.1),
                    color: 'white',
                    '&:hover': { bgcolor: 'success.main' }
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              Enlaces
            </Typography>
            <Stack spacing={1}>
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  underline="hover"
                  sx={{
                    color: 'grey.400',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    '&:hover': { color: 'primary.light' }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              Servicios
            </Typography>
            <Stack spacing={1}>
              {services.map((service, index) => (
                <Link
                  key={index}
                  href={service.href}
                  underline="hover"
                  sx={{
                    color: 'grey.400',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    '&:hover': { color: 'primary.light' }
                  }}
                >
                  {service.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              Contacto
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <LocationOnIcon sx={{ fontSize: 20, color: 'primary.light', mt: 0.3 }} />
                <Typography variant="body2" sx={{ color: 'grey.400', fontSize: '0.875rem' }}>
                  Calle Miguel Cabrera, 402, Colonia Centro, Oaxaca de Juárez, Oax. CP. 68000
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <PhoneIcon sx={{ fontSize: 20, color: 'primary.light' }} />
                <Typography variant="body2" sx={{ color: 'grey.400', fontSize: '0.875rem' }}>
                  951 243 1567
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <EmailIcon sx={{ fontSize: 20, color: 'primary.light' }} />
                <Typography variant="body2" sx={{ color: 'grey.400', fontSize: '0.875rem' }}>
                  contacto@clinicamedica.com
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: alpha('#FFFFFF', 0.1) }} />

        {/* Bottom Bar */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body2" sx={{ color: 'grey.500', textAlign: 'center' }}>
            © {new Date().getFullYear()} Maria Vita de Antequera. Todos los derechos reservados.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link
              href="#"
              underline="hover"
              sx={{
                color: 'grey.500',
                fontSize: '0.875rem',
                '&:hover': { color: 'primary.light' }
              }}
            >
              Privacidad
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{
                color: 'grey.500',
                fontSize: '0.875rem',
                '&:hover': { color: 'primary.light' }
              }}
            >
              Términos
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{
                color: 'grey.500',
                fontSize: '0.875rem',
                '&:hover': { color: 'primary.light' }
              }}
            >
              Ayuda
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
