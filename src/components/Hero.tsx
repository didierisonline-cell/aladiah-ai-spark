import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Users, TrendingUp, Building2, Globe, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import scene1 from '@/assets/story-scene1.mp4';
import scene2 from '@/assets/story-scene2.mp4';
import scene3 from '@/assets/story-scene3.mp4';
import scene4 from '@/assets/story-scene4.mp4';
import scene5 from '@/assets/story-scene5.mp4';

// Cinematic "Real stories. Real transformations." loop. The narrative footage is
// supplied per scene; captions are a universal, canon-clean student journey and
// the run ends on the official seal before looping.
const scenes = [scene1, scene2, scene3, scene4, scene5];
const SEAL_DURATION = 4000;

// Render a string with *gold-accented* segments (markers survive translation).
function GoldAccented({ text }: { text: string }) {
  return (
    <>
      {text.split('*').map((part, i) =>
        i % 2 === 1
          ? <span key={i} style={{ color: '#F5B81A' }}>{part}</span>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

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
    { icon: Globe, value: '100+', label: t('hero.stats.countries') },
  ];

  const handleVideoEnd = useCallback(() => {
    setCurrentScene(prev => {
      if (prev < scenes.length - 1) return prev + 1;
      setShowSeal(true);
      return prev;
    });
  }, []);

  useEffect(() => {
    if (!showSeal) return;
    const timer = setTimeout(() => { setShowSeal(false); setCurrentScene(0); }, SEAL_DURATION);
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
    <section id="home" className="relative min-h-screen flex items-center pt-24 lg:pt-20 overflow-hidden" style={{ background: 'radial-gradient(120% 90% at 70% 10%, #0E1A33 0%, #0A1322 45%, #070D18 100%)' }}>
      {/* Constellation / "globally connected" backdrop (CSS-approximation of the
          official hero art — swap in the exported background image when supplied). */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* starfield */}
        <div className="absolute inset-0" style={{
          backgroundImage: [
            'radial-gradient(1.5px 1.5px at 12% 22%, rgba(74,144,245,.55), transparent)',
            'radial-gradient(1.5px 1.5px at 28% 64%, rgba(245,184,26,.45), transparent)',
            'radial-gradient(1px 1px at 47% 33%, rgba(200,220,255,.5), transparent)',
            'radial-gradient(1.5px 1.5px at 63% 18%, rgba(74,144,245,.5), transparent)',
            'radial-gradient(1px 1px at 78% 52%, rgba(245,184,26,.4), transparent)',
            'radial-gradient(1.5px 1.5px at 88% 30%, rgba(200,220,255,.5), transparent)',
            'radial-gradient(1px 1px at 38% 82%, rgba(74,144,245,.4), transparent)',
            'radial-gradient(1px 1px at 70% 78%, rgba(200,220,255,.45), transparent)',
          ].join(','),
          backgroundRepeat: 'no-repeat',
        }} />
        {/* faint connection web */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.35 }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#4A90F5" stopOpacity="0.5" />
              <stop offset="1" stopColor="#F5B81A" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <polyline points="120,150 320,260 520,180 760,300 980,220" fill="none" stroke="url(#line)" strokeWidth="1" />
          <polyline points="200,520 420,420 640,560 880,460 1100,580" fill="none" stroke="url(#line)" strokeWidth="1" />
        </svg>
        {/* large faint brand emblem (the 9 motif) */}
        <img
          src="/brand/official/official-mark.svg"
          alt=""
          className="absolute top-[6%] right-[8%] w-[34vw] max-w-[520px] opacity-[0.10]"
          style={{ filter: 'drop-shadow(0 0 70px rgba(245,184,26,.45)) drop-shadow(0 0 40px rgba(74,144,245,.35))' }}
        />
        {/* glow blobs */}
        <div className="absolute top-24 right-24 w-[420px] h-[420px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(74,144,245,.14), transparent 70%)' }} />
        <div className="absolute bottom-10 left-10 w-[460px] h-[460px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(245,184,26,.08), transparent 70%)' }} />
      </div>

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

            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.34 }}
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

          {/* Right — "Real stories" cinematic video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 40 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <div className="relative rounded-3xl overflow-hidden border border-border/40 aspect-video bg-[#0B111E]" style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,.7), 0 0 60px rgba(74,144,245,.12)' }}>
              {showSeal ? (
                <motion.div key="seal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B111E]">
                  <div className="absolute w-2/3 h-2/3 rounded-full bg-secondary/20 blur-[90px]" />
                  <motion.img src="/brand/official/official-seal.svg" alt="Aladiah Academy seal"
                    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: 'easeOut' }}
                    className="relative w-32 h-32 md:w-40 md:h-40" style={{ filter: 'drop-shadow(0 0 28px rgba(245,184,26,.55)) drop-shadow(0 0 14px rgba(74,144,245,.35))' }} />
                  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="relative mt-5 text-center">
                    <p className="text-white font-display font-bold text-lg md:text-xl tracking-wide">Aladiah Academy</p>
                    <p className="text-secondary text-xs md:text-sm tracking-[0.2em] uppercase mt-1">Intelligence • Purpose • Impact</p>
                  </motion.div>
                </motion.div>
              ) : (
                <>
                  <video ref={videoRef} src={scenes[currentScene]} autoPlay muted={isMuted} playsInline onEnded={handleVideoEnd}
                    className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />

                  {/* "Real stories. Real transformations." label */}
                  <div className="absolute bottom-12 left-5 right-5 flex items-center gap-3">
                    <span className="flex items-center justify-center w-11 h-11 rounded-full bg-primary/90 shadow-lg flex-shrink-0">
                      <Play className="w-4 h-4 text-white" fill="white" />
                    </span>
                    <span className="text-white text-base font-semibold leading-snug drop-shadow-lg whitespace-pre-line">
                      {t('hero.video.label')}
                    </span>
                  </div>

                  {/* progress segments */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-center gap-2">
                    {scenes.map((_, i) => (
                      <button key={i} aria-label={`Scene ${i + 1}`} onClick={() => { setShowSeal(false); setCurrentScene(i); }}
                        className={`h-1 rounded-full transition-all duration-300 ${i === currentScene ? 'bg-white flex-[3]' : i < currentScene ? 'bg-white/60 flex-1' : 'bg-white/25 flex-1'}`} />
                    ))}
                  </div>

                  {showControls && (
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={togglePause} aria-label={isPaused ? 'Play' : 'Pause'} className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      </button>
                      <button onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'} className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="absolute -top-4 -right-4 p-3.5 bg-card rounded-2xl shadow-medium animate-float border border-border/30">
              <Sparkles className="w-5 h-5 text-secondary" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Centered seal emblem + tagline */}
      <div className="absolute bottom-7 left-0 right-0 flex flex-col items-center pointer-events-none z-10">
        <img src="/brand/official/official-mark.svg" alt="Aladiah Academy" className="w-12 h-12 mb-2" style={{ filter: 'drop-shadow(0 0 16px rgba(245,184,26,.5))' }} />
        <div className="text-[11px] sm:text-xs tracking-[0.35em] font-semibold uppercase">
          <span className="text-foreground/80">Intelligence. </span>
          <span className="text-secondary">Purpose. </span>
          <span className="text-foreground/80">Impact.</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
