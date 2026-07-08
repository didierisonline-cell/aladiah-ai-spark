import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message { role: 'user' | 'assistant'; content: string; }

// Localization directive appended to the system prompt (EN/FR/ES). Empty for English.
const LANG_DIRECTIVE: Record<string, string> = {
  fr: ' Always respond in French (Français).',
  es: ' Always respond in Spanish (Español).',
};

const FALLBACKS: Record<string, string> = {
  price: 'We have one simple plan: $99.99/month — full access to all programs, Prof. Didier AI voice instructor, AI Interview Coach, Resume Builder, and everything in 7 languages. Click Get Busy above to start! 🚀',
  course: 'We offer world-class programs including Scrum Master, PMP, AI for Project Managers, Data Analytics, Cybersecurity, DevOps, Solution Architect, and Business Analysis. Each includes AI instruction, quizzes, and certification prep. Which interests you?',
  enroll: 'Getting started is easy — click Get Busy at the top! You can start and upgrade anytime. Prof. Didier will personally guide your first lesson. 🎓',
  certif: 'Our programs prep you for PSM I/II/III, PMP, PMI-ACP, CSM, and more. Enroll now and get certified faster!',
  language: 'Prof. Didier teaches in 7 languages: English, French, Spanish, German, Mandarin, Arabic, and Japanese. Switch anytime during a lesson. 🌍',
  default: 'Aladiah Academy offers AI-powered professional training for Scrum Masters and Project Managers. Prof. Didier teaches you personally using the Socratic method. Want to know about programs or pricing?',
};

function getFallback(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) return FALLBACKS.price;
  if (lower.includes('course') || lower.includes('program') || lower.includes('what')) return FALLBACKS.course;
  if (lower.includes('enroll') || lower.includes('start') || lower.includes('join') || lower.includes('sign')) return FALLBACKS.enroll;
  if (lower.includes('certif')) return FALLBACKS.certif;
  if (lower.includes('language') || lower.includes('french') || lower.includes('spanish') || lower.includes('arabic')) return FALLBACKS.language;
  return FALLBACKS.default;
}

export default function HomepageBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I am Aladiah, your admissions guide. 👋 Ask me about our programs, pricing, or how to get started!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const system = 'You are Aladiah, the admissions assistant for Aladiah Academy. Only answer questions about programs, pricing, and enrollment. Never teach course content — direct content questions to Prof. Didier inside the course portal. Programs: Scrum Master, PMP, AI for PMs, Data Analytics, Cybersecurity, DevOps, Solution Architect, Business Analysis. Plan: All-Access Pass $99.99/mo — includes every live program (4 career programs today, more coming soon). Never promise employment, placement, salary outcomes, or certificates (certifications are coming soon). Always end with a gentle call to action. Keep responses under 3 sentences.'
      + (LANG_DIRECTIVE[language] || '');

    try {
      // Routed through the server-side ai-proxy edge function — no API key in the browser.
      const { data, error } = await supabase.functions.invoke('ai-proxy', {
        body: {
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 250,
          system,
          messages: messages.concat({ role: 'user', content: userMsg }).map(m => ({ role: m.role, content: m.content })),
        },
      });
      if (error) throw error;
      const reply = data?.content?.[0]?.text || getFallback(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: getFallback(userMsg) }]);
    }
    setLoading(false);
  };

  const quick = ['Pricing?', 'What programs?', 'How to enroll?', 'Certifications?'];

  return (
    <>
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
        {!open && (
          <button
            onClick={() => setOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)',
              color: '#fff', border: 'none', borderRadius: 50,
              padding: '12px 20px', cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(124,58,237,0.4)',
              fontSize: 14, fontWeight: 600
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15 }}>A</div>
            Ask Aladiah
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
          </button>
        )}

        {open && (
          <div style={{
            width: 350, height: 460,
            background: 'linear-gradient(160deg,#0f172a 0%,#1e1b4b 100%)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 20, display: 'flex', flexDirection: 'column',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)', overflow: 'hidden'
          }}>
            <div style={{ padding: '14px 18px', background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 15 }}>A</div>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#fff' }}>Aladiah</p>
                  <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Admissions Guide · Online</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '85%', padding: '9px 13px',
                    borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                    background: m.role === 'user' ? 'linear-gradient(135deg,#1d4ed8,#3b82f6)' : 'rgba(255,255,255,0.07)',
                    border: m.role === 'assistant' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    fontSize: 13, lineHeight: 1.55, color: '#e2e8f0'
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex' }}>
                  <div style={{ padding: '9px 13px', borderRadius: '14px 14px 14px 3px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Loader2 size={13} style={{ color: '#7c3aed' }} className="animate-spin" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div style={{ padding: '0 12px 6px', display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {quick.map(q => (
                <button key={q} onClick={() => setInput(q)} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, border: '1px solid rgba(124,58,237,0.35)', background: 'rgba(124,58,237,0.1)', color: '#a78bfa', cursor: 'pointer' }}>
                  {q}
                </button>
              ))}
            </div>

            <div style={{ padding: '6px 12px 14px', display: 'flex', gap: 7 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask about programs..."
                style={{ flex: 1, padding: '9px 13px', borderRadius: 11, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: '#e2e8f0', fontSize: 13, outline: 'none' }}
              />
              <button onClick={send} disabled={loading} style={{ width: 38, height: 38, borderRadius: 11, border: 'none', background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={15} color="#fff" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
