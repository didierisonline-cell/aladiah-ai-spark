import { motion } from 'framer-motion';
import { Award, Sparkles, Users, Shield, Ship, Briefcase, GraduationCap, Globe, Linkedin, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import founderPhoto from '@/assets/founder-photo.png';

const About = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Sparkles, titleKey: 'features.ai.title', descKey: 'features.ai.desc' },
    { icon: Award, titleKey: 'features.expert.title', descKey: 'features.expert.desc' },
    { icon: Users, titleKey: 'features.network.title', descKey: 'features.network.desc' },
  ];

  const credentials = [
    { icon: Ship, textKey: 'founder.credential1' },
    { icon: Briefcase, textKey: 'founder.credential2' },
    { icon: GraduationCap, textKey: 'founder.credential3' },
    { icon: Globe, textKey: 'founder.credential4' },
  ];

  return (
    <section id="about" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.03),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,hsl(var(--secondary)/0.04),transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6"
          >
            <Award className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">{t('about.badge')}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4"
          >
            {t('about.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-lg"
          >
            {t('about.p1')}
          </motion.p>
        </div>

        {/* Founder Profile — Premium Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mb-24"
        >
          <div className="grid lg:grid-cols-12 gap-0 rounded-3xl overflow-hidden bg-card border border-border/50 shadow-large">
            {/* Left: Photo + Name — Elegant dark panel */}
            <div className="lg:col-span-4 relative bg-gradient-ocean p-10 lg:p-12 flex flex-col items-center justify-center text-center">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative mb-8">
                <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-primary-foreground/20 shadow-2xl ring-4 ring-primary-foreground/10 ring-offset-4 ring-offset-transparent">
                  <img 
                    src={founderPhoto} 
                    alt="Didier - Founder & CEO" 
                    className="w-full h-full object-cover object-top scale-110"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-14 h-14 rounded-full bg-secondary flex items-center justify-center shadow-lg border-4 border-card">
                  <Award className="w-6 h-6 text-secondary-foreground" />
                </div>
              </div>

              <h3 className="text-2xl lg:text-3xl font-display font-bold text-primary-foreground mb-2">
                Didier
              </h3>
              <p className="text-primary-foreground/80 font-medium mb-1">{t('about.founder')}</p>
              <p className="text-primary-foreground/50 text-sm mb-6">Aladiah Management</p>
              
              <div className="flex items-center gap-3">
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="w-5 h-5 text-primary-foreground" />
                </a>
              </div>

              {/* Quote on the left panel */}
              <div className="mt-8 pt-6 border-t border-primary-foreground/10 w-full">
                <Quote className="w-5 h-5 text-secondary mb-2 mx-auto" />
                <p className="text-sm italic text-primary-foreground/70 leading-relaxed">
                  "{t('founder.quote')}"
                </p>
              </div>
            </div>

            {/* Right: Bio + Credentials */}
            <div className="lg:col-span-8 p-8 lg:p-12 flex flex-col justify-center">
              <h4 className="text-2xl font-display font-bold text-foreground mb-6">
                {t('founder.bio.title')}
              </h4>
              
              <div className="space-y-4 text-muted-foreground leading-relaxed mb-10 text-base">
                <p>{t('founder.bio.p1')}</p>
                <p>{t('founder.bio.p2')}</p>
              </div>

              {/* Credentials Grid — Premium cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {credentials.map((cred, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-muted/40 border border-border/30 hover:border-primary/20 hover:bg-muted/60 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <cred.icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm text-foreground font-medium leading-snug">{t(cred.textKey)}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid — Premium glassmorphism cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative p-8 bg-card rounded-2xl shadow-soft hover:shadow-large transition-all duration-500 border border-border/50 hover:border-primary/20 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2 text-lg">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
