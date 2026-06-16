# Database Migration Plan

> Canon rule: production SQL is delivered as a **reviewable file + paste-ready
> block**; the human applies it by hand in Supabase. Claude Code does **not**
> auto-apply SQL. "Success / no rows" means the statement *ran*, not that it was
> *correct* — always follow a write with a verification `SELECT`.

## Deliverable

`supabase/migrations/20260616000000_language_adaptation.sql` (mirrored at
`../schemas/0001_language_adaptation.sql`). Additive, NON-DESTRUCTIVE,
idempotent — safe to re-run.

## Phase 1 (this change) — infrastructure tables

Eleven tables + one RPC. No existing table is altered.

**Shared language layer (6):**
`language_translation_memory`, `language_vocabulary_entries`,
`language_student_submissions`, `language_review_queue`,
`language_quality_scores`, `language_missing_translations`.

**Basaa extension (5):**
`basaa_dictionary_entries`, `basaa_sentence_pairs`, `basaa_tech_terms`,
`basaa_translation_memory`, `basaa_quality_reviews`.

**RPC:** `log_missing_translation(...)` — `SECURITY DEFINER`, dedupes on
`(language, string_key, surface)`, granted to `authenticated` so a student
session can record a gap with no direct table-write grant.

### Apply procedure

1. Read the migration file end-to-end.
2. Paste into the Supabase SQL editor for project `vgujnkxylipfwmkpwzvb`.
3. Run.
4. Run the four verification blocks at the bottom of the file:
   - 11 tables present,
   - RLS enabled on all 11,
   - `log_missing_translation` dedupes (miss_count increments),
   - non-admin session sees only `approved` vocabulary.

## Phase 2 — make content dimensions measurable (separate, reviewed change)

The scanner can score UI keys today. Lesson/quiz/diagram coverage needs the
content to carry language metadata. Two options per content type — pick per type:

| Content | Option A (preferred) | Option B |
|---|---|---|
| Lesson titles/body | per-language rows in a `lesson_translations` table keyed by `(lesson_id, language)` | JSONB `translations` column on the existing lesson row |
| Quiz questions/answers | per-language rows keyed by `(question_id, language)` | reuse `language_translation_memory` with `surface='quiz_question'` |
| Diagram labels | store labels as `language_translation_memory` rows (`surface='diagram_label'`) and render diagrams from data | translated SVG/image asset per language, referenced by metadata |

Each addition is its own reviewable migration. **Competency rule still applies:**
a translated quiz must preserve the question's single Axis-1 competency slug
(`/docs/standards/COMPETENCY_TAXONOMY.md`) — translation changes wording, never
the competency tag.

## Phase 3 — registry → dashboard load

A reviewed, founder-run loader (`scanner/loadToSupabase.ts`, roadmap) upserts:
- `coverage.json` → `language_quality_scores` (one row per language per scan date),
- `missing-translations.json` → `language_missing_translations`.

Never automatic; never from CI without approval.

## Rollback

All objects are additive. To roll back Phase 1, `DROP TABLE` the eleven tables
and `DROP FUNCTION public.log_missing_translation(...)`. No existing data is
touched, so rollback cannot lose pre-existing rows.
