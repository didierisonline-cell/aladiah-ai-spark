// =============================================================================
// Professor Didier™ v1 — the lesson-aware tutor core (Phase IV step 4,
// WO-0015, FEO-2026-001). PURE: prompt compilation, guardrails, and
// conversation discipline — no network, no vendor. The transport is
// tutorClient.ts (through ai-proxy — keys stay server-side).
//
// The objective (Founder direction): not another subsystem — the best
// Lesson 1 experience in the world for the AI Enterprise Scrum Master
// flagship. The tutor is grounded in THE CURRENT LESSON (full transcript,
// not a clipped snippet), knows where the student stands in the module,
// coaches quiz mistakes AFTER submission, and — per the AVIS doctrine —
// falls back safely to word-pictures when no governed visual exists:
// students never invoke the renderer (Integration Architecture §10).
// =============================================================================

export interface TutorLessonContext {
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
  /** The FULL lesson transcript — the tutor's ground truth. */
  lessonTranscript: string;
  /** 1-based position within the module. */
  lessonNumber: number;
  lessonCount: number;
  /** What follows the current lesson in the governed step list. */
  nextStep: 'lesson' | 'quiz' | 'none';
  /** BCP-47-ish app language code (en, fr, es, …). */
  language: string;
  studentName?: string;
}

export interface QuizCoachRequest {
  questionText: string;
  scenarioContext: string | null;
  options: string[];
  studentAnswerIndex: number;
  correctAnswerIndex: number;
  /** The curriculum's canonical explanation — the tutor builds on it, never contradicts it. */
  baseExplanation: string;
}

export interface TutorMessage { role: 'user' | 'assistant'; content: string }

/** Full language names for the model instruction (mirrors the voice panel's map). */
const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English', fr: 'French', es: 'Spanish', de: 'German', zh: 'Mandarin Chinese',
  ar: 'Arabic', ja: 'Japanese', pt: 'Portuguese', hi: 'Hindi', ko: 'Korean',
  it: 'Italian', ru: 'Russian', nl: 'Dutch', pl: 'Polish', tr: 'Turkish',
  sw: 'Swahili', yo: 'Yoruba', ha: 'Hausa', ig: 'Igbo', vi: 'Vietnamese', th: 'Thai',
};
export const languageName = (code: string): string => LANGUAGE_NAMES[code] || 'English';

/** ai-proxy allowlisted model + budget for a tutor turn. */
export const TUTOR_MODEL = 'claude-sonnet-4-6';
export const TUTOR_MAX_TOKENS = 700;
/** Conversation discipline: the lesson grounding lives in the system prompt,
 *  so only the recent exchange needs to travel. */
export const MAX_TUTOR_TURNS = 12;

/**
 * The tutor's governed system prompt — compiled from the lesson, never from
 * free-form persona text scattered across components.
 */
export function buildTutorSystemPrompt(ctx: TutorLessonContext): string {
  const lang = languageName(ctx.language);
  const guidance = ctx.nextStep === 'quiz'
    ? 'The module quiz comes right after this lesson — when the student feels ready, encourage them to take it.'
    : ctx.nextStep === 'lesson'
      ? 'Another lesson follows this one — encourage the student to continue when this one is solid.'
      : 'This is the final step of the module.';

  return [
    `You are Prof. Didier, the AI professor of Aladiah Academy. Motto: Solo Excelencia — only excellence. Warm, encouraging, rigorous; a career mentor, not a search engine. ${ctx.studentName ? `The student's name is ${ctx.studentName}.` : ''}`,
    `RESPOND IN ${lang.toUpperCase()}. If the student asks to switch languages, switch immediately and continue in that language. The label "Prof. Didier" always stays in Latin script.`,
    ``,
    `THE CURRENT LESSON (your ground truth — teach from it):`,
    `Course: "${ctx.courseTitle}" · Module: "${ctx.moduleTitle}" · Lesson ${ctx.lessonNumber} of ${ctx.lessonCount}: "${ctx.lessonTitle}".`,
    `LESSON CONTENT:\n${ctx.lessonTranscript || '(No transcript available — teach from the lesson title and standard Scrum canon, and say when something is outside this lesson.)'}`,
    ``,
    `RULES:`,
    `1. GROUNDING — Teach THIS lesson. Connect questions back to the lesson content. If asked something beyond it, give a brief honest answer, say it is covered later in the program, and return to this lesson. Never invent facts, statistics, or Scrum Guide quotes; if you are not sure, say so plainly.`,
    `2. METHOD — Explain simply, then deepen. Prefer one concrete workplace example over three abstractions. End most replies with ONE short check-in question that moves the student forward (Socratic, never an interrogation).`,
    `3. VISUALS — You cannot generate or display images in this chat. When a picture would help, draw a WORD-PICTURE instead: describe the diagram step by step in words the student can sketch (this is the textual twin). Governed diagrams appear on the lesson page itself when the Institution approves them — you may point to them, never promise new ones.`,
    `4. QUIZ INTEGRITY — The module quiz measures real understanding. If the student asks for quiz answers before taking it, refuse warmly and coach the underlying concept instead. Never reveal which option is correct for any upcoming quiz question.`,
    `5. GUIDANCE — ${guidance} If the student seems lost, suggest the single next action (re-read a section, try the voice session, take the quiz).`,
    `6. HONESTY — Never fabricate the student's progress, scores, or abilities. Encouragement is earned, specific, and true.`,
    `Keep replies short: 2–5 sentences plus the check-in question, unless the student asks for depth.`,
  ].join('\n');
}

