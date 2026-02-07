'use client';

import { Box, Button, useTheme, useMediaQuery } from '@mui/material';
import { useState, useEffect } from 'react';
import { handleSmoothScroll } from '@/lib/smoothScroll';

const sections = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'acerca', label: 'Acerca' },
  { id: 'departamentos', label: 'Departamentos' },
  { id: 'seguro', label: 'Seguro' },
  { id: 'contacto', label: 'Contacto' }
];

export default function ScrollIndicators() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const handleScroll = () => {
      let current = 'inicio';
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            current = section.id;
          }
        }
      }
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleIndicatorClick = (e: any, sectionId: string) => {
    handleSmoothScroll(e, `#${sectionId}`);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        right: { xs: 16, md: 32 },
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        zIndex: 40,
      }}
    >
      {sections.map((section) => (
        <Button
          key={section.id}
          onClick={(e) => handleIndicatorClick(e, section.id)}
          sx={{
            minWidth: isMobile ? 12 : 16,
            width: isMobile ? 12 : 16,
            height: isMobile ? 12 : 16,
            padding: 0,
            borderRadius: '50%',
            bgcolor: activeSection === section.id ? 'primary.main' : 'grey.300',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'primary.main',
              transform: 'scale(1.3)',
              width: isMobile ? 18 : 20,
              height: isMobile ? 18 : 20,
            },
          }}
          title={section.label}
        />
      ))}
    </Box>
  );
}
