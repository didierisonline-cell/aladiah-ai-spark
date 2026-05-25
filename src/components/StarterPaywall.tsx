import { motion } from 'framer-motion';
import { Crown, CheckCircle, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  reason: 'wrong_course' | 'module_locked';
  courseName?: string;
}

const FEATURES = [
  'All 8 certification courses',
  'All modules unlocked',
  'Prof. Didier AI voice — unlimited',
  '60 module quizzes',
  'Career tools & resume builder',
  'Interview simulator',
  'Resource library (207 resources)',
  'Community access',
];

export const StarterPaywall = ({ reason, courseName }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleUpgrade = async () => {
    if (!user) { navigate('/auth'); return; }
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: import.meta.env.VITE_STRIPE_PRICE_ACCELERATOR || 'price_1TMWZP0Ctflq2xPfNXr5r24d',
          email: user.email,
          tier: 't2',
          userId: user.id,
          successUrl: `${window.location.origin}/portal?payment=success`,
          cancelUrl: window.location.href,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 50%, #0a0f1e 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Lock icon */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'rgba(245,158,11,0.12)', border: '2px solid rgba(245,158,11,0.3)' }}>
            <Lock className="w-9 h-9" style={{ color: '#f59e0b' }} />
          </div>

          {reason === 'module_locked' ? (
            <>
              <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
                🎉 You Completed Module 1!
              </h1>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', maxWidth: '360px', margin: '0 auto', lineHeight: 1.6 }}>
                Your free access covers Module 1 only. Unlock the full course — and all 7 others — with the All-Access Pass.
              </p>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
                This Course is Locked
              </h1>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', maxWidth: '360px', margin: '0 auto', lineHeight: 1.6 }}>
                Your free access is limited to <strong style={{ color: '#fff' }}>{courseName || 'your selected course'}</strong>, Module 1 only. Upgrade to access everything.
              </p>
            </>
          )}
        </div>

        {/* Pricing card */}
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '2px solid rgba(245,158,11,0.4)', borderRadius: '20px', padding: '28px', marginBottom: '16px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#000', fontSize: '10px', fontWeight: 800, padding: '3px 16px', borderRadius: '100px', whiteSpace: 'nowrap', letterSpacing: '0.08em' }}>
            ALL-ACCESS PASS
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Crown style={{ width: '22px', height: '22px', color: '#f59e0b' }} />
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Aladiah Academy</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '30px', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1 }}>$59.99</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>/month</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
            {FEATURES.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <CheckCircle style={{ width: '12px', height: '12px', color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpgrade}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', color: '#000', fontSize: '15px', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.02em' }}
          >
            Unlock Full Access — $59.99/month →
          </button>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '10px' }}>
            🔒 Secure payment via Stripe · Cancel anytime
          </p>
        </div>

        {/* Back button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/portal')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '13px', cursor: 'pointer' }}
          >
            <ArrowLeft style={{ width: '14px', height: '14px' }} />
            Back to Portal
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default StarterPaywall;
