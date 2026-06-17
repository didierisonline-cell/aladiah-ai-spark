#!/usr/bin/env node
// npm run audit:i18n-data — detects untranslated course/program DATA across the 7
// non-English launch languages. Queries Supabase if env present; otherwise prints
// the SQL to run by hand. NEVER silently passes.
const LANGS = ['es','fr','pt','de','ar','zh','hi'];
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.log('No Supabase env (SUPABASE_URL + key). Run docs/i18n/verify_course_translations.sql in Supabase instead.');
  process.exit(0);
}
const r = await fetch(`${url}/rest/v1/courses?select=id,title,translations&is_published=eq.true&order=title`,
  { headers: { apikey: key, Authorization: `Bearer ${key}` } });
if (!r.ok) { console.error('Query failed:', r.status, await r.text()); process.exit(1); }
const rows = await r.json();
let gaps = 0;
console.log(`Audited ${rows.length} published courses across ${LANGS.join('/')}\n`);
for (const c of rows) {
  const miss = [];
  for (const l of LANGS) {
    const t = c.translations?.[l]?.title?.trim();
    const d = c.translations?.[l]?.description?.trim();
    if (!t || !d) miss.push(`${l}${!t?'(title)':''}${!d?'(desc)':''}`);
  }
  if (miss.length) { gaps++; console.log(`❌ ${c.title} [${c.id}] → missing: ${miss.join(', ')}`); }
  else console.log(`✅ ${c.title}`);
}
const langCov = LANGS.map(l => {
  const ok = rows.filter(c => c.translations?.[l]?.title?.trim() && c.translations?.[l]?.description?.trim()).length;
  return `${l.toUpperCase()} ${Math.round(100*ok/(rows.length||1))}%`;
}).join(' · ');
console.log(`\nCoverage: ${langCov}`);
console.log(gaps ? `\n${gaps} course(s) have missing translations — populate courses.translations.` : '\nAll courses fully translated.');
process.exit(0);
