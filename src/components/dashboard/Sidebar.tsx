/**
 * Sidebar de Navegación del Dashboard
 */

'use client';

import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, Chip, IconButton, useMediaQuery } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScienceIcon from '@mui/icons-material/Science';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import BarChartIcon from '@mui/icons-material/BarChart';
import PaymentIcon from '@mui/icons-material/Payment';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { useAuth } from '@/hooks/useAuth';
import { getRoleLabel, getRoleColor } from '@/lib/permissions';
import { useTheme } from '@mui/material/styles';

const DRAWER_WIDTH = 280;

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  isOpen: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
}

export default function Sidebar({ activeModule, onModuleChange, isOpen, mobileOpen, onToggle, onCloseMobile }: SidebarProps) {
  const { user, hasPermission } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!user) return null;

  const menuItems = [
    {
      id: 'overview',
      label: 'Resumen',
      icon: <DashboardIcon />,
      permission: null, // Todos pueden ver
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: <PeopleIcon />,
      permission: 'manage_users',
    },
    {
      id: 'appointments',
      label: 'Citas',
      icon: <CalendarMonthIcon />,
      permission: 'manage_appointments',
    },
    {
      id: 'studies',
      label: 'Estudios',
      icon: <ScienceIcon />,
      permission: 'manage_studies',
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: <AssessmentIcon />,
      permission: 'view_reports',
    },
    {
      id: 'analytics',
      label: 'Analíticas',
      icon: <BarChartIcon />,
      permission: 'view_analytics',
    },
    {
      id: 'billing',
      label: 'Facturación',
      icon: <PaymentIcon />,
      permission: 'manage_billing',
    },
    {
      id: 'database',
      label: 'Base de Datos',
      icon: <StorageIcon />,
      permission: 'manage_database',
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: <SettingsIcon />,
      permission: 'manage_settings',
    },
    {
      id: 'situacional',
      label: 'Situacional',
      icon: <AssignmentIcon />,
      permission: null, // Visible para todos los roles
    },
    {
      id: 'situacional_admin',
      label: 'Gestión Situacional',
      icon: <ManageSearchIcon />,
      permission: 'manage_situacional',
    },
  ];

  // Filtrar items según permisos
  const visibleItems = menuItems.filter(item =>
    !item.permission || hasPermission(item.permission)
  );

  const drawerContent = (
    <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <img
              src="/MARIA-VITA OUTLINED.png"
              alt="Maria Vita"
              style={{ width: 32, height: 32, objectFit: 'contain' }}
            />
            <Typography variant="h5" fontWeight="bold">
              Maria Vita
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Sistema de Gestión
          </Typography>
          <Chip
            label={getRoleLabel(user.role)}
            color={getRoleColor(user.role)}
            size="small"
            sx={{ mt: 1 }}
          />
        </Box>

        <IconButton onClick={isMobile ? onCloseMobile : onToggle} size="small" aria-label="Ocultar menú lateral">
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      <Divider />

      <List sx={{ flex: 1, py: 2 }}>
        {visibleItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={activeModule === item.id}
              onClick={() => {
                onModuleChange(item.id);
                if (isMobile) {
                  onCloseMobile();
                }
              }}
              sx={{
                mx: 1,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          {user.email}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onCloseMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: 'background.paper',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="persistent"
        open={isOpen}
        sx={{
          display: { xs: 'none', md: 'block' },
          width: isOpen ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            position: 'relative',
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
