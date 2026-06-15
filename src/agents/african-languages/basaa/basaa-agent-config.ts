/**
 * Basaa Agent — configuration & source registry
 *
 * African Languages module → Basaa (Bàsàá, ISO 639-3 `bas`).
 *
 * This file is the single in-code source of truth for the Basaa Agent's identity, the
 * registry of documentation sources it tracks, and the processing-pipeline configuration.
 *
 * IMPORTANT (repo canon): this module collects, organizes, and processes Basaa language
 * documentation. It performs NO automated scraping of copyrighted content. Every source
 * carries a `license` field that MUST be resolved/approved before full content is imported
 * into `datasets/`. Sources begin life as `licenseStatus: "unreviewed"`.
 */

export const BASAA_LANGUAGE = {
  name: "Basaa",
  endonym: "Bàsàá",
  iso639_3: "bas",
  glottolog: "basa1284",
  region: "Cameroon (Centre & Littoral regions)",
  family: "Niger-Congo › Atlantic-Congo › Bantu (Zone A40)",
  tonal: true,
} as const;

export type ContentType =
  | "dictionary"
  | "course"
  | "grammar"
  | "tone-research"
  | "orthography-research";

export type Priority = 1 | 2 | 3 | 4 | 5 | 6;

/** Where a source sits in the license-review lifecycle. Gate for import. */
export type LicenseStatus = "unreviewed" | "approved" | "restricted" | "rejected";

/** Pipeline stage a source's extracted data currently lives in. */
export type PipelineStage = "registered" | "raw" | "processed" | "validated";

export interface BasaaSource {
  /** Stable key, lowercase-hyphenated. Used to name dataset files for this source. */
  id: string;
  title: string;
  /** Author or institution responsible for the asset. */
  author: string;
  /** Canonical URL for the asset (landing page or download). */
  url: string;
  contentType: ContentType;
  /** 1 = highest. Matches the collection priority table in the task brief. */
  priority: Priority;
  /** Why this asset matters to the Basaa intelligence layer. */
  extractionValue: string;
  /** License / usage rights. MUST be "approved" before content import. */
  licenseStatus: LicenseStatus;
  /** Current pipeline stage for this source's data. */
  stage: PipelineStage;
  /** Path to the source's markdown registry file (relative to this module). */
  registryFile: string;
}

/**
 * Source registry — mirrors `sources/**` markdown files.
 * Ordered by collection priority. Start with priority 1 and 3 (dictionary + course):
 * they are the strongest, broadest-coverage foundation.
 */
export const BASAA_SOURCES: BasaaSource[] = [
  {
    id: "sil-webonary-basaa-dictionary",
    title: "SIL / Webonary Basaa–English–French–German Dictionary",
    author: "SIL International / Webonary",
    url: "https://www.webonary.org/basaa/",
    contentType: "dictionary",
    priority: 1,
    extractionValue:
      "Best core dictionary (~15,667–16,000 entries). Searchable Basaa/French/English; " +
      "primary source for `basaa_dictionary_entries`.",
    licenseStatus: "unreviewed",
    stage: "registered",
    registryFile: "sources/dictionaries/sil-webonary-basaa-dictionary.md",
  },
  {
    id: "sil-webonary-basaa-pdf",
    title: "Webonary Downloadable Basaa PDF Dictionary",
    author: "SIL International / Webonary",
    url: "https://www.webonary.org/basaa/",
    contentType: "dictionary",
    priority: 2,
    extractionValue:
      "Offline, parseable PDF of the dictionary — extractable into JSON/DB without live scraping.",
    licenseStatus: "unreviewed",
    stage: "registered",
    registryFile: "sources/dictionaries/sil-webonary-basaa-pdf-notes.md",
  },
  {
    id: "peace-corps-basaa-course",
    title: "Peace Corps Basaa Language Course",
    author: "U.S. Peace Corps (Cameroon)",
    url: "https://www.livelingua.com/peace-corps/Basaa/",
    contentType: "course",
    priority: 3,
    extractionValue:
      "~479-page practical course: dialogues, survival phrases, grammar, health-field " +
      "vocabulary. Strong source for `basaa_sentence_pairs` and `basaa_grammar_notes`.",
    licenseStatus: "unreviewed",
    stage: "registered",
    registryFile: "sources/courses/peace-corps-basaa-course.md",
  },
  {
    id: "hyman-basaa-grammar",
    title: "Larry Hyman — Basaá Grammar Chapter",
    author: "Larry M. Hyman (UC Berkeley)",
    url: "https://linguistics.berkeley.edu/~hyman/",
    contentType: "grammar",
    priority: 4,
    extractionValue:
      "Authoritative linguistic grammar: Basaa structure, dialects, tonal behavior. " +
      "Primary source for `basaa_grammar_notes`.",
    licenseStatus: "unreviewed",
    stage: "registered",
    registryFile: "sources/grammar/hyman-basaa-grammar.md",
  },
  {
    id: "basaa-tone-system",
    title: "Basaa Tone-Language Research (Larry Hyman et al.)",
    author: "Larry M. Hyman (UC Berkeley) and others",
    url: "https://linguistics.berkeley.edu/~hyman/",
    contentType: "tone-research",
    priority: 6,
    extractionValue:
      "Tone handling — critical for voice/speech models (VoiceBridge) and correct " +
      "orthographic tone marking.",
    licenseStatus: "unreviewed",
    stage: "registered",
    registryFile: "sources/grammar/basaa-tone-system.md",
  },
  {
    id: "basaa-orthographic-conversion",
    title: "Orthographic Conversion Research for Bàsàá",
    author: "Academic (to be confirmed during license review)",
    url: "",
    contentType: "orthography-research",
    priority: 5,
    extractionValue:
      "Basaa has multiple writing systems. Standardizes spelling for AI training; " +
      "drives `basaa_orthography_rules`.",
    licenseStatus: "unreviewed",
    stage: "registered",
    registryFile: "sources/orthography/basaa-orthographic-conversion.md",
  },
];

/**
 * Pipeline configuration. Data flows source → raw → processed → validated, then a
 * human-approved SQL file loads it into Supabase (Claude Code never auto-applies SQL).
 */
export const BASAA_PIPELINE = {
  stages: ["raw", "processed", "validated"] as const,
  datasetRoot: "datasets",
  schemas: {
    dictionaryEntry: "schemas/basaa_dictionary_entry.schema.json",
    sentencePair: "schemas/basaa_sentence_pair.schema.json",
    techTerm: "schemas/basaa_tech_term.schema.json",
  },
  prompts: {
    dictionaryExtractor: "prompts/basaa-dictionary-extractor.md",
    translationAgent: "prompts/basaa-translation-agent.md",
    qualityReviewer: "prompts/basaa-quality-reviewer.md",
  },
  /** Hard gate: only sources with this status may be imported into datasets. */
  importRequiresLicenseStatus: "approved" as LicenseStatus,
} as const;

export const BASAA_AGENT_CONFIG = {
  id: "basaa-agent",
  name: "Basaa Agent",
  module: "african-languages/basaa",
  language: BASAA_LANGUAGE,
  mission:
    "Build a structured Basaa language intelligence layer for Aladiah Cameroon — " +
    "powering multilingual learning, translation, and the future VoiceBridge system.",
  sources: BASAA_SOURCES,
  pipeline: BASAA_PIPELINE,
} as const;

export default BASAA_AGENT_CONFIG;
