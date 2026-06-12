import { useState } from 'react';

const C = { fg: '#f1f5f9', fm: '#94a3b8', fd: '#475569', blue: '#3b82f6', blue2: '#60a5fa', gold: '#f59e0b', green: '#22c55e', card: 'rgba(15,23,42,0.6)', border: 'rgba(96,165,250,0.15)' };

export interface LessonPlayerProps {
  course: any; chapter: any; currentLesson: any; videos: any[]; quizzes: any[];
  progress: number; continueIsToQuiz: boolean;
  isLive: boolean; isSpeaking: boolean; convStatus: string; transcript: { role: 'user' | 'agent'; message: string }[]; duration: number;
  fmt: (s: number) => string;
  getTitle: (x: any) => string; getDescription: (x: any) => string; getTranscript: (x: any) => string;
  onSelectLesson: (v: any) => void; onOpenQuiz: (id: string) => void; onContinue: () => void;
  onStart: () => void; onEnd: () => void; onBack: () => void;
}

function Video({ url }: { url: string }) {
  const embed = /youtube|youtu\.be|vimeo/i.test(url);
  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', borderRadius: 14, overflow: 'hidden', background: '#000', marginBottom: 18, border: '1px solid rgba(96,165,250,.15)' }}>
      {embed ? (
        <iframe src={url} title="Lesson video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} />
      ) : (
        <video src={url} controls playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', background: '#000' }} />
      )}
    </div>
  );
}

