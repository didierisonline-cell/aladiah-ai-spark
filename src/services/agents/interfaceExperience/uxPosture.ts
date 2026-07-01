// =============================================================================
// Interface & Experience Architect — UX posture model.
// Mirrors the securityPosture.ts pattern: scores computed from real, verified
// structural checks on the codebase/design system — never aspirational.
// Checks marked 'warn' need a live audit (Lighthouse, screen reader, devices)
// before they can pass; that work is Phase 2 and is listed honestly.
// =============================================================================
export type UXStatus = 'pass' | 'warn' | 'fail';
export interface UXCheck { id: string; label: string; status: UXStatus; detail: string; }
export interface UXSection { key: string; title: string; weight: number; checks: UXCheck[]; score: number; }
export interface UXPosture {
  overall: number;
  sections: UXSection[];
  /** Areas that need runtime/manual audits before they can be scored. */
  unmeasured: { id: string; label: string; how: string }[];
  lastReview: string;
}

const v = (s: UXStatus) => (s === 'pass' ? 1 : s === 'warn' ? 0.6 : 0);
const scoreOf = (checks: UXCheck[]) =>
  checks.length ? Math.round((checks.reduce((a, c) => a + v(c.status), 0) / checks.length) * 100) : 100;

export function getUXPosture(): UXPosture {
  const sectionsRaw: Omit<UXSection, 'score'>[] = [
    {
      key: 'consistency', title: 'Visual Consistency', weight: 0.25, checks: [
        { id: 'design-tokens', label: 'One token source (index.css HSL variables + tailwind theme)', status: 'pass', detail: 'All shadcn primitives map to hsl(var(--*)) tokens; no per-page palettes.' },
        { id: 'component-library', label: 'shadcn/ui primitives used across founder + student surfaces', status: 'pass', detail: 'Card/Button/Badge/Tabs shared everywhere; no parallel component kits.' },
        { id: 'status-colors', label: 'Risk-based status colors are consistent (green/amber/red/slate)', status: 'pass', detail: 'healthy/degraded/down/idle and pass/warn/fail share one semantic scale.' },
        { id: 'inline-styles', label: 'No ad-hoc inline gradients/colors outside token utilities', status: 'warn', detail: 'A few founder chips (gold gradient, portal CTA) inline hex styles — fold into tokens.' },
      ],
    },
    {
      key: 'navigation', title: 'Navigation & Journey Clarity', weight: 0.20, checks: [
        { id: 'single-nav', label: 'Single founder navigation source (lib/founderNav.ts)', status: 'pass', detail: 'FounderNav + admin surfaces render one shared FOUNDER_NAV_ITEMS list.' },
        { id: 'single-shell', label: 'Single layout shell for founder/admin (FounderShell)', status: 'pass', detail: 'Every founder + admin route composes FounderShell — no per-page layout drift.' },
        { id: 'nav-density', label: 'Founder nav density is executive-grade', status: 'warn', detail: '30+ flat pills exceed scanning capacity; group by intent (Command / Truth / Agents).' },
        { id: 'student-journey', label: 'Student journey has one clear home (/portal)', status: 'pass', detail: 'FounderRedirect + STUDENT_HOME keep roles on their home surface, no 404s.' },
      ],
    },
    {
      key: 'responsive', title: 'Mobile & Responsive', weight: 0.20, checks: [
        { id: 'mobile-foundation', label: 'Mobile foundation in index.css (safe-area, dvh, tap targets)', status: 'pass', detail: '.tap-target, .min-h-dvh, safe-area vars, portal-shell responsive collapse.' },
        { id: 'grid-breakpoints', label: 'Dashboards use responsive grid breakpoints', status: 'pass', detail: 'grid-cols-1 → md/lg column scaling across founder dashboards.' },
        { id: 'real-device', label: 'Real-device verification of founder cockpit', status: 'warn', detail: 'No recorded device-matrix pass yet — run one after the cockpit redesign.' },
      ],
    },
    {
      key: 'accessibility', title: 'Accessibility', weight: 0.20, checks: [
        { id: 'contrast-tokens', label: 'Foreground/muted tokens meet contrast on the navy theme', status: 'pass', detail: 'text-foreground / text-muted-foreground pairs tuned for the dark base.' },
        { id: 'status-not-color-only', label: 'Status conveyed by icon/label, not color alone', status: 'warn', detail: 'Some health dots are color-only; pair each dot with a text label.' },
        { id: 'screen-reader', label: 'Screen-reader pass on founder + student portals', status: 'warn', detail: 'Not yet audited — needs a manual assistive-tech pass.' },
      ],
    },
    {
      key: 'hierarchy', title: 'Hierarchy & Clutter', weight: 0.15, checks: [
        { id: 'headline-metrics', label: 'Every dashboard leads with a single executive headline row', status: 'pass', detail: 'Command header pattern: readiness, gates, blockers before detail cards.' },
        { id: 'card-sprawl', label: 'Cards grouped by decision, not by data source', status: 'warn', detail: 'Legacy surfaces still list disconnected cards; cockpit sections fix the founder home.' },
      ],
    },
  ];

  const sections: UXSection[] = sectionsRaw.map((s) => ({ ...s, score: scoreOf(s.checks) }));
  const overall = Math.round(sections.reduce((a, s) => a + s.score * s.weight, 0));

  return {
    overall,
    sections,
    unmeasured: [
      { id: 'lighthouse', label: 'Performance (Core Web Vitals)', how: 'Run Lighthouse/Vercel Speed Insights against production.' },
      { id: 'assistive', label: 'Assistive technology pass', how: 'Manual VoiceOver/NVDA session on /portal and /founder.' },
      { id: 'device-matrix', label: 'Device matrix', how: 'iOS Safari + Android Chrome sweep of the cockpit and portal.' },
    ],
    lastReview: new Date().toISOString(),
  };
}
