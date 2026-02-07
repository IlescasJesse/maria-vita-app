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
  ListItemText
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import Image from 'next/image';
import { useState } from 'react';
import { alpha } from '@mui/material';
import { handleSmoothScroll } from '@/lib/smoothScroll';

const navItems = [
  { label: 'INICIO', href: '#inicio' },
  { label: 'ACERCA DE', href: '#acerca' },
  { label: 'DEPARTAMENTOS', href: '#departamentos' },
  { label: 'SEGURO', href: '#seguro' },
  { label: 'CONTACTO', href: '#contacto' }
];

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box
        component="a"
        href="#inicio"
        onClick={(e: any) => {
          handleSmoothScroll(e, '#inicio');
          handleDrawerToggle();
        }}
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
          <ListItem key={item.label} disablePadding>
            <ListItemButton 
              sx={{ textAlign: 'center' }} 
              href={item.href}
              onClick={(e: any) => {
                handleSmoothScroll(e, item.href); 
                handleDrawerToggle();
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center', justifyContent: 'center' }} href="/login">
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
                href="#inicio"
                onClick={(e: any) => handleSmoothScroll(e, '#inicio')}
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
                  <Button
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.href)}
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
                ))}
                <Button
                  variant="outlined"
                  startIcon={<LoginIcon />}
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
