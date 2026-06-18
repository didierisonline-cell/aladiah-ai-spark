// =============================================================================
// Shared user display-name + initials — one consistent rule for every avatar,
// greeting and profile chip across the portal.
//
// Identity rule (launch / Priority Zero):
//   1. Use the user's real name: profiles.full_name first, then
//      auth user_metadata.full_name (see resolveName + the useIdentity hook).
//   2. The email prefix is a LAST RESORT — used only when no real name exists.
//   3. Greetings show the FIRST NAME only (firstNameFromEmail).
//   4. Initials come from the REAL name: 2+ words → first letters of the first
//      two words; a single word → its first letter ("Test2Real" → "T",
//      "Didier Mbok" → "DM"). Never derived from the email when a name exists.
// =============================================================================

/** Real display name (full), or the email prefix only when no name is available. */
export function displayNameFromEmail(email?: string | null, fullName?: string | null): string {
  if (fullName && fullName.trim()) return fullName.trim();
  return email?.split('@')[0] || 'Student';
}

/** Resolve the real name: profiles.full_name first, then auth metadata. null if neither. */
export function resolveName(profileFullName?: string | null, metaFullName?: string | null): string | null {
  const p = profileFullName?.trim();
  if (p) return p;
  const m = metaFullName?.trim();
  if (m) return m;
  return null;
}

/** First name only, for greetings. Email prefix only when no name exists. */
export function firstNameFromEmail(email?: string | null, fullName?: string | null): string {
  return displayNameFromEmail(email, fullName).split(/\s+/)[0];
}

/** Initials from the real name (2+ words → first two initials; 1 word → its first
 *  letter). The email prefix is used only when no name exists. */
export function initialsFromEmail(email?: string | null, fullName?: string | null): string {
  const base = displayNameFromEmail(email, fullName);
  const parts = base.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0]?.[0] || 'A').toUpperCase();
}
