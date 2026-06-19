import { motion } from 'framer-motion';
import { Award, Sparkles, Users, Ship, Briefcase, GraduationCap, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Sparkles, titleKey: 'features.ai.title', descKey: 'features.ai.desc' },
    { icon: Award, titleKey: 'features.expert.title', descKey: 'features.expert.desc' },
    { icon: Users, titleKey: 'features.network.title', descKey: 'features.network.desc' },
  ];

  // Founder-led quality standards — kept as a compact, factual strip (no public
  // photo / bio / social block, per the approved homepage cleanup).
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
        <div className="text-center mb-16">
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

        {/* Features Grid — Premium glassmorphism cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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

        {/* Founder-led standards — compact, no personal photo/bio/social. */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {credentials.map((cred, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border/30"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <cred.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm text-foreground font-medium leading-snug">{t(cred.textKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
