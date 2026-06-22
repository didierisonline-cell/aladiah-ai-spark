import { CheckCircle2, HelpCircle, XCircle, ShieldCheck } from 'lucide-react';

// =============================================================================
// LAUNCH TRUTH — founder dashboard card.
// Doctrine (founder-ratified): every finding is classified into EXACTLY ONE of
// three buckets. There is NO fourth category — the union type enforces it. And
// no item may exist without `evidence` (no blocker without evidence; no "proven"
// without proof). Update this manifest as the founder walk produces evidence.
// =============================================================================

type Bucket = 'proven' | 'hypothesis' | 'broken';

interface TruthItem {
  label: string;
  bucket: Bucket;
  /** Required. The proof for "proven", or what would settle a "hypothesis". */
  evidence: string;
}

// Current honest state. "Proven" = verified with evidence already in hand.
// "Hypothesis" = not yet walked on the live system (see FOUNDER_VALIDATION_RUNBOOK).
// "Broken" = we have evidence it fails.
const TRUTH: TruthItem[] = [
  // ✅ Proven Working
  { label: 'SEC-001 webhook signature mandatory', bucket: 'proven', evidence: 'Code fail-closed; PR #79 CI green (Vercel success).' },
  { label: 'SEC-002 server-side entitlement', bucket: 'proven', evidence: 'tier derived from Stripe price map; unknown price rejected (PR #79).' },
  { label: 'FR / ES translation coverage', bucket: 'proven', evidence: 'npm i18n:audit → missing:0 for FR and ES.' },
  { label: 'Frontend build', bucket: 'proven', evidence: 'vite build passes (esbuild).' },

  // ⚠️ Hypothesis (needs the founder walk to prove)
  { label: 'Payment → subscription (live Stripe)', bucket: 'hypothesis', evidence: 'Not yet walked live with real price IDs + webhook secret set.' },
  { label: 'Enroll → lesson → quiz → pass → progress', bucket: 'hypothesis', evidence: 'BA flagship not yet walked on the live DB (migrations apply by hand).' },
  { label: 'Capstone submission flow', bucket: 'hypothesis', evidence: 'UI built; not exercised against live capstone_submissions.' },
  { label: 'Founder approval → certificate issuance', bucket: 'hypothesis', evidence: 'issue_course_certificate gated on approval; not yet run live.' },
  { label: 'Completion gate (14 exams + capstone)', bucket: 'hypothesis', evidence: 'course_completion_status logic unverified on real attempts.' },

  // ❌ Confirmed Broken — only with evidence of failure.
  // (none confirmed yet)
];

const COLS: { bucket: Bucket; title: string; icon: typeof CheckCircle2; accent: string; ring: string }[] = [
  { bucket: 'proven', title: 'Proven Working', icon: CheckCircle2, accent: '#22c55e', ring: 'border-green-500/30' },
  { bucket: 'hypothesis', title: 'Hypothesis', icon: HelpCircle, accent: '#f59e0b', ring: 'border-amber-500/30' },
  { bucket: 'broken', title: 'Confirmed Broken', icon: XCircle, accent: '#ef4444', ring: 'border-red-500/30' },
];

const LaunchTruthCard = () => (
  <div className="rounded-2xl border border-border bg-card p-5 mb-8">
    <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" /> LAUNCH TRUTH
        </h2>
        <p className="text-sm text-muted-foreground">
          Three buckets. No fourth category. No claim without evidence.
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COLS.map(({ bucket, title, icon: Icon, accent, ring }) => {
        const items = TRUTH.filter((t) => t.bucket === bucket);
        return (
          <div key={bucket} className={`rounded-xl border ${ring} bg-background/40 p-4`}>
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-4 h-4" style={{ color: accent }} />
              <span className="font-bold text-foreground text-sm">{title}</span>
              <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${accent}1a`, color: accent }}>{items.length}</span>
            </div>
            {items.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">None.</p>
            ) : (
              <ul className="space-y-2.5">
                {items.map((t) => (
                  <li key={t.label}>
                    <div className="text-sm font-semibold text-foreground leading-snug">{t.label}</div>
                    <div className="text-xs text-muted-foreground leading-snug mt-0.5">{t.evidence}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default LaunchTruthCard;
