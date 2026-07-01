// =============================================================================
// Aladiah Design System — Tokens
// Single source of truth for all visual primitives.
// Import this instead of defining a local DS object.
// =============================================================================

// ── Color ────────────────────────────────────────────────────────────────────

export const color = {
  // Surfaces
  bg:      '#0B111E',   // page background
  card:    '#111D30',   // card / panel surface
  card2:   '#142035',   // elevated card (one step lighter)
  surface: '#080E1A',   // sunken / thumbnail background
  muted:   '#18243A',   // muted input / inline surface
  // Borders
  border:  '#1E2D47',
  // Text
  fg:      '#EDF2F7',   // primary text
  fm:      '#8596AD',   // muted text
  fd:      '#4A5E7A',   // dim text
  // Accent — blue (primary)
  blue:       '#4A90F5',
  blueDim:    'rgba(74,144,245,.14)',
  blueBorder: 'rgba(74,144,245,.28)',
  // Accent — orange (warning / secondary CTA)
  orange:       '#F0622A',
  orangeDim:    'rgba(240,98,42,.14)',
  orangeBorder: 'rgba(240,98,42,.28)',
  // Accent — green (success)
  green:    '#22C98A',
  greenDim: 'rgba(34,201,138,.12)',
  // Accent — gold (premium / achievement)
  gold:       '#F5B81A',
  goldDim:    'rgba(245,184,26,.12)',
  goldBorder: 'rgba(245,184,26,.28)',
  // Accent — purple (governance / AI)
  purple:    '#9B59B6',
  purpleDim: 'rgba(155,89,182,.14)',
  // Accent — teal (future / learning)
  teal:    '#00B4D8',
  tealDim: 'rgba(0,180,216,.12)',
  // Semantic aliases
  primary:   '#4A90F5',
  danger:    '#EF4444',
  dangerDim: 'rgba(239,68,68,.12)',
} as const;

// ── Typography ───────────────────────────────────────────────────────────────

export const fontSize = {
  micro: 9,   // tiny watermarks, unit labels
  xs:    10,  // badges, micro-labels
  '2xs': 11,  // tags, status chips
  sm:    12,  // captions, helper text
  base:  13,  // body text (most common)
  md:    14,  // secondary body
  lg:    15,  // prominent body, sub-headers
  xl:    18,  // section headers
  '2xl': 22,  // card heroes
  '3xl': 28,  // page titles
  '4xl': 36,  // hero numbers
} as const;

export const fontWeight = {
  normal:  400,
  medium:  500,
  semibold: 600,
  bold:    700,
  heavy:   800,
  black:   900,
} as const;

export const lineHeight = {
  tight:  1.2,
  snug:   1.35,
  normal: 1.5,
  relaxed: 1.65,
  loose:  1.8,
} as const;

export const fontFamily = {
  sans: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
} as const;

// ── Spacing ──────────────────────────────────────────────────────────────────
// 4-point scale. Use these instead of raw pixel / rem values.

export const space = {
  0:   0,
  1:   4,
  2:   8,
  3:   12,
  4:   16,
  5:   20,
  6:   24,
  7:   28,
  8:   32,
  10:  40,
  12:  48,
  16:  64,
} as const;

// ── Border radius ────────────────────────────────────────────────────────────

export const radius = {
  xs:   3,    // tiny chips
  sm:   6,    // compact badges / inputs
  md:   8,    // tight cards, buttons
  lg:   10,   // medium cards
  xl:   12,   // default card radius
  '2xl': 14,  // large cards
  '3xl': 16,  // panels
  '4xl': 20,  // hero sections
  full: 9999, // pills, circles
} as const;

// ── Shadows / Depth ──────────────────────────────────────────────────────────

export const shadow = {
  sm:       '0 2px 8px rgba(0,0,0,.2)',
  md:       '0 4px 16px rgba(0,0,0,.3)',
  lg:       '0 8px 24px rgba(0,0,0,.35)',
  xl:       '0 12px 40px rgba(0,0,0,.45)',
  '2xl':    '0 24px 80px rgba(0,0,0,.7)',
  // Glow helpers — compose with color.blue etc.
  glowBlue:   '0 0 0 1px rgba(74,144,245,.35), 0 8px 24px rgba(0,0,0,.3)',
  glowOrange: '0 0 0 1px rgba(240,98,42,.35), 0 8px 24px rgba(0,0,0,.3)',
  glowGreen:  '0 0 0 1px rgba(34,201,138,.25), 0 8px 24px rgba(0,0,0,.3)',
} as const;

// ── Transition ───────────────────────────────────────────────────────────────

export const transition = {
  fast:   'all .12s ease',
  base:   'all .18s ease',
  slow:   'all .28s ease',
} as const;

// ── Z-index ──────────────────────────────────────────────────────────────────

export const zIndex = {
  base:    0,
  raised:  5,
  sidebar: 10,
  header:  20,
  modal:   100,
  overlay: 999,
  toast:   1000,
} as const;

// ── Shorthand re-export ───────────────────────────────────────────────────────
// Use `tokens.color.blue` or destructure `{ color, space } from '@/design-system/tokens'`

const tokens = { color, fontSize, fontWeight, lineHeight, fontFamily, space, radius, shadow, transition, zIndex } as const;
export default tokens;
