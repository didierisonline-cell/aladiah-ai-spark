# Basaa Extension

> Status: **Infrastructure only.** The capture path exists and is documented, but
> `captureBasaaInput` is **not wired into any production UI** (no tutor, lesson,
> or correction flow calls it yet). Wiring is Phase 2, deferred behind launch
> blockers.

## Why Basaa

Basaa (`bas`, ISO 639-3 `bas`; endonym *Ɓasaa*) is a Bantu language (A43) of
Cameroon — Aladiah's North Star **Rule 7** expansion target (Dominican Republic →
**Cameroon** → …). Unlike the platform's 21 existing UI languages, Basaa has
sparse machine-translation coverage, so it cannot be bootstrapped from an MT
vendor. It must be authored from **native-speaker knowledge** — which is exactly
what the Basaa Learning Memory Engine captures, under review governance.

## Location

```
src/agents/african-languages/basaa/
├── README.md
├── index.ts            captureBasaaInput() + BASAA_LANGUAGE descriptor
└── schemas/README.md   pointer to the canonical migration
```

The five Basaa tables ship in the same reviewable migration as the shared
language tables: `supabase/migrations/20260616000000_language_adaptation.sql`.

## Knowledge tables

| Table | Holds |
|---|---|
| `basaa_dictionary_entries` | headword → EN/FR, part of speech, pronunciation (IPA), examples |
| `basaa_sentence_pairs` | Basaa ↔ EN/FR parallel sentences |
| `basaa_tech_terms` | domain vocabulary (Scrum/PM/tech) lacking a native word |
| `basaa_translation_memory` | reusable Basaa segment translations |
| `basaa_quality_reviews` | the AI/human review trail for the four tables above |

## Capture path (safe by construction)

Learner input is **never** written directly into the knowledge tables. It flows
through the shared, student-writable `language_student_submissions` table (RLS:
students may insert only their own rows), then through review:

```
Basaa student types / speaks / corrects / talks to tutor
        │ captureBasaaInput(supabase, input)   ← the ONLY sanctioned write path
        ▼
language_student_submissions   status='unreviewed', language='bas'
        │ AI triage  (dedupe, EN/FR gloss, confidence, abuse/PII flag)
        ▼ status='ai_reviewed'   + basaa_quality_reviews(stage='ai_reviewed')
        │ Founder / human reviewer
        ▼ status='human_reviewed' → approved | rejected
        │ on approve, promote into the matching knowledge table
        ▼
basaa_dictionary_entries | basaa_sentence_pairs | basaa_tech_terms | basaa_translation_memory
  (status='approved' ⇒ now student-readable via RLS)
```

What is captured per submission: the new Basaa word/phrase or correction,
pronunciation notes, English **and** French equivalents, context (course, lesson,
concept, user intent), and a confidence level.

## `captureBasaaInput` contract

```ts
import { captureBasaaInput } from '@/agents/african-languages/basaa';

const { ok } = await captureBasaaInput(supabase, {
  term: 'ƁasaaWord',
  submissionType: 'new_word',     // | phrase | correction | pronunciation | sentence_pair
  englishEquiv: '...',
  frenchEquiv: '...',
  pronunciationNotes: '...',
  confidence: 0.6,
  context: { course: '...', lesson: '...', concept: '...', userIntent: '...' },
});
```

- Always sets `status='unreviewed'`, `language='bas'`.
- Best-effort: returns `{ ok, error? }` rather than throwing, so a (future)
  tutor interaction can never be broken by a capture failure.
- **Not yet called anywhere in production** — intentional, per infrastructure
  mode.

## Governance (hard rules)

- Submissions land `unreviewed`; promotion to a knowledge table requires
  `approved`.
- AI review can reach `ai_reviewed`, never `approved`. Only `aos_is_admin()`
  approves/rejects.
- Only `approved` rows are exposed to students (RLS).
- Students can read their own submissions back (transparency); they cannot see
  others' un-approved submissions and cannot edit any `status`.

## Adding the next African language

Copy `src/agents/african-languages/basaa/` to `…/<lang>/`, swap the descriptor,
and (if needed) add `<lang>_*` tables mirroring the Basaa set. The shared
`language_*` layer requires no change.
