'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  Avatar,
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error al parsear usuario:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  const getRoleLabel = (role: string) => {
    const roles: { [key: string]: string } = {
      ADMIN: 'Administrador',
      SPECIALIST: 'Especialista',
      PATIENT: 'Paciente',
      RECEPTIONIST: 'Recepcionista'
    };
    return roles[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: 'primary' | 'success' | 'info' | 'warning' } = {
      ADMIN: 'primary',
      SPECIALIST: 'success',
      PATIENT: 'info',
      RECEPTIONIST: 'warning'
    };
    return colors[role] || 'info';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #00875F 0%, #006644 100%)',
            color: 'white'
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontSize: '2rem',
                  fontWeight: 700
                }}
              >
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  ¡Bienvenido, {user.firstName}!
                </Typography>
                <Chip
                  label={getRoleLabel(user.role)}
                  color={getRoleColor(user.role)}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Stack>

            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Cerrar Sesión
            </Button>
          </Stack>
        </Paper>

        {/* Información del Usuario */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                  Información Personal
                </Typography>

                <Stack spacing={2} mt={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <PersonIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Nombre Completo
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {user.firstName} {user.lastName}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <EmailIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Correo Electrónico
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {user.email}
                      </Typography>
                    </Box>
                  </Stack>

                  {user.phone && (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <PhoneIcon color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Teléfono
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {user.phone}
                        </Typography>
                      </Box>
                    </Stack>
                  )}

                  <Stack direction="row" spacing={2} alignItems="center">
                    <BadgeIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Rol
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {getRoleLabel(user.role)}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom color="primary">
                  Próximamente
                </Typography>

                <Typography variant="body2" color="text.secondary" mt={2}>
                  Esta sección mostrará:
                </Typography>

                <Stack spacing={1} mt={2}>
                  <Typography variant="body2">• Citas programadas</Typography>
                  <Typography variant="body2">• Estudios pendientes</Typography>
                  <Typography variant="body2">• Notificaciones</Typography>
                  <Typography variant="body2">• Accesos rápidos</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Botón para volver al inicio */}
        <Box textAlign="center" mt={4}>
          <Button
            variant="text"
            onClick={() => router.push('/')}
            sx={{ textTransform: 'none' }}
          >
            ← Volver al inicio
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
