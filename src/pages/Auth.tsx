import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { GraduationCap, Mail, Lock, User, Linkedin, Phone, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';

type Step = 'auth' | 'otp';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<Step>('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Check admin
        const { data: roleData } = await supabase
          .from('user_roles').select('role')
          .eq('user_id', data.user.id).eq('role', 'admin').maybeSingle();

        if (roleData) {
          // Admin bypasses OTP — goes straight to admin dashboard
          toast({ title: 'Welcome back, Admin!', description: 'Redirecting to your dashboard.' });
          navigate('/admin');
          return;
        }

        // Regular student — send OTP and show verification screen
        await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
        setIsAdmin(false);
        setStep('otp');
        toast({ title: '🔐 Verification code sent!', description: 'Check ' + email + ' for your 6-digit code.' });
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            data: { full_name: fullName, linkedin_url: linkedIn, phone_number: phone },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({ title: '🎉 Account created!', description: 'Please check your email to verify your account, then sign in.' });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
      if (error) throw error;
      toast({ title: '✅ Identity verified!', description: 'Welcome to your portal!' });
      navigate('/portal');
    } catch (error: any) {
      toast({ title: 'Invalid code', description: 'Please check your email and try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    toast({ title: '📧 Code resent!', description: 'New verification code sent to ' + email });
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
                      {isLogin ? 'Welcome Back' : 'Join Aladiah Academy'}
                    </CardTitle>
                    <CardDescription>
                      {isLogin ? 'Sign in to continue your learning journey' : 'Start your Scrum Master certification today'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {!isLogin && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                              <Input id="fullName" type="text" placeholder="Your full name" value={fullName}
                                onChange={(e) => setFullName(e.target.value)} required className="pl-9" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn Profile <span className="text-muted-foreground text-xs">(optional)</span></Label>
                            <div className="relative">
                              <Linkedin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                              <Input id="linkedin" type="url" placeholder="https://linkedin.com/in/yourname"
                                value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} className="pl-9" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number <span className="text-muted-foreground text-xs">(optional)</span></Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                              <Input id="phone" type="tel" placeholder="+1 (555) 000-0000"
                                value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9" />
                            </div>
                          </div>
                        </>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input id="email" type="email" placeholder="you@example.com" value={email}
                            onChange={(e) => setEmail(e.target.value)} required className="pl-9" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input id="password" type="password" placeholder="••••••••" value={password}
                            onChange={(e) => setPassword(e.target.value)} required minLength={6} className="pl-9" />
                        </div>
                      </div>
                      {isLogin && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(59,130,246,0.08)', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.2)' }}>
                          <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                            A 6-digit verification code will be sent to your email after signing in.
                          </p>
                        </div>
                      )}
                      <Button type="submit" className="w-full" variant="coral" disabled={loading}>
                        {loading ? 'Please wait...' : isLogin ? 'Sign In & Verify →' : 'Create Account'}
                      </Button>
                    </form>
                    <div className="mt-6 text-center">
                      <button type="button" onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="shadow-large border-primary/10">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                      style={{ background: 'rgba(59,130,246,0.15)', border: '2px solid rgba(59,130,246,0.4)' }}>
                      <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-display">Verify Your Identity</CardTitle>
                    <CardDescription>
                      We sent a 6-digit code to<br />
                      <strong style={{ color: 'hsl(var(--primary))' }}>{email}</strong>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleOtpVerify} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="otp">Verification Code</Label>
                        <Input id="otp" type="text" placeholder="000000" value={otp} maxLength={6}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} required
                          style={{ textAlign: 'center', fontSize: '28px', letterSpacing: '10px', fontWeight: 700 }} />
                      </div>
                      <Button type="submit" className="w-full" variant="coral" disabled={loading || otp.length < 6}>
                        {loading ? 'Verifying...' : '✅ Verify & Enter Portal'}
                      </Button>
                      <div className="text-center space-y-2 pt-2">
                        <button type="button" onClick={resendOtp}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors block w-full">
                          Didn't get the code? Resend
                        </button>
                        <button type="button" onClick={() => setStep('auth')}
                          className="text-xs text-muted-foreground hover:text-primary transition-colors block w-full">
                          ← Back to sign in
                        </button>
                      </div>
                    </form>
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
