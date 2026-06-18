import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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
      setMessage(data.message || '');
    } catch {
      setMessage('');
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
            background: 'rgba(5, 8, 20, 0.95)',
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
            className="relative max-w-xl w-full rounded-2xl overflow-hidden"
            style={{
              background: 'radial-gradient(ellipse at center, #1e3a6f 0%, #0d1b3a 70%, #081130 100%)',
              border: '1px solid rgba(196, 164, 74, 0.4)',
              boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(196, 164, 74, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
            }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ opacity: 0.12 }}
            >
              <img
                src="/brand/aladiah-mark.svg"
                alt=""
                className="w-[360px] h-[360px]"
                style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))' }}
              />
            </div>

            <div className="relative p-8">
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: '#C4A44A' }}>
                  Message from the Founder
                </p>
                <h3 className="text-lg font-bold text-white">Prof. Didier</h3>
              </div>

              <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                Welcome to Aladiah, <span style={{ color: '#C4A44A' }}>{firstName}</span>
              </h2>

              <p className="text-base font-medium text-white/90 mb-5 leading-relaxed">
                Thank you for choosing this path to success.
              </p>

              {loading ? (
                <div className="flex items-center gap-2 py-3">
                  <div className="w-2 h-2 rounded-full bg-[#C4A44A] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#C4A44A] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#C4A44A] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <p className="text-[15px] text-white/85 leading-relaxed mb-6 italic" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                  "I'm Professor Didier, and I want to personally welcome you. I'll be with you every step of your journey here at Aladiah. This platform is designed to help you grow, practice, and succeed. You can stay with me as your main professor, or explore other professors to experience different teaching styles."
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={dismiss}
                  className="flex-1 py-3 rounded-xl font-bold text-[#0a0f1e] transition-all hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #C4A44A 0%, #E4C668 100%)',
                    boxShadow: '0 4px 16px rgba(196, 164, 74, 0.4)',
                  }}
                >
                  Enter My Portal
                </button>
                <button
                  onClick={() => { dismiss(); window.location.href = '/community'; }}
                  className="flex-1 py-3 rounded-xl font-semibold text-white transition-all hover:bg-white/10"
                  style={{ border: '1px solid rgba(255, 255, 255, 0.25)' }}
                >
                  Go to Community
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
