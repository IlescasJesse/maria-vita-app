'use client';

import { Box } from '@mui/material';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClinicalLabSection from '@/components/sections/ClinicalLabSection';

export default function LaboratoriosPage() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Header />
      <Box sx={{ '& > div': { pt: 0 } }}>
        <ClinicalLabSection />
      </Box>
      <Footer />
    </Box>
  );
}
