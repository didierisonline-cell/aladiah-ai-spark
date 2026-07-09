import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConversation } from "@elevenlabs/react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProfessorById } from "@/data/professors";
import { SCRUM_CLASS } from "@/features/profDidierLive/scrumClass";
import { professorHero, professorHeadshot } from "@/features/profDidierLive/professorImage";
import "@/features/profDidierLive/profDidierLive.css";

// Reuse the exact ElevenLabs voice conventions proven in LiveClassroom.tsx.
const LANG_NAME: Record<string, string> = { en: "English", es: "Spanish", fr: "French", de: "German", zh: "Chinese", ar: "Arabic", ja: "Japanese" };
const NAME_TO_CODE: Record<string, string> = { English: "en", Spanish: "es", French: "fr", German: "de", Chinese: "zh", Arabic: "ar", Japanese: "ja" };
const DIDIER_VOICES: Record<string, string> = {
  English: "bQxW1c7YCr6VQgQhw8KX", Spanish: "bQxW1c7YCr6VQgQhw8KX", French: "IBGoh6rlxdauchOCULhL",
  German: "WPbK7Qv9rbyhvUDiwJ0A", Chinese: "pU9NaAwkoR3v0Mrg3uKz", Arabic: "Ojb0nFbyzZn95u0i5a5p", Japanese: "Mv8AjrYZCBkdsmDHNwcB",
};
const QUICK_COMMANDS = ["Repeat that", "Explain another way", "Show an example", "Quiz me on this", "What should I focus on?"];

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function Wave({ active, bars = 40 }: { active: boolean; bars?: number }) {
  return (
    <div className={`waveform ${active ? "active" : ""}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <span key={i} style={{ animationDelay: `${((i % 8) * 0.08).toFixed(2)}s` }} />
      ))}
    </div>
  );
}

export default function ProfDidierLive() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const didier = getProfessorById("didier");
  const [thinking, setThinking] = useState(false);
  const historyRef = useRef<{ role: string; content: string }[]>([]);

  const [lessonIndex, setLessonIndex] = useState(0);
  const [caption, setCaption] = useState<string>(
    "Welcome to class. Tap “Speak” to start a live voice lesson, or type a question below."
  );
  const [notes, setNotes] = useState("");
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [connecting, setConnecting] = useState(false);
  const [micHint, setMicHint] = useState<string | null>(null);
  const sessionStart = useRef<number | null>(null);

  const lesson = SCRUM_CLASS.lessons[lessonIndex];
  const langName = LANG_NAME[language] || "English";

  const conversation = useConversation({
    onConnect: () => {
      sessionStart.current = Date.now();
    },
    onMessage: (props: any) => {
      if (props?.source === "ai" && props?.message) setCaption(String(props.message));
    },
    onDisconnect: () => {
      sessionStart.current = null;
    },
    onError: (err: any) => {
      // eslint-disable-next-line no-console
      console.error("[ProfDidierLive] voice error:", err);
      setMicHint("Voice connection failed. You can keep going by typing below.");
    },
  });

  const status: string = (conversation as any).status;
  const isSpeaking: boolean = Boolean((conversation as any).isSpeaking);
  const isLive = status === "connected";
  const phase: "idle" | "connecting" | "listening" | "speaking" | "thinking" =
    connecting ? "connecting" : isLive ? (isSpeaking ? "speaking" : "listening") : thinking ? "thinking" : "idle";

  const statusLabel = { idle: "Ready", connecting: "Connecting…", listening: "Listening…", speaking: "Speaking…", thinking: "Thinking…" }[phase];

  // Session timer.
  useEffect(() => {
    const t = setInterval(() => setSessionSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Restore notes.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aladiah:pdlive:notes");
      if (saved) setNotes(saved);
    } catch { /* ignore */ }
  }, []);

  // End the voice session when leaving the page.
  useEffect(() => {
    return () => {
      try { void conversation.endSession(); } catch { /* ignore */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildPrompt = useCallback(
    (l: typeof lesson) =>
      `${didier.systemPrompt}\n\nYou are teaching a LIVE interactive class in the "${SCRUM_CLASS.program}", module "${SCRUM_CLASS.module}".\n` +
      `CURRENT LESSON: ${l.number} ${l.title}\nTEACHING FOCUS: ${l.focus}\n\n` +
      `Greet the student warmly, teach this lesson clearly with real-world examples, check understanding with questions, and stay on topic. ` +
      `Speak in ${langName}. Keep it conversational — this is a live class, not a lecture. Do not navigate or change the app; only teach by speaking.`,
    [didier.systemPrompt, langName]
  );

  const startLive = useCallback(async () => {
    setMicHint(null);
    setConnecting(true);
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        setMicHint("Microphone access is needed for a live voice class. Allow the mic, or type your questions below.");
        return;
      }

      const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID as string | undefined;
      let signedUrl: string | null = null;
      try {
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-conversation-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        });
        const data = await res.json();
        if (data?.signed_url) signedUrl = data.signed_url;
      } catch { /* fall back to agentId */ }

      if (!signedUrl && !agentId) {
        stream.getTracks().forEach((t) => t.stop());
        setMicHint("Live voice isn't configured in this environment yet (missing ElevenLabs agent). Typing still works.");
        return;
      }

      const firstMessage = `Hello! Welcome to today's class on "${lesson.title}". I'm Professor Didier, and I'll guide you through it. Let's begin!`;
      const opts: any = {
        overrides: {
          agent: {
            language: NAME_TO_CODE[langName] || "en",
            prompt: { prompt: buildPrompt(lesson) },
            firstMessage,
          },
          tts: { voiceId: DIDIER_VOICES[langName] || DIDIER_VOICES.English, stability: 0.71, similarityBoost: 0.55 },
        },
      };
      if (signedUrl) opts.signedUrl = signedUrl; else opts.agentId = agentId;

      await conversation.startSession(opts);
      stream.getTracks().forEach((t) => t.stop());
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("[ProfDidierLive] startLive error:", err);
      setMicHint("Could not start the live class. You can keep going by typing below.");
    } finally {
      setConnecting(false);
    }
  }, [conversation, lesson, langName, buildPrompt]);

  const stopLive = useCallback(async () => {
    try { await conversation.endSession(); } catch { /* ignore */ }
  }, [conversation]);

  const toggleLive = useCallback(() => {
    if (isLive) void stopLive();
    else void startLive();
  }, [isLive, startLive, stopLive]);

  // Text path (typed questions, suggestions, quick commands) -> AI backend.
  // Inlined (rather than importing the shared useBrain hook) to keep this page
  // self-contained and avoid pulling extra modules into the build graph.
  const ask = useCallback(
    async (text: string) => {
      const t = text.trim();
      if (!t) return;
      const API = (import.meta.env.VITE_API_URL as string) || "";
      if (!API) {
        setCaption("Typed answers need the AI backend configured (VITE_API_URL). Tap “Speak” for a live voice class in the meantime.");
        return;
      }
      setCaption("…");
      setThinking(true);
      try {
        const res = await fetch(`${API}/ai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: t,
            agentKey: "professor",
            professorId: "didier",
            language,
            history: historyRef.current.slice(-10),
          }),
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        const reply = String(data?.response ?? "…");
        historyRef.current.push({ role: "user", content: t }, { role: "assistant", content: reply });
        setCaption(reply);
      } catch {
        setCaption("I couldn't reach my thoughts just now — try again, or tap “Speak” for a live voice class.");
      } finally {
        setThinking(false);
      }
    },
    [language]
  );

  const onNotes = (v: string) => {
    setNotes(v);
    try { localStorage.setItem("aladiah:pdlive:notes", v); } catch { /* ignore */ }
  };

  const endSession = useCallback(() => {
    void stopLive();
    navigate("/portal/mentor");
  }, [stopLive, navigate]);

  const [chat, setChat] = useState("");
  const onAir = phase === "speaking" || phase === "thinking";
  const board = lesson.board;
  const flowLen = board.flow?.length ?? 0;
  const headerLive = phase !== "idle";

  const railStatusClass = useMemo(() => (phase === "speaking" ? "speaking" : phase === "listening" ? "listening" : ""), [phase]);

  return (
    <div className="pd-live-root">
      {/* Header */}
      <header className="pd-header">
        <div className="pd-brand">
          <span className="pd-logo">ALADIAH<small>ACADEMY</small></span>
          <span className="pd-live-title">PROFESSOR DIDIER&trade; LIVE</span>
          <span className={`pd-live-badge ${headerLive ? "on" : ""}`}><i />LIVE</span>
        </div>
        <div className="pd-program-pill">{SCRUM_CLASS.program}</div>
        <div className="pd-header-right">
          <span className="pd-mode">🖥 Professor Mode ▾</span>
          <button className="pd-icon-btn" title="Close" onClick={endSession}>✕</button>
        </div>
      </header>

      <div className="pd-body">
        {/* Left rail */}
        <aside className="pd-rail">
          <div className="pd-prof-card">
            <div className={`pd-prof-photo ${railStatusClass}`}>
              <img src={professorHeadshot} alt="Professor Didier" />
            </div>
            <div className="pd-prof-name">Professor Didier&trade;</div>
            <div className="pd-prof-status">{statusLabel}</div>
            <Wave active={phase === "speaking"} bars={20} />
            <button className="pd-end" onClick={endSession}>⏻ End Session</button>
          </div>

          <div className="pd-section">
            <h4>Class Flow</h4>
            <ul className="pd-flow">
              {SCRUM_CLASS.lessons.map((l, i) => (
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
              <div><dt>Program</dt><dd>{SCRUM_CLASS.program}</dd></div>
              <div><dt>Module</dt><dd>{SCRUM_CLASS.module}</dd></div>
              <div><dt>Lesson</dt><dd>{lesson.number} {lesson.title}</dd></div>
              <div><dt>Language</dt><dd>{langName}</dd></div>
            </dl>
          </div>

          <div className="pd-section">
            <h4>Quick Voice Commands</h4>
            <ul className="pd-commands">
              {QUICK_COMMANDS.map((c) => (
                <li key={c} onClick={() => void ask(c)}><span className="pd-cmd-ic">↺</span>{c}</li>
              ))}
            </ul>
          </div>

          <div className="pd-rail-foot">
            <span className="pd-live-dot" /> LIVE SESSION<span className="pd-timer">{fmt(sessionSeconds)}</span>
          </div>
        </aside>

        {/* Main */}
        <main className="pd-main">
          <div className="pd-stage-row">
            <section className={`pd-onair ${phase === "speaking" ? "speaking" : ""}`}>
              <div className={`pd-onair-badge ${onAir ? "live" : ""}`}><i />{onAir ? "ON AIR" : "IDLE"}</div>
              <img className="pd-onair-photo" src={professorHero} alt="Professor Didier" />
              <div className="pd-onair-foot"><Wave active={phase === "speaking"} bars={40} /></div>
            </section>

            <section className="pd-board">
              <div className="pd-board-toolbar" aria-hidden="true">
                <span>▷</span><span className="active">✎</span><span>△</span><span>T</span><span>▢</span><span>◯</span>
              </div>
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
                {board.points && (
                  <ul className="pd-board-points">
                    {board.points.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                )}
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
                  <li key={x} onClick={() => void ask(x)}>
                    <span className="pd-sug-dot" /><span className="pd-sug-text">{x}</span><span className="pd-sug-arrow">›</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="pd-panel">
              <h4 className="pd-panel-title">Student Notes</h4>
              <textarea
                className="pd-notes"
                placeholder="Add your notes here… Professor Didier will remember what we discuss."
                value={notes}
                onChange={(e) => onNotes(e.target.value)}
              />
            </section>
          </div>

          <form
            className="pd-chatinput"
            onSubmit={(e) => { e.preventDefault(); const t = chat.trim(); if (t) { void ask(t); setChat(""); } }}
          >
            <input
              value={chat}
              onChange={(e) => setChat(e.target.value)}
              placeholder="Type to Professor Didier (works even without a microphone)…"
              aria-label="Type your message to Professor Didier"
            />
            <button type="submit" disabled={thinking}>Send</button>
          </form>
        </main>
      </div>

      {/* Control bar */}
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
