# Database Migration Plan — Global Language Adaptation

> **PLAN ONLY.** Per repo canon, no SQL is auto-applied. This delivers reviewable,
> paste-ready blocks; a human applies them in Supabase (`vgujnkxylipfwmkpwzvb`) and then
> verifies each with a `SELECT`. Migrations follow the repo's timestamped convention in
> `supabase/migrations/` (e.g. `2026XXXX_global_language_tables.sql`).

## Scope

Six new **cross-language** tables (owned by this agent) + small, additive changes to existing
content tables so quizzes and diagrams can be translated. **No destructive changes.** All
new tables get RLS; student-facing tables are insert-by-owner, read/approve by founder/AI.

## Conventions

- `id uuid primary key default gen_random_uuid()`, `created_at timestamptz default now()`,
  `updated_at timestamptz default now()`.
- `language text` holds an ISO code (`'en'`,`'fr'`,`'bas'`, …).
- `review_state text check (review_state in ('unreviewed','ai-reviewed','human-reviewed','approved','rejected'))`.
- Enable RLS on every table.

## New tables (schemas in `../schemas/`)

1. **`language_translation_memory`** — reusable source→target segments (fallback + pre-fill).
2. **`language_vocabulary_entries`** — official approved lexicon per language. **Insert/serve
   only `approved`.**
3. **`language_student_submissions`** — raw student-captured language data. Enters
   `unreviewed`; never served until promoted.
4. **`language_review_queue`** — AI/human review work items gating the above.
5. **`language_quality_scores`** — per-(language, surface) coverage snapshots from the scanner.
6. **`language_missing_translations`** — specific gaps (scanner + runtime fallback logger).

### Paste-ready block (review before applying)

```sql
-- 2026XXXX_global_language_tables.sql  (REVIEW — human-applied)

create table if not exists public.language_translation_memory (
  id uuid primary key default gen_random_uuid(),
  source_language text not null,
  target_language text not null,
  source_text text not null,
  target_text text not null,
  surface text,
  translation_key text,
  context text,
  origin text not null default 'human' check (origin in ('human','ai','student-approved','import')),
  quality text not null default 'draft' check (quality in ('draft','reviewed','approved')),
  confidence numeric,
  usage_count integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.language_vocabulary_entries (
  id uuid primary key default gen_random_uuid(),
  language text not null,
  term text not null,
  term_normalized text,
  part_of_speech text,
  english_equivalent text,
  french_equivalent text,
  pronunciation text,
  domain text,
  context text,
  source_submission_id uuid,
  review_state text not null default 'unreviewed'
    check (review_state in ('unreviewed','ai-reviewed','human-reviewed','approved','rejected')),
  confidence numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.language_student_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  language text not null,
  submission_type text not null
    check (submission_type in ('typed','spoken','correction','tutor-interaction','new-word','phrase')),
  content text not null,
  pronunciation_note text,
  audio_url text,
  english_equivalent text,
  french_equivalent text,
  context jsonb,
  confidence numeric,
  review_state text not null default 'unreviewed'
    check (review_state in ('unreviewed','ai-reviewed','human-reviewed','approved','rejected')),
  ai_review_notes text,
  human_review_notes text,
  promoted_to_vocabulary_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.language_review_queue (
  id uuid primary key default gen_random_uuid(),
  target_table text not null
    check (target_table in ('language_student_submissions','language_translation_memory','language_vocabulary_entries')),
  target_id uuid not null,
  language text not null,
  stage text not null check (stage in ('ai-review','human-review')),
  status text not null default 'pending'
    check (status in ('pending','in-progress','approved','rejected','escalated')),
  priority integer not null default 3,
  assigned_to text,
  decision_notes text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.language_quality_scores (
  id uuid primary key default gen_random_uuid(),
  language text not null,
  surface text not null,
  total_strings integer,
  translated_strings integer,
  missing_strings integer,
  coverage_pct numeric not null,
  meets_activation_threshold boolean,
  scanner_version text,
  scanned_at timestamptz not null default now()
);

create table if not exists public.language_missing_translations (
  id uuid primary key default gen_random_uuid(),
  language text not null,
  surface text not null,
  translation_key text,
  content_ref text,
  source_text text,
  served_fallback_language text,
  source text not null check (source in ('scanner','runtime-fallback')),
  occurrences integer not null default 1,
  status text not null default 'open' check (status in ('open','queued','translated','wont-translate')),
  detected_at timestamptz not null default now(),
  last_seen_at timestamptz
);

-- De-dupe key for the runtime fallback logger (upsert + increment occurrences).
create unique index if not exists language_missing_translations_dedupe
  on public.language_missing_translations (language, surface, coalesce(translation_key,''), coalesce(content_ref,''));
```

### RLS (review — apply after tables exist)

```sql
alter table public.language_student_submissions enable row level security;
-- Students insert their own submissions:
create policy lss_insert_own on public.language_student_submissions
  for insert with check (auth.uid() = user_id);
-- Students read their own; founders read all (founder check via existing is_admin()/email RPC):
create policy lss_select_own on public.language_student_submissions
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

alter table public.language_vocabulary_entries enable row level security;
-- Everyone may read ONLY approved official vocabulary:
create policy lve_read_approved on public.language_vocabulary_entries
  for select using (review_state = 'approved');
-- (writes restricted to service role / founder via separate policies)

-- Repeat enable-RLS for the remaining tables with founder/service-role-only write policies.
```

## Additive changes to existing content tables (for quizzes & diagrams)

```sql
-- Quizzes are monolingual today. Add a translations JSON, mirroring courses/videos.
alter table public.quiz_questions add column if not exists translations jsonb;
-- Shape: { "<lang>": { "question_text": "...", "options": ["..."], "explanation": "..." } }

-- Diagram label sets (responsibility #8): store translatable labels out of the SVG.
create table if not exists public.diagram_label_sets (
  id uuid primary key default gen_random_uuid(),
  diagram_id text not null unique,
  title text,
  baseline_language text not null default 'en',
  render_strategy text not null default 'dynamic-svg-text'
    check (render_strategy in ('dynamic-svg-text','translated-asset','caption-overlay')),
  labels jsonb not null default '[]'::jsonb,
  localized_assets jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

> `quiz_questions.translations` is intentionally the **same pattern** already used by
> `courses`/`chapters`/`videos`, so the app's existing translation-lookup approach extends
> naturally rather than introducing a new mechanism.

## Apply & verify checklist (human)

- [ ] Review SQL; confirm no existing table/column is altered destructively.
- [ ] Apply new-tables block in Supabase SQL editor.
- [ ] Verify: `select table_name from information_schema.tables where table_name like 'language_%';` (expect 6).
- [ ] Apply RLS block; verify policies exist via `pg_policies`.
- [ ] Apply additive content-table changes; verify columns:
      `select column_name from information_schema.columns where table_name='quiz_questions' and column_name='translations';`
- [ ] Regenerate `src/integrations/supabase/types.ts` (Supabase type gen) so the app sees new tables.
- [ ] "Success / no rows" means it ran, not that it's correct — re-`SELECT` to confirm shape.
