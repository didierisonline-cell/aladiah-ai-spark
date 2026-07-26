import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  Clock,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Presentation,
  AudioLines,
  Settings,
  Volume2,
  Info,
  Mic,
  MicOff,
  ScreenShare,
  Pencil,
  Trophy,
  ArrowLeft,
  MousePointer2,
  Shapes,
  Type,
  Square,
  Circle,
  RotateCw,
  Undo2,
  Trash2,
  Minus,
  Plus,
  Maximize2,
  Minimize2,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  CheckCircle2,
} from "lucide-react";

import "@/components/classroom-test/classroom-test.css";
import RotatingGlobe from "./RotatingGlobe";
import CourseBoardVisual from "./CourseBoardVisual";
import Waveform from "./Waveform";
import { professorAvatar } from "./media/professorAssets";
import { useLanguage } from "@/contexts/LanguageContext";

/* ============================================================================
 * OfficialClassroom — PURE PRESENTATIONAL component (WO-UX-CLASSROOM production).
 *
 * Renders the approved premium "Professor Didier™ Live" classroom, mirroring the
 * /classroom-test prototype layout (ClassroomTest.tsx) exactly, but driven ENTIRELY
 * by props. No data fetching, no Supabase, no ElevenLabs SDK, no routing. The
 * owning page (src/pages/ChapterView.tsx) holds all real logic and passes it in.
 *
 * The only local state here is UI-only: the student-notes textarea, the mute
 * toggle (visual — real audio lives in ElevenLabs elsewhere), and the mobile
 * class-flow drawer. ProfessorMedia is ALWAYS rendered muted — it is the visual
 * layer only.
 * ========================================================================== */

interface Course {
  id: string;
  title: string;
  translations: any;
}
interface Chapter {
  id: string;
  title: string;
  description: string;
  order_index: number;
  course_id: string;
  translations: any;
}
interface Video {
  id: string;
  title: string;
  description: string;
  chapter_id: string;
  order_index: number;
  video_url: string;
  translations: any;
}
interface QuizRow {
  id: string;
  chapter_id: string;
  quiz_type: string;
}

export interface OfficialClassroomProps {
  course: Course | null;
  chapter: Chapter | null;
  currentLesson: Video | null;
  videos: Video[];
  quizzes: QuizRow[];
  passedQuizzes: string[];
  progress: number; // 0-100
  continueIsToQuiz: boolean;
  recapComplete: boolean;
  // voice state (read-only)
  isLive: boolean;
  isSpeaking: boolean;
  convStatus: "idle" | "connecting" | "connected" | "error";
  transcript: { role: "user" | "agent"; message: string }[];
  duration: number;
  /** live TTS output level 0..1 → drives the audio-reactive professor mouth (Option A) */
  getLevel?: () => number;
  lessonVisuals?: string[]; // raw SVG strings for the board (may be empty)
  suggestedPrompts?: string[]; // lesson-specific "You can say" prompts
  // helpers
  fmt: (s: number) => string;
  getTitle: (item: any) => string;
  getDescription: (item: any) => string;
  getTranscript: (v: any) => string;
  // actions
  onSelectLesson: (v: Video) => void;
  onOpenQuiz: (quizId: string) => void;
  onContinue: () => void;
  onStart: () => void;
  onEnd: () => void;
  onBack: () => void;
  voiceError?: string | null;
}

const DEFAULT_PROMPTS = [
  "Repeat that",
  "Explain another way",
  "Show an example",
  "Quiz me on this",
  "What should I focus on?",
];

/* ---- Whiteboard toolbar / palette (visual-only, mirrors DigitalWhiteboard) ---- */
const WB_TOOLS = [
  { icon: MousePointer2, active: false },
  { icon: Pencil, active: true },
  { icon: Shapes, active: false },
  { icon: Type, active: false },
  { icon: Square, active: false },
  { icon: RotateCw, active: false },
  { icon: Circle, active: false },
];
const WB_SWATCHES = ["#ffffff", "#3b82f6", "#fbbf24", "#f472b6", "#c084fc"];
const NOTES_TOOLBAR = [Bold, Italic, Underline, List, ListOrdered];

