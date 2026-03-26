import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { GraduationCap, Mail, Lock, User, Linkedin, Phone, ShieldCheck, Shield, Zap, Crown, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';

const TIERS = [
  {
    id: 'foundation', key: 't1', price: 99,
    priceId: import.meta.env.VITE_STRIPE_PRICE_FOUNDATION || 'price_1TEFgA0CtfIq2xPfWJdun1vH',
    icon: Shield, color: '#3b82f6', popular: false, featureCount: 7, missingCount: 3,
  },
  {
    id: 'accelerator', key: 't2', price: 299,
    priceId: import.meta.env.VITE_STRIPE_PRICE_ACCELERATOR || 'price_1TEFgm0CtfIq2xPfkuYGY5sI',
    icon: Zap, color: '#f59e0b', popular: true, featureCount: 8, missingCount: 1,
  },
  {
    id: 'elite', key: 't3', price: 499,
    priceId: import.meta.env.VITE_STRIPE_PRICE_ELITE || 'price_1TEFhA0CtfIq2xPfZOXBhYlN',
    icon: Crown, color: '#10b981', popular: false, featureCount: 9, missingCount: 0,
  },
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTier, setSelectedTier] = useState('accelerator');
  const [loading, setLoading] = useState(false);
  const registering = useRef(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();

  // If already authenticated AND has paid (or returning from payment), go to portal
  useEffect(() => {
    if (!authLoading && user && !registering.current) {
      // Check if returning from Stripe or already a subscriber
      const isPaymentReturn = searchParams.get('payment') === 'success';
      if (isPaymentReturn) {
        toast({ title: t('auth.payment.success'), description: t('auth.payment.success.sub') });
        navigate('/portal');
        return;
      }
      // For login flow — go to portal (they already have an account)
      if (isLogin) {
        navigate('/portal');
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
        navigate('/portal');
      } else {
        // Block auto-redirect during registration
        registering.current = true;

        // Step 1: Create account
        const { data: signUpData, error } = await supabase.auth.signUp({
          email, password,
          options: {
            data: { full_name: fullName, linkedin_url: linkedIn, phone_number: phone, tier: selectedTier },
          },
        });
        if (error) throw error;

        // Step 2: Redirect to Stripe checkout — payment is REQUIRED
        const tierObj = TIERS.find(ti => ti.id === selectedTier)!;
        const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
          body: {
            priceId: tierObj.priceId,
            email,
            tier: tierObj.key,
            userId: signUpData.user?.id || '',
            successUrl: `${window.location.origin}/auth?payment=success`,
            cancelUrl: `${window.location.origin}/auth?payment=canceled`,
          },
        });

        if (checkoutError || !checkoutData?.url) {
          // Stripe not available — sign out and show error
          registering.current = false;
          await supabase.auth.signOut();
          toast({
            title: t('auth.error'),
            description: 'Payment system is temporarily unavailable. Please try again later.',
            variant: 'destructive',
          });
          return;
        }

        // Redirect to Stripe — student MUST pay to access portal
        window.location.href = checkoutData.url;
      }
    } catch (error: any) {
      registering.current = false;
      toast({ title: t('auth.error'), description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Handle Stripe cancel/decline — student comes back without paying
  useEffect(() => {
    if (searchParams.get('payment') === 'canceled') {
      toast({
        title: t('auth.payment.declined'),
        description: t('auth.payment.declined.sub'),
        variant: 'destructive',
      });
      // Sign out so they can't access portal without paying
      supabase.auth.signOut();
      setIsLogin(false); // Show register form so they can try again
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Header />
      <div className="flex items-center justify-center p-4 pt-28 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className={`w-full ${isLogin ? 'max-w-md' : 'max-w-2xl'}`}>
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

                {/* Tier selector — only on register */}
                {!isLogin && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">{t('auth.choose.plan')}</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {TIERS.map(tier => {
                        const Icon = tier.icon;
                        const isSelected = selectedTier === tier.id;
                        const features = Array.from({ length: tier.featureCount }, (_, i) => t(`pricing.${tier.key}.f${i + 1}`));
                        const missing = Array.from({ length: tier.missingCount }, (_, i) => t(`pricing.${tier.key}.m${i + 1}`));
                        return (
                          <button
                            key={tier.id}
                            type="button"
                            onClick={() => setSelectedTier(tier.id)}
                            className="relative rounded-xl p-4 text-left transition-all"
                            style={{
                              background: isSelected ? `${tier.color}10` : 'rgba(255,255,255,0.02)',
                              border: `2px solid ${isSelected ? tier.color : 'rgba(255,255,255,0.08)'}`,
                              cursor: 'pointer',
                              boxShadow: isSelected ? `0 0 20px ${tier.color}20` : 'none',
                            }}
                          >
                            {tier.popular && (
                              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap" style={{ background: tier.color, color: '#000' }}>
                                {t('pricing.popular')}
                              </span>
                            )}
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className="w-5 h-5" style={{ color: tier.color }} />
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: tier.color }}>
                                  {t(`pricing.${tier.key}.tier`)}
                                </p>
                                <p className="text-xs font-bold text-foreground">{t(`pricing.${tier.key}.name`)}</p>
                              </div>
                            </div>
                            <p className="text-2xl font-bold mb-3" style={{ color: isSelected ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                              ${tier.price}<span className="text-[10px] font-normal text-muted-foreground">/{t('pricing.month')}</span>
                            </p>
                            <div className="space-y-1.5">
                              {features.map((f, i) => (
                                <div key={i} className="flex items-start gap-1.5">
                                  <CheckCircle className="w-3 h-3 mt-0.5 shrink-0" style={{ color: tier.color }} />
                                  <span className="text-[11px] leading-tight" style={{ color: 'rgba(255,255,255,0.7)' }}>{f}</span>
                                </div>
                              ))}
                              {missing.map((f, i) => (
                                <div key={`m${i}`} className="flex items-start gap-1.5">
                                  <div className="w-3 h-[1px] mt-2 shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }} />
                                  <span className="text-[11px] leading-tight line-through" style={{ color: 'rgba(255,255,255,0.25)' }}>{f}</span>
                                </div>
                              ))}
                            </div>
                            {isSelected && (
                              <div className="mt-3 flex items-center justify-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" style={{ color: tier.color }} />
                                <span className="text-[10px] font-bold" style={{ color: tier.color }}>Selected</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(59,130,246,0.08)', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                      {t('auth.secure.info')}
                    </p>
                  </div>
                )}
                <Button type="submit" className="w-full" variant="coral" disabled={loading}>
                  {loading ? t('auth.loading') : isLogin ? t('auth.signin.btn') : t('auth.register.pay.btn')}
                </Button>
                {!isLogin && (
                  <p className="text-[11px] text-center text-muted-foreground">
                    {t('auth.stripe.secure')}
                  </p>
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
