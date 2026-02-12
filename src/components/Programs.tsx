import { motion } from 'framer-motion';
import { ArrowRight, Clock, Monitor, Users, Brain, Target, Zap, Rocket, Lock, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Programs = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const programs = [
    {
      icon: Users,
      titleKey: 'programs.scrum.title',
      descKey: 'programs.scrum.desc',
      duration: 8,
      format: 'programs.hybrid',
      color: 'primary',
      featured: true,
    },
    {
      icon: Target,
      titleKey: 'programs.pm.title',
      descKey: 'programs.pm.desc',
      duration: 12,
      format: 'programs.hybrid',
      color: 'secondary',
      featured: false,
    },
    {
      icon: Brain,
      titleKey: 'programs.ai.title',
      descKey: 'programs.ai.desc',
      duration: 6,
      format: 'programs.online',
      color: 'accent',
      featured: false,
      hasCourse: true,
    },
  ];

  return (
    <section id="programs" className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t('programs.badge')}</span>
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
            className="text-lg text-muted-foreground"
          >
            {t('programs.subtitle')}
          </motion.p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group relative bg-card rounded-2xl p-8 shadow-soft hover:shadow-large transition-all duration-500 ${
                program.featured ? 'lg:scale-105 ring-2 ring-secondary/30' : ''
              }`}
            >
              {program.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                program.color === 'primary' ? 'bg-primary/10 text-primary' :
                program.color === 'secondary' ? 'bg-secondary/10 text-secondary' :
                'bg-accent/20 text-accent-foreground'
              }`}>
                <program.icon className="w-7 h-7" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-display font-bold text-foreground mb-3">
                {t(program.titleKey)}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t(program.descKey)}
              </p>

              {/* Meta */}
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

              {/* CTA */}
              <Button 
                variant={(program.featured || (program as any).hasCourse) ? 'coral' : 'outline'} 
                className="w-full group/btn"
                onClick={() => {
                  if (program.featured || (program as any).hasCourse) {
                    navigate('/auth');
                  }
                }}
              >
                {(program.featured || (program as any).hasCourse) ? t('programs.startCourse') : t('programs.learnMore')}
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Live Scrum Project - Standalone Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <div className="relative bg-card rounded-2xl p-8 shadow-soft hover:shadow-large transition-all duration-500 ring-2 ring-primary/20 overflow-hidden">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="relative flex flex-col lg:flex-row lg:items-center gap-8">
              {/* Icon & Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                    <Rocket className="w-7 h-7" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {t('programs.liveProject.prereq')}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                  {t('programs.liveProject.title')}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4 max-w-2xl">
                  {t('programs.liveProject.desc')}
                </p>

                {/* Meta */}
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

              {/* CTA */}
              <div className="lg:flex-shrink-0">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full lg:w-auto group/btn"
                  onClick={() => navigate('/auth')}
                >
                  {t('programs.learnMore')}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Programs;
