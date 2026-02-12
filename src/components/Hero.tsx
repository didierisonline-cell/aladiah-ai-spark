import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Users, TrendingUp, Building2, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import scene1 from '@/assets/story-scene1.mp4';
import scene2 from '@/assets/story-scene2.mp4';
import scene3 from '@/assets/story-scene3.mp4';
import scene4 from '@/assets/story-scene4.mp4';
import scene5 from '@/assets/story-scene5.mp4';

const scenes = [
  { src: scene1, caption: "María works long hours at a restaurant in Zona Colonial, Santo Domingo…" },
  { src: scene2, caption: "One night, she sees an ad on Instagram — Aladiah Academy. A chance to change everything." },
  { src: scene3, caption: "She enrolls, studies late into the night, and earns her Scrum Master certification." },
  { src: scene4, caption: "6 months later — she leads a professional team, earning $60,000 a year." },
  { src: scene5, caption: "She moves to a beautiful apartment on Avenida España. Her life is forever changed." },
];

const Hero = () => {
  const { t } = useLanguage();
  const [currentScene, setCurrentScene] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const stats = [
    { icon: Users, value: '500+', label: t('hero.stats.students') },
    { icon: TrendingUp, value: '95%', label: t('hero.stats.rate') },
    { icon: Building2, value: '20+', label: t('hero.stats.partners') },
  ];

  const handleVideoEnd = useCallback(() => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
    } else {
      setCurrentScene(0); // loop
    }
  }, [currentScene]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video.play().catch(() => {});
  }, [currentScene]);

  const togglePause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPaused) {
      video.play();
    } else {
      video.pause();
    }
    setIsPaused(!isPaused);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 lg:pt-0 overflow-hidden bg-gradient-hero">
      {/* Dominican Republic Flag Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.15] pointer-events-none">
        <svg viewBox="0 0 900 600" className="w-full h-full max-w-[1400px]" preserveAspectRatio="xMidYMid slice">
          <rect x="0" y="0" width="450" height="300" fill="#002D62"/>
          <rect x="450" y="300" width="450" height="300" fill="#002D62"/>
          <rect x="450" y="0" width="450" height="300" fill="#CE1126"/>
          <rect x="0" y="300" width="450" height="300" fill="#CE1126"/>
          <rect x="0" y="250" width="900" height="100" fill="#FFFFFF"/>
          <rect x="400" y="0" width="100" height="600" fill="#FFFFFF"/>
        </svg>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-0 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20"
            >
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">{t('hero.badge')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight"
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
              <Button variant="hero" size="xl">
                {t('hero.cta.primary')}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="heroOutline" size="xl">
                {t('hero.cta.secondary')}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50"
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

          {/* Cinematic Story Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-large">
              {/* Video */}
              <video
                ref={videoRef}
                src={scenes[currentScene].src}
                autoPlay
                muted={isMuted}
                playsInline
                onEnded={handleVideoEnd}
                className="w-full aspect-video object-cover"
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
                    {scenes[currentScene].caption}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Scene progress dots */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                {scenes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentScene(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === currentScene ? 'bg-white flex-[3]' : i < currentScene ? 'bg-white/60 flex-1' : 'bg-white/30 flex-1'
                    }`}
                  />
                ))}
              </div>

              {/* Playback controls */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-4 right-4 flex gap-2"
                  >
                    <button
                      onClick={togglePause}
                      className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 p-4 bg-card rounded-xl shadow-medium animate-float">
              <Sparkles className="w-6 h-6 text-secondary" />
            </div>
            <div className="absolute -bottom-4 -left-4 p-4 bg-card rounded-xl shadow-medium animate-float" style={{ animationDelay: '1s' }}>
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
