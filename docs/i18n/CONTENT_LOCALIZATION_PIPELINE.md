# Aladiah — Content Localization Pipeline (Translation Phase 2)

Moves **structured content** (simulations, certifications, career paths, mentor
responses, resources, portfolio projects, interview simulations, capstones) out of
code and into a translatable, governed store for all 8 launch languages
(EN/ES/FR/PT/DE/AR/ZH/HI). Phase 1 (UI chrome dictionary) stays as-is.

Reviewable artifacts:
- `supabase/migrations/20260618000000_content_localization_pipeline.sql` (apply by hand)
- `scripts/i18n-guard.mjs` (CI gate)
- `docs/i18n/translation_coverage_audit.sql`, `translation_registry.csv`

## 1. Architecture (fits the existing codebase)

```
EN source content ──▶ content_i18n (entity_type, entity_id, field, lang, value, status, source_hash)
        │                     │  AFTER INSERT/UPDATE(en)
        │                     ▼
        │             translation_jobs (queued per target lang, deduped by source_hash)
        │                     │  worker = supabase/functions/translate-content (idempotent)
        │                     ▼
        │             machine ▶ in_review ▶ published   (QA state machine)
        ▼
  Read path = get_content(type,id,field,lang):
     • student  → published target-lang ONLY (NULL if absent → UI shows localized placeholder)
     • founder  → English fallback allowed (for authoring/QA)
```

**Architecture rules satisfied**
- *No student-facing text in code* → content lives in `content_i18n` rows; components read via RPC.
- *Translatable structure* → one row per (entity, field, lang) with status + staleness hash.
- *New content auto-generates jobs* → `trg_enqueue_translation` on EN insert/update.
- *Missing translations trigger alerts* → `v_missing_translations` view feeds an alert (cron/edge → founder dashboard / email).
- *English fallback only for founder* → `get_content()` returns EN only when `is_founder()`; student RLS exposes `status='published'` rows and the RPC yields NULL for missing target langs.
- *Students never see fallback English* → UI renders a localized "content coming soon" placeholder (dictionary key) when RPC returns NULL.

## 2. Database schema
See the migration. Core: `i18n_languages` (8), `content_i18n` (canonical store, unique on
type+id+field+lang), `translation_jobs` (queue), `enqueue_translation_jobs()` trigger,
`get_content()` RPC (role-aware fallback), RLS (student=published-only / founder=all),
and `v_translation_coverage` / `v_missing_translations` views.

## 3. Migration strategy (no big-bang; per-entity, reversible)
**Stage A — schema:** apply the migration (creates tables/trigger/RPC/views). No content moves yet.
**Stage B — backfill per entity_type** (one PR each; build green after each):
  1. `simulations` — import `src/data/simulations.ts` → EN rows in `content_i18n` (script emits reviewable INSERTs). Trigger auto-queues 7 langs.
  2. `interview`, `certification`, `career_path`, `mentor_template`, `resource`, `portfolio_project`, `capstone` — same pattern.
  3. `course/chapter/video` — migrate existing `*.translations` JSONB into `content_i18n` (or keep JSONB and treat as bucket-A; the RPC can union both during transition).
**Stage C — run pipeline:** `translate-content` drains `translation_jobs` → `machine` rows.
**Stage D — QA → publish** (Section 5).
**Stage E — flip reads:** refactor each component to call `get_content()` instead of importing code data; delete the code data file once 100% published. Until then, code import remains the founder-only fallback.

## 4. Translation pipeline (job lifecycle)
`queued → running → done(machine) → in_review → published` (or `failed`/`needs_review`).
- Worker: `translate-content` edge function (already idempotent, writes per (row,lang,field)).
- Protected terms (D-bucket) injected as a do-not-translate glossary in the MT prompt.
- `source_hash` = md5(EN). If EN changes, published targets flip to `stale` and re-queue.

## 5. QA validation process
Automated gates before `published`:
- **Completeness:** title+description (+ entity-required fields) present & non-empty.
- **Integrity:** ICU/placeholder & markdown parity vs EN; no dropped `{vars}`.
- **Protected-term preservation:** every D-bucket term still present verbatim.
- **Length sanity:** flag >40% over/under EN (UI overflow risk; DE/AR watch).
- **RTL:** Arabic rows flagged for manual layout spot-check.
Human review required for AR + ZH (`in_review → published` is founder-gated).

## 6. CI/CD enforcement
- **Gate 1 (live):** `node scripts/i18n-guard.mjs` — fails build if any dictionary key lacks all 8 languages. Wire into the build workflow + pre-merge.
- **Gate 2:** scanner fails PR if a watched **student route** imports a raw content data file (`@/data/simulations`, interview/career arrays) or contains a hardcoded JSX literal (extend the audit scanner used in this engagement).
- **Gate 3 (content):** CI queries `v_missing_translations`; **block launch** of an entity_type if its published target-lang coverage < 100% for ES/FR/PT/AR/ZH (warn for others). Founder override flag for staged rollout.
- **Registry:** regenerate `translation_registry.csv` in CI; PRs must update `status`.

## 7. Honest constraints
- Migration SQL is **reviewable, not applied** (canon). Backfill INSERTs and the read-path
  refactor are per-entity PRs — a multi-batch program, not one commit.
- Actual translation *quality* for AR/ZH needs human review; MT fills the queue, QA gates publish.
- Bucket-A (course JSONB) coverage is still only knowable by running the audit SQL against live Supabase.
