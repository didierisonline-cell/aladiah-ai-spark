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
import EnrollmentChatbot from '@/components/EnrollmentChatbot';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle hash from URL
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: 'instant' });
      }, 50);
    }
    // Handle scrollTo from navigation state (footer links from other pages)
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      setTimeout(() => {
        const el = document.querySelector('#' + state.scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      // Clear the state to prevent re-scrolling
      window.history.replaceState({}, document.title);
    }
  }, [location.hash, location.state]);

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
      <EnrollmentChatbot />
    </div>
  );
};

export default Index;
