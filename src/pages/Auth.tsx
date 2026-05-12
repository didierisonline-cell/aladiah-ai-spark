import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { GraduationCap, Mail, Lock, User, Linkedin, Phone, ShieldCheck, CheckCircle, Zap, Crown, MailCheck } from 'lucide-react';
import Header from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';

const TIERS = [
  { id: 'accelerator', key: 't2', price: 99.99, priceId: import.meta.env.VITE_STRIPE_PRICE_ACCELERATOR || "price_1TMsDL0Ctflq2xPfzJsrXzy1", name: 'All-Access Pass' },
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTier, setSelectedTier] = useState<'free' | 'paid'>('free');
  const [loading, setLoading] = useState(false);
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);
  const [confirmedEmail, setConfirmedEmail] = useState('');
  const registering = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || '/portal';
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user && !registering.current) {
      const isPaymentReturn = searchParams.get('payment') === 'success';
      if (isPaymentReturn) {
        toast({ title: t('auth.payment.success'), description: t('auth.payment.success.sub') });
        navigate(from);
        return;
      }
      if (isLogin) {
        navigate(from);
      }
    }
  }, [user, authLoading, navigate, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: t('auth.welcome'), description: t('auth.magiclink.verified.sub') });
        navigate(from);
      } else {
        registering.current = true;

        const { data: signUpData, error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `https://aladiahacademy.com/portal`,
            data: {
              full_name: fullName,
              linkedin_url: linkedIn,
              phone_number: phone,
              tier: selectedTier === 'free' ? 'starter' : 'accelerator',
            },
          },
        });
        if (error) throw error;

        if (selectedTier === 'free') {
          // Send welcome email
          registering.current = false;
          fetch('https://vgujnkxylipfwmkpwzvb.supabase.co/functions/v1/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'welcome',
              student: { name: fullName, email, tier: 'starter', language: 'en' },
              lang: 'en',
            }),
          }).catch(() => {});
          setConfirmedEmail(email);
          setShowEmailConfirm(true);
          return;
        }

        // PAID — redirect to Stripe
        const tierObj = TIERS.find(ti => ti.id === 'accelerator')!;
        let checkoutData: { url?: string } | null = null;
        let checkoutError: Error | null = null;
        try {
          const proxyRes = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              priceId: tierObj.priceId,
              email,
              tier: tierObj.key,
              userId: signUpData.user?.id || '',
              successUrl: `${window.location.origin}/auth?payment=success`,
              cancelUrl: `${window.location.origin}/auth?payment=canceled`,
            }),
          });
          checkoutData = await proxyRes.json();
          if (!proxyRes.ok) checkoutError = new Error((checkoutData as any)?.error || 'Checkout failed');
        } catch (e) {
          checkoutError = e as Error;
        }

        if (checkoutError || !checkoutData?.url) {
          registering.current = false;
          await supabase.auth.signOut();
          toast({ title: t('auth.error'), description: 'Payment system unavailable. Try again later.', variant: 'destructive' });
          return;
        }

        window.location.href = checkoutData.url;
      }
    } catch (error: any) {
      registering.current = false;
      toast({ title: t('auth.error'), description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('payment') === 'canceled') {
      toast({ title: t('auth.payment.declined'), description: t('auth.payment.declined.sub'), variant: 'destructive' });
      supabase.auth.signOut();
      setIsLogin(false);
    }
  }, [searchParams]);

  // ── EMAIL CONFIRMATION SCREEN ──────────────────────────────
  if (showEmailConfirm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <Header />
        <div className="flex items-center justify-center p-4 pt-28 pb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="w-full max-w-md">
            <Card className="shadow-large border-primary/10">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                  <MailCheck className="w-8 h-8 text-green-400" />
                </div>
                <CardTitle className="text-2xl font-display">Check Your Email</CardTitle>
                <CardDescription>One more step to activate your free account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 text-center">
                <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '16px' }}>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                    We sent a confirmation link to:
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: '6px 0 0 0' }}>
                    {confirmedEmail}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                  {[
                    'Open your email inbox',
                    'Click the confirmation link from Aladiah Academy',
                    'You\'ll be taken directly to the student portal',
                    'Choose your free course and start learning',
                  ].map((step, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#818cf8' }}>{i + 1}</span>
                      </div>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{step}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '8px' }}>
                  Didn't receive it? Check your spam folder or{' '}
                  <button
                    onClick={async () => {
                      await supabase.auth.resend({ type: 'signup', email: confirmedEmail });
                      toast({ title: 'Email resent!', description: 'Check your inbox again.' });
                    }}
                    style={{ color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '11px' }}
                  >
                    resend the email
                  </button>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── MAIN AUTH FORM ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Header />
      <div className="flex items-center justify-center p-4 pt-28 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className={`w-full ${isLogin ? 'max-w-md' : 'max-w-lg'}`}>
          <Card className="shadow-large border-primary/10">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-display">
                {isLogin ? t('auth.welcome') : t('auth.join')}
              </CardTitle>
              <CardDescription>
                {isLogin ? t('auth.signin.sub') : t('auth.register.sub')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">{t('auth.fullname')}</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input id="fullName" type="text" placeholder={t('auth.fullname.placeholder')} value={fullName}
                            onChange={(e) => setFullName(e.target.value)} required className="pl-9" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('auth.phone')} <span className="text-muted-foreground text-xs">({t('auth.optional')})</span></Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input id="phone" type="tel" placeholder="+1 (555) 000-0000"
                            value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">{t('auth.linkedin')} <span className="text-muted-foreground text-xs">({t('auth.optional')})</span></Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input id="linkedin" type="url" placeholder="https://linkedin.com/in/yourname"
                          value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} className="pl-9" />
                      </div>
                    </div>

                    {/* TIER SELECTION */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Choose Your Plan</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* FREE */}
                        <div onClick={() => setSelectedTier('free')} style={{ border: selectedTier === 'free' ? '2px solid rgba(99,102,241,0.8)' : '2px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px', cursor: 'pointer', background: selectedTier === 'free' ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)', transition: 'all 0.2s', position: 'relative' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <Zap style={{ width: '16px', height: '16px', color: '#6366f1' }} />
                            <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>Starter</span>
                          </div>
                          <p style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 8px 0' }}>Free</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {['1 course of your choice', 'Module 1 access only', 'Prof. Didier AI voice', 'Module quiz included'].map(f => (
                              <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                                <CheckCircle style={{ width: '10px', height: '10px', color: '#6366f1', flexShrink: 0, marginTop: '2px' }} />
                                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{f}</span>
                              </div>
                            ))}
                          </div>
                          {selectedTier === 'free' && (
                            <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#6366f1', borderRadius: '100px', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <CheckCircle style={{ width: '10px', height: '10px', color: '#fff' }} />
                            </div>
                          )}
                        </div>
                        {/* PAID */}
                        <div onClick={() => setSelectedTier('paid')} style={{ border: selectedTier === 'paid' ? '2px solid rgba(245,158,11,0.8)' : '2px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px', cursor: 'pointer', background: selectedTier === 'paid' ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.03)', transition: 'all 0.2s', position: 'relative' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <Crown style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
                            <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>All-Access Pass</span>
                          </div>
                          <p style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 2px 0' }}>$99.99</p>
                          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '0 0 8px 0' }}>/month</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {['All 8 courses', 'All modules unlocked', 'Prof. Didier AI voice', 'Tools & resources', 'Certificates', 'Priority support'].map(f => (
                              <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                                <CheckCircle style={{ width: '10px', height: '10px', color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{f}</span>
                              </div>
                            ))}
                          </div>
                          {selectedTier === 'paid' && (
                            <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#f59e0b', borderRadius: '100px', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <CheckCircle style={{ width: '10px', height: '10px', color: '#000' }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className={!isLogin ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-4'}>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="you@example.com" value={email}
                        onChange={(e) => setEmail(e.target.value)} required className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input id="password" type="password" placeholder="********" value={password}
                        onChange={(e) => setPassword(e.target.value)} required minLength={6} className="pl-9" />
                    </div>
                  </div>
                </div>

                {isLogin && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(59,130,246,0.08)', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{t('auth.secure.info')}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" variant="coral" disabled={loading}>
                  {loading ? t('auth.loading') : isLogin ? t('auth.signin.btn') : selectedTier === 'free' ? 'Create Free Account' : 'Continue to Payment →'}
                </Button>

                {!isLogin && selectedTier === 'paid' && (
                  <p className="text-[11px] text-center text-muted-foreground">{t('auth.stripe.secure')}</p>
                )}
                {!isLogin && selectedTier === 'free' && (
                  <p className="text-[11px] text-center text-muted-foreground">No credit card required · Email verification required</p>
                )}
              </form>
              <div className="mt-6 text-center">
                <button type="button" onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {isLogin ? t('auth.switch.to.register') : t('auth.switch.to.login')}
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
