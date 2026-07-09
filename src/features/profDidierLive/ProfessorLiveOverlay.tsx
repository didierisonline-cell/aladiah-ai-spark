import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProfessorById } from "@/data/professors";
import { professorHero, professorHeadshot } from "@/features/profDidierLive/professorImage";
import "@/features/profDidierLive/profDidierLive.css";

// A self-contained, full-screen "Professor Didier LIVE" class overlay. It is
// parameterized by real program/module/lesson data so it can be embedded in the
// lesson player (ChapterView) or driven by static data on its own route.
export interface OverlayLesson {
  id: string;
  title: string;
  /** Teaching focus injected into the professor's live prompt. */
  focus: string;
  board: { headline: string; definition?: string; flow?: string[]; points?: string[] };
  suggestions: string[];
}

export interface ProfessorLiveOverlayProps {
  programTitle: string;
  moduleTitle: string;
  lessons: OverlayLesson[];
  initialLessonId?: string;
  onClose: () => void;
}

const LANG_NAME: Record<string, string> = { en: "English", es: "Spanish", fr: "French", de: "German", zh: "Chinese", ar: "Arabic", ja: "Japanese" };
const NAME_TO_CODE: Record<string, string> = { English: "en", Spanish: "es", French: "fr", German: "de", Chinese: "zh", Arabic: "ar", Japanese: "ja" };
const DIDIER_VOICES: Record<string, string> = {
  English: "bQxW1c7YCr6VQgQhw8KX", Spanish: "bQxW1c7YCr6VQgQhw8KX", French: "IBGoh6rlxdauchOCULhL",
  German: "WPbK7Qv9rbyhvUDiwJ0A", Chinese: "pU9NaAwkoR3v0Mrg3uKz", Arabic: "Ojb0nFbyzZn95u0i5a5p", Japanese: "Mv8AjrYZCBkdsmDHNwcB",
};
const QUICK_COMMANDS = ["Repeat that", "Explain another way", "Show an example", "Quiz me on this", "What should I focus on?"];

function fmt(sec: number): string {
  return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
}

