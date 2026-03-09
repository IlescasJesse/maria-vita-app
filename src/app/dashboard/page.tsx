/**
 * Dashboard Principal - Maria Vita
 * Sistema completo con navegación lateral y módulos según permisos
 */

'use client';

import { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Stack } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/dashboard/Sidebar';
import ClinicAvatar from '@/components/ClinicAvatar';

// Importar todos los módulos
import OverviewModule from '@/components/dashboard/modules/OverviewModule';
import UsersModule from '@/components/dashboard/modules/UsersModule';
import SpecialistsModule from '@/components/dashboard/modules/SpecialistsModule';
import AppointmentsModule from '@/components/dashboard/modules/AppointmentsModule';
import StudiesModule from '@/components/dashboard/modules/StudiesModule';
import ReportsModule from '@/components/dashboard/modules/ReportsModule';
import AnalyticsModule from '@/components/dashboard/modules/AnalyticsModule';
import BillingModule from '@/components/dashboard/modules/BillingModule';
import AdminsModule from '@/components/dashboard/modules/AdminsModule';
import DatabaseModule from '@/components/dashboard/modules/DatabaseModule';
import SettingsModule from '@/components/dashboard/modules/SettingsModule';

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [activeModule, setActiveModule] = useState('overview');
  const userPhotoUrl = (user as any)?.specialist?.photoUrl || (user as any)?.photoUrl;

  // Sin verificaciones de isNew - el login ya manejó el routing
  if (isLoading || !isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  // Renderizar el módulo activo
  const renderModule = () => {
    switch (activeModule) {
      case 'overview':
        return <OverviewModule />;
      case 'users':
        return <UsersModule />;
      case 'specialists':
        return <SpecialistsModule />;
      case 'appointments':
        return <AppointmentsModule />;
      case 'studies':
        return <StudiesModule />;
      case 'reports':
        return <ReportsModule />;
      case 'analytics':
        return <AnalyticsModule />;
      case 'billing':
        return <BillingModule />;
      case 'admins':
        return <AdminsModule />;
      case 'database':
        return <DatabaseModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <OverviewModule />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />

      {/* Contenido Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          backgroundColor: 'grey.50',
        }}
      >
        {/* AppBar Superior */}
        <AppBar
          position="sticky"
          elevation={1}
          sx={{
            backgroundColor: 'white',
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Panel de Control
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <ClinicAvatar
                firstName={user.firstName}
                lastName={user.lastName}
                photoUrl={userPhotoUrl}
                sx={{ width: 36, height: 36, fontSize: '0.875rem' }}
              />
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" fontWeight="medium">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              <IconButton onClick={logout} color="inherit" title="Cerrar Sesión">
                <LogoutIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Área de Contenido */}
        <Box sx={{ p: 4 }}>
          {renderModule()}
        </Box>
      </Box>
    </Box>
  );
}
