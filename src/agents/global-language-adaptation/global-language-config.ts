/**
 * Global Language Adaptation Agent — configuration & contract
 *
 * Mission: ensure every supported language fully adapts the ENTIRE Aladiah experience —
 * UI, course content, lessons, quizzes, simulations, diagrams, navigation, portals,
 * alerts, transcripts — not just a subset of labels.
 *
 * This file is the typed source of truth the founder dashboard and tooling consume. The
 * runnable scanner lives in ./scanner/coverage-scanner.mjs; planning docs in this folder.
 *
 * Canon alignment: this agent serves career-transformation in Africa/Caribbean-first markets
 * (NORTH_STAR Rule 7) by making the platform usable in the learner's own language. It is a
 * data-foundation + quality-gate layer and blocks no Core System. It does NOT extend the
 * competency taxonomy.
 */

/**
 * Supported UI languages — mirrors `Language` in src/contexts/LanguageContext.tsx.
 * Keep in sync; the scanner reads the canonical list from LanguageContext at runtime.
 * `bas` (Basaa) is NOT yet wired into LanguageContext — it is tracked here as `pending`
 * so the dashboard can show it as a target before it goes live.
 */
export const UI_LANGUAGES = [
  'en', 'es', 'zh', 'ar', 'fr', 'de', 'ja', 'pt', 'hi', 'ko', 'it',
  'ru', 'nl', 'pl', 'tr', 'sw', 'yo', 'ha', 'ig', 'vi', 'th',
] as const;
export type UiLanguage = (typeof UI_LANGUAGES)[number];

/** Languages targeted but not yet present in LanguageContext. */
export const PENDING_LANGUAGES = ['bas'] as const; // Basaa
export type PendingLanguage = (typeof PENDING_LANGUAGES)[number];

export type LanguageCode = UiLanguage | PendingLanguage;

/** The baseline language every other language is measured against. */
export const BASELINE_LANGUAGE: UiLanguage = 'en';

/**
 * Rollout priority. English and French come FIRST (primary launch languages); the
 * remaining UI languages are secondary; Basaa is an add-on target layered on after the
 * primary experience is solid. The scanner, dashboard, and translation backlog order
 * work by this tiering.
 */
export const LANGUAGE_PRIORITY = {
  primary: ['en', 'fr'] as LanguageCode[],
  secondary: [
    'es', 'zh', 'ar', 'de', 'ja', 'pt', 'hi', 'ko', 'it',
    'ru', 'nl', 'pl', 'tr', 'sw', 'yo', 'ha', 'ig', 'vi', 'th',
  ] as LanguageCode[],
  addon: ['bas'] as LanguageCode[], // Basaa — add-on, layered on after primary languages
} as const;

/** Languages in rollout-priority order: primary → secondary → add-on. */
export const PRIORITY_ORDER: LanguageCode[] = [
  ...LANGUAGE_PRIORITY.primary,
  ...LANGUAGE_PRIORITY.secondary,
  ...LANGUAGE_PRIORITY.addon,
];

/** Tier of a language for prioritization. */
export function languageTier(lang: LanguageCode): 'primary' | 'secondary' | 'addon' {
  if (LANGUAGE_PRIORITY.primary.includes(lang)) return 'primary';
  if (LANGUAGE_PRIORITY.addon.includes(lang)) return 'addon';
  return 'secondary';
}

/**
 * Translatable surfaces of the platform. Each surface is independently scored; a language
 * is only "active" when ALL required surfaces hit 100% (see ACTIVATION_RULES).
 */
export type SurfaceId =
  | 'navigation'
  | 'buttons'
  | 'ui-labels'
  | 'alerts-feedback'
  | 'course-titles'
  | 'lesson-titles'
  | 'lesson-body'
  | 'quiz-questions'
  | 'quiz-answers'
  | 'quiz-feedback'
  | 'simulations'
  | 'diagrams'
  | 'transcripts'
  | 'ai-tutor';

/**
 * Language Completeness Rules — a language is NOT "active" unless every required surface
 * is 100% translated (diagrams may be satisfied by translated SVG/image assets or captions).
 */
