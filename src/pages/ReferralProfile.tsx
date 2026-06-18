import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, ArrowRight, Shield, Award, TrendingUp, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ReferrerData {
  displayName: string;
  avatarUrl: string | null;
}

const ReferralProfile = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [referrer, setReferrer] = useState<ReferrerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadReferrer = async () => {
      if (!code) { setError(true); setLoading(false); return; }

      // SECURITY: resolve the inviter through the safe public RPC only. This
      // returns nothing beyond validity + a first-name display + optional avatar
      // (no user_id, email, full_name, tier or profile row), and records the
      // click server-side. The page never SELECTs profiles/referral_codes.
      const { data, error: rpcError } = await supabase.rpc('get_referral_inviter', { p_code: code });
      const row = Array.isArray(data) ? data[0] : data;

      if (rpcError || !row || !row.valid) {
        setError(true);
        setLoading(false);
        return;
      }

      setReferrer({
        displayName: row.display_name || 'Academy Member',
        avatarUrl: row.avatar_url ?? null,
      });
      setLoading(false);
    };

    loadReferrer();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !referrer) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 text-center px-4">
          <h1 className="text-2xl font-bold mb-4">Invalid Referral Link</h1>
          <p className="text-muted-foreground mb-6">This referral link is not valid or has expired.</p>
          <Button variant="hero" onClick={() => navigate('/enroll')}>
            Enroll Directly <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const firstName = referrer.displayName.split(' ')[0];

  const fomoItems = [
    { icon: TrendingUp, text: 'Scrum Master roles projected to grow 37.9% — World Economic Forum' },
    { icon: Shield, text: 'Average US salary: $115,000/year for certified professionals' },
    { icon: Users, text: '66% of global organizations already use Scrum' },
    { icon: Flame, text: 'Limited seats per cohort — next cohort fills up fast' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 lg:pt-28">
        {/* Referrer Profile Hero */}
        <section className="relative py-20 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-ocean opacity-95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12),transparent_70%)]" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6">
                <Award className="w-4 h-4" />
                Personal Invitation
              </div>

              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 mx-auto mb-5 flex items-center justify-center overflow-hidden">
                {referrer.avatarUrl ? (
                  <img src={referrer.avatarUrl} alt={referrer.displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {referrer.displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <p className="text-white/70 text-sm mb-2">You were invited by</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                {referrer.displayName}
              </h1>
              <p className="text-white/70 text-sm mb-8">
                Aladiah Academy Member
              </p>

              <Button
                variant="coral"
                size="xl"
                onClick={() => navigate(`/enroll?ref=${code}`)}
                className="shadow-glow"
              >
                Join {firstName} at Aladiah Academy
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* FOMO Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-center mb-2">Why Now?</h2>
            <p className="text-muted-foreground text-center mb-8 text-sm">The opportunity won't wait — here's what the data says</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {fomoItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="border-secondary/20 hover:border-secondary/40 transition-colors">
                    <CardContent className="pt-5 pb-4 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4.5 h-4.5 text-secondary" />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Don't Let This Opportunity Pass You By
              </h2>
              <p className="text-muted-foreground mb-8">
                {firstName} is already on their journey to a high-paying tech career. Will you join them?
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="hero" size="xl" onClick={() => navigate(`/enroll?ref=${code}`)}>
                  Enroll Now — Limited Seats
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                ✓ AI-powered learning &nbsp;·&nbsp; ✓ Real Sprint simulations &nbsp;·&nbsp; ✓ Career pathway to US roles
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ReferralProfile;
