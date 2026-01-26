import { motion } from 'framer-motion';
import { ArrowRight, Clock, Monitor, Users, Brain, Target, Zap } from 'lucide-react';
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
                variant={program.featured ? 'coral' : 'outline'} 
                className="w-full group/btn"
                onClick={() => program.featured && navigate('/auth')}
              >
                {program.featured ? t('programs.startCourse') : t('programs.learnMore')}
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
