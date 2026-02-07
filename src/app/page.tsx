'use client';

import { Box } from '@mui/material';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollIndicators from '@/components/ScrollIndicators';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import DepartmentsSection from '@/components/sections/DepartmentsSection';
import ClinicalLabSection from '@/components/sections/ClinicalLabSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Header />
      <ScrollIndicators />
      <HeroSection />
      <AboutSection />
      <DepartmentsSection />
      <ClinicalLabSection />
      <ContactSection />
      <Footer />
    </Box>
  );
}
