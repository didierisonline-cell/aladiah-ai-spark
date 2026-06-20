import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Users, TrendingUp, Building2, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import scene1 from '@/assets/story-scene1.mp4';
import scene2 from '@/assets/story-scene2.mp4';
import scene3 from '@/assets/story-scene3.mp4';
import scene4 from '@/assets/story-scene4.mp4';
import scene5 from '@/assets/story-scene5.mp4';

// Cinematic story footage on the right. Captions are a UNIVERSAL student
// journey (canon-clean): aspirational transformation, no named persona and no
// specific earnings/outcome claim. Caption text comes from the translation
// system (hero.story.*) so it localizes; the run ends on the official seal.
const scenes = [
  { src: scene1, captionKey: 'hero.story.s1' },
  { src: scene2, captionKey: 'hero.story.s2' },
  { src: scene3, captionKey: 'hero.story.s3' },
  { src: scene4, captionKey: 'hero.story.s4' },
  { src: scene5, captionKey: 'hero.story.s5' },
];

const SEAL_DURATION = 4000; // ms the seal signature holds before the loop restarts

const Hero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [currentScene, setCurrentScene] = useState(0);
  const [showSeal, setShowSeal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const stats = [
    { icon: Users, value: '500+', label: t('hero.stats.students') },
    { icon: TrendingUp, value: '95%', label: t('hero.stats.rate') },
    { icon: Building2, value: '20+', label: t('hero.stats.partners') },
  ];

  // After the last scene, fade into the official seal signature, then loop.
  const handleVideoEnd = useCallback(() => {
    setCurrentScene(prev => {
      if (prev < scenes.length - 1) return prev + 1;
      setShowSeal(true);
      return prev;
    });
  }, []);

  useEffect(() => {
    if (!showSeal) return;
    const timer = setTimeout(() => {
      setShowSeal(false);
      setCurrentScene(0);
    }, SEAL_DURATION);
    return () => clearTimeout(timer);
  }, [showSeal]);

  useEffect(() => {
    if (showSeal) return;
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video.play().catch(() => {});
  }, [currentScene, showSeal]);

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
    <section id="home" className="relative min-h-screen flex items-center pt-20 lg:pt-0 overflow-hidden bg-gradient-hero">
      {/* Layer 1 — official logo PNG as the hero background (founder directive:
          the supplied official logo is the background). Its navy backdrop blends
          with the page; soft blue/gold glow behind it; low opacity so the hero
          text stays readable. */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute w-[62vw] h-[62vw] max-w-[760px] max-h-[760px] rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute w-[34vw] h-[34vw] max-w-[420px] max-h-[420px] rounded-full bg-secondary/10 blur-[120px]" />
        <img
          src="/brand/official/Aladiah_Academy_Official_Logo.png"
          alt=""
          className="relative h-[92%] w-auto max-h-[860px] object-contain opacity-[0.5]"
          style={{ filter: 'drop-shadow(0 0 70px rgba(74,144,245,0.30)) drop-shadow(0 0 40px rgba(245,184,26,0.18))' }}
        />
      </div>
      {/* Dark navy overlay so the background logo reads as a backdrop and the
          hero text stays legible. */}
      <div className="absolute inset-0 bg-[#0B111E]/55 pointer-events-none" />

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

          {/* Right — Santo Domingo cinematic story video (restored). Captions
              restored per founder directive. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-large border border-border/30 aspect-video bg-[#0B111E]">
              {showSeal ? (
                /* Seal signature end-frame — studio-style sign-off, then loop */
                <motion.div
                  key="seal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B111E]"
                >
                  <div className="absolute w-2/3 h-2/3 rounded-full bg-secondary/20 blur-[90px]" />
                  <motion.img
                    src="/brand/official/official-seal.svg"
                    alt="Aladiah Academy seal"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="relative w-32 h-32 md:w-40 md:h-40"
                    style={{ filter: 'drop-shadow(0 0 28px rgba(245,184,26,0.55)) drop-shadow(0 0 14px rgba(74,144,245,0.35))' }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="relative mt-5 text-center"
                  >
                    <p className="text-white/90 text-sm md:text-base font-medium mb-3">{t('hero.story.s6')}</p>
                    <p className="text-white font-display font-bold text-lg md:text-xl tracking-wide">Aladiah Academy</p>
                    <p className="text-secondary text-xs md:text-sm tracking-[0.2em] uppercase mt-1">Intelligence • Purpose • Impact</p>
                  </motion.div>
                </motion.div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    src={scenes[currentScene].src}
                    autoPlay
                    muted={isMuted}
                    playsInline
                    onEnded={handleVideoEnd}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Cinematic letterbox gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                  {/* Caption */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentScene}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.6 }}
                      className="absolute bottom-16 left-4 right-4"
                    >
                      <p className="text-white text-sm md:text-base font-medium leading-relaxed drop-shadow-lg">
                        {t(scenes[currentScene].captionKey)}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Scene progress dots */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                    {scenes.map((_, i) => (
                      <button
                        key={i}
                        aria-label={`Scene ${i + 1}`}
                        onClick={() => { setShowSeal(false); setCurrentScene(i); }}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          i === currentScene ? 'bg-white flex-[3]' : i < currentScene ? 'bg-white/60 flex-1' : 'bg-white/30 flex-1'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Playback controls */}
              <AnimatePresence>
                {showControls && !showSeal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-4 right-4 flex gap-2"
                  >
                    <button
                      onClick={togglePause}
                      aria-label={isPaused ? 'Play' : 'Pause'}
                      className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                      className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
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