/**
 * Post-submission quiz coaching — the student already answered, so full
 * detail is allowed. Builds on the curriculum's canonical explanation.
 */
export function buildQuizCoachPrompt(ctx: Pick<TutorLessonContext, 'courseTitle' | 'moduleTitle' | 'language'>, req: QuizCoachRequest): { system: string; userMessage: string } {
  const lang = languageName(ctx.language);
  const letter = (i: number) => String.fromCharCode(65 + i); // matches the quiz UI's A)/B)/C)/D)
  const system = [
    `You are Prof. Didier, the AI professor of Aladiah Academy (Solo Excelencia). A student just SUBMITTED a quiz in module "${ctx.moduleTitle}" of "${ctx.courseTitle}" and got a question wrong. Coach them — this is the moment learning happens.`,
    `RESPOND IN ${lang.toUpperCase()}.`,
    `The curriculum's canonical explanation is authoritative — build on it, never contradict it.`,
    `Structure: (1) name the likely misconception behind THEIR chosen answer, kindly; (2) explain why the correct answer is right, tied to the concept; (3) one memorable rule of thumb or workplace example so it sticks. 4–6 sentences total. No scolding — a wrong answer followed by understanding is progress.`,
  ].join('\n');
  const userMessage = [
    req.scenarioContext ? `Scenario: ${req.scenarioContext}` : '',
    `Question: ${req.questionText}`,
    `Options: ${req.options.map((o, i) => `${letter(i)}) ${o}`).join(' · ')}`,
    `The student chose ${letter(req.studentAnswerIndex)}) "${req.options[req.studentAnswerIndex] ?? ''}".`,
    `The correct answer is ${letter(req.correctAnswerIndex)}) "${req.options[req.correctAnswerIndex] ?? ''}".`,
    `Canonical explanation: ${req.baseExplanation || '(none provided)'}`,
    `Help me understand why my answer was wrong and how to think about this correctly.`,
  ].filter(Boolean).join('\n');
  return { system, userMessage };
}

/** Starter suggestions — one tap from a blank box to a great first exchange. */
export function starterSuggestions(ctx: TutorLessonContext): string[] {
  const l: Record<string, string[]> = {
    en: [
      'Explain this lesson in simple words',
      'Give me a real-world example',
      'Describe a diagram of the key idea',
      'Ask me 3 questions to check my understanding',
    ],
    es: [
      'Explícame esta lección en palabras simples',
      'Dame un ejemplo del mundo real',
      'Descríbeme un diagrama de la idea clave',
      'Hazme 3 preguntas para comprobar lo que entendí',
    ],
    fr: [
      'Explique-moi cette leçon simplement',
      'Donne-moi un exemple concret',
      'Décris-moi un schéma de l’idée clé',
      'Pose-moi 3 questions pour vérifier ma compréhension',
    ],
  };
  return l[ctx.language] || l.en;
}

/**
 * Conversation discipline: keep the last MAX_TUTOR_TURNS messages, always
 * starting the window on a user message (Anthropic requires user-first).
 */
export function clampConversation(messages: TutorMessage[], maxTurns: number = MAX_TUTOR_TURNS): TutorMessage[] {
  let window = messages.slice(-maxTurns);
  while (window.length && window[0].role !== 'user') window = window.slice(1);
  return window;
}
