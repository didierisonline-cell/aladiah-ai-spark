import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProfessorById } from "@/data/professors";
import { supabase } from "@/integrations/supabase/client";
import { professorHero, professorHeadshot } from "@/features/profDidierLive/professorImage";
import "@/features/profDidierLive/profDidierLive.css";

// A self-contained, full-screen "Professor Didier LIVE" class overlay. Parameterized
// by real program/module/lesson data so it embeds in the lesson player (ChapterView)
// or runs on its own route. Reuses the app's ElevenLabs voice + generate-visuals board.
export interface OverlayLesson {
  id: string;
  title: string;
  focus: string;
  board: { headline: string; definition?: string; flow?: string[]; points?: string[] };
  suggestions: string[];
}

export interface ProfessorLiveOverlayProps {
  programTitle: string;
  moduleTitle: string;
  lessons: OverlayLesson[];
  initialLessonId?: string;
  /** Lesson ids already completed (green in the class flow). */
  completedLessonIds?: string[];
  onClose: () => void;
  onComplete?: () => void;
}

const LANG_NAME: Record<string, string> = { en: "English", es: "Spanish", fr: "French", de: "German", zh: "Chinese", ar: "Arabic", ja: "Japanese" };
const NAME_TO_CODE: Record<string, string> = { English: "en", Spanish: "es", French: "fr", German: "de", Chinese: "zh", Arabic: "ar", Japanese: "ja" };
const DIDIER_VOICES: Record<string, string> = {
  English: "bQxW1c7YCr6VQgQhw8KX", Spanish: "bQxW1c7YCr6VQgQhw8KX", French: "IBGoh6rlxdauchOCULhL",
  German: "WPbK7Qv9rbyhvUDiwJ0A", Chinese: "pU9NaAwkoR3v0Mrg3uKz", Arabic: "Ojb0nFbyzZn95u0i5a5p", Japanese: "Mv8AjrYZCBkdsmDHNwcB",
};
const QUICK_COMMANDS = ["Repeat that", "Explain another way", "Show me a diagram", "Quiz me on this", "What should I focus on?"];

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

