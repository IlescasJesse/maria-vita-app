'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Link as MuiLink,
  IconButton,
  InputAdornment,
  Divider
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Error al iniciar sesión');
      }

      // Guardar token y datos del usuario
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Redirigir según estado y rol
      const role = data.data.user.role;
      // isNew puede venir como 1/0 (MySQL) o true/false
      if (data.data.user.isNew === true || data.data.user.isNew === 1) {
        // Si es ADMIN o SPECIALIST nuevo, va a completar perfil de admin
        if (role === 'ADMIN' || role === 'SPECIALIST') {
          router.push('/completar-perfil/admin');
        } else {
          // Otros roles van a completar perfil normal
          router.push('/completar-perfil');
        }
        return;
      }
      if (role === 'SUPERADMIN' || role === 'ADMIN' || role === 'RECEPTIONIST') {
        router.push('/dashboard');
      } else if (role === 'SPECIALIST') {
        router.push('/dashboard/especialista');
      } else if (role === 'PATIENT') {
        router.push('/dashboard/paciente');
      } else {
        // Fallback para cualquier otro rol
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            background: 'white'
          }}
        >
          {/* Logo y Título */}
          <Stack spacing={3} alignItems="center" mb={4}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  position: 'relative',
                  height: 80,
                  width: 240,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              >
                <Image
                  src="/logo.jpeg"
                  alt="Maria Vita de Antequera"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Box>
            </Link>

            <Box textAlign="center">
              <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                Bienvenido
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ingresa tus credenciales para continuar
              </Typography>
            </Box>
          </Stack>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Correo Electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              <Box textAlign="right">
                <MuiLink
                  component={Link}
                  href="/recuperar-password"
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </MuiLink>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: 3,
                  '&:hover': {
                    boxShadow: 6
                  }
                }}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </Stack>
          </form>

          {/* Divider y Registro */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              o
            </Typography>
          </Divider>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary" display="inline">
              ¿No tienes cuenta?{' '}
            </Typography>
            <MuiLink
              component={Link}
              href="/registro"
              variant="body2"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Regístrate aquí
            </MuiLink>
          </Box>

          {/* Link para volver */}
          <Box textAlign="center" mt={3}>
            <Button
              component={Link}
              href="/"
              variant="text"
              sx={{
                textTransform: 'none',
                color: 'text.secondary'
              }}
            >
              ← Volver al inicio
            </Button>
          </Box>
        </Paper>

        {/* Footer */}
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          mt={3}
        >
          © {new Date().getFullYear()} Maria Vita de Antequera. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
}
