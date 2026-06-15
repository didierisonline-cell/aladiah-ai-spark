# Source — Peace Corps Basaa Language Course

| Field | Value |
|---|---|
| **Title** | Peace Corps Basaa Language Course |
| **Source URL** | https://www.livelingua.com/peace-corps/Basaa/ |
| **Author / Institution** | U.S. Peace Corps (Cameroon) |
| **Content type** | Practical language course (PDF, ~479 pages) |
| **License / usage notes** | _Placeholder — TO REVIEW._ U.S. Peace Corps language materials are commonly in the public domain as U.S. government works, but the hosting/edition may add conditions. Confirm public-domain status and attribution expectations before import. |
| **Extraction value** | Very high. Dialogues, survival phrases, grammar explanations, and health-field vocabulary. Best source for `basaa_sentence_pairs` (aligned EN/FR↔Basaa) and a rich secondary source for `basaa_grammar_notes`. |
| **Priority level** | **3 (start here, alongside the dictionary)** |

## Why it matters

Where the dictionary gives breadth of vocabulary, this course gives **usage in context**:
full sentences, real dialogues, and practical phrasing. That is exactly what sentence-pair
and translation-memory tables need, and it complements the dictionary for the strongest
possible foundation.

## Processing plan

1. **License first.** Confirm public-domain / reuse status; record here; set config.
2. **Acquire PDF** → `datasets/raw/` (keep original).
3. **Segment** into dialogues, phrase lists, grammar sections, and vocab lists.
4. **Extract:**
   - Aligned sentences → `schemas/basaa_sentence_pair.schema.json`.
   - Grammar explanations → grammar notes (structured).
   - Domain vocab (incl. health) → dictionary/tech-term candidates.
5. **Review & validate** → `datasets/validated/`.
6. **Load** via reviewable SQL into `basaa_sentence_pairs` (+ `basaa_grammar_notes`).

## Notes / TODO

- [ ] Identify the source/gloss language of dialogues (EN vs FR) per section.
- [ ] Flag tone marking consistency — course materials may use simplified orthography.
- [ ] Tag health-field vocabulary as a domain for later domain-specific filtering.
