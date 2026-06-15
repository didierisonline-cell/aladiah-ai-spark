# Source — Larry Hyman: Basaá Grammar Chapter

| Field | Value |
|---|---|
| **Title** | Basaá Grammar Chapter (Larry M. Hyman) |
| **Source URL** | https://linguistics.berkeley.edu/~hyman/ (locate the Basaá grammar chapter/PDF) |
| **Author / Institution** | Larry M. Hyman, University of California, Berkeley |
| **Content type** | Academic linguistic grammar (book chapter / PDF) |
| **License / usage notes** | _Placeholder — TO REVIEW._ Academic publication; likely © author/publisher. Use for **structured notes and rules**, not verbatim redistribution, unless rights are confirmed. Cite the author. |
| **Extraction value** | High. Authoritative description of Basaa structure, dialect variation, and tonal behavior. Primary source for `basaa_grammar_notes` and a reference for orthography/tone rules. |
| **Priority level** | **4** |

## Why it matters

This is the linguistic backbone that lets the agent reason about Basaa rather than just
store strings: noun classes, agreement, verb structure, dialect differences, and how tone
interacts with grammar. It validates and explains patterns seen in the dictionary and the
Peace Corps course.

## Processing plan

1. **License first.** Confirm permissible use (notes/rules vs. quotation); record here.
2. **Acquire** the chapter → `datasets/raw/`.
3. **Extract** into structured grammar notes: topic, rule, examples (interlinear if
   available), dialect scope, source citation.
4. **Review & validate** → `datasets/validated/`.
5. **Load** via reviewable SQL into `basaa_grammar_notes`.

## Notes / TODO

- [ ] Confirm exact citation (title, year, volume/editor).
- [ ] Capture noun-class system as a reusable reference for agreement checks.
- [ ] Record dialect coverage so notes can be scoped (`dialect` field in grammar notes).
