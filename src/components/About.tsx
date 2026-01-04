import { motion } from 'framer-motion';
import { Award, Sparkles, Users, Shield, Ship } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Sparkles, titleKey: 'features.ai.title', descKey: 'features.ai.desc' },
    { icon: Award, titleKey: 'features.expert.title', descKey: 'features.expert.desc' },
    { icon: Shield, titleKey: 'features.cert.title', descKey: 'features.cert.desc' },
    { icon: Users, titleKey: 'features.network.title', descKey: 'features.network.desc' },
  ];

  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20"
            >
              <Award className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">{t('about.badge')}</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground"
            >
              {t('about.title')}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 text-muted-foreground leading-relaxed"
            >
              <p>{t('about.p1')}</p>
              <p>{t('about.p2')}</p>
              <p>{t('about.p3')}</p>
            </motion.div>

            {/* Founder Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-soft border border-border/50"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-ocean flex items-center justify-center shadow-medium">
                <span className="text-2xl font-display font-bold text-primary-foreground">A</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-foreground">{t('about.founder')}</h4>
                <p className="text-sm text-muted-foreground">{t('about.company')}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-secondary">
                  <Ship className="w-3 h-3" />
                  <span>Royal Caribbean International</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group p-6 bg-card rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 border border-border/50"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(feature.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
