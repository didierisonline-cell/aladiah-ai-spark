# Basaa Learning Memory Engine — Workflow

Basaa has sparse machine translation, so the platform learns Basaa **from its
native-speaker learners**. Every Basaa interaction is a chance to capture
vocabulary — under strict review governance.

## Triggers (when capture fires)

When a Basaa student **types**, **speaks**, submits a **correction**, or
**interacts with the tutor**, the system may capture:

- new Basaa words and phrases,
- pronunciation notes,
- the English **and** French equivalent,
- context: course, lesson, concept, user intent,
- a confidence level.

All capture goes through the single entry point
[`captureBasaaInput()`](../../african-languages/basaa/index.ts).

## The pipeline

```
 Basaa student input
        │ captureBasaaInput()
        ▼
 language_student_submissions   status = 'unreviewed'   (RLS: own rows only)
        │
        ▼ AI triage (dedupe, spam/abuse filter, draft EN/FR gloss, confidence)
 status = 'ai_reviewed'         + row in basaa_quality_reviews(stage='ai_reviewed')
        │
        ▼ Founder / human language reviewer
 status = 'human_reviewed'      + row in basaa_quality_reviews(stage='human_reviewed')
        │
   ┌────┴─────┐
   ▼          ▼
 approved   rejected            verdict recorded in basaa_quality_reviews
   │
   ▼ promote into the official knowledge tables
 basaa_dictionary_entries | basaa_sentence_pairs | basaa_tech_terms | basaa_translation_memory
   (status = 'approved'  ⇒ now student-readable via RLS)
```

## Governance (hard rules — enforced by schema, not convention)

- **Never auto-publish.** Submissions land `unreviewed`. Promotion to an official
  table requires `approved`.
- Every entry carries one of: `unreviewed → ai_reviewed → human_reviewed →
  approved | rejected` (CHECK constraint on every relevant table).
- **Only `approved` entries become official Aladiah vocabulary** and are exposed
  to students (RLS: `USING (status = 'approved')`).
- Students can read their **own** submissions back (transparency) but cannot see
  others' un-approved submissions, and cannot edit any `status`.
- Only founders/admins (`aos_is_admin()`) can move an item to `approved`.

## What "AI-reviewed" does (and does not) do

AI review **drafts** — it dedupes against existing entries, proposes EN/FR
glosses, scores confidence, and flags abuse/PII. It may advance an item to
`ai_reviewed` but **may not** set `approved`. A human always makes the final
call. (`manifest.ts` sets `publish:false`, `human_approval_required:true`.)

## Enrichment targets

On approval, an item is promoted into the matching Basaa table:

| Submission shape | Promoted to |
|---|---|
| single word / headword | `basaa_dictionary_entries` |
| Basaa↔EN/FR sentence | `basaa_sentence_pairs` |
| domain/tech term (Scrum/PM) | `basaa_tech_terms` |
| reusable segment translation | `basaa_translation_memory` |

Approved Basaa knowledge then feeds the fallback resolver and (Phase 2) the
content translation of lessons/quizzes/diagrams for Basaa learners.

## Suggested review SLA

- AI triage: on submit (synchronous or near-real-time).
- Human review: surfaced in the founder dashboard's "pending vocabulary" queue;
  target turnaround set by the founder. The queue is ordered by
  `language_review_queue.priority`.
