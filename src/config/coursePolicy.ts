/**
 * coursePolicy.ts — CODE-SIDE course status mapping for the MVP launch.
 *
 * Kept in code (not the database) so launch gating never mutates course rows.
 * The DB `is_published` flag stays as-is; this layer can force a published course
 * to behave as PREVIEW until the Founder explicitly promotes it.
 */

/** The four Founder-approved ACTIVE MVP programs (reference / documentation). */
export const ACTIVE_MVP_COURSE_IDS = new Set<string>([
  "f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14", // AI Scrum Master Professional Certification v2
  "c9177a56-37b8-479d-862f-8c2a3cf7624a", // AI Project Manager & Delivery Leader
  "1181ed06-dddc-4486-aedb-4308f3cb3a62", // AI Data Analyst & Decision Intelligence Professional
  "1d16d2c1-960c-4fa5-9afc-1aceae46912a", // AI Enterprise Cybersecurity, Governance & Digital Trust
]);

/**
 * Courses forced to PREVIEW regardless of DB `is_published`.
 * Business Analyst stays Preview until its verification gate passes
 * (updated_15=15, still_thin=0, still_untranslated=0, course_total=90 →
 * BA-only re-audit → Founder approval), then it can be removed from this set.
 * Do NOT unpublish or delete these rows in the DB — this is a code-side lock only.
 */
export const PREVIEW_ONLY_COURSE_IDS = new Set<string>([
  "8b36ab1f-9c99-45ea-abf8-1905cb5ebc7e", // AI Business Analyst & Product Discovery Specialist
]);

/** True if the course must be shown as Preview and must NOT open as a full active course. */
export const isPreviewOnlyCourse = (courseId?: string | null): boolean =>
  !!courseId && PREVIEW_ONLY_COURSE_IDS.has(courseId);

/** True if the course is one of the four approved active MVP programs. */
export const isActiveMvpCourse = (courseId?: string | null): boolean =>
  !!courseId && ACTIVE_MVP_COURSE_IDS.has(courseId);
