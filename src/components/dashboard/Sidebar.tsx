/**
 * Sidebar de Navegación del Dashboard
 */

'use client';

import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, Chip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScienceIcon from '@mui/icons-material/Science';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorageIcon from '@mui/icons-material/Storage';
import BarChartIcon from '@mui/icons-material/BarChart';
import PaymentIcon from '@mui/icons-material/Payment';
import { useAuth } from '@/hooks/useAuth';
import { getRoleLabel, getRoleColor } from '@/lib/permissions';

const DRAWER_WIDTH = 280;

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

export default function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  const { user, hasPermission } = useAuth();

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
      id: 'specialists',
      label: 'Especialistas',
      icon: <LocalHospitalIcon />,
      permission: 'manage_specialists',
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
      id: 'admins',
      label: 'Administradores',
      icon: <AdminPanelSettingsIcon />,
      permission: 'manage_admins',
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
  ];

  // Filtrar items según permisos
  const visibleItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Maria Vita
          </Typography>
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
        
        <Divider />
        
        <List sx={{ flex: 1, py: 2 }}>
          {visibleItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={activeModule === item.id}
                onClick={() => onModuleChange(item.id)}
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
    </Drawer>
  );
}
