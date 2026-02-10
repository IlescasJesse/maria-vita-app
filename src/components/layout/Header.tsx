'use client';

import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Button,
  Box,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Image from 'next/image';
import { useState } from 'react';
import { alpha } from '@mui/material';
import Link from 'next/link';

const navItems = [
  { label: 'INICIO', href: '/#inicio' },
  { label: 'ACERCA DE', href: '/#acerca' },
  { 
    label: 'SERVICIOS', 
    href: '/#servicios',
    submenu: [
      { label: 'Servicios Médicos', href: '/servicios/servicios-medicos' },
      { label: 'Laboratorios', href: '/servicios/laboratorios' }
    ]
  },
  { label: 'SEGURO', href: '/#seguro' },
  { label: 'CONTACTO', href: '/#contacto' }
];

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box
        component="a"
        href="/"
        sx={{
          position: 'relative',
          height: 50,
          width: 180,
          mx: 'auto',
          my: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',

        }}
      >
        <Image
          src="/logo.jpeg"
          alt="Maria Vita de Antequera - Clínica y Laboratorios"
          fill
          style={{ objectFit: 'contain' }}
        />
      </Box>
      <List>
        {navItems.map((item) => (
          item.submenu ? (
            <Box key={item.label}>
              <ListItem disablePadding>
                <ListItemButton 
                  sx={{ textAlign: 'center' }}
                  disabled
                >
                  <ListItemText 
                    primary={item.label} 
                    sx={{ 
                      '& .MuiTypography-root': { 
                        fontWeight: 600,
                        color: 'primary.main'
                      } 
                    }} 
                  />
                </ListItemButton>
              </ListItem>
              {item.submenu.map((subItem) => (
                <ListItem key={subItem.label} disablePadding>
                  <ListItemButton 
                    sx={{ textAlign: 'center', pl: 4 }} 
                    component={Link}
                    href={subItem.href}
                    onClick={handleDrawerToggle}
                  >
                    <ListItemText 
                      primary={subItem.label}
                      sx={{ 
                        '& .MuiTypography-root': { 
                          fontSize: '0.9rem'
                        } 
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </Box>
          ) : (
            <ListItem key={item.label} disablePadding>
              <ListItemButton 
                sx={{ textAlign: 'center' }} 
                component="a"
                href={item.href}
                onClick={handleDrawerToggle}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          )
        ))}
        <ListItem disablePadding>
          <ListItemButton 
            sx={{ textAlign: 'center', justifyContent: 'center' }} 
            href="/login"
          >
            <LoginIcon sx={{ mr: 1, fontSize: 18 }} />
            <ListItemText primary="Entrar" sx={{ '& .MuiTypography-root': { fontSize: '0.75rem' } }} /> 
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* Top Bar - Contact Info */}
      <Box
        sx={{
          bgcolor: 'grey.50',
          borderBottom: 1,
          borderColor: 'divider',
          py: 1,
          display: { xs: 'none', md: 'block' }
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Stack direction="row" spacing={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Calle Miguel Cabrera, 402, Colonia Centro, Oaxaca de Juárez, Oax. CP. 68000
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Tel: 951 243 1567
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Main Navigation */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 80 } }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Box
                component="a"
                href="/"
                sx={{
                  position: 'relative',
                  height: { xs: 50, md: 60 },
                  width: { xs: 180, md: 220 },
                  cursor: 'pointer',
                  display: 'block',
                  transition: 'opacity 0.2s',
                  '&:hover': {
                    opacity: 0.8
                  }
                }}
              >
                <Image
                  src="/logo.jpeg"
                  alt="Maria Vita de Antequera - Clínica y Laboratorios"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Box>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Stack direction="row" spacing={1} alignItems="center">
                {navItems.map((item) => (
                  item.submenu ? (
                    <Box key={item.label}>
                      <Button
                        onClick={handleMenuClick}
                        endIcon={<KeyboardArrowDownIcon />}
                        sx={{
                          color: 'text.primary',
                          fontWeight: 500,
                          fontSize: '0.875rem',
                          px: 2,
                          '&:hover': {
                            bgcolor: 'action.hover',
                            color: 'primary.main'
                          }
                        }}
                      >
                        {item.label}
                      </Button>
                      <Menu
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={handleMenuClose}
                        MenuListProps={{
                          'aria-labelledby': 'servicios-button',
                        }}
                        sx={{
                          '& .MuiPaper-root': {
                            mt: 1,
                            minWidth: 200,
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        {item.submenu.map((subItem) => (
                          <MenuItem
                            key={subItem.label}
                            onClick={handleMenuClose}
                            sx={{
                              py: 1.5,
                              px: 2,
                              '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'white'
                              }
                            }}
                          >
                            <Link 
                              href={subItem.href}
                              style={{ 
                                textDecoration: 'none', 
                                color: 'inherit',
                                width: '100%',
                                display: 'block'
                              }}
                            >
                              {subItem.label}
                            </Link>
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  ) : (
                    <Button
                      key={item.label}
                      component="a"
                      href={item.href}
                      sx={{
                        color: 'text.primary',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        px: 2,
                        '&:hover': {
                          bgcolor: 'action.hover',
                          color: 'primary.main'
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  )
                ))}
                <Button
                  variant="outlined"
                  startIcon={<LoginIcon />}
                  href="/login"
                  sx={{
                    ml: 2,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    borderRadius: 2,
                    px: 3,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: 'primary.dark',
                      bgcolor: alpha('#00875F', 0.05)
                    }
                  }}
                >
                  Entrar
                </Button>
              </Stack>
            )}

            {/* Mobile menu icon */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
