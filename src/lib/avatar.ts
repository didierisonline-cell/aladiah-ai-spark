// =============================================================================
// Shared user display-name + initials — one consistent rule for every avatar/
// profile chip across the portal (sidebar, profile, talent score, settings…).
// Previously each page computed initials differently (name-part vs raw email
// slice), so the same user could show different initials on different screens.
// =============================================================================

export function displayNameFromEmail(email?: string | null, fullName?: string | null): string {
  if (fullName && fullName.trim()) return fullName.trim();
  return email?.split('@')[0] || 'Student';
}

export function initialsFromEmail(email?: string | null, fullName?: string | null): string {
  const base = displayNameFromEmail(email, fullName);
  const parts = base.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return ((base[0] || 'A') + (base[1] || '')).toUpperCase();
}
