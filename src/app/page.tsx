'use client';

import { Box } from '@mui/material';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollIndicators from '@/components/ScrollIndicators';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ServicesCardsSection from '@/components/sections/ServicesCardsSection';
import InsuranceSection from '@/components/sections/InsuranceSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Header />
      <ScrollIndicators />
      <HeroSection />
      <AboutSection />
      <ServicesCardsSection />
      <InsuranceSection />
      <ContactSection />
      <Footer />
    </Box>
  );
}
