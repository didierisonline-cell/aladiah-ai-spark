// =============================================================================
// First-party signup attribution (Phase 1) — no vendor, no cookies, no GA.
// Captures UTM / ad-click / referral params from the landing URL into
// localStorage on FIRST touch, and replays them into auth.signUp metadata so the
// handle_new_user trigger can persist one signup_attribution row per user.
// =============================================================================

const KEY = 'aladiah_attribution';
const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'] as const;

type Attribution = Record<string, string>;

function read(): Attribution {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}
function write(a: Attribution) {
  try { localStorage.setItem(KEY, JSON.stringify(a)); } catch { /* ignore */ }
}

/** Capture attribution from the current URL — first touch only (never overwritten). */
export function captureFirstTouch(): void {
  try {
    if (Object.keys(read()).length) return; // first-touch wins
    const p = new URLSearchParams(window.location.search);
    const out: Attribution = {};
    for (const f of UTM) { const v = p.get(f); if (v) out[f] = v.slice(0, 200); }
    const ref = p.get('ref') || p.get('referral_code');
    if (ref) out.referral_code = ref.slice(0, 120);
    if (Object.keys(out).length === 0) return; // no signal → store nothing
    out.landing_page = (window.location.pathname + window.location.search).slice(0, 300);
    out.first_seen_at = new Date().toISOString();
    write(out);
  } catch { /* ignore */ }
}

/** Record a referral code as first-touch attribution (e.g. from /refer/:code). */
export function noteReferral(code?: string | null): void {
  try {
    if (!code) return;
    const cur = read();
    if (cur.referral_code || cur.utm_source) return; // first-touch wins
    write({ referral_code: code.slice(0, 120), landing_page: (window.location.pathname).slice(0, 300), first_seen_at: new Date().toISOString() });
  } catch { /* ignore */ }
}

/** Attribution payload to merge into auth.signUp({ options: { data } }). */
export function getAttribution(): Attribution {
  return read();
}