/** Small emerald signal bars used in the bottom status strip. */
function SignalBars() {
  return (
    <span className="flex items-end gap-[2px]" aria-hidden="true">
      {[6, 9, 12, 15].map((h, i) => (
        <span key={i} className="w-[3px] rounded-sm bg-emerald-400/80" style={{ height: h }} />
      ))}
    </span>
  );
}

/**
 * Derive short "key concept" bullets from the lesson description/transcript when
 * there are no author-provided SVG visuals for the board.
 */
function deriveKeyConcepts(text: string): string[] {
  if (!text) return [];
  return text
    .split(/\n+|(?<=[.!?])\s+/)
    .map((s) => s.trim().replace(/^[-•*\d.)\s]+/, "").trim())
    .filter((s) => s.length > 2)
    .slice(0, 5);
}

export default function OfficialClassroom(props: OfficialClassroomProps) {
  const { t } = useLanguage();
  const {
    course,
    chapter,
    currentLesson,
    videos,
    quizzes,
    passedQuizzes,
    progress,
    continueIsToQuiz,
    recapComplete,
    isLive,
    isSpeaking,
    convStatus,
    transcript,
    duration,
    getLevel,
    lessonVisuals,
    suggestedPrompts,
    fmt,
    getTitle,
    getDescription,
    getTranscript,
    onSelectLesson,
    onOpenQuiz,
    onContinue,
    onStart,
    onEnd,
    onBack,
    voiceError,
  } = props;

  // UI-only local state (no side-effects on the app).
  const [notes, setNotes] = useState("");
  const [muted, setMuted] = useState(true); // visual mute — real audio is elsewhere
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Student-controlled board zoom + fullscreen (Founder: students control this)
  const [boardZoom, setBoardZoom] = useState(100);
  const [boardFull, setBoardFull] = useState(false);
  useEffect(() => {
    if (!boardFull) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setBoardFull(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [boardFull]);

  // Auto-scroll the transcript to the newest line.
  const transcriptRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [transcript]);

  // ---- Derived view data ----------------------------------------------------
  const sortedVideos = [...videos].sort((a, b) => a.order_index - b.order_index);
  const prompts = suggestedPrompts && suggestedPrompts.length ? suggestedPrompts : DEFAULT_PROMPTS;
  const endQuiz =
    quizzes.find((q) => q.quiz_type === "chapter_end") ??
    quizzes.find((q) => q.quiz_type === "chapter") ??
    null;

  const lessonComplete = (v: Video) =>
    passedQuizzes.some((id) => quizzes.some((q) => q.id === id && q.chapter_id === v.chapter_id));

  const statusText = isSpeaking ? `${t('classroom.speaking')}…` : isLive ? `${t('classroom.listening')}…` : t('classroom.ready');
  const stageBadge = isSpeaking ? t('classroom.on_air') : isLive ? "LISTENING" : "READY";
  const micLabel =
    convStatus === "connecting"
      ? `${t('classroom.connecting')}…`
      : isLive
        ? isSpeaking
          ? `${t('classroom.speaking')}…`
          : `${t('classroom.listening')}…`
        : t('classroom.tap_to_speak');
  const continueLabel = continueIsToQuiz ? "Continue to Quiz" : "Continue";

  const boardTitle = getTitle(currentLesson) || "Live Lesson";
  const hasVisual = !!(lessonVisuals && lessonVisuals.length);
  const keyConcepts = hasVisual
    ? []
    : deriveKeyConcepts(getDescription(currentLesson) || getTranscript(currentLesson));

  const startIfIdle = () => {
    if (!isLive) onStart();
  };

  // ---- Left-rail content (shared by desktop rail + mobile drawer) -----------
  const RailContent = () => (
    <>
      {/* Professor identity card */}
      <div className="flex flex-col items-center px-4 pt-3.5 text-center">
        <div className="relative">
          <div
            className={`absolute -inset-1.5 rounded-full bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-blue-500 blur-[6px] ${
              isSpeaking ? "opacity-80" : "opacity-40"
            } transition-opacity`}
          />
          <div className="relative rounded-full bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-blue-500 p-[2.5px]">
            <img
              src={professorAvatar}
              alt="Professor Didier"
              className="h-[92px] w-[92px] rounded-full object-cover"
            />
          </div>
        </div>

        <div className="mt-3 font-display text-[15px] font-bold text-white">Professor Didier™</div>
        <div className="mt-0.5 text-xs font-medium text-violet-300/90">{statusText}</div>

        <div className="mt-2 h-6 w-full max-w-[190px] px-2">
          <Waveform bars={42} active={isSpeaking} />
        </div>

        {isLive && (
          <button
            onClick={onEnd}
            className="mt-3 flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/[0.06] px-4 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/15"
          >
            <Volume2 className="h-3.5 w-3.5" />
            {t('classroom.end_session')}
          </button>
        )}
      </div>

      <div className="mx-4 my-2 h-px bg-white/[0.06]" />

      {/* Class Flow */}
      <div className="px-4 pt-1">
        <div className="ct-label mb-2 px-1">{t('classroom.class_flow')}</div>
        <ul className="space-y-0.5">
          {sortedVideos.map((v, i) => {
            const active = v.id === currentLesson?.id;
            const done = lessonComplete(v);
            return (
              <li key={v.id}>
                <button
                  onClick={() => onSelectLesson(v)}
                  className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-left text-[13px] transition ${
                    active
                      ? "border border-violet-400/25 bg-violet-500/10 font-semibold text-white shadow-[0_0_20px_-8px_rgba(139,92,246,0.6)]"
                      : "border border-transparent text-white/60 hover:bg-white/[0.04] hover:text-white/80"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <span
                      className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                        active ? "border-violet-300 bg-violet-400" : "border-white/25 bg-transparent"
                      }`}
                    >
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-[#0a0e1a]" />}
                    </span>
                  )}
                  <span className="flex-1 truncate">
                    {i + 1}. {getTitle(v)}
                  </span>
                  {active && <ChevronRight className="h-4 w-4 shrink-0 text-violet-300" />}
                </button>
              </li>
            );
          })}

          {endQuiz && (
            <li>
              <button
                onClick={() => onOpenQuiz(endQuiz.id)}
                className="group flex w-full items-center gap-2.5 rounded-lg border border-amber-400/20 px-2.5 py-[7px] text-left text-[13px] text-amber-200/90 transition hover:bg-amber-400/[0.08]"
              >
                <Trophy className="h-4 w-4 shrink-0 text-amber-300" />
                <span className="flex-1 truncate">Module Quiz</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-amber-300/70" />
              </button>
            </li>
          )}
        </ul>
      </div>

      <div className="mx-4 my-2 h-px bg-white/[0.06]" />

      {/* Session Context */}
      <div className="px-4 pt-4">
        <div className="ct-label mb-2.5 px-1">{t('classroom.session_context')}</div>
        <div className="space-y-2">
          {[
            { label: "Program", value: getTitle(course) },
            { label: "Module", value: getTitle(chapter) },
            { label: "Lesson", value: getTitle(currentLesson) },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3 text-[12px]">
              <span className="text-white/45">{row.label}</span>
              <span className="truncate text-right font-medium text-white/90">{row.value || "—"}</span>
            </div>
          ))}

          <div className="flex items-center justify-between gap-3 pt-0.5 text-[12px]">
            <span className="text-white/45">Progress</span>
            <div className="flex flex-1 items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-semibold text-white/90">{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-4 my-2 h-px bg-white/[0.06]" />

      {/* Quick Voice Commands */}
      <div className="px-4 pt-4">
        <div className="ct-label mb-2 px-1">{t('classroom.quick_voice')}</div>
        <ul className="space-y-0.5">
          {prompts.map((cmd) => (
            <li key={cmd}>
              <button
                onClick={startIfIdle}
                className="flex w-full items-center gap-2 rounded-lg px-1.5 py-1 text-left text-[12.5px] text-white/60 transition hover:bg-white/[0.04] hover:text-white/85"
              >
                <Info className="h-3.5 w-3.5 shrink-0 text-white/35" />
                <span className="truncate">{cmd}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-center justify-between gap-2 px-1">
          <span className="text-xs font-medium text-violet-300/90">Listening for you…</span>
          <button
            onClick={startIfIdle}
            className="ct-mic-glow grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 text-white shadow-[0_0_20px_-4px_rgba(139,92,246,0.9)]"
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Continue (always visible at the bottom of the rail) */}
      <div className="px-4 pb-4 pt-5">
        <button
          onClick={onContinue}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-4 py-2.5 text-sm font-bold text-[#1a1205] shadow-[0_10px_28px_-10px_rgba(251,191,36,0.8)] transition hover:brightness-105 active:scale-[0.99]"
        >
          {continueLabel}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </>
  );

  return (
    <div className="ct-root flex min-h-[100dvh] flex-col text-white lg:h-[100dvh] lg:overflow-hidden">
      {/* Visible voice diagnostic — surfaces the exact reason if Prof Didier can't connect */}
      {voiceError && (
        <div className="fixed left-1/2 top-3 z-[60] w-[92%] max-w-xl -translate-x-1/2 rounded-lg border border-red-500/40 bg-red-500/15 px-4 py-2 text-center text-sm text-red-100 shadow-lg backdrop-blur-md">
          🎙️ Voice couldn't start — {voiceError}
        </div>
      )}
      {/* ================= Header ================= */}
      <header className="relative z-30 flex h-16 shrink-0 items-center gap-4 border-b border-white/[0.06] bg-[#070a12]/80 px-4 backdrop-blur-md sm:px-6">
        {/* Back + brand + live status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08]"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="leading-none">
            <div className="font-display text-lg font-extrabold tracking-tight text-white sm:text-xl">ALADIAH</div>
            <div className="text-[9px] font-semibold tracking-[0.42em] text-white/45">ACADEMY</div>
          </div>

          <div className="hidden items-center gap-2.5 md:flex">
            <span className="ct-didier-live font-display text-sm font-bold tracking-wide">
              PROFESSOR&nbsp;DIDIER™&nbsp;LIVE
            </span>
            {isLive && (
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5">
                <span className="ct-live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-bold tracking-wider text-emerald-300">LIVE</span>
              </span>
            )}
          </div>
        </div>

        {/* Course selector (center) */}
        <div className="ml-auto hidden min-w-0 flex-1 justify-center lg:flex">
          <button className="group flex w-full max-w-[420px] items-center justify-center gap-2 truncate rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/90 transition hover:border-white/15 hover:bg-white/[0.06]">
            <span className="truncate">{getTitle(course) || "Live Course"}</span>
          </button>
        </div>

        {/* Professor Mode (static) */}
        <button className="ml-auto flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-white/90 transition hover:border-violet-400/30 hover:bg-white/[0.06] lg:ml-0">
          <Presentation className="h-4 w-4 text-violet-300" />
          <span className="hidden sm:inline">{t('classroom.professor_mode')}</span>
          <ChevronDown className="h-4 w-4 text-white/50" />
        </button>

        {/* Right controls */}
        <div className="flex items-center gap-2.5">
          <button className="grid h-9 w-9 place-items-center rounded-full border border-violet-400/40 bg-violet-500/10 text-violet-200 shadow-[0_0_18px_-4px_rgba(139,92,246,0.7)] transition hover:bg-violet-500/20">
            <AudioLines className="h-4 w-4" />
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08]">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Desktop left rail */}
        <aside className="ct-scroll hidden w-[264px] shrink-0 overflow-y-auto border-r border-white/[0.06] bg-[#070a12]/40 lg:block">
          <RailContent />
        </aside>

        {/* Main column */}
        <main className="flex min-h-0 flex-1 flex-col">
          {/* Mobile professor header + class-flow toggle */}
          <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-2.5 lg:hidden">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 opacity-70 blur-[3px]" />
              <img
                src={professorAvatar}
                alt="Professor Didier"
                className="relative h-9 w-9 rounded-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">Professor Didier™</div>
              <div className="text-[11px] text-violet-300/90">{statusText}</div>
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/80"
            >
              <Menu className="h-4 w-4" /> {t('classroom.class_flow')}
            </button>
          </div>

          {/* ================= Stage ================= */}
          <div className="min-h-[280px] p-3 sm:min-h-[340px] lg:min-h-0 lg:flex-[1.55] lg:pb-1.5">
            <div className="relative flex h-full min-h-0 w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#070a12]">
              {/* Animated professor figure zone (hidden below lg, like the prototype) */}
              <div className="relative hidden w-[38%] max-w-[420px] shrink-0 overflow-hidden lg:block xl:w-[34%]">
                {/* Classy rotating globe (replaces the professor figure beside the board) */}
                <RotatingGlobe speaking={isSpeaking} />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-[#070a12]" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#070a12] to-transparent" />
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 backdrop-blur-md">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isSpeaking ? "ct-live-dot bg-emerald-400" : isLive ? "bg-emerald-400/70" : "bg-white/40"
                    }`}
                  />
                  <span className="text-[10px] font-semibold tracking-wide text-white/80">{stageBadge}</span>
                </div>
              </div>

              {/* Whiteboard / topic board zone */}
              <div className="relative min-w-0 flex-1 p-2.5 sm:p-3 lg:-ml-8 lg:pl-0">
                {/* Compact Continue button (stage top-right) so students can always advance */}
                <button
                  onClick={onContinue}
                  className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1.5 text-xs font-bold text-[#1a1205] shadow-[0_8px_20px_-8px_rgba(251,191,36,0.9)] transition hover:brightness-105 active:scale-95"
                >
                  {continueLabel}
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>

                <div className={boardFull
                  ? "fixed inset-2 z-[130] flex overflow-hidden rounded-2xl border border-white/[0.14] bg-[#080b14] shadow-2xl sm:inset-4"
                  : "relative flex h-full w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080b14] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_30px_60px_-30px_rgba(0,0,0,0.9)]"}>
                  {/* Left tool rail (visual only) */}
                  <div className="hidden w-11 shrink-0 flex-col items-center gap-1 border-r border-white/[0.06] bg-black/30 py-3 sm:flex">
                    {WB_TOOLS.map((tool, i) => (
                      <button
                        key={i}
                        className={`grid h-7 w-7 place-items-center rounded-md transition ${
                          tool.active
                            ? "bg-violet-500/20 text-violet-200"
                            : "text-white/45 hover:bg-white/[0.06] hover:text-white/80"
                        }`}
                      >
                        <tool.icon className="h-4 w-4" />
                      </button>
                    ))}
                    <div className="my-1 h-px w-5 bg-white/10" />
                    <button className="grid h-7 w-7 place-items-center rounded-md text-white/45 transition hover:bg-white/[0.06] hover:text-white/80">
                      <Undo2 className="h-4 w-4" />
                    </button>
                    <button className="grid h-7 w-7 place-items-center rounded-md text-white/45 transition hover:bg-white/[0.06] hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Board content — student-zoomable */}
                  <div className="ct-scroll relative flex min-w-0 flex-1 flex-col overflow-auto px-5 py-5 sm:px-8">
                    <div style={{ zoom: boardZoom / 100 }}>
                    <h2 className="ct-font-marker text-center text-3xl font-bold text-sky-300 sm:text-4xl">
                      {boardTitle}
                    </h2>

                    {hasVisual ? (
                      <div
                        className="mx-auto mt-4 w-full max-w-[640px] overflow-hidden rounded-2xl bg-white p-4 text-slate-900 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] [&_svg]:h-auto [&_svg]:w-full"
                        dangerouslySetInnerHTML={{ __html: lessonVisuals![0] }}
                      />
                    ) : (
                      <>
                        {/* Course-aware signature diagram — the board teaches THIS program */}
                        <CourseBoardVisual courseTitle={course?.title || getTitle(course)} moduleIndex={chapter?.order_index} />
                        <p className="ct-font-marker mx-auto mt-6 max-w-[560px] text-center text-lg leading-snug text-white/85 sm:text-xl">
                          Key concepts for this lesson
                        </p>
                        <ul className="mx-auto mt-5 w-full max-w-[560px] space-y-3">
                          {(keyConcepts.length
                            ? keyConcepts
                            : ["Professor Didier will walk you through this topic live."]
                          ).map((concept, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3"
                            >
                              <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-sky-400/50 bg-sky-500/20 text-[12px] font-bold text-sky-200">
                                {i + 1}
                              </span>
                              <span className="ct-font-marker text-[17px] leading-snug text-white/90">
                                {concept}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-5 text-center text-xs text-white/40">
                          Professor Didier is explaining this topic
                        </p>
                      </>
                    )}
                    </div>
                  </div>

                  {/* Bottom board controls — zoom and fullscreen are live */}
                  <div className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 backdrop-blur-md sm:flex">
                    <div className="flex items-center gap-1.5">
                      {WB_SWATCHES.map((c, i) => (
                        <button
                          key={c}
                          className="h-3.5 w-3.5 rounded-full ring-1 ring-white/20 transition hover:scale-110"
                          style={{
                            backgroundColor: c === "#ffffff" ? "transparent" : c,
                            border: c === "#ffffff" ? "1.5px solid rgba(255,255,255,0.7)" : undefined,
                            boxShadow: i === 1 ? "0 0 0 2px rgba(59,130,246,0.6)" : undefined,
                          }}
                        />
                      ))}
                    </div>
                    <div className="h-4 w-px bg-white/15" />
                    <div className="flex items-center gap-2 text-white/70">
                      <button
                        onClick={() => setBoardZoom((z) => Math.max(50, z - 25))}
                        disabled={boardZoom <= 50}
                        aria-label="Zoom out"
                        className="grid h-5 w-5 place-items-center rounded transition hover:bg-white/10 disabled:opacity-30"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setBoardZoom(100)}
                        title="Reset zoom"
                        className="text-xs font-medium tabular-nums transition hover:text-white"
                      >{boardZoom}%</button>
                      <button
                        onClick={() => setBoardZoom((z) => Math.min(200, z + 25))}
                        disabled={boardZoom >= 200}
                        aria-label="Zoom in"
                        className="grid h-5 w-5 place-items-center rounded transition hover:bg-white/10 disabled:opacity-30"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="h-4 w-px bg-white/15" />
                    <button
                      onClick={() => setBoardFull((f) => !f)}
                      aria-label={boardFull ? "Exit fullscreen" : "Fullscreen board"}
                      className="grid h-5 w-5 place-items-center rounded text-white/70 transition hover:bg-white/10"
                    >
                      {boardFull ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= Lower panels ================= */}
          <div className="grid grid-cols-1 gap-3 px-3 pb-1.5 md:grid-cols-2 lg:min-h-0 lg:flex-1 lg:grid-cols-[1.32fr_1fr_0.98fr]">
            {/* Professor transcript */}
            <div className="min-h-[180px] md:col-span-2 lg:col-span-1 lg:min-h-0">
              <div className="ct-card flex h-full min-h-0 flex-col p-5">
                <div ref={transcriptRef} className="ct-scroll min-h-0 flex-1 overflow-auto">
                  {transcript.length ? (
                    <div className="space-y-2">
                      {transcript.map((e, i) => (
                        <p key={i} className="text-[15px] leading-relaxed text-white/85">
                          <span
                            className={`font-semibold ${
                              e.role === "agent" ? "text-violet-300" : "text-sky-300"
                            }`}
                          >
                            {e.role === "agent" ? "Professor Didier:" : "You:"}
                          </span>{" "}
                          {e.message}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[15px] leading-relaxed text-white/55">
                      Tap the mic to start your live session with Professor Didier.
                    </p>
                  )}
                  {recapComplete && (
                    <div className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Recap complete
                    </div>
                  )}
                </div>

                <div className="mt-3 h-9 w-full">
                  <Waveform bars={72} active={isSpeaking} />
                </div>
              </div>
            </div>

            {/* You Can Say */}
            <div className="min-h-[220px] lg:min-h-0">
              <div className="ct-card flex h-full min-h-0 flex-col p-4">
                <div className="ct-label mb-2.5 px-1">{t('classroom.you_can_say')}</div>
                <ul className="ct-scroll min-h-0 flex-1 space-y-1.5 overflow-auto pr-1">
                  {prompts.map((prompt) => (
                    <li key={prompt}>
                      <button
                        onClick={startIfIdle}
                        className="group flex w-full items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-left text-[13.5px] text-white/85 transition hover:border-violet-400/30 hover:bg-violet-500/[0.08]"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400 shadow-[0_0_8px_1px_rgba(139,92,246,0.8)]" />
                        <span className="flex-1 leading-snug">{prompt}</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-white/30 transition group-hover:text-violet-300" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Student Notes (local state only) */}
            <div className="min-h-[220px] lg:min-h-0">
              <div className="ct-card flex h-full min-h-0 flex-col p-4">
                <div className="ct-label mb-2.5 px-1">{t('classroom.student_notes')}</div>
                <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-dashed border-white/[0.14] bg-black/20 p-3">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={"Add your notes here…\nProfessor Didier will remember what we discuss."}
                    className="ct-scroll min-h-0 flex-1 resize-none bg-transparent text-[13.5px] leading-relaxed text-white/85 outline-none placeholder:text-white/35"
                  />
                </div>
                <div className="mt-2.5 flex items-center gap-1 px-1">
                  {NOTES_TOOLBAR.map((Icon, i) => (
                    <button
                      key={i}
                      className="grid h-7 w-7 place-items-center rounded-md text-white/45 transition hover:bg-white/[0.06] hover:text-white/85"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ================= Voice control bar ================= */}
          <div className="flex shrink-0 items-center justify-center gap-6 border-t border-white/[0.06] bg-[#070a12]/70 px-4 py-3 backdrop-blur-md sm:gap-10">
            {/* Left cluster */}
            <div className="flex items-center gap-6 sm:gap-8">
              <button onClick={() => setMuted((v) => !v)} className="flex flex-col items-center gap-1.5">
                <span
                  className={`grid h-11 w-11 place-items-center rounded-full border transition ${
                    muted
                      ? "border-violet-400/40 bg-violet-500/15 text-violet-200"
                      : "border-white/[0.08] bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
                  }`}
                >
                  {muted ? <MicOff className="h-[18px] w-[18px]" /> : <Mic className="h-[18px] w-[18px]" />}
                </span>
                <span className="text-[11px] font-medium text-white/55">{t('classroom.mute')}</span>
              </button>
              <button className="flex flex-col items-center gap-1.5">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08]">
                  <ScreenShare className="h-[18px] w-[18px]" />
                </span>
                <span className="text-[11px] font-medium text-white/55">{t('classroom.share_screen')}</span>
              </button>
            </div>

            {/* Central mic (hero action) */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => (isLive ? onEnd() : onStart())}
                className={`${
                  isLive ? "ct-mic-glow" : ""
                } grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500 text-white shadow-[0_0_30px_-4px_rgba(99,102,241,0.9)] ring-4 ring-[#0a0e1a] transition active:scale-95`}
                aria-pressed={isLive}
                aria-label="Tap to speak"
              >
                <Mic className="h-6 w-6" />
              </button>
              <span className="text-[11px] font-medium text-white/60">{micLabel}</span>
            </div>

            {/* Right cluster */}
            <div className="flex items-center gap-6 sm:gap-8">
              <button className="flex flex-col items-center gap-1.5">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08]">
                  <Pencil className="h-[18px] w-[18px]" />
                </span>
                <span className="text-[11px] font-medium text-white/55">{t('classroom.open_whiteboard')}</span>
              </button>
              <button className="flex flex-col items-center gap-1.5">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08]">
                  <HelpCircle className="h-[18px] w-[18px]" />
                </span>
                <span className="text-[11px] font-medium text-white/55">{t('classroom.need_help')}</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ================= Bottom status strip ================= */}
      <div className="flex shrink-0 items-center gap-4 border-t border-white/[0.06] bg-[#05070e] px-4 py-2 text-[11.5px] sm:px-6">
        <div className="flex items-center gap-1.5">
          <span className="ct-live-dot h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-semibold tracking-wide text-emerald-300">{t('classroom.live_session')}</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/60">
          <Clock className="h-3.5 w-3.5" />
          <span className="tabular-nums">{fmt(duration)}</span>
        </div>
        <SignalBars />

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-white/50 sm:inline">AI Professor</span>
          <span className="rounded-full border border-violet-400/30 bg-violet-500/15 px-2.5 py-0.5 font-medium text-violet-200">
            {t('classroom.online')}
          </span>
          <button className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-white/70">
            <HelpCircle className="h-3.5 w-3.5" /> {t('classroom.need_help')}
          </button>
        </div>
      </div>

      {/* ================= Mobile class-flow drawer ================= */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="ct-scroll absolute inset-y-0 left-0 w-[290px] overflow-y-auto border-r border-white/10 bg-[#070a12] shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="ct-didier-live font-display text-sm font-bold">PROFESSOR DIDIER™ LIVE</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-white/60 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <RailContent />
          </div>
        </div>
      )}
    </div>
  );
}
