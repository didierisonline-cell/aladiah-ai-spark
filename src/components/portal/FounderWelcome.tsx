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
      const res = await fetch('http://localhost:3001/welcome', {
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

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative bg-card rounded-2xl shadow-2xl max-w-lg w-full p-8 border border-border"
          >
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                🎓
              </div>
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest">Message from the Founder</p>
                <h3 className="text-xl font-bold text-foreground">Prof. Didier</h3>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <p className="text-base leading-relaxed text-foreground/90 italic mb-6">
                "{message}"
              </p>
            )}

            <button
              onClick={dismiss}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Let's Get Started
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}