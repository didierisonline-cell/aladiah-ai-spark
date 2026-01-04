import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Programs from '@/components/Programs';
import About from '@/components/About';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <Programs />
          <About />
          <CTA />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
