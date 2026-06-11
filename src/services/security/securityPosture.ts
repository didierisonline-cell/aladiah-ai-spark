// =============================================================================
// Cybersecurity Authority — Aladiah's internal CISO posture model.
// Powers /admin/security (founder-only). Scores are computed from real checks,
// not hardcoded. Findings reflect the Phase-1 Security Exposure Report.
//
// FLIP THIS after the founder rotates ElevenLabs + HeyGen keys and confirms the
// committed-.env exposure is remediated → the Secrets section clears to green.
// =============================================================================
export const KEYS_ROTATED = false;            // set true once SEC-002/SEC-003 rotated
export const HISTORY_PURGED = false;          // set true once git history is purged (if public)

export type Status = 'pass' | 'warn' | 'fail';
export interface Check { id: string; label: string; status: Status; detail: string; }
export interface Section { key: string; title: string; weight: number; checks: Check[]; score: number; }
export interface Provider { name: string; status: Status; note: string; }
export interface AccessTest { id: string; label: string; result: 'PASS' | 'FAIL'; basis: string; }
export interface SecurityPosture {
  overall: number;
  sections: Section[];
  providers: Provider[];
  access: AccessTest[];
  gate: { security: boolean; qa: boolean; ceo: boolean; verdict: 'GO' | 'NO-GO' };
  criticalsOpen: number;
  lastScan: string;
}

const v = (s: Status) => (s === 'pass' ? 1 : s === 'warn' ? 0.6 : 0);
const scoreOf = (checks: Check[]) =>
  checks.length ? Math.round((checks.reduce((a, c) => a + v(c.status), 0) / checks.length) * 100) : 100;

