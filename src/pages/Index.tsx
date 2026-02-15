import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Programs from '@/components/Programs';
import BlogSection from '@/components/BlogSection';
import About from '@/components/About';
import CareerPathway from '@/components/CareerPathway';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) {
          el.scrollIntoView({ behavior: 'instant' });
        }
      }, 50);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Programs />
        <CareerPathway />
        <BlogSection />
        <About />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
