# Student Submission Governance

> Safety rule (responsibility #10): student language submissions are **never auto-published**.
> Only `approved` entries become official Aladiah vocabulary.

## Review state machine

```
unreviewed ──ai──▶ ai-reviewed ──human──▶ human-reviewed ──▶ approved
     │                  │                       │                │
     └──────────────────┴───────────────────────┴────▶ rejected ┘
```

| State | Meaning | Who sets it | Visible to students? |
|---|---|---|---|
| `unreviewed` | Just captured. Default for every submission. | System (on capture) | No |
| `ai-reviewed` | Passed automated screening (language ID, profanity, duplicate, plausibility). | AI reviewer | No |
| `human-reviewed` | A human (native speaker / founder) has assessed it. | Human reviewer | No |
| `approved` | Correct and official. Promoted to `language_vocabulary_entries` (and Basaa Agent tables for `bas`). | Human reviewer | **Yes** |
| `rejected` | Incorrect/inappropriate/duplicate. Retained for audit; never served. | AI or human | No |

## Hard rules

1. **Default deny.** Capture always lands at `unreviewed`. No code path serves a submission
   below `approved`.
2. **Two-key minimum for going live.** AI screening alone cannot approve — a human must
   confirm before `approved` (AI may auto-`reject` obvious spam/abuse).
3. **Promotion is explicit.** Only on `approved` is a row copied into
   `language_vocabulary_entries`; `promoted_to_vocabulary_id` is then set on the submission.
4. **Auditability.** `rejected` rows are kept (not deleted) with `*_review_notes` so
   decisions are traceable.
5. **RLS-enforced.** A student can read only their own submissions; serving layers query
   `language_vocabulary_entries` where `review_state = 'approved'` (see migration plan RLS).

## Pipeline mechanics

- Each submission spawns a `language_review_queue` item (`stage: 'ai-review'`).
- AI review → set submission `ai-reviewed` (or `rejected`); requeue `stage: 'human-review'`.
- Human review → `approved` (promote) or `rejected`. Queue item `resolved_at` set.
- Escalations (ambiguous, dialectal dispute) → queue `status: 'escalated'` for founder.

## AI reviewer checks (minimum)

- Language identification (is it actually the target language?).
- Profanity / abuse / PII screening.
- Duplicate detection against `language_vocabulary_entries` + pending submissions.
- Plausibility vs. translation memory and (for Basaa) the Basaa dictionary.
- Confidence score recorded; low confidence → force human review, never auto-approve.
