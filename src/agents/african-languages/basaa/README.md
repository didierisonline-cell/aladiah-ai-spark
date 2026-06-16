# Basaa Language Agent

> Companion to the [Global Language Adaptation Agent](../../global-language-adaptation/README.md).
> Basaa (`bas`, ISO 639-3 `bas`) is a Bantu language of Cameroon — Aladiah's
> North Star Rule 7 expansion target. This agent owns the Basaa-specific
> knowledge base and the capture path for Basaa learners.

## Why Basaa first

North Star Rule 7 sequences expansion **Dominican Republic → Cameroon → …**.
Cameroon brings Basaa. Unlike the platform's 21 existing UI languages, Basaa has
sparse machine-translation coverage, so it cannot be bootstrapped by an MT
vendor — it must be **built from native-speaker knowledge**. That is exactly
what the Basaa Learning Memory Engine captures.

## What this agent owns

Five Basaa knowledge tables (created by the reviewable migration
`supabase/migrations/20260616000000_language_adaptation.sql`):

| Table | Holds |
|---|---|
| `basaa_dictionary_entries` | headword → EN/FR, part of speech, pronunciation, examples |
| `basaa_sentence_pairs` | Basaa ↔ EN/FR parallel sentences (training/lookup) |
| `basaa_tech_terms` | domain vocabulary (Scrum/PM/tech) lacking a native word |
| `basaa_translation_memory` | reusable Basaa segment translations |
| `basaa_quality_reviews` | the AI/human review trail for the four tables above |

## Capture path (safe by construction)

Basaa learner input is **never written directly** into the tables above.
It flows through the shared, student-writable `language_student_submissions`
table (RLS: students may insert their own rows only), then through review:

```
Basaa student types / speaks / corrects
        │  captureBasaaInput()  (see index.ts)
        ▼
language_student_submissions  (status = 'unreviewed', language = 'bas')
        │  AI triage  → status = 'ai_reviewed'
        │  founder    → status = 'human_reviewed' → approved | rejected
        ▼  on approve, promoted into:
basaa_dictionary_entries / basaa_sentence_pairs / basaa_tech_terms / basaa_translation_memory
        ▼  every decision recorded in:
basaa_quality_reviews
```

**Only `approved` rows become official Basaa vocabulary.** This is enforced by
RLS + CHECK constraints in the migration, not by convention.

## Files

- `index.ts` — `captureBasaaInput()` (the only sanctioned write entry point) and
  the Basaa language descriptor.
- `schemas/` — pointer to the canonical migration (the Basaa tables ship in the
  same reviewable file as the shared `language_*` tables).

See [`../../global-language-adaptation/docs/BASAA_LEARNING_MEMORY.md`](../../global-language-adaptation/docs/BASAA_LEARNING_MEMORY.md)
for the full workflow and review SLAs.
