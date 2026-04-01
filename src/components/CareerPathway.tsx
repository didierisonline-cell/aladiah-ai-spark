import { motion } from 'framer-motion';
import { Briefcase, ArrowRight, ShieldCheck, Building2, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const CareerPathway = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: isEnrolled } = useQuery({
    queryKey: ['enrollment-status', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { count } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      return (count ?? 0) > 0;
    },
    enabled: !!user,
  });

  const highlights = [
    { icon: Building2, textKey: 'career.highlight1' },
    { icon: Briefcase, textKey: 'career.highlight2' },
    { icon: ShieldCheck, textKey: 'career.highlight3' },
  ];

  return (
    <section id="career-pathway" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,hsl(var(--secondary)/0.06),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,hsl(var(--primary)/0.04),transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
              <Briefcase className="w-4 h-4 text-secondary" />
              <span className="text-sm font-semibold text-secondary">{t('career.badge')}</span>
            </div>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative rounded-3xl overflow-hidden bg-card border border-border/50 shadow-large"
          >
            {/* Top gradient bar */}
            <div className="h-1.5 bg-gradient-ocean w-full" />

            <div className="p-8 lg:p-12">
              {/* Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
                {t('career.title')}
              </h2>

              {/* Main statement */}
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-3xl">
                {t('career.statement')}
              </p>

              {/* Highlight cards */}
              <div className="grid sm:grid-cols-3 gap-4 mb-10">
                {highlights.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3 p-5 rounded-xl bg-muted/40 border border-border/30"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-secondary" />
                    </div>
                    <p className="text-sm text-foreground font-medium leading-snug">{t(item.textKey)}</p>
                  </motion.div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="rounded-xl bg-muted/30 border border-border/30 p-5 mb-8">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t('career.disclaimer')}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                  variant={isEnrolled ? "secondary" : "coral"}
                  size="lg"
                  className={`group/btn ${isEnrolled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !isEnrolled && navigate('/auth')}
                  disabled={!!isEnrolled}
                >
                  {isEnrolled ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      {t('career.enrolled') || 'Already Enrolled'}
                    </>
                  ) : (
                    <>
                      {t('career.cta')}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {isEnrolled ? (t('career.enrolledSub') || 'You have full access') : t('career.ctaSub')}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CareerPathway;
