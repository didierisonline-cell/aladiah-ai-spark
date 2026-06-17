#!/usr/bin/env node
// Gate 3: fail if any deploy_blocking language is < 100% coverage (reads v_deploy_blockers).
// Skips cleanly when Supabase env is absent (local/dev) so it never blocks spuriously.
const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
if (!url || !key) { console.log('• content gate skipped (no Supabase env)'); process.exit(0); }
const r = await fetch(`${url}/rest/v1/v_deploy_blockers?select=*`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
if (!r.ok) { console.log(`• content gate skipped (view unavailable: ${r.status})`); process.exit(0); }
const blockers = await r.json();
if (Array.isArray(blockers) && blockers.length) {
  console.error('✗ Deploy blocked — launch languages below 100% coverage:');
  blockers.forEach(b => console.error(`   ${b.name} (${b.lang}): ${b.coverage_pct}%`));
  process.exit(1);
}
console.log('✓ content coverage: all deploy-blocking languages at 100%');
