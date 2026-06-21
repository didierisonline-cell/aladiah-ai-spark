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
import { getAttribution } from '@/lib/attribution';
import { GraduationCap, Mail, Lock, User, Linkedin, Phone, ShieldCheck, CheckCircle, Zap, Crown, MailCheck, Eye, EyeOff, Loader2, KeyRound, Info, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Logo from '@/components/Logo';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link } from 'react-router-dom';
import { PASSWORD_RULES } from '@/lib/passwordPolicy';
import { useLanguage } from '@/contexts/LanguageContext';
import { isFounderEmail, FOUNDER_HOME } from '@/lib/roles';

const REMEMBER_KEY = 'aladiah-remember-email';

const TIERS = [
  { id: 'accelerator', key: 't2', price: 99.99, priceId: import.meta.env.VITE_STRIPE_PRICE_ACCELERATOR || "price_1TW7U21wgazWak4Atj7TblB3", name: 'All-Access Pass' },
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
  // Enterprise auth UX
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const registering = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || '/portal';
  // Honor the intended destination. A founder is only sent to /founder when that
  // was the explicit login target (e.g. they were bounced off a founder route);
  // a default/student target lands them on /portal, where the founder preview
  // banner appears. This keeps /portal reachable by founders (no forced redirect).
  const destFor = (email?: string | null) =>
    isFounderEmail(email) && from === FOUNDER_HOME ? FOUNDER_HOME : from;
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
        navigate(destFor(user?.email));
      }
    }
  }, [user, authLoading, navigate, isLogin]);

  // Prefill a remembered email (Remember Me) on first load.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) { setEmail(saved); setRememberMe(true); }
    } catch { /* storage unavailable */ }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Remember Me: persist the email for prefill (session itself always persists).
        try {
          if (rememberMe) localStorage.setItem(REMEMBER_KEY, email);
          else localStorage.removeItem(REMEMBER_KEY);
        } catch { /* ignore */ }
        toast({ title: t('auth.welcome'), description: t('auth.magiclink.verified.sub') });
        navigate(destFor(email));
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
              ...getAttribution(), // first-party attribution: utm_*, gclid, fbclid, referral_code, landing_page, first_seen_at
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
          toast({ title: t('auth.error'), description: t('auth.err.payment_unavailable'), variant: 'destructive' });
          return;
        }

        window.location.href = checkoutData.url;
      }
    } catch (error: any) {
      registering.current = false;
      const msg = /invalid login credentials/i.test(error?.message || '')
        ? t('auth.err.invalid_creds')
        : (error?.message || t('auth.err.generic'));
      setAuthError(msg);
      toast({ title: t('auth.error'), description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Send a password reset email → links back to /reset-password.
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setAuthError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setForgotSent(true);
    } catch (error: any) {
      setAuthError(error?.message || t('auth.err.reset_failed'));
    } finally {
      setForgotLoading(false);
    }
  };

  // Optional Google OAuth (requires the Google provider enabled in Supabase Auth).
  const handleGoogle = async () => {
    setGoogleLoading(true);
    setAuthError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/portal` },
      });
      if (error) throw error;
    } catch (error: any) {
      setAuthError(error?.message || t('auth.err.google_unavailable'));
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('payment') === 'canceled') {
      toast({ title: t('auth.payment.declined'), description: t('auth.payment.declined.sub'), variant: 'destructive' });
      supabase.auth.signOut();
      setIsLogin(false);
    }
  }, [searchParams]);

  // ── FORGOT PASSWORD SCREEN ─────────────────────────────────
  if (forgotMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        <Header />
        <div className="flex items-center justify-center p-4 pt-28 pb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
            <Card className="shadow-large border-primary/10">
              {forgotSent ? (
                <>
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                      <MailCheck className="w-8 h-8 text-green-400" />
                    </div>
                    <CardTitle className="text-2xl font-display">{t('auth.forgot.sent_title')}</CardTitle>
                    <CardDescription>{t('auth.forgot.sent_sub')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-center">
                    <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: 16 }}>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{t('auth.forgot.sent_to')}</p>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '6px 0 0' }}>{forgotEmail}</p>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{t('auth.forgot.sent_note')}</p>
                    <Button variant="outline" className="w-full" onClick={() => { setForgotMode(false); setForgotSent(false); }}>{t('auth.back_signin')}</Button>
                  </CardContent>
                </>
              ) : (
                <>
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <KeyRound className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-display">{t('auth.forgot.title')}</CardTitle>
                    <CardDescription>{t('auth.forgot.sub')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleForgot} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email">{t('auth.email')}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input id="forgot-email" type="email" placeholder="you@example.com" value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)} required className="pl-9" autoFocus />
                        </div>
                      </div>
                      {authError && (
                        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
                          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                          <p className="text-xs text-red-300">{authError}</p>
                        </div>
                      )}
                      <Button type="submit" className="w-full" variant="coral" disabled={forgotLoading}>
                        {forgotLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('auth.forgot.sending')}</> : t('auth.forgot.send')}
                      </Button>
                      <button type="button" onClick={() => { setForgotMode(false); setAuthError(''); }}
                        className="w-full text-sm text-muted-foreground hover:text-primary transition-colors">
                        {t('auth.back_signin')}
                      </button>
                    </form>
                  </CardContent>
                </>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

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
                <CardTitle className="text-2xl font-display">{t('auth.confirm.title')}</CardTitle>
                <CardDescription>{t('auth.confirm.sub')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 text-center">
                <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '16px' }}>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                    {t('auth.confirm.sent_to')}
                  </p>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: '6px 0 0 0' }}>
                    {confirmedEmail}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                  {[
                    t('auth.confirm.step1'),
                    t('auth.confirm.step2'),
                    t('auth.confirm.step3'),
                    t('auth.confirm.step4'),
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
                  {t('auth.confirm.spam')}{' '}
                  <button
                    onClick={async () => {
                      await supabase.auth.resend({ type: 'signup', email: confirmedEmail });
                      toast({ title: t('auth.resent_title'), description: t('auth.resent_sub') });
                    }}
                    style={{ color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '11px' }}
                  >
                    {t('auth.confirm.resend')}
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
              <div className="mx-auto mb-4 flex items-center justify-center">
                <Logo variant="mark" style={{ height: 56, width: 'auto' }} />
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
                      <Label className="text-sm font-semibold">{t('auth.plan.choose')}</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* FREE */}
                        <div onClick={() => setSelectedTier('free')} style={{ border: selectedTier === 'free' ? '2px solid rgba(99,102,241,0.8)' : '2px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px', cursor: 'pointer', background: selectedTier === 'free' ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)', transition: 'all 0.2s', position: 'relative' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <Zap style={{ width: '16px', height: '16px', color: '#6366f1' }} />
                            <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>{t('auth.plan.starter')}</span>
                          </div>
                          <p style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 8px 0' }}>{t('auth.plan.free')}</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {[t('auth.plan.free_f1'), t('auth.plan.free_f2'), t('auth.plan.free_f3'), t('auth.plan.free_f4')].map(f => (
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
                            <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>{t('auth.plan.allaccess')}</span>
                          </div>
                          <p style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 2px 0' }}>$99.99</p>
                          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '0 0 8px 0' }}>{t('auth.plan.month')}</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {[t('auth.plan.paid_f1'), t('auth.plan.paid_f2'), t('auth.plan.paid_f3'), t('auth.plan.paid_f4'), t('auth.plan.paid_f5'), t('auth.plan.paid_f6')].map(f => (
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
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="password">{t('auth.password')}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button type="button" aria-label={t('auth.aria.pwd_req')} className="text-muted-foreground hover:text-primary">
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 text-xs">
                          <p className="font-semibold mb-2">{t('auth.pwd_requirements')}</p>
                          <ul className="space-y-1">
                            {PASSWORD_RULES.map((r) => (
                              <li key={r.key} className="flex items-center gap-2 text-muted-foreground">
                                <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />{r.label}
                              </li>
                            ))}
                          </ul>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="********" value={password}
                        onChange={(e) => setPassword(e.target.value)} required minLength={6} className="pl-9 pr-10" />
                      <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? t('auth.aria.hide_pwd') : t('auth.aria.show_pwd')}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <Checkbox checked={rememberMe} onCheckedChange={(v) => setRememberMe(v === true)} />
                      <span className="text-sm text-muted-foreground">{t('auth.remember')}</span>
                    </label>
                    <button type="button" onClick={() => { setForgotMode(true); setForgotEmail(email); setAuthError(''); }}
                      className="text-sm text-primary hover:underline">
                      {t('auth.forgot_link')}
                    </button>
                  </div>
                )}

                {authError && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-xs text-red-300">{authError}</p>
                  </div>
                )}

                {isLogin && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(59,130,246,0.08)', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{t('auth.secure.info')}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" variant="coral" disabled={loading || googleLoading}>
                  {loading
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('auth.loading')}</>
                    : isLogin ? t('auth.signin.btn') : selectedTier === 'free' ? t('auth.create_free') : t('auth.continue_payment')}
                </Button>

                {/* Optional Google OAuth (requires Google provider enabled in Supabase Auth) */}
                <div className="flex items-center gap-3 py-1">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[11px] text-muted-foreground">{t('auth.or')}</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={loading || googleLoading}>
                  {googleLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.99 10.99 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
                    </svg>
                  )}
                  {t('auth.google')}
                </Button>

                {!isLogin && selectedTier === 'paid' && (
                  <p className="text-[11px] text-center text-muted-foreground">{t('auth.stripe.secure')}</p>
                )}
                {!isLogin && selectedTier === 'free' && (
                  <p className="text-[11px] text-center text-muted-foreground">{t('auth.nocard')}</p>
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
