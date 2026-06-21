// =============================================================================
// Role middleware — the single source of truth for who is a founder vs student.
// Priority #1: Founder vs Student separation.
//   - didiermbok@yahoo.com       → role 'founder'  (original founder identity)
//   - didier@aladiahacademy.com  → role 'founder'  (primary / intended)
//   - didierisonline@gmail.com   → role 'founder'  (the active Supabase Auth
//                                   account during the email transition)
//   - every other signed-in user → role 'student'
// Routing homes: founder → /founder, student → /portal.
//
// ALIGNMENT: this list MUST match the founder set granted the 'admin' role in
// public.user_roles (migration 20260619050000_founder_admin_alignment.sql). All
// server-side security keys off user_roles.role = 'admin', so an email here that
// is not also granted admin would get founder UI but no DB powers, and vice
// versa. didiermbok@yahoo.com is intentionally retained as a founder/admin
// during launch readiness (the founder's original identity); tighten later if
// it is ever formally retired.
// =============================================================================
export type Role = 'founder' | 'student';

/** Emails that are automatically granted the founder role. Keep in lockstep
 *  with the aligned founder set in the founder_admin_alignment migration. */
export const FOUNDER_EMAILS = ['didiermbok@yahoo.com', 'didier@aladiahacademy.com', 'didierisonline@gmail.com'];

export const FOUNDER_HOME = '/founder';
export const STUDENT_HOME = '/portal';

/** Resolve a role purely from the account email (no DB lookup needed). */
export function roleForEmail(email?: string | null): Role {
  const e = (email || '').trim().toLowerCase();
  return FOUNDER_EMAILS.includes(e) ? 'founder' : 'student';
}

export const isFounderEmail = (email?: string | null): boolean =>
  roleForEmail(email) === 'founder';

/** Where a given role should land by default. */
export const homeForRole = (role: Role): string =>
  role === 'founder' ? FOUNDER_HOME : STUDENT_HOME;
