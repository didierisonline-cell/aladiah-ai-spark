import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Programs from '@/components/Programs';
import BlogHub from '@/components/BlogHub';
import About from '@/components/About';
import CareerPathway from '@/components/CareerPathway';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import EnrollmentChatbot from '@/components/EnrollmentChatbot';

const Index = () => {
  const location = useLocation();

  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponse(data.output?.[0]?.text || data.error || 'No response');
    } catch (err) {
      setResponse('Error connecting to AI');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
      }, 50);
    }

    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      setTimeout(() => {
        const el = document.querySelector('#' + state.scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
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
        <BlogHub />
        <About />
        <CTA />
      </main>

      <Footer />


      <EnrollmentChatbot />
    </div>
  );
};

export default Index;