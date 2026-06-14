import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { PASSWORD_RULES, isPasswordValid } from '@/lib/passwordPolicy';
import { KeyRound, Lock, Eye, EyeOff, CheckCircle2, Circle, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';

/**
 * /reset-password — the destination of the Supabase recovery email link.
 * Supabase exchanges the recovery token in the URL for a session (detectSessionInUrl)
 * and fires a PASSWORD_RECOVERY auth event; the user then sets a new password via
 * supabase.auth.updateUser. Public route — no auth guard.
 */
const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // null = still resolving the recovery session, true = ready, false = invalid/expired
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  // Resolve the recovery session. The token is processed from the URL on load;
  // the PASSWORD_RECOVERY event (or an existing session) confirms we can proceed.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setHasSession(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setHasSession(true);
    });
    // Fallback: if no session has appeared shortly after the token is processed,
    // treat the link as invalid/expired.
    const t = setTimeout(() => setHasSession((prev) => (prev === null ? false : prev)), 2500);
    return () => { subscription.unsubscribe(); clearTimeout(t); };
  }, []);

  const rulesPass = isPasswordValid(password);
  const matches = password.length > 0 && password === confirm;
  const canSubmit = rulesPass && matches && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isPasswordValid(password)) { setError('Password does not meet the requirements below.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const { error: upErr } = await supabase.auth.updateUser({ password });
      if (upErr) throw upErr;
      setDone(true);
      toast({ title: 'Password updated successfully' });
      // Sign out so the user re-authenticates with the new password.
      setTimeout(async () => { await supabase.auth.signOut(); navigate('/auth'); }, 2200);
    } catch (err: any) {
      setError(err?.message || 'Could not update password. Please request a new reset link.');
    } finally {
      setLoading(false);
    }
  };

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Header />
      <div className="flex items-center justify-center p-4 pt-28 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <Card className="shadow-large border-primary/10">{children}</Card>
        </motion.div>
      </div>
    </div>
  );

  // ── SUCCESS ────────────────────────────────────────────────
  if (done) {
    return (
      <Shell>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <CardTitle className="text-2xl font-display">Password updated successfully</CardTitle>
          <CardDescription>Redirecting you to sign in…</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" variant="coral" onClick={() => navigate('/auth')}>Go to Sign In →</Button>
        </CardContent>
      </Shell>
    );
  }

  // ── INVALID / EXPIRED LINK ─────────────────────────────────
  if (hasSession === false) {
    return (
      <Shell>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-amber-400" />
          </div>
          <CardTitle className="text-2xl font-display">Reset link invalid or expired</CardTitle>
          <CardDescription>Request a fresh password reset link to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" variant="coral" onClick={() => navigate('/auth')}>Back to Sign In</Button>
        </CardContent>
      </Shell>
    );
  }

  // ── LOADING (resolving recovery session) ───────────────────
  if (hasSession === null) {
    return (
      <Shell>
        <CardContent className="py-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground mt-4">Verifying your reset link…</p>
        </CardContent>
      </Shell>
    );
  }

  // ── SET NEW PASSWORD ───────────────────────────────────────
  return (
    <Shell>
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <KeyRound className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-display">Set a new password</CardTitle>
        <CardDescription>Choose a strong password for your Aladiah account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input id="new-password" type={showPw ? 'text' : 'password'} placeholder="••••••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-9 pr-10" autoFocus />
              <button type="button" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input id="confirm-password" type={showConfirm ? 'text' : 'password'} placeholder="••••••••••••"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="pl-9 pr-10" />
              <button type="button" onClick={() => setShowConfirm((s) => !s)} aria-label={showConfirm ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirm.length > 0 && !matches && (
              <p className="text-xs text-red-400">Passwords do not match.</p>
            )}
          </div>

          {/* Live requirements checklist */}
          <div className="rounded-xl border border-primary/15 bg-primary/[0.04] p-3 space-y-1.5">
            {PASSWORD_RULES.map((r) => {
              const ok = r.test(password);
              return (
                <div key={r.key} className="flex items-center gap-2">
                  {ok ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Circle className="w-3.5 h-3.5 text-muted-foreground/50" />}
                  <span className={`text-xs ${ok ? 'text-green-400' : 'text-muted-foreground'}`}>{r.label}</span>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" variant="coral" disabled={!canSubmit}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating…</> : 'Update Password'}
          </Button>

          <div className="flex items-center gap-2 justify-center text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[11px]">Encrypted by Supabase Auth · your link is single-use</span>
          </div>
        </form>
      </CardContent>
    </Shell>
  );
};

export default ResetPassword;
