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
import Image from 'next/image';
import { handleSmoothScroll } from '@/lib/smoothScroll';

const quickLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Acerca de', href: '#acerca' },
  { label: 'Departamentos', href: '#departamentos' },
  { label: 'Seguro', href: '#seguro' },
  { label: 'Contacto', href: '#contacto' }
];

const services = [
  'Cardiología',
  'Neurología',
  'Ortopedia',
  'Oftalmología',
  'Pediatría',
  'Medicina General'
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
                href="#inicio"
                onClick={(e: any) => handleSmoothScroll(e, '#inicio')}
                sx={{
                  position: 'relative',
                  height: 60,
                  width: 200,
                  mb: 1,
                  display: 'block',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              >
                <Image
                  src="/logo.jpeg"
                  alt="Maria Vita de Antequera - Clínica y Laboratorios"
                  fill
                  style={{ objectFit: 'contain', objectPosition: 'left' }}
                />
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
                  onClick={(e: any) => handleSmoothScroll(e, link.href)}
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
                <Typography
                  key={index}
                  variant="body2"
                  sx={{ color: 'grey.400', fontSize: '0.875rem' }}
                >
                  {service}
                </Typography>
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
