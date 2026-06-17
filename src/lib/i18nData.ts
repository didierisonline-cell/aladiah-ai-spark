// ============================================================================
// Centralized localized-data resolution for DB-backed content (courses, programs,
// chapters, videos…). NO component should invent its own translations lookup.
//
// Fallback order (per spec):
//   1. translations[language][field]
//   2. translations.en[field]
//   3. base field
// When a non-English field falls back, we RECORD it (dev audit) so missing DB
// translations are never silently hidden.
// ============================================================================
export const LAUNCH_LANGS = ['en', 'es', 'fr', 'pt', 'de', 'ar', 'zh', 'hi'] as const;
export type LaunchLang = typeof LAUNCH_LANGS[number];

type Translatable = { translations?: Record<string, Record<string, string>> } & Record<string, any>;

// ── Missing-translation audit registry (runtime, dev-visible) ────────────────
export interface MissingTranslation { id: string; entity: string; lang: string; field: string; }
const _missing = new Map<string, MissingTranslation>();
export function reportMissing(entity: string, id: string, lang: string, field: string) {
  const k = `${entity}:${id}:${lang}:${field}`;
  if (_missing.has(k)) return;
  _missing.set(k, { id, entity, lang, field });
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) {
    console.warn(`[i18n-data] missing ${lang} ${field} for ${entity} ${id} → fell back to English`);
  }
}
export function getMissingTranslations(): MissingTranslation[] { return [...(_missing.values())]; }
/** Expose on window in dev for quick inspection: window.__i18nMissing() */
if (typeof window !== 'undefined') (window as any).__i18nMissing = getMissingTranslations;

// ── Core resolver ────────────────────────────────────────────────────────────
export function getLocalizedField(item: Translatable | null | undefined, language: string, field: string, entity = 'course'): string {
  if (!item) return '';
  const tr = item.translations || {};
  const direct = tr?.[language]?.[field];
  if (direct != null && String(direct).trim() !== '') return direct;
  // requested a non-English language but it's absent → record the gap
  if (language && language !== 'en') reportMissing(entity, item.id ?? '?', language, field);
  const en = tr?.en?.[field];
  if (en != null && String(en).trim() !== '') return en;
  return item[field] ?? '';
}

export function getLocalizedCourse<T extends Translatable>(course: T, language: string): T {
  if (!course) return course;
  return {
    ...course,
    title: getLocalizedField(course, language, 'title', 'course'),
    description: getLocalizedField(course, language, 'description', 'course'),
  };
}
export const getLocalizedProgram = getLocalizedCourse;

// ── Static audit helper (used by npm run audit:i18n-data with live rows) ─────
export function auditCourseTranslations(rows: Translatable[], langs: readonly string[] = LAUNCH_LANGS) {
  const report: { id: string; title: string; missing: Record<string, { title: boolean; description: boolean }> }[] = [];
  for (const c of rows) {
    const missing: Record<string, { title: boolean; description: boolean }> = {};
    for (const l of langs) {
      if (l === 'en') continue;
      const t = c.translations?.[l]?.title?.trim();
      const d = c.translations?.[l]?.description?.trim();
      if (!t || !d) missing[l] = { title: !t, description: !d };
    }
    if (Object.keys(missing).length) report.push({ id: c.id, title: c.title, missing });
  }
  return report;
}
