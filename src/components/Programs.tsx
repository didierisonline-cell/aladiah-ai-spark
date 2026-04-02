import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Monitor, Users, Brain, Target, Zap, Rocket, Lock, CalendarDays, Network, Shield, Code2, BarChart3, Cloud, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import WaitlistModal from './WaitlistModal';

const Programs = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const programs = [
    {
      icon: Users,
      titleKey: 'programs.scrum.title',
      descKey: 'programs.scrum.desc',
      duration: 8,
      format: 'programs.online',
      color: 'primary' as const,
      featured: true,
    },
    {
      icon: Target,
      titleKey: 'programs.pm.title',
      descKey: 'programs.pm.desc',
      duration: 12,
      format: 'programs.online',
      color: 'secondary' as const,
      featured: true,
      hasCourse: true,
    },
    {
      icon: Brain,
      titleKey: 'programs.ai.title',
      descKey: 'programs.ai.desc',
      duration: 6,
      format: 'programs.online',
      color: 'accent' as const,
      featured: false,
      hasCourse: true,
    },
    {
      icon: Shield,
      titleKey: 'programs.cyber.title',
      descKey: 'programs.cyber.desc',
      duration: 10,
      format: 'programs.online',
      color: 'primary' as const,
      featured: true,
      hasCourse: true,
    },
    {
      icon: Network,
      titleKey: 'programs.architect.title',
      descKey: 'programs.architect.desc',
      duration: 12,
      format: 'programs.online',
      color: 'secondary' as const,
      featured: true,
      hasCourse: true,
    },
    {
      icon: BarChart3,
      titleKey: 'programs.data.title',
      descKey: 'programs.data.desc',
      duration: 8,
      format: 'programs.online',
      color: 'accent' as const,
      featured: false,
      hasCourse: true,
    },
    {
      icon: Cloud,
      titleKey: 'programs.devops.title',
      descKey: 'programs.devops.desc',
      duration: 10,
      format: 'programs.online',
      color: 'primary' as const,
      featured: false,
      hasCourse: true,
    },
    {
      icon: Briefcase,
      titleKey: 'programs.ba.title',
      descKey: 'programs.ba.desc',
      duration: 8,
      format: 'programs.online',
      color: 'secondary' as const,
      featured: false,
      hasCourse: true,
    },
  ];

  return (
    <section id="programs" className="py-24 lg:py-32 bg-muted/20 relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.04),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{t('programs.badge')}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6"
          >
            {t('programs.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            {t('programs.subtitle')}
          </motion.p>
        </div>

        {/* Programs Grid (Certification Courses) - FIRST */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group relative bg-card rounded-2xl p-8 shadow-soft hover:shadow-large transition-all duration-500 border border-border/50 overflow-hidden ${
                'hover:border-primary/20'
              }`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/3 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/5 transition-colors duration-500" />
              
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${
                  program.color === 'primary' ? 'bg-primary/10 text-primary' :
                  program.color === 'secondary' ? 'bg-secondary/10 text-secondary' :
                  'bg-accent/20 text-accent-foreground'
                }`}>
                  <program.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-3">{t(program.titleKey)}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{t(program.descKey)}</p>
                <div className="flex items-center gap-6 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{program.duration} {t('programs.weeks')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Monitor className="w-4 h-4" />
                    <span>{t(program.format)}</span>
                  </div>
                </div>
                <Button 
                  variant='coral' 
                  className="w-full group/btn"
                  onClick={() => {
                    if (program.isWaitlist) {
                      setWaitlistOpen(true);
                    } else if (program.featured) {
                      navigate('/auth');
                    } else {
                      navigate('/auth');
                    }
                  }}
                >
                  {program.isWaitlist ? t('programs.comingSoon') || 'Coming Soon' : t('programs.startCourse') || 'Start Course'}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Scrum Project - AFTER courses */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <div className="relative bg-card rounded-2xl p-8 lg:p-10 shadow-soft hover:shadow-large transition-all duration-500 ring-1 ring-primary/15 overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
            <div className="relative flex flex-col lg:flex-row lg:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                    <Rocket className="w-7 h-7" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {t('programs.liveProject.prereq')}
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-3">{t('programs.liveProject.title')}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4 max-w-2xl">{t('programs.liveProject.desc')}</p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="w-4 h-4" />
                    <span>{t('programs.liveProject.duration')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Monitor className="w-4 h-4" />
                    <span>{t('programs.online')}</span>
                  </div>
                </div>
              </div>
              <div className="lg:flex-shrink-0">
                <Button variant="outline" size="lg" className="w-full lg:w-auto group/btn" onClick={() => navigate('/simulation')}>
                  {t('programs.learnMore')}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rogers IT Merger Project - Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          <div className="relative bg-card rounded-2xl p-8 lg:p-10 shadow-soft ring-1 ring-border/30 overflow-hidden select-none">
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
              <div className="text-center">
                <span className="inline-block px-8 py-3 rounded-full bg-muted border-2 border-border text-lg sm:text-2xl font-display font-bold text-muted-foreground tracking-widest uppercase shadow-soft">
                  Coming Soon
                </span>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-secondary/5 to-transparent rounded-bl-full pointer-events-none" />
            <div className="relative flex flex-col lg:flex-row lg:items-center gap-8 opacity-40">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-secondary/10 text-secondary">
                    <Network className="w-7 h-7" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {t('programs.rogersProject.prereq')}
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-3">{t('programs.rogersProject.title')}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4 max-w-2xl">{t('programs.rogersProject.desc')}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="w-4 h-4" />
                    <span>{t('programs.rogersProject.duration')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Monitor className="w-4 h-4" />
                    <span>{t('programs.online')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{t('programs.rogersProject.teams')}</span>
                  </div>
                </div>
              </div>
              <div className="lg:flex-shrink-0">
                <Button variant="outline" size="lg" className="w-full lg:w-auto" disabled>
                  {t('programs.learnMore')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </section>
  );
};

export default Programs;
