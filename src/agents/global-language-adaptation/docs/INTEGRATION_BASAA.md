# Integration Points — Basaa Agent ↔ Global Language Adaptation Agent

How the two agents connect (Core responsibility #5).

## Direction of data

```
Basaa learner ──capture──▶ Basaa Agent (captureBasaaInput)
                                  │ writes
                                  ▼
                  language_student_submissions (language='bas')
                                  │ review pipeline (AI → human)
                                  ▼ on approve, promote
   basaa_dictionary_entries / basaa_sentence_pairs / basaa_tech_terms / basaa_translation_memory
                                  │ approved rows feed
                                  ▼
        Global Language Adaptation runtime (fallback + content rendering)
                                  │ gaps logged via log_missing_translation
                                  ▼
                  language_missing_translations ──▶ Founder dashboard
```

## Concrete touch points

1. **Capture** — UI hooks (tutor chat, lesson input, correction buttons) call
   `captureBasaaInput(supabase, …)` from
   `src/agents/african-languages/basaa/index.ts`. That is the only sanctioned
   write path; it lands in the shared, RLS-protected
   `language_student_submissions`.

2. **Review** — the shared `language_review_queue` + `basaa_quality_reviews`
   carry the AI/human review trail. The founder dashboard's "pending vocabulary"
   counts read from these.

3. **Fallback** — when a Basaa string is missing, the runtime
   (`runtime/fallback.ts`) renders the FR→EN fallback, shows
   `"Basaa translation pending. Showing French/English version temporarily."`,
   and calls `log_missing_translation('bas', …)`. Approved Basaa entries remove
   the gap on the next render.

4. **Scoring** — the scanner counts Basaa coverage like any other language;
   approved `basaa_*` rows raise the score, unresolved
   `language_missing_translations` lower it.

## Shared vs. Basaa-specific (no duplication)

- **Shared (language-agnostic):** submissions, review queue, quality scores,
  missing registry, translation memory — used by *every* language.
- **Basaa-specific:** the five `basaa_*` tables hold the linguistic richness
  (pronunciation/IPA, dictionary, parallel sentences) that generic TM rows do
  not capture, because Basaa is being authored from scratch.

## Adding the next African language

Copy `src/agents/african-languages/basaa/` to a new `…/<lang>/`, swap the
language descriptor, and (if needed) add `<lang>_*` tables mirroring the Basaa
set. The shared `language_*` layer needs no change.
