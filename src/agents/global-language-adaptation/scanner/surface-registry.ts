/**
 * Surface Registry — the catalog of translatable surfaces and HOW each is scanned.
 *
 * The runnable scanner (coverage-scanner.mjs) currently implements the `static-source`
 * surfaces. The DB and asset surfaces are declared here as the roadmap for later scanner
 * phases (they require a Supabase read-mode). Keeping the registry typed lets the founder
 * dashboard render every surface even before its scanner phase is implemented.
 */

import type { SurfaceId } from '../global-language-config';

export type ScanMethod =
  | 'static-keys'        // parse LanguageContext translation blocks
  | 'static-jsx'         // heuristic hardcoded-string detection in .tsx
  | 'static-refs'        // t('...') usage extraction
  | 'db-translations-json' // courses/chapters/videos `translations` JSON column
  | 'db-row-translation' // table needs a per-language translation mechanism
  | 'static-data'        // TS data files (e.g. src/data/simulations.ts)
  | 'svg-labels';        // <text> nodes inside SVG diagram components

export interface SurfaceDescriptor {
  id: SurfaceId;
  label: string;
  /** Where the source-of-truth content lives. */
  location: string;
  method: ScanMethod;
  /** Implemented in the current scanner version, or planned. */
  status: 'implemented' | 'planned';
  /** Required for a language to be marked "active". */
  blocksActivation: boolean;
  notes: string;
}

export const SURFACE_REGISTRY: SurfaceDescriptor[] = [
  {
    id: 'navigation',
    label: 'Navigation & sidebar',
    location: 'src/contexts/LanguageContext.tsx (nav.* keys) + nav components',
    method: 'static-keys',
    status: 'implemented',
    blocksActivation: true,
    notes: 'Some nav labels are hardcoded in components — caught by static-jsx pass.',
  },
  {
    id: 'buttons',
    label: 'Buttons & CTAs',
    location: 'LanguageContext keys + button components',
    method: 'static-keys',
    status: 'implemented',
    blocksActivation: true,
    notes: 'Hardcoded button text flagged by static-jsx.',
  },
  {
    id: 'ui-labels',
    label: 'General UI labels',
    location: 'src/contexts/LanguageContext.tsx + overviewStrings.ts',
    method: 'static-keys',
    status: 'implemented',
    blocksActivation: true,
    notes: 'Baseline = en (571 keys at last scan).',
  },
  {
    id: 'alerts-feedback',
    label: 'Alerts, toasts & system messages',
    location: 'LanguageContext + inline strings',
    method: 'static-jsx',
    status: 'implemented',
    blocksActivation: true,
    notes: 'Many are hardcoded; high-value triage target.',
  },
  {
    id: 'course-titles',
    label: 'Course titles & descriptions',
    location: 'Supabase courses.translations (Json)',
    method: 'db-translations-json',
    status: 'planned',
    blocksActivation: true,
    notes: 'Column exists; coverage = languages present in translations JSON.',
  },
  {
    id: 'lesson-titles',
    label: 'Lesson/chapter titles',
    location: 'Supabase chapters.translations / videos.translations',
    method: 'db-translations-json',
    status: 'planned',
    blocksActivation: true,
    notes: 'Title sub-field of translations JSON.',
  },
  {
    id: 'lesson-body',
    label: 'Lesson body / descriptions',
    location: 'Supabase chapters.translations / videos.translations',
    method: 'db-translations-json',
    status: 'planned',
    blocksActivation: true,
    notes: 'Body/description sub-field. Largest content volume.',
  },
  {
    id: 'quiz-questions',
    label: 'Quiz question text',
    location: 'Supabase quiz_questions.question_text (NO translations column yet)',
    method: 'db-row-translation',
    status: 'planned',
    blocksActivation: true,
    notes: 'Requires schema change — see database-migration-plan.md.',
  },
  {
    id: 'quiz-answers',
    label: 'Quiz answer options',
    location: 'Supabase quiz_questions.options (Json)',
    method: 'db-row-translation',
    status: 'planned',
    blocksActivation: true,
    notes: 'Options array must be translated per language.',
  },
  {
    id: 'quiz-feedback',
    label: 'Quiz explanations & result feedback',
    location: 'quiz_questions.explanation + result UI strings',
    method: 'db-row-translation',
    status: 'planned',
    blocksActivation: true,
    notes: 'Mix of DB content and UI strings.',
  },
  {
    id: 'simulations',
    label: 'Simulation content',
    location: 'src/data/simulations.ts + simulation_messages (DB)',
    method: 'static-data',
    status: 'planned',
    blocksActivation: false,
    notes: '2,800+ hardcoded-English simulations; no language field. Large effort.',
  },
  {
    id: 'diagrams',
    label: 'Diagram labels & captions',
    location: 'src/components/simulation/ArchitectureDiagramViewer.tsx (SVG <text>)',
    method: 'svg-labels',
    status: 'planned',
    blocksActivation: true,
    notes: 'Labels hardcoded in SVG; see diagram_label_set schema + diagram plan.',
  },
  {
    id: 'transcripts',
    label: 'Video/lesson transcripts',
    location: 'TBD (transcript source not yet centralized)',
    method: 'db-row-translation',
    status: 'planned',
    blocksActivation: false,
    notes: 'Locate transcript storage before scoring.',
  },
  {
    id: 'ai-tutor',
    label: 'AI tutor (Professor Didier) responses',
    location: 'Runtime LLM output + prompt locale',
    method: 'db-row-translation',
    status: 'planned',
    blocksActivation: false,
    notes: 'Handled via prompt-language injection, not static strings.',
  },
];

export default SURFACE_REGISTRY;
