// =============================================================================
// Deprecated course redirects — stale-link safety for the Scrum flagship cutover
// =============================================================================
// During the Scrum reconciliation the old 4-module seed courses were UNPUBLISHED
// (never deleted — their rows + student progress are preserved). Bookmarks,
// "continue" links, or old enrollments can still point a student at those
// unpublished IDs. Any such link should resolve to the published 18-module
// flagship instead of opening a dead/old course.
// =============================================================================

/** Published 18-module Scrum flagship (AI Scrum Master Professional Certification v2). */
export const FLAGSHIP_SCRUM_COURSE_ID = 'f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14';

/** Old/unpublished course id → its canonical published replacement. */
export const DEPRECATED_COURSE_REDIRECTS: Record<string, string> = {
  // old Scrum seeds (unpublished during flagship reconciliation)
  'fd26e0dd-3e07-4595-99f4-f304026dcd27': FLAGSHIP_SCRUM_COURSE_ID,
  'dddddddd-eeee-ffff-1111-222222222222': FLAGSHIP_SCRUM_COURSE_ID,
};

/** Resolve a course id to its published replacement if it is a known deprecated id. */
export function resolveCourseId(id?: string | null): string | null {
  if (!id) return null;
  return DEPRECATED_COURSE_REDIRECTS[id] ?? id;
}

/** True when this id is a known deprecated course that should not be opened directly. */
export function isDeprecatedCourseId(id?: string | null): boolean {
  return !!id && id in DEPRECATED_COURSE_REDIRECTS;
}
