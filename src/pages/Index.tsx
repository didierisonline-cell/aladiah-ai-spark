import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Programs from '@/components/Programs';
import BlogSection from '@/components/BlogSection';
import About from '@/components/About';
import CareerPathway from '@/components/CareerPathway';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

const Index = () => {
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
