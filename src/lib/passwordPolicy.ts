// =============================================================================
// Password policy — single source of truth for password strength rules.
// Used by the reset-password screen (enforced) and the auth password tooltip.
//   - minimum 12 characters
//   - at least 1 uppercase, 1 lowercase, 1 number, 1 special character
// =============================================================================
export interface PasswordRule {
  key: string;
  label: string;
  test: (value: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { key: 'length', label: 'At least 12 characters', test: (v) => v.length >= 12 },
  { key: 'upper', label: 'One uppercase letter (A–Z)', test: (v) => /[A-Z]/.test(v) },
  { key: 'lower', label: 'One lowercase letter (a–z)', test: (v) => /[a-z]/.test(v) },
  { key: 'number', label: 'One number (0–9)', test: (v) => /[0-9]/.test(v) },
  { key: 'special', label: 'One special character (!@#$…)', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

/** Rules a password fails (empty array = valid). */
export const failedRules = (value: string): PasswordRule[] =>
  PASSWORD_RULES.filter((r) => !r.test(value));

export const isPasswordValid = (value: string): boolean => failedRules(value).length === 0;