export default function ProfessorLiveOverlay({ programTitle, moduleTitle, lessons, initialLessonId, completedLessonIds = [], onClose, onComplete }: ProfessorLiveOverlayProps) {
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
  const [audioError, setAudioError] = useState<string | null>(null);
  const [outLevel, setOutLevel] = useState(0);

  // Live diagram board (reuses the app's generate-visuals + lesson_visuals cache).
  const [visuals, setVisuals] = useState<string[]>([]);
  const [visualsLoading, setVisualsLoading] = useState(false);
  const visualsKeyRef = useRef("");

  const historyRef = useRef<{ role: string; content: string }[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const completed = useMemo(() => new Set(completedLessonIds), [completedLessonIds]);

  const conversation = useConversation({
    onMessage: (props: any) => { if (props?.source === "ai" && props?.message) setCaption(String(props.message).replace(/<[^>]+>/g, "").trim()); },
    onError: (err: any) => {
      console.error("[ProfessorLiveOverlay] voice error:", err);
      setAudioError("Voice connection failed. Check your connection or mic — you can keep going by typing below.");
    },
  });

  const status: string = (conversation as any).status;
  const isSpeaking = Boolean((conversation as any).isSpeaking);
  const isLive = status === "connected";
  const phase: "idle" | "connecting" | "listening" | "speaking" | "thinking" =
    connecting ? "connecting" : isLive ? (isSpeaking ? "speaking" : "listening") : thinking ? "thinking" : "idle";
  const statusLabel = { idle: "Ready", connecting: "Connecting…", listening: "Listening…", speaking: "Speaking…", thinking: "Thinking…" }[phase];
  const onAir = phase === "speaking" || phase === "thinking";

  // ── Audio status ("sound vibe check") ────────────────────────────────────
  const audioVibe = audioError
    ? { label: "Audio error — tap Speak to retry", tone: "error" as const }
    : connecting
    ? { label: "Connecting to Professor Didier…", tone: "warn" as const }
    : isLive
    ? (isSpeaking
        ? { label: outLevel > 0.06 ? "🔊 Professor speaking — audio OK" : "Professor speaking (no output detected)", tone: outLevel > 0.06 ? ("live" as const) : ("warn" as const) }
        : { label: "🎙️ Listening — your turn to speak", tone: "ok" as const })
    : { label: "Ready — tap Speak for live voice", tone: "idle" as const };

  useEffect(() => { const t = setInterval(() => setSessionSeconds((s) => s + 1), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { try { const s = localStorage.getItem("aladiah:pdlive:notes"); if (s) setNotes(s); } catch { /* ignore */ } }, []);
  useEffect(() => () => { // unmount: end session + close audio context
    try { void conversation.endSession(); } catch { /* ignore */ }
    try { void audioCtxRef.current?.close(); } catch { /* ignore */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Output-level meter for the "sound vibe check" — reads the SDK's output
  // frequency data when available, else falls back to the speaking flag.
  useEffect(() => {
    if (!isLive) { setOutLevel(0); return; }
    let raf = 0;
    const tick = () => {
      try {
        const data: Uint8Array | undefined = (conversation as any).getOutputByteFrequencyData?.();
        if (data && data.length) {
          let sum = 0;
          for (let i = 0; i < data.length; i++) sum += data[i];
          setOutLevel(Math.min(1, sum / data.length / 96));
        } else {
          setOutLevel(isSpeaking ? 0.55 + Math.random() * 0.35 : 0.04);
        }
      } catch {
        setOutLevel(isSpeaking ? 0.5 : 0.04);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isLive, isSpeaking, conversation]);

  // ── Live board diagrams for the current lesson ───────────────────────────
  const loadVisuals = useCallback(async () => {
    const key = `${lesson.id}::${language}`;
    if (!lesson.id || key === visualsKeyRef.current) return;
    visualsKeyRef.current = key;
    setVisualsLoading(true);
    setVisuals([]);
    try {
      const { data: cached } = await supabase.from("lesson_visuals").select("svgs").eq("lesson_id", key).maybeSingle();
      if (cached?.svgs && Array.isArray(cached.svgs) && cached.svgs.length) {
        setVisuals(cached.svgs as string[]);
        setVisualsLoading(false);
        return;
      }
    } catch { /* cache miss */ }
    try {
      const res = await supabase.functions.invoke("generate-visuals", {
        body: { lessonTitle: lesson.title, lessonDescription: lesson.focus, courseTitle: programTitle, language },
      });
      if (res.data?.svgs?.length) {
        setVisuals(res.data.svgs);
        supabase.from("lesson_visuals").upsert({ lesson_id: key, svgs: res.data.svgs }).then(() => { }, () => { });
      }
    } catch (e) { console.warn("[ProfessorLiveOverlay] visuals error", e); }
    setVisualsLoading(false);
  }, [lesson.id, lesson.title, lesson.focus, programTitle, language]);

  useEffect(() => { void loadVisuals(); }, [loadVisuals]);

  const buildPrompt = useCallback(() =>
    `${didier.systemPrompt}\n\nYou are teaching a LIVE interactive class in "${programTitle}", module "${moduleTitle}".\n` +
    `CURRENT LESSON: ${lesson.title}\nTEACHING FOCUS: ${lesson.focus}\n\n` +
    `Greet the student warmly, teach this lesson clearly with real-world examples, check understanding with questions, and stay on topic. ` +
    `Speak in ${langName}. Keep it conversational. Do not navigate or change the app; only teach by speaking.`,
    [didier.systemPrompt, programTitle, moduleTitle, lesson.title, lesson.focus, langName]);

  const startLive = useCallback(async () => {
    setAudioError(null);
    setConnecting(true);
    try {
      let stream: MediaStream;
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
      catch { setAudioError("Microphone access is needed for live voice. Allow the mic (or use the same output device as your headphones), or type below."); return; }

      // CRITICAL: unlock/resume an AudioContext after the user gesture so output
      // audio actually plays (esp. Safari/iOS/mobile). Without this the session
      // connects and streams text but produces no sound.
      try {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AC) {
          if (!audioCtxRef.current) audioCtxRef.current = new AC();
          if (audioCtxRef.current.state === "suspended") await audioCtxRef.current.resume();
        }
      } catch { /* non-fatal */ }

      const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID as string | undefined;
      let signedUrl: string | null = null;
      try {
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-conversation-token`, {
          method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        });
        const data = await res.json();
        if (data?.signed_url) signedUrl = data.signed_url;
        else if (data?.error) console.warn("[ProfessorLiveOverlay] token fn error:", data.error);
      } catch (e) { console.warn("[ProfessorLiveOverlay] signed URL unavailable, will try public agent:", e); }

      if (!signedUrl && !agentId) {
        stream.getTracks().forEach((t) => t.stop());
        setAudioError("Live voice isn't configured (missing ElevenLabs agent/key). Typing still works — the professor answers in text.");
        return;
      }

      const opts: any = {
        overrides: {
          agent: { language: NAME_TO_CODE[langName] || "en", prompt: { prompt: buildPrompt() }, firstMessage: `Hello! Welcome to today's class on "${lesson.title}". I'm Professor Didier — let's begin!` },
          tts: { voiceId: DIDIER_VOICES[langName] || DIDIER_VOICES.English, stability: 0.71, similarityBoost: 0.55 },
        },
      };
      if (signedUrl) opts.signedUrl = signedUrl; else opts.agentId = agentId;
      await conversation.startSession(opts);
      stream.getTracks().forEach((t) => t.stop());
    } catch (err) {
      console.error("[ProfessorLiveOverlay] startLive error:", err);
      setAudioError("Could not start the live class. Check your connection and mic permissions, then tap Speak again.");
    } finally {
      setConnecting(false);
    }
  }, [conversation, lesson.title, langName, buildPrompt]);

  const stopLive = useCallback(async () => { try { await conversation.endSession(); } catch { /* ignore */ } }, [conversation]);
  const toggleLive = useCallback(() => { if (isLive) void stopLive(); else void startLive(); }, [isLive, startLive, stopLive]);

  // Keep voice + board in sync: switching lessons ends the current session so the
  // professor never keeps teaching the previous lesson while the board has moved on.
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) { didMountRef.current = true; return; }
    setCaption(`Now on “${lesson.title}”. Tap Speak to go live on this lesson, or type a question.`);
    if (isLive) void conversation.endSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonIndex]);

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
  const railStatusClass = phase === "speaking" ? "speaking" : phase === "listening" ? "listening" : "";

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
          <span className={`pd-audio-pill tone-${audioVibe.tone}`} title="Audio status">
            <i />{audioVibe.label}
          </span>
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
                <li key={l.id} className={`${i === lessonIndex ? "active" : ""} ${completed.has(l.id) ? "done" : ""}`} onClick={() => setLessonIndex(i)}>
                  <span className="pd-flow-dot" />
                  <span className="pd-flow-label">{i + 1}. {l.title}</span>
                  <span className="pd-flow-caret">{completed.has(l.id) ? "✓" : "›"}</span>
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
              <div className="pd-onair-foot">
                {/* Sound vibe check: live output level meter */}
                <div className="pd-vibe">
                  <span className="pd-vibe-ic">{isLive ? "🔊" : "🔈"}</span>
                  <div className="pd-vibe-bar"><span style={{ width: `${Math.round(outLevel * 100)}%` }} /></div>
                </div>
              </div>
            </section>

            <section className="pd-board">
              <div className="pd-board-toolbar" aria-hidden="true"><span>▷</span><span className="active">✎</span><span>△</span><span>T</span><span>▢</span><span>◯</span></div>
              <div className="pd-board-canvas">
                <h2 className="pd-board-headline">{board.headline}</h2>
                {board.definition && <p className="pd-board-def">{board.definition}</p>}

                {/* Live generated diagrams for this lesson */}
                {visualsLoading && (
                  <div className="pd-board-loading"><span className="pd-spin" /> Projecting a diagram for “{lesson.title}”…</div>
                )}
                {!visualsLoading && visuals.map((svg, i) => (
                  <div key={i} className="pd-board-visual" dangerouslySetInnerHTML={{ __html: svg }} />
                ))}

                {/* Fallback structured board when no diagram is available yet */}
                {!visualsLoading && visuals.length === 0 && board.flow && flowLen > 0 && (
                  <div className="pd-flow-diagram">
                    {board.flow.map((n, i) => (
                      <span key={n} style={{ display: "contents" }}>
                        <span className="pd-flow-node">{n}</span>
                        {i < flowLen - 1 && <span className="pd-flow-arrow">→</span>}
                      </span>
                    ))}
                  </div>
                )}
                {!visualsLoading && visuals.length === 0 && board.points && board.points.length > 0 && (
                  <ul className="pd-board-points">{board.points.map((p) => <li key={p}>{p}</li>)}</ul>
                )}
              </div>
            </section>
          </div>

          <div className="pd-lower-row">
            <section className="pd-panel pd-speech">
              <p className="pd-speech-text"><b>Professor Didier:</b> {caption}</p>
              {audioError && <p className="pd-audio-error">{audioError}</p>}
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
          <span>{connecting ? "Connecting…" : isLive ? "Live — tap to stop" : audioError ? "Retry — Tap to Speak" : "Tap to Speak"}</span>
        </button>
        <button className="pd-ctrl" disabled title="Coming soon"><span className="pd-ctrl-ic">✎</span><span>Whiteboard</span></button>
        {onComplete && (
          <button className="pd-ctrl" onClick={() => { void stopLive(); onComplete(); }} title="Mark this module complete and continue">
            <span className="pd-ctrl-ic" style={{ borderColor: "rgba(53,214,122,0.6)", color: "#35d67a" }}>✓</span>
            <span style={{ color: "#35d67a" }}>Complete</span>
          </button>
        )}
      </footer>
    </div>
  );
}
