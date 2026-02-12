import { motion } from 'framer-motion';
import { Award, Sparkles, Users, Shield, Ship, Briefcase, GraduationCap, Globe, Linkedin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import founderPhoto from '@/assets/founder-photo.png';
import founderTeaching from '@/assets/founder-teaching.png';

const About = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Sparkles, titleKey: 'features.ai.title', descKey: 'features.ai.desc' },
    { icon: Award, titleKey: 'features.expert.title', descKey: 'features.expert.desc' },
    { icon: Shield, titleKey: 'features.cert.title', descKey: 'features.cert.desc' },
    { icon: Users, titleKey: 'features.network.title', descKey: 'features.network.desc' },
  ];

  const credentials = [
    { icon: Ship, textKey: 'founder.credential1' },
    { icon: Briefcase, textKey: 'founder.credential2' },
    { icon: GraduationCap, textKey: 'founder.credential3' },
    { icon: Globe, textKey: 'founder.credential4' },
  ];

  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
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
            className="text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {t('about.p1')}
          </motion.p>
        </div>

        {/* Founder Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mb-20 rounded-2xl overflow-hidden bg-card border border-border/50 shadow-medium"
        >
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Left: Photo + Name */}
            <div className="lg:col-span-2 relative bg-gradient-ocean p-8 lg:p-10 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-primary-foreground/30 shadow-xl">
                  <img 
                    src={founderPhoto} 
                    alt="Miguel Santos - Founder & CEO" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-secondary flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-secondary-foreground" />
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-display font-bold text-primary-foreground mb-1">
                Miguel Santos
              </h3>
              <p className="text-primary-foreground/80 font-medium mb-3">{t('about.founder')}</p>
              <p className="text-primary-foreground/60 text-sm mb-4">Aladiah Management</p>
              
              <div className="flex items-center gap-3">
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-primary-foreground" />
                </a>
              </div>
            </div>

            {/* Right: Bio + Credentials */}
            <div className="lg:col-span-3 p-8 lg:p-10 flex flex-col justify-center">
              <h4 className="text-xl font-display font-bold text-foreground mb-4">
                {t('founder.bio.title')}
              </h4>
              
              <div className="space-y-3 text-muted-foreground leading-relaxed mb-8">
                <p>{t('founder.bio.p1')}</p>
                <p>{t('founder.bio.p2')}</p>
              </div>

              {/* Credentials Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {credentials.map((cred, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <cred.icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm text-foreground font-medium">{t(cred.textKey)}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <div className="relative pl-4 border-l-2 border-secondary/50">
                <p className="text-sm italic text-muted-foreground">
                  "{t('founder.quote')}"
                </p>
                <p className="text-xs text-secondary mt-2 font-medium">— Miguel Santos</p>
              </div>
            </div>
          </div>

          {/* Teaching Photo Strip */}
          <div className="relative h-48 lg:h-56 overflow-hidden">
            <img 
              src={founderTeaching} 
              alt="Miguel Santos teaching" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
            <div className="absolute bottom-6 left-8 right-8">
              <p className="text-sm text-foreground font-medium">{t('founder.teaching.caption')}</p>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </section>
  );
};

export default About;
