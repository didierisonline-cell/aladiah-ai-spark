#!/usr/bin/env node
// =============================================================================
// Global Localization Director — Aladiah's localization OS engine
// =============================================================================
// One runnable agent that POPULATES, AUDITS, and VERIFIES translations across
// every DB content type, with per-language translation_status bookkeeping. This
// is the spine that lets Aladiah scale from 8 launch languages to 30+ (incl.
// African languages) without manual translation debt: add a language to LANGS
// (or pass --langs) and run.
//
// It does NOT touch React. Render code already reads translations[lang] with an
// English fallback; the Director's job is to FILL those slots and track state.
//
// Requires (canon: a human runs this with creds; Claude Code does not):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY
// Optional: LOC_MODEL (default claude-sonnet-4-6), LOC_LANGS, LOC_TABLES
//
// Commands:
//   node scripts/localization-director.mjs status            # status matrix (no API calls)
//   node scripts/localization-director.mjs audit             # coverage + leakage; exit 1 on gaps
//   node scripts/localization-director.mjs populate [opts]    # fill pending/missing slots
//   node scripts/localization-director.mjs verify [opts]      # back-translation QA → needs_review
// Options: --langs=es,fr  --tables=videos,courses  --limit=N  --dry-run  --sample=N (verify)
//
// Status values: complete | pending | needs_review. base_language ('en') = source.
// =============================================================================

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANTHROPIC = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.LOC_MODEL || 'claude-sonnet-4-6';

const ALL_LANGS = (process.env.LOC_LANGS || 'es,fr,pt,de,ar,zh,hi').split(',').map((s) => s.trim()).filter(Boolean);
const LANG_NAME = { en: 'English', es: 'Spanish', fr: 'French', pt: 'Portuguese', de: 'German', ar: 'Arabic', zh: 'Chinese (Simplified)', hi: 'Hindi' };

// Protected terms — kept verbatim in every language (see docs/i18n/PROTECTED_TERMS.md).
const PROTECTED = [
  'Aladiah Academy', 'Aladiah', 'Prof. Didier', 'Talent Score™', 'All-Access Pass™',
  'Scrum', 'Scrum Master', 'Sprint', 'Kanban', 'SAFe', 'Jira', 'DevOps', 'MLOps', 'UX',
  'GitHub', 'AWS', 'Google Cloud', 'Microsoft', 'PMI', 'Scrum.org', 'Stripe', 'ElevenLabs', 'LinkedIn',
];

// Per-table field maps. `array` fields are translated element-by-element.
const TABLES = {
  courses:        { select: 'id,title,description,translations,translation_status', fields: ['title', 'description'], publishedOnly: true },
  chapters:       { select: 'id,title,description,translations,translation_status', fields: ['title', 'description'] },
  videos:         { select: 'id,title,description,transcript,translations,translation_status', fields: ['title', 'description', 'transcript'] },
  quiz_questions: { select: 'id,question_text,options,explanation,translations,translation_status', fields: ['question_text', 'explanation'], arrayFields: ['options'] },
};

// ── CLI parse ────────────────────────────────────────────────────────────────
const [cmd, ...rest] = process.argv.slice(2);
const opt = Object.fromEntries(rest.filter((a) => a.startsWith('--')).map((a) => {
  const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true];
}));
const LANGS = opt.langs ? String(opt.langs).split(',') : ALL_LANGS;
const PICK_TABLES = opt.tables ? String(opt.tables).split(',') : Object.keys(TABLES);
const LIMIT = opt.limit ? parseInt(opt.limit, 10) : Infinity;
const DRY = !!opt['dry-run'];

