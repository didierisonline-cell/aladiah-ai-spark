# Source — Webonary Downloadable Basaa PDF Dictionary

| Field | Value |
|---|---|
| **Title** | Webonary Downloadable Basaa PDF Dictionary |
| **Source URL** | https://www.webonary.org/basaa/ (look for the downloadable/PDF export) |
| **Author / Institution** | SIL International / Webonary |
| **Content type** | Dictionary, offline PDF (parseable) |
| **License / usage notes** | _Placeholder — TO REVIEW._ Same rights questions as the online dictionary; a downloadable file does not by itself grant redistribution rights. Confirm before parsing into datasets. |
| **Extraction value** | High. Offline, extractable copy of the SIL/Webonary dictionary — enables PDF→JSON parsing without live scraping. The preferred acquisition path for source #1. |
| **Priority level** | **2** (acquisition vehicle for priority 1) |

## Why it matters

A stable, offline artifact is far more reliable to parse than a live site, and avoids any
automated scraping. This is the recommended way to obtain the dictionary content once the
license is approved.

## Processing plan

1. **License first.** Tie to the dictionary license review; do not parse until `approved`.
2. **Acquire PDF** and store original in `datasets/raw/` (keep the untouched original).
3. **Parse** PDF → structured text (preserve tone diacritics and entry boundaries).
4. **Extract** via `prompts/basaa-dictionary-extractor.md` → `basaa_dictionary_entry`
   records → `datasets/processed/`.
5. **Review & validate** → `datasets/validated/`.
6. **Load** via reviewable SQL (human-applied).

## Parsing notes / TODO

- [ ] Confirm the PDF is text-based (not scanned images). If scanned, OCR with diacritic-
      aware settings — Basaa tone marks are easily lost.
- [ ] Define entry-boundary heuristics (headword formatting, POS abbreviations).
- [ ] Cross-check a sample of parsed entries against the live Webonary entries.
