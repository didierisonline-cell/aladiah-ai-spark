/**
 * Official Aladiah Classroom rollout flag.
 *
 * ON (default) → the approved premium classroom is the student lesson experience
 * for every lesson route (`/course/:courseId/chapter/:chapterId`).
 * Set VITE_OFFICIAL_CLASSROOM="false" to instantly fall back to the legacy
 * ChapterView player (kept intact as a safety fallback until QA sign-off).
 *
 * This is the single switch for the route-swap; it changes PRESENTATION only.
 * All data / gate / ElevenLabs voice / quiz / progress logic is unchanged.
 */
export const OFFICIAL_CLASSROOM =
  (import.meta.env.VITE_OFFICIAL_CLASSROOM ?? "true").toString() !== "false";
