# translate-content — runbook

Batch AI-translation of course content into the platform's supported languages,
written into the `translations` JSONB on `courses` / `chapters` / `videos`.

It mirrors the existing edge-function conventions: Deno `serve`, Anthropic
(`claude-haiku-4-5-20251001`) via `ANTHROPIC_API_KEY`, Supabase service-role client.

## What it translates

| Row      | Fields translated                  | English source                                   |
|----------|------------------------------------|--------------------------------------------------|
| courses  | title, description                 | base `title` / `description` columns             |
| chapters | title, description                 | base `title` / `description` columns             |
| videos   | title, description, transcript     | base `title`/`description`; transcript from `translations.en.transcript` |

Targets are written to `translations[<lang>] = { title, description, transcript }`.

- **Idempotent** — a `(row, lang, field)` already present is skipped unless `overwrite: true`.
- **Resumable** — processes up to `limit` AI calls per call and returns `remainingWorkItems`. Re-invoke until it reaches 0.
- **Guarded** — refuses to run unless `x-admin-secret` matches the `TRANSLATE_ADMIN_SECRET` env.

## One-time setup

```bash
# from repo root, on your Mac
supabase functions deploy translate-content

# secrets (ANTHROPIC_API_KEY likely already set for generate-visuals; set the guard)
supabase secrets set TRANSLATE_ADMIN_SECRET="$(openssl rand -hex 24)"
# (note the value you set — you'll pass it as the x-admin-secret header)
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically into edge functions.

## Request body (all optional)

| Field      | Default                         | Meaning                                            |
|------------|---------------------------------|----------------------------------------------------|
| courseId   | (all courses)                   | translate a single course                          |
| chapterId  | —                               | with `target:"videos"`, pilot a single module      |
| languages  | `["es","zh","ar","fr","de","ja"]` | target language codes                            |
| target     | `"all"`                         | `videos` \| `chapters` \| `courses` \| `all`       |
| fields     | `["title","description","transcript"]` | subset of fields                            |
| overwrite  | `false`                         | re-translate even if already present               |
| limit      | `15`                            | max AI calls this invocation (batch size)          |
| dryRun     | `false`                         | report the work plan; no model calls, no writes    |

## Recommended rollout

### 1. Dry-run the pilot (Module 1 of AI-Powered Scrum Master)

Get the Module 1 chapter id first:

```sql
SELECT id, title, order_index FROM public.chapters
WHERE course_id = 'fd26e0dd-3e07-4595-99f4-f304026dcd27'
ORDER BY order_index;   -- Module 1 = order_index 0
```

```bash
PROJECT=vgujnkxylipfwmkpwzvb
SECRET=<the TRANSLATE_ADMIN_SECRET you set>
curl -s -X POST "https://$PROJECT.supabase.co/functions/v1/translate-content" \
  -H "Content-Type: application/json" -H "x-admin-secret: $SECRET" \
  -d '{"courseId":"fd26e0dd-3e07-4595-99f4-f304026dcd27","chapterId":"<MODULE1_CHAPTER_ID>","target":"videos","dryRun":true}'
```

Confirm `workItems` looks right (≈ videos × 6 languages).

### 2. Run the pilot for real, in batches

```bash
curl -s -X POST "https://$PROJECT.supabase.co/functions/v1/translate-content" \
  -H "Content-Type: application/json" -H "x-admin-secret: $SECRET" \
  -d '{"courseId":"fd26e0dd-3e07-4595-99f4-f304026dcd27","chapterId":"<MODULE1_CHAPTER_ID>","target":"videos","limit":12}'
```

Repeat until the response shows `"remainingWorkItems": 0`.

### 3. Verify the pilot (then open the lesson in French in the app)

```sql
SELECT order_index, title,
       translations->'fr'->>'title'                       AS fr_title,
       left(translations->'fr'->>'description', 80)        AS fr_desc,
       (translations->'fr'->>'transcript') IS NOT NULL     AS fr_has_transcript
FROM public.videos
WHERE chapter_id = '<MODULE1_CHAPTER_ID>'
ORDER BY order_index;
```

Open Module 1 lesson 1.1, switch to FR — the body and transcript should now render in French.

### 4. Scale out

- Whole course (all modules): drop `chapterId`, set `target:"all"` so chapter + course titles/descriptions translate too.
- Every course: drop `courseId`. Loop the same batch call until `remainingWorkItems` is 0.
- All 21 languages: pass the full `languages` array. (Start with the core 6; expand once verified.)

After each course, re-run the verify SELECT (scoped to that course) before moving on —
"success" from the function means it *ran*, not that the output is *correct*.

## Notes

- Cost scales with `(rows × languages × fields)` Anthropic calls — batch with `limit`
  and watch the dashboard. Transcripts are the largest payloads.
- Rollback for a bad batch: the writes only add language keys under `translations`;
  to revert a language, `UPDATE ... SET translations = translations - '<lang>'` scoped by id.
- This function never touches base `title`/`description` or the English content — it
  only adds/overwrites non-English keys inside `translations`.
