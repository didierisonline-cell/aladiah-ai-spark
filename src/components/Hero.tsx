import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, TrendingUp, Building2, GraduationCap, Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import HeroBackground from '@/components/hero/HeroBackground';
import HeroStoryReel from '@/components/hero/HeroStoryReel';
import HeroStoryModal from '@/components/hero/HeroStoryModal';

// Render a string with *gold-accented* segments (markers survive translation).
function GoldAccented({ text }: { text: string }) {
  return (
    <>
      {text.split('*').map((part, i) =>
        i % 2 === 1 ? <span key={i} style={{ color: '#F5B81A' }}>{part}</span> : <span key={i}>{part}</span>
      )}
    </>
  );
}

const Hero = () => {
  const { t } = useLanguage();
  const [storyOpen, setStoryOpen] = useState(false);

  // WO-P0-001: stats must be verifiable at launch. No student counts, success
  // rates, or partner counts until real numbers exist (LAUNCH_DECISION_PRINCIPLE).
  const stats = [
    { icon: GraduationCap, value: '4', label: t('mvp.hero.stats.programs_live') },
    { icon: TrendingUp, value: '18+', label: t('mvp.hero.stats.modules') },
    { icon: Users, value: '24/7', label: t('mvp.hero.stats.ai_professor') },
    { icon: Building2, value: '21', label: t('mvp.hero.stats.languages') },
  ];

  const exploreProgrames = () => {
    const el = document.getElementById('programs');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 lg:pt-20 overflow-hidden">
      <HeroBackground />

      <div className="container mx-auto px-4 pb-28 lg:pb-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — message */}
          <div className="space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/10 border border-secondary/25 backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-xs font-bold text-secondary tracking-wide uppercase">{t('hero.badge')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.05]"
              style={{ background: 'linear-gradient(180deg,#FFFFFF 0%,#C9D6EE 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
            >
              {t('hero.title.line1')}<br />{t('hero.title.line2')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}
              className="text-2xl lg:text-3xl font-display font-semibold text-foreground/90"
            >
              <GoldAccented text={t('hero.subhead')} />
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.26 }}
              className="text-base lg:text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* CTAs — both wired to real actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.32 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button variant="hero" size="xl" onClick={exploreProgrames} aria-label="Explore Aladiah programs">
                {t('hero.cta.primary')}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="heroOutline" size="xl" onClick={() => setStoryOpen(true)} aria-label="Watch Aladiah success stories">
                <Play className="w-5 h-5" />
                {t('hero.cta.stories')}
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-6 border-t border-border/40"
            >
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="w-4 h-4 text-secondary" />
                    <span className="text-2xl lg:text-3xl font-display font-bold text-foreground">{stat.value}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — cinematic story reel: auto-plays the chained student
              journey and loops. No click, no modal. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 40 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <HeroStoryReel />

            <div className="absolute -top-4 -right-4 p-3.5 bg-card rounded-2xl shadow-medium animate-float border border-border/30">
              <Sparkles className="w-5 h-5 text-secondary" />
            </div>
          </motion.div>
        </div>
      </div>

      <HeroStoryModal open={storyOpen} onClose={() => setStoryOpen(false)} />
    </section>
  );
};

export default Hero;
