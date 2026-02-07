'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  alpha
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';

const contactInfo = [
  {
    icon: LocationOnIcon,
    title: 'Dirección',
    content: 'Calle Miguel Cabrera, 402, Colonia Centro, Oaxaca de Juárez, Oax. CP. 68000'
  },
  {
    icon: PhoneIcon,
    title: 'Teléfono',
    content: '951 243 1567'
  },
  {
    icon: EmailIcon,
    title: 'Email',
    content: 'contacto@clinicamedica.com'
  },
  {
    icon: AccessTimeIcon,
    title: 'Horario',
    content: 'Lun - Vie: 8:00 AM - 8:00 PM\nSáb: 9:00 AM - 2:00 PM'
  }
];

export default function ContactSection() {
  return (
    <Box
      id="contacto"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'grey.50'
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
            CONTÁCTANOS
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
            Estamos Aquí Para Ayudarte
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: '700px', mx: 'auto', fontSize: '1.1rem' }}
          >
            Contáctanos para agendar una cita o resolver cualquier duda sobre
            nuestros servicios médicos.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <Card
                    key={index}
                    elevation={0}
                    sx={{
                      bgcolor: 'background.paper',
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: `0 4px 12px ${alpha('#00875F', 0.1)}`,
                        '& .contact-icon': {
                          bgcolor: 'primary.main',
                          color: 'white'
                        }
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Box
                          className="contact-icon"
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 1.5,
                            bgcolor: alpha('#00875F', 0.1),
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <IconComponent sx={{ fontSize: 24 }} />
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              mb: 0.5,
                              color: 'text.secondary'
                            }}
                          >
                            {info.title}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'text.primary',
                              whiteSpace: 'pre-line'
                            }}
                          >
                            {info.content}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Card
              elevation={0}
              sx={{
                bgcolor: 'background.paper',
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
                    mb: 3
                  }}
                >
                  Envíanos un Mensaje
                </Typography>
                <Stack spacing={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nombre completo"
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Teléfono"
                        variant="outlined"
                        required
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    variant="outlined"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Asunto"
                    variant="outlined"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Mensaje"
                    multiline
                    rows={6}
                    variant="outlined"
                    required
                  />
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<SendIcon />}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: 'primary.dark'
                      }
                    }}
                  >
                    Enviar Mensaje
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Map Placeholder */}
        <Box
          sx={{
            mt: 6,
            height: 400,
            borderRadius: 3,
            overflow: 'hidden',
            border: 1,
            borderColor: 'divider',
            bgcolor: alpha('#353080', 0.05),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <LocationOnIcon sx={{ fontSize: 64, color: 'primary.main' }} />
            <Typography variant="h6" color="text.secondary">
              Mapa de ubicación
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Calle Miguel Cabrera, 402, Colonia Centro, Oaxaca de Juárez, Oax. CP. 68000
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
