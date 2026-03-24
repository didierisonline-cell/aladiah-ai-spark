import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { GraduationCap, Mail, Lock, User, Linkedin, Phone, ShieldCheck, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import { useLanguage } from '@/contexts/LanguageContext';

type Step = 'auth' | 'magic-link-sent';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<Step>('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [waitingForLink, setWaitingForLink] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();

  // If already authenticated (or magic link clicked in same browser), go to portal
  useEffect(() => {
    if (!authLoading && user) {
      // Clean up polling if active
      if (pollRef.current) clearInterval(pollRef.current);
      navigate('/portal');
    }
  }, [user, authLoading, navigate]);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // Start polling for session after magic link is sent
  const startSessionPolling = () => {
    setWaitingForLink(true);
    // Poll every 3 seconds to detect when user clicks the magic link
    pollRef.current = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Magic link was clicked — session is now active
        if (pollRef.current) clearInterval(pollRef.current);
        setWaitingForLink(false);
        toast({ title: t('auth.magiclink.verified'), description: t('auth.magiclink.verified.sub') });
        navigate('/portal');
      }
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        // Step 1: Verify credentials are correct
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Step 2: Sign out so session doesn't persist before email verification
        await supabase.auth.signOut();

        // Step 3: Send magic link for secure verified login
        const { error: magicError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false,
            emailRedirectTo: `${window.location.origin}/portal`,
          },
        });
        if (magicError) throw magicError;

        setStep('magic-link-sent');
        startSessionPolling();
        toast({ title: t('auth.magiclink.sent'), description: t('auth.magiclink.sent.sub') });
      } else {
        // Registration
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            data: { full_name: fullName, linkedin_url: linkedIn, phone_number: phone },
            emailRedirectTo: `${window.location.origin}/portal`,
          },
        });
        if (error) throw error;
        toast({ title: t('auth.account.created'), description: t('auth.account.created.sub') });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({ title: t('auth.error'), description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resendMagicLink = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/portal`,
        },
      });
      if (error) throw error;
      toast({ title: t('auth.magiclink.resent'), description: t('auth.magiclink.resent.sub') });
      // Restart polling
      if (pollRef.current) clearInterval(pollRef.current);
      startSessionPolling();
    } catch (error: any) {
      toast({ title: t('auth.error'), description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Header />
      <div className="flex items-center justify-center p-4 pt-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <AnimatePresence mode="wait">

            {step === 'auth' && (
              <motion.div key="auth" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
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
                          <div className="space-y-2">
                            <Label htmlFor="fullName">{t('auth.fullname')}</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                              <Input id="fullName" type="text" placeholder={t('auth.fullname.placeholder')} value={fullName}
                                onChange={(e) => setFullName(e.target.value)} required className="pl-9" />
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
                          <div className="space-y-2">
                            <Label htmlFor="phone">{t('auth.phone')} <span className="text-muted-foreground text-xs">({t('auth.optional')})</span></Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                              <Input id="phone" type="tel" placeholder="+1 (555) 000-0000"
                                value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9" />
                            </div>
                          </div>
                        </>
                      )}
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
                      {isLogin && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(59,130,246,0.08)', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.2)' }}>
                          <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                            {t('auth.magiclink.info')}
                          </p>
                        </div>
                      )}
                      <Button type="submit" className="w-full" variant="coral" disabled={loading}>
                        {loading ? t('auth.loading') : isLogin ? t('auth.signin.btn') : t('auth.register.btn')}
                      </Button>
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
            )}

            {step === 'magic-link-sent' && (
              <motion.div key="magic-link" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="shadow-large border-primary/10">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                      style={{ background: 'rgba(59,130,246,0.15)', border: '2px solid rgba(59,130,246,0.4)' }}>
                      <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-display">{t('auth.magiclink.title')}</CardTitle>
                    <CardDescription>
                      {t('auth.magiclink.sub')}<br />
                      <strong style={{ color: 'hsl(var(--primary))' }}>{email}</strong>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center space-y-2">
                      <p className="text-sm font-medium">{t('auth.magiclink.instructions')}</p>
                      <p className="text-xs text-muted-foreground">{t('auth.magiclink.spam')}</p>
                    </div>

                    {/* Waiting indicator */}
                    {waitingForLink && (
                      <div className="flex items-center justify-center gap-2 py-2">
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        <p className="text-sm text-muted-foreground">{t('auth.magiclink.waiting')}</p>
                      </div>
                    )}

                    <div className="text-center space-y-2 pt-2">
                      <button type="button" onClick={resendMagicLink} disabled={loading}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors block w-full">
                        {t('auth.magiclink.resend.btn')}
                      </button>
                      <button type="button" onClick={() => { if (pollRef.current) clearInterval(pollRef.current); setWaitingForLink(false); setStep('auth'); }}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors block w-full">
                        {t('auth.magiclink.back')}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
