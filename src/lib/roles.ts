// =============================================================================
// Role middleware — the single source of truth for who is a founder vs student.
// Priority #1: Founder vs Student separation.
//   - didier@aladiahacademy.com  → role 'founder'  (primary / intended)
//   - didierisonline@gmail.com   → role 'founder'  (the active Supabase Auth
//                                   account during the email transition)
//   - didiermbok@yahoo.com       → role 'founder'  (legacy — temporary, remove
//                                   after the cutover is confirmed stable)
//   - every other signed-in user → role 'student'
// Routing homes: founder → /founder, student → /portal.
// =============================================================================
export type Role = 'founder' | 'student';

/** Emails that are automatically granted the founder role. */
export const FOUNDER_EMAILS = ['didier@aladiahacademy.com', 'didierisonline@gmail.com', 'didiermbok@yahoo.com'];

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
