import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, TrendingUp, Building2, GraduationCap, Play, Pause, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import HeroBackground from '@/components/hero/HeroBackground';
import VideoStoryModal from '@/components/hero/VideoStoryModal';
import scene1 from '@/assets/story-scene1.mp4';
import scene2 from '@/assets/story-scene2.mp4';
import scene3 from '@/assets/story-scene3.mp4';
import scene4 from '@/assets/story-scene4.mp4';
import scene5 from '@/assets/story-scene5.mp4';

// Muted teaser loop on the hero card (no seal — the seal is reserved for the
// final scene of the full film in VideoStoryModal).
const teaserScenes = [scene1, scene2, scene3, scene4, scene5];

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
  const [currentScene, setCurrentScene] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const stats = [
    { icon: Users, value: '500+', label: t('hero.stats.students') },
    { icon: TrendingUp, value: '95%', label: t('hero.stats.rate') },
    { icon: Building2, value: '20+', label: t('hero.stats.partners') },
    { icon: GraduationCap, value: '30+', label: t('hero.stats.programs') },
  ];

  const nextScene = useCallback(() => {
    setCurrentScene((prev) => (prev + 1) % teaserScenes.length);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video.play().catch(() => {});
  }, [currentScene]);

  const exploreProgrames = () => {
    const el = document.getElementById('programs');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  const togglePause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPaused) video.play(); else video.pause();
    setIsPaused(!isPaused);
  };
  const toggleMute = () => {
    if (videoRef.current) videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
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
              <Button variant="heroOutline" size="xl" onClick={() => setStoryOpen(true)} aria-label="Watch Aladiah success stories video">
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

          {/* Right — "Real stories" cinematic card → opens the full film */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 40 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <button
              onClick={() => setStoryOpen(true)}
              aria-label="Play Aladiah success stories video"
              className="group relative block w-full rounded-3xl overflow-hidden border border-border/40 aspect-video bg-[#0B111E] text-left"
              style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,.7), 0 0 60px rgba(74,144,245,.12)' }}
            >
              <video ref={videoRef} src={teaserScenes[currentScene]} autoPlay muted={isMuted} playsInline onEnded={nextScene}
                className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />

              {/* label + play affordance */}
              <div className="absolute bottom-12 left-5 right-5 flex items-center gap-3">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/90 shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Play className="w-5 h-5 text-white" fill="white" />
                </span>
                <span className="text-white text-base font-semibold leading-snug drop-shadow-lg">
                  {t('hero.video.label')}
                </span>
              </div>

              {/* progress segments */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-2">
                {teaserScenes.map((_, i) => (
                  <span key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentScene ? 'bg-white flex-[3]' : i < currentScene ? 'bg-white/60 flex-1' : 'bg-white/25 flex-1'}`} />
                ))}
              </div>
            </button>

            {/* mute/pause controls (don't trigger the modal) */}
            {showControls && (
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={togglePause} aria-label={isPaused ? 'Play preview' : 'Pause preview'} className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button onClick={toggleMute} aria-label={isMuted ? 'Unmute preview' : 'Mute preview'} className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            )}

            <div className="absolute -top-4 -right-4 p-3.5 bg-card rounded-2xl shadow-medium animate-float border border-border/30">
              <Sparkles className="w-5 h-5 text-secondary" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Centered official Aladiah Academy lockup (emblem + ALADIAH ACADEMY +
          Intelligence. Purpose. Impact.). Decorative brand presence — NOT the
          seal (the seal is reserved for certificates and the film finale).
          Sits behind the content; hidden on small screens to avoid crowding. */}
      <div className="absolute bottom-0 left-0 right-0 hidden md:flex justify-center pointer-events-none z-[5]" aria-hidden="true">
        <img
          src="/brand/official/official-logo.svg"
          alt=""
          style={{ width: 'clamp(240px, 25vw, 400px)', filter: 'drop-shadow(0 0 36px rgba(245,184,26,.45)) drop-shadow(0 0 22px rgba(74,144,245,.30))' }}
        />
      </div>

      <VideoStoryModal open={storyOpen} onClose={() => setStoryOpen(false)} />
    </section>
  );
};

export default Hero;
