'use client';

import { Box } from '@mui/material';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DepartmentsSection from '@/components/sections/DepartmentsSection';

export default function ServiciosMedicosPage() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Header />
      <Box sx={{ '& > div': { pt: 0 } }}>
        <DepartmentsSection />
      </Box>
      <Footer />
    </Box>
  );
}
