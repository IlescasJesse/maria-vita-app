'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

export default function SpecialistDashboardPage() {
  const router = useRouter();
  const { isLoading } = useAuth();

  // Solo redirigir al dashboard principal - sin más verificaciones
  useEffect(() => {
    if (!isLoading) {
      router.replace('/dashboard');
    }
  }, [isLoading, router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography color="text.secondary">Cargando panel de especialista...</Typography>
    </Box>
  );
}