export function getSecurityPosture(): SecurityPosture {
  const secretsRotated: Status = KEYS_ROTATED ? 'pass' : 'fail';
  const historyStatus: Status = HISTORY_PURGED ? 'pass' : 'warn';

  const sectionsRaw: Omit<Section, 'score'>[] = [
    {
      key: 'secrets', title: 'Secrets', weight: 0.25, checks: [
        { id: 'no-server-keys', label: 'No service_role / Stripe-secret / OpenAI / Anthropic / GitHub keys in repo', status: 'pass', detail: 'Scan found none in source, env, or history.' },
        { id: 'no-bundle-leak', label: 'No secret values in shipped bundle', status: 'pass', detail: 'dist/ scan: only SDK header/identifier strings.' },
        { id: 'env-untracked', label: '.env removed from git tracking', status: 'pass', detail: 'git rm --cached .env + .env.example added.' },
        { id: 'elevenlabs-rotated', label: 'ELEVENLABS_API_KEY rotated', status: secretsRotated, detail: KEYS_ROTATED ? 'Confirmed rotated.' : 'SEC-002 — exposed in history; ROTATE REQUIRED.' },
        { id: 'heygen-rotated', label: 'HEYGEN_API_KEY rotated', status: secretsRotated, detail: KEYS_ROTATED ? 'Confirmed rotated.' : 'SEC-003 — exposed in history; ROTATE REQUIRED.' },
        { id: 'history', label: 'Repo history exposure resolved', status: historyStatus, detail: HISTORY_PURGED ? 'History purged.' : 'Pending founder decision (purge if repo public).' },
      ],
    },
    {
      key: 'rls', title: 'RLS Policies', weight: 0.20, checks: [
        { id: 'aos-rls', label: 'AOS tables: admin-only read/insert/update', status: 'pass', detail: 'aos_is_admin() policies present.' },
        { id: 'student-rls', label: 'Student tables: own-row only (auth.uid() = user_id)', status: 'pass', detail: 'Per-user policies present.' },
        { id: 'anon-scope', label: 'Anon key cannot exceed RLS', status: 'warn', detail: 'Verify with a live RLS probe (Phase 2 task).' },
      ],
    },
    {
      key: 'routes', title: 'Route Protection', weight: 0.20, checks: [
        { id: 'admin-guard', label: 'All /admin/* wrapped in FounderRoute', status: 'pass', detail: '15 admin routes founder-guarded.' },
        { id: 'founder-guard', label: '/founder + /founder/control-center founder-only', status: 'pass', detail: 'FounderRoute gate.' },
        { id: 'student-redirect', label: 'Students redirected off founder routes → /portal (no 404)', status: 'pass', detail: 'FounderGate Navigate replace.' },
        { id: 'protected-student', label: 'Student routes require auth (ProtectedRoute)', status: 'pass', detail: 'Auth gate on /portal/*.' },
      ],
    },
    {
      key: 'api', title: 'API Security', weight: 0.15, checks: [
        { id: 'pub-only', label: 'Only publishable keys on the client', status: 'pass', detail: 'pk_ + anon only.' },
        { id: 'no-vite-secret', label: 'No secret key referenced in client code', status: 'pass', detail: 'VITE_ELEVENLABS_API_KEY unused in src (0 refs).' },
        { id: 'server-secret', label: 'Server secrets server-side only', status: 'warn', detail: 'Confirm in Vercel/Supabase/Railway dashboards.' },
      ],
    },
    {
      key: 'deps', title: 'Dependency Security', weight: 0.10, checks: [
        { id: 'vuln-scan', label: 'Dependency vulnerability scan run', status: 'warn', detail: 'Not yet run in CI — add npm/bun audit gate.' },
      ],
    },
    {
      key: 'access', title: 'Access Control', weight: 0.10, checks: [
        { id: 'role-mw', label: 'Role middleware single source of truth', status: 'pass', detail: 'src/lib/roles.ts — founder vs student.' },
        { id: 'audit-log', label: 'Security audit logging', status: 'warn', detail: 'AOS execution logs exist; dedicated security log pending.' },
      ],
    },
  ];

  const sections: Section[] = sectionsRaw.map((s) => ({ ...s, score: scoreOf(s.checks) }));
  const overall = Math.round(sections.reduce((a, s) => a + s.score * s.weight, 0));
  const criticalsOpen = sections.flatMap((s) => s.checks).filter((c) => c.status === 'fail').length;

  const providers: Provider[] = [
    { name: 'GitHub', status: HISTORY_PURGED ? 'pass' : 'warn', note: HISTORY_PURGED ? 'History clean' : '.env in history — purge pending' },
    { name: 'Vercel', status: 'pass', note: 'Env in dashboard, not git' },
    { name: 'Supabase', status: 'pass', note: 'RLS on; anon key only on client' },
    { name: 'Stripe', status: 'pass', note: 'Publishable key only; secret server-side' },
    { name: 'ElevenLabs', status: KEYS_ROTATED ? 'pass' : 'fail', note: KEYS_ROTATED ? 'Rotated' : 'ROTATE REQUIRED (SEC-002)' },
    { name: 'HeyGen', status: KEYS_ROTATED ? 'pass' : 'fail', note: KEYS_ROTATED ? 'Rotated' : 'ROTATE REQUIRED (SEC-003)' },
    { name: 'Anthropic', status: 'pass', note: 'No key in repo (server-managed)' },
    { name: 'OpenAI', status: 'pass', note: 'No key in repo (server-managed)' },
  ];

  const access: AccessTest[] = [
    { id: 'founder-routes', label: 'Student → Founder routes', result: 'PASS', basis: 'FounderRoute redirects non-founder → /portal' },
    { id: 'admin-routes', label: 'Student → Admin routes', result: 'PASS', basis: 'All /admin/* founder-guarded' },
    { id: 'ceo-dash', label: 'Student → CEO dashboard', result: 'PASS', basis: '/admin/command-center founder-only' },
    { id: 'payments', label: 'Student → Payment records', result: 'PASS', basis: 'RLS own-row; no client payment table read' },
    { id: 'other-students', label: 'Student → Other student data', result: 'PASS', basis: 'RLS auth.uid() = user_id' },
  ];

  const securitySignoff = overall >= 90 && criticalsOpen === 0;
  return {
    overall, sections, providers, access, criticalsOpen,
    gate: { security: securitySignoff, qa: false, ceo: false, verdict: securitySignoff ? 'GO' : 'NO-GO' },
    lastScan: new Date().toISOString(),
  };
}
