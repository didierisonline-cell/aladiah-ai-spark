import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, TrendingUp, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import heroVideo from '@/assets/hero-video.mp4';

const Hero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const stats = [
    { icon: Users, value: '500+', label: t('hero.stats.students') },
    { icon: TrendingUp, value: '95%', label: t('hero.stats.rate') },
    { icon: Building2, value: '20+', label: t('hero.stats.partners') },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 lg:pt-0 overflow-hidden bg-gradient-hero">
      {/* Layer 1 — generic/global hero video background (muted, looping, no
          captions, no persona/claims). Founder-confirmed generic clip; the
          Maria/Dominican story-scenes are intentionally NOT used. */}
      <video
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      {/* Layer 1b — dark navy overlay so the video reads as a subtle backdrop
          and the hero text stays readable. */}
      <div className="absolute inset-0 bg-[#0B111E]/65 pointer-events-none" />

      {/* Aladiah emblem watermark — the OFFICIAL mark (official-mark.svg: silver
          A-spire + hidden-9 + gold world arc) as a premium background, so the
          header, hero card, and watermark all share one official identity.
          No country flag / no torch-era emblem: a single global identity,
          soft blue/gold glow, low opacity. */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute w-[62vw] h-[62vw] max-w-[760px] max-h-[760px] rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute w-[34vw] h-[34vw] max-w-[420px] max-h-[420px] rounded-full bg-secondary/10 blur-[120px]" />
        <img
          src="/brand/official/official-mark.svg"
          alt=""
          className="relative h-[78%] w-auto max-h-[760px] opacity-[0.12]"
          style={{ filter: 'drop-shadow(0 0 70px rgba(74,144,245,0.30)) drop-shadow(0 0 40px rgba(245,184,26,0.18))' }}
        />
      </div>

      {/* Background glow elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-secondary/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-0 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/10 border border-secondary/20 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-sm font-semibold text-secondary tracking-wide">{t("hero.badge")}</span>
              </motion.div>

              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group"
                href="https://aladiahmanagement.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-primary tracking-wide uppercase hidden sm:inline">Boutique IT & Consulting</span>
                <ArrowRight className="w-3.5 h-3.5 text-primary opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </motion.a>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.1]"
            >
              <span className="text-foreground">{t('hero.title.line1')}</span>
              <br />
              <span className="text-gradient-ocean">{t('hero.title.line2')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button variant="hero" size="xl" className="shadow-large" onClick={() => { const el = document.getElementById('programs'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>
                {t('hero.cta.primary')}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-3 sm:gap-8 pt-6 sm:pt-10 border-t border-border/50"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <stat.icon className="w-5 h-5 text-secondary" />
                    <span className="text-2xl lg:text-3xl font-display font-bold text-foreground">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Brand emblem showcase — premium global identity (replaces the old
              country story video). The approved Aladiah mark on a glass panel
              with the blue/gold glow + the official tagline. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-md rounded-3xl bg-card/40 backdrop-blur-sm border border-border/30 shadow-large flex items-center justify-center p-8 overflow-hidden">
              <div className="absolute w-2/3 h-2/3 rounded-full bg-primary/15 blur-[100px]" />
              <div className="absolute w-1/2 h-1/2 rounded-full bg-secondary/15 blur-[90px]" />
              {/* Official approved logo (PNG, used as-is). The PNG already contains
                  the ALADIAH ACADEMY wordmark + tagline — no separate text overlay. */}
              <img
                src="/brand/official/Aladiah_Academy_Official_Logo.png"
                alt="Aladiah Academy"
                className="relative w-auto h-auto max-h-[560px] max-w-full object-contain"
                style={{ filter: 'drop-shadow(0 0 40px rgba(74,144,245,0.30)) drop-shadow(0 0 26px rgba(245,184,26,0.18))' }}
              />
            </div>

            {/* Floating accents */}
            <div className="absolute -top-4 -right-4 p-4 bg-card rounded-2xl shadow-medium animate-float border border-border/30">
              <Sparkles className="w-6 h-6 text-secondary" />
            </div>
            <div className="absolute -bottom-4 -left-4 p-4 bg-card rounded-2xl shadow-medium animate-float border border-border/30" style={{ animationDelay: '1s' }}>
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
