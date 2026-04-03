import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

const SYSTEM_PROMPT = `You are Aladiah, the admissions assistant for Aladiah Academy — a world-class school for Scrum Masters and Project Managers in the Dominican Republic and globally.

Your ONLY job is to help prospective students with:
- Information about our programs (Scrum Master, PMP, AI for PMs, Data Analytics, Cybersecurity, DevOps, Solution Architect, Business Analysis)
- Pricing and enrollment information
- Course format (AI-powered, multilingual, Prof. Didier as AI instructor, 7 languages)
- Career outcomes and certifications (PSM, PMP, PMI-ACP)
- How to get started

STRICT RULES:
1. NEVER teach Scrum, Agile, or any course content — that is Prof. Didier's job inside the portal
2. For any content question, say: "That's exactly what Prof. Didier covers inside the course! Enroll now and he will teach you personally." Then guide toward registration.
3. Every response should end with a soft call-to-action toward enrollment
4. Keep answers short — 2-3 sentences max
5. Be warm, professional, and enthusiastic about what students will achieve
6. If asked about something outside programs/enrollment, say: "I can only help with program information. Shall I tell you how to get started?"

Programs and pricing context:
- Foundation Builder: $49/month — access to 1 course
- Career Accelerator: $99/month — access to all 8 courses  
- Elite Mentorship: $199/month — all courses + live coaching sessions
- All plans include Prof. Didier AI instructor, 7 languages, chapter quizzes
- Certifications prep included: PSM I/II/III, PMP, PMI-ACP, CSM`;

interface Message { role: 'user' | 'assistant'; content: string; }

export default function HomepageBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I am Aladiah, your admissions guide. 👋 How can I help you today? Ask me about our programs, pricing, or how to get started!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '', 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 300,
          system: SYSTEM_PROMPT,
          messages: [...messages, { role: 'user', content: userMsg }].map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || 'I'd love to help! Please visit our Programs page or click Get Busy to enroll today.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please visit our Programs page or click Get Busy to enroll!' }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
        {!open && (
          <button
            onClick={() => setOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
              color: '#fff', border: 'none', borderRadius: 50,
              padding: '12px 20px', cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(124,58,237,0.4)',
              fontSize: 14, fontWeight: 600,
              animation: 'pulse 2s infinite'
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>A</div>
            Ask Aladiah
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', marginLeft: 2 }} />
          </button>
        )}

        {/* Chat window */}
        {open && (
          <div style={{
            width: 360, height: 480,
            background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 100%)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 20, display: 'flex', flexDirection: 'column',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff' }}>A</div>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#fff' }}>Aladiah</p>
                  <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Admissions Guide · Online</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '82%', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: m.role === 'user' ? 'linear-gradient(135deg,#1d4ed8,#3b82f6)' : 'rgba(255,255,255,0.06)',
                    border: m.role === 'assistant' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    fontSize: 13, lineHeight: 1.6, color: '#e2e8f0'
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ padding: '10px 14px', borderRadius: '16px 16px 16px 4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Loader2 size={14} style={{ animation: 'spin 1s linear infinite', color: '#7c3aed' }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            <div style={{ padding: '0 14px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Pricing?', 'What courses?', 'How to enroll?'].map(q => (
                <button key={q} onClick={() => { setInput(q); }} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.1)', color: '#a78bfa', cursor: 'pointer' }}>
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: '8px 14px 14px', display: 'flex', gap: 8 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask about programs..."
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#e2e8f0', fontSize: 13, outline: 'none'
                }}
              />
              <button onClick={send} disabled={loading} style={{
                width: 40, height: 40, borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Send size={16} color="#fff" />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{box-shadow:0 4px 24px rgba(124,58,237,0.4)} 50%{box-shadow:0 4px 32px rgba(124,58,237,0.7)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </>
  );
}
