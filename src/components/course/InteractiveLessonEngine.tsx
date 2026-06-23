import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

// Localization directive appended to the system prompt (EN/FR/ES). Empty for English.
const LANG_DIRECTIVE: Record<string, string> = {
  fr: ' Always respond in French (Français).',
  es: ' Always respond in Spanish (Español).',
};

interface Props {
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
  lessonIndex: number;
  totalLessons: number;
  onComplete: (score: number) => void;
  onBack: () => void;
  onGoHome: () => void;
  onNextLesson: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const InteractiveLessonEngine = ({
  courseTitle, moduleTitle, lessonTitle, lessonIndex, totalLessons,
  onComplete, onBack, onGoHome, onNextLesson,
}: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const systemPrompt = `You are Professor Didier, an expert Scrum Master and Project Management coach at Aladiah Academy. You are teaching "${lessonTitle}" — lesson ${lessonIndex + 1} of ${totalLessons} in module "${moduleTitle}" from course "${courseTitle}". Be warm, direct, and use real-world Agile/Scrum examples. Ask one focused question at a time. After 4-5 exchanges, score the student out of 100 based on engagement. Include exactly: SCORE: [number] on its own line when scoring. Keep responses concise (max 3 paragraphs). Start by greeting the student and giving a 2-sentence overview of the lesson, then ask your first question.` + (LANG_DIRECTIVE[language] || '');

  const checkScore = (text: string) => {
    const match = text.match(/SCORE:\s*(\d+)/i);
    if (match) setScore(parseInt(match[1]));
  };

  const callAPI = async (msgs: Message[]) => {
    // Routed through the server-side ai-proxy edge function — no API key in the browser.
    const { data, error } = await supabase.functions.invoke('ai-proxy', {
      body: {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: msgs.map(m => ({ role: m.role, content: m.content })),
      },
    });
    if (error) throw error;
    return data?.content?.[0]?.text || '';
  };

  const startLesson = async () => {
    setStarted(true);
    setLoading(true);
    try {
      const text = await callAPI([{ role: 'user', content: 'Begin the lesson.' }]);
      setMessages([{ role: 'assistant', content: text }]);
      checkScore(text);
    } catch {
      setMessages([{ role: 'assistant', content: `Welcome! I am Professor Didier. Today we cover: ${lessonTitle}. What do you already know about this topic?` }]);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);
    try {
      const text = await callAPI(updated);
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
      checkScore(text);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Great point! Keep going.' }]);
    }
    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (!started) return (
    <div style={{ background: 'linear-gradient(135deg,#0a1628,#0d1f3c)', minHeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 24 }}>
      <div style={{ fontSize: 64 }}>🎓</div>
      <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700, textAlign: 'center', margin: 0 }}>Interactive Lesson</h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', maxWidth: 400, margin: 0 }}>
        Professor Didier will guide you through <strong style={{ color: '#60a5fa' }}>{lessonTitle}</strong> with real questions and personalized feedback.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 400 }}>
        {[`📚 Course: ${courseTitle}`, `📖 Module: ${moduleTitle}`, `🎯 Lesson ${lessonIndex + 1} of ${totalLessons}: ${lessonTitle}`].map((item, i) => (
          <div key={i} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 10, padding: '10px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{item}</div>
        ))}
      </div>
      <button onClick={startLesson} style={{ background: 'linear-gradient(135deg,#1e40af,#2563eb)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 40px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
        Start Lesson with Prof. Didier →
      </button>
    </div>
  );

  return (
    <div style={{ background: 'linear-gradient(135deg,#0a1628,#0d1f3c)', minHeight: 600, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🎓</span>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Prof. Didier</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{lessonTitle}</div>
          </div>
        </div>
        {score !== null && (
          <div style={{ background: score >= 70 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', border: `1px solid ${score >= 70 ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)'}`, borderRadius: 8, padding: '4px 12px', color: score >= 70 ? '#4ade80' : '#f87171', fontWeight: 700, fontSize: 14 }}>
            Score: {score}/100
          </div>
        )}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '80%', background: m.role === 'user' ? 'linear-gradient(135deg,#1e40af,#2563eb)' : 'rgba(255,255,255,0.07)', border: m.role === 'assistant' ? '1px solid rgba(59,130,246,0.2)' : 'none', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding: '12px 16px', color: '#fff', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {m.role === 'assistant' && <div style={{ color: '#60a5fa', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>PROF. DIDIER</div>}
              {m.content.replace(/SCORE:\s*\d+/gi, '').trim()}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
              Prof. Didier is typing...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {score !== null && (
        <div style={{ padding: '12px 20px', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(59,130,246,0.2)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {score >= 70 && <button onClick={() => onComplete(score)} style={{ background: 'linear-gradient(135deg,#166534,#16a34a)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>✅ Mark Complete</button>}
          <button onClick={onNextLesson} style={{ background: 'linear-gradient(135deg,#1e40af,#2563eb)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Next Lesson →</button>
          <button onClick={onGoHome} style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 20px', fontSize: 13, cursor: 'pointer' }}>🏠 Portal</button>
        </div>
      )}
      <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(59,130,246,0.2)', display: 'flex', gap: 10 }}>
        <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Type your answer and press Enter..." rows={2}
          style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12, padding: '10px 14px', color: '#fff', fontSize: 14, resize: 'none', outline: 'none' }} />
        <button onClick={sendMessage} disabled={loading || !input.trim()}
          style={{ background: loading || !input.trim() ? 'rgba(59,130,246,0.3)' : 'linear-gradient(135deg,#1e40af,#2563eb)', color: '#fff', border: 'none', borderRadius: 12, padding: '0 20px', fontSize: 20, cursor: loading || !input.trim() ? 'not-allowed' : 'pointer' }}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default InteractiveLessonEngine;
