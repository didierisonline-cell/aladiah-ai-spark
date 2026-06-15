# Source — SIL / Webonary Basaa–English–French–German Dictionary

| Field | Value |
|---|---|
| **Title** | SIL / Webonary Basaa–English–French–German Dictionary |
| **Source URL** | https://www.webonary.org/basaa/ |
| **Author / Institution** | SIL International / Webonary |
| **Content type** | Multilingual dictionary (online, searchable) |
| **License / usage notes** | _Placeholder — TO REVIEW._ Webonary content is typically © the contributing SIL project; terms vary per dictionary. Confirm reuse/redistribution rights and required attribution **before** importing entries. |
| **Extraction value** | Highest. ~15,667–16,000 entries. Core lexical backbone for `basaa_dictionary_entries`. Includes Basaa headwords with French/English (and some German) glosses. |
| **Priority level** | **1 (start here)** |

## Why it matters

This is the strongest single Basaa lexical resource available: broad coverage, multiple
gloss languages, and curated by linguists. It is the primary feed for the dictionary table
and a reference for validating sentence-pair and tech-term translations.

## Processing plan

1. **License first.** Resolve usage rights for entry-level reuse; record outcome here and
   set `licenseStatus` in `basaa-agent-config.ts`. Do not import until `approved`.
2. **Acquire.** Prefer the offline PDF (see `sil-webonary-basaa-pdf-notes.md`) over live
   scraping. No automated scraping of the live site.
3. **Raw.** Land source export in `datasets/raw/` (one file per acquisition batch).
4. **Extract.** Run `prompts/basaa-dictionary-extractor.md` → records conforming to
   `schemas/basaa_dictionary_entry.schema.json` → `datasets/processed/`.
5. **Review.** Run `prompts/basaa-quality-reviewer.md` (tone marks, gloss accuracy, POS,
   orthography normalization) → `datasets/validated/`.
6. **Load.** Generate reviewable SQL for `basaa_dictionary_entries`; human applies in
   Supabase, then verify with a `SELECT`.

## Open questions / TODO

- [ ] Confirm exact entry count and field set exposed by the export.
- [ ] Confirm which gloss languages are present per entry (FR/EN/DE coverage gaps).
- [ ] Capture tone-marking convention used by the dictionary (feeds orthography rules).
