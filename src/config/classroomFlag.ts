/**
 * Official Aladiah Classroom rollout flag (ALL COURSES — Founder-approved).
 *
 * The premium "Professor Didier™ Live" classroom is the lesson experience for
 * EVERY course while VITE_OFFICIAL_CLASSROOM is not "false". This changes
 * PRESENTATION only — all data / gate / ElevenLabs voice / quiz / progress /
 * Stripe logic is unchanged and the legacy player stays intact as an instant
 * fallback.
 *
 * Kill switch: set VITE_OFFICIAL_CLASSROOM="false" to disable the classroom
 * everywhere (instant return to the legacy player, no redeploy of code needed).
 *
 * Rollback to pilot mode: restore the allowlist check in
 * isOfficialClassroomCourse (see OFFICIAL_CLASSROOM_COURSE_IDS below, kept for
 * that purpose).
 */
export const OFFICIAL_CLASSROOM =
  (import.meta.env.VITE_OFFICIAL_CLASSROOM ?? "true").toString() !== "false";

/** Former pilot allowlist — retained only for a quick rollback to pilot scope. */
export const OFFICIAL_CLASSROOM_COURSE_IDS = new Set<string>([
  "f46d8fc2-50e4-4bd8-91da-f8bac4f7ba14", // AI Scrum Master Professional Certification v2
]);

/** True for every course while the classroom flag is on (Founder: all courses). */
export const isOfficialClassroomCourse = (courseId?: string | null): boolean =>
  OFFICIAL_CLASSROOM && !!courseId;
