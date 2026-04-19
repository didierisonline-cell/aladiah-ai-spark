import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap } from 'lucide-react';

export default function FounderWelcome({ studentName }: { studentName?: string }) {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('welcome_seen');
    if (!seen) {
      setShow(true);
      fetchWelcome();
    }
  }, []);

  const fetchWelcome = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName: studentName || 'there' }),
      });
      const data = await res.json();
      setMessage(data.message || 'Welcome to Aladiah Academy. Let us begin your journey.');
    } catch {
      setMessage('Welcome to Aladiah Academy. Your journey to becoming a world-class Scrum Master starts now. Let us get to work.');
    }
    setLoading(false);
  };

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('welcome_seen', 'true');
  };

  const firstName = (studentName || 'Student').split(' ')[0];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{
            background: 'rgba(5, 8, 20, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full p-8 rounded-2xl"
            style={{
              background: 'linear-gradient(180deg, #0f172a 0%, #0a0f1e 100%)',
              border: '1px solid rgba(196, 164, 74, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(196, 164, 74, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #C4A44A 0%, #f59e0b 100%)',
                  boxShadow: '0 4px 16px rgba(196, 164, 74, 0.4)',
                }}
              >
                <GraduationCap className="w-7 h-7 text-[#0a0f1e]" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: '#C4A44A' }}>
                  Message from the Founder
                </p>
                <h3 className="text-xl font-bold text-white mt-0.5">Prof. Didier</h3>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">
              Welcome to Aladiah, {firstName}
            </h2>

            <p className="text-base text-white/70 leading-relaxed mb-5">
              Thank you for choosing this path to success.
            </p>

            {loading ? (
              <div className="flex items-center gap-2 py-4">
                <div className="w-2 h-2 rounded-full bg-[#C4A44A] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#C4A44A] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#C4A44A] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <div
                className="p-4 rounded-xl mb-6"
                style={{
                  background: 'rgba(196, 164, 74, 0.06)',
                  border: '1px solid rgba(196, 164, 74, 0.15)',
                }}
              >
                <p className="text-sm text-white/80 leading-relaxed italic">
                  "I'm Professor Didier, and I want to personally welcome you. I will be with you every step of your journey here at Aladiah. This platform is designed to help you grow, practice, and succeed. We welcome your feedback and encourage you to participate in the community. You can stay with me as your main professor, or explore other professors to experience different teaching styles."
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={dismiss}
                className="flex-1 py-3 rounded-xl font-semibold text-[#0a0f1e] transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #C4A44A 0%, #f59e0b 100%)',
                  boxShadow: '0 4px 16px rgba(196, 164, 74, 0.3)',
                }}
              >
                Enter My Portal
              </button>
              <button
                onClick={() => { dismiss(); window.location.href = '/community'; }}
                className="flex-1 py-3 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/5 transition-all"
              >
                Go to Community
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
