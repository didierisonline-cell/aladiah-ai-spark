import { motion } from 'framer-motion';
import { Download, Copy, Check, Flame, Clock, TrendingUp, Users, Star, MessageSquare, Zap, Shield, Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useReferralCode } from '@/hooks/useReferralCode';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MarketingKit = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { referralLink, code, user } = useReferralCode('student');
  const link = referralLink || 'https://aladiahacademy.com/enroll?ref=YOUR_CODE';

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const socialPosts = [
    {
      platform: 'Instagram / Facebook',
      icon: '📱',
      text: `🚀 I just enrolled in Aladiah Academy's Scrum Master & PM program — and it's CHANGING everything.\n\nAI-powered lessons. Real-world projects. A direct path to $60K–$145K careers.\n\n⏰ Seats are LIMITED. Don't wait until the next cohort.\n\n👉 ${link}\n\n#ScrumMaster #ProjectManagement #CareerChange #AladiahAcademy`,
    },
    {
      platform: 'LinkedIn',
      icon: '💼',
      text: `I made a career decision that I believe will define my next decade.\n\nI enrolled in Aladiah Academy — a professional Scrum Master & Project Management certification program powered by AI.\n\nWhat makes it different:\n✅ AI-enhanced curriculum tailored to each student\n✅ Real Sprint simulations with actual team dynamics\n✅ Direct career pathway to US opportunities\n✅ 7-language global community\n\nScrum Master salaries range from $60K to $145K. The demand is growing 37.9% over the next decade (World Economic Forum).\n\nIf you're considering a career in tech leadership, this is worth exploring:\n👉 ${link}`,
    },
    {
      platform: 'WhatsApp / DM',
      icon: '💬',
      text: `Hey! I wanted to share something with you. I just joined Aladiah Academy — it's a professional Scrum Master & Project Management program that uses AI to personalize the learning.\n\nScrum Masters earn $60K–$145K and demand is exploding. This program has real sprint simulations, a global community, and even a career pathway to US jobs.\n\nThey're accepting students now but spots fill up fast. Check it out: ${link}`,
    },
  ];

  const emailTemplates = [
    {
      subject: '🔥 This career move could change everything — limited spots',
      body: `Hi [Name],\n\nI recently discovered something that I think could genuinely change your career trajectory, and I wanted to share it before it's too late.\n\nAladiah Academy offers a professional Scrum Master & Project Management certification — but unlike anything else out there. Here's why:\n\n• AI-powered personalized learning (adapts to YOUR pace)\n• Real-world Sprint simulations (not just theory)\n• Global community across 7 languages\n• Direct career pathway to US opportunities ($60K–$145K salaries)\n• Founded by a Royal Caribbean IT executive with real enterprise experience\n\nThe World Economic Forum projects 37.9% growth in Scrum-related roles. Companies like Google, Amazon, and Microsoft are hiring Scrum Masters faster than universities can produce them.\n\nSeats are limited per cohort. I'd hate for you to miss this window.\n\n👉 ${link}\n\nLet me know if you have questions — happy to share my experience so far.\n\nBest,\n[Your Name]`,
    },
  ];

  const fomoStats = [
    { icon: TrendingUp, stat: '37.9%', label: 'Projected job growth (World Economic Forum)' },
    { icon: Target, stat: '$60K–$145K', label: 'Scrum Master salary range in the US' },
    { icon: Users, stat: '66%', label: 'Of global organizations use Scrum' },
    { icon: Clock, stat: 'Limited', label: 'Seats per cohort — once full, wait months' },
    { icon: Zap, stat: '6 months', label: 'Average time to land a new role after certification' },
    { icon: Shield, stat: 'Top 1%', label: 'AI-enhanced curriculum — industry first' },
  ];

  const talkingPoints = [
    'Scrum Master is one of the fastest-growing careers globally — 37.9% projected growth.',
    'Average US salary: $115,000. Entry-level starts at $60,000+.',
    'AI-powered curriculum means you learn faster and retain more.',
    'Real Sprint simulations — not just slides and theory.',
    'Founded by a Royal Caribbean IT executive with enterprise credentials.',
    'Career pathway to US opportunities through sister company Aladiah Management.',
    'Global community of ambitious professionals across 7 languages.',
    'Every day you wait, someone else takes your seat in the next cohort.',
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-28">
        {/* Hero */}
        <section className="relative py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-ocean opacity-95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.1),transparent_60%)]" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6">
                <Flame className="w-4 h-4" />
                {t('kit.badge')}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {t('kit.hero.title')}
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
                {t('kit.hero.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* FOMO Stats */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-2xl lg:text-3xl font-bold text-center mb-3">{t('kit.fomo.title')}</h2>
              <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">{t('kit.fomo.subtitle')}</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {fomoStats.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="text-center border-primary/10 hover:border-primary/30 transition-colors">
                    <CardContent className="pt-6 pb-5">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-3xl font-bold text-primary mb-1">{item.stat}</p>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Media Templates */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl lg:text-3xl font-bold text-center mb-3">{t('kit.social.title')}</h2>
            <p className="text-muted-foreground text-center mb-10">{t('kit.social.subtitle')}</p>
            <div className="space-y-6">
              {socialPosts.map((post, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-3 flex flex-row items-center gap-3">
                      <span className="text-2xl">{post.icon}</span>
                      <CardTitle className="text-lg">{post.platform}</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto shrink-0"
                        onClick={() => handleCopy(post.text, i)}
                      >
                        {copiedIndex === i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copiedIndex === i ? t('kit.copied') : t('kit.copy')}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-body bg-muted/30 rounded-xl p-4 border border-border leading-relaxed">
                        {post.text}
                      </pre>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Email Template */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl lg:text-3xl font-bold text-center mb-3">{t('kit.email.title')}</h2>
            <p className="text-muted-foreground text-center mb-10">{t('kit.email.subtitle')}</p>
            {emailTemplates.map((tmpl, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-3 flex flex-row items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{t('kit.email.subject')}</p>
                    <CardTitle className="text-base">{tmpl.subject}</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => handleCopy(tmpl.body, 100 + i)}
                  >
                    {copiedIndex === 100 + i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copiedIndex === 100 + i ? t('kit.copied') : t('kit.copy')}
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-body bg-muted/30 rounded-xl p-4 border border-border leading-relaxed">
                    {tmpl.body}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Talking Points */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl lg:text-3xl font-bold text-center mb-3">{t('kit.talking.title')}</h2>
            <p className="text-muted-foreground text-center mb-10">{t('kit.talking.subtitle')}</p>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {talkingPoints.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Star className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <div className="text-center mt-10">
              <Button variant="hero" size="lg" onClick={() => navigate('/referral')}>
                {t('kit.backToReferral')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MarketingKit;
