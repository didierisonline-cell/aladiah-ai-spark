/**
 * Official Aladiah Classroom rollout flag (PRODUCTION PILOT).
 *
 * The premium "Professor Didier™ Live" classroom replaces the legacy lesson player
 * ONLY for the piloted course(s) below, and only while VITE_OFFICIAL_CLASSROOM is not
 * "false". Everything else keeps the legacy ChapterView player. This changes
 * PRESENTATION only — all data / gate / ElevenLabs voice / quiz / progress / Stripe
 * logic is unchanged and the legacy player stays intact as an instant fallback.
 *
 * Kill switch: set VITE_OFFICIAL_CLASSROOM="false" to disable the classroom
 * everywhere (instant return to the legacy player, no redeploy of code needed).
 * Expand the pilot by adding course ids to OFFICIAL_CLASSROOM_COURSE_IDS.
 */
export const OFFICIAL_CLASSROOM =
  (import.meta.env.VITE_OFFICIAL_CLASSROOM ?? "true").toString() !== "false";

/** Pilot allowlist — the official classroom is enabled ONLY for these course ids. */
export const OFFICIAL_CLASSROOM_COURSE_IDS = new Set<string>([
  "f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14", // AI Scrum Master Professional Certification v2
]);

/** True only when the classroom is enabled AND this course is in the pilot allowlist. */
export const isOfficialClassroomCourse = (courseId?: string | null): boolean =>
  OFFICIAL_CLASSROOM && !!courseId && OFFICIAL_CLASSROOM_COURSE_IDS.has(courseId);
