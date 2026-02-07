'use client';

import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import ConstructionIcon from '@mui/icons-material/Construction';

export default function RecuperarPasswordPage() {
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
            background: 'white',
            textAlign: 'center'
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                position: 'relative',
                height: 80,
                width: 240,
                cursor: 'pointer',
                transition: 'opacity 0.2s',
                mx: 'auto',
                mb: 3,
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

          <ConstructionIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />

          <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
            En Construcción
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={4}>
            La funcionalidad de recuperación de contraseña estará disponible próximamente.
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={4}>
            Por favor, contacta al administrador del sistema para restablecer tu contraseña.
          </Typography>

          <Stack spacing={2}>
            <Button
              component={Link}
              href="/login"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Volver al Login
            </Button>

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
          </Stack>
        </Paper>

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
