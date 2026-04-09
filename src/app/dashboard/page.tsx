/**
 * Dashboard Principal - Maria Vita
 * Sistema completo con navegación lateral y módulos según permisos
 */

'use client';

import { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Stack } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/dashboard/Sidebar';
import ClinicAvatar from '@/components/ClinicAvatar';

// Importar todos los módulos
import OverviewModule from '@/components/dashboard/modules/OverviewModule';
import UsersModule from '@/components/dashboard/modules/UsersModule';
import AppointmentsModule from '@/components/dashboard/modules/AppointmentsModule';
import StudiesModule from '@/components/dashboard/modules/StudiesModule';
import ReportsModule from '@/components/dashboard/modules/ReportsModule';
import AnalyticsModule from '@/components/dashboard/modules/AnalyticsModule';
import BillingModule from '@/components/dashboard/modules/BillingModule';
import DatabaseModule from '@/components/dashboard/modules/DatabaseModule';
import SettingsModule from '@/components/dashboard/modules/SettingsModule';
import SituacionalModule from '@/components/dashboard/modules/SituacionalModule';

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeModule, setActiveModule] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
      case 'database':
        return <DatabaseModule />;
      case 'settings':
        return <SettingsModule />;
      case 'situacional':
        return <SituacionalModule />;
      case 'situacional_admin':
        return <SituacionalModule adminView />;
      default:
        return <OverviewModule />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        isOpen={isSidebarOpen}
        mobileOpen={mobileSidebarOpen}
        onToggle={() => setIsSidebarOpen((previous) => !previous)}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Contenido Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          backgroundColor: 'grey.50',
          width: '100%',
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
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => {
                if (isMobile) {
                  setMobileSidebarOpen(true);
                  return;
                }

                setIsSidebarOpen((previous) => !previous);
              }}
              sx={{ mr: 2 }}
              title="Mostrar u ocultar menú"
            >
              <MenuIcon />
            </IconButton>

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