/** Immersive single-column lesson player for phones (< 768px). No bottom tab bar. */
export default function MobileLessonPlayer(p: LessonPlayerProps) {
  const [showReading, setShowReading] = useState(true);
  const lesson = p.currentLesson;
  const reading = p.getDescription(lesson);
  const transcript = p.getTranscript(lesson);
  const chapterEndQuiz = p.quizzes.find((q: any) => q.quiz_type === 'chapter_end') || p.quizzes[0];

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky header */}
      <header className="safe-top app-tap" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,15,30,0.92)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(96,165,250,0.12)' }}>
        <div style={{ height: 52, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px' }}>
          <button onClick={p.onBack} className="tap-target app-tap" aria-label="Back" style={{ background: 'none', border: 'none', color: C.fm, fontSize: 24, cursor: 'pointer' }}>‹</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.getTitle(p.chapter)}</div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: p.progress === 100 ? C.green : C.blue2 }}>{p.progress}%</span>
        </div>
        <div style={{ height: 3, background: 'rgba(96,165,250,0.1)' }}>
          <div style={{ height: '100%', width: `${p.progress}%`, background: 'linear-gradient(90deg,#1d4ed8,#3b82f6)', transition: 'width .4s' }} />
        </div>
      </header>

      {/* Lesson chips */}
      {p.videos.length > 1 && (
        <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 14px 4px' }}>
          {p.videos.map((v, i) => {
            const active = lesson?.id === v.id;
            return (
              <button key={v.id} onClick={() => p.onSelectLesson(v)} className="app-tap" style={{ flexShrink: 0, padding: '7px 13px', borderRadius: 99, fontSize: 12, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', color: active ? '#fff' : C.fm, background: active ? 'linear-gradient(90deg,#1d4ed8,#3b82f6)' : 'rgba(255,255,255,.05)', border: `1px solid ${active ? 'transparent' : 'rgba(255,255,255,.08)'}` }}>
                {i + 1}
              </button>
            );
          })}
        </div>
      )}

      {/* Content */}
      <main className="pb-tabbar" style={{ flex: 1, padding: '14px 16px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.blue, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Lesson {(lesson?.order_index ?? 0) + 1}</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.fg, margin: '0 0 16px', lineHeight: 1.3 }}>{p.getTitle(lesson)}</h1>

        {/* Video */}
        {lesson?.video_url && <Video url={lesson.video_url} />}

        {/* Reading */}
        {reading && <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.7, marginBottom: 18 }}>{reading}</p>}
        {transcript && (
          <div style={{ marginBottom: 18 }}>
            <button onClick={() => setShowReading(s => !s)} className="app-tap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, padding: '12px 14px', color: C.blue2, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              <span>📖 Reading / transcript</span><span>{showReading ? '▾' : '▸'}</span>
            </button>
            {showReading && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px', marginTop: 8, maxHeight: 320, overflowY: 'auto' }}>
                {transcript.split(/\n+/).filter(Boolean).map((para, i) => (
                  <p key={i} style={{ margin: '0 0 12px', fontSize: 13.5, lineHeight: 1.75, color: '#cbd5e1' }}>{para.trim()}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Mentor */}
        <div style={{ background: 'linear-gradient(160deg,#0f172a,#0d1b3e)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 18, overflow: 'hidden', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 16px', borderBottom: '1px solid rgba(96,165,250,0.1)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0 }}>D</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.fg }}>Prof. Didier</div>
              <div style={{ fontSize: 11.5, color: p.isLive ? C.green : C.fd }}>{p.isLive ? (p.isSpeaking ? '🎙 Speaking…' : '👂 Listening…') : p.convStatus === 'connecting' ? 'Connecting…' : 'AI Mentor · tap to start'}</div>
            </div>
            {p.isLive && <span style={{ fontSize: 12, color: C.blue2, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{p.fmt(p.duration)}</span>}
          </div>
          {p.transcript.length > 0 && (
            <div style={{ maxHeight: 240, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {p.transcript.map((e, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: e.role === 'agent' ? 'flex-start' : 'flex-end' }}>
                  <div style={{ background: e.role === 'agent' ? 'rgba(30,64,175,0.18)' : 'rgba(255,255,255,0.05)', border: `1px solid ${e.role === 'agent' ? 'rgba(96,165,250,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, padding: '9px 13px', maxWidth: '88%' }}>
                    <span style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>{e.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ padding: '14px 16px' }}>
            {!p.isLive && p.convStatus !== 'connecting' ? (
              <button onClick={p.onStart} className="app-tap tap-target" style={{ width: '100%', height: 48, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>💬 Ask Prof. Didier</button>
            ) : p.convStatus === 'connecting' ? (
              <button disabled className="tap-target" style={{ width: '100%', height: 48, borderRadius: 12, border: 'none', background: 'rgba(96,165,250,0.1)', color: C.blue2, fontSize: 15, fontWeight: 600, fontFamily: 'inherit' }}>Connecting…</button>
            ) : (
              <button onClick={p.onEnd} className="app-tap tap-target" style={{ width: '100%', height: 48, borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>End session</button>
            )}
          </div>
        </div>

        {/* Quiz entry */}
        {chapterEndQuiz && (
          <button onClick={() => p.onOpenQuiz(chapterEndQuiz.id)} className="app-tap" style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 14, padding: 14, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', marginBottom: 16 }}>
            <span style={{ fontSize: 22 }}>🏆</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.gold }}>Module Quiz</div>
              <div style={{ fontSize: 11.5, color: '#b45309' }}>Pass to unlock the next module</div>
            </div>
            <span style={{ color: C.gold, fontSize: 18 }}>›</span>
          </button>
        )}
      </main>

      {/* Sticky Continue */}
      <div className="safe-bottom" style={{ position: 'sticky', bottom: 0, zIndex: 40, background: 'rgba(10,15,30,0.92)', backdropFilter: 'blur(14px)', borderTop: '1px solid rgba(96,165,250,0.12)', padding: '12px 16px' }}>
        <button onClick={p.onContinue} className="app-tap tap-target" style={{ width: '100%', height: 54, borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#0a0f1e', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {p.continueIsToQuiz ? 'Continue to Quiz' : 'Continue'} ›
        </button>
      </div>
    </div>
  );
}