function Wave({ active, bars = 40 }: { active: boolean; bars?: number }) {
  return (
    <div className={`waveform ${active ? "active" : ""}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => <span key={i} style={{ animationDelay: `${((i % 8) * 0.08).toFixed(2)}s` }} />)}
    </div>
  );
}

export default function ProfessorLiveOverlay({ programTitle, moduleTitle, lessons, initialLessonId, onClose }: ProfessorLiveOverlayProps) {
  const { language } = useLanguage();
  const didier = getProfessorById("didier");
  const langName = LANG_NAME[language] || "English";

  const startIdx = Math.max(0, lessons.findIndex((l) => l.id === initialLessonId));
  const [lessonIndex, setLessonIndex] = useState(startIdx === -1 ? 0 : startIdx);
  const lesson = lessons[lessonIndex] ?? lessons[0];

  const [caption, setCaption] = useState("Welcome to class. Tap “Speak” to start a live voice lesson, or type a question below.");
  const [notes, setNotes] = useState("");
  const [chat, setChat] = useState("");
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [connecting, setConnecting] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [micHint, setMicHint] = useState<string | null>(null);
  const historyRef = useRef<{ role: string; content: string }[]>([]);

  const conversation = useConversation({
    onMessage: (props: any) => { if (props?.source === "ai" && props?.message) setCaption(String(props.message)); },
    onError: (err: any) => { console.error("[ProfessorLiveOverlay] voice error:", err); setMicHint("Voice connection failed. You can keep going by typing below."); },
  });

  const status: string = (conversation as any).status;
  const isSpeaking = Boolean((conversation as any).isSpeaking);
  const isLive = status === "connected";
  const phase: "idle" | "connecting" | "listening" | "speaking" | "thinking" =
    connecting ? "connecting" : isLive ? (isSpeaking ? "speaking" : "listening") : thinking ? "thinking" : "idle";
  const statusLabel = { idle: "Ready", connecting: "Connecting…", listening: "Listening…", speaking: "Speaking…", thinking: "Thinking…" }[phase];
  const onAir = phase === "speaking" || phase === "thinking";

  useEffect(() => { const t = setInterval(() => setSessionSeconds((s) => s + 1), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { try { const s = localStorage.getItem("aladiah:pdlive:notes"); if (s) setNotes(s); } catch { /* ignore */ } }, []);
  useEffect(() => () => { try { void conversation.endSession(); } catch { /* ignore */ } }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startLive = useCallback(async () => {
    setMicHint(null);
    setConnecting(true);
    try {
      let stream: MediaStream;
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
      catch { setMicHint("Microphone access is needed for a live voice class. Allow the mic, or type your questions below."); return; }

      const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID as string | undefined;
      let signedUrl: string | null = null;
      try {
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-conversation-token`, {
          method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        });
        const data = await res.json();
        if (data?.signed_url) signedUrl = data.signed_url;
      } catch { /* fall back to agentId */ }

      if (!signedUrl && !agentId) {
        stream.getTracks().forEach((t) => t.stop());
        setMicHint("Live voice isn't configured in this environment yet. Typing still works.");
        return;
      }

      const prompt =
        `${didier.systemPrompt}\n\nYou are teaching a LIVE interactive class in "${programTitle}", module "${moduleTitle}".\n` +
        `CURRENT LESSON: ${lesson.title}\nTEACHING FOCUS: ${lesson.focus}\n\n` +
        `Greet the student warmly, teach this lesson clearly with real-world examples, check understanding with questions, and stay on topic. ` +
        `Speak in ${langName}. Keep it conversational. Do not navigate or change the app; only teach by speaking.`;
      const opts: any = {
        overrides: {
          agent: { language: NAME_TO_CODE[langName] || "en", prompt: { prompt }, firstMessage: `Hello! Welcome to today's class on "${lesson.title}". I'm Professor Didier — let's begin!` },
          tts: { voiceId: DIDIER_VOICES[langName] || DIDIER_VOICES.English, stability: 0.71, similarityBoost: 0.55 },
        },
      };
      if (signedUrl) opts.signedUrl = signedUrl; else opts.agentId = agentId;
      await conversation.startSession(opts);
      stream.getTracks().forEach((t) => t.stop());
    } catch (err) {
      console.error("[ProfessorLiveOverlay] startLive error:", err);
      setMicHint("Could not start the live class. You can keep going by typing below.");
    } finally {
      setConnecting(false);
    }
  }, [conversation, lesson, langName, programTitle, moduleTitle, didier.systemPrompt]);

  const stopLive = useCallback(async () => { try { await conversation.endSession(); } catch { /* ignore */ } }, [conversation]);
  const toggleLive = useCallback(() => { if (isLive) void stopLive(); else void startLive(); }, [isLive, startLive, stopLive]);

  const ask = useCallback(async (text: string) => {
    const t = text.trim();
    if (!t) return;
    const API = (import.meta.env.VITE_API_URL as string) || "";
    if (!API) { setCaption("Typed answers need the AI backend configured (VITE_API_URL). Tap “Speak” for a live voice class."); return; }
    setCaption("…");
    setThinking(true);
    try {
      const res = await fetch(`${API}/ai`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: t, agentKey: "professor", professorId: "didier", language, history: historyRef.current.slice(-10) }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      const reply = String(data?.response ?? "…");
      historyRef.current.push({ role: "user", content: t }, { role: "assistant", content: reply });
      setCaption(reply);
    } catch { setCaption("I couldn't reach my thoughts just now — try again, or tap “Speak” for a live voice class."); }
    finally { setThinking(false); }
  }, [language]);

  const onNotes = (v: string) => { setNotes(v); try { localStorage.setItem("aladiah:pdlive:notes", v); } catch { /* ignore */ } };
  const close = useCallback(() => { void stopLive(); onClose(); }, [stopLive, onClose]);

  const board = lesson.board;
  const flowLen = board.flow?.length ?? 0;
  const railStatusClass = useMemo(() => (phase === "speaking" ? "speaking" : phase === "listening" ? "listening" : ""), [phase]);

  return (
    <div className="pd-live-root">
      <header className="pd-header">
        <div className="pd-brand">
          <span className="pd-logo">ALADIAH<small>ACADEMY</small></span>
          <span className="pd-live-title">PROFESSOR DIDIER&trade; LIVE</span>
          <span className={`pd-live-badge ${phase !== "idle" ? "on" : ""}`}><i />LIVE</span>
        </div>
        <div className="pd-program-pill">{programTitle}</div>
        <div className="pd-header-right">
          <span className="pd-mode">🖥 Professor Mode ▾</span>
          <button className="pd-icon-btn" title="Close" onClick={close}>✕</button>
        </div>
      </header>

      <div className="pd-body">
        <aside className="pd-rail">
          <div className="pd-prof-card">
            <div className={`pd-prof-photo ${railStatusClass}`}><img src={professorHeadshot} alt="Professor Didier" /></div>
            <div className="pd-prof-name">Professor Didier&trade;</div>
            <div className="pd-prof-status">{statusLabel}</div>
            <Wave active={phase === "speaking"} bars={20} />
            <button className="pd-end" onClick={close}>⏻ End Session</button>
          </div>

          <div className="pd-section">
            <h4>Class Flow</h4>
            <ul className="pd-flow">
              {lessons.map((l, i) => (
                <li key={l.id} className={i === lessonIndex ? "active" : ""} onClick={() => setLessonIndex(i)}>
                  <span className="pd-flow-dot" />
                  <span className="pd-flow-label">{i + 1}. {l.title}</span>
                  <span className="pd-flow-caret">›</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pd-section pd-context">
            <h4>Session Context</h4>
            <dl>
              <div><dt>Program</dt><dd>{programTitle}</dd></div>
              <div><dt>Module</dt><dd>{moduleTitle}</dd></div>
              <div><dt>Lesson</dt><dd>{lesson.title}</dd></div>
              <div><dt>Language</dt><dd>{langName}</dd></div>
            </dl>
          </div>

          <div className="pd-section">
            <h4>Quick Voice Commands</h4>
            <ul className="pd-commands">
              {QUICK_COMMANDS.map((c) => <li key={c} onClick={() => void ask(c)}><span className="pd-cmd-ic">↺</span>{c}</li>)}
            </ul>
          </div>

          <div className="pd-rail-foot"><span className="pd-live-dot" /> LIVE SESSION<span className="pd-timer">{fmt(sessionSeconds)}</span></div>
        </aside>

        <main className="pd-main">
          <div className="pd-stage-row">
            <section className={`pd-onair ${phase === "speaking" ? "speaking" : ""}`}>
              <div className={`pd-onair-badge ${onAir ? "live" : ""}`}><i />{onAir ? "ON AIR" : "IDLE"}</div>
              <img className="pd-onair-photo" src={professorHero} alt="Professor Didier" />
              <div className="pd-onair-foot"><Wave active={phase === "speaking"} bars={40} /></div>
            </section>

            <section className="pd-board">
              <div className="pd-board-toolbar" aria-hidden="true"><span>▷</span><span className="active">✎</span><span>△</span><span>T</span><span>▢</span><span>◯</span></div>
              <div className="pd-board-canvas">
                <h2 className="pd-board-headline">{board.headline}</h2>
                {board.definition && <p className="pd-board-def">{board.definition}</p>}
                {board.flow && flowLen > 0 && (
                  <div className="pd-flow-diagram">
                    {board.flow.map((n, i) => (
                      <span key={n} style={{ display: "contents" }}>
                        <span className="pd-flow-node">{n}</span>
                        {i < flowLen - 1 && <span className="pd-flow-arrow">→</span>}
                      </span>
                    ))}
                  </div>
                )}
                {board.points && board.points.length > 0 && <ul className="pd-board-points">{board.points.map((p) => <li key={p}>{p}</li>)}</ul>}
              </div>
            </section>
          </div>

          <div className="pd-lower-row">
            <section className="pd-panel pd-speech">
              <p className="pd-speech-text"><b>Professor Didier:</b> {caption}</p>
              {micHint && <p className="muted" style={{ marginTop: 8 }}>{micHint}</p>}
              <Wave active={phase === "speaking"} bars={46} />
            </section>

            <section className="pd-panel">
              <h4 className="pd-panel-title">You Can Say</h4>
              <ul className="pd-suggestions">
                {lesson.suggestions.map((x) => (
                  <li key={x} onClick={() => void ask(x)}><span className="pd-sug-dot" /><span className="pd-sug-text">{x}</span><span className="pd-sug-arrow">›</span></li>
                ))}
              </ul>
            </section>

            <section className="pd-panel">
              <h4 className="pd-panel-title">Student Notes</h4>
              <textarea className="pd-notes" placeholder="Add your notes here… Professor Didier will remember what we discuss." value={notes} onChange={(e) => onNotes(e.target.value)} />
            </section>
          </div>

          <form className="pd-chatinput" onSubmit={(e) => { e.preventDefault(); const t = chat.trim(); if (t) { void ask(t); setChat(""); } }}>
            <input value={chat} onChange={(e) => setChat(e.target.value)} placeholder="Type to Professor Didier (works even without a microphone)…" aria-label="Type your message to Professor Didier" />
            <button type="submit" disabled={thinking}>Send</button>
          </form>
        </main>
      </div>

      <footer className="pd-controls">
        <button className="pd-ctrl" disabled title="Coming soon"><span className="pd-ctrl-ic">🎙️</span><span>Mute</span></button>
        <button className="pd-ctrl" disabled title="Coming soon"><span className="pd-ctrl-ic">🖥️</span><span>Share Screen</span></button>
        <button className={`pd-tap ${isLive ? "on" : ""}`} onClick={toggleLive} disabled={connecting}>
          <span className="pd-tap-ic">🎤</span>
          <span>{connecting ? "Connecting…" : isLive ? "Live — tap to stop" : "Tap to Speak"}</span>
        </button>
        <button className="pd-ctrl" disabled title="Coming soon"><span className="pd-ctrl-ic">✎</span><span>Whiteboard</span></button>
        <button className="pd-ctrl" disabled title="Coming soon"><span className="pd-ctrl-ic">?</span><span>Need Help</span></button>
      </footer>
    </div>
  );
}