export const ACTIVATION_RULES: { surface: SurfaceId; requiredPct: 100; note: string }[] = [
  { surface: 'navigation', requiredPct: 100, note: 'Sidebar, menus, nav labels.' },
  { surface: 'buttons', requiredPct: 100, note: 'All actionable buttons/CTAs.' },
  { surface: 'course-titles', requiredPct: 100, note: 'courses.translations.' },
  { surface: 'lesson-titles', requiredPct: 100, note: 'videos/chapters.translations title.' },
  { surface: 'lesson-body', requiredPct: 100, note: 'videos/chapters.translations body/description.' },
  { surface: 'quiz-questions', requiredPct: 100, note: 'quiz_questions (needs translations support).' },
  { surface: 'quiz-answers', requiredPct: 100, note: 'quiz_questions.options per language.' },
  { surface: 'quiz-feedback', requiredPct: 100, note: 'quiz_questions.explanation + result messages.' },
  { surface: 'alerts-feedback', requiredPct: 100, note: 'Toasts, validation, system messages.' },
  { surface: 'diagrams', requiredPct: 100, note: 'Translated labels/captions OR localized asset.' },
];

/**
 * Graceful fallback shown when a Basaa (or any target-language) translation is missing.
 * The missing string MUST be logged to language_missing_translations at the same time.
 */
export const FALLBACK_POLICY = {
  // {lang} = display name of the requested language; {fallback} = served language.
  messageKey: 'i18n.fallback_notice',
  defaultMessage:
    '{lang} translation pending. Showing {fallback} version temporarily.',
  // Resolution order when the requested language lacks a string.
  fallbackChain: (requested: LanguageCode): LanguageCode[] => {
    // Basaa falls back to French first (Cameroon context), then English.
    if (requested === 'bas') return ['fr', 'en'];
    return ['en'];
  },
  logMissing: true,
} as const;

/** Governance lifecycle for student-submitted language data. Only `approved` goes live. */
export const REVIEW_STATES = [
  'unreviewed',
  'ai-reviewed',
  'human-reviewed',
  'approved',
  'rejected',
] as const;
export type ReviewState = (typeof REVIEW_STATES)[number];

/** Tables owned by this agent (cross-language). See database/database-migration-plan.md. */
export const LANGUAGE_TABLES = [
  'language_translation_memory',
  'language_vocabulary_entries',
  'language_student_submissions',
  'language_review_queue',
  'language_quality_scores',
  'language_missing_translations',
] as const;

/** Basaa Agent tables enriched by approved Basaa student submissions (integration #5). */
export const BASAA_ENRICHMENT_TABLES = [
  'basaa_dictionary_entries',
  'basaa_sentence_pairs',
  'basaa_tech_terms',
  'basaa_translation_memory',
  'basaa_quality_reviews',
] as const;

export const GLOBAL_LANGUAGE_AGENT = {
  id: 'global-language-adaptation-agent',
  name: 'Global Language Adaptation Agent',
  module: 'global-language-adaptation',
  mission:
    'Ensure every supported language fully adapts the entire Aladiah experience — not just labels.',
  baseline: BASELINE_LANGUAGE,
  uiLanguages: UI_LANGUAGES,
  pendingLanguages: PENDING_LANGUAGES,
  priority: LANGUAGE_PRIORITY,
  priorityOrder: PRIORITY_ORDER,
  activationRules: ACTIVATION_RULES,
  fallback: FALLBACK_POLICY,
  reviewStates: REVIEW_STATES,
  tables: LANGUAGE_TABLES,
  basaaIntegration: {
    modulePath: 'src/agents/african-languages/basaa/',
    enriches: BASAA_ENRICHMENT_TABLES,
  },
  dashboard: {
    name: 'Language Quality Command Center',
    route: '/founder/language-quality',
    founderOnly: true,
  },
  scanner: {
    entry: 'src/agents/global-language-adaptation/scanner/coverage-scanner.mjs',
    reportDir: 'src/agents/global-language-adaptation/scanner/reports/',
  },
} as const;

export default GLOBAL_LANGUAGE_AGENT;
