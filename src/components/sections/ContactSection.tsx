'use client';

import { useState } from 'react';
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
  alpha,
  Alert
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import { contactFormSchema } from '@/lib/validations';

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
    content: 'contacto@maria-vita.mx'
  },
  {
    icon: AccessTimeIcon,
    title: 'Horario',
    content: 'Lun - Vie: 8:00 AM - 8:00 PM\nSáb: 9:00 AM - 2:00 PM'
  }
];

export default function ContactSection() {
  const whatsappLink = 'https://wa.me/5219512431567?text=Hola%2C%20necesito%20informacion%20acerca%20unos%20estudios%20y%2Fo%20consulta';
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setFormData({
      ...formData,
      [name]: e.target.value
    });
    setError(null);
    setSuccess(false);
    // Limpiar error del campo específico
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setFieldErrors({});

    try {
      // Validar con Zod
      const result = contactFormSchema.safeParse(formData);

      if (!result.success) {
        // Procesar errores de Zod
        const errors: Record<string, string> = {};
        result.error.errors.forEach((error) => {
          const path = error.path.join('.');
          errors[path] = error.message;
        });
        setFieldErrors(errors);

        // Mostrar primer error
        const firstError = result.error.errors[0];
        if (firstError) {
          setError(`⚠️ ${firstError.message}`);
        }
        setIsLoading(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

      const response = await fetch(`${apiUrl}/contact/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(result.data)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Error al enviar el mensaje');
      }

      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError(`❌ ${err instanceof Error ? err.message : 'Error al enviar el mensaje'}`);
    } finally {
      setIsLoading(false);
    }
  };
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
                            {info.title === 'Teléfono' ? (
                              <Box
                                component="a"
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  color: 'primary.main',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  '&:hover': { textDecoration: 'underline' }
                                }}
                              >
                                {info.content}
                              </Box>
                            ) : (
                              info.content
                            )}
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
                {success && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    ¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.
                  </Alert>
                )}
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                <form onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Nombre completo"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          variant="outlined"
                          required
                          error={Boolean(fieldErrors.name)}
                          helperText={fieldErrors.name || 'Mínimo 3 caracteres'}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Teléfono"
                          name="phone"
                          placeholder="Ej: 5551234567"
                          value={formData.phone}
                          onChange={handleChange}
                          variant="outlined"
                          error={Boolean(fieldErrors.phone)}
                          helperText={fieldErrors.phone || 'Teléfono de 10 dígitos (opcional)'}
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      error={Boolean(fieldErrors.email)}
                      helperText={fieldErrors.email || 'Correo válido requerido'}
                    />
                    <TextField
                      fullWidth
                      label="Asunto"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      variant="outlined"
                      required
                      error={Boolean(fieldErrors.subject)}
                      helperText={fieldErrors.subject || 'Mínimo 5 caracteres'}
                    />
                    <TextField
                      fullWidth
                      label="Mensaje"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      multiline
                      rows={6}
                      variant="outlined"
                      required
                      error={Boolean(fieldErrors.message)}
                      helperText={fieldErrors.message || 'Mínimo 10 caracteres'}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      endIcon={<SendIcon />}
                      disabled={isLoading}
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
                      {isLoading ? 'Enviando...' : 'Enviar Mensaje'}
                    </Button>
                  </Stack>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Google Maps */}
        <Box
          sx={{
            mt: 6,
            height: { xs: 300, md: 450 },
            borderRadius: 3,
            overflow: 'hidden',
            border: 1,
            borderColor: 'divider',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3814.5742828456816!2d-96.72661492471076!3d17.064584483863774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85c722289d92a0b7%3A0x1234567890abcdef!2sCalle%20Miguel%20Cabrera%20402%2C%20Centro%2C%2068000%20Oaxaca%20de%20Ju%C3%A1rez%2C%20Oax.!5e0!3m2!1ses!2smx!4v1707331200000!5m2!1ses!2smx"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Maria Vita - Calle Miguel Cabrera 402, Centro, Oaxaca"
          />
        </Box>
      </Container>
    </Box>
  );
}
