// =============================================================================
// Professor Didier™ v1 — the lesson-aware text tutor (WO-0015, FEO-2026-001).
// Lives inside the lesson page, grounded in the CURRENT lesson via the pure
// prompt core. Text chat works where the voice session cannot: no microphone,
// quiet library, slow connection — the tutor is never more than one tap away.
// =============================================================================
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import profDidierAvatar from '@/assets/professor-didier.png';
import {
  TutorLessonContext, TutorMessage,
  buildTutorSystemPrompt, starterSuggestions,
} from '@/services/tutor/professorDidier';
import { askProfessorDidier } from '@/services/tutor/tutorClient';

const LABELS: Record<string, Record<string, string>> = {
  en: {
    title: 'Ask Prof. Didier', subtitle: 'Your professor, in writing — no microphone needed',
    placeholder: 'Ask anything about this lesson…', send: 'Send',
    thinking: 'Prof. Didier is thinking…', error: 'That didn’t go through. Tap to retry.',
    greeting: 'I’m here whenever a part of this lesson deserves a better explanation. Ask me anything — or start with one of these:',
  },
  es: {
    title: 'Pregunta al Prof. Didier', subtitle: 'Tu profesor, por escrito — sin micrófono',
    placeholder: 'Pregunta lo que quieras sobre esta lección…', send: 'Enviar',
    thinking: 'El Prof. Didier está pensando…', error: 'No se pudo enviar. Toca para reintentar.',
    greeting: 'Estoy aquí para explicarte mejor cualquier parte de esta lección. Pregúntame lo que quieras — o empieza con una de estas:',
  },
  fr: {
    title: 'Demandez au Prof. Didier', subtitle: 'Votre professeur, à l’écrit — sans micro',
    placeholder: 'Posez une question sur cette leçon…', send: 'Envoyer',
    thinking: 'Le Prof. Didier réfléchit…', error: 'Échec de l’envoi. Touchez pour réessayer.',
    greeting: 'Je suis là pour mieux expliquer chaque partie de cette leçon. Posez-moi vos questions — ou commencez par :',
  },
};
const getLabel = (lang: string, key: string) => (LABELS[lang] || LABELS.en)[key] || LABELS.en[key];

interface Props {
  context: TutorLessonContext;
}

export default function ProfessorDidierTutor({ context }: Props) {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState<string | null>(null); // the message that failed, for retry
  const scrollRef = useRef<HTMLDivElement>(null);
  const lessonKey = `${context.lessonTitle}::${context.lessonNumber}`;

  // A new lesson is a fresh conversation — the grounding changed.
  useEffect(() => { setMessages([]); setFailed(null); setInput(''); }, [lessonKey]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: 99999, behavior: 'smooth' }); }, [messages, loading]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || loading) return;
    setFailed(null);
    setInput('');
    const next: TutorMessage[] = [...messages, { role: 'user', content: question }];
    setMessages(next);
    setLoading(true);
    try {
      const reply = await askProfessorDidier(buildTutorSystemPrompt({ ...context, language }), next);
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(messages); // roll the optimistic user bubble back into the retry chip
      setFailed(question);
    }
    setLoading(false);
  };

  const suggestions = starterSuggestions({ ...context, language });

  return (
    <div style={{ background: 'linear-gradient(160deg,#0f172a,#0d1b3e)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 20, overflow: 'hidden', marginBottom: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', borderBottom: '1px solid rgba(96,165,250,0.1)' }}>
        <img src={profDidierAvatar} alt="Prof. Didier" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(96,165,250,0.35)', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{getLabel(language, 'title')} <span style={{ fontSize: 10, verticalAlign: 'super', color: '#60a5fa' }}>™</span></div>
          <div style={{ fontSize: 12, color: '#475569' }}>{getLabel(language, 'subtitle')}</div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '3px 10px', textTransform: 'uppercase' }}>
        Lesson {context.lessonNumber}/{context.lessonCount}
        </span>
      </div>

      {/* Conversation */}
      <div ref={scrollRef} style={{ maxHeight: 340, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.length === 0 && (
          <div>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, margin: '0 0 12px' }}>{getLabel(language, 'greeting')}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => send(s)} disabled={loading}
                  style={{ background: 'rgba(30,64,175,0.15)', border: '1px solid rgba(96,165,250,0.25)', color: '#93c5fd', borderRadius: 999, padding: '7px 14px', fontSize: 12.5, cursor: 'pointer', textAlign: 'left' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'assistant' ? 'flex-start' : 'flex-end' }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: m.role === 'assistant' ? '#60a5fa' : '#64748b', marginBottom: 4 }}>
              {m.role === 'assistant' ? 'Prof. Didier' : ''}
            </span>
            <div style={{ background: m.role === 'assistant' ? 'rgba(30,64,175,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${m.role === 'assistant' ? 'rgba(96,165,250,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, padding: '10px 14px', maxWidth: '88%' }}>
              <span style={{ fontSize: 13.5, color: '#cbd5e1', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{m.content}</span>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#60a5fa', fontSize: 12.5 }}>
            <span style={{ display: 'inline-flex', gap: 3 }}>
              {[0, 1, 2].map((d) => (
                <span key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa', animation: `pd-pulse 1.2s ${d * 0.18}s ease-in-out infinite` }} />
              ))}
            </span>
            {getLabel(language, 'thinking')}
            <style>{`@keyframes pd-pulse{0%,80%,100%{opacity:.25;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
          </div>
        )}
        {failed && !loading && (
          <button onClick={() => send(failed)} style={{ alignSelf: 'flex-end', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: 10, padding: '8px 14px', fontSize: 12.5, cursor: 'pointer' }}>
            ↻ {getLabel(language, 'error')}
          </button>
        )}
      </div>

      {/* Composer */}
      <div style={{ display: 'flex', gap: 10, padding: '14px 24px 18px', borderTop: '1px solid rgba(96,165,250,0.07)' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder={getLabel(language, 'placeholder')}
          disabled={loading}
          style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 12, padding: '12px 14px', fontSize: 13.5, color: '#e2e8f0', outline: 'none' }}
        />
        <button onClick={() => send(input)} disabled={loading || !input.trim()}
          style={{ padding: '0 20px', borderRadius: 12, border: 'none', background: input.trim() && !loading ? 'linear-gradient(135deg,#1d4ed8,#3b82f6)' : 'rgba(96,165,250,0.12)', color: input.trim() && !loading ? '#fff' : '#475569', fontSize: 13.5, fontWeight: 700, cursor: input.trim() && !loading ? 'pointer' : 'not-allowed' }}>
          {getLabel(language, 'send')}
        </button>
      </div>
    </div>
  );
}