function requireEnv(needAnthropic) {
  if (!URL || !KEY) { console.error('✗ Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY'); process.exit(2); }
  if (needAnthropic && !ANTHROPIC) { console.error('✗ Missing ANTHROPIC_API_KEY'); process.exit(2); }
}
const H = () => ({ apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' });

// ── Supabase REST helpers ─────────────────────────────────────────────────────
async function fetchRows(table) {
  const cfg = TABLES[table];
  let q = `${URL}/rest/v1/${table}?select=${encodeURIComponent(cfg.select)}`;
  if (cfg.publishedOnly) q += '&is_published=eq.true';
  const r = await fetch(q, { headers: H() });
  if (!r.ok) throw new Error(`${table} query ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}
async function patchRow(table, id, patch) {
  if (DRY) return { dry: true };
  const r = await fetch(`${URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH', headers: { ...H(), Prefer: 'return=minimal' }, body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error(`${table} patch ${id} ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return { ok: true };
}

// ── Anthropic translate ───────────────────────────────────────────────────────
async function translateFields(payload, lang) {
  const sys = `You are a professional localization translator for a paid AI-careers academy.
Translate the JSON values from English into ${LANG_NAME[lang] || lang}.
RULES:
- Preserve meaning exactly. Do not add, omit, or editorialize. This is paid certification content; invented facts cause real harm.
- Keep these terms VERBATIM (do not translate or transliterate): ${PROTECTED.join(', ')}.
- "AI" inside a role/title may localize to the language's accepted form (es/fr "IA", de "KI", ar "الذكاء الاصطناعي"); zh/hi keep "AI"/"एआई". Elsewhere keep technical accuracy.
- For quiz options: translate the option text only. NEVER add "A)" "B)" letter prefixes — the UI adds them.
- Preserve formatting/markdown/whitespace structure.
${lang === 'ar' ? '- Arabic output is right-to-left prose; keep protected Latin tokens as-is.' : ''}
Return ONLY a JSON object with the SAME keys as the input, values translated. No prose, no markdown fences.`;
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 4000, system: sys, messages: [{ role: 'user', content: JSON.stringify(payload) }] }),
  });
  if (!r.ok) throw new Error(`anthropic ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const d = await r.json();
  let t = (d.content?.[0]?.text || '{}').trim().replace(/^```[\w]*\n?/, '').replace(/```$/, '');
  return JSON.parse(t);
}

// ── Build the English source payload for one row ──────────────────────────────
function sourcePayload(table, row) {
  const cfg = TABLES[table];
  const p = {};
  for (const f of cfg.fields) if (row[f] != null && String(row[f]).trim()) p[f] = row[f];
  for (const af of cfg.arrayFields || []) {
    const arr = Array.isArray(row[af]) ? row[af] : [];
    arr.forEach((v, i) => { if (v != null && String(v).trim()) p[`${af}__${i}`] = v; });
  }
  return p;
}
// Fold a translated flat payload back into { field, arrayField:[...] } shape.
function foldTranslation(table, row, flat) {
  const cfg = TABLES[table];
  const out = {};
  for (const f of cfg.fields) if (flat[f] != null) out[f] = flat[f];
  for (const af of cfg.arrayFields || []) {
    const arr = Array.isArray(row[af]) ? row[af] : [];
    out[af] = arr.map((orig, i) => (flat[`${af}__${i}`] != null ? flat[`${af}__${i}`] : orig));
  }
  return out;
}
const isComplete = (row, lang) => (row.translation_status || {})[lang] === 'complete';

// ── Commands ───────────────────────────────────────────────────────────────────
async function cmdStatus() {
  requireEnv(false);
  for (const table of PICK_TABLES) {
    const rows = await fetchRows(table);
    console.log(`\n${table.toUpperCase()} — ${rows.length} rows`);
    for (const l of LANGS) {
      const st = rows.reduce((a, r) => { const v = (r.translation_status || {})[l] || 'missing'; a[v] = (a[v] || 0) + 1; return a; }, {});
      console.log(`  ${l.toUpperCase()}  complete:${st.complete || 0}  pending:${st.pending || 0}  needs_review:${st.needs_review || 0}  missing:${st.missing || 0}`);
    }
  }
}

async function cmdAudit() {
  requireEnv(false);
  let gaps = 0;
  for (const table of PICK_TABLES) {
    const rows = await fetchRows(table);
    const cfg = TABLES[table];
    console.log(`\n${table.toUpperCase()} — ${rows.length} rows · fields: ${[...cfg.fields, ...(cfg.arrayFields || [])].join(', ')}`);
    for (const l of LANGS) {
      let missing = 0, leak = 0;
      for (const r of rows) {
        const slot = (r.translations || {})[l];
        const filled = slot && cfg.fields.every((f) => !r[f] || (slot[f] && String(slot[f]).trim()));
        if (!filled) missing++;
        // leakage heuristic: slot value identical to English base = untranslated
        else if (cfg.fields.some((f) => slot[f] && r[f] && String(slot[f]).trim() === String(r[f]).trim())) leak++;
      }
      if (missing || leak) gaps++;
      console.log(`  ${l.toUpperCase()}  missing:${missing}  untranslated(==EN):${leak}  ok:${rows.length - missing - leak}`);
    }
  }
  console.log('');
  if (gaps) { console.error(`audit: ${gaps} table×language gaps remain → run "populate".`); process.exit(1); }
  console.log('audit: full coverage across selected tables/languages.');
}

async function cmdPopulate() {
  requireEnv(true);
  let done = 0, skipped = 0, failed = 0;
  for (const table of PICK_TABLES) {
    const rows = await fetchRows(table);
    for (const row of rows) {
      if (done >= LIMIT) break;
      const src = sourcePayload(table, row);
      if (!Object.keys(src).length) { skipped++; continue; }
      for (const lang of LANGS) {
        if (done >= LIMIT) break;
        if (isComplete(row, lang)) { skipped++; continue; }
        try {
          const flat = await translateFields(src, lang);
          const folded = foldTranslation(table, row, flat);
          const translations = { ...(row.translations || {}), [lang]: { ...((row.translations || {})[lang] || {}), ...folded } };
          const status = { ...(row.translation_status || {}), en: 'complete', [lang]: 'complete' };
          await patchRow(table, row.id, { translations, translation_status: status });
          row.translations = translations; row.translation_status = status; // keep local copy fresh
          done++;
          console.log(`  ✓ ${table} ${row.id} → ${lang}${DRY ? ' (dry)' : ''}`);
        } catch (e) {
          failed++;
          console.error(`  ✗ ${table} ${row.id} → ${lang}: ${e.message}`);
          // mark pending so a later run retries
          if (!DRY) await patchRow(table, row.id, { translation_status: { ...(row.translation_status || {}), [lang]: 'pending' } }).catch(() => {});
        }
      }
    }
  }
  console.log(`\npopulate: ${done} filled · ${skipped} skipped (complete/empty) · ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

async function cmdVerify() {
  requireEnv(true);
  const sample = opt.sample ? parseInt(opt.sample, 10) : 5;
  let flagged = 0, checked = 0;
  for (const table of PICK_TABLES) {
    const cfg = TABLES[table];
    const rows = (await fetchRows(table)).filter((r) => Object.keys(r.translations || {}).length).slice(0, sample);
    for (const row of rows) {
      for (const lang of LANGS) {
        const slot = (row.translations || {})[lang];
        if (!slot) continue;
        const field = cfg.fields.find((f) => slot[f] && String(slot[f]).trim());
        if (!field) continue;
        checked++;
        const sys = `You are a localization QA reviewer. Compare an English SOURCE with its ${LANG_NAME[lang]} TRANSLATION.
Return ONLY JSON: {"equivalent": <0-100>, "protected_ok": <true|false>, "note": "<short>"}.
"equivalent" = how fully the translation preserves the source meaning. "protected_ok" = whether protected brand/technical terms (${PROTECTED.slice(0, 8).join(', ')}…) are intact.`;
        try {
          const r = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01' },
            body: JSON.stringify({ model: MODEL, max_tokens: 300, system: sys, messages: [{ role: 'user', content: JSON.stringify({ source: row[field], translation: slot[field] }) }] }),
          });
          const d = await r.json();
          const v = JSON.parse((d.content?.[0]?.text || '{}').trim().replace(/^```[\w]*\n?/, '').replace(/```$/, ''));
          const bad = (v.equivalent ?? 0) < 85 || v.protected_ok === false;
          console.log(`  ${bad ? '⚠' : '✓'} ${table} ${row.id} ${lang} eq:${v.equivalent} prot:${v.protected_ok} ${bad ? '— ' + (v.note || '') : ''}`);
          if (bad) {
            flagged++;
            if (!DRY) await patchRow(table, row.id, { translation_status: { ...(row.translation_status || {}), [lang]: 'needs_review' } }).catch(() => {});
          }
        } catch (e) { console.error(`  ✗ verify ${table} ${row.id} ${lang}: ${e.message}`); }
      }
    }
  }
  console.log(`\nverify: ${checked} checked · ${flagged} flagged needs_review`);
}

const COMMANDS = { status: cmdStatus, audit: cmdAudit, populate: cmdPopulate, verify: cmdVerify };
(async () => {
  const fn = COMMANDS[cmd];
  if (!fn) {
    console.log('Global Localization Director\nUsage: localization-director.mjs <status|audit|populate|verify> [--langs=] [--tables=] [--limit=] [--sample=] [--dry-run]');
    process.exit(cmd ? 1 : 0);
  }
  try { await fn(); } catch (e) { console.error('director error:', e.message); process.exit(1); }
})();
