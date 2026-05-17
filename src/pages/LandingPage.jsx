// src/pages/LandingPage.jsx
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import PreviewSection from '../components/landing/PreviewSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A1628]">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PreviewSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}