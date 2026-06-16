# Basaa Learning Memory Workflow

> How Basaa student interaction becomes (reviewed, approved) official Basaa vocabulary and
> enriches the Basaa Agent. Implements responsibilities #3 and #5. **Nothing auto-publishes**
> (see `student-submission-governance.md`).

## Trigger points (capture)

A Basaa learner generates language data when they:
- **type** in Basaa (free input, answers, chat),
- **speak** (voice input / recordings → future VoiceBridge),
- **submit corrections** ("this should be X in Basaa"),
- **interact with the AI tutor** (Professor Didier) in Basaa.

## What we capture (→ `language_student_submissions`, `language: 'bas'`)

| Captured | Field |
|---|---|
| New Basaa word/phrase | `content` |
| Pronunciation notes (tone!) | `pronunciation_note` (+ `audio_url` if spoken) |
| English equivalent | `english_equivalent` |
| French equivalent | `french_equivalent` |
| Context: course, lesson, concept, user intent | `context {course,lesson,concept,user_intent}` |
| Confidence level | `confidence` |
| State | `review_state = 'unreviewed'` (always) |

## Flow

```
Basaa student interaction
        │  capture
        ▼
language_student_submissions (unreviewed)  ──spawn──▶ language_review_queue (ai-review)
        │
        ▼  AI review (language ID, dup, plausibility vs Basaa dictionary; tone sanity)
   ai-reviewed ─────────────────────────────────────▶ language_review_queue (human-review)
        │
        ▼  human (native speaker / founder) review
   approved ────────┬───────────────────────────────▶ language_vocabulary_entries (bas, approved)
        │           │
   rejected         └──enrich──▶ Basaa Agent tables (see integration doc):
                                   • basaa_dictionary_entries     (new word + glosses + tone)
                                   • basaa_sentence_pairs          (phrase ↔ EN/FR)
                                   • basaa_tech_terms              (tech/career coinages)
                                   • basaa_translation_memory      (reusable segment)
                                   • basaa_quality_reviews         (the review decision/audit)
```

## Enrichment mapping (only on `approved`)

| Submission shape | Basaa Agent target | Notes |
|---|---|---|
| Single word + gloss(es) + tone | `basaa_dictionary_entries` | Preserve tone diacritics; set `source_id` = "student-submission"; `review_status: validated`. |
| Aligned phrase/sentence ↔ EN/FR | `basaa_sentence_pairs` | `domain` from `context.concept`; `register` if known. |
| Tech/career term (coinage/loanword) | `basaa_tech_terms` | `approval_status: approved`; record `strategy`. |
| Any approved segment | `basaa_translation_memory` | `origin: human`, `quality: approved`, link source pair. |
| The review decision itself | `basaa_quality_reviews` | `reviewer`, `decision`, before/after, confidence — audit trail. |

> Enrichment writes go through the **same human-applied SQL / reviewed pipeline** as the
> rest of the Basaa Agent — competency-style governance: populated at insert time, never
> backfilled silently. For Basaa, approved tone data is especially valuable for VoiceBridge.

## Orthography normalization

Before promotion, Basaa terms are normalized to the canonical **AGLC** orthography using
the Basaa Agent's `basaa_orthography_rules` (Phase-2 research). Submissions in missionary or
ad-hoc spellings are converted (and the original kept in notes) so the official lexicon stays
internally consistent.

## Privacy

Captured input is student-authored content tied to `user_id` under RLS. Audio and free text
may contain personal data — store under the same access controls, expose only `approved`,
de-identified vocabulary to the platform, and honor deletion requests on raw submissions.
