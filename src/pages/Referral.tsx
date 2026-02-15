import { motion } from 'framer-motion';
import { Gift, Users, DollarSign, CheckCircle, ArrowRight, GraduationCap, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReferralLinkCard from '@/components/ReferralLinkCard';

const Referral = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const studentSteps = [
    { icon: Users, label: t('referral.student.step1') },
    { icon: GraduationCap, label: t('referral.student.step2') },
    { icon: CheckCircle, label: t('referral.student.step3') },
    { icon: DollarSign, label: t('referral.student.step4') },
  ];

  const affiliateSteps = [
    { icon: Handshake, label: t('referral.affiliate.step1') },
    { icon: Users, label: t('referral.affiliate.step2') },
    { icon: CheckCircle, label: t('referral.affiliate.step3') },
    { icon: DollarSign, label: t('referral.affiliate.step4') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-28">
        {/* Hero */}
        <section className="relative py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-ocean opacity-95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6">
                <Gift className="w-4 h-4" />
                {t('referral.badge')}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {t('referral.hero.title')}
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-4">
                {t('referral.hero.subtitle')}
              </p>
              <div className="flex items-center justify-center gap-3 mt-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/30">
                  <span className="text-5xl font-bold text-white">$1,000</span>
                  <p className="text-white/70 text-sm mt-1">{t('referral.hero.reward')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Two Programs */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Student Referral */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="h-full border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-large overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <GraduationCap className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl lg:text-3xl">{t('referral.student.title')}</CardTitle>
                    <CardDescription className="text-base mt-2">{t('referral.student.subtitle')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('referral.student.description')}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">{t('referral.howItWorks')}</h4>
                      {studentSteps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <step.icon className="w-4 h-4 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground">{step.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-accent/10 rounded-xl p-5 border border-accent/20">
                      <p className="font-semibold text-accent-foreground flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary" />
                        {t('referral.student.reward')}
                      </p>
                    </div>

                    <ReferralLinkCard programType="student" variant="primary" />

                    <Button variant="hero" size="lg" className="w-full" onClick={() => navigate('/enroll')}>
                      {t('referral.student.cta')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Affiliate Program */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="h-full border-2 border-secondary/30 bg-gradient-to-br from-secondary/5 to-transparent shadow-large overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4">
                      <Handshake className="w-7 h-7 text-secondary" />
                    </div>
                    <CardTitle className="text-2xl lg:text-3xl">{t('referral.affiliate.title')}</CardTitle>
                    <CardDescription className="text-base mt-2">{t('referral.affiliate.subtitle')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-secondary/5 rounded-xl p-5 border border-secondary/10">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('referral.affiliate.description')}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">{t('referral.howItWorks')}</h4>
                      {affiliateSteps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <step.icon className="w-4 h-4 text-secondary" />
                          </div>
                          <p className="text-sm text-muted-foreground">{step.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-accent/10 rounded-xl p-5 border border-accent/20">
                      <p className="font-semibold text-accent-foreground flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-secondary" />
                        {t('referral.affiliate.reward')}
                      </p>
                    </div>

                    <ReferralLinkCard programType="affiliate" variant="secondary" />

                    <Button variant="coral" size="lg" className="w-full">
                      {t('referral.affiliate.cta')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ / Terms */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">{t('referral.terms.title')}</h2>
            <div className="text-left space-y-3 text-sm text-muted-foreground bg-card rounded-xl p-6 border">
              <p>• {t('referral.terms.t1')}</p>
              <p>• {t('referral.terms.t2')}</p>
              <p>• {t('referral.terms.t3')}</p>
              <p>• {t('referral.terms.t4')}</p>
              <p>• {t('referral.terms.t5')}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Referral;
