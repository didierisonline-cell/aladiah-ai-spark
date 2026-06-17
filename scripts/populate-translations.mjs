#!/usr/bin/env node
// Executes the full translation population, then prints the coverage report.
// Run:  SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/populate-translations.mjs
// Fills missing ES/FR/PT/DE/AR/ZH/HI title+description+transcript across courses/chapters/videos
// via the translate-content edge function (idempotent), then reports Total/Translated/Missing per language.
const URL = process.env.SUPABASE_URL, KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const LANGS = ['es','fr','pt','de','ar','zh','hi'];
const TABLES = ['courses','chapters','videos'];
if (!URL || !KEY) { console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env.'); process.exit(1); }
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

console.log('▶ Populating courses/chapters/videos for', LANGS.join('/'), '…');
const run = await fetch(`${URL}/functions/v1/translate-content`, {
  method: 'POST', headers: H,
  body: JSON.stringify({ target: 'all', languages: LANGS, fields: ['title','description','transcript'] }),
});
console.log('  translate-content:', run.status, (await run.text()).slice(0, 400));

console.log('\n▶ Coverage report (translated = translations[lang].title non-empty):');
for (const tbl of TABLES) {
  const r = await fetch(`${URL}/rest/v1/${tbl}?select=id,translations${tbl==='courses'?'&is_published=eq.true':''}`, { headers: H });
  if (!r.ok) { console.log(`  ${tbl}: query failed ${r.status}`); continue; }
  const rows = await r.json(); const total = rows.length;
  console.log(`\n  ${tbl.toUpperCase()} — total: ${total}`);
  for (const l of LANGS) {
    const done = rows.filter(x => x.translations?.[l]?.title?.trim()).length;
    console.log(`    ${l.toUpperCase()}  translated ${done}  missing ${total-done}  (${total?Math.round(100*done/total):0}%)`);
  }
}
