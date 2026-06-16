/**
 * Global Language Adaptation Agent — AOS registry descriptor.
 *
 * Seeds one row into `aos_agents` (see supabase migration 20260610130000).
 * This object is the single source of truth for the agent's identity,
 * cadence, and permission envelope. It is intentionally data-only so it can be
 * read by the founder dashboard and (later) by the AOS orchestrator without
 * importing any runtime/React code.
 *
 * Permissions follow the canon: this agent may READ and WRITE its own registry
 * tables, but may NOT publish student-sourced vocabulary — `publish:false` and
 * `human_approval_required:true` enforce the "only approved entries become
 * official vocabulary" governance rule.
 */
export const GLOBAL_LANGUAGE_ADAPTATION_AGENT = {
  slug: 'global-language-adaptation',
  name: 'Global Language Adaptation Agent',
  role: 'Platform-wide localization coverage, quality, and language-memory pipeline',
  description:
    'Scans every visible string, scores translation coverage per language, ' +
    'maintains the missing-translation registry, and runs the student-sourced ' +
    'language-memory review pipeline (Basaa first). Never auto-publishes ' +
    'student submissions.',
  status: 'active' as const,
  priority: 60,
  cadence: 'daily' as const,
  permissions: {
    read: true,
    write: true,
    publish: false,
    admin: false,
    human_approval_required: true,
  },
  /** Tables this agent owns (created by the reviewable migration). */
  tables: [
    'language_translation_memory',
    'language_vocabulary_entries',
    'language_student_submissions',
    'language_review_queue',
    'language_quality_scores',
    'language_missing_translations',
  ] as const,
  /** Basaa-specific tables enriched via the companion agent. */
  basaaTables: [
    'basaa_dictionary_entries',
    'basaa_sentence_pairs',
    'basaa_tech_terms',
    'basaa_translation_memory',
    'basaa_quality_reviews',
  ] as const,
  dashboardRoute: '/founder/language-quality',
} as const;

export type LanguageAdaptationAgent = typeof GLOBAL_LANGUAGE_ADAPTATION_AGENT;
