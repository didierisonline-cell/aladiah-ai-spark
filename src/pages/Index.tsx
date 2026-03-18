import { useEffect, useState } from 'react';
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

  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/ai', {
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
        <BlogSection />
        <About />
        <CTA />
      </main>

      <Footer />

      <div style={{ padding: '20px', background: '#111', color: 'white' }}>
        <h2>Aladiah AI Professor</h2>
        <p>Your private Agile and Scrum teaching assistant.</p>

        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask about Scrum, Agile, interviews, ceremonies, roles..."
          style={{ width: '100%', padding: '10px', marginBottom: '10px', color: 'black' }}
        />

        <button onClick={askAI} style={{ padding: '10px 20px', color: 'black' }}>
          {loading ? 'Professor is thinking...' : 'Ask Professor'}
        </button>

        <div style={{ marginTop: '20px' }}>
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      </div>

      <EnrollmentChatbot />
    </div>
  );
};

export default Index;